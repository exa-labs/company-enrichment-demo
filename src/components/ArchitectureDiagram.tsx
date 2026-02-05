'use client';

import { useState, useEffect, useRef } from 'react';

// Phase definitions for the animation
type AnimationPhase =
  | 'start'
  | 'crm-export'
  | 'middleware-receive'
  | 'exa-answer'
  | 'structured-data'
  | 'crm-update'
  | 'pause-1'
  | 'refresh-trigger'
  | 'refresh-answer'
  | 'refresh-update'
  | 'pause-2'
  | 'new-account-trigger'
  | 'new-account-answer'
  | 'new-account-update'
  | 'complete';

interface PhaseConfig {
  duration: number;
  label: string;
  description: string;
}

const PHASE_CONFIGS: Record<AnimationPhase, PhaseConfig> = {
  'start': { duration: 1500, label: 'Initial Backfill', description: 'Starting enrichment pipeline...' },
  'crm-export': { duration: 2000, label: 'Initial Backfill', description: 'Query records from database (domain + record ID)' },
  'middleware-receive': { duration: 1500, label: 'Initial Backfill', description: 'Middleware receives company list' },
  'exa-answer': { duration: 3000, label: 'Initial Backfill', description: 'Call Exa Answer API → returns structured data' },
  'structured-data': { duration: 2000, label: 'Initial Backfill', description: 'Structured enrichment data received' },
  'crm-update': { duration: 2000, label: 'Initial Backfill', description: 'POST enriched data back to database' },
  'pause-1': { duration: 3000, label: 'Complete', description: 'Initial backfill complete' },
  'refresh-trigger': { duration: 2000, label: 'Weekly Refresh', description: 'Cron job triggers weekly refresh' },
  'refresh-answer': { duration: 3000, label: 'Weekly Refresh', description: 'Exa Answer fetches fresh data for each company' },
  'refresh-update': { duration: 2000, label: 'Weekly Refresh', description: 'Push updates to database' },
  'pause-2': { duration: 3000, label: 'Complete', description: 'Refresh complete' },
  'new-account-trigger': { duration: 2000, label: 'New Records', description: 'Daily cron detects new database records' },
  'new-account-answer': { duration: 3000, label: 'New Accounts', description: 'Exa Answer enriches new companies' },
  'new-account-update': { duration: 2000, label: 'New Records', description: 'Enrich new records in database' },
  'complete': { duration: 4000, label: 'Complete', description: 'Pipeline complete - loops' },
};

const PHASES: AnimationPhase[] = [
  'start', 'crm-export', 'middleware-receive', 'exa-answer', 'structured-data', 'crm-update', 'pause-1',
  'refresh-trigger', 'refresh-answer', 'refresh-update', 'pause-2',
  'new-account-trigger', 'new-account-answer', 'new-account-update', 'complete'
];

export function ArchitectureDiagram() {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const currentPhase = PHASES[currentPhaseIndex];
  const phaseConfig = PHASE_CONFIGS[currentPhase];

  const resetAnimation = () => {
    setCurrentPhaseIndex(0);
    setPhaseProgress(0);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const phaseDuration = phaseConfig.duration;
      const progress = Math.min(elapsed / phaseDuration, 1);

      setPhaseProgress(progress);

      if (progress >= 1) {
        const nextIndex = (currentPhaseIndex + 1) % PHASES.length;
        setCurrentPhaseIndex(nextIndex);
        setPhaseProgress(0);
        startTimeRef.current = Date.now();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentPhaseIndex, phaseConfig.duration]);

  // Determine phase category
  const isInitialPhase = currentPhase.startsWith('start') || currentPhase.startsWith('crm-') ||
    currentPhase.startsWith('middleware') || currentPhase.startsWith('exa-') ||
    currentPhase.startsWith('structured') || currentPhase === 'pause-1';
  const isRefreshPhase = currentPhase.startsWith('refresh-') || currentPhase === 'pause-2';
  const isNewAccountPhase = currentPhase.startsWith('new-account-');

  // Active states
  const crmActive = currentPhase === 'crm-export' || currentPhase === 'crm-update' ||
    currentPhase === 'refresh-update' || currentPhase === 'new-account-update' ||
    currentPhase === 'new-account-trigger';
  const middlewareActive = currentPhase === 'middleware-receive' || currentPhase === 'structured-data' ||
    currentPhase === 'refresh-trigger';
  const exaActive = currentPhase === 'exa-answer' || currentPhase === 'refresh-answer' ||
    currentPhase === 'new-account-answer';

  // Connection states
  const crmToMiddleware = currentPhase === 'crm-export' || currentPhase === 'new-account-trigger';
  const middlewareToExa = currentPhase === 'exa-answer' || currentPhase === 'refresh-answer' || currentPhase === 'new-account-answer';
  const exaToMiddleware = currentPhase === 'structured-data';
  const middlewareToCrm = currentPhase === 'crm-update' || currentPhase === 'refresh-update' || currentPhase === 'new-account-update';
  const cronToMiddleware = currentPhase === 'refresh-trigger';

  const getSectionColor = () => {
    if (isInitialPhase) return '#0040f0';
    if (isRefreshPhase) return '#059669';
    if (isNewAccountPhase) return '#7c3aed';
    return '#60646c';
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-[#e5e5e5] bg-white">
      {/* Phase indicator */}
      <div className="border-b border-[#e5e5e5] px-6 py-4 bg-[#f9f7f7]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: getSectionColor() }}
            />
            <span className="font-medium text-[#000911]">{phaseConfig.label}</span>
          </div>
          <div className="flex items-center gap-4 text-[13px]">
            <span className={`px-2 py-1 rounded ${isInitialPhase ? 'bg-[#0040f0] text-white' : 'bg-[#e5e5e5] text-[#60646c]'}`}>
              1. Initial Backfill
            </span>
            <span className={`px-2 py-1 rounded ${isRefreshPhase ? 'bg-[#059669] text-white' : 'bg-[#e5e5e5] text-[#60646c]'}`}>
              2. Weekly Refresh
            </span>
            <span className={`px-2 py-1 rounded ${isNewAccountPhase ? 'bg-[#7c3aed] text-white' : 'bg-[#e5e5e5] text-[#60646c]'}`}>
              3. New Records
            </span>
          </div>
        </div>
        <p className="text-[14px] text-[#60646c]">{phaseConfig.description}</p>
      </div>

      {/* Diagram */}
      <div className="p-6">
        <svg width="100%" height="220" viewBox="0 0 700 220" className="mx-auto">
          <defs>
            <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#0040f0" />
            </marker>
            <marker id="arrow-green" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#059669" />
            </marker>
            <marker id="arrow-gray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#c9c9c9" />
            </marker>
            <filter id="glow-blue">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* CRM Node */}
          <g className="transition-all duration-300">
            <rect
              x="30" y="70" width="130" height="80"
              rx="8"
              fill={crmActive ? '#032d60' : '#0a4a8a'}
              filter={crmActive ? 'url(#glow-blue)' : undefined}
            />
            <text x="95" y="105" textAnchor="middle" fill="white" className="text-sm font-medium">Your Database</text>
            <text x="95" y="125" textAnchor="middle" fill="white" opacity="0.7" className="text-xs">CRM / DB</text>
          </g>

          {/* Your Middleware Node - Central */}
          <g className="transition-all duration-300">
            <rect
              x="230" y="55" width="160" height="110"
              rx="12"
              fill={middlewareActive ? '#0040f0' : '#1F40ED'}
              filter={middlewareActive ? 'url(#glow-blue)' : undefined}
            />
            <text x="310" y="95" textAnchor="middle" fill="white" className="text-sm font-medium">Your Middleware</text>
            <text x="310" y="115" textAnchor="middle" fill="white" opacity="0.8" className="text-xs">Orchestration Layer</text>
            {middlewareActive && (
              <>
                <circle cx="270" cy="140" r="3" fill="white" opacity="0.8" className="animate-pulse" />
                <circle cx="290" cy="140" r="3" fill="white" opacity="0.6" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
                <circle cx="310" cy="140" r="3" fill="white" opacity="0.8" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
                <circle cx="330" cy="140" r="3" fill="white" opacity="0.6" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
                <circle cx="350" cy="140" r="3" fill="white" opacity="0.8" className="animate-pulse" style={{ animationDelay: '0.8s' }} />
              </>
            )}
          </g>

          {/* Exa Answer API Node - Single combined node */}
          <g className="transition-all duration-300">
            <rect
              x="480" y="50" width="180" height="120"
              rx="10"
              fill={exaActive ? '#0040f0' : '#f9f7f7'}
              stroke={exaActive ? '#0040f0' : '#e5e5e5'}
              strokeWidth={exaActive ? 2 : 1}
            />
            {/* Exa logo */}
            <g transform="translate(498, 65)">
              <svg width="18" height="22" viewBox="0 0 26 32" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.63623 0H25.6544V2.38806L14.9775 16L25.6544 29.6119V32H0.63623V0ZM13.3026 13.7975L21.9788 2.38806H4.62646L13.3026 13.7975ZM3.45099 5.24727V14.806H10.7198L3.45099 5.24727ZM10.7198 17.194H3.45099V26.7527L10.7198 17.194ZM4.62646 29.6119L13.3026 18.2025L21.9788 29.6119H4.62646Z"
                  fill={exaActive ? 'white' : '#1F40ED'}
                />
              </svg>
            </g>
            <text x="570" y="82" textAnchor="middle" fill={exaActive ? 'white' : '#000911'} className="text-sm font-medium">Exa Answer API</text>

            {/* Feature badges inside */}
            <g transform="translate(498, 100)">
              <rect x="0" y="0" width="70" height="22" rx="4" fill={exaActive ? 'rgba(255,255,255,0.2)' : '#e5e5e5'} />
              <text x="35" y="15" textAnchor="middle" fill={exaActive ? 'white' : '#60646c'} className="text-[9px]">Search</text>
            </g>
            <g transform="translate(574, 100)">
              <rect x="0" y="0" width="70" height="22" rx="4" fill={exaActive ? 'rgba(255,255,255,0.2)' : '#e5e5e5'} />
              <text x="35" y="15" textAnchor="middle" fill={exaActive ? 'white' : '#60646c'} className="text-[9px]">Extract</text>
            </g>
            <g transform="translate(498, 128)">
              <rect x="0" y="0" width="146" height="22" rx="4" fill={exaActive ? 'rgba(255,255,255,0.2)' : '#e5e5e5'} />
              <text x="73" y="15" textAnchor="middle" fill={exaActive ? 'white' : '#60646c'} className="text-[9px]">Structured JSON Output</text>
            </g>

            {exaActive && (
              <>
                <circle cx="510" cy="158" r="2" fill="white" className="animate-pulse" />
                <circle cx="530" cy="158" r="2" fill="white" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
                <circle cx="550" cy="158" r="2" fill="white" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
                <circle cx="570" cy="158" r="2" fill="white" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
                <circle cx="590" cy="158" r="2" fill="white" className="animate-pulse" style={{ animationDelay: '0.8s' }} />
                <circle cx="610" cy="158" r="2" fill="white" className="animate-pulse" style={{ animationDelay: '1s' }} />
                <circle cx="630" cy="158" r="2" fill="white" className="animate-pulse" style={{ animationDelay: '1.2s' }} />
              </>
            )}
          </g>

          {/* Connections */}

          {/* CRM → Middleware */}
          <path
            d="M160 110 L225 110"
            stroke={crmToMiddleware ? '#0040f0' : '#c9c9c9'}
            strokeWidth={crmToMiddleware ? 2 : 1}
            fill="none"
            markerEnd={crmToMiddleware ? 'url(#arrow-blue)' : 'url(#arrow-gray)'}
          />
          {crmToMiddleware && (
            <text x="192" y="100" textAnchor="middle" fill="#0040f0" className="text-[10px]">records</text>
          )}

          {/* Middleware → Exa Answer */}
          <path
            d="M390 95 L475 95"
            stroke={middlewareToExa ? '#0040f0' : '#c9c9c9'}
            strokeWidth={middlewareToExa ? 2 : 1}
            fill="none"
            markerEnd={middlewareToExa ? 'url(#arrow-blue)' : 'url(#arrow-gray)'}
          />
          {middlewareToExa && (
            <text x="432" y="85" textAnchor="middle" fill="#0040f0" className="text-[10px]">query + schema</text>
          )}

          {/* Exa Answer → Middleware (structured data back) */}
          <path
            d="M480 125 L390 125"
            stroke={exaToMiddleware ? '#059669' : '#c9c9c9'}
            strokeWidth={exaToMiddleware ? 2 : 1}
            fill="none"
            markerEnd={exaToMiddleware ? 'url(#arrow-green)' : 'url(#arrow-gray)'}
            strokeDasharray={exaToMiddleware ? '0' : '4'}
          />
          {exaToMiddleware && (
            <text x="435" y="140" textAnchor="middle" fill="#059669" className="text-[10px]">structured JSON</text>
          )}

          {/* Middleware → CRM (update) */}
          <path
            d="M230 130 L160 130"
            stroke={middlewareToCrm ? '#059669' : '#c9c9c9'}
            strokeWidth={middlewareToCrm ? 2 : 1}
            fill="none"
            markerEnd={middlewareToCrm ? 'url(#arrow-green)' : 'url(#arrow-gray)'}
          />
          {middlewareToCrm && (
            <text x="195" y="145" textAnchor="middle" fill="#059669" className="text-[10px]">POST update</text>
          )}

          {/* Labels */}
          <text x="95" y="195" textAnchor="middle" fill="#60646c" className="text-[11px]">Source of Truth</text>
          <text x="310" y="195" textAnchor="middle" fill="#60646c" className="text-[11px]">Your Server</text>
          <text x="570" y="195" textAnchor="middle" fill="#60646c" className="text-[11px]">Search + Extract in One Call</text>
        </svg>
      </div>

      {/* Replay button */}
      <button
        onClick={resetAnimation}
        className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-[#f9f7f7] px-3 py-2 text-sm text-[#60646c] transition-colors hover:bg-[#e5e5e5] hover:text-[#000911]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 4v6h6" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
        Replay
      </button>
    </div>
  );
}
