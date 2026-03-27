'use client';

import { LiveEnrichmentTable } from '@/components/LiveEnrichmentTable';
import { PageHeader } from '@/components/PageHeader';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

function HowItWorksButton() {
  return (
    <Link href="/">
      <button className="flex items-center gap-2 rounded-lg border border-[#e5e5e5] bg-white px-4 py-2 text-sm font-medium text-black hover:bg-[#f9f7f7] hover:border-[rgba(9,114,213,0.32)] transition-all">
        <span>How It Works</span>
        <ArrowRight size={16} />
      </button>
    </Link>
  );
}

export default function Visualization() {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title="Enrich Company Data with Exa Deep"
        subtitle="Enter company names to enrich company data from the web using Exa deep search with structured outputs"
        rightContent={<HowItWorksButton />}
      />

      <main className="py-4">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <LiveEnrichmentTable />

        </div>
      </main>
    </div>
  );
}
