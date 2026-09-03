import React from "react";

export function RepeatableList<T>({ items, onChange, renderItem, newItem, addLabel }: {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  newItem: () => T;
  addLabel: string;
}) {
  const update = (idx: number, patch: Partial<T>) => {
    const next = [...items];
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  };
  
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const add = () => onChange([...items, newItem()]);
  
  // Drag and drop ordering can be added later if needed.
  // const reorder = (from: number, to: number) => {
  //   const next = [...items];
  //   const [moved] = next.splice(from, 1);
  //   next.splice(to, 0, moved);
  //   onChange(next);
  // };

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-start gap-2 border border-gray-100 rounded-lg p-3 bg-white shadow-sm relative group">
          {/* We can add a drag handle here later */}
          <div className="flex-1 w-full min-w-0">{renderItem(item, (patch) => update(idx, patch), idx)}</div>
          
          <button 
            type="button"
            onClick={() => remove(idx)} 
            className="text-gray-400 hover:text-red-500 text-[16px] px-1 transition-colors leading-none -mt-1 -mr-1"
            aria-label="Remove item"
            title="Remove"
          >
            &times;
          </button>
        </div>
      ))}
      <button 
        type="button"
        onClick={add} 
        className="text-[11px] font-medium text-blue-600 hover:text-blue-700 text-left mt-1 inline-flex items-center gap-1 w-fit transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        {addLabel}
      </button>
    </div>
  );
}
