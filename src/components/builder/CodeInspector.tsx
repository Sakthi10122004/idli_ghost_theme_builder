"use client";

import { useEditorStore } from "@/store/editorStore";
import { X, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function CodeInspector() {
  const { isCodeMode, toggleCodeMode, document: themeDoc } = useEditorStore();
  const [copied, setCopied] = useState(false);

  if (!isCodeMode) return null;

  const jsonCode = JSON.stringify(themeDoc, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="w-[380px] border-l border-brand-hairline bg-[#171717] flex flex-col shrink-0 select-none z-30 shadow-level-5">
      {/* Code Header */}
      <div className="h-[64px] px-6 border-b border-white/10 flex justify-between items-center text-white select-none bg-black/40">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-warning"></span>
          <span className="font-mono text-xs uppercase tracking-wider font-semibold">ThemeDocument AST</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleCopy}
            className="p-1.5 hover:bg-white/10 rounded-sm text-zinc-400 hover:text-white transition-colors"
            title="Copy AST JSON"
          >
            {copied ? <Check size={14} className="text-brand-success" /> : <Copy size={14} />}
          </button>
          <button 
            onClick={toggleCodeMode}
            className="p-1.5 hover:bg-white/10 rounded-sm text-zinc-400 hover:text-white transition-colors"
            title="Close Code Inspector"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-auto p-6 font-mono text-[11px] text-zinc-300 leading-relaxed bg-black/10 select-text selection:bg-white/20">
        <pre className="whitespace-pre">{jsonCode}</pre>
      </div>
    </aside>
  );
}
