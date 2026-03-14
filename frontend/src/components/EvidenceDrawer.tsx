import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, FileText, ChevronRight, Layers } from "lucide-react";

export function EvidenceDrawer({ sources }: { sources: string[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="px-4 py-2 h-auto text-xs font-bold uppercase tracking-widest text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-full transition-all group">
          <Database className="w-3 h-3 mr-2 text-green-500 group-hover:scale-110 transition-transform" />
          Sources ({sources.length})
          <ChevronRight className="w-3 h-3 ml-1 opacity-50 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[480px] bg-slate-950/95 border-white/5 backdrop-blur-3xl shadow-2xl p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-8 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-green-500/10 border border-green-500/20">
                <Layers className="w-6 h-6 text-green-400" />
              </div>
              <SheetTitle className="text-2xl font-black text-white italic tracking-tighter">
                RAG <span className="text-green-400">CONTEXT</span>
              </SheetTitle>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {sources.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <Database className="w-12 h-12 text-slate-700 mx-auto" />
                <p className="text-slate-500 text-sm font-medium">No retrieval chunks found for this analysis.</p>
              </div>
            ) : (
              sources.map((src, i) => (
                <div key={i} className="group relative space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="px-3 py-1 rounded-lg border-white/10 bg-white/5 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                      Context Chunk #{i + 1}
                    </Badge>
                    <FileText className="w-4 h-4 text-white/10 group-hover:text-green-500/30 transition-colors" />
                  </div>
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:border-white/10 transition-colors">
                    <p className="text-sm text-slate-400 leading-relaxed font-sans">{src}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-8 border-t border-white/5 bg-slate-950/50">
            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.2em] text-center">
              Verified Retrieval Augmented Generation Chain
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

