import { NextRequest, NextResponse } from 'next/server';
import Exa from 'exa-js';

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

const companyOutputSchema = {
  type: 'object' as const,
  properties: {
    industry: {
      type: 'string',
      description: 'Primary industry or sector (e.g., "Financial Services", "Developer Tools")',
    },
    annualRevenue: {
      type: 'string',
      description: 'Estimated annual revenue or ARR (e.g., "$50M ARR", "$1.2B")',
    },
    employeeCount: {
      type: 'string',
      description: 'Approximate number of employees (e.g., "8,000", "~500")',
    },
    ownership: {
      type: 'string',
      description: 'Ownership status: Private, Public, or Subsidiary',
    },
    latestFunding: {
      type: 'string',
      description: 'Most recent funding round and amount (e.g., "Series C - $150M")',
    },
    description: {
      type: 'string',
      description: 'Brief company description in 1-2 sentences',
    },
    recentNews: {
      type: 'string',
      description: 'Most notable recent news, product launch, or announcement',
    },
  },
  required: ['industry', 'description'],
};

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { company } = body;

    if (!company || typeof company !== 'string' || company.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Company name or domain is required' },
        { status: 400 }
      );
    }

    const query = company.trim();
    const exaClient = getExaClient();

    const result = await exaClient.search(
      `Company profile and information for ${query}`,
      {
        type: 'deep',
        numResults: 5,
        category: 'company',
        outputSchema: companyOutputSchema,
        contents: {
          maxAgeHours: 24,
        },
      }
    );

    const output = result.output;

    if (!output) {
      return NextResponse.json(
        { success: false, error: 'No enrichment data returned for this company' },
        { status: 404 }
      );
    }

    // content is a JSON string when outputSchema is object type
    let enrichment: Record<string, string | null>;
    if (typeof output.content === 'string') {
      try {
        enrichment = JSON.parse(output.content);
      } catch {
        enrichment = { description: output.content } as Record<string, string | null>;
      }
    } else {
      enrichment = output.content as Record<string, string | null>;
    }

    const processingTime = Date.now() - startTime;

    const sources = (output.grounding ?? []).flatMap(
      (g) => g.citations.map((c) => c.url)
    );

    return NextResponse.json({
      success: true,
      data: {
        query,
        industry: enrichment.industry ?? null,
        annualRevenue: enrichment.annualRevenue ?? null,
        employeeCount: enrichment.employeeCount ?? null,
        ownership: enrichment.ownership ?? null,
        latestFunding: enrichment.latestFunding ?? null,
        description: enrichment.description ?? null,
        recentNews: enrichment.recentNews ?? null,
        sources,
      },
      processingTime,
    });
  } catch (error) {
    console.error('Enrichment error:', error);
    const processingTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      { success: false, error: errorMessage, processingTime },
      { status: 500 }
    );
  }
}
