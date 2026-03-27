'use client';

import { useState, useCallback, useRef, FormEvent } from 'react';
import { Building2, Search, Loader2, X, ExternalLink } from 'lucide-react';

interface EnrichedCompany {
  query: string;
  industry: string | null;
  annualRevenue: string | null;
  employeeCount: string | null;
  ownership: string | null;
  latestFunding: string | null;
  description: string | null;
  recentNews: string | null;
  sources: string[];
}

type RowState =
  | { status: 'enriching'; query: string }
  | { status: 'done'; data: EnrichedCompany; processingTime: number }
  | { status: 'error'; query: string; error: string };

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

const SUGGESTIONS = ['Stripe', 'Notion', 'Linear', 'Figma', 'Vercel', 'OpenAI', 'Anthropic', 'Shopify'];

export function LiveEnrichmentTable() {
  const [rows, setRows] = useState<RowState[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [activeCount, setActiveCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const enrichCompany = useCallback(async (company: string) => {
    const newRow: RowState = { status: 'enriching', query: company };

    setRows(prev => [...prev, newRow]);
    setActiveCount(prev => prev + 1);

    try {
      const res = await fetch('/enrichment-demo/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company }),
      });

      const json = await res.json();

      setRows(prev => {
        const updated = [...prev];
        const idx = updated.findIndex(
          r => r.status === 'enriching' && r.query === company
        );
        if (idx === -1) return prev;

        if (json.success) {
          updated[idx] = {
            status: 'done',
            data: json.data,
            processingTime: json.processingTime,
          };
        } else {
          updated[idx] = {
            status: 'error',
            query: company,
            error: json.error ?? 'Unknown error',
          };
        }
        return updated;
      });
    } catch (err) {
      setRows(prev => {
        const updated = [...prev];
        const idx = updated.findIndex(
          r => r.status === 'enriching' && r.query === company
        );
        if (idx === -1) return prev;
        updated[idx] = {
          status: 'error',
          query: company,
          error: err instanceof Error ? err.message : 'Network error',
        };
        return updated;
      });
    } finally {
      setActiveCount(prev => prev - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = inputValue.trim();
    if (!value) return;
    setInputValue('');
    enrichCompany(value);
    inputRef.current?.focus();
  };

  const handleSuggestion = (company: string) => {
    enrichCompany(company);
  };

  const removeRow = (index: number) => {
    setRows(prev => prev.filter((_, i) => i !== index));
  };

  const enrichingCount = rows.filter(r => r.status === 'enriching').length;
  const completedCount = rows.filter(r => r.status === 'done').length;

  return (
    <div className="w-full">
      {/* Input area */}
      <div className="mb-6">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#60646c]" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter a company name or domain (e.g., Stripe, openai.com)"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#e5e5e5] bg-white text-[15px] text-[#000911] placeholder:text-[#bababa] focus:outline-none focus:border-[#0040f0] focus:ring-1 focus:ring-[#0040f0] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="px-6 py-3 rounded-lg bg-[#0040f0] text-white text-[15px] font-medium hover:bg-[#0035d0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <ExaLogoSmall className="text-white" />
            Enrich
          </button>
        </form>

        {/* Suggestion chips */}
        {rows.length === 0 && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-[13px] text-[#60646c]">Try:</span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="px-3 py-1 rounded-full border border-[#e5e5e5] text-[13px] text-[#60646c] hover:border-[#0040f0] hover:text-[#0040f0] hover:bg-[#f0f4ff] transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results table */}
      {rows.length > 0 && (
        <>
          {/* CRM header bar */}
          <div className="bg-[#032d60] rounded-t-lg px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-white" />
                <span className="text-white font-medium text-[15px]">Enriched Accounts</span>
              </div>
              <span className="text-white/60 text-[13px]">|</span>
              <span className="text-white/80 text-[13px]">{rows.length} {rows.length === 1 ? 'company' : 'companies'}</span>
            </div>
            <div className="flex items-center gap-2">
              {enrichingCount > 0 && (
                <div className="flex items-center gap-2 bg-[#0040f0]/90 rounded px-3 py-1.5">
                  <ExaLogoSmall className="text-white" />
                  <span className="text-white text-[12px]">
                    Enriching {enrichingCount} {enrichingCount === 1 ? 'company' : 'companies'}...
                  </span>
                </div>
              )}
              {enrichingCount === 0 && completedCount > 0 && (
                <div className="flex items-center gap-2 bg-[#2e844a]/80 rounded px-3 py-1.5">
                  <span className="text-white text-[12px]">
                    {completedCount} enriched
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="border border-[#c9c9c9] border-t-0 rounded-b-lg overflow-hidden bg-white overflow-x-auto">
            <div className="bg-[#f3f3f3] border-b border-[#c9c9c9] min-w-[900px]">
              <div className="grid grid-cols-[minmax(140px,1.2fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(80px,0.8fr)_minmax(80px,0.8fr)_minmax(120px,1fr)_minmax(180px,1.5fr)] text-[12px] font-medium text-[#181818] uppercase tracking-wide">
                <div className="px-3 py-3 border-r border-[#c9c9c9]">Company</div>
                <div className="px-3 py-3 border-r border-[#c9c9c9]">Industry</div>
                <div className="px-3 py-3 border-r border-[#c9c9c9]">Revenue</div>
                <div className="px-3 py-3 border-r border-[#c9c9c9]">Employees</div>
                <div className="px-3 py-3 border-r border-[#c9c9c9]">Ownership</div>
                <div className="px-3 py-3 border-r border-[#c9c9c9]">Funding</div>
                <div className="px-3 py-3">Recent News</div>
              </div>
            </div>

            <div className="min-w-[900px]">
              {rows.map((row, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-[minmax(140px,1.2fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(80px,0.8fr)_minmax(80px,0.8fr)_minmax(120px,1fr)_minmax(180px,1.5fr)] border-b border-[#e5e5e5] last:border-b-0 transition-colors duration-300 ${
                    row.status === 'enriching'
                      ? 'bg-[#f0f7ff]'
                      : row.status === 'error'
                        ? 'bg-red-50'
                        : 'bg-white'
                  }`}
                >
                  {row.status === 'enriching' && (
                    <>
                      <div className="px-3 py-3 border-r border-[#e5e5e5]">
                        <span className="text-[#0176d3] text-[13px] font-medium">{row.query}</span>
                      </div>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className={`px-3 py-3 ${i < 5 ? 'border-r border-[#e5e5e5]' : ''}`}>
                          <div className="flex items-center gap-1.5">
                            <ExaLogoSmall className="text-[#0040f0] animate-pulse" />
                            <span className="text-[#0040f0] text-[12px]">Enriching</span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {row.status === 'error' && (
                    <>
                      <div className="px-3 py-3 border-r border-[#e5e5e5]">
                        <div className="flex items-center justify-between">
                          <span className="text-[#181818] text-[13px] font-medium">{row.query}</span>
                          <button onClick={() => removeRow(index)} className="text-[#706e6b] hover:text-red-500 transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="px-3 py-3 col-span-6">
                        <span className="text-red-600 text-[13px]">{row.error}</span>
                      </div>
                    </>
                  )}

                  {row.status === 'done' && (
                    <>
                      <div className="px-3 py-3 border-r border-[#e5e5e5]">
                        <div className="flex items-center justify-between gap-1">
                          <div className="min-w-0">
                            <span className="text-[#0176d3] text-[13px] font-medium block truncate">
                              {row.data.query}
                            </span>
                            {row.data.description && (
                              <span className="text-[#706e6b] text-[11px] block truncate mt-0.5">
                                {row.data.description}
                              </span>
                            )}
                          </div>
                          <button onClick={() => removeRow(index)} className="text-[#706e6b] hover:text-red-500 transition-colors shrink-0">
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                      <CellValue value={row.data.industry} />
                      <CellValue value={row.data.annualRevenue} />
                      <CellValue value={row.data.employeeCount} />
                      <CellValue value={row.data.ownership} />
                      <CellValue value={row.data.latestFunding} />
                      <div className="px-3 py-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-[13px] text-[#181818] animate-fade-in line-clamp-2">
                            {row.data.recentNews ?? '—'}
                          </span>
                          {row.data.sources.length > 0 && (
                            <div className="flex items-center gap-1">
                              <a
                                href={row.data.sources[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0040f0] text-[11px] hover:underline flex items-center gap-0.5"
                              >
                                source <ExternalLink size={9} />
                              </a>
                              {row.data.sources.length > 1 && (
                                <span className="text-[#706e6b] text-[11px]">
                                  +{row.data.sources.length - 1} more
                                </span>
                              )}
                            </div>
                          )}
                          <span className="text-[#bababa] text-[10px]">
                            {(row.processingTime / 1000).toFixed(1)}s
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Status footer */}
          <div className="mt-3 flex items-center justify-between text-[12px] text-[#706e6b]">
            <div className="flex items-center gap-4">
              {enrichingCount > 0 && (
                <span className="flex items-center gap-1.5">
                  <Loader2 size={12} className="animate-spin text-[#0040f0]" />
                  Deep search in progress...
                </span>
              )}
            </div>
            <span>
              Exa Deep Search with structured output
            </span>
          </div>
        </>
      )}
    </div>
  );
}

function CellValue({ value }: { value: string | null }) {
  return (
    <div className="px-3 py-3 border-r border-[#e5e5e5]">
      <span className={`text-[13px] ${value ? 'text-[#181818] animate-fade-in' : 'text-[#706e6b]'}`}>
        {value ?? '—'}
      </span>
    </div>
  );
}
