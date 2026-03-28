"use client";

import { useState } from "react";
import Link from "next/link";

const USE_CASES = [
  {
    title: "Market Entry Analysis",
    description: "Six AI agents research, model, strategize, and critique your market entry plan in minutes.",
    icon: "📊",
  },
  {
    title: "Investment Due Diligence",
    description: "Get comprehensive financial, legal, and strategic analysis of any investment opportunity.",
    icon: "💰",
  },
  {
    title: "Competitive Intelligence",
    description: "Multi-angle competitive analysis with built-in devil's advocate to stress-test your strategy.",
    icon: "🎯",
  },
];

const SOCIAL_PROOF = [
  { metric: "6", label: "Specialized AI Agents" },
  { metric: "4", label: "Analysis Phases" },
  { metric: "<2min", label: "Average Run Time" },
  { metric: "100%", label: "Transparent Process" },
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
      if (res.ok) {
        setSubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Nav */}
      <nav className="border-b border-zinc-100 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-zinc-900">SoloFirm</span>
          <Link
            href="/dashboard"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            Try Demo
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
            Your AI-Powered
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Advisory Team
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600">
            Six specialized AI agents work in concert — researching, modeling, strategizing, and
            critiquing — to deliver comprehensive business analysis in under two minutes. Like
            having a full consulting team, without the retainer.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard"
              className="rounded-lg bg-zinc-900 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-zinc-700"
            >
              Start Free Analysis
            </Link>
            <a
              href="#how-it-works"
              className="rounded-lg border border-zinc-300 px-8 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="border-y border-zinc-100 bg-zinc-50 px-6 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
          {SOCIAL_PROOF.map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-3xl font-bold text-zinc-900">{item.metric}</p>
              <p className="mt-1 text-sm text-zinc-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works / Demo Animation */}
      <section id="how-it-works" className="px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">How It Works</h2>
          <p className="mt-4 text-zinc-600">Four phases, six agents, one comprehensive deliverable.</p>

          <div className="mt-16 grid gap-8 sm:grid-cols-4">
            {[
              { phase: "Phase 1", title: "Research & Finance", agents: "Research Agent + Finance Agent run in parallel", color: "bg-blue-100 text-blue-700" },
              { phase: "Phase 2", title: "Strategy & Legal", agents: "Strategy Agent + Legal Agent analyze Phase 1 findings", color: "bg-violet-100 text-violet-700" },
              { phase: "Phase 3", title: "Synthesis", agents: "Writer Agent creates unified executive deliverable", color: "bg-amber-100 text-amber-700" },
              { phase: "Phase 4", title: "Critical Review", agents: "Critic Agent identifies gaps and objections", color: "bg-emerald-100 text-emerald-700" },
            ].map((p) => (
              <div key={p.phase} className="rounded-xl border border-zinc-200 bg-white p-6 text-left shadow-sm">
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${p.color}`}>
                  {p.phase}
                </span>
                <h3 className="mt-3 font-semibold text-zinc-900">{p.title}</h3>
                <p className="mt-2 text-sm text-zinc-500">{p.agents}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="border-t border-zinc-100 bg-zinc-50 px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">What You Can Analyze</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {USE_CASES.map((uc) => (
              <div key={uc.title} className="rounded-xl border border-zinc-200 bg-white p-6 text-left shadow-sm">
                <span className="text-3xl">{uc.icon}</span>
                <h3 className="mt-3 font-semibold text-zinc-900">{uc.title}</h3>
                <p className="mt-2 text-sm text-zinc-500">{uc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Waitlist */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Get Early Access</h2>
          <p className="mt-4 text-zinc-600">
            Join the waitlist for priority access to advanced features, custom agents, and team plans.
          </p>
          {submitted ? (
            <div className="mt-8 rounded-lg bg-emerald-50 px-6 py-4 text-emerald-700">
              Thanks! We&apos;ll be in touch soon.
            </div>
          ) : (
            <form onSubmit={handleWaitlist} className="mt-8 flex gap-3 sm:justify-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:max-w-xs"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
              >
                {loading ? "..." : "Join Waitlist"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 px-6 py-8 text-center text-sm text-zinc-400">
        &copy; {new Date().getFullYear()} SoloFirm. AI-powered business intelligence.
      </footer>
    </div>
  );
}
