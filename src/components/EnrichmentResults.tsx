'use client';

import { CompanyEnrichment } from '@/lib/types';
import { Card, CardHeader, DataField } from './Card';
import { Tag } from './Tag';
import {
  DollarSign,
  TrendingUp,
  Users,
  Package,
  Linkedin,
  Building2,
  ExternalLink,
  Calendar,
  Layers,
} from 'lucide-react';

interface EnrichmentResultsProps {
  data: CompanyEnrichment;
}

export function EnrichmentResults({ data }: EnrichmentResultsProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Company Header */}
      <div className="flex items-start gap-4 pb-6 border-b border-[#e5e5e5]">
        {data.logoUrl ? (
          <img
            src={data.logoUrl}
            alt={data.name}
            className="w-16 h-16 rounded-xl object-contain bg-[#f9f7f7] p-2"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-[#f9f7f7] flex items-center justify-center">
            <Building2 className="w-8 h-8 text-[#60646c]" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-arizona text-2xl text-[#000911]">{data.name}</h2>
            <Tag variant="blue" size="sm">Enriched</Tag>
          </div>
          <a
            href={`https://${data.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0040f0] hover:underline flex items-center gap-1 text-sm"
          >
            {data.domain}
            <ExternalLink size={12} />
          </a>
          {data.description && (
            <p className="mt-2 text-sm text-[#60646c] line-clamp-2">{data.description}</p>
          )}
        </div>
      </div>

      {/* Enrichment Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Data Card */}
        <Card variant="default" padding="md">
          <CardHeader
            title="Financial Data"
            subtitle="From annual reports & news"
            icon={<DollarSign className="w-5 h-5 text-[#0040f0]" />}
          />
          <div className="space-y-1">
            <DataField label="Revenue" value={data.financial.revenue} />
            <DataField label="Total Funding" value={data.financial.fundingTotal} />
            <DataField label="Last Round" value={data.financial.lastFundingRound} />
            <DataField label="Round Date" value={data.financial.lastFundingDate} />
            <div className="pt-2 border-t border-[#e5e5e5] mt-3">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-[#60646c]" />
                <DataField label="Employees" value={data.financial.employees} className="py-0" />
              </div>
              {data.financial.employeeGrowth && (
                <div className="flex items-center gap-2 mt-1">
                  <TrendingUp size={14} className="text-green-600" />
                  <span className="text-sm text-green-600">{data.financial.employeeGrowth} YoY</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Products Card */}
        <Card variant="default" padding="md">
          <CardHeader
            title="Product Offerings"
            subtitle="Products & services"
            icon={<Package className="w-5 h-5 text-[#0040f0]" />}
          />
          <div className="space-y-3">
            {data.products.mainProducts.length > 0 ? (
              <div>
                <p className="text-xs uppercase tracking-wider text-[#60646c] mb-2">Main Products</p>
                <div className="flex flex-wrap gap-2">
                  {data.products.mainProducts.slice(0, 5).map((product, i) => (
                    <Tag key={i} variant="default" size="sm">{product}</Tag>
                  ))}
                </div>
              </div>
            ) : (
              <DataField label="Products" value="No data available" />
            )}

            {data.products.productCategories.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wider text-[#60646c] mb-2">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {data.products.productCategories.slice(0, 4).map((category, i) => (
                    <Tag key={i} variant="blue" size="sm">{category}</Tag>
                  ))}
                </div>
              </div>
            )}

            {data.products.pricingModel && (
              <div className="pt-2 border-t border-[#e5e5e5]">
                <div className="flex items-center gap-2">
                  <Layers size={14} className="text-[#60646c]" />
                  <DataField label="Pricing Model" value={data.products.pricingModel} className="py-0" />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* LinkedIn Card */}
        <Card variant="default" padding="md">
          <CardHeader
            title="LinkedIn Activity"
            subtitle="Company presence"
            icon={<Linkedin className="w-5 h-5 text-[#0040f0]" />}
          />
          <div className="space-y-3">
            {data.linkedin.companyUrl && (
              <a
                href={data.linkedin.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#0040f0] hover:underline text-sm"
              >
                View LinkedIn Profile
                <ExternalLink size={12} />
              </a>
            )}

            <DataField label="Followers" value={data.linkedin.followerCount} />

            {data.linkedin.employeeInsights && (
              <div>
                <p className="text-xs uppercase tracking-wider text-[#60646c] mb-2">Recent News</p>
                <p className="text-sm text-[#000911] line-clamp-3">{data.linkedin.employeeInsights}</p>
              </div>
            )}

            {data.linkedin.recentPosts.length > 0 && (
              <div className="pt-2 border-t border-[#e5e5e5]">
                <p className="text-xs uppercase tracking-wider text-[#60646c] mb-2">Recent Posts</p>
                {data.linkedin.recentPosts.map((post, i) => (
                  <div key={i} className="py-2 border-b border-[#e5e5e5] last:border-0">
                    <p className="text-sm text-[#000911] font-medium">{post.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[#60646c]">
                      <span>{post.engagement}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Metadata Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#e5e5e5] text-xs text-[#60646c]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            Enriched: {new Date(data.metadata.enrichedAt).toLocaleString()}
          </span>
          <span>Source: {data.metadata.source}</span>
        </div>
        {data.metadata.websetId && (
          <span className="font-mono text-[10px] bg-[#f9f7f7] px-2 py-1 rounded">
            ID: {data.metadata.websetId}
          </span>
        )}
      </div>
    </div>
  );
}
