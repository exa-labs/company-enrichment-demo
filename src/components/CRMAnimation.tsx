'use client';

import { useState, useEffect } from 'react';
import { Building2, Check } from 'lucide-react';

// Official Exa logo component for inline use
function ExaLogoSmall({ className = '' }: { className?: string }) {
  return (
    <svg
      width="12"
      height="14"
      viewBox="0 0 26 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.63623 0H25.6544V2.38806L14.9775 16L25.6544 29.6119V32H0.63623V0ZM13.3026 13.7975L21.9788 2.38806H4.62646L13.3026 13.7975ZM3.45099 5.24727V14.806H10.7198L3.45099 5.24727ZM10.7198 17.194H3.45099V26.7527L10.7198 17.194ZM4.62646 29.6119L13.3026 18.2025L21.9788 29.6119H4.62646Z"
        fill="currentColor"
      />
    </svg>
  );
}

// CRM Account data structure with before/after states
interface AccountRecord {
  id: string;
  name: string;
  website: string;
  // Fields that get enriched
  industry: string | null;
  annualRevenue: string | null;
  employees: string | null;
  ownership: string | null;
  recentNews: string | null;
  // Enriched values (initial)
  enrichedIndustry: string;
  enrichedRevenue: string;
  enrichedEmployees: string;
  enrichedOwnership: string;
  enrichedRecentNews: string;
  // Updated values (for update sequences)
  updatedRevenue?: string;
  updatedEmployees?: string;
  updatedOwnership?: string;
  updatedRecentNews?: string;
  // Second update values
  updated2Revenue?: string;
  updated2Employees?: string;
  updated2RecentNews?: string;
}

const mockAccounts: AccountRecord[] = [
  {
    id: '001',
    name: 'Stripe, Inc.',
    website: 'stripe.com',
    industry: null,
    annualRevenue: null,
    employees: null,
    ownership: null,
    recentNews: null,
    enrichedIndustry: 'Financial Services',
    enrichedRevenue: '$14.3B',
    enrichedEmployees: '8,000',
    enrichedOwnership: 'Private',
    enrichedRecentNews: 'Launched Stripe Billing 2.0',
    // Update 1: New fundraise announced
    updatedRevenue: '$21B valuation',
    updatedRecentNews: 'Raised $6.5B Series I',
    // Update 2
    updated2RecentNews: 'Expanding to 15 new markets',
  },
  {
    id: '002',
    name: 'Notion Labs, Inc.',
    website: 'notion.so',
    industry: null,
    annualRevenue: null,
    employees: null,
    ownership: null,
    recentNews: null,
    enrichedIndustry: 'Computer Software',
    enrichedRevenue: '$343M ARR',
    enrichedEmployees: '500',
    enrichedOwnership: 'Private',
    enrichedRecentNews: 'Released Notion Calendar app',
    // Update 1: Product launch
    updatedRevenue: '$410M ARR',
    updatedRecentNews: 'Launched Notion AI enterprise',
  },
  {
    id: '003',
    name: 'Linear',
    website: 'linear.app',
    industry: null,
    annualRevenue: null,
    employees: null,
    ownership: null,
    recentNews: null,
    enrichedIndustry: 'Computer Software',
    enrichedRevenue: '$28M ARR',
    enrichedEmployees: '80',
    enrichedOwnership: 'Private',
    enrichedRecentNews: 'Launched Linear Asks AI feature',
    // Update 2: Series C announced
    updated2Revenue: '$75M ARR',
    updated2RecentNews: 'Raised Series C $50M',
  },
  {
    id: '004',
    name: 'Figma, Inc.',
    website: 'figma.com',
    industry: null,
    annualRevenue: null,
    employees: null,
    ownership: null,
    recentNews: null,
    enrichedIndustry: 'Design Software',
    enrichedRevenue: '$600M ARR',
    enrichedEmployees: '1,400',
    enrichedOwnership: 'Subsidiary (Adobe)',
    enrichedRecentNews: 'Announced Figma Slides beta',
    // Update 1: Leadership change
    updatedEmployees: '1,550',
    updatedRecentNews: 'New CPO appointed',
  },
];

// Which rows get updated in each update sequence
const UPDATE_1_ROWS = [0, 1, 3]; // Stripe, Notion, Figma
const UPDATE_2_ROWS = [0, 2]; // Stripe, Linear

type AnimationPhase = 'before' | 'enriching' | 'after' | 'pause' | 'update1' | 'pause2' | 'update2' | 'pause3';

export function CRMAnimation() {
  const [phase, setPhase] = useState<AnimationPhase>('before');
  const [enrichingIndex, setEnrichingIndex] = useState(-1);
  const [enrichedRows, setEnrichedRows] = useState<Set<number>>(new Set());
  const [updatingRows, setUpdatingRows] = useState<Set<number>>(new Set());
  const [update1Complete, setUpdate1Complete] = useState<Set<number>>(new Set());
  const [update2Complete, setUpdate2Complete] = useState<Set<number>>(new Set());

  useEffect(() => {
    const runAnimation = async () => {
      // Reset state
      setPhase('before');
      setEnrichingIndex(-1);
      setEnrichedRows(new Set());
      setUpdatingRows(new Set());
      setUpdate1Complete(new Set());
      setUpdate2Complete(new Set());

      // Show "before" state for 2 seconds
      await delay(2000);

      // Start enriching
      setPhase('enriching');

      // Enrich each row one by one
      for (let i = 0; i < mockAccounts.length; i++) {
        setEnrichingIndex(i);
        await delay(1200); // Time for each row to "load"
        setEnrichedRows((prev) => new Set([...prev, i]));
      }

      setEnrichingIndex(-1);

      // Show "after" state for 3 seconds
      setPhase('after');
      await delay(3000);

      // ========== UPDATE SEQUENCE 1 ==========
      setPhase('update1');

      // Show all update rows as updating simultaneously, then complete one by one
      setUpdatingRows(new Set(UPDATE_1_ROWS));
      await delay(800);

      // Complete updates one by one
      for (const rowIndex of UPDATE_1_ROWS) {
        await delay(600);
        setUpdatingRows((prev) => {
          const next = new Set(prev);
          next.delete(rowIndex);
          return next;
        });
        setUpdate1Complete((prev) => new Set([...prev, rowIndex]));
      }

      // Pause after update 1
      setPhase('pause2');
      await delay(3000);

      // ========== UPDATE SEQUENCE 2 ==========
      setPhase('update2');

      // Show update rows as updating
      setUpdatingRows(new Set(UPDATE_2_ROWS));
      await delay(800);

      // Complete updates one by one
      for (const rowIndex of UPDATE_2_ROWS) {
        await delay(600);
        setUpdatingRows((prev) => {
          const next = new Set(prev);
          next.delete(rowIndex);
          return next;
        });
        setUpdate2Complete((prev) => new Set([...prev, rowIndex]));
      }

      // Final pause before restart
      setPhase('pause3');
      await delay(3000);

      // Restart animation
      runAnimation();
    };

    runAnimation();
  }, []);

  const isRowEnriched = (index: number) => enrichedRows.has(index);
  const isRowEnriching = (index: number) => enrichingIndex === index;
  const isRowUpdating = (index: number) => updatingRows.has(index);
  const hasUpdate1 = (index: number) => update1Complete.has(index);
  const hasUpdate2 = (index: number) => update2Complete.has(index);

  // Get the current value for a field based on update state
  const getCurrentValue = (
    index: number,
    field: 'revenue' | 'employees' | 'ownership' | 'recentNews'
  ): string | null => {
    const account = mockAccounts[index];
    if (!isRowEnriched(index)) return null;

    if (field === 'revenue') {
      if (hasUpdate2(index) && account.updated2Revenue) return account.updated2Revenue;
      if (hasUpdate1(index) && account.updatedRevenue) return account.updatedRevenue;
      return account.enrichedRevenue;
    }
    if (field === 'employees') {
      if (hasUpdate2(index) && account.updated2Employees) return account.updated2Employees;
      if (hasUpdate1(index) && account.updatedEmployees) return account.updatedEmployees;
      return account.enrichedEmployees;
    }
    if (field === 'ownership') {
      if (hasUpdate1(index) && account.updatedOwnership) return account.updatedOwnership;
      return account.enrichedOwnership;
    }
    if (field === 'recentNews') {
      if (hasUpdate2(index) && account.updated2RecentNews) return account.updated2RecentNews;
      if (hasUpdate1(index) && account.updatedRecentNews) return account.updatedRecentNews;
      return account.enrichedRecentNews;
    }
    return null;
  };

  return (
    <div className="w-full">
      {/* CRM-style header bar */}
      <div className="bg-[#032d60] rounded-t-lg px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-white" />
            <span className="text-white font-medium text-[15px]">Accounts</span>
          </div>
          <span className="text-white/60 text-[13px]">|</span>
          <span className="text-white/80 text-[13px]">List View</span>
        </div>
        <div className="flex items-center gap-2">
          {phase === 'enriching' && (
            <div className="flex items-center gap-2 bg-[#0040f0]/90 rounded px-3 py-1.5">
              <ExaLogoSmall className="text-white" />
              <span className="text-white text-[12px]">Exa Enrichment Running...</span>
            </div>
          )}
          {(phase === 'after' || phase === 'pause2' || phase === 'pause3') && (
            <div className="flex items-center gap-2 bg-[#2e844a]/80 rounded px-3 py-1.5">
              <Check className="w-4 h-4 text-white" />
              <span className="text-white text-[12px]">
                {phase === 'after' ? 'Enrichment Complete' : 'Updates Applied'}
              </span>
            </div>
          )}
          {(phase === 'update1' || phase === 'update2') && (
            <div className="flex items-center gap-2 bg-[#0040f0]/90 rounded px-3 py-1.5">
              <ExaLogoSmall className="text-white" />
              <span className="text-white text-[12px]">Monitor Checking for Updates...</span>
            </div>
          )}
        </div>
      </div>

      {/* CRM-style data table */}
      <div className="border border-[#c9c9c9] border-t-0 rounded-b-lg overflow-hidden bg-white overflow-x-auto">
        {/* Table header */}
        <div className="bg-[#f3f3f3] border-b border-[#c9c9c9] min-w-[900px]">
          <div className="grid grid-cols-[minmax(130px,1fr)_minmax(100px,1fr)_minmax(110px,1fr)_minmax(100px,1fr)_minmax(80px,1fr)_minmax(110px,1fr)_minmax(180px,1fr)] text-[12px] font-medium text-[#181818] uppercase tracking-wide">
            <div className="px-3 py-3 border-r border-[#c9c9c9]">Account Name</div>
            <div className="px-3 py-3 border-r border-[#c9c9c9]">Website</div>
            <div className="px-3 py-3 border-r border-[#c9c9c9]">Industry</div>
            <div className="px-3 py-3 border-r border-[#c9c9c9]">Revenue</div>
            <div className="px-3 py-3 border-r border-[#c9c9c9]">Employees</div>
            <div className="px-3 py-3 border-r border-[#c9c9c9]">Ownership</div>
            <div className="px-3 py-3">Recent News</div>
          </div>
        </div>

        {/* Table rows */}
        <div className="min-w-[900px]">
          {mockAccounts.map((account, index) => {
            const enriched = isRowEnriched(index);
            const enriching = isRowEnriching(index);
            const updating = isRowUpdating(index);

            return (
              <div
                key={account.id}
                className={`grid grid-cols-[minmax(130px,1fr)_minmax(100px,1fr)_minmax(110px,1fr)_minmax(100px,1fr)_minmax(80px,1fr)_minmax(110px,1fr)_minmax(180px,1fr)] border-b border-[#e5e5e5] last:border-b-0 transition-colors duration-300 ${
                  enriching ? 'bg-[#f0f7ff]' : updating ? 'bg-[#fff8e6]' : 'bg-white'
                }`}
              >
                {/* Account Name - always visible */}
                <div className="px-3 py-3 border-r border-[#e5e5e5]">
                  <a href="#" className="text-[#0176d3] text-[13px] hover:underline font-medium truncate block">
                    {account.name}
                  </a>
                </div>

                {/* Website - always visible */}
                <div className="px-3 py-3 border-r border-[#e5e5e5]">
                  <span className="text-[#181818] text-[13px]">{account.website}</span>
                </div>

                {/* Industry - doesn't update after initial enrichment */}
                <div className="px-3 py-3 border-r border-[#e5e5e5]">
                  <CellValue
                    value={enriched ? account.enrichedIndustry : account.industry}
                    isEnriching={enriching}
                    isUpdating={false}
                    isEnriched={enriched}
                  />
                </div>

                {/* Revenue - can update */}
                <div className="px-3 py-3 border-r border-[#e5e5e5]">
                  <CellValue
                    value={getCurrentValue(index, 'revenue')}
                    isEnriching={enriching}
                    isUpdating={updating && (account.updatedRevenue || account.updated2Revenue) !== undefined}
                    isEnriched={enriched}
                  />
                </div>

                {/* Employees - can update */}
                <div className="px-3 py-3 border-r border-[#e5e5e5]">
                  <CellValue
                    value={getCurrentValue(index, 'employees')}
                    isEnriching={enriching}
                    isUpdating={updating && (account.updatedEmployees || account.updated2Employees) !== undefined}
                    isEnriched={enriched}
                  />
                </div>

                {/* Ownership - can update */}
                <div className="px-3 py-3 border-r border-[#e5e5e5]">
                  <CellValue
                    value={getCurrentValue(index, 'ownership')}
                    isEnriching={enriching}
                    isUpdating={updating && account.updatedOwnership !== undefined}
                    isEnriched={enriched}
                  />
                </div>

                {/* LinkedIn Activity - can update */}
                <div className="px-3 py-3">
                  <CellValue
                    value={getCurrentValue(index, 'recentNews')}
                    isEnriching={enriching}
                    isUpdating={updating && (account.updatedRecentNews || account.updated2RecentNews) !== undefined}
                    isEnriched={enriched}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Animation status indicator */}
      <div className="mt-4 flex items-center justify-center gap-2 text-[13px] text-[#706e6b]">
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${phase === 'before' ? 'bg-[#706e6b]' : 'bg-[#c9c9c9]'}`} />
          <span className={phase === 'before' ? 'text-[#181818]' : ''}>Before</span>
        </div>
        <span className="text-[#c9c9c9]">→</span>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${phase === 'enriching' ? 'bg-[#0176d3] animate-pulse' : 'bg-[#c9c9c9]'}`} />
          <span className={phase === 'enriching' ? 'text-[#0176d3]' : ''}>Enriching</span>
        </div>
        <span className="text-[#c9c9c9]">→</span>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${phase === 'after' ? 'bg-[#2e844a]' : 'bg-[#c9c9c9]'}`} />
          <span className={phase === 'after' ? 'text-[#2e844a]' : ''}>Complete</span>
        </div>
        <span className="text-[#c9c9c9]">→</span>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${(phase === 'update1' || phase === 'pause2') ? 'bg-[#0040f0]' : 'bg-[#c9c9c9]'} ${phase === 'update1' ? 'animate-pulse' : ''}`} />
          <span className={(phase === 'update1' || phase === 'pause2') ? 'text-[#0040f0]' : ''}>Update 1</span>
        </div>
        <span className="text-[#c9c9c9]">→</span>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${(phase === 'update2' || phase === 'pause3') ? 'bg-[#0040f0]' : 'bg-[#c9c9c9]'} ${phase === 'update2' ? 'animate-pulse' : ''}`} />
          <span className={(phase === 'update2' || phase === 'pause3') ? 'text-[#0040f0]' : ''}>Update 2</span>
        </div>
      </div>
    </div>
  );
}

// Cell value component with loading and transition states
function CellValue({
  value,
  isEnriching,
  isUpdating = false,
  isEnriched,
}: {
  value: string | null;
  isEnriching: boolean;
  isUpdating?: boolean;
  isEnriched: boolean;
}) {
  // Initial enrichment state - shows "Enriching" with Exa logo
  if (isEnriching) {
    return (
      <div className="flex items-center gap-1.5">
        <ExaLogoSmall className="text-[#0040f0] animate-pulse" />
        <span className="text-[#0040f0] text-[12px]">Enriching</span>
      </div>
    );
  }

  // Update state - shows "Update found" with Exa logo
  if (isUpdating) {
    return (
      <div className="flex items-center gap-1.5">
        <ExaLogoSmall className="text-[#0040f0] animate-pulse" />
        <span className="text-[#0040f0] text-[12px]">Update found</span>
      </div>
    );
  }

  if (value === null) {
    return <span className="text-[#706e6b] text-[13px]">—</span>;
  }

  return (
    <span
      className={`text-[13px] transition-all duration-500 ${
        isEnriched ? 'text-[#181818] animate-fade-in' : 'text-[#181818]'
      }`}
    >
      {value}
    </span>
  );
}

// Helper function
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
