"use client";

import { useState } from "react";
import Link from "next/link";

const DELIVERABLES = [
  {
    icon: "📋",
    title: "Legal Package",
    description: "Articles of organization, operating agreement, licenses & permits checklist — filed correctly for your state.",
    color: "border-blue-100 bg-blue-50",
    iconBg: "bg-blue-100",
  },
  {
    icon: "💰",
    title: "Financial Setup",
    description: "Bank account recommendations, 12-month projections, break-even analysis, and accounting system setup.",
    color: "border-violet-100 bg-violet-50",
    iconBg: "bg-violet-100",
  },
  {
    icon: "📊",
    title: "Market Intelligence",
    description: "Local competitive landscape, target customer profile, pricing strategy, and go-to-market channels.",
    color: "border-amber-100 bg-amber-50",
    iconBg: "bg-amber-100",
  },
  {
    icon: "🎨",
    title: "Brand Package",
    description: "Name options, color palette, typography, logo concepts, brand voice, and positioning statement.",
    color: "border-rose-100 bg-rose-50",
    iconBg: "bg-rose-100",
  },
  {
    icon: "📱",
    title: "Social Media Kit",
    description: "Platform-optimized bios, first 30 days of content, hashtag strategy, and step-by-step setup guides.",
    color: "border-emerald-100 bg-emerald-50",
    iconBg: "bg-emerald-100",
  },
  {
    icon: "🗺️",
    title: "90-Day Roadmap",
    description: "Week-by-week action plan with specific tasks, costs, and milestones from day one through launch.",
    color: "border-zinc-200 bg-zinc-50",
    iconBg: "bg-zinc-100",
  },
];

const AGENTS = [
  { name: "Planner", color: "bg-blue-500", desc: "90-day roadmap" },
  { name: "Research", color: "bg-violet-500", desc: "Market intelligence" },
  { name: "Legal", color: "bg-amber-500", desc: "Compliance & docs" },
  { name: "Finance", color: "bg-emerald-500", desc: "Projections & setup" },
  { name: "Brand", color: "bg-rose-500", desc: "Identity & messaging" },
  { name: "Social", color: "bg-cyan-500", desc: "Platform strategy" },
  { name: "Critic", color: "bg-zinc-600", desc: "Gap analysis" },
];

const SOCIAL_PROOF = [
  { metric: "7", label: "Specialized AI Agents" },
  { metric: "5", label: "Analysis Phases" },
  { metric: "<3min", label: "Average Run Time" },
  { metric: "$0", label: "vs. $5–10k at a firm" },
];

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-zinc-100 bg-white/90 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-white text-xs font-bold">S</div>
            <span className="text-lg font-bold tracking-tight text-zinc-900">SoloFirm</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#how-it-works" className="hidden text-sm text-zinc-500 hover:text-zinc-900 sm:block">
              How it works
            </a>
            <Link
              href="/dashboard"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              Launch Your Business →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-20 text-center sm:py-32">
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-100 opacity-60 blur-3xl" />
          <div className="absolute top-20 right-0 h-64 w-64 rounded-full bg-violet-100 opacity-50 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-emerald-100 opacity-40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm text-zinc-600 shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            7 AI agents · 5 analysis phases · under 3 minutes
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
            Your Complete{" "}
            <span
              className="bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 bg-clip-text text-transparent"
              style={{ backgroundSize: "200% auto", animation: "gradientShift 4s linear infinite" }}
            >
              Business Launch
            </span>{" "}
            Package
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 sm:text-xl">
            Describe your idea. Answer a few questions. Seven specialized AI agents build your
            legal docs, financial setup, brand identity, social media strategy, and 90-day action plan.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 rounded-xl bg-zinc-900 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-zinc-700 hover:shadow-xl hover:-translate-y-0.5"
            >
              Start Free — No Account Needed
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <a
              href="#deliverables"
              className="rounded-xl border border-zinc-200 px-8 py-3.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              See What You Get
            </a>
          </div>
        </div>
      </section>

      {/* Metrics strip */}
      <section className="border-y border-zinc-100 bg-zinc-50 px-6 py-10">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
          {SOCIAL_PROOF.map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-3xl font-bold text-zinc-900">{item.metric}</p>
              <p className="mt-1 text-sm text-zinc-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Agent pipeline visualization */}
      <section id="how-it-works" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-zinc-500">Seven agents. Five phases. One complete launch package.</p>
          </div>

          {/* Agent pipeline */}
          <div className="mt-16">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {AGENTS.map((agent, i) => (
                <div key={agent.name} className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md">
                    <div className={`h-2.5 w-2.5 rounded-full ${agent.color}`} />
                    <span className="text-xs font-semibold text-zinc-900">{agent.name}</span>
                    <span className="text-xs text-zinc-400">{agent.desc}</span>
                  </div>
                  {i < AGENTS.length - 1 && (
                    <div className="h-px w-4 shrink-0 bg-zinc-200" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "1", title: "Describe Your Idea", body: "Share your business concept, location, budget, and team size. Upload any docs you have.", color: "bg-blue-600" },
              { n: "2", title: "Answer Questions", body: "Your AI consultant asks targeted follow-ups to understand your specific situation.", color: "bg-violet-600" },
              { n: "3", title: "Agents Build Your Package", body: "7 agents work in parallel phases — legal, finance, research, brand, social, planning, and review.", color: "bg-amber-500" },
              { n: "4", title: "Execute Your Plan", body: "Get real documents, financial projections, brand identity, and a week-by-week action plan.", color: "bg-emerald-600" },
            ].map((step) => (
              <div key={step.n} className="relative rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${step.color} text-sm font-bold text-white`}>
                  {step.n}
                </div>
                <h3 className="mt-3 font-semibold text-zinc-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section id="deliverables" className="border-t border-zinc-100 bg-zinc-50 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">What You Get</h2>
            <p className="mt-4 text-zinc-500">Real deliverables — not generic advice. Every output is specific to your business and state.</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DELIVERABLES.map((d) => (
              <div
                key={d.title}
                className={`rounded-xl border p-6 transition-shadow hover:shadow-md ${d.color}`}
              >
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${d.iconBg} text-xl`}>
                  {d.icon}
                </div>
                <h3 className="mt-3 font-semibold text-zinc-900">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{d.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof quote */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <blockquote className="text-xl font-medium text-zinc-700 sm:text-2xl">
            &ldquo;Like having a startup lawyer, financial advisor, brand strategist, and social media manager —
            all at once, in under 3 minutes.&rdquo;
          </blockquote>
          <div className="mt-4 text-sm text-zinc-400">What SoloFirm replaces</div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-zinc-900 px-6 py-24 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to launch your business?
          </h2>
          <p className="mt-4 text-zinc-400">
            Free to try. No account required. Your full launch package in under 3 minutes.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard"
              className="rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-100 hover:shadow-lg"
            >
              Start Free Now →
            </Link>
          </div>
          <div className="mt-10 border-t border-zinc-800 pt-10">
            <p className="text-sm text-zinc-400">
              Want early access to document export, custom agents, and team features?
            </p>
            {submitted ? (
              <div className="mt-4 rounded-lg bg-emerald-900/30 px-6 py-3 text-sm text-emerald-400">
                You&apos;re on the list! We&apos;ll be in touch.
              </div>
            ) : (
              <form onSubmit={handleWaitlist} className="mt-4 flex gap-3 sm:justify-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  suppressHydrationWarning
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:max-w-xs"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
                >
                  {loading ? "…" : "Join Waitlist"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-100 px-6 py-8 text-center text-sm text-zinc-400">
        &copy; 2026 SoloFirm. AI-powered business launch platform.
      </footer>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}
