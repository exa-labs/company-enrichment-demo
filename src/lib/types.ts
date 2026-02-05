// Types for Exa Websets enrichment data

export interface CompanyEnrichment {
  domain: string;
  name: string;
  description: string;
  logoUrl?: string;
  financial: FinancialData;
  products: ProductData;
  linkedin: LinkedInData;
  metadata: {
    enrichedAt: string;
    source: string;
    websetId?: string;
  };
}

export interface FinancialData {
  revenue?: string;
  revenueGrowth?: string;
  fundingTotal?: string;
  lastFundingRound?: string;
  lastFundingDate?: string;
  employees?: string;
  employeeGrowth?: string;
  annualReportUrl?: string;
}

export interface ProductData {
  mainProducts: string[];
  productCategories: string[];
  recentLaunches?: string[];
  pricingModel?: string;
}

export interface LinkedInData {
  companyUrl?: string;
  followerCount?: string;
  recentPosts: LinkedInPost[];
  employeeInsights?: string;
}

export interface LinkedInPost {
  title: string;
  engagement: string;
  date: string;
}

export interface EnrichmentRequest {
  domain: string;
}

export interface EnrichmentResponse {
  success: boolean;
  data?: CompanyEnrichment;
  error?: string;
  processingTime?: number;
}

// CRM Integration types
export interface CRMRecord {
  id: string;
  type: 'company' | 'contact' | 'lead';
  fields: Record<string, string | number | boolean | null>;
  enrichments: Record<string, string | number | boolean | null>;
  lastUpdated: string;
}

export interface CRMPushPayload {
  recordId: string;
  recordType: string;
  enrichmentData: Partial<CompanyEnrichment>;
  apiEndpoint: string;
}
