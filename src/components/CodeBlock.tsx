'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Copy, Check, ChevronDown, ChevronRight } from 'lucide-react';

// Custom light theme matching Exa style
const codeStyle: { [key: string]: React.CSSProperties } = {
  'code[class*="language-"]': {
    color: '#000911',
    background: 'none',
  },
  'pre[class*="language-"]': {
    color: '#000911',
    background: 'white',
    padding: '1rem',
  },
  comment: { color: '#6b7280' },
  string: { color: '#059669' },
  number: { color: '#0040f0' },
  keyword: { color: '#7c3aed' },
  function: { color: '#0040f0' },
  punctuation: { color: '#000911' },
  operator: { color: '#000911' },
  property: { color: '#0040f0' },
  'class-name': { color: '#0040f0' },
};

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  collapsible?: boolean;
}

export function CodeBlock({ code, language = 'javascript', filename, showLineNumbers = false, collapsible = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(!collapsible);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (collapsible && !expanded) {
    return (
      <div className="my-4 rounded-lg border border-[#e5e5e5]">
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center justify-between w-full px-4 py-3 text-left font-medium text-[#000911]"
        >
          <span className="flex items-center gap-2">
            <ChevronRight size={18} />
            {filename || language.toUpperCase()}
          </span>
          <span className="text-xs text-[#60646c]">Click to expand</span>
        </button>
      </div>
    );
  }

  return (
    <div className="group relative my-4">
      {collapsible && (
        <button
          onClick={() => setExpanded(false)}
          className="flex items-center gap-2 mb-2 text-sm font-medium text-[#000911]"
        >
          <ChevronDown size={18} />
          {filename || language.toUpperCase()}
        </button>
      )}
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 z-10 rounded-md bg-[#e5e5e5] p-1.5 text-[#60646c] opacity-0 transition-all hover:bg-[#d4d4d4] hover:text-[#000911] group-hover:opacity-100"
        title="Copy code"
      >
        {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
      </button>
      <SyntaxHighlighter
        style={codeStyle}
        language={language}
        showLineNumbers={showLineNumbers}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: '8px',
          fontSize: '13px',
          paddingRight: '3rem',
          background: 'white',
          border: '1px solid #e5e5e5',
        }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
}
