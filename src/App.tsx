import React, { useState, useRef, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import katex from 'katex';
import { Ribbon } from './components/WordSimulator/Ribbon';
import { Editor } from './components/WordSimulator/Editor';
import { StatusBar } from './components/WordSimulator/StatusBar';
import { VirtualKeyboard } from './components/WordSimulator/VirtualKeyboard';
import { IntroScreen } from './components/WordSimulator/IntroScreen';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { FileText } from 'lucide-react';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [isRibbonCollapsed, setIsRibbonCollapsed] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  const [selectedImage, setSelectedImage] = useState<HTMLElement | null>(null);
  const [isEquationModalOpen, setIsEquationModalOpen] = useState(false);
  const [equationLaTeX, setEquationLaTeX] = useState('\\alpha^2 + \\beta^2 = \\gamma^2');
  const [equationIsDisplayMode, setEquationIsDisplayMode] = useState(false);
  const [editingEquationNode, setEditingEquationNode] = useState<HTMLElement | null>(null);
  const [pages, setPages] = useState<string[]>(['']);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [headerContent, setHeaderContent] = useState('');
  const [footerContent, setFooterContent] = useState('');
  const [showHeader, setShowHeader] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [activeStyles, setActiveStyles] = useState<{
    bold: boolean;
    italic: boolean;
    underline: boolean;
    subscript: boolean;
    superscript: boolean;
    list: boolean;
    orderedList: boolean;
    align: string;
    fontSize: string;
    fontName: string;
    blockType: string;
    color: string;
    lineHeight: string;
  }>({
    bold: false,
    italic: false,
    underline: false,
    subscript: false,
    superscript: false,
    list: false,
    orderedList: false,
    align: 'left',
    fontSize: '3',
    fontName: 'Arial',
    blockType: 'p',
    color: '#000000',
    lineHeight: '1.2'
  });

  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [isExporting, setIsExporting] = useState(false);

  // Auto-save to local storage (Debounced)
  useEffect(() => {
    const savedPages = localStorage.getItem('word-document-pages');
    const savedHeader = localStorage.getItem('word-document-header');
    const savedFooter = localStorage.getItem('word-document-footer');
    
    if (savedPages) {
      try {
        const parsed = JSON.parse(savedPages);
        if (Array.isArray(parsed)) setPages(parsed);
      } catch (e) {
        console.error('Failed to parse saved pages');
      }
    }
    if (savedHeader) setHeaderContent(savedHeader);
    if (savedFooter) setFooterContent(savedFooter);
  }, []);

  useEffect(() => {
    setSaveStatus('saving');
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem('word-document-pages', JSON.stringify(pages));
        localStorage.setItem('word-document-header', headerContent);
        localStorage.setItem('word-document-footer', footerContent);
        setSaveStatus('saved');
      } catch (e) {
        console.error('Auto-save failed:', e);
        setSaveStatus('error');
        // If it's a QuotaExceededError, it might be due to large images
      }
    }, 1000); // 1 second debounce
    
    return () => clearTimeout(timeout);
  }, [pages, headerContent, footerContent]);

  const updateActiveStyles = () => {
    if (typeof document === 'undefined') return;
    
    const styles = {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      subscript: document.queryCommandState('subscript'),
      superscript: document.queryCommandState('superscript'),
      list: document.queryCommandState('insertUnorderedList'),
      orderedList: document.queryCommandState('insertOrderedList'),
      align: 
        document.queryCommandState('justifyCenter') ? 'center' :
        document.queryCommandState('justifyRight') ? 'right' :
        document.queryCommandState('justifyFull') ? 'justify' : 'left',
      fontSize: (() => {
        const val = document.queryCommandValue('fontSize');
        if (['1', '2', '3', '4', '5', '6', '7'].includes(val)) return val;
        
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          let node = selection.anchorNode as any;
          if (node.nodeType === 3) node = node.parentNode;
          if (node) {
            const fs = window.getComputedStyle(node).fontSize;
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
      color: document.queryCommandValue('foreColor') || '#000000',
      lineHeight: (() => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          let node = selection.anchorNode as any;
          if (node.nodeType === 3) node = node.parentNode;
          if (node) {
            const lh = window.getComputedStyle(node).lineHeight;
            if (lh === 'normal') return '1.2';
            const fs = parseFloat(window.getComputedStyle(node).fontSize);
            const lhVal = parseFloat(lh);
            if (!isNaN(fs) && !isNaN(lhVal)) {
              const ratio = lhVal / fs;
              if (ratio > 1.8) return '2.0';
              if (ratio > 1.3) return '1.5';
              return '1.0';
            }
          }
        }
        return '1.2';
      })()
    };
    
    setActiveStyles(styles);
  };

  useEffect(() => {
    document.addEventListener('selectionchange', updateActiveStyles);
    return () => document.removeEventListener('selectionchange', updateActiveStyles);
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
  const openDocInputRef = useRef<HTMLInputElement>(null);

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
      const editorObj = editorRef.current as any;
      if (showKeyboard && editorObj?.root) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const workspace = editorObj.root.parentElement;
          
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
    const editorObj = editorRef.current as any;
    if (editorObj?.root) {
      observer.observe(editorObj.root, { childList: true, characterData: true, subtree: true });
    }
    return () => observer.disconnect();
  }, [showKeyboard]);

  const handleFormat = (command: string, value?: string) => {
    const editorObj = editorRef.current as any;
    if (!editorObj) return;
    
    // Ensure active editor page is focused before executing command
    editorObj.focus(currentPageIndex);
    
    // Use CSS styles instead of HTML tags (better for mobile/iPhone)
    document.execCommand('styleWithCSS', false, true as any);
    
    if (command === 'fontSize') {
      applyModernFontSize(value || '3');
    } else if (command === 'fontName') {
      document.execCommand('fontName', false, value);
    } else if (command === 'subscript') {
      // Toggle off superscript if active
      if (document.queryCommandState('superscript')) {
        document.execCommand('superscript', false);
      }
      document.execCommand('subscript', false);
    } else if (command === 'superscript') {
      // Toggle off subscript if active
      if (document.queryCommandState('subscript')) {
        document.execCommand('subscript', false);
      }
      document.execCommand('superscript', false);
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
    } else if (command === 'insertEquation') {
      setEditingEquationNode(null);
      setEquationLaTeX('\\sigma = \\sqrt{\\frac{1}{N} \\sum_{i=1}^N (x_i - \\mu)^2}');
      setEquationIsDisplayMode(false);
      setIsEquationModalOpen(true);
    } else if (command === 'insertImage') {
      imageInputRef.current?.click();
    } else if (command === 'insertFile') {
      fileInputRef.current?.click();
    } else if (command === 'orderedListType') {
      // First ensure we have a list
      if (!activeStyles.orderedList) {
        document.execCommand('insertOrderedList', false);
      }
      
      // Post-process: Find the OL parent and apply style
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          let node = selection.anchorNode as Node | null;
          while (node && !editorObj.root?.contains(node)) {
            if (node.nodeName === 'OL') {
              (node as HTMLElement).style.listStyleType = value || 'decimal';
              break;
            }
            node = node.parentNode;
          }
        }
      }, 0);
    } else if (command === 'lineHeight') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        let node = selection.anchorNode as Node | null;
        // Move up to the closest block element or LI
        while (node && !editorObj.root?.contains(node)) {
          if (node.nodeType === 1 && (['P', 'DIV', 'H1', 'H2', 'H3', 'LI'].includes((node as HTMLElement).tagName))) {
            (node as HTMLElement).style.lineHeight = value || '1.2';
            break;
          }
          node = node.parentNode;
        }
      }
    } else if (command === 'formatBlock') {
      const currentBlock = document.queryCommandValue('formatBlock').toLowerCase();
      const targetBlock = value?.toLowerCase();
      
      // Microsoft Word Style application:
      if (currentBlock === targetBlock) {
        document.execCommand('formatBlock', false, '<p>');
        applyModernFontSize('3');
      } else {
        document.execCommand('formatBlock', false, `<${value}>`);
        
        // Map Heading and special styles to Word-like default sizes
        const defaultSizes: Record<string, string> = {
          'h1': '7', // 36pt
          'h2': '6', // 24pt
          'h3': '5', // 18pt
          'h4': '4', // 14pt
          'h5': '3', // 11pt bold
          'h6': '2', // 10pt bold
        };
        
        if (defaultSizes[targetBlock || '']) {
          applyModernFontSize(defaultSizes[targetBlock || '']);
        } else if (targetBlock === 'p') {
          applyModernFontSize('3');
        }
      }
    } else if (command === 'exportPDF') {
      const element = editorObj.root;
      if (!element) return;
      
      setIsExporting(true);
      
      // Delay slightly to allow the UI to update and show the loading state
      setTimeout(async () => {
        try {
          const clone = element.cloneNode(true) as HTMLElement;
          // Clean up UI elements from the clone
          clone.style.paddingBottom = '0';
          clone.style.gap = '0';
          clone.style.margin = '0';
          clone.style.background = 'white';
          
          const pagesInClone = clone.querySelectorAll('.pdf-page');
          pagesInClone.forEach((p: any) => {
            p.style.boxShadow = 'none';
            p.style.border = 'none';
            p.style.margin = '0';
            p.style.width = '816px'; // Exact letter width
            p.style.maxWidth = '816px';
            p.style.padding = '1in'; // Standard Word margin for PDF
            p.style.display = 'block';
            
            // Hide UI artifacts
            const dashedBorders = p.querySelectorAll('.border-dashed');
            dashedBorders.forEach((b: any) => b.style.border = 'none');
          });

          // Append temporarily to body but hide it, to ensure styles are computed correctly
          clone.style.position = 'fixed';
          clone.style.top = '-9999px';
          clone.style.left = '-9999px';
          document.body.appendChild(clone);

          const opt = {
            margin:       0,
            filename:     'document.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
              scale: 2,
              useCORS: true,
              logging: false,
              scrollY: 0,
              windowWidth: 816,
              letterRendering: true
            },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
          };

          // @ts-ignore
          await html2pdf().from(clone).set(opt).save();
          
          if (clone.parentNode) {
            document.body.removeChild(clone);
          }
        } catch (err: any) {
          console.error('PDF Export Error:', err);
          alert('Failed to export PDF. Try again or check for large images.');
        } finally {
          setIsExporting(false);
        }
      }, 500);
    } else if (command === 'new') {
      if (confirm('Create a new blank document? All unsaved changes will be lost.')) {
        setPages(['']);
        setCurrentPageIndex(0);
        setHeaderContent('');
        setFooterContent('');
        setShowHeader(false);
        setShowFooter(false);
      }
    } else if (command === 'openBrowser') {
      openDocInputRef.current?.click();
    } else if (command === 'saveDoc') {
      // Create a full HTML document blob
      const content = pages.map((p, i) => `
        <div class="page" data-page-index="${i}">
          ${p}
        </div>
      `).join('');
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Word Document</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .page { min-height: 1056px; width: 816px; margin: 20px auto; padding: 1in; background: white; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          </style>
        </head>
        <body>
          ${content}
        </body>
        </html>
      `;
      
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.html';
      a.click();
      URL.revokeObjectURL(url);
    } else if (command === 'undo') {
      document.execCommand('undo', false);
    } else if (command === 'redo') {
      try {
        editorRef.current?.focus(currentPageIndex);
        document.execCommand('redo', false);
      } catch (err) {
        console.warn('Redo failed:', err);
      }
    } else if (command === 'toggleHeader') {
      setShowHeader(!showHeader);
    } else if (command === 'toggleFooter') {
      setShowFooter(!showFooter);
    } else if (command === 'insertPageNumber') {
      const pageNumHtml = `<span class="page-number-field" contenteditable="false" style="padding: 0 2px; color: #2b579a; font-weight: bold;">{page}</span>`;
      document.execCommand('insertHTML', false, pageNumHtml);
    } else if (command === 'addPage') {
      setPages(prev => [...prev, '']);
      setCurrentPageIndex(pages.length);
      setTimeout(() => {
        const newPage = document.querySelectorAll('.document-page')[pages.length] as HTMLElement;
        if (newPage) newPage.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (command === 'deletePage' && pages.length > 1) {
      const newPages = [...pages];
      newPages.splice(currentPageIndex, 1);
      setPages(newPages);
      setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
    } else if (command === 'nextPage') {
      setCurrentPageIndex(prev => Math.min(pages.length - 1, prev + 1));
    } else if (command === 'prevPage') {
      setCurrentPageIndex(prev => Math.max(0, prev - 1));
    } else if (command.startsWith('image')) {
      handleImageFormat(command, value);
    } else {
      document.execCommand(command, false, value);
    }
    
    // Force editor focus and style refresh
    editorObj.focus(currentPageIndex);
    updateActiveStyles();
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

  const handleOpenDoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        
        // Try to extract content if it's an HTML we saved
        if (content.includes('<div class="page"')) {
           const parser = new DOMParser();
           const doc = parser.parseFromString(content, 'text/html');
           const pageNodes = doc.querySelectorAll('.page');
           if (pageNodes.length > 0) {
             const newPages = Array.from(pageNodes).map(n => n.innerHTML);
             setPages(newPages);
             setCurrentPageIndex(0);
             return;
           }
        }
        
        // Fallback for simple text or unknown HTML
        setPages([content]);
        setCurrentPageIndex(0);
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  const insertAtCursor = (text: string) => {
    const textarea = document.getElementById('latex-editor') as HTMLTextAreaElement;
    if (textarea) {
      textarea.focus();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // Attempt to use browsers built-in insert command for undo history
      try {
        if (!document.execCommand('insertText', false, text)) {
           // Fallback if execCommand fails
           const val = textarea.value;
           setEquationLaTeX(val.substring(0, start) + text + val.substring(end));
        }
      } catch (e) {
        const val = textarea.value;
        setEquationLaTeX(val.substring(0, start) + text + val.substring(end));
      }

      // Update cursor position and select placeholder if exists
      setTimeout(() => {
        textarea.focus();
        const placeholderIdx = text.indexOf('\\square');
        if (placeholderIdx !== -1) {
          const newStart = start + placeholderIdx;
          textarea.setSelectionRange(newStart, newStart + 7);
        } else {
          textarea.setSelectionRange(start + text.length, start + text.length);
        }
      }, 0);
    } else {
      setEquationLaTeX(prev => prev + text);
    }
  };

  const handleEditorTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      const textarea = e.currentTarget;
      const val = textarea.value;
      const start = textarea.selectionStart;
      
      // Find the next \square after current selection
      const nextIdx = val.indexOf('\\square', start);
      if (nextIdx !== -1) {
        e.preventDefault();
        textarea.setSelectionRange(nextIdx, nextIdx + 7);
      } else {
        // Look from the beginning if not found after cursor
        const firstIdx = val.indexOf('\\square');
        if (firstIdx !== -1) {
          e.preventDefault();
          textarea.setSelectionRange(firstIdx, firstIdx + 7);
        }
      }
    }
  };

  const handleConfirmEquation = () => {
    const editorObj = editorRef.current as any;
    if (!editorObj) return;
    
    const renderedHtml = katex.renderToString(equationLaTeX, {
      throwOnError: false,
      displayMode: equationIsDisplayMode,
      output: 'html',
      errorColor: '#2b579a',
      strict: false,
      trust: true
    });

    if (editingEquationNode) {
      editingEquationNode.innerHTML = renderedHtml;
      editingEquationNode.setAttribute('data-latex', equationLaTeX);
      editingEquationNode.setAttribute('data-display', equationIsDisplayMode ? 'true' : 'false');
      editingEquationNode.setAttribute('aria-label', `Equation: ${equationLaTeX}`);
      
      // Update display style
      if (equationIsDisplayMode) {
        editingEquationNode.style.display = 'block';
        editingEquationNode.style.textAlign = 'center';
        editingEquationNode.style.width = '100%';
        editingEquationNode.style.margin = '1.5em 0';
      } else {
        editingEquationNode.style.display = 'inline-block';
        editingEquationNode.style.textAlign = 'left';
        editingEquationNode.style.width = 'auto';
        editingEquationNode.style.margin = '0 4px';
      }
    } else {
      editorObj.focus(currentPageIndex);
      // Improved styles: atomic, selectable, and deletable like Word
      const style = equationIsDisplayMode 
        ? "display: block; text-align: center; width: 100%; margin: 1.5em 0; padding: 12px; background: rgba(43, 87, 154, 0.02); border-radius: 8px; cursor: pointer; transition: all 0.2s; user-select: all; outline: none; border: 1px solid transparent; position: relative;"
        : "display: inline-block; padding: 4px 8px; background: rgba(43, 87, 154, 0.02); cursor: pointer; margin: 0 4px; vertical-align: middle; transition: all 0.2s; user-select: all; border-radius: 4px; outline: none; border: 1px solid transparent; position: relative;";
      
      const equationHtml = `<span class="equation-wrapper" data-latex="${equationLaTeX.replace(/"/g, '&quot;')}" data-display="${equationIsDisplayMode}" contenteditable="false" draggable="true" role="math" aria-label="Equation: ${equationLaTeX.replace(/"/g, '&quot;')}" style="${style}" tabindex="0" onmouseover="this.style.borderColor='rgba(43, 87, 154, 0.3)'; this.style.background='rgba(43, 87, 154, 0.05)'" onmouseout="if(document.activeElement !== this) { this.style.borderColor='transparent'; this.style.background='rgba(43, 87, 154, 0.02)' }" onfocus="this.style.borderColor='#2b579a'; this.style.background='rgba(43, 87, 154, 0.1)'; this.style.boxShadow='0 0 0 2px rgba(43, 87, 154, 0.2)'" onblur="this.style.borderColor='transparent'; this.style.background='rgba(43, 87, 154, 0.02)'; this.style.boxShadow='none'">${renderedHtml}</span>&nbsp;`;
      document.execCommand('insertHTML', false, equationHtml);
    }
    
    setIsEquationModalOpen(false);
    setEditingEquationNode(null);
  };

  const handleKeyClick = (key: string) => {
    const editorObj = editorRef.current as any;
    if (!editorObj) return;
    
    editorObj.focus(currentPageIndex);
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
    const editorObj = editorRef.current as any;
    const editor = editorObj?.root;
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
      
      // Handle Equation Focusing (for deletion/keyboard)
      const equationNode = target.closest('.equation-wrapper') as HTMLElement;
      if (equationNode) {
        (equationNode as HTMLElement).focus();
        // Don't return yet, allow dragging logic below
      }

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
      else if (target.closest('.image-wrapper') || target.closest('.equation-wrapper')) {
        isDragging = true;
        currentElement = (target.closest('.image-wrapper') || target.closest('.equation-wrapper')) as HTMLElement;
        startX = e.clientX;
        startY = e.clientY;
        
        if (currentElement.classList.contains('image-wrapper')) {
          setSelectedImage(currentElement);
        }
        
        // Ensure positioning
        if (window.getComputedStyle(currentElement).position !== 'absolute') {
          const rect = currentElement.getBoundingClientRect();
          const parentRect = editor.getBoundingClientRect();
          currentElement.style.position = 'absolute';
          currentElement.style.left = `${rect.left - parentRect.left}px`;
          currentElement.style.top = `${rect.top - parentRect.top}px`;
          currentElement.style.margin = '0';
        }
        
        startLeft = parseFloat(currentElement.style.left) || 0;
        startTop = parseFloat(currentElement.style.top) || 0;
        
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

    const handleKeyDown = (e: KeyboardEvent) => {
      // If an equation-wrapper is focused, handle deletion
      if (document.activeElement?.classList.contains('equation-wrapper')) {
        if (e.key === 'Backspace' || e.key === 'Delete') {
          document.activeElement.remove();
          e.preventDefault();
        } else if (e.key === 'Enter') {
          // Double click or Enter to edit
          const node = document.activeElement as HTMLElement;
          const latex = node.getAttribute('data-latex') || '';
          const isDisplay = node.getAttribute('data-display') === 'true';
          setEquationLaTeX(latex);
          setEquationIsDisplayMode(isDisplay);
          setEditingEquationNode(node);
          setIsEquationModalOpen(true);
          e.preventDefault();
        }
      }
    };

    const handleDoubleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const equationNode = target.closest('.equation-wrapper') as HTMLElement;
      if (equationNode) {
        const latex = equationNode.getAttribute('data-latex') || '';
        const isDisplay = equationNode.getAttribute('data-display') === 'true';
        setEquationLaTeX(latex);
        setEquationIsDisplayMode(isDisplay);
        setEditingEquationNode(equationNode);
        setIsEquationModalOpen(true);
      }
    };

    editor.addEventListener('pointerdown', handlePointerDown);
    editor.addEventListener('dblclick', handleDoubleClick as any);
    editor.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      editor.removeEventListener('pointerdown', handlePointerDown);
      editor.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return (
    <TooltipProvider>
      <AnimatePresence>
        {showIntro && (
          <IntroScreen onStart={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExporting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full mx-4">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-[#2b579a] rounded-full border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="text-[#2b579a]" size={32} />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Generating PDF</h3>
                <p className="text-gray-500 text-sm">Please wait while we prepare your document. Large files may take a bit longer.</p>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "90%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="bg-[#2b579a] h-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!showIntro && (
        <div className="flex flex-col h-screen bg-[#f3f2f1] overflow-hidden font-sans select-none animate-in fade-in duration-700">
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
          <input type="file" ref={openDocInputRef} style={{ display: 'none' }} accept=".html,.txt" onChange={handleOpenDoc} />
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
            pages={pages}
            currentPageIndex={currentPageIndex}
            onChange={(newContent, index) => {
              const newPages = [...pages];
              newPages[index] = newContent;
              setPages(newPages);
            }} 
            isArabic={isArabic}
            header={headerContent}
            footer={footerContent}
            onHeaderChange={setHeaderContent}
            onFooterChange={setFooterContent}
            showHeader={showHeader}
            showFooter={showFooter}
            onFocusPage={setCurrentPageIndex}
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

        {/* Equation Editor Modal */}
        {isEquationModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[85vh] overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200 flex flex-col">
              <div className="bg-[#2b579a] p-3 flex justify-between items-center text-white shrink-0">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-1 rounded">
                    <span className="font-serif italic font-bold">∑</span>
                  </div>
                  <h3 className="font-semibold text-sm">Equation Editor (LaTeX)</h3>
                </div>
                <button 
                  onClick={() => setIsEquationModalOpen(false)}
                  className="hover:bg-white/20 p-1 rounded-full transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              
              <div className="flex flex-1 flex-col overflow-hidden">
                {/* Horizontal Equation Ribbon */}
                <div className="bg-gray-50 border-b border-gray-200 overflow-x-auto shrink-0 flex items-start gap-4 p-3 shadow-inner scrollbar-hide">
                  <div className="flex gap-4 min-w-max px-2">
                    {/* Structures Group */}
                    <div className="flex flex-col gap-2 border-r border-gray-300 pr-4">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Structures</span>
                      <div className="flex gap-1">
                        {[
                          { label: 'Fraction', cmd: '\\frac{\\square}{\\square}', icon: '\\frac{\\blacksquare}{\\square}' },
                          { label: 'Power', cmd: '\\square^{\\square}', icon: '\\blacksquare^{n}' },
                          { label: 'Derivative', cmd: '\\frac{d\\square}{d\\square}', icon: '\\frac{d}{dx}' },
                          { label: 'Radical', cmd: '\\sqrt{\\square}', icon: '\\sqrt{\\blacksquare}' },
                          { label: 'Integral', cmd: '\\int_{\\square}^{\\square} \\square d\\square', icon: '\\int' },
                          { label: 'Sum', cmd: '\\sum_{\\square}^{\\square} \\square', icon: '\\sum' },
                          { label: 'Product', cmd: '\\prod_{\\square}^{\\square} \\square', icon: '\\prod' },
                          { label: 'Limit', cmd: '\\lim_{\\square \\to \\square} \\square', icon: '\\lim' },
                          { label: 'Matrix', cmd: '\\begin{pmatrix} \\square & \\square \\\\ \\square & \\square \\end{pmatrix}', icon: '\\begin{pmatrix} \\cdot & \\cdot \\end{pmatrix}' },
                          { label: 'Text', cmd: '\\text{\\square}', icon: '\\text{abc}' },
                          { label: 'Box', cmd: '\\square', icon: '\\square' },
                        ].map(item => (
                          <Button 
                            key={item.label} 
                            variant="ghost" 
                            className="h-12 w-12 p-0 flex flex-col bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm"
                            onClick={() => insertAtCursor(item.cmd)}
                            title={item.label}
                          >
                            <span className="text-[14px] h-2/3 flex items-center justify-center font-serif" dangerouslySetInnerHTML={{ __html: katex.renderToString(item.icon, { throwOnError: false, output: 'html', strict: false, trust: true, errorColor: '#2b579a' }) }} />
                            <span className="text-[8px] opacity-60 h-1/3 leading-none">{item.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Basic Symbols Group */}
                    <div className="flex flex-col gap-2 border-r border-gray-300 pr-4">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Symbols</span>
                      <div className="grid grid-cols-4 gap-1">
                        {['\\pm', '\\neq', '\\approx', '\\cdot', '\\div', '\\times', '\\leq', '\\geq'].map(op => (
                          <Button key={op} variant="ghost" className="h-6 w-8 p-0 bg-white border border-gray-100 hover:bg-blue-50" onClick={() => insertAtCursor(' ' + op)}>
                             <span dangerouslySetInnerHTML={{ __html: katex.renderToString(op, { output: 'html', strict: false, trust: true }) }} />
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Greek Group */}
                    <div className="flex flex-col gap-2 border-r border-gray-300 pr-4">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Greek</span>
                      <div className="grid grid-cols-5 gap-1">
                        {['\\alpha', '\\beta', '\\pi', '\\lambda', '\\sigma', '\\theta', '\\delta', '\\mu', '\\omega', '\\gamma'].map(sym => (
                          <Button key={sym} variant="ghost" className="h-6 w-6 p-0 bg-white border border-gray-100 hover:bg-blue-50" onClick={() => insertAtCursor(' ' + sym)}>
                             <span dangerouslySetInnerHTML={{ __html: katex.renderToString(sym, { output: 'html', strict: false, trust: true }) }} />
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Functions Group */}
                    <div className="flex flex-col gap-2">
                       <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Functions</span>
                       <div className="grid grid-cols-3 gap-1">
                         {['\\sin', '\\cos', '\\tan', '\\log', '\\ln', '\\lim'].map(func => (
                           <Button key={func} variant="ghost" className="h-6 px-2 text-[10px] bg-white border border-gray-100" onClick={() => insertAtCursor(func + '(x)')}>{func.replace('\\','')}</Button>
                         ))}
                       </div>
                    </div>
                  </div>
                </div>

                {/* Main Workspace Area */}
                <div className="flex flex-1 overflow-hidden">
                  {/* Left Column: Editor & Formulas */}
                  <div className="w-1/2 flex flex-col border-r border-gray-200">
                    <div className="flex-1 p-4 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">LaTeX Editor</label>
                        <Button variant="ghost" size="sm" className="h-5 text-[10px] text-gray-400 hover:text-red-500" onClick={() => setEquationLaTeX('')}>Clear All</Button>
                      </div>
                      <textarea 
                        id="latex-editor"
                        className="flex-1 w-full p-4 bg-white border border-gray-200 rounded-lg font-mono text-base focus:ring-2 focus:ring-[#2b579a] focus:border-transparent outline-none transition-all placeholder:text-gray-300 shadow-inner resize-none"
                        value={equationLaTeX}
                        inputMode="none"
                        onChange={(e) => setEquationLaTeX(e.target.value)}
                        onKeyDown={handleEditorTab}
                        placeholder="Type LaTeX here..."
                        autoFocus
                      />
                    </div>
                    
                    {/* Common Formulas Quick List */}
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Preset Formulas</label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { label: 'Quadratic Formula', cmd: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
                          { label: 'Pythagorean Theorem', cmd: 'a^2 + b^2 = c^2' },
                          { label: 'Euler\'s Identity', cmd: 'e^{i\\pi} + 1 = 0' }
                        ].map(formula => (
                          <Button 
                            key={formula.label} 
                            variant="outline" 
                            className="bg-white justify-start h-8 text-[11px] px-3 font-medium text-gray-700 hover:text-[#2b579a] hover:bg-blue-50 border-gray-200"
                            onClick={() => setEquationLaTeX(formula.cmd)}
                          >
                            {formula.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Preview Area */}
                  <div className="w-1/2 flex flex-col bg-gray-100 p-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Live Preview</label>
                    <div className="flex-1 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-8 overflow-auto shadow-sm relative">
                       <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.4))] pointer-events-none" />
                       <div 
                         className="text-4xl text-[#2b579a] select-all transition-all duration-300"
                         dangerouslySetInnerHTML={{ 
                           __html: katex.renderToString(equationLaTeX || '\\text{Insert Symbols}', {
                             throwOnError: false,
                             displayMode: equationIsDisplayMode,
                             output: 'html',
                             errorColor: '#2b579a',
                             strict: false,
                             trust: true
                           }) 
                         }} 
                       />
                    </div>
                  </div>
                </div>
              </div>


              <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center shrink-0">
                <div className="text-[10px] text-gray-400 max-w-[60%]">
                  Tip: Use backslash (\) for commands. Symbols added from the sidebar will appear at your cursor.
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex bg-gray-200 rounded-lg p-1">
                    <button 
                      className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${!equationIsDisplayMode ? 'bg-white text-[#2b579a] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => setEquationIsDisplayMode(false)}
                    >Inline</button>
                    <button 
                      className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${equationIsDisplayMode ? 'bg-white text-[#2b579a] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => setEquationIsDisplayMode(true)}
                    >Display (Centered)</button>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsEquationModalOpen(false)}
                      className="text-gray-600 font-medium"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleConfirmEquation}
                      className="bg-[#2b579a] hover:bg-[#1e3a63] text-white px-10 font-semibold shadow-lg active:scale-95 transition-all text-sm h-10"
                    >
                      {editingEquationNode ? 'Save Changes' : 'Insert into Document'}
                    </Button>
                  </div>
                  {editingEquationNode && (
                    <Button 
                      variant="outline" 
                      className="text-red-500 border-red-200 hover:bg-red-50 ml-4"
                      onClick={() => {
                        editingEquationNode.remove();
                        setIsEquationModalOpen(false);
                      }}
                    >
                      Delete Equation
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Bar - Hidden on very short screens (landscape mobile) */}
        <div className="hidden min-h-[400px]:block">
          <StatusBar content={pages.join('')} saveStatus={saveStatus} />
        </div>
      </div>
      )}
    </TooltipProvider>
  );
}
