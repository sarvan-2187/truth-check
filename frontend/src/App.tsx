import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import { Loader2 } from "lucide-react";

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-white"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% -20%, #0d1f12 0%, #060609 50%, #04060a 100%)",
        }}
      >
        <Loader2 className="w-8 h-8 text-green-400 animate-spin mb-4" />
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          Initializing session…
        </p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <>
      <Navbar />
      <Home />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
