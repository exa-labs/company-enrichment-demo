'use client';

import { ReactNode } from 'react';

interface StepProps {
  number: number;
  title: string;
  children: ReactNode;
  isLast?: boolean;
}

export function Step({ number, title, children, isLast = false }: StepProps) {
  return (
    <div className={`relative pl-10 pb-8 ${!isLast ? 'border-l-2 border-[#e5e5e5]' : 'border-l-0'}`}>
      {/* Step number circle */}
      <div className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#0040f0] text-white text-sm font-medium">
        {number}
      </div>

      {/* Step content */}
      <div>
        <h3 className="text-lg font-semibold text-[#000911] mb-3">{title}</h3>
        <div className="text-[#60646c]">{children}</div>
      </div>
    </div>
  );
}

interface StepContainerProps {
  children: ReactNode;
}

export function StepContainer({ children }: StepContainerProps) {
  return <div className="space-y-0">{children}</div>;
}
