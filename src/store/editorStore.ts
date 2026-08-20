import { create } from "zustand";
import { ThemeDocument, BuilderBlock, ThemePages } from "../types/theme";

export function generateId(prefix: string = "block"): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

export const DEFAULT_DESIGN_TOKENS = {
  colors: {
    background: "#ffffff",
    foreground: "#171717",
    muted: "#888888",
    primary: "#171717",
    accent: "#0070f3",
  },
  typography: {
    bodyFont: "Geist, Inter, sans-serif",
    headingFont: "Geist, Inter, sans-serif",
    baseSize: "16px",
  },
  spacing: {
    sectionPadding: "64px",
    contentPadding: "16px",
  },
  radii: {
    cardRadius: "8px",
    buttonRadius: "100px",
  },
};

export const INITIAL_THEME_DOCUMENT: ThemeDocument = {
  metadata: {
    name: "My Ghost Theme",
    version: "1.0.0",
    author: "Theme Builder",
    description: "A Vercel-inspired theme visual build",
  },
  settings: {
    containerWidth: 1200,
    fontFamily: "Geist",
    primaryColor: "#171717",
    designTokens: DEFAULT_DESIGN_TOKENS,
  },
  pages: {
    home: { sections: ["hero-sec-1", "posts-sec-2", "footer-sec-3"] },
    post: { sections: ["header-sec-1", "post-content-sec", "footer-sec-3"] },
    page: { sections: ["header-sec-1", "page-content-sec", "footer-sec-3"] },
    author: { sections: ["header-sec-1", "author-profile-sec", "footer-sec-3"] },
    tag: { sections: ["header-sec-1", "tag-archive-sec", "footer-sec-3"] },
    error: { sections: ["header-sec-1", "error-main-sec", "footer-sec-3"] },
  },
  blocks: {
    "hero-sec-1": {
      id: "hero-sec-1",
      type: "section",
      props: {},
      styles: { backgroundColor: "#ffffff", paddingTop: "96px", paddingBottom: "96px" },
      childrenIds: ["hero-container-1"],
    },
    "hero-container-1": {
      id: "hero-container-1",
      type: "container",
      props: {},
      styles: { textAlign: "center" },
      childrenIds: ["hero-heading-1", "hero-text-1", "hero-cta-row-1"],
    },
    "hero-heading-1": {
      id: "hero-heading-1",
      type: "heading",
      props: { text: "Build and deploy on the AI Cloud.", level: 1 },
      styles: { fontSize: "48px", letterSpacing: "-2.4px", fontWeight: "600", marginBottom: "16px" },
    },
    "hero-text-1": {
      id: "hero-text-1",
      type: "text",
      props: { text: "Visual builder for clean, lightweight, and modern Ghost templates styled with Geist UI guidelines." },
      styles: { fontSize: "18px", textColor: "#4d4d4d", marginBottom: "24px" },
    },
    "hero-cta-row-1": {
      id: "hero-cta-row-1",
      type: "container",
      props: {},
      styles: { display: "flex", gap: "16px", justifyContent: "center" },
      childrenIds: ["hero-btn-primary", "hero-btn-secondary"],
    },
    "hero-btn-primary": {
      id: "hero-btn-primary",
      type: "button",
      props: { label: "Start building", href: "#", variant: "primary" },
      styles: {},
    },
    "hero-btn-secondary": {
      id: "hero-btn-secondary",
      type: "button",
      props: { label: "Learn more", href: "#", variant: "secondary" },
      styles: {},
    },
    "posts-sec-2": {
      id: "posts-sec-2",
      type: "section",
      props: {},
      styles: { backgroundColor: "#fafafa", paddingTop: "64px", paddingBottom: "64px" },
      childrenIds: ["posts-grid-1"],
    },
    "posts-grid-1": {
      id: "posts-grid-1",
      type: "post-grid",
      props: { title: "Latest Stories", limit: 6 },
      styles: {},
    },
    "footer-sec-3": {
      id: "footer-sec-3",
      type: "section",
      props: {},
      styles: { backgroundColor: "#ffffff", paddingTop: "64px", paddingBottom: "64px" },
      childrenIds: ["footer-content-1"],
    },
    "footer-content-1": {
      id: "footer-content-1",
      type: "footer",
      props: { copyright: "© 2026 Ghost Theme Builder" },
      styles: {},
    },
    "header-sec-1": {
      id: "header-sec-1",
      type: "section",
      props: {},
      styles: { backgroundColor: "#ffffff", paddingTop: "16px", paddingBottom: "16px" },
      childrenIds: ["header-content-1"],
    },
    "header-content-1": {
      id: "header-content-1",
      type: "header",
      props: {},
      styles: {},
    },
    "post-content-sec": {
      id: "post-content-sec",
      type: "section",
      props: {},
      styles: { backgroundColor: "#ffffff", paddingTop: "64px", paddingBottom: "64px" },
      childrenIds: ["post-detail-1"],
    },
    "post-detail-1": {
      id: "post-detail-1",
      type: "post-detail",
      props: {},
      styles: {},
    },
    "page-content-sec": {
      id: "page-content-sec",
      type: "section",
      props: {},
      styles: { backgroundColor: "#ffffff", paddingTop: "64px", paddingBottom: "64px" },
      childrenIds: ["page-detail-1"],
    },
    "page-detail-1": {
      id: "page-detail-1",
      type: "page-detail",
      props: {},
      styles: {},
    },
    "author-profile-sec": {
      id: "author-profile-sec",
      type: "section",
      props: {},
      styles: { backgroundColor: "#ffffff", paddingTop: "64px", paddingBottom: "64px" },
      childrenIds: ["author-profile-1"],
    },
    "author-profile-1": {
      id: "author-profile-1",
      type: "author-profile",
      props: {},
      styles: {},
    },
    "tag-archive-sec": {
      id: "tag-archive-sec",
      type: "section",
      props: {},
      styles: { backgroundColor: "#ffffff", paddingTop: "64px", paddingBottom: "64px" },
      childrenIds: ["tag-archive-1"],
    },
    "tag-archive-1": {
      id: "tag-archive-1",
      type: "tag-archive",
      props: {},
      styles: {},
    },
    "error-main-sec": {
      id: "error-main-sec",
      type: "section",
      props: {},
      styles: { backgroundColor: "#ffffff", paddingTop: "128px", paddingBottom: "128px" },
      childrenIds: ["error-content-1"],
    },
    "error-content-1": {
      id: "error-content-1",
      type: "error-view",
      props: {},
      styles: {},
    },
  },
};

interface EditorState {
  document: ThemeDocument;
  selectedBlockId: string | null;
  activePage: string;
  deviceMode: "desktop" | "tablet" | "mobile";
  past: ThemeDocument[];
  future: ThemeDocument[];

  isPreviewMode: boolean;
  isCodeMode: boolean;
  showShortcutsHelp: boolean;
  
  userId: string;
  isSaving: boolean;
  saveStatus: "idle" | "saving" | "saved" | "error";

  setDeviceMode: (mode: "desktop" | "tablet" | "mobile") => void;
  setActivePage: (page: string) => void;
  selectBlock: (blockId: string | null) => void;
  
  togglePreviewMode: () => void;
  toggleCodeMode: () => void;
  toggleShortcutsHelp: (show?: boolean) => void;
  
  loadTheme: () => Promise<void>;
  saveTheme: () => Promise<void>;
  setUserId: (userId: string) => void;
  
  createCustomPage: (slug: string) => void;
  duplicateCustomPage: (pageKey: string, newTitle: string) => void;
  updatePageTagFilter: (pageKey: string, tag: string) => void;
  addBlock: (type: string, parentId?: string) => void;
  insertBlockAt: (type: string, index: number, parentId?: string) => void;
  updateBlockProps: (blockId: string, props: Record<string, any>) => void;
  updateBlockStyles: (blockId: string, styles: Record<string, any>) => void;
  deleteBlock: (blockId: string) => void;
  duplicateBlock: (blockId: string) => void;
  reorderBlocks: (sourceIndex: number, destinationIndex: number, parentId?: string) => void;
  moveBlock: (activeId: string, overId: string) => void;
  
  undo: () => void;
  redo: () => void;
}

const saveToHistory = (state: EditorState) => {
  return {
    past: [...state.past, JSON.parse(JSON.stringify(state.document))],
    future: [],
  };
};

const createNewBlock = (type: string): BuilderBlock => {
  const newId = generateId(type);
  return {
    id: newId,
    type,
    props: type === "heading" ? { text: "Heading Text", level: 2 } 
           : type === "text" ? { text: "Add your text content here." }
           : type === "button" ? { label: "Click here", href: "#", variant: "primary" }
           : type === "hero" ? { title: "Verve Landing", subtitle: "Build visual layout sections at rapid speeds.", buttonLabel: "Get Started" }
           : type === "newsletter" ? { title: "Sign up for updates", buttonLabel: "Subscribe", placeholder: "you@example.com" }
           : type === "featured-posts" ? { title: "Featured Posts" }
           : type === "image" ? { url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80", alt: "Mock Image description" }
           : type === "spacer" ? { height: "40px" }
           : type === "author-profile" ? { name: "Praveen", bio: "Engineering lead and visual theme designer focused on edge stacks." }
           : type === "tag-archive" ? { title: "Browse Topics" }
           : type === "accordion" ? { items: [{ question: "Frequently Asked Question?", answer: "This is a pre-configured response answering this detailed query template." }] }
           : type === "testimonials" ? { items: [{ quote: "The interface layout built using this editor compiles faster than manual code.", author: "Reviewer A", title: "Theme Developer" }] }
           : type === "pricing-table" ? { title: "Pricing Plans", tiers: [{ name: "Starter", price: "$0", features: ["1 Site", "Standard support"], buttonLabel: "Free Plan" }, { name: "Pro", price: "$29", features: ["10 Sites", "Priority support", "Full AST export"], buttonLabel: "Upgrade" }] }
           : type === "grid-gallery" ? { urls: ["https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80", "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80"] }
           : type === "social-links" ? { github: "https://github.com", twitter: "https://twitter.com", website: "https://example.com" }
           : type === "video-player" ? { url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
           : {},
    styles: {},
    childrenIds: type === "section" || type === "container" || type === "columns" ? [] : undefined,
  };
};

const duplicateBlockRecursive = (blockId: string, blocks: Record<string, BuilderBlock>): { newId: string, clonedBlocks: Record<string, BuilderBlock> } => {
  const original = blocks[blockId];
  if (!original) return { newId: "", clonedBlocks: {} };
  
  const newId = generateId(original.type);
  const clone: BuilderBlock = {
    ...original,
    id: newId,
    props: JSON.parse(JSON.stringify(original.props)),
    styles: JSON.parse(JSON.stringify(original.styles)),
  };
  
  let newBlocks = { [newId]: clone };
  
  if (original.childrenIds) {
    const newChildrenIds: string[] = [];
    original.childrenIds.forEach((cid) => {
      const childResult = duplicateBlockRecursive(cid, blocks);
      newChildrenIds.push(childResult.newId);
      newBlocks = { ...newBlocks, ...childResult.clonedBlocks };
    });
    clone.childrenIds = newChildrenIds;
  }
  
  return { newId, clonedBlocks: newBlocks };
};

let autosaveTimeout: NodeJS.Timeout | null = null;

const triggerAutosave = (get: any) => {
  if (autosaveTimeout) clearTimeout(autosaveTimeout);
  console.log("[Zustand Store] Triggering debounced autosave task in 400ms...");
  autosaveTimeout = setTimeout(() => {
    get().saveTheme();
  }, 400);
};

export const useEditorStore = create<EditorState>((set, get) => ({
  document: INITIAL_THEME_DOCUMENT,
  selectedBlockId: null,
  activePage: "home",
  deviceMode: "desktop",
  past: [],
  future: [],
  isPreviewMode: false,
  isCodeMode: false,
  showShortcutsHelp: false,
  userId: "default-builder-user",
  isSaving: false,
  saveStatus: "idle",

  setUserId: (userId) => {
    console.log(`[Zustand Store] Active userId set to: "${userId}"`);
    set({ userId });
  },
  setDeviceMode: (mode) => set({ deviceMode: mode }),
  setActivePage: (page) => set({ activePage: page, selectedBlockId: null }),
  selectBlock: (blockId) => set({ selectedBlockId: blockId }),

  togglePreviewMode: () => set((state) => ({ isPreviewMode: !state.isPreviewMode, selectedBlockId: null })),
  toggleCodeMode: () => set((state) => ({ isCodeMode: !state.isCodeMode })),
  toggleShortcutsHelp: (show) => set((state) => ({ showShortcutsHelp: show !== undefined ? show : !state.showShortcutsHelp })),

  loadTheme: async () => {
    try {
      const { userId } = get();
      console.log(`[Zustand Store] loadTheme initiated for userId: "${userId}"`);
      const res = await fetch(`/api/theme?userId=${encodeURIComponent(userId)}`);
      const data = await res.json();
      if (data.document) {
        console.log(`[Zustand Store] loadTheme completed. AST document successfully hydrated.`);
        set({ document: data.document, saveStatus: "saved" });
      } else {
        console.log(`[Zustand Store] loadTheme completed. No layout record found, using defaults.`);
      }
    } catch (error) {
      console.error("[Zustand Store] loadTheme task failed:", error);
    }
  },

  saveTheme: async () => {
    try {
      const { userId, document } = get();
      console.log(`[Zustand Store] saveTheme task initiated for userId: "${userId}"`);
      set({ isSaving: true, saveStatus: "saving" });
      
      const res = await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, document }),
      });
      
      const data = await res.json();
      if (data.success) {
        console.log("[Zustand Store] saveTheme completed successfully.");
        set({ isSaving: false, saveStatus: "saved" });
      } else {
        console.warn("[Zustand Store] saveTheme returned validation errors.");
        set({ isSaving: false, saveStatus: "error" });
      }
    } catch (error) {
      console.error("[Zustand Store] saveTheme task failed:", error);
      set({ isSaving: false, saveStatus: "error" });
    }
  },

  createCustomPage: (slug) => set((state) => {
    let cleanSlug = slug.trim().toLowerCase().replace(/\s+/g, "-");
    if (!cleanSlug.startsWith("custom-")) {
      cleanSlug = `custom-${cleanSlug}`;
    }

    if (state.document.pages[cleanSlug]) return {}; 

    const historyUpdate = saveToHistory(state);

    const customSecId = generateId("section");
    const customContentId = generateId("container");
    const customHeadingId = generateId("heading");

    const newBlocks = {
      ...state.document.blocks,
      [customSecId]: {
        id: customSecId,
        type: "section",
        props: {},
        styles: { paddingTop: "96px", paddingBottom: "96px", backgroundColor: "#ffffff" },
        childrenIds: [customContentId],
      },
      [customContentId]: {
        id: customContentId,
        type: "container",
        props: {},
        styles: { textAlign: "center" },
        childrenIds: [customHeadingId],
      },
      [customHeadingId]: {
        id: customHeadingId,
        type: "heading",
        props: { text: `Custom Page Template: ${cleanSlug}`, level: 1 },
        styles: { fontSize: "36px", marginBottom: "16px" },
      },
    };

    const newPages = {
      ...state.document.pages,
      [cleanSlug]: {
        sections: ["header-sec-1", customSecId, "footer-sec-3"],
      },
    };

    return {
      ...historyUpdate,
      document: {
        ...state.document,
        blocks: newBlocks,
        pages: newPages,
      },
      activePage: cleanSlug,
      selectedBlockId: customHeadingId,
    };
  }),

  duplicateCustomPage: (pageKey, newTitle) => set((state) => {
    let cleanSlug = newTitle.trim().toLowerCase().replace(/\s+/g, "-");
    if (!cleanSlug.startsWith("custom-")) {
      cleanSlug = `custom-${cleanSlug}`;
    }
    if (state.document.pages[cleanSlug]) return {};

    const historyUpdate = saveToHistory(state);
    const sourcePage = state.document.pages[pageKey];
    if (!sourcePage) return {};

    const newBlocks = { ...state.document.blocks };
    const newSections: string[] = [];

    sourcePage.sections.forEach((sid) => {
      if (sid === "header-sec-1" || sid === "footer-sec-3") {
        newSections.push(sid);
      } else {
        const { newId, clonedBlocks } = duplicateBlockRecursive(sid, newBlocks);
        Object.assign(newBlocks, clonedBlocks);
        newSections.push(newId);
      }
    });

    const newPages = {
      ...state.document.pages,
      [cleanSlug]: {
        sections: newSections,
        tagFilter: sourcePage.tagFilter || undefined,
      },
    };

    return {
      ...historyUpdate,
      document: {
        ...state.document,
        blocks: newBlocks,
        pages: newPages,
      },
      activePage: cleanSlug,
      selectedBlockId: null,
    };
  }),

  updatePageTagFilter: (pageKey, tag) => set((state) => {
    const page = state.document.pages[pageKey];
    if (!page) return {};

    const historyUpdate = saveToHistory(state);
    const newPages = {
      ...state.document.pages,
      [pageKey]: {
        ...page,
        tagFilter: tag,
      },
    };

    return {
      ...historyUpdate,
      document: {
        ...state.document,
        pages: newPages,
      },
    };
  }),

  addBlock: (type, parentId) => set((state) => {
    const historyUpdate = saveToHistory(state);
    const newBlock = createNewBlock(type);
    const newId = newBlock.id;
    const newBlocks = { ...state.document.blocks, [newId]: newBlock };
    const newPages = JSON.parse(JSON.stringify(state.document.pages)) as ThemePages;

    if (parentId && state.document.blocks[parentId]) {
      const parent = { ...state.document.blocks[parentId] };
      parent.childrenIds = [...(parent.childrenIds || []), newId];
      newBlocks[parentId] = parent;
    } else {
      if (type !== "section") {
        const autoSectionId = generateId("section");
        newBlocks[autoSectionId] = {
          id: autoSectionId,
          type: "section",
          props: {},
          styles: { paddingTop: "48px", paddingBottom: "48px" },
          childrenIds: [newId],
        };
        newPages[state.activePage].sections = [...newPages[state.activePage].sections, autoSectionId];
      } else {
        newPages[state.activePage].sections = [...newPages[state.activePage].sections, newId];
      }
    }

    setTimeout(() => triggerAutosave(get), 0);

    return {
      ...historyUpdate,
      document: { ...state.document, blocks: newBlocks, pages: newPages },
      selectedBlockId: newId,
    };
  }),

  insertBlockAt: (type, index, parentId) => set((state) => {
    const historyUpdate = saveToHistory(state);
    const newBlock = createNewBlock(type);
    const newId = newBlock.id;
    const newBlocks = { ...state.document.blocks, [newId]: newBlock };
    const newPages = JSON.parse(JSON.stringify(state.document.pages)) as ThemePages;

    if (parentId && state.document.blocks[parentId]) {
      const parent = { ...state.document.blocks[parentId] };
      const childrenIds = [...(parent.childrenIds || [])];
      childrenIds.splice(index, 0, newId);
      parent.childrenIds = childrenIds;
      newBlocks[parentId] = parent;
    } else {
      if (type !== "section") {
        const autoSectionId = generateId("section");
        newBlocks[autoSectionId] = {
          id: autoSectionId,
          type: "section",
          props: {},
          styles: { paddingTop: "48px", paddingBottom: "48px" },
          childrenIds: [newId],
        };
        const sections = [...newPages[state.activePage].sections];
        sections.splice(index, 0, autoSectionId);
        newPages[state.activePage].sections = sections;
      } else {
        const sections = [...newPages[state.activePage].sections];
        sections.splice(index, 0, newId);
        newPages[state.activePage].sections = sections;
      }
    }

    setTimeout(() => triggerAutosave(get), 0);

    return {
      ...historyUpdate,
      document: { ...state.document, blocks: newBlocks, pages: newPages },
      selectedBlockId: newId,
    };
  }),

  moveBlock: (activeId, overId) => set((state) => {
    if (activeId === overId) return {};
    const historyUpdate = saveToHistory(state);

    const newBlocks = { ...state.document.blocks };
    const newPages = JSON.parse(JSON.stringify(state.document.pages)) as ThemePages;

    const findParent = (id: string): { parentId: string | null; isRoot: boolean; index: number } => {
      const rootIndex = newPages[state.activePage].sections.indexOf(id);
      if (rootIndex !== -1) {
        return { parentId: null, isRoot: true, index: rootIndex };
      }
      
      for (const pid of Object.keys(newBlocks)) {
        const block = newBlocks[pid];
        if (block.childrenIds) {
          const idx = block.childrenIds.indexOf(id);
          if (idx !== -1) {
            return { parentId: pid, isRoot: false, index: idx };
          }
        }
      }
      return { parentId: null, isRoot: false, index: -1 };
    };

    const activeInfo = findParent(activeId);
    const overInfo = findParent(overId);

    if (activeInfo.index === -1) return {};

    if (activeInfo.isRoot) {
      newPages[state.activePage].sections.splice(activeInfo.index, 1);
    } else if (activeInfo.parentId) {
      const parent = { ...newBlocks[activeInfo.parentId] };
      parent.childrenIds = (parent.childrenIds || []).filter(id => id !== activeId);
      newBlocks[activeInfo.parentId] = parent;
    }

    const targetIndex = overInfo.index === -1 ? 0 : overInfo.index;
    if (overInfo.isRoot || (activeInfo.isRoot && overInfo.index !== -1)) {
      const sections = [...newPages[state.activePage].sections];
      sections.splice(targetIndex, 0, activeId);
      newPages[state.activePage].sections = sections;
    } else {
      const destParentId = overInfo.parentId || overId;
      if (newBlocks[destParentId]) {
        const parent = { ...newBlocks[destParentId] };
        const childrenIds = [...(parent.childrenIds || [])];
        childrenIds.splice(targetIndex, 0, activeId);
        parent.childrenIds = childrenIds;
        newBlocks[destParentId] = parent;
      }
    }

    setTimeout(() => triggerAutosave(get), 0);

    return {
      ...historyUpdate,
      document: { ...state.document, blocks: newBlocks, pages: newPages }
    };
  }),

  updateBlockProps: (blockId, props) => set((state) => {
    if (!state.document.blocks[blockId]) return {};
    const historyUpdate = saveToHistory(state);
    
    const updatedBlock = {
      ...state.document.blocks[blockId],
      props: {
        ...state.document.blocks[blockId].props,
        ...props,
      },
    };

    setTimeout(() => triggerAutosave(get), 0);

    return {
      ...historyUpdate,
      document: {
        ...state.document,
        blocks: { ...state.document.blocks, [blockId]: updatedBlock },
      },
    };
  }),

  updateBlockStyles: (blockId, styles) => set((state) => {
    if (!state.document.blocks[blockId]) return {};
    const historyUpdate = saveToHistory(state);
    
    const updatedBlock = {
      ...state.document.blocks[blockId],
      styles: {
        ...state.document.blocks[blockId].styles,
        ...styles,
      },
    };

    setTimeout(() => triggerAutosave(get), 0);

    return {
      ...historyUpdate,
      document: {
        ...state.document,
        blocks: { ...state.document.blocks, [blockId]: updatedBlock },
      },
    };
  }),

  deleteBlock: (blockId) => set((state) => {
    if (!state.document.blocks[blockId]) return {};
    const historyUpdate = saveToHistory(state);

    const newBlocks = { ...state.document.blocks };
    delete newBlocks[blockId];

    const newPages = JSON.parse(JSON.stringify(state.document.pages)) as ThemePages;
    newPages[state.activePage].sections = newPages[state.activePage].sections.filter(id => id !== blockId);

    Object.keys(newBlocks).forEach((id) => {
      const block = newBlocks[id];
      if (block.childrenIds && block.childrenIds.includes(blockId)) {
        newBlocks[id] = {
          ...block,
          childrenIds: block.childrenIds.filter(cid => cid !== blockId),
        };
      }
    });

    setTimeout(() => triggerAutosave(get), 0);

    return {
      ...historyUpdate,
      document: { ...state.document, blocks: newBlocks, pages: newPages },
      selectedBlockId: state.selectedBlockId === blockId ? null : state.selectedBlockId,
    };
  }),

  duplicateBlock: (blockId) => set((state) => {
    if (!state.document.blocks[blockId]) return {};
    const historyUpdate = saveToHistory(state);

    const newBlocks = { ...state.document.blocks };
    const { newId, clonedBlocks } = duplicateBlockRecursive(blockId, newBlocks);
    Object.assign(newBlocks, clonedBlocks);

    const newPages = JSON.parse(JSON.stringify(state.document.pages)) as ThemePages;
    const sections = newPages[state.activePage].sections;

    const idx = sections.indexOf(blockId);
    if (idx !== -1) {
      sections.splice(idx + 1, 0, newId);
      newPages[state.activePage].sections = sections;
    } else {
      for (const pid of Object.keys(newBlocks)) {
        const parent = newBlocks[pid];
        if (parent.childrenIds) {
          const cidx = parent.childrenIds.indexOf(blockId);
          if (cidx !== -1) {
            const children = [...parent.childrenIds];
            children.splice(cidx + 1, 0, newId);
            parent.childrenIds = children;
            newBlocks[pid] = parent;
            break;
          }
        }
      }
    }

    return {
      ...historyUpdate,
      document: { ...state.document, blocks: newBlocks, pages: newPages },
      selectedBlockId: newId,
    };
  }),

  reorderBlocks: (sourceIndex, destinationIndex, parentId) => set((state) => {
    const historyUpdate = saveToHistory(state);
    
    if (parentId && state.document.blocks[parentId]) {
      const parent = { ...state.document.blocks[parentId] };
      const childrenIds = [...(parent.childrenIds || [])];
      const [removed] = childrenIds.splice(sourceIndex, 1);
      childrenIds.splice(destinationIndex, 0, removed);
      parent.childrenIds = childrenIds;

      return {
        ...historyUpdate,
        document: {
          ...state.document,
          blocks: { ...state.document.blocks, [parentId]: parent },
        },
      };
    } else {
      const sections = [...state.document.pages[state.activePage].sections];
      const [removed] = sections.splice(sourceIndex, 1);
      sections.splice(destinationIndex, 0, removed);

      const newPages = {
        ...state.document.pages,
        [state.activePage]: {
          ...state.document.pages[state.activePage],
          sections,
        },
      };

      return {
        ...historyUpdate,
        document: { ...state.document, pages: newPages },
      };
    }
  }),

  undo: () => set((state) => {
    if (state.past.length === 0) return {};
    const newPast = [...state.past];
    const previous = newPast.pop()!;
    
    return {
      past: newPast,
      future: [JSON.parse(JSON.stringify(state.document)), ...state.future],
      document: previous,
    };
  }),

  redo: () => set((state) => {
    if (state.future.length === 0) return {};
    const newFuture = [...state.future];
    const next = newFuture.shift()!;
    
    return {
      past: [...state.past, JSON.parse(JSON.stringify(state.document))],
      future: newFuture,
      document: next,
    };
  }),
}));
