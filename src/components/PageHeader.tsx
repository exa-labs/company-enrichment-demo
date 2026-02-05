"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  rightContent?: ReactNode;
}

export function PageHeader({ title, subtitle, rightContent }: PageHeaderProps) {
  return (
    <header className="bg-white pt-8 pb-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <Link href="/">
            <Image
              src="/exa_logo.png"
              alt="Exa"
              width={60}
              height={20}
              className="h-5 w-auto"
            />
          </Link>

          {rightContent && (
            <div className="flex items-center gap-2">
              {rightContent}
            </div>
          )}
        </div>

        <div>
          <h1 className="font-arizona text-4xl tracking-tight text-black sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-lg text-black/60">
            {subtitle}
          </p>
        </div>
      </div>
    </header>
  );
}
