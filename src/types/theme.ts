export interface ThemeMetadata {
  name: string;
  version: string;
  author: string;
  description?: string;
}

export interface DesignTokens {
  colors: {
    background: string;
    foreground: string;
    muted: string;
    primary: string;
    accent: string;
  };
  typography: {
    bodyFont: string;
    headingFont: string;
    baseSize: string;
  };
  spacing: {
    sectionPadding: string;
    contentPadding: string;
  };
  radii: {
    cardRadius: string;
    buttonRadius: string;
  };
}

export interface ThemeSettings {
  containerWidth: number;
  fontFamily: string;
  primaryColor: string;
  designTokens: DesignTokens;
}

export interface ResponsiveStyleValue<T> {
  desktop: T;
  tablet?: T;
  mobile?: T;
}

export interface BuilderBlock {
  id: string;
  type: string;
  props: Record<string, any>;
  styles: {
    paddingTop?: ResponsiveStyleValue<string> | string;
    paddingBottom?: ResponsiveStyleValue<string> | string;
    marginTop?: ResponsiveStyleValue<string> | string;
    marginBottom?: ResponsiveStyleValue<string> | string;
    textAlign?: ResponsiveStyleValue<'left' | 'center' | 'right'> | string;
    backgroundColor?: string;
    textColor?: string;
    [key: string]: any;
  };
  // Supporting nested children blocks (e.g. Columns holding Column containers)
  childrenIds?: string[];
}

export interface PageDefinition {
  sections: string[]; // List of Block IDs that are top-level sections
  tagFilter?: string;
}

export interface ThemePages {
  home: PageDefinition;
  post: PageDefinition;
  page: PageDefinition;
  author: PageDefinition;
  tag: PageDefinition;
  error: PageDefinition;
  [key: string]: PageDefinition;
}

export interface ThemeDocument {
  metadata: ThemeMetadata;
  settings: ThemeSettings;
  pages: ThemePages;
  // A flat dictionary of all blocks on the canvas to make reordering and manipulation simple
  blocks: Record<string, BuilderBlock>;
}
