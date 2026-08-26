import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";
export const CanvasElement = ({ block, isSelected, onClick, onDelete, renderChildren }: {
  block: BuilderBlock;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  renderChildren: () => React.ReactNode;
}) => {
  const p = block.props;
  
  const document = useEditorStore(state => state.document);
  const headerBlock = Object.values(document.blocks).find(b => b.type === "header");
  const headerAppearance = headerBlock?.props?.appearance || {};
  
  const isSync = p.colors?.syncWithHeader;
  const headerBg = headerAppearance.backgroundColor || "#ffffff";
  const headerText = headerAppearance.textColor || "#000000";
  const bg = isSync ? headerBg : (p.colors?.backgroundColor || "#ffffff");
  const text = isSync ? headerText : (p.colors?.textColor || "#1a1a1a");

  const layoutStyle = p.general?.layoutStyle || "Simple Minimal";
  const showSecondaryNav = p.general?.showSecondaryNav !== false;
  const showSocialIcons = p.general?.showSocialIcons !== false;
  const showCopyright = p.general?.showCopyright !== false;
  const showSubscribeBox = p.general?.showSubscribeBox !== false;
  
  const copyrightText = p.general?.customCopyrightText || "© 2026 Ghost Theme Builder. Published with Ghost.";
  
  const socialIcons = (
    <div className="flex gap-4 items-center">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23.998 12c0-6.628-5.372-12-11.999-12C5.372 0 0 5.372 0 12c0 5.988 4.388 10.954 10.124 11.852v-8.384H7.078v-3.469h3.046V9.356c0-3.008 1.792-4.669 4.532-4.669 1.313 0 2.686.234 2.686.234v2.953H15.83c-1.49 0-1.955.925-1.955 1.874V12h3.328l-.532 3.469h-2.796v8.384c5.736-.898 10.124-5.864 10.124-11.853z"/></svg>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/></svg>
    </div>
  );

  return (
    <footer 
      className="site-footer w-full py-10 px-6 transition-all"
      style={{ backgroundColor: bg, color: text }}
      onClick={onClick}
    >
      <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8">
        
        {layoutStyle === "Multi-Column" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
            <div className="flex flex-col gap-4">
              <h4 className="text-xl font-bold">Your Publication</h4>
              <p className="opacity-80 leading-relaxed">Thoughts, stories and ideas about building modern software and design.</p>
              {showSocialIcons && socialIcons}
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-wider opacity-60">Navigation</h4>
              <nav className="flex flex-col gap-3 opacity-80">
                <span>Home</span>
                <span>About</span>
                <span>Collection</span>
              </nav>
            </div>
            {showSecondaryNav && (
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold uppercase tracking-wider opacity-60">More</h4>
                <nav className="flex flex-col gap-3 opacity-80">
                  <span>Privacy Policy</span>
                  <span>Terms of Service</span>
                  <span>Contact</span>
                </nav>
              </div>
            )}
          </div>
        )}

        {layoutStyle === "Newsletter Integrated" && showSubscribeBox && (
          <div className="text-center max-w-[600px] mx-auto mb-10 p-12 rounded-xl" style={{ backgroundColor: 'currentColor', color: bg }}>
            <h3 className="text-2xl font-bold mb-3">Subscribe to our newsletter</h3>
            <p className="opacity-80 mb-6">Get the latest posts delivered right to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-[400px] mx-auto">
              <input type="email" placeholder="Your email address" className="flex-1 px-4 py-3 rounded-md outline-none text-black" readOnly />
              <button className="px-6 py-3 font-bold rounded-md" style={{ backgroundColor: p.colors?.buttonBgColor || '#000', color: p.colors?.buttonTextColor || '#fff' }}>Subscribe</button>
            </div>
          </div>
        )}

        {/* Footer Bottom Row */}
        <div className={`flex flex-col md:flex-row items-center gap-6 text-sm ${layoutStyle !== "Simple Minimal" ? 'pt-6 border-t opacity-90 border-current border-opacity-20 md:justify-between' : 'justify-between'}`}>
          {showCopyright && <span className="opacity-70">{copyrightText}</span>}
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            {showSecondaryNav && layoutStyle !== "Multi-Column" && (
              <nav className="flex gap-4 opacity-80">
                <span>Privacy</span>
                <span>Terms</span>
              </nav>
            )}
            {showSocialIcons && layoutStyle !== "Multi-Column" && socialIcons}
          </div>
        </div>

      </div>
    </footer>
  );
};