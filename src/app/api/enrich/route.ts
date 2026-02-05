import { NextRequest, NextResponse } from 'next/server';
import Exa from 'exa-js';

// Lazy initialization to avoid build-time errors
let exa: Exa | null = null;
function getExaClient() {
  if (!exa) {
    if (!process.env.EXA_API_KEY) {
      throw new Error('EXA_API_KEY environment variable is required');
    }
    exa = new Exa(process.env.EXA_API_KEY);
  }
  return exa;
}

// Enrichment result type from Exa SDK
interface EnrichmentResult {
  enrichmentId: string;
  result: string[] | null;
  reasoning: string | null;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { domain } = body;

    if (!domain) {
      return NextResponse.json(
        { success: false, error: 'Domain is required' },
        { status: 400 }
      );
    }

    // Clean the domain
    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

    const exaClient = getExaClient();

    // Create a Webset with enrichments for company data
    // Using 'as any' to work around strict SDK types for enrichment formats
    const webset = await exaClient.websets.create({
      search: {
        query: `company website ${cleanDomain}`,
        count: 1,
        entity: {
          type: 'company',
        },
      },
      enrichments: [
        // Financial Data
        { description: 'Annual revenue or ARR if available', format: 'text' as const },
        { description: 'Total funding raised', format: 'text' as const },
        { description: 'Most recent funding round (e.g., Series A, Series B)', format: 'text' as const },
        { description: 'Date of most recent funding round', format: 'text' as const },
        { description: 'Number of employees', format: 'text' as const },
        { description: 'Year over year employee growth percentage', format: 'text' as const },
        // Product Data
        { description: 'Main products or services offered (list up to 5)', format: 'text' as const },
        { description: 'Product categories or industries served', format: 'text' as const },
        { description: 'Pricing model (e.g., freemium, subscription, usage-based)', format: 'text' as const },
        // LinkedIn Data
        { description: 'Company LinkedIn URL', format: 'text' as const },
        { description: 'LinkedIn follower count', format: 'text' as const },
        { description: 'Recent company news or announcements', format: 'text' as const },
      ],
    } as Parameters<Exa['websets']['create']>[0]);

    // Wait for the Webset to complete processing
    const completedWebset = await exaClient.websets.waitUntilIdle(webset.id, {
      timeout: 120000, // 2 minutes max
      pollInterval: 3000, // Check every 3 seconds
    });

    // Get the items from the Webset
    const items = await exaClient.websets.items.list(completedWebset.id);

    if (!items.data || items.data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No company data found for this domain' },
        { status: 404 }
      );
    }

    const item = items.data[0];
    const enrichments = (item.enrichments || []) as EnrichmentResult[];

    // Helper to get enrichment value by enrichment ID pattern
    const getEnrichmentByIndex = (index: number): string | null => {
      const enrichment = enrichments[index];
      if (!enrichment) return null;
      const result = enrichment.result;
      return result && result.length > 0 ? result[0] : null;
    };

    // Get properties with proper type handling
    const properties = item.properties as {
      type?: string;
      url?: string;
      description?: string;
      company?: {
        name?: string;
        about?: string;
        logoUrl?: string;
        location?: string;
        employees?: number;
        industry?: string;
      };
    };

    // Transform the data into our structured format
    const companyData = {
      domain: cleanDomain,
      name: properties.company?.name || cleanDomain,
      description: properties.company?.about || properties.description || '',
      logoUrl: properties.company?.logoUrl || null,
      financial: {
        revenue: getEnrichmentByIndex(0), // Annual revenue
        revenueGrowth: null,
        fundingTotal: getEnrichmentByIndex(1), // Total funding
        lastFundingRound: getEnrichmentByIndex(2), // Recent funding round
        lastFundingDate: getEnrichmentByIndex(3), // Funding date
        employees: getEnrichmentByIndex(4), // Employee count
        employeeGrowth: getEnrichmentByIndex(5), // Employee growth
        annualReportUrl: null,
      },
      products: {
        mainProducts: getEnrichmentByIndex(6)?.split(',').map((p: string) => p.trim()) || [],
        productCategories: getEnrichmentByIndex(7)?.split(',').map((c: string) => c.trim()) || [],
        recentLaunches: [] as string[],
        pricingModel: getEnrichmentByIndex(8),
      },
      linkedin: {
        companyUrl: getEnrichmentByIndex(9), // LinkedIn URL
        followerCount: getEnrichmentByIndex(10), // Follower count
        recentPosts: [] as { title: string; engagement: string; date: string }[],
        employeeInsights: getEnrichmentByIndex(11), // Recent news
      },
      metadata: {
        enrichedAt: new Date().toISOString(),
        source: 'Exa Websets',
        websetId: completedWebset.id,
      },
    };

    const processingTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: companyData,
      processingTime,
    });

  } catch (error) {
    console.error('Enrichment error:', error);

    const processingTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        processingTime,
      },
      { status: 500 }
    );
  }
}
