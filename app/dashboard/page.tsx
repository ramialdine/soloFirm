import AgentOrchestrator from "@/components/AgentOrchestrator";
import Link from "next/link";

export const metadata = {
  title: "SoloFirm | Dashboard",
  description: "Run multi-agent business analysis",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900">
            SoloFirm
          </Link>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            Demo
          </span>
        </div>
      </nav>
      <AgentOrchestrator />
    </div>
  );
}
