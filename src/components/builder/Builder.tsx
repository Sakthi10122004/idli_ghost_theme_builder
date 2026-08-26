"use client";

import Toolbar from "./Toolbar";
import LeftSidebar from "./LeftSidebar";
import Canvas from "./Canvas";
import RightSidebar from "./RightSidebar";
import CodeInspector from "./CodeInspector";
import KeyboardShortcuts from "./KeyboardShortcuts";
import DndWrapper from "./DndWrapper";
import { useEditorStore } from "@/store/editorStore";

import React, { useEffect, useState } from "react";
import AuthPortal from "./AuthPortal";

export default function Builder() {
  const { isPreviewMode, setUserId, loadTheme } = useEditorStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    setIsHydrated(true);

    // Resolve user details on load
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then(async (data) => {
        if (data.authenticated) {
          setUserId(data.userId);
          setIsAuthenticated(true);
          await loadTheme();
        }
      })
      .catch(console.error)
      .finally(() => setCheckingAuth(false));
  }, []);

  const handleAuthSuccess = (userId: string) => {
    setUserId(userId);
    setIsAuthenticated(true);
    loadTheme();
  };

  if (!isHydrated || checkingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-brand-canvas-soft font-sans text-xs text-brand-mute">
        Verifying user session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPortal onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <DndWrapper>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-brand-canvas-soft select-none font-sans">
        <Toolbar />
        <div className="flex flex-1 overflow-hidden min-h-0 w-full relative">
          {!isPreviewMode && <LeftSidebar />}
          <Canvas />
          {!isPreviewMode && <RightSidebar />}
          <CodeInspector />
        </div>
        <KeyboardShortcuts />
      </div>
    </DndWrapper>
  );
}
