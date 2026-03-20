import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { Type, Link as LinkIcon, FileText, Upload, Sparkles, Globe, FileUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onAnalyze: (type: "text" | "url" | "pdf", value: string | File) => void | Promise<void>;
  isLoading: boolean;
}

export function InputPanel({ onAnalyze, isLoading }: Props) {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: (files) => setFile(files[0]),
  });

  return (
    <div className="glass-card rounded-3xl p-1 overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-green-500/10">
      <Tabs defaultValue="text" className="w-full">
        <div className="px-4 pt-4">
          <TabsList className="grid grid-cols-3 bg-white/5 border border-white/10 rounded-2xl h-14 p-1">
            <TabsTrigger value="text" className="rounded-xl data-[state=active]:bg-green-500 data-[state=active]:text-black gap-2 transition-all duration-300">
              <Type className="w-4 h-4" />
              <span className="hidden sm:inline font-bold uppercase tracking-tighter">Text</span>
            </TabsTrigger>
            <TabsTrigger value="url" className="rounded-xl data-[state=active]:bg-green-500 data-[state=active]:text-black gap-2 transition-all duration-300">
              <LinkIcon className="w-4 h-4" />
              <span className="hidden sm:inline font-bold uppercase tracking-tighter">URL</span>
            </TabsTrigger>
            <TabsTrigger value="pdf" className="rounded-xl data-[state=active]:bg-green-500 data-[state=active]:text-black gap-2 transition-all duration-300">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline font-bold uppercase tracking-tighter">PDF</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6">
          <TabsContent value="text" className="mt-0 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="relative group">
              <Textarea
                placeholder="Paste article text or claim to fact-check..."
                className="min-h-[220px] font-sans text-base bg-white/[0.03] border-white/10 rounded-2xl focus:ring-green-500/50 focus:border-green-500/50 transition-all resize-none shadow-inner"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="absolute top-4 right-4 text-white/20 group-focus-within:text-green-500/50 transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <Button
              className="w-full h-14 rounded-2xl bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
              disabled={isLoading || text.length < 30}
              onClick={() => onAnalyze("text", text)}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Analyzing Content...
                </div>
              ) : (
                <>
                  Analyze Accuracy
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="url" className="mt-0 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-green-500 transition-colors">
                <Globe className="w-5 h-5" />
              </div>
              <input
                type="url"
                placeholder="https://example.com/breaking-news-article"
                className="w-full h-16 pl-12 pr-4 rounded-2xl border border-white/10 bg-white/[0.03] text-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all outline-none"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <Button
              className="w-full h-14 rounded-2xl bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all disabled:opacity-50"
              disabled={isLoading || !url.startsWith("http")}
              onClick={() => onAnalyze("url", url)}
            >
              {isLoading ? "Fetching Content..." : "Scrape & Verify"}
            </Button>
          </TabsContent>

          <TabsContent value="pdf" className="mt-0 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 group",
                isDragActive
                  ? "border-green-500 bg-green-500/10 shadow-[0_0_30px_rgba(34,197,94,0.1)]"
                  : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20"
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div className={cn(
                  "p-4 rounded-2xl transition-all duration-300",
                  isDragActive ? "bg-green-500 text-black scale-110" : "bg-white/5 text-white/40 group-hover:text-white/60"
                )}>
                  {file ? <FileUp className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                </div>
                {file ? (
                  <div className="space-y-1">
                    <p className="text-green-400 font-bold">{file.name}</p>
                    <p className="text-slate-500 text-xs uppercase tracking-tighter">Ready for extraction</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-lg font-medium text-white/80">Drop research paper or article</p>
                    <p className="text-slate-500 text-sm">PDF format only, up to 10MB</p>
                  </div>
                )}
              </div>
            </div>
            <Button
              className="w-full h-14 rounded-2xl bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all disabled:opacity-50"
              disabled={isLoading || !file}
              onClick={() => file && onAnalyze("pdf", file)}
            >
              {isLoading ? "Ingesting Document..." : "Upload & Analyze"}
            </Button>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

