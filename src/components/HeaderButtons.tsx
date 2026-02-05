"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Copy, Check } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
  className?: string;
}

function Button({ children, onClick, icon, iconPosition = "end", className = "" }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg border border-[#e5e5e5] bg-white px-4 py-2 text-sm font-medium text-black hover:bg-[#f9f7f7] hover:border-[rgba(9,114,213,0.32)] transition-all ${className}`}
    >
      {iconPosition === "start" && icon}
      <span>{children}</span>
      {iconPosition === "end" && icon}
    </button>
  );
}

interface HomeHeaderButtonsProps {
  llmContent: string;
}

export function HomeHeaderButtons({ llmContent }: HomeHeaderButtonsProps) {
  const [copied, setCopied] = useState(false);

  const copyForLLM = async () => {
    await navigator.clipboard.writeText(llmContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button
        onClick={copyForLLM}
        icon={copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
        iconPosition="start"
      >
        {copied ? "Copied!" : "Copy for LLMs"}
      </Button>

      <Link href="/how-it-works">
        <Button icon={<ArrowRight size={16} />}>
          How It Works
        </Button>
      </Link>
    </>
  );
}

interface HowItWorksHeaderButtonsProps {
  llmContent: string;
}

export function HowItWorksHeaderButtons({ llmContent }: HowItWorksHeaderButtonsProps) {
  const [copied, setCopied] = useState(false);

  const copyForLLM = async () => {
    await navigator.clipboard.writeText(llmContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      onClick={copyForLLM}
      icon={copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
      iconPosition="start"
    >
      {copied ? "Copied!" : "Copy for LLMs"}
    </Button>
  );
}
