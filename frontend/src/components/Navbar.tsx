import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

export function Navbar() {
  const { user, signOut } = useAuth();

  const initial = user?.email?.charAt(0).toUpperCase() ?? "?";
  const displayEmail =
    user?.email && user.email.length > 24
      ? user.email.slice(0, 22) + "…"
      : user?.email ?? "";

  return (
    <div className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.04] bg-black/20 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-6 h-12 flex items-center justify-between">
        {/* Left — Logo */}
        <div className="flex items-center gap-0.5">
          <span className="text-sm font-black tracking-tight text-white">TRUTH</span>
          <span
            className="text-sm font-black tracking-tight"
            style={{ color: "#4ade80", textShadow: "0 0 30px rgba(74,222,128,0.3)" }}
          >
            CHECK
          </span>
        </div>

        {/* Center — Tech labels */}
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-600">Groq LPU™</span>
          <span className="text-slate-700">·</span>
          <span className="text-[10px] font-mono text-slate-600">ChromaDB</span>
          <span className="text-slate-700">·</span>
          <span className="text-[10px] font-mono text-slate-600">RAG v2</span>
        </div>

        {/* Right — User info + sign out */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-7 h-7 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <span className="text-[11px] font-bold text-green-400">{initial}</span>
          </div>

          {/* Email */}
          <span className="hidden md:block text-[10px] font-mono text-slate-500 max-w-[160px] truncate">
            {displayEmail}
          </span>

          {/* Sign out */}
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.08] transition-all group"
          >
            <LogOut className="w-3 h-3 text-slate-500 group-hover:text-red-400 transition-colors" />
            <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400 uppercase tracking-widest transition-colors">
              Sign out
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
