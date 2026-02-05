'use client';

import { Info, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import { ReactNode } from 'react';

interface NoteProps {
  children: ReactNode;
  variant?: 'info' | 'warning' | 'success' | 'tip';
  title?: string;
}

export function Note({ children, variant = 'info', title }: NoteProps) {
  const variants = {
    info: {
      container: 'border-blue-200 bg-blue-50',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-500',
    },
    warning: {
      container: 'border-amber-200 bg-amber-50',
      text: 'text-amber-800',
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
    },
    success: {
      container: 'border-green-200 bg-green-50',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-500',
    },
    tip: {
      container: 'border-purple-200 bg-purple-50',
      text: 'text-purple-800',
      icon: Lightbulb,
      iconColor: 'text-purple-500',
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div className={`my-4 rounded-lg border p-4 ${config.container}`}>
      <div className="flex gap-3">
        <Icon className={`h-5 w-5 shrink-0 ${config.iconColor}`} />
        <div className={`text-sm ${config.text}`}>
          {title && <p className="font-semibold mb-1">{title}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
