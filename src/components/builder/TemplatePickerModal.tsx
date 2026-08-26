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

  if (!isOpen) return null;

  const handleApply = (templateId: string) => {
    const confirm = window.confirm(
      `Are you sure you want to apply this template? It will replace all existing content on the "${activePage}" page (excluding the Header and Footer). This action can be undone.`
    );
    if (confirm) {
      applyPageTemplate(activePage, templateId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-[500px] max-w-full rounded-lg shadow-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-brand-hairline flex items-center justify-between">
          <h2 className="font-semibold text-brand-ink">Choose a Layout Template</h2>
          <button 
            onClick={onClose}
            className="text-brand-mute hover:text-brand-ink transition-colors p-1"
            title="Close"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="p-4 flex flex-col gap-3 overflow-y-auto max-h-[60vh]">
          <p className="text-sm text-brand-mute mb-2">
            Applying a template to <strong className="text-brand-ink">{activePage}</strong> will overwrite its current sections. Your global header and footer will be preserved.
          </p>
          
          {PAGE_TEMPLATES.map((tpl) => (
            <div 
              key={tpl.id}
              className="border border-brand-hairline p-4 rounded-md hover:border-brand-primary hover:shadow-sm transition-all cursor-pointer group flex flex-col gap-1"
              onClick={() => handleApply(tpl.id)}
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
        
        <div className="p-4 border-t border-brand-hairline bg-brand-canvas-soft flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white border border-brand-hairline rounded-sm text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
