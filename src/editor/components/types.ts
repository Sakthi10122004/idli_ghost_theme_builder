import React from "react";
import { BuilderBlock } from "@/types/theme";

export interface ComponentDefinition {
  type: string;
  defaultProps: Record<string, any>;
  defaultStyles: Record<string, any>;
  CanvasElement: React.ComponentType<{
    block: BuilderBlock;
    isSelected: boolean;
    onClick: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
    renderChildren: () => React.ReactNode;
  }>;
  SidebarElement: React.ComponentType<{
    block: BuilderBlock;
    onChangeProps: (props: Record<string, any>) => void;
    onChangeStyles: (styles: Record<string, any>) => void;
  }>;
  compileToHbs: (block: BuilderBlock, compiledChildren: string, isPageContext: boolean) => string;
}
