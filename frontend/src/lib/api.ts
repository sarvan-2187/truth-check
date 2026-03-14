import axios from "axios";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const api = axios.create({ baseURL: BASE });

export const analyzeText = (content: string) =>
  api.post("/api/analyze", { input_type: "text", content });

export const analyzeURL = (url: string) =>
  api.post("/api/analyze", { input_type: "url", content: url });

export const analyzePDFId = (doc_id: string) =>
  api.post("/api/analyze", { input_type: "pdf_id", content: doc_id });

export const ingestPDF = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/api/ingest", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getHistory = () => api.get("/api/history");
export const deleteHistory = (id: string) => api.delete(`/api/history/${id}`);
