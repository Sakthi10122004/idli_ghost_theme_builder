import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";
import { TeamProps, TeamMember, PhotoShape, defaultProps } from "./schema";
import { RepeatableList } from "../shared/RepeatableList";
import { BackgroundControls } from "../shared/BackgroundControls";
import { Circle, Square, Image as ImageIcon } from "lucide-react";

const Switch = ({ checked, onChange }: { checked: boolean; onChange: (c: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-8 h-[1.125rem] flex items-center shrink-0 rounded-full p-0.5 transition-colors ${checked ? 'bg-blue-500' : 'bg-gray-200'}`}
  >
    <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transform transition-transform ${checked ? 'translate-x-3.5' : 'translate-x-0'}`} />
  </button>
);

const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: React.ReactNode; value: T; disabled?: boolean }[];
  value: T;
  onChange: (v: T) => void;
}) => (
  <div className="flex bg-gray-100 p-0.5 rounded-md border border-gray-200/50">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        disabled={opt.disabled}
        onClick={() => onChange(opt.value)}
        className={`flex-1 flex justify-center items-center py-1.5 text-[11px] font-medium rounded-sm transition-all ${
          opt.disabled
            ? "text-gray-300 cursor-not-allowed"
            : value === opt.value
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

export const SidebarElement = ({
  block,
  onChangeProps,
  onChangeStyles,
}: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
}) => {
  const p = { ...defaultProps, ...block.props } as TeamProps;
  const general = p.general || defaultProps.general;
  const members = p.members || defaultProps.members;
  const useDynamicData = general.useDynamicData ?? false;
  const addAsset = useEditorStore((s) => s.addAsset);

  const updateGeneral = (patch: Partial<TeamProps["general"]>) => {
    onChangeProps({ general: { ...general, ...patch } });
  };

  const renderMemberItem = (item: TeamMember, update: (patch: Partial<TeamMember>) => void) => (
    <div className="flex flex-col gap-2.5">
      {/* Photo Setting */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-gray-500 flex items-center gap-1">
          <ImageIcon size={11} />
          <span>Photo URL</span>
        </label>
        <input
          type="text"
          value={item.photoUrl || ""}
          onChange={(e) => update({ photoUrl: e.target.value })}
          className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none"
          placeholder="https://example.com/avatar.jpg"
        />
        <div className="mt-1">
          <input
            type="file"
            accept="image/*"
            className="text-[10px] w-full file:mr-2 file:py-0.5 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => {
                const dataUri = ev.target?.result as string;
                if (!dataUri) return;
                const ext = file.name.split(".").pop() || "png";
                const id = Math.random().toString(36).substring(7);
                const assetPath = `assets/images/team/${id}.${ext}`;
                addAsset(assetPath, dataUri);
                update({ photoUrl: `asset://${assetPath.replace("assets/", "")}` });
              };
              reader.readAsDataURL(file);
            }}
          />
        </div>
      </div>

      {/* Name and Role */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-gray-500">Name</label>
          <input
            type="text"
            value={item.name || ""}
            onChange={(e) => update({ name: e.target.value })}
            className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none"
            placeholder="e.g. Alex Rivera"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-gray-500">Role / Title</label>
          <input
            type="text"
            value={item.role || ""}
            onChange={(e) => update({ role: e.target.value })}
            className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none"
            placeholder="e.g. Founder & CEO"
          />
        </div>
      </div>

      {/* Bio / Description */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-gray-500">Bio / Details (Multi-line)</label>
        <textarea
          rows={3}
          value={item.bio || ""}
          onChange={(e) => update({ bio: e.target.value })}
          className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none resize-none"
          placeholder="Short bio, experience, education, etc."
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* General Settings */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1 border-b border-brand-hairline pb-1">
          General
        </span>

        {/* Dynamic Data Toggle */}
        <div className="flex flex-col gap-1.5 pb-2 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Use Dynamic Ghost Data</label>
            <Switch
              checked={useDynamicData}
              onChange={(c) => updateGeneral({ useDynamicData: c })}
            />
          </div>
          <span className="text-[10px] text-brand-mute">
            When enabled, team members will be automatically fetched from Ghost posts tagged with a specific tag.
          </span>
          {useDynamicData && (
            <div className="flex flex-col gap-1.5 mt-2 bg-blue-50/50 p-2 border border-blue-100 rounded-sm">
              <label className="text-[10px] font-semibold text-blue-900">Ghost Tag Filter</label>
              <div className="flex items-center gap-1 bg-white border border-blue-200 rounded px-2 py-1">
                <span className="text-xs font-mono text-blue-600 font-bold">#</span>
                <input
                  type="text"
                  value={general.dynamicTag || "team"}
                  onChange={(e) => updateGeneral({ dynamicTag: e.target.value.trim().toLowerCase() })}
                  className="w-full text-xs font-mono outline-none text-gray-800 bg-transparent"
                  placeholder="team"
                />
              </div>
              <p className="text-[9px] text-blue-700 leading-snug">
                Posts tagged with <strong className="font-mono">#{general.dynamicTag || "team"}</strong> in Ghost Admin will appear as team members automatically.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Heading</label>
          <input
            type="text"
            value={general.heading || ""}
            onChange={(e) => updateGeneral({ heading: e.target.value })}
            className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            placeholder="e.g. The Crew"
          />
        </div>

        <div className="flex flex-col gap-1.5 mt-1">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Description / Subtext</label>
          <textarea
            rows={2}
            value={general.subheading || ""}
            onChange={(e) => updateGeneral({ subheading: e.target.value })}
            className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft resize-none"
            placeholder="Section description..."
          />
        </div>

        {/* Photo Shape Control */}
        <div className="flex flex-col gap-1.5 mt-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Photo Shape</label>
          <SegmentedControl<PhotoShape>
            options={[
              {
                label: (
                  <span className="flex items-center gap-1">
                    <Circle size={11} /> Circle
                  </span>
                ),
                value: "circle",
              },
              {
                label: (
                  <span className="flex items-center gap-1">
                    <Square size={11} /> Square
                  </span>
                ),
                value: "square",
              },
              {
                label: (
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-[3px] border border-current inline-block" /> Rounded
                  </span>
                ),
                value: "rounded",
              },
            ]}
            value={general.photoShape || "circle"}
            onChange={(v) => updateGeneral({ photoShape: v })}
          />
        </div>

        {/* Desktop Grid Columns */}
        <div className="flex flex-col gap-1.5 mt-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Desktop Columns</label>
          <SegmentedControl<string>
            options={[
              { label: "2 Columns", value: "2" },
              { label: "3 Columns", value: "3" },
              { label: "4 Columns", value: "4" },
            ]}
            value={String(general.columns || 4)}
            onChange={(v) => updateGeneral({ columns: parseInt(v) as 2 | 3 | 4 })}
          />
        </div>
      </div>

      {/* Team Members List */}
      <div className="flex flex-col gap-2 border-t border-brand-hairline pt-3 mt-1">
        {useDynamicData ? (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-brand-ink">Team Members</span>
              <span className="text-[10px] text-blue-600 font-semibold font-mono">Dynamic Mode</span>
            </div>
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-sm flex flex-col gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 font-semibold text-blue-900">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <span>Bound to Ghost Posts</span>
              </div>
              <p className="text-[10px] text-blue-700 leading-snug">
                Manual team member management is disabled. Cards will automatically be generated in Ghost for posts tagged with <strong className="font-mono">#{general.dynamicTag || "team"}</strong>.
              </p>
              <div className="border-t border-blue-100/80 pt-1.5 flex flex-col gap-1 text-[10px] text-blue-800 font-sans">
                <span className="font-semibold text-blue-950">Field Mapping:</span>
                <ul className="list-disc list-inside space-y-0.5 text-blue-700 font-mono text-[9.5px]">
                  <li>Title → Member Name</li>
                  <li>Feature Image → Photo</li>
                  <li>Custom Excerpt → Role / Title</li>
                  <li>Post Content → Bio</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] uppercase font-bold text-brand-ink">Team Members</span>
              <span className="text-[10px] text-brand-mute font-mono">{members.length} members</span>
            </div>

            <RepeatableList<TeamMember>
              items={members}
              onChange={(newMembers) => onChangeProps({ members: newMembers })}
              renderItem={renderMemberItem}
              newItem={() => ({
                id: Math.random().toString(36).substring(7),
                name: "New Team Member",
                role: "Designer / Developer",
                bio: "Short bio and past experience line.",
                photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&h=400&q=80",
              })}
              addLabel="Add Team Member"
            />
          </>
        )}
      </div>

      {/* Background Controls */}
      <BackgroundControls
        styles={block.styles || {}}
        appearance={p.appearance || {}}
        onChangeStyles={onChangeStyles || (() => {})}
        updateAppearance={(key, val) =>
          onChangeProps({ appearance: { ...p.appearance, [key]: val } })
        }
      />

      {/* Spacing */}
      <div className="flex flex-col gap-2 border-t border-brand-hairline pt-3 mt-1">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1">Spacing</span>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-[10px] font-semibold text-gray-500">Top Padding</label>
            <input
              type="text"
              value={p.spacing?.paddingTop || "5rem"}
              onChange={(e) =>
                onChangeProps({ spacing: { ...p.spacing, paddingTop: e.target.value } })
              }
              className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-[10px] font-semibold text-gray-500">Bottom Padding</label>
            <input
              type="text"
              value={p.spacing?.paddingBottom || "5rem"}
              onChange={(e) =>
                onChangeProps({ spacing: { ...p.spacing, paddingBottom: e.target.value } })
              }
              className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Advanced */}
      <div className="flex flex-col gap-2 border-t border-brand-hairline pt-3 mt-1">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1">Advanced</span>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">HTML Anchor</label>
          <input
            type="text"
            value={p.advanced?.htmlAnchor || "team"}
            onChange={(e) =>
              onChangeProps({ advanced: { ...p.advanced, htmlAnchor: e.target.value } })
            }
            className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            placeholder="e.g. team"
          />
        </div>
      </div>
    </div>
  );
};
