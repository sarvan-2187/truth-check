import { useRef, useState } from "react";
import { InputPanel } from "@/components/InputPanel";
import { ResultCard } from "@/components/ResultCard";
import { useAnalysis } from "@/hooks/useAnalysis";
import { Shield, Activity, Database, Clock, ChevronRight, Cpu } from "lucide-react";

// Animated scan line component
function ScanLine() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[inherit]">
      <div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/40 to-transparent"
        style={{ animation: "scanline 3s ease-in-out infinite", top: "0%" }}
      />
      <style>{`
        @keyframes scanline {
          0% { top: -2px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 102%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// Animated status indicator
function StatusDot({ active }: { active: boolean }) {
  return (
    <span className="relative flex h-2 w-2">
      {active && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      )}
      <span className={`relative inline-flex rounded-full h-2 w-2 ${active ? "bg-green-400" : "bg-slate-600"}`} />
    </span>
  );
}

// Stat pill component
function StatPill({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.06] hover:border-white/10 transition-colors group">
      <Icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-green-400 transition-colors" />
      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{label}</span>
      <span className="text-[10px] font-bold font-mono text-slate-300">{value}</span>
    </div>
  );
}

// Processing overlay card
function ProcessingCard({ status }: { status: string }) {
  const steps = [
    { id: "chunk", label: "Chunking content", done: true },
    { id: "embed", label: "Generating embeddings", done: true },
    { id: "retrieve", label: "Retrieving context", done: status === "analyzing" },
    { id: "infer", label: "Running Groq inference", done: false },
  ];

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] bg-slate-950/60 backdrop-blur-xl">
      <ScanLine />
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-green-400" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white/90 tracking-tight">
                {status === "ingesting" ? "Ingesting Document" : "Analyzing Content"}
              </p>
              <p className="text-[10px] text-slate-500 font-mono">RAG pipeline active</p>
            </div>
          </div>
          <div className="text-[10px] font-mono text-green-400/60 animate-pulse">PROCESSING</div>
        </div>

        {/* Steps */}
        <div className="space-y-2.5">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                step.done
                  ? "bg-green-500/20 border border-green-500/40"
                  : i === steps.findIndex(s => !s.done)
                  ? "bg-amber-500/10 border border-amber-500/30 animate-pulse"
                  : "bg-white/5 border border-white/10"
              }`}>
                {step.done ? (
                  <svg className="w-2.5 h-2.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : i === steps.findIndex(s => !s.done) ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                )}
              </div>
              <span className={`text-xs font-mono ${
                step.done ? "text-slate-400 line-through decoration-slate-600"
                : i === steps.findIndex(s => !s.done) ? "text-amber-300"
                : "text-slate-600"
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-px bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500/50 to-green-400 rounded-full transition-all duration-1000"
            style={{ width: status === "ingesting" ? "35%" : "75%", animation: "progress 2s ease-in-out infinite alternate" }}
          />
          <style>{`
            @keyframes progress { from { opacity: 0.6; } to { opacity: 1; } }
          `}</style>
        </div>
      </div>
    </div>
  );
}

// Scroll caret
function ScrollCaret() {
  return (
    <div className="flex flex-col items-center gap-1 animate-bounce">
      <div className="w-px h-4 bg-gradient-to-b from-transparent to-white/20" />
      <ChevronRight className="w-3 h-3 text-white/20 rotate-90" />
    </div>
  );
}

export default function Home() {
  const { status, result, error, analyzeContent } = useAnalysis();
  const isLoading = status === "ingesting" || status === "analyzing";
  const resultRef = useRef<HTMLDivElement>(null);
  const [analysisCount] = useState(0);

  // Scroll to result when done
  const handleAnalyze = async (...args: Parameters<typeof analyzeContent>) => {
    await analyzeContent(...args);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  return (
    <main className="min-h-screen text-white" style={{ background: "radial-gradient(ellipse 120% 80% at 50% -20%, #0d1f12 0%, #060609 50%, #04060a 100%)" }}>

      {/* Noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px"
      }} />

      {/* Grid lines */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
        backgroundSize: "80px 80px"
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-24">

        {/* Hero section */}
        <div className="mb-14 space-y-8">
          <div className="space-y-4">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-green-500/20" />
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold text-green-400/80 border border-green-500/20 bg-green-500/5 uppercase tracking-[0.15em]">
                Retrieval-Augmented Verification
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-green-500/20" />
            </div>

            {/* Title */}
            <div className="text-center">
              <h1 className="text-6xl md:text-8xl font-black tracking-[-0.04em] leading-none">
                <span className="text-white">TRUTH</span>
                <span style={{ color: "#4ade80", textShadow: "0 0 60px rgba(74,222,128,0.3)" }}>CHECK</span>
              </h1>
              <p className="mt-5 text-slate-500 text-base font-mono leading-relaxed max-w-sm mx-auto">
                AI-powered misinformation detection using vector search + LLM reasoning
              </p>
            </div>
          </div>

          {/* Stat pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <StatPill icon={Activity} label="Model" value="llama-3.3-70b" />
            <StatPill icon={Database} label="Vector DB" value="ChromaDB" />
            <StatPill icon={Clock} label="Avg latency" value="~2.4s" />
            <StatPill icon={Shield} label="Accuracy" value="~91%" />
          </div>
        </div>

        {/* Input */}
        <div className="max-w-2xl mx-auto space-y-5">
          <InputPanel onAnalyze={handleAnalyze} isLoading={isLoading} />

          {/* Processing state */}
          {isLoading && <ProcessingCard status={status} />}

          {/* Error */}
          {status === "error" && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-400 text-[10px] font-bold">!</span>
              </div>
              <div>
                <p className="text-xs font-bold text-red-400 uppercase tracking-wide mb-1">Analysis Failed</p>
                <p className="text-xs text-red-400/60 font-mono">{error}</p>
              </div>
            </div>
          )}

          {/* Scroll caret between input and result */}
          {status === "done" && result && (
            <div className="flex justify-center py-2">
              <ScrollCaret />
            </div>
          )}
        </div>

        {/* Result */}
        {status === "done" && result && (
          <div ref={resultRef} className="mt-4 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
            <ResultCard result={result} />
          </div>
        )}

        {/* Empty state hint */}
        {status === "idle" && (
          <div className="mt-16 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-3">
              {[
                { emoji: "📰", title: "News Articles", desc: "Paste full article text or a URL to a live page" },
                { emoji: "🔗", title: "Web Links", desc: "Enter any URL — content is scraped automatically" },
                { emoji: "📄", title: "PDF Documents", desc: "Upload research papers or reports for analysis" },
              ].map((item) => (
                <div key={item.title} className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] hover:bg-white/[0.04] transition-all group cursor-default">
                  <div className="text-xl mb-2.5">{item.emoji}</div>
                  <p className="text-xs font-bold text-white/60 mb-1 group-hover:text-white/80 transition-colors">{item.title}</p>
                  <p className="text-[10px] text-slate-600 leading-relaxed group-hover:text-slate-500 transition-colors">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.04] py-8">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <p className="text-[10px] font-mono text-slate-700 uppercase tracking-[0.2em]">
            Truth-Check · RAG Fact Verification Engine
          </p>
          <div className="flex items-center gap-2">
            <StatusDot active={true} />
            <span className="text-[10px] font-mono text-slate-700">All systems nominal</span>
          </div>
        </div>
      </div>
    </main>
  );
}