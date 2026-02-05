'use client';

interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'blue' | 'success' | 'warning';
  size?: 'sm' | 'md';
  className?: string;
}

export function Tag({ children, variant = 'default', size = 'md', className = '' }: TagProps) {
  const variants = {
    default: 'bg-[#f9f7f7] text-[#000911] border-[#e5e5e5]',
    blue: 'bg-blue-50 text-[#0040f0] border-blue-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
