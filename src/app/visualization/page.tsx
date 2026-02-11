'use client';

import { CRMAnimation } from '@/components/CRMAnimation';
import { PageHeader } from '@/components/PageHeader';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

function TutorialButton() {
  return (
    <Link href="/">
      <button className="flex items-center gap-2 rounded-lg border border-[#e5e5e5] bg-white px-4 py-2 text-sm font-medium text-black hover:bg-[#f9f7f7] hover:border-[rgba(9,114,213,0.32)] transition-all">
        <span>Tutorial</span>
        <ArrowRight size={16} />
      </button>
    </Link>
  );
}

export default function Visualization() {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title="Enrich your Data with Exa"
        subtitle="Use the Exa Answer API to enrich your CRM or database with structured company data."
        rightContent={<TutorialButton />}
      />

      <main className="py-4">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="text-center mb-10">
            <p className="text-black/60 text-[17px]">
              Exa has the best company and people search in the world. Keep your CRM or database fresh with scheduled enrichment updates.
            </p>
          </div>

          <CRMAnimation />

          <div className="mt-12 text-center">
            <p className="text-black/60 text-[14px]">
              Powered by Exa Answer — search + structured extraction in a single API call
            </p>
          </div>

          <div className="mt-16 max-w-2xl mx-auto">
            <h2 className="font-arizona text-2xl tracking-tight text-black mb-6">
              Why use Exa for enrichments?
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-black font-medium text-[15px]">1. Superior Search</p>
                <p className="text-black/60 text-[14px] mt-1">
                  Faster, more relevant, and more comprehensive than alternatives
                </p>
              </div>
              <div>
                <p className="text-black font-medium text-[15px]">2. Find, don't buy</p>
                <p className="text-black/60 text-[14px] mt-1">
                  3rd party enrichment services rely on purchasing stale data. Search across the web in real time instead.
                </p>
              </div>
              <div>
                <p className="text-black font-medium text-[15px]">3. Configurable</p>
                <p className="text-black/60 text-[14px] mt-1">
                  Exa's model parameters can dynamically be adjusted for any use case
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
