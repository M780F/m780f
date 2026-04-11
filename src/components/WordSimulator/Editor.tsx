import React, { forwardRef } from 'react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  isArabic?: boolean;
}

export const Editor = forwardRef<HTMLDivElement, EditorProps>(({ content, onChange, isArabic = false }, ref) => {
  return (
    <div className="w-full max-w-[816px] min-h-[1056px] bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] p-4 sm:p-12 md:p-[96px] outline-none cursor-text relative mb-8 sm:mb-20 mx-auto">
      {/* Page Border/Shadow Effect */}
      <div className="absolute inset-0 pointer-events-none border border-gray-100" />
      
      {/* Ruler-like guides (visual only) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-50 border-b border-gray-200 hidden sm:block" />
      <div className="absolute top-0 left-0 h-full w-1 bg-gray-50 border-r border-gray-200 hidden sm:block" />

      <div
        ref={ref}
        contentEditable
        inputMode="none"
        suppressContentEditableWarning
        dir={isArabic ? 'rtl' : 'ltr'}
        className={`w-full h-full min-h-[864px] outline-none leading-[1.5] text-gray-900 break-words ${isArabic ? 'font-sans' : 'font-serif'}`}
        style={{ 
          fontFamily: isArabic ? "'Arial', sans-serif" : "'Times New Roman', serif",
          fontSize: '16px',
          touchAction: 'manipulation'
        }}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onKeyDown={(e) => {
          if (e.key === 'Tab') {
            e.preventDefault();
            document.execCommand('insertText', false, '\t');
          }
        }}
      />
    </div>
  );
});

Editor.displayName = 'Editor';
