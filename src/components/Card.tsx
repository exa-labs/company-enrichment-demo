'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'marble' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({ children, className = '', variant = 'default', padding = 'md' }: CardProps) {
  const variants = {
    default: 'bg-white border border-[#e5e5e5]',
    marble: 'bg-[#f9f7f7] border border-[#e5e5e5]',
    elevated: 'bg-white border border-[#e5e5e5] shadow-lg',
  };

  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`rounded-xl ${variants[variant]} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, icon, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#f9f7f7]">
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-arizona text-lg text-[#000911]">{title}</h3>
          {subtitle && <p className="text-sm text-[#60646c]">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface DataFieldProps {
  label: string;
  value: string | number | null | undefined;
  type?: 'text' | 'url' | 'currency' | 'number' | 'percentage';
  className?: string;
}

export function DataField({ label, value, type = 'text', className = '' }: DataFieldProps) {
  const formatValue = (val: string | number | null | undefined) => {
    if (val === null || val === undefined || val === '') return '—';
    if (type === 'url' && typeof val === 'string') {
      return (
        <a
          href={val}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0040f0] hover:underline"
        >
          {val.replace(/^https?:\/\//, '').slice(0, 40)}...
        </a>
      );
    }
    return val;
  };

  return (
    <div className={`py-2 ${className}`}>
      <dt className="text-xs uppercase tracking-wider text-[#60646c] mb-1">{label}</dt>
      <dd className="text-[#000911]">{formatValue(value)}</dd>
    </div>
  );
}
