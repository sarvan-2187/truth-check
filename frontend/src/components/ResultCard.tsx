import { Badge } from "@/components/ui/badge";
import { EvidenceDrawer } from "./EvidenceDrawer";
import type { AnalysisResult, Verdict } from "@/hooks/useAnalysis";
import { CheckCircle2, AlertTriangle, HelpCircle, XCircle, Flag, Scale, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const VERDICT_CONFIG: Record<Verdict, {
  color: string;
  dimColor: string;
  borderColor: string;
  bgColor: string;
  glowColor: string;
  icon: any;
  label: string;
  sublabel: string;
  barColor: string;
}> = {
  REAL: {
    color: "text-emerald-400",
    dimColor: "text-emerald-400/50",
    borderColor: "border-emerald-500/20",
    bgColor: "bg-emerald-500/[0.06]",
    glowColor: "rgba(52,211,153,0.12)",
    icon: CheckCircle2,
    label: "REAL",
    sublabel: "Content appears credible",
    barColor: "#34d399",
  },
  FAKE: {
    color: "text-red-400",
    dimColor: "text-red-400/50",
    borderColor: "border-red-500/20",
    bgColor: "bg-red-500/[0.06]",
    glowColor: "rgba(248,113,113,0.12)",
    icon: XCircle,
    label: "FAKE",
    sublabel: "Misinformation detected",
    barColor: "#f87171",
  },
  MISLEADING: {
    color: "text-amber-400",
    dimColor: "text-amber-400/50",
    borderColor: "border-amber-500/20",
    bgColor: "bg-amber-500/[0.06]",
    glowColor: "rgba(251,191,36,0.12)",
    icon: AlertTriangle,
    label: "MISLEADING",
    sublabel: "Partially accurate — use caution",
    barColor: "#fbbf24",
  },
  UNVERIFIABLE: {
    color: "text-slate-400",
    dimColor: "text-slate-400/50",
    borderColor: "border-slate-500/20",
    bgColor: "bg-slate-500/[0.06]",
    glowColor: "rgba(148,163,184,0.08)",
    icon: HelpCircle,
    label: "UNVERIFIABLE",
    sublabel: "Insufficient evidence to determine",
    barColor: "#94a3b8",
  },
};

// Confidence arc (SVG-based, no rotation hack)
function ConfidenceArc({ pct, color }: { pct: number; color: string }) {
  const r = 40;
  const cx = 52;
  const cy = 52;
  const circumference = 2 * Math.PI * r;
  const arc = (pct / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 104, height: 104 }}>
      <svg width="104" height="104" viewBox="0 0 104 104">
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        {/* Progress arc — starts at top */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circumference}`}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 6px ${color}60)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-white leading-none">{pct}%</span>
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">confidence</span>
      </div>
    </div>
  );
}

// Collapsible list section
function ListSection({
  icon: Icon,
  title,
  items,
  accentColor,
  borderColor,
  bgColor,
  bulletColor,
}: {
  icon: any;
  title: string;
  items: string[];
  accentColor: string;
  borderColor: string;
  bgColor: string;
  bulletColor: string;
}) {
  const [expanded, setExpanded] = useState(true);
  const visible = expanded ? items : items.slice(0, 2);

  return (
    <div className={cn("rounded-xl border p-4 space-y-3 transition-colors", borderColor, bgColor)}>
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex items-center gap-2">
          <Icon className={cn("w-3.5 h-3.5", accentColor)} />
          <span className={cn("text-[10px] font-black uppercase tracking-[0.15em]", accentColor)}>{title}</span>
          <span className="text-[9px] font-mono text-slate-600 ml-1">({items.length})</span>
        </div>
        {items.length > 2 && (
          expanded
            ? <ChevronUp className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-colors" />
            : <ChevronDown className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-colors" />
        )}
      </button>
      <ul className="space-y-2">
        {visible.map((item, i) => (
          <li key={i} className="flex gap-2.5 text-xs text-slate-400 leading-relaxed">
            <span className={cn("flex-shrink-0 mt-1.5 w-1 h-1 rounded-full", bulletColor)} />
            {item}
          </li>
        ))}
      </ul>
      {!expanded && items.length > 2 && (
        <button
          onClick={() => setExpanded(true)}
          className={cn("text-[10px] font-mono hover:opacity-80 transition-opacity", accentColor)}
        >
          +{items.length - 2} more
        </button>
      )}
    </div>
  );
}

export function ResultCard({ result }: { result: AnalysisResult }) {
  const cfg = VERDICT_CONFIG[result.verdict];
  const pct = Math.round(result.confidence * 100);
  const Icon = cfg.icon;

  const formattedDate = new Date(result.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="rounded-2xl overflow-hidden border transition-all duration-700"
      style={{
        borderColor: `rgba(255,255,255,0.06)`,
        background: `radial-gradient(ellipse 100% 60% at 50% 0%, ${cfg.glowColor}, transparent 60%), rgba(10,10,18,0.8)`,
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Top verdict bar */}
      <div className={cn("px-6 py-4 border-b border-white/[0.04] flex items-center justify-between", cfg.bgColor)}>
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg bg-white/5 border", cfg.borderColor)}>
            <Icon className={cn("w-5 h-5", cfg.color)} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={cn("text-lg font-black tracking-[-0.02em]", cfg.color)}>{cfg.label}</h2>
              {/* Confidence inline badge */}
              <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded-full border", cfg.borderColor, cfg.color, cfg.bgColor)}>
                {pct}%
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">{cfg.sublabel}</p>
          </div>
        </div>
        <ConfidenceArc pct={pct} color={cfg.barColor} />
      </div>

      <div className="p-6 space-y-5">
        {/* Summary */}
        <div className="relative">
          <div className={cn("absolute left-0 top-0 bottom-0 w-0.5 rounded-full", cfg.bgColor.replace("bg-", "bg-").replace("/[0.06]", "/30"))}
            style={{ background: `linear-gradient(to bottom, ${cfg.barColor}50, transparent)` }}
          />
          <div className="pl-4">
            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-2">AI Analysis</p>
            <p className="text-sm text-slate-300 leading-relaxed">{result.summary}</p>
          </div>
        </div>

        {/* Input preview */}
        {result.input_preview && (
          <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
            <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mb-1.5">Analyzed content preview</p>
            <p className="text-[11px] text-slate-500 font-mono leading-relaxed line-clamp-2">{result.input_preview}</p>
          </div>
        )}

        {/* Flags & Evidence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {result.red_flags.length > 0 && (
            <ListSection
              icon={Flag}
              title="Risk Indicators"
              items={result.red_flags}
              accentColor="text-red-400"
              borderColor="border-red-500/10"
              bgColor="bg-red-500/[0.03]"
              bulletColor="bg-red-500/50"
            />
          )}
          {result.supporting_evidence.length > 0 && (
            <ListSection
              icon={Scale}
              title="Supporting Proof"
              items={result.supporting_evidence}
              accentColor="text-emerald-400"
              borderColor="border-emerald-500/10"
              bgColor="bg-emerald-500/[0.03]"
              bulletColor="bg-emerald-500/50"
            />
          )}
        </div>

        {/* Footer */}
        <div className="pt-1 flex items-center justify-between border-t border-white/[0.04]">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-2.5 py-1 rounded-lg border-white/[0.06] bg-white/[0.03] text-[9px] font-mono text-slate-600 uppercase tracking-widest gap-1.5">
              <Zap className="w-2.5 h-2.5 text-green-400/60" />
              {result.groq_model_used.split("-").slice(0, 2).join("-")}
            </Badge>
            <span className="text-[9px] font-mono text-slate-700">{formattedDate}</span>
          </div>
          <EvidenceDrawer sources={result.retrieved_sources} />
        </div>
      </div>
    </div>
  );
}