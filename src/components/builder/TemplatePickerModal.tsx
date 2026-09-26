import React from "react";
import { PAGE_TEMPLATES } from "@/store/templates";
import { useEditorStore } from "@/store/editorStore";

export default function TemplatePickerModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void 
}) {
  const { activePage, applyPageTemplate } = useEditorStore();
  const [pendingTemplate, setPendingTemplate] = React.useState<{ id: string; name: string } | null>(null);

  const handleClose = () => {
    setPendingTemplate(null);
    onClose();
  };

  if (!isOpen) return null;

  const handleConfirmApply = () => {
    if (pendingTemplate) {
      applyPageTemplate(activePage, pendingTemplate.id);
      setPendingTemplate(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm" style={{ zIndex: 9999 }}>
      <div className="bg-white w-[500px] max-w-full rounded-lg shadow-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-brand-hairline flex items-center justify-between">
          <h2 className="font-semibold text-brand-ink">Choose a Layout Template</h2>
          <button 
            onClick={handleClose}
            className="text-brand-mute hover:text-brand-ink transition-colors p-1"
            title="Close"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {pendingTemplate ? (
          <div className="p-6 flex flex-col gap-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-amber-900">Confirm Layout Replacement</span>
              <p className="text-xs text-amber-800 leading-relaxed">
                Are you sure you want to apply <strong className="font-semibold">{pendingTemplate.name}</strong>? It will replace all existing content sections on the <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px] font-mono">{activePage}</code> page. Your global Header and Footer will be preserved.
              </p>
            </div>
            <p className="text-xs text-brand-mute">
              Tip: You can always undo this action with <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-[10px] font-mono font-semibold">Ctrl+Z</kbd> / <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-[10px] font-mono font-semibold">Cmd+Z</kbd>.
            </p>
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-3 overflow-y-auto max-h-[60vh]">
            <p className="text-sm text-brand-mute mb-2">
              Applying a template to <strong className="text-brand-ink">{activePage}</strong> will overwrite its current sections. Your global header and footer will be preserved.
            </p>
            
            {PAGE_TEMPLATES.map((tpl) => (
              <div 
                key={tpl.id}
                className="border border-brand-hairline p-4 rounded-md hover:border-brand-primary hover:shadow-sm transition-all cursor-pointer group flex flex-col gap-1"
                onClick={() => setPendingTemplate({ id: tpl.id, name: tpl.name })}
              >
                <h3 className="font-medium text-brand-ink group-hover:text-brand-primary transition-colors">
                  {tpl.name}
                </h3>
                <p className="text-sm text-brand-mute">
                  {tpl.description}
                </p>
              </div>
            ))}
          </div>
        )}
        
        <div className="p-4 border-t border-brand-hairline bg-brand-canvas-soft flex justify-end gap-2">
          {pendingTemplate ? (
            <>
              <button 
                onClick={() => setPendingTemplate(null)}
                className="px-4 py-1.5 bg-white border border-brand-hairline rounded-md text-xs font-medium text-brand-body hover:text-brand-ink hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button 
                onClick={handleConfirmApply}
                className="px-4 py-1.5 bg-brand-primary text-white rounded-md text-xs font-medium hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
              >
                Apply Layout
              </button>
            </>
          ) : (
            <button 
              onClick={handleClose}
              className="px-4 py-1.5 bg-white border border-brand-hairline rounded-md text-xs font-medium text-brand-body hover:text-brand-ink hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
