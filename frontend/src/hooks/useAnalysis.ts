import { useState, useCallback } from "react";
import { analyzeText, analyzeURL, analyzePDFId, ingestPDF } from "@/lib/api";

export type Verdict = "REAL" | "FAKE" | "MISLEADING" | "UNVERIFIABLE";

export interface AnalysisResult {
  id: string;
  verdict: Verdict;
  confidence: number;
  summary: string;
  red_flags: string[];
  supporting_evidence: string[];
  retrieved_sources: string[];
  input_preview: string;
  groq_model_used: string;
  created_at: string;
}

interface AnalysisState {
  status: "idle" | "ingesting" | "analyzing" | "done" | "error";
  result: AnalysisResult | null;
  error: string | null;
}

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    status: "idle",
    result: null,
    error: null,
  });

  const analyzeContent = useCallback(
    async (type: "text" | "url" | "pdf", value: string | File) => {
      setState({ status: type === "pdf" ? "ingesting" : "analyzing", result: null, error: null });
      try {
        let res;
        if (type === "text") res = await analyzeText(value as string);
        else if (type === "url") res = await analyzeURL(value as string);
        else {
          const ingest = await ingestPDF(value as File);
          setState((s) => ({ ...s, status: "analyzing" }));
          res = await analyzePDFId(ingest.data.doc_id);
        }
        setState({ status: "done", result: res.data, error: null });
      } catch (err: any) {
        setState({ status: "error", result: null, error: err.message });
      }
    },
    []
  );

  return { ...state, analyzeContent };
}
