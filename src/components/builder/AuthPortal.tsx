"use client";

import React, { useState } from "react";
import { useEditorStore } from "@/store/editorStore";

export default function AuthPortal({ onAuthSuccess }: { onAuthSuccess: (userId: string) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      onAuthSuccess(data.userId);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa] relative p-6 font-sans select-none overflow-hidden">
      {/* Background Mesh Glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Styled Auth Form Card Container */}
      <div className="w-full max-w-[420px] rounded-md border border-[#ebebeb] bg-white p-10 flex flex-col gap-6 relative z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col items-center gap-2">
          {/* Vercel styled primary logo mark */}
          <div className="w-9 h-9 bg-[#171717] flex items-center justify-center rounded-sm shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
            <span className="text-white font-mono font-semibold text-base">G</span>
          </div>
          <h2 className="text-xl font-sans font-semibold tracking-tight text-[#171717] mt-2">
            {isLogin ? "Sign in to Ghost Builder" : "Create your account"}
          </h2>
          <p className="text-xs text-[#888888]">Enter details below to manage your theme visual layouts</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-[#171717] uppercase tracking-wider">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2 border border-[#ebebeb] rounded-sm text-xs font-sans focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] bg-[#fafafa] transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-[#171717] uppercase tracking-wider">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 border border-[#ebebeb] rounded-sm text-xs font-sans focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] bg-[#fafafa] transition-all"
            />
          </div>

          {error && <span className="text-xs text-red-500 font-semibold tracking-tight text-center">{error}</span>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#171717] text-white py-2.5 rounded-full text-xs font-semibold hover:bg-black transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] mt-3 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer active:scale-[0.98]"
          >
            {loading ? "Authenticating..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="flex justify-center text-xs text-[#888888] border-t border-[#ebebeb] pt-5">
          <span>
            {isLogin ? "New to Ghost Builder? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#171717] font-semibold hover:underline bg-transparent border-none cursor-pointer"
            >
              {isLogin ? "Create account" : "Sign in"}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
