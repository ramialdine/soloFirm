"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "", label: "Agent Outputs", icon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" },
  { href: "/roadmap", label: "Roadmap", icon: "M12 20V10M18 20V4M6 20v-4" },
  { href: "/plan", label: "Full Plan", icon: "M4 6h16M4 12h16M4 18h10" },
];

export default function ResultsNav({ id }: { id: string }) {
  const pathname = usePathname();
  const base = `/results/${id}`;

  return (
    <div className="mx-auto max-w-5xl border-b border-zinc-200 px-6">
      <div className="flex gap-1 -mb-px">
        {TABS.map((tab) => {
          const href = `${base}${tab.href}`;
          const isActive =
            tab.href === ""
              ? pathname === base || pathname === `${base}/`
              : pathname.startsWith(href);

          return (
            <Link
              key={tab.href}
              href={href}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-400 hover:text-zinc-700"
              }`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={tab.icon} />
              </svg>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
