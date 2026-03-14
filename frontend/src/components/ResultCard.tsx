import { Badge } from "@/components/ui/badge";
import { EvidenceDrawer } from "./EvidenceDrawer";
import type { AnalysisResult, Verdict } from "@/hooks/useAnalysis";
import { CheckCircle2, AlertTriangle, HelpCircle, XCircle, Info, Flag, Scale, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const VERDICT_CONFIG: Record<Verdict, { color: string; glow: string; icon: any; label: string; bg: string }> = {
  REAL: { color: "text-green-400", glow: "shadow-green-500/20 shadow-[0_0_40px_-5px]", icon: CheckCircle2, label: "CERTIFIED REAL", bg: "bg-green-500/10" },
  FAKE: { color: "text-red-500", glow: "shadow-red-500/20 shadow-[0_0_40px_-5px]", icon: XCircle, label: "VERIFIED FAKE", bg: "bg-red-500/10" },
  MISLEADING: { color: "text-amber-400", glow: "shadow-amber-500/20 shadow-[0_0_40px_-5px]", icon: AlertTriangle, label: "MISLEADING CONTENT", bg: "bg-amber-500/10" },
  UNVERIFIABLE: { color: "text-slate-400", glow: "shadow-slate-500/20 shadow-[0_0_40px_-5px]", icon: HelpCircle, label: "UNVERIFIABLE", bg: "bg-slate-500/10" },
};

export function ResultCard({ result }: { result: AnalysisResult }) {
  const cfg = VERDICT_CONFIG[result.verdict];
  const pct = Math.round(result.confidence * 100);
  const Icon = cfg.icon;

  return (
    <div className={cn(
      "glass-card rounded-[2.5rem] p-1 overflow-hidden transition-all duration-700 animate-in zoom-in-95",
      cfg.glow
    )}>
      <div className="bg-slate-950/40 rounded-[2.4rem] p-8 space-y-8 backdrop-blur-2xl">
        {/* Verdict Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-white/5">
          <div className="flex items-center gap-6 text-center md:text-left">
            <div className={cn("p-5 rounded-3xl bg-white/5 border border-white/10", cfg.color)}>
              <Icon className="w-12 h-12" />
            </div>
            <div>
              <p className="text-xs font-black tracking-[0.3em] uppercase text-slate-500 mb-1">Detection Verdict</p>
              <h2 className={cn("text-3xl md:text-4xl font-black italic tracking-tighter", cfg.color)}>
                {cfg.label}
              </h2>
            </div>
          </div>

          {/* Circular Confidence Gauge */}
          <div className="relative group cursor-pointer">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-white/5"
              />
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={364.42}
                strokeDashoffset={364.42 - (364.42 * pct) / 100}
                strokeLinecap="round"
                className={cn("transition-all duration-[1500ms] cubic-bezier(0.4, 0, 0.2, 1)", cfg.color)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-1">
              <span className="text-3xl font-black text-white">{pct}%</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Confidence</span>
            </div>

            {/* Visual glow behind gauge */}
            <div className={cn("absolute inset-0 rounded-full blur-2xl opacity-20 -z-10", cfg.bg)} />
          </div>
        </div>

        {/* Summary */}
        <div className="relative p-6 rounded-3xl bg-white/[0.02] border border-white/5 italic text-slate-300 leading-relaxed font-medium">
          <div className="absolute -top-3 left-6 px-3 bg-[#0A0A0F] text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Info className="w-3 h-3" /> AI Summary
          </div>
          {result.summary}
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-red-500/[0.03] border border-red-500/10 space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2 rounded-xl bg-red-500/10">
                <Flag className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest">Risk Indicators</h4>
            </div>
            <ul className="space-y-3">
              {result.red_flags.map((f, i) => (
                <li key={i} className="text-sm text-slate-400 flex gap-3">
                  <span className="text-red-500/50 flex-shrink-0">•</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-green-500/[0.03] border border-green-500/10 space-y-4">
            <div className="flex items-center gap-3 text-green-400">
              <div className="p-2 rounded-xl bg-green-500/10">
                <Scale className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest">Supporting Proof</h4>
            </div>
            <ul className="space-y-3">
              {result.supporting_evidence.map((e, i) => (
                <li key={i} className="text-sm text-slate-400 flex gap-3">
                  <span className="text-green-500/50 flex-shrink-0">•</span>
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sources Drawer Integration */}
        <div className="pt-4 flex items-center justify-between">
          <Badge variant="outline" className="px-4 py-1.5 rounded-full border-white/10 bg-white/5 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
            <Zap className="w-3 h-3 mr-2 text-green-400" />
            Model: {result.groq_model_used}
          </Badge>
          <EvidenceDrawer sources={result.retrieved_sources} />
        </div>
      </div>
    </div>
  );

}
