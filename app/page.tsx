"use client";

import { useState } from "react";
import Link from "next/link";

const USE_CASES = [
  {
    title: "Start a Business",
    description: "From idea to LLC formation, EIN, bank account setup, and a 90-day launch plan — all in one session.",
    icon: "🚀",
  },
  {
    title: "Get Your Legal Docs",
    description: "Operating agreements, articles of organization, compliance checklists — drafted for your state and entity type.",
    icon: "📋",
  },
  {
    title: "Build Your Brand",
    description: "Positioning, taglines, color palette, logo direction, and launch messaging ready for a designer.",
    icon: "🎨",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Describe Your Business",
    description: "Tell us your idea, location, budget, and team size. Upload any docs you have.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    step: "2",
    title: "Answer a Few Questions",
    description: "Our AI consultant asks targeted follow-ups to nail down the right plan for you.",
    color: "bg-violet-100 text-violet-700",
  },
  {
    step: "3",
    title: "Agents Build Your Package",
    description: "Six specialized agents work in parallel — legal, finance, research, branding, planning, and review.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    step: "4",
    title: "Get Your Launch Package",
    description: "Real documents, actionable plans, and step-by-step guidance you can execute today.",
    color: "bg-emerald-100 text-emerald-700",
  },
];

const SOCIAL_PROOF = [
  { metric: "6", label: "Specialized AI Agents" },
  { metric: "4", label: "Phases of Analysis" },
  { metric: "<3min", label: "To Full Package" },
  { metric: "$0", label: "vs. $5-10k at a Firm" },
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
      <nav className="border-b border-zinc-100 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-zinc-900">SoloFirm</span>
          <Link
            href="/dashboard"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            Launch Your Business →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
            Everything You Need to
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Launch Your Business
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600">
            Six AI agents work together to produce your complete business launch package —
            LLC docs, financial setup, brand identity, and a 90-day action plan.
            Like hiring a $10k consulting firm, in under 3 minutes.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard"
              className="rounded-lg bg-zinc-900 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-zinc-700"
            >
              Start Free — Launch Your Business
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

      {/* Social Proof */}
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

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">How It Works</h2>
          <p className="mt-4 text-zinc-600">From idea to launch-ready in four steps.</p>
          <div className="mt-16 grid gap-8 sm:grid-cols-4">
            {HOW_IT_WORKS.map((p) => (
              <div key={p.step} className="rounded-xl border border-zinc-200 bg-white p-6 text-left shadow-sm">
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${p.color}`}>
                  Step {p.step}
                </span>
                <h3 className="mt-3 font-semibold text-zinc-900">{p.title}</h3>
                <p className="mt-2 text-sm text-zinc-500">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="border-t border-zinc-100 bg-zinc-50 px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">What You Get</h2>
          <p className="mt-4 text-zinc-600">Real deliverables, not generic advice.</p>
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

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Get Early Access</h2>
          <p className="mt-4 text-zinc-600">
            Join the waitlist for priority access to custom agents, document export, and team features.
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
                {loading ? "…" : "Join Waitlist"}
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="border-t border-zinc-100 px-6 py-8 text-center text-sm text-zinc-400">
        &copy; {new Date().getFullYear()} SoloFirm. AI-powered business launch platform.
      </footer>
    </div>
  );
}
