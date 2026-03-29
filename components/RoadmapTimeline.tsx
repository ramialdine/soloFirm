"use client";

import { useState } from "react";
import type { RoadmapStep, RoadmapStepStatus, AgentId } from "@/types/agents";
import { AGENT_META } from "@/types/agents";

// Secretary of State filing URLs by state and entity type
const SOS_URLS: Record<string, Record<string, string>> = {
  Alabama: { LLC: "https://www.sos.alabama.gov/business-entities/llc", "S-Corp": "https://www.sos.alabama.gov/business-entities/corporations", "C-Corp": "https://www.sos.alabama.gov/business-entities/corporations", "Sole Proprietorship": "https://www.sos.alabama.gov/business-entities" },
  Alaska: { LLC: "https://www.commerce.alaska.gov/web/cbpl/businesslicensing", "S-Corp": "https://www.commerce.alaska.gov/web/cbpl/businesslicensing", "C-Corp": "https://www.commerce.alaska.gov/web/cbpl/businesslicensing", "Sole Proprietorship": "https://www.commerce.alaska.gov/web/cbpl/businesslicensing" },
  Arizona: { LLC: "https://ecorp.azcc.gov/BusinessSearch", "S-Corp": "https://ecorp.azcc.gov/BusinessSearch", "C-Corp": "https://ecorp.azcc.gov/BusinessSearch", "Sole Proprietorship": "https://azsos.gov/business/trade-names" },
  Arkansas: { LLC: "https://www.sos.arkansas.gov/corps/search_all.php", "S-Corp": "https://www.sos.arkansas.gov/corps/search_all.php", "C-Corp": "https://www.sos.arkansas.gov/corps/search_all.php", "Sole Proprietorship": "https://www.sos.arkansas.gov" },
  California: { LLC: "https://bizfileonline.sos.ca.gov/", "S-Corp": "https://bizfileonline.sos.ca.gov/", "C-Corp": "https://bizfileonline.sos.ca.gov/", "Sole Proprietorship": "https://www.sos.ca.gov/business-programs/business-entities/fictitious-business-name" },
  Colorado: { LLC: "https://myofiling.sos.state.co.us/", "S-Corp": "https://myofiling.sos.state.co.us/", "C-Corp": "https://myofiling.sos.state.co.us/", "Sole Proprietorship": "https://myofiling.sos.state.co.us/" },
  Connecticut: { LLC: "https://service.ct.gov/business/s/onlinebusiness", "S-Corp": "https://service.ct.gov/business/s/onlinebusiness", "C-Corp": "https://service.ct.gov/business/s/onlinebusiness", "Sole Proprietorship": "https://service.ct.gov/business/s/onlinebusiness" },
  Delaware: { LLC: "https://icis.corp.delaware.gov/Ecorp/EntitySearch/NameSearch.aspx", "S-Corp": "https://icis.corp.delaware.gov/Ecorp/EntitySearch/NameSearch.aspx", "C-Corp": "https://icis.corp.delaware.gov/Ecorp/EntitySearch/NameSearch.aspx", "Sole Proprietorship": "https://sos.delaware.gov/business-services/" },
  Florida: { LLC: "https://dos.fl.gov/sunbiz/manage-e-file/", "S-Corp": "https://dos.fl.gov/sunbiz/manage-e-file/", "C-Corp": "https://dos.fl.gov/sunbiz/manage-e-file/", "Sole Proprietorship": "https://dos.fl.gov/sunbiz/manage-e-file/" },
  Georgia: { LLC: "https://ecorp.sos.ga.gov/", "S-Corp": "https://ecorp.sos.ga.gov/", "C-Corp": "https://ecorp.sos.ga.gov/", "Sole Proprietorship": "https://ecorp.sos.ga.gov/" },
  Hawaii: { LLC: "https://hbe.ehawaii.gov/documents/home.html", "S-Corp": "https://hbe.ehawaii.gov/documents/home.html", "C-Corp": "https://hbe.ehawaii.gov/documents/home.html", "Sole Proprietorship": "https://hbe.ehawaii.gov/documents/home.html" },
  Idaho: { LLC: "https://sos.idaho.gov/business-services/business-entity-filing/", "S-Corp": "https://sos.idaho.gov/business-services/business-entity-filing/", "C-Corp": "https://sos.idaho.gov/business-services/business-entity-filing/", "Sole Proprietorship": "https://sos.idaho.gov" },
  Illinois: { LLC: "https://www.ilsos.gov/departments/business_services/home.html", "S-Corp": "https://www.ilsos.gov/departments/business_services/home.html", "C-Corp": "https://www.ilsos.gov/departments/business_services/home.html", "Sole Proprietorship": "https://www.ilsos.gov" },
  Indiana: { LLC: "https://inbiz.in.gov/", "S-Corp": "https://inbiz.in.gov/", "C-Corp": "https://inbiz.in.gov/", "Sole Proprietorship": "https://inbiz.in.gov/" },
  Iowa: { LLC: "https://sos.iowa.gov/business/filingforms.html", "S-Corp": "https://sos.iowa.gov/business/filingforms.html", "C-Corp": "https://sos.iowa.gov/business/filingforms.html", "Sole Proprietorship": "https://sos.iowa.gov" },
  Kansas: { LLC: "https://www.sos.ks.gov/business/business.html", "S-Corp": "https://www.sos.ks.gov/business/business.html", "C-Corp": "https://www.sos.ks.gov/business/business.html", "Sole Proprietorship": "https://www.sos.ks.gov" },
  Kentucky: { LLC: "https://sos.ky.gov/bus/business-filings/Pages/default.aspx", "S-Corp": "https://sos.ky.gov/bus/business-filings/Pages/default.aspx", "C-Corp": "https://sos.ky.gov/bus/business-filings/Pages/default.aspx", "Sole Proprietorship": "https://sos.ky.gov" },
  Louisiana: { LLC: "https://www.sos.la.gov/BusinessServices/", "S-Corp": "https://www.sos.la.gov/BusinessServices/", "C-Corp": "https://www.sos.la.gov/BusinessServices/", "Sole Proprietorship": "https://www.sos.la.gov/BusinessServices/" },
  Maine: { LLC: "https://www.maine.gov/sos/cec/corp/", "S-Corp": "https://www.maine.gov/sos/cec/corp/", "C-Corp": "https://www.maine.gov/sos/cec/corp/", "Sole Proprietorship": "https://www.maine.gov/sos/cec/corp/" },
  Maryland: { LLC: "https://egov.maryland.gov/businessexpress/", "S-Corp": "https://egov.maryland.gov/businessexpress/", "C-Corp": "https://egov.maryland.gov/businessexpress/", "Sole Proprietorship": "https://egov.maryland.gov/businessexpress/" },
  Massachusetts: { LLC: "https://corp.sec.state.ma.us/CorpWeb/CorpSearch/CorpSearch.aspx", "S-Corp": "https://corp.sec.state.ma.us/CorpWeb/CorpSearch/CorpSearch.aspx", "C-Corp": "https://corp.sec.state.ma.us/CorpWeb/CorpSearch/CorpSearch.aspx", "Sole Proprietorship": "https://www.sec.state.ma.us/cor/coridx.htm" },
  Michigan: { LLC: "https://www.michigan.gov/lara/bureau-list/corporations", "S-Corp": "https://www.michigan.gov/lara/bureau-list/corporations", "C-Corp": "https://www.michigan.gov/lara/bureau-list/corporations", "Sole Proprietorship": "https://www.michigan.gov/lara/bureau-list/corporations" },
  Minnesota: { LLC: "https://mblsportal.sos.state.mn.us/", "S-Corp": "https://mblsportal.sos.state.mn.us/", "C-Corp": "https://mblsportal.sos.state.mn.us/", "Sole Proprietorship": "https://mblsportal.sos.state.mn.us/" },
  Mississippi: { LLC: "https://www.sos.ms.gov/business-services/", "S-Corp": "https://www.sos.ms.gov/business-services/", "C-Corp": "https://www.sos.ms.gov/business-services/", "Sole Proprietorship": "https://www.sos.ms.gov" },
  Missouri: { LLC: "https://www.sos.mo.gov/business/corporations/", "S-Corp": "https://www.sos.mo.gov/business/corporations/", "C-Corp": "https://www.sos.mo.gov/business/corporations/", "Sole Proprietorship": "https://www.sos.mo.gov" },
  Montana: { LLC: "https://biz.sosmt.gov/", "S-Corp": "https://biz.sosmt.gov/", "C-Corp": "https://biz.sosmt.gov/", "Sole Proprietorship": "https://biz.sosmt.gov/" },
  Nebraska: { LLC: "https://www.nebraska.gov/sos/corp/corpsearch.cgi", "S-Corp": "https://www.nebraska.gov/sos/corp/corpsearch.cgi", "C-Corp": "https://www.nebraska.gov/sos/corp/corpsearch.cgi", "Sole Proprietorship": "https://sos.nebraska.gov" },
  Nevada: { LLC: "https://esos.nv.gov/EntitySearch/OnlineEntitySearch", "S-Corp": "https://esos.nv.gov/EntitySearch/OnlineEntitySearch", "C-Corp": "https://esos.nv.gov/EntitySearch/OnlineEntitySearch", "Sole Proprietorship": "https://esos.nv.gov" },
  "New Hampshire": { LLC: "https://www.sos.nh.gov/corporations/", "S-Corp": "https://www.sos.nh.gov/corporations/", "C-Corp": "https://www.sos.nh.gov/corporations/", "Sole Proprietorship": "https://www.sos.nh.gov" },
  "New Jersey": { LLC: "https://www.njportal.com/dor/businessrecords/", "S-Corp": "https://www.njportal.com/dor/businessrecords/", "C-Corp": "https://www.njportal.com/dor/businessrecords/", "Sole Proprietorship": "https://www.njportal.com/dor/businessrecords/" },
  "New Mexico": { LLC: "https://portal.sos.state.nm.us/BFS/online/CorporationBusinessSearch", "S-Corp": "https://portal.sos.state.nm.us/BFS/online/CorporationBusinessSearch", "C-Corp": "https://portal.sos.state.nm.us/BFS/online/CorporationBusinessSearch", "Sole Proprietorship": "https://www.sos.state.nm.us" },
  "New York": { LLC: "https://apps.dos.ny.gov/corpweb/controller/application?execution=e1s1", "S-Corp": "https://apps.dos.ny.gov/corpweb/controller/application?execution=e1s1", "C-Corp": "https://apps.dos.ny.gov/corpweb/controller/application?execution=e1s1", "Sole Proprietorship": "https://www.dos.ny.gov/corps/" },
  "North Carolina": { LLC: "https://www.sosnc.gov/online_services/business_registration/", "S-Corp": "https://www.sosnc.gov/online_services/business_registration/", "C-Corp": "https://www.sosnc.gov/online_services/business_registration/", "Sole Proprietorship": "https://www.sosnc.gov" },
  "North Dakota": { LLC: "https://firststop.sos.nd.gov/", "S-Corp": "https://firststop.sos.nd.gov/", "C-Corp": "https://firststop.sos.nd.gov/", "Sole Proprietorship": "https://firststop.sos.nd.gov/" },
  Ohio: { LLC: "https://businesssearch.ohiosos.gov/", "S-Corp": "https://businesssearch.ohiosos.gov/", "C-Corp": "https://businesssearch.ohiosos.gov/", "Sole Proprietorship": "https://www.ohiosos.gov" },
  Oklahoma: { LLC: "https://www.sos.ok.gov/corp/corpInquiryFind.aspx", "S-Corp": "https://www.sos.ok.gov/corp/corpInquiryFind.aspx", "C-Corp": "https://www.sos.ok.gov/corp/corpInquiryFind.aspx", "Sole Proprietorship": "https://www.sos.ok.gov" },
  Oregon: { LLC: "https://sos.oregon.gov/business/pages/find.aspx", "S-Corp": "https://sos.oregon.gov/business/pages/find.aspx", "C-Corp": "https://sos.oregon.gov/business/pages/find.aspx", "Sole Proprietorship": "https://sos.oregon.gov/business" },
  Pennsylvania: { LLC: "https://www.corporations.pa.gov/search/corpsearch", "S-Corp": "https://www.corporations.pa.gov/search/corpsearch", "C-Corp": "https://www.corporations.pa.gov/search/corpsearch", "Sole Proprietorship": "https://www.dos.pa.gov/BusinessCharities/Business" },
  "Rhode Island": { LLC: "https://business.sos.ri.gov/CorpWeb/CorpSearch/CorpSearch.aspx", "S-Corp": "https://business.sos.ri.gov/CorpWeb/CorpSearch/CorpSearch.aspx", "C-Corp": "https://business.sos.ri.gov/CorpWeb/CorpSearch/CorpSearch.aspx", "Sole Proprietorship": "https://www.sos.ri.gov" },
  "South Carolina": { LLC: "https://businessfilings.sc.gov/", "S-Corp": "https://businessfilings.sc.gov/", "C-Corp": "https://businessfilings.sc.gov/", "Sole Proprietorship": "https://businessfilings.sc.gov/" },
  "South Dakota": { LLC: "https://sosenterprise.sd.gov/BusinessServices/Business/FilingSearch.aspx", "S-Corp": "https://sosenterprise.sd.gov/BusinessServices/Business/FilingSearch.aspx", "C-Corp": "https://sosenterprise.sd.gov/BusinessServices/Business/FilingSearch.aspx", "Sole Proprietorship": "https://sdsos.gov" },
  Tennessee: { LLC: "https://tnbear.tn.gov/", "S-Corp": "https://tnbear.tn.gov/", "C-Corp": "https://tnbear.tn.gov/", "Sole Proprietorship": "https://tnbear.tn.gov/" },
  Texas: { LLC: "https://www.sos.state.tx.us/corp/sosda/index.shtml", "S-Corp": "https://www.sos.state.tx.us/corp/sosda/index.shtml", "C-Corp": "https://www.sos.state.tx.us/corp/sosda/index.shtml", "Sole Proprietorship": "https://www.sos.state.tx.us" },
  Utah: { LLC: "https://secure.utah.gov/bes/", "S-Corp": "https://secure.utah.gov/bes/", "C-Corp": "https://secure.utah.gov/bes/", "Sole Proprietorship": "https://secure.utah.gov/bes/" },
  Vermont: { LLC: "https://bizfilings.vermont.gov/online/Filings/", "S-Corp": "https://bizfilings.vermont.gov/online/Filings/", "C-Corp": "https://bizfilings.vermont.gov/online/Filings/", "Sole Proprietorship": "https://sos.vermont.gov/corporations/" },
  Virginia: { LLC: "https://cis.scc.virginia.gov/", "S-Corp": "https://cis.scc.virginia.gov/", "C-Corp": "https://cis.scc.virginia.gov/", "Sole Proprietorship": "https://www.scc.virginia.gov/pages/Fictitious-Names" },
  Washington: { LLC: "https://ccfs.sos.wa.gov/", "S-Corp": "https://ccfs.sos.wa.gov/", "C-Corp": "https://ccfs.sos.wa.gov/", "Sole Proprietorship": "https://ccfs.sos.wa.gov/" },
  "West Virginia": { LLC: "https://apps.wv.gov/SOS/BusinessEntitySearch/", "S-Corp": "https://apps.wv.gov/SOS/BusinessEntitySearch/", "C-Corp": "https://apps.wv.gov/SOS/BusinessEntitySearch/", "Sole Proprietorship": "https://apps.wv.gov/SOS/BusinessEntitySearch/" },
  Wisconsin: { LLC: "https://www.wdfi.org/apps/CorpSearch/Search.aspx", "S-Corp": "https://www.wdfi.org/apps/CorpSearch/Search.aspx", "C-Corp": "https://www.wdfi.org/apps/CorpSearch/Search.aspx", "Sole Proprietorship": "https://www.wdfi.org" },
  Wyoming: { LLC: "https://wyobiz.wyo.gov/Business/FilingSearch.aspx", "S-Corp": "https://wyobiz.wyo.gov/Business/FilingSearch.aspx", "C-Corp": "https://wyobiz.wyo.gov/Business/FilingSearch.aspx", "Sole Proprietorship": "https://wyobiz.wyo.gov" },
};

const EIN_URL = "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online";

function isEntityStep(step: RoadmapStep): boolean {
  return /register.*business|file.*llc|incorporate|articles.*organization|business formation|\bentity\b|business structure/i.test(step.title + " " + step.id);
}

function isEINStep(step: RoadmapStep): boolean {
  return /ein|employer identification|tax id/i.test(step.title + " " + step.id);
}

function resolveActionUrl(step: RoadmapStep, businessState?: string, businessStructure?: string): string | undefined {
  if (isEINStep(step)) return EIN_URL;
  if (isEntityStep(step) && businessState && businessStructure) {
    const stateUrls = SOS_URLS[businessState];
    if (stateUrls) return stateUrls[businessStructure] ?? stateUrls["LLC"];
  }
  return step.actionUrl;
}

/** States that have PDF form filling support */
const FORM_FILL_STATES = new Set(["Rhode Island"]);

interface RoadmapTimelineProps {
  steps: RoadmapStep[];
  accentColor?: string;
  onViewAgent?: (agentId: AgentId) => void;
  selectedBusinessStructure?: string;
  onBusinessStructureChange?: (value: string) => void;
  businessStructureOptions?: string[];
  businessState?: string;
  runId?: string;
  businessName?: string;
  teamSize?: string;
}

// Group steps by phase
function groupByPhase(steps: RoadmapStep[]): { phase: string; steps: RoadmapStep[] }[] {
  const groups: { phase: string; steps: RoadmapStep[] }[] = [];
  for (const step of steps) {
    const last = groups[groups.length - 1];
    if (last && last.phase === step.phase) {
      last.steps.push(step);
    } else {
      groups.push({ phase: step.phase, steps: [step] });
    }
  }
  return groups;
}

export default function RoadmapTimeline({
  steps,
  accentColor = "#10b981",
  onViewAgent,
  selectedBusinessStructure,
  onBusinessStructureChange,
  businessStructureOptions,
  businessState,
  runId,
  businessName,
  teamSize,
}: RoadmapTimelineProps) {
  const storageKey = runId ? `solofirm_roadmap_${runId}` : "solofirm_roadmap_progress";
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Track which steps the user has checked off (persisted to localStorage per run)
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const toggleComplete = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try { localStorage.setItem(storageKey, JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  };

  const getStatus = (step: RoadmapStep, index: number): RoadmapStepStatus => {
    if (completed.has(step.id)) return "complete";
    // First uncompleted step is "current"
    const firstUncompleted = steps.findIndex((s) => !completed.has(s.id));
    if (index === firstUncompleted) return "current";
    return "upcoming";
  };

  const completedCount = steps.filter((s) => completed.has(s.id)).length;
  const progress = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  const phaseGroups = groupByPhase(steps);

  const canFillPdf =
    businessState &&
    FORM_FILL_STATES.has(businessState) &&
    selectedBusinessStructure === "LLC" &&
    businessName;

  const handleDownloadPdf = async () => {
    if (!businessName || !businessState) return;
    setPdfLoading(true);
    setPdfError(null);
    try {
      const res = await fetch("/api/docs/fill-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          teamSize: teamSize ?? "Solo",
          state: businessState,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error ?? "Failed to generate PDF");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${businessName.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "-")}-Articles-of-Organization.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : "Failed to generate PDF");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with progress */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-zinc-900">Your Launch Roadmap</h3>
          <p className="text-sm text-zinc-500 mt-0.5">
            {completedCount} of {steps.length} steps complete
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3 w-32 rounded-full bg-zinc-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: accentColor }}
            />
          </div>
          <span className="text-sm font-semibold" style={{ color: accentColor }}>
            {progress}%
          </span>
        </div>
      </div>

      {/* Phase groups */}
      {phaseGroups.map((group) => (
        <div key={group.phase}>
          {/* Phase header */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className="h-px flex-1"
              style={{ backgroundColor: `${accentColor}30` }}
            />
            <span
              className="text-xs font-bold uppercase tracking-widest px-2"
              style={{ color: accentColor }}
            >
              {group.phase}
            </span>
            <div
              className="h-px flex-1"
              style={{ backgroundColor: `${accentColor}30` }}
            />
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Vertical timeline line */}
            <div
              className="absolute left-[15px] top-0 bottom-0 w-px"
              style={{ backgroundColor: `${accentColor}20` }}
            />

            <div className="space-y-1">
              {group.steps.map((step) => {
                const globalIndex = steps.indexOf(step);
                const status = getStatus(step, globalIndex);
                const isExpanded = expandedStep === step.id;

                return (
                  <div key={step.id} className="relative pl-10">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-3">
                      <button
                        type="button"
                        onClick={() => toggleComplete(step.id)}
                        className={`flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 transition-all ${
                          status === "complete"
                            ? "border-transparent text-white"
                            : status === "current"
                              ? "border-transparent text-white shadow-md"
                              : "border-zinc-200 bg-white text-zinc-300 hover:border-zinc-300"
                        }`}
                        style={
                          status === "complete"
                            ? { backgroundColor: accentColor }
                            : status === "current"
                              ? { backgroundColor: accentColor, boxShadow: `0 0 0 4px ${accentColor}20` }
                              : undefined
                        }
                      >
                        {status === "complete" ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        ) : status === "current" ? (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M5 3l14 9-14 9V3z" />
                          </svg>
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-zinc-200" />
                        )}
                      </button>
                    </div>

                    {/* Step card */}
                    <div
                      className={`rounded-xl border transition-all ${
                        status === "complete"
                          ? "border-zinc-100 bg-zinc-50/50"
                          : status === "current"
                            ? "border-zinc-200 bg-white shadow-sm"
                            : "border-zinc-100 bg-white"
                      }`}
                      style={
                        status === "current"
                          ? { boxShadow: `0 0 0 1px ${accentColor}30, 0 1px 3px rgba(0,0,0,0.05)` }
                          : undefined
                      }
                    >
                      {/* Step header — always visible */}
                      <button
                        type="button"
                        onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-sm font-semibold ${
                                status === "complete" ? "text-zinc-400 line-through" : "text-zinc-900"
                              }`}
                            >
                              {step.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-zinc-400">{step.week}</span>
                            {step.estimatedTime && (
                              <span className="text-xs text-zinc-400">{step.estimatedTime}</span>
                            )}
                            {step.cost && step.cost !== "Free" && (
                              <span className="text-xs text-zinc-400">{step.cost}</span>
                            )}
                            {step.cost === "Free" && (
                              <span className="text-xs font-medium" style={{ color: accentColor }}>Free</span>
                            )}
                          </div>
                        </div>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`shrink-0 text-zinc-300 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>

                      {/* Expanded detail panel */}
                      {isExpanded && (
                        <div className="border-t border-zinc-100 px-4 py-4 space-y-3">
                          {/* Why it matters */}
                          <div>
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                              Why this matters
                            </p>
                            <p className="text-sm text-zinc-700 leading-relaxed">{step.why}</p>
                          </div>

                          {/* What's prepared */}
                          <div
                            className="rounded-lg px-3 py-2.5"
                            style={{ backgroundColor: `${accentColor}08` }}
                          >
                            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: accentColor }}>
                              Already prepared for you
                            </p>
                            <p className="text-sm text-zinc-700 leading-relaxed">{step.prepared}</p>
                            {step.agentId && onViewAgent && (
                              <button
                                type="button"
                                onClick={() => onViewAgent(step.agentId!)}
                                className="mt-1.5 text-xs font-medium hover:underline"
                                style={{ color: accentColor }}
                              >
                                View {AGENT_META[step.agentId].label} output →
                              </button>
                            )}
                          </div>

                          {/* Business structure selector for entity step */}
                          {(step.id === "choose-entity" || /business structure/i.test(step.title)) && (
                            <div>
                              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                                Choose your business structure
                              </p>
                              <select
                                value={selectedBusinessStructure ?? ""}
                                onChange={(e) => onBusinessStructureChange?.(e.target.value)}
                                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-zinc-400 focus:outline-none"
                              >
                                {(businessStructureOptions?.length
                                  ? businessStructureOptions
                                  : ["LLC", "S-Corp", "C-Corp", "Sole Proprietorship", "Not sure"]
                                ).map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          {/* Exact next action */}
                          <div>
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                              Your next action
                            </p>
                            <p className="text-sm text-zinc-800 font-medium leading-relaxed">{step.action}</p>
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            {(() => {
                              const url = resolveActionUrl(step, businessState, selectedBusinessStructure);
                              if (!url) return null;
                              const label = isEntityStep(step)
                                ? `File ${selectedBusinessStructure ?? "LLC"} →`
                                : isEINStep(step)
                                  ? "Apply for EIN →"
                                  : "Go to site";
                              return (
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors"
                                  style={{ backgroundColor: accentColor }}
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                                    <path d="M15 3h6v6" />
                                    <path d="M10 14L21 3" />
                                  </svg>
                                  {label}
                                </a>
                              );
                            })()}
                            {isEntityStep(step) && canFillPdf && (
                              <button
                                type="button"
                                onClick={handleDownloadPdf}
                                disabled={pdfLoading}
                                className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-50"
                              >
                                {pdfLoading ? (
                                  <>
                                    <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
                                    </svg>
                                    Generating...
                                  </>
                                ) : (
                                  <>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                                      <polyline points="7 10 12 15 17 10"/>
                                      <line x1="12" y1="15" x2="12" y2="3"/>
                                    </svg>
                                    Download Pre-filled Form
                                  </>
                                )}
                              </button>
                            )}
                            {pdfError && isEntityStep(step) && (
                              <p className="text-xs text-red-500 w-full">{pdfError}</p>
                            )}
                            <button
                              type="button"
                              onClick={() => toggleComplete(step.id)}
                              className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-medium transition-colors ${
                                status === "complete"
                                  ? "border-zinc-200 text-zinc-500 hover:text-zinc-700"
                                  : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                              }`}
                            >
                              {status === "complete" ? (
                                "Undo"
                              ) : (
                                <>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 6L9 17l-5-5" />
                                  </svg>
                                  Mark complete
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
