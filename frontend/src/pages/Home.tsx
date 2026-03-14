import { InputPanel } from "@/components/InputPanel";
import { ResultCard } from "@/components/ResultCard";
import { useAnalysis } from "@/hooks/useAnalysis";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Zap } from "lucide-react";

export default function Home() {
  const { status, result, error, analyzeContent } = useAnalysis();
  const isLoading = status === "ingesting" || status === "analyzing";

  return (
    <main className="min-h-screen mesh-gradient text-white selection:bg-green-500/30">
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="mb-16 text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 mb-6 group hover:border-green-500/50 transition-colors">
            <Shield className="w-10 h-10 text-green-400 group-hover:scale-110 transition-transform" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-4 drop-shadow-2xl">
            TRUTH<span className="text-green-400 text-glow">CHECK</span>
          </h1>
          <p className="max-w-md mx-auto text-slate-400 text-lg font-medium leading-relaxed">
            Advanced RAG-powered detection engine.
            <span className="block mt-2 text-sm font-mono text-green-500/80 uppercase tracking-widest">
              Powered by Groq LPU™ technology
            </span>
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          <InputPanel onAnalyze={analyzeContent} isLoading={isLoading} />

          {isLoading && (
            <div className="glass-card rounded-2xl p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Zap className="w-5 h-5 text-green-400 animate-pulse" />
                </div>
                <p className="text-sm font-bold text-green-400 uppercase tracking-widest">
                  {status === "ingesting" ? "Ingesting Knowledge Base..." : "Executing Groq Inference..."}
                </p>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full bg-white/5" />
                <Skeleton className="h-4 w-[90%] bg-white/5" />
                <Skeleton className="h-4 w-[75%] bg-white/5" />
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="glass-card border-red-500/30 bg-red-500/5 rounded-2xl p-6 text-sm text-red-400 font-mono flex items-center gap-3">
              <span className="p-2 rounded bg-red-500/10">❌</span>
              {error}
            </div>
          )}

          {status === "done" && result && (
            <div className="animate-in zoom-in-95 duration-700">
              <ResultCard result={result} />
            </div>
          )}
        </div>
      </div>

      <footer className="mt-20 py-10 text-center border-t border-white/5">
        <p className="text-slate-600 text-xs font-mono uppercase tracking-[0.2em]">
          State-of-the-Art Semantic Fact Verification
        </p>
      </footer>
    </main>
  );
}

