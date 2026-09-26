import React, { useState, useEffect, useRef } from "react";
import { X, FileCode2, Copy } from "lucide-react";

interface CustomTemplateModalProps {
  isOpen: boolean;
  mode: "create" | "duplicate";
  initialValue?: string;
  sourcePage?: string;
  existingSlugs: string[];
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export default function CustomTemplateModal({
  isOpen,
  mode,
  initialValue = "",
  sourcePage,
  existingSlugs,
  onClose,
  onSubmit,
}: CustomTemplateModalProps) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper to format slug identically to editorStore
  const formatSlug = (val: string) => {
    let clean = val.trim().toLowerCase().replace(/\s+/g, "-");
    if (clean && !clean.startsWith("custom-")) {
      clean = `custom-${clean}`;
    }
    return clean;
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  if (!isOpen) return null;

  const trimmed = value.trim();
  const formattedSlug = trimmed ? formatSlug(trimmed) : "";
  const isDuplicate = Boolean(formattedSlug && existingSlugs.includes(formattedSlug));
  const error = isDuplicate ? `Template "${formattedSlug}.hbs" already exists.` : null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trimmed || isDuplicate) return;
    onSubmit(trimmed);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
      style={{ zIndex: 9999 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        className="bg-white w-full max-w-[440px] rounded-lg shadow-2xl border border-brand-hairline overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-brand-hairline flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-brand-canvas-soft border border-brand-hairline flex items-center justify-center text-brand-ink">
              {mode === "duplicate" ? <Copy size={15} /> : <FileCode2 size={15} />}
            </div>
            <div>
              <h2 className="font-semibold text-sm text-brand-ink">
                {mode === "duplicate" ? "Duplicate Template" : "New Custom Template"}
              </h2>
              <p className="text-[11px] text-brand-mute">
                {mode === "duplicate"
                  ? `Copying layout from ${sourcePage || "current template"}`
                  : "Create a slug-based Ghost page template"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-brand-mute hover:text-brand-ink transition-colors p-1.5 rounded hover:bg-brand-canvas-soft cursor-pointer"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-5 flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="template-slug-input"
                className="text-xs font-semibold text-brand-body"
              >
                Template Name or Slug
              </label>
              <input
                id="template-slug-input"
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. landing-pricing"
                className="w-full px-3 py-2 border border-brand-hairline rounded-md text-xs font-mono focus:outline-none focus:border-brand-primary bg-brand-canvas-soft text-brand-ink placeholder:text-brand-mute/60 placeholder:font-sans transition-colors"
                autoComplete="off"
              />
            </div>

            {/* Live Slug Preview */}
            {formattedSlug && (
              <div className="p-2.5 bg-brand-canvas-soft rounded-md border border-brand-hairline/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-brand-mute">File will be saved as:</span>
                <span className="font-mono text-[11px] font-semibold text-brand-primary bg-white px-2 py-0.5 rounded border border-brand-hairline">
                  {formattedSlug}.hbs
                </span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <p className="text-[11px] font-medium text-red-600 bg-red-50/80 border border-red-200/60 rounded px-2.5 py-1.5">
                {error}
              </p>
            )}

            <p className="text-[11px] text-brand-mute leading-relaxed">
              Custom page templates in Ghost use the slug format{" "}
              <code className="bg-brand-canvas-soft px-1 py-0.5 rounded text-[10px] font-mono text-brand-body border border-brand-hairline">
                custom-[slug].hbs
              </code>
              . The &quot;custom-&quot; prefix will be attached automatically.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="px-5 py-3.5 border-t border-brand-hairline bg-brand-canvas-soft flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-white border border-brand-hairline rounded-md text-xs font-medium text-brand-body hover:text-brand-ink hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!value.trim() || !!error}
              className="px-4 py-1.5 bg-brand-primary text-white rounded-md text-xs font-medium hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
            >
              {mode === "duplicate" ? "Duplicate Template" : "Create Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
