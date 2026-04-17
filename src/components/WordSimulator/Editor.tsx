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
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              let container = range.commonAncestorContainer as any;
              while (container && container !== ref && !['LI', 'OL', 'UL'].includes(container.tagName)) {
                container = container.parentNode;
              }
              
              if (container && (container.tagName === 'LI' || container.tagName === 'OL' || container.tagName === 'UL')) {
                // Inside a list: Tab indents (multilevel list)
                if (e.shiftKey) {
                  document.execCommand('outdent', false);
                } else {
                  document.execCommand('indent', false);
                }
              } else {
                // Outside a list: standard tab
                document.execCommand('insertText', false, '\t');
              }
            }
          }
          
          if (e.key === 'Enter') {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              let container = range.commonAncestorContainer as any;
              
              // Traverse up to find block element
              while (container && container !== ref && !['H1', 'H2', 'H3', 'P', 'DIV', 'LI'].includes(container.tagName)) {
                container = container.parentNode;
              }
              
              if (container) {
                // If it's an empty list item, Enter should exit the list (Word behavior)
                if (container.tagName === 'LI' && container.textContent.trim() === '') {
                  e.preventDefault();
                  document.execCommand('outdent', false); // This usually exits the list if at level 0
                  return;
                }

                if (['H1', 'H2', 'H3'].includes(container.tagName)) {
                  // If cursor is at the end of a heading, the next block should be a paragraph
                  setTimeout(() => {
                    document.execCommand('formatBlock', false, '<p>');
                    document.execCommand('fontSize', false, '3');
                  }, 0);
                }
              }
            }
          }
        }}
        onKeyUp={(e) => {
          // Word Auto-Numbering System
          if (e.key === ' ') {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              const container = range.startContainer;
              
              if (container.nodeType === Node.TEXT_NODE) {
                const text = container.textContent || '';
                const cursorPosition = range.startOffset;
                const lineStart = text.lastIndexOf('\n', cursorPosition - 2) + 1;
                const currentLineText = text.substring(lineStart, cursorPosition);
                
                // Matches "1. " or "1) " at the start of a line
                if (/^1[\.\)]\s$/.test(currentLineText)) {
                  // Select the auto-trigger text
                  const selectRange = document.createRange();
                  selectRange.setStart(container, cursorPosition - currentLineText.length);
                   selectRange.setEnd(container, cursorPosition);
                  selection.removeAllRanges();
                  selection.addRange(selectRange);
                  
                  // Delete it and insert an ordered list
                  document.execCommand('delete');
                  document.execCommand('insertOrderedList');
                } 
                // Matches "* " or "- " at the start of a line for bullets
                else if (/^[\*\-]\s$/.test(currentLineText)) {
                   const selectRange = document.createRange();
                  selectRange.setStart(container, cursorPosition - currentLineText.length);
                  selectRange.setEnd(container, cursorPosition);
                  selection.removeAllRanges();
                  selection.addRange(selectRange);
                  
                  document.execCommand('delete');
                  document.execCommand('insertUnorderedList');
                }
              }
            }
          }
          
          if (onChange) {
            onChange((e.currentTarget as HTMLDivElement).innerHTML);
          }
        }}
      />
    </div>
  );
});

Editor.displayName = 'Editor';
