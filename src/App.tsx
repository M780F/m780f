import React, { useState, useRef, useEffect } from 'react';
import { Ribbon } from './components/WordSimulator/Ribbon';
import { Editor } from './components/WordSimulator/Editor';
import { StatusBar } from './components/WordSimulator/StatusBar';
import { VirtualKeyboard } from './components/WordSimulator/VirtualKeyboard';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function App() {
  const [content, setContent] = useState('');
  const [selection, setSelection] = useState<Selection | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [isRibbonCollapsed, setIsRibbonCollapsed] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Track selection to enable/disable toolbar buttons
  useEffect(() => {
    const handleSelectionChange = () => {
      setSelection(window.getSelection());
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  // Auto-scroll to cursor when typing
  useEffect(() => {
    const scrollToCursor = () => {
      if (showKeyboard && editorRef.current) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const workspace = editorRef.current.parentElement;
          
          if (workspace) {
            const workspaceRect = workspace.getBoundingClientRect();
            // If cursor is below the visible area (above keyboard)
            if (rect.bottom > workspaceRect.bottom - 50) {
              workspace.scrollBy({ top: 100, behavior: 'smooth' });
            }
          }
        }
      }
    };

    const observer = new MutationObserver(scrollToCursor);
    if (editorRef.current) {
      observer.observe(editorRef.current, { childList: true, characterData: true, subtree: true });
    }
    return () => observer.disconnect();
  }, [showKeyboard]);

  const handleFormat = (command: string, value?: string) => {
    if (!editorRef.current) return;
    
    // Ensure editor is focused before executing command
    editorRef.current.focus();
    
    // Use CSS styles instead of HTML tags (better for mobile/iPhone)
    document.execCommand('styleWithCSS', false, true as any);
    
    if (command === 'fontSize') {
      // Map 1-7 to actual pixel sizes for better iPhone support
      const sizeMap: Record<string, string> = {
        '1': '12px',
        '2': '14px',
        '3': '16px',
        '4': '18px',
        '5': '24px',
        '6': '32px',
        '7': '48px'
      };
      document.execCommand('fontSize', false, sizeMap[value || '3']);
    } else if (command === 'fontName') {
      document.execCommand('fontName', false, value);
    } else if (command === 'insertTable') {
      const rows = 3;
      const cols = 3;
      let tableHtml = '<table style="width:100%; border-collapse:collapse; border:1px solid #ccc; margin:10px 0;">';
      for (let i = 0; i < rows; i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < cols; j++) {
          tableHtml += '<td style="border:1px solid #ccc; padding:8px; min-height:20px;">&nbsp;</td>';
        }
        tableHtml += '</tr>';
      }
      tableHtml += '</table><p>&nbsp;</p>';
      document.execCommand('insertHTML', false, tableHtml);
    } else if (command === 'insertImage') {
      const url = prompt('Enter image URL:', 'https://picsum.photos/400/300');
      if (url) {
        document.execCommand('insertImage', false, url);
      }
    } else if (command === 'formatBlock') {
      document.execCommand('formatBlock', false, `<${value}>`);
      // If switching back to Normal (p), reset font size to default (3 = 11pt/16px)
      if (value === 'p') {
        document.execCommand('fontSize', false, '3');
      }
    } else {
      document.execCommand(command, false, value);
    }
    editorRef.current.focus();
  };

  const handleKeyClick = (key: string) => {
    if (!editorRef.current) return;
    
    editorRef.current.focus();
    const sel = window.getSelection();
    
    if (key === 'Backspace') {
      document.execCommand('delete', false);
    } else if (key === 'Enter') {
      document.execCommand('insertLineBreak', false);
    } else if (key === 'Space') {
      document.execCommand('insertText', false, ' ');
    } else if (key === 'Tab') {
      document.execCommand('insertText', false, '\t');
    } else if (key === 'Left') {
      sel?.modify('move', 'backward', 'character');
    } else if (key === 'Right') {
      sel?.modify('move', 'forward', 'character');
    } else if (key === 'Up') {
      sel?.modify('move', 'backward', 'line');
    } else if (key === 'Down') {
      sel?.modify('move', 'forward', 'line');
    } else if (key === 'Esc') {
      setShowKeyboard(false);
    } else if (key.length === 1) {
      document.execCommand('insertText', false, key);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-[#f3f2f1] overflow-hidden font-sans select-none">
        {/* Ribbon Header - Auto-collapses or can be manually toggled */}
        <div className={`transition-all duration-300 ease-in-out ${isRibbonCollapsed ? 'h-8 sm:h-9' : 'h-auto'}`}>
          <Ribbon 
            onFormat={handleFormat} 
            onToggleKeyboard={() => setShowKeyboard(!showKeyboard)} 
            isCollapsed={isRibbonCollapsed}
            onToggleCollapse={() => setIsRibbonCollapsed(!isRibbonCollapsed)}
          />
        </div>
        
        {/* Main Workspace */}
        <div 
          className="flex-1 overflow-y-auto w-full flex flex-col items-center p-2 sm:p-6 md:p-10 lg:p-16 scrollbar-hide bg-[#e6e6e6]"
          onClick={() => {
            if (!showKeyboard) editorRef.current?.focus();
          }}
        >
          <Editor 
            ref={editorRef} 
            content={content} 
            onChange={setContent} 
            isArabic={isArabic}
          />
        </div>

        {/* Virtual Keyboard */}
        {showKeyboard && (
          <div className="bg-white border-t border-gray-300 p-1 sm:p-4 animate-in slide-in-from-bottom duration-300 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] z-20">
            <VirtualKeyboard 
              onKeyClick={handleKeyClick} 
              onClose={() => setShowKeyboard(false)} 
              isArabic={isArabic}
              onLanguageToggle={() => setIsArabic(!isArabic)}
            />
          </div>
        )}

        {/* Status Bar - Hidden on very short screens (landscape mobile) */}
        <div className="hidden min-h-[400px]:block">
          <StatusBar content={content} />
        </div>
      </div>
    </TooltipProvider>
  );
}
