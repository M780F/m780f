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
  const [selectedImage, setSelectedImage] = useState<HTMLElement | null>(null);
  const [activeStyles, setActiveStyles] = useState<{
    bold: boolean;
    italic: boolean;
    underline: boolean;
    list: boolean;
    orderedList: boolean;
    align: string;
    fontSize: string;
    fontName: string;
    blockType: string;
    color: string;
  }>({
    bold: false,
    italic: false,
    underline: false,
    list: false,
    orderedList: false,
    align: 'left',
    fontSize: '3',
    fontName: 'Arial',
    blockType: 'p',
    color: '#000000'
  });

  useEffect(() => {
    const updateStyles = () => {
      if (typeof document === 'undefined') return;
      
      const styles = {
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        list: document.queryCommandState('insertUnorderedList'),
        orderedList: document.queryCommandState('insertOrderedList'),
        align: 
          document.queryCommandState('justifyCenter') ? 'center' :
          document.queryCommandState('justifyRight') ? 'right' :
          document.queryCommandState('justifyFull') ? 'justify' : 'left',
        fontSize: (() => {
          const val = document.queryCommandValue('fontSize');
          // If it's a legacy value (1-7), return it
          if (['1', '2', '3', '4', '5', '6', '7'].includes(val)) return val;
          
          // Otherwise check computed style for precise pt/px values
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            let node = selection.anchorNode as any;
            if (node.nodeType === 3) node = node.parentNode;
            if (node) {
              const fs = window.getComputedStyle(node).fontSize;
              // Map common Word-like pixel/pt sizes back to 1-7 for the selector
              if (fs.includes('10px') || fs.includes('8pt')) return '1';
              if (fs.includes('13px') || fs.includes('10pt')) return '2';
              if (fs.includes('16px') || fs.includes('12pt') || fs.includes('11pt')) return '3';
              if (fs.includes('18px') || fs.includes('14pt')) return '4';
              if (fs.includes('24px') || fs.includes('18pt')) return '5';
              if (fs.includes('32px') || fs.includes('24pt')) return '6';
              if (fs.includes('48px') || fs.includes('36pt')) return '7';
            }
          }
          return val || '3';
        })(),
        fontName: (document.queryCommandValue('fontName') || 'Arial').replace(/['"]/g, ''),
        blockType: document.queryCommandValue('formatBlock') || 'p',
        color: document.queryCommandValue('foreColor') || '#000000'
      };
      
      setActiveStyles(styles);
    };

    document.addEventListener('selectionchange', updateStyles);
    return () => document.removeEventListener('selectionchange', updateStyles);
  }, []);

  useEffect(() => {
    // Add/remove selection class on previous and new selected image
    const wrappers = document.querySelectorAll('.image-wrapper');
    wrappers.forEach(w => w.classList.remove('selected'));
    if (selectedImage) {
      selectedImage.classList.add('selected');
    }
  }, [selectedImage]);
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      applyModernFontSize(value || '3');
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
      imageInputRef.current?.click();
    } else if (command === 'insertFile') {
      fileInputRef.current?.click();
    } else if (command === 'formatBlock') {
      const currentBlock = document.queryCommandValue('formatBlock').toLowerCase();
      const targetBlock = value?.toLowerCase();
      
      // Microsoft Word Style application:
      // Applying a style usually resets character formatting to the style's default
      if (currentBlock === targetBlock) {
        document.execCommand('formatBlock', false, '<p>');
        // Word's Normal size is typically 11pt/12pt
        applyModernFontSize('3');
      } else {
        document.execCommand('formatBlock', false, `<${value}>`);
        // When applying a heading, browsers often keep old font size. 
        // We force it to reset to heading default unless it's a paragraph.
        if (value !== 'p') {
          // Headings in Word have distinct sizes
          const headingSizes: Record<string, string> = {
            'h1': '7', // approx 24-36pt
            'h2': '6', // approx 18-24pt
            'h3': '5'  // approx 14-18pt
          };
          applyModernFontSize(headingSizes[value?.toLowerCase() || 'h1'] || '4');
        } else {
          applyModernFontSize('3');
        }
      }
    } else if (command.startsWith('image')) {
      handleImageFormat(command, value);
    } else {
      document.execCommand(command, false, value);
    }
    editorRef.current.focus();
  };

  const applyModernFontSize = (sizeValue: string) => {
    // Exact pt mapping equivalent to Word
    const sizeMap: Record<string, string> = {
      '1': '8pt',
      '2': '10pt',
      '3': '11pt',
      '4': '14pt',
      '5': '18pt',
      '6': '24pt',
      '7': '36pt'
    };
    
    const ptSize = sizeMap[sizeValue] || '11pt';
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);

    // Microsoft Word behavior: If selection, wrap it. If cursor, toggle for next chars.
    if (range.collapsed) {
      // Create a span that the user will type into
      const span = document.createElement('span');
      span.style.fontSize = ptSize;
      // ZWSP to ensure the span exists and cursor can stay inside
      span.appendChild(document.createTextNode('\u200B')); 
      range.insertNode(span);
      
      const newRange = document.createRange();
      newRange.setStart(span.firstChild!, 1);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
      // Selection logic: Highlight multiple words/lines
      const fragment = range.extractContents();
      
      // Helper to clean nested legacy font tags and font-size spans
      const cleanNode = (node: Node) => {
        if (node instanceof HTMLElement) {
          // Remove old font-size styles to avoid conflicting spans
          if (node.tagName === 'SPAN') {
            node.style.fontSize = '';
            if (node.style.length === 0) {
              // Replace span with its children if it's now empty
              while(node.firstChild) node.parentNode?.insertBefore(node.firstChild, node);
              node.remove();
            }
          }
          if (node.tagName === 'FONT') {
             while(node.firstChild) node.parentNode?.insertBefore(node.firstChild, node);
             node.remove();
          }
          Array.from(node.childNodes).forEach(cleanNode);
        }
      };

      const wrapper = document.createElement('span');
      wrapper.style.fontSize = ptSize;
      
      // Temporary container to clean the fragment
      const temp = document.createElement('div');
      temp.appendChild(fragment);
      
      // Deep clean to prevent nesting
      const elements = temp.querySelectorAll('span, font');
      elements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.fontSize = '';
          if (el.tagName === 'FONT' || (el.tagName === 'SPAN' && el.style.length === 0)) {
            while(el.firstChild) el.parentNode?.insertBefore(el.firstChild, el);
            el.remove();
          }
        }
      });

      wrapper.appendChild(temp);
      
      // Remove any block level div if we inserted any mistakenly
      if (wrapper.firstChild && wrapper.firstChild.nodeName === 'DIV') {
         while(wrapper.firstChild.firstChild) wrapper.appendChild(wrapper.firstChild.firstChild);
         wrapper.removeChild(wrapper.firstChild);
      }

      range.insertNode(wrapper);
      
      // Keep selection on the new block
      const newRange = document.createRange();
      newRange.selectNodeContents(wrapper);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
    
    // Fallback sync for active state detection
    setTimeout(() => {
      document.dispatchEvent(new Event('selectionchange'));
    }, 0);
  };

  const handleImageFormat = (command: string, value?: string) => {
    if (!selectedImage) return;
    const img = selectedImage.querySelector('img');
    if (!img) return;

    switch (command) {
      case 'imageShape':
        if (value === 'circle') {
          img.style.borderRadius = '50%';
          img.style.aspectRatio = '1/1';
          img.style.objectFit = 'cover';
          img.style.filter = 'none';
        } else if (value === 'rounded') {
          img.style.borderRadius = '20px';
          img.style.aspectRatio = 'auto';
          img.style.filter = 'none';
        } else if (value === 'soft') {
          img.style.borderRadius = '0px';
          img.style.filter = 'blur(4px)';
          img.style.aspectRatio = 'auto';
        } else {
          img.style.borderRadius = '0px';
          img.style.aspectRatio = 'auto';
          img.style.filter = 'none';
        }
        break;
      case 'imageShadow':
        img.style.boxShadow = value === 'none' ? 'none' : '0 10px 25px -5px rgba(0,0,0,0.3)';
        break;
      case 'imageBorder':
        img.style.border = value === 'none' ? 'none' : `4px solid ${value}`;
        break;
      case 'imageDelete':
        selectedImage.remove();
        setSelectedImage(null);
        break;
      case 'imageWrap':
        if (value === 'inline') {
          selectedImage.style.position = 'relative';
          selectedImage.style.display = 'inline-block';
          selectedImage.style.float = 'none';
          selectedImage.style.margin = '10px';
          selectedImage.style.left = 'auto';
          selectedImage.style.top = 'auto';
        } else if (value === 'block') {
          selectedImage.style.position = 'relative';
          selectedImage.style.display = 'block';
          selectedImage.style.float = 'none';
          selectedImage.style.margin = '20px auto';
          selectedImage.style.left = 'auto';
          selectedImage.style.top = 'auto';
        } else if (value === 'float-left') {
          selectedImage.style.position = 'relative';
          selectedImage.style.display = 'inline-block';
          selectedImage.style.float = 'left';
          selectedImage.style.margin = '10px 20px 10px 0';
          selectedImage.style.left = 'auto';
          selectedImage.style.top = 'auto';
        } else if (value === 'float-right') {
          selectedImage.style.position = 'relative';
          selectedImage.style.display = 'inline-block';
          selectedImage.style.float = 'right';
          selectedImage.style.margin = '10px 0 10px 20px';
          selectedImage.style.left = 'auto';
          selectedImage.style.top = 'auto';
        }
        break;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editorRef.current) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        editorRef.current?.focus();
        // Insert image with a wrapper for better control and resizing handles simulation
        const imgHtml = `
          <div class="image-wrapper" style="display: inline-block; position: relative; margin: 10px; cursor: move; user-select: none; max-width: 100%; transition: all 0.3s;" contenteditable="false">
            <img src="${dataUrl}" style="display: block; width: 200px; height: auto; pointer-events: none; border-radius: 0;" />
            <div class="resize-handle" style="position: absolute; bottom: -5px; right: -5px; width: 24px; height: 24px; background: #2b579a; cursor: nwse-resize; border-radius: 4px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
          </div>
          <p contenteditable="true">&nbsp;</p>
        `;
        document.execCommand('insertHTML', false, imgHtml);
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    e.target.value = '';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editorRef.current) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        editorRef.current?.focus();
        const fileLink = `<a href="${dataUrl}" download="${file.name}" style="display:inline-flex; items-center; gap:8px; padding:8px 12px; background:#f3f2f1; border:1px solid #ccc; border-radius:4px; text-decoration:none; color:#2b579a; font-weight:bold; margin:5px 0;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          ${file.name}
        </a><p>&nbsp;</p>`;
        document.execCommand('insertHTML', false, fileLink);
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    e.target.value = '';
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

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    let isResizing = false;
    let isDragging = false;
    let currentElement: HTMLElement | null = null;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startLeft = 0;
    let startTop = 0;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      
      // Clear selection if clicking elsewhere in editor
      if (target === editor) {
        setSelectedImage(null);
        return;
      }

      // Handle Resizing
      if (target.classList.contains('resize-handle')) {
        isResizing = true;
        currentElement = target.parentElement;
        if (currentElement) {
          const img = currentElement.querySelector('img');
          if (img) {
            startWidth = img.offsetWidth;
            startX = e.clientX;
            setSelectedImage(currentElement);
            e.preventDefault();
            e.stopPropagation();
          }
        }
      } 
      // Handle Dragging
      else if (target.classList.contains('image-wrapper') || target.closest('.image-wrapper')) {
        isDragging = true;
        currentElement = (target.classList.contains('image-wrapper') ? target : target.closest('.image-wrapper')) as HTMLElement;
        startX = e.clientX;
        startY = e.clientY;
        setSelectedImage(currentElement);
        // We use relative positioning for dragging within the editor
        startLeft = currentElement.offsetLeft;
        startTop = currentElement.offsetTop;
        e.preventDefault();
        e.stopPropagation();
      } else {
        setSelectedImage(null);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isResizing && currentElement) {
        const img = currentElement.querySelector('img');
        if (img) {
          const deltaX = e.clientX - startX;
          const newWidth = Math.max(50, startWidth + deltaX);
          img.style.width = `${newWidth}px`;
        }
      } else if (isDragging && currentElement) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        // Use absolute positioning for free movement
        currentElement.style.position = 'absolute';
        currentElement.style.left = `${startLeft + deltaX}px`;
        currentElement.style.top = `${startTop + deltaY}px`;
        currentElement.style.zIndex = '10';
      }
    };

    const handlePointerUp = () => {
      isResizing = false;
      isDragging = false;
      currentElement = null;
    };

    editor.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      editor.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-[#f3f2f1] overflow-hidden font-sans select-none">
        <input 
          type="file" 
          ref={imageInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleImageUpload} 
        />
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileUpload} 
        />
        {/* Ribbon Header - Auto-collapses or can be manually toggled */}
        <div className={`transition-all duration-300 ease-in-out ${isRibbonCollapsed ? 'h-8 sm:h-9' : 'h-auto'}`}>
          <Ribbon 
            onFormat={handleFormat} 
            onToggleKeyboard={() => setShowKeyboard(!showKeyboard)} 
            isCollapsed={isRibbonCollapsed}
            onToggleCollapse={() => setIsRibbonCollapsed(!isRibbonCollapsed)}
            hasSelectedImage={!!selectedImage}
            activeStyles={activeStyles}
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
