import React, { forwardRef } from 'react';

interface EditorProps {
  pages: string[];
  currentPageIndex: number;
  onChange: (content: string, index: number) => void;
  isArabic?: boolean;
  header?: string;
  footer?: string;
  onHeaderChange?: (content: string) => void;
  onFooterChange?: (content: string) => void;
  showHeader?: boolean;
  showFooter?: boolean;
  onFocusPage?: (index: number) => void;
}

export const Editor = forwardRef<any, EditorProps>(({ 
  pages,
  currentPageIndex,
  onChange, 
  isArabic = false,
  header = '',
  footer = '',
  onHeaderChange,
  onFooterChange,
  showHeader = false,
  showFooter = false,
  onFocusPage
}, ref) => {
  const pageRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const headerRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const footerRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => ({
    focus: (index: number = currentPageIndex) => {
      const el = pageRefs.current[index];
      if (el) el.focus();
    },
    get element() {
      return pageRefs.current[currentPageIndex];
    },
    get root() {
      return rootRef.current;
    }
  }));

  // Function to replace {page} with current index
  const formatHeaderFooter = React.useCallback((text: string, pageNum: number) => {
    return text.split('{page}').join(pageNum.toString());
  }, []);

  // Function to sync content if it changes externally (e.g. from state)
  React.useEffect(() => {
    // Sync Pages
    pages.forEach((content, index) => {
      const el = pageRefs.current[index];
      if (el && el.innerHTML !== content && document.activeElement !== el) {
        el.innerHTML = content;
      }
    });

    // Sync Headers
    pages.forEach((_, index) => {
      const el = headerRefs.current[index];
      const content = formatHeaderFooter(header, index + 1);
      if (el && el.innerHTML !== content && document.activeElement !== el) {
        el.innerHTML = content;
      }
    });

    // Sync Footers
    pages.forEach((_, index) => {
      const el = footerRefs.current[index];
      const content = formatHeaderFooter(footer, index + 1);
      if (el && el.innerHTML !== content && document.activeElement !== el) {
        el.innerHTML = content;
      }
    });
  }, [pages, header, footer, formatHeaderFooter]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '\t');
    }
  };

  return (
    <div ref={rootRef} className="flex flex-col gap-10 pb-32 items-center w-full">
      {pages.map((pageContent, index) => (
        <div 
          key={index}
          className={`pdf-page html2pdf__page-break w-full max-w-[816px] min-h-[1056px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-4 sm:p-12 md:p-[96px] pt-16 md:pt-[128px] pb-16 md:pb-[128px] outline-none relative mx-auto transition-all duration-300 shrink-0 ${index === currentPageIndex ? 'shadow-[0_8px_32px_rgba(0,0,0,0.12)]' : ''}`}
          onClick={() => onFocusPage?.(index)}
        >
          {/* Page Border/Shadow Effect */}
          <div className="absolute inset-0 pointer-events-none border border-gray-100/50" />
          
          {/* Header Area */}
          {showHeader && (
            <div 
              className="absolute top-4 sm:top-8 left-4 sm:left-12 md:left-[96px] right-4 sm:right-12 md:right-[96px] border-b border-dashed border-gray-100 py-2 group/header z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -top-4 left-0 text-[9px] text-gray-400 font-bold uppercase opacity-0 group-hover:opacity-100 group-hover/header:opacity-100 transition-opacity">Header</div>
              <div
                ref={(el) => (headerRefs.current[index] = el)}
                contentEditable
                inputMode="none"
                suppressContentEditableWarning
                className="outline-none text-xs text-gray-400 min-h-[20px]"
                onInput={(e) => onHeaderChange?.(e.currentTarget.innerHTML)}
              >
                {/* Initial content set by sync useEffect */}
              </div>
            </div>
          )}

          {/* Page Label (Lateral) removed as per user request */}

          <div
            ref={(el) => {
              if (index === 0 && ref) {
                if (typeof ref === 'function') ref(el);
                else (ref as any).current = el;
              }
              pageRefs.current[index] = el;
            }}
            id={`page-editor-${index}`}
            className={`document-page w-full h-full min-h-[820px] outline-none leading-[1.5] text-gray-900 break-words ${isArabic ? 'font-sans' : 'font-serif'}`}
            contentEditable
            inputMode="none"
            suppressContentEditableWarning
            dir={isArabic ? 'rtl' : 'ltr'}
            style={{ 
              fontFamily: isArabic ? "'Arial', sans-serif" : "'Times New Roman', serif",
              fontSize: '16px',
            }}
            onInput={(e) => onChange(e.currentTarget.innerHTML, index)}
            onFocus={() => onFocusPage?.(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />

          {/* Footer Area */}
          {showFooter && (
            <div 
              className="absolute bottom-4 sm:bottom-8 left-4 sm:left-12 md:left-[96px] right-4 sm:right-12 md:right-[96px] border-t border-dashed border-gray-100 py-2 group/footer z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -bottom-4 left-0 text-[9px] text-gray-400 font-bold uppercase opacity-0 group-hover:opacity-100 group-hover/footer:opacity-100 transition-opacity">Footer</div>
              <div
                ref={(el) => (footerRefs.current[index] = el)}
                contentEditable
                inputMode="none"
                suppressContentEditableWarning
                className="outline-none text-xs text-gray-400 min-h-[20px] text-center"
                onInput={(e) => onFooterChange?.(e.currentTarget.innerHTML)}
              >
                {/* Initial content set by sync useEffect */}
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Floating Page Navigation removed as per user request */}
    </div>
  );
});

Editor.displayName = 'Editor';
