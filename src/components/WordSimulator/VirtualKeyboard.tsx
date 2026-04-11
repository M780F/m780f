import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Delete, CornerDownLeft, Space, ArrowBigUp, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Type } from 'lucide-react';

interface VirtualKeyboardProps {
  onKeyClick: (key: string) => void;
  onClose: () => void;
  isArabic: boolean;
  onLanguageToggle: () => void;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ 
  onKeyClick, 
  onClose,
  isArabic,
  onLanguageToggle
}) => {
  const [isShift, setIsShift] = useState(false);
  const [isCaps, setIsCaps] = useState(false);
  const [isAltActive, setIsAltActive] = useState(false);
  const backspaceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const backspaceDelayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (backspaceIntervalRef.current) clearInterval(backspaceIntervalRef.current);
      if (backspaceDelayRef.current) clearTimeout(backspaceDelayRef.current);
    };
  }, []);

  const startBackspace = () => {
    handleKey('Backspace');
    
    // Initial delay before repeating
    backspaceDelayRef.current = setTimeout(() => {
      backspaceIntervalRef.current = setInterval(() => {
        handleKey('Backspace');
      }, 100); // Repeat every 100ms
    }, 500); // Wait 500ms before starting repeat
  };

  const stopBackspace = () => {
    if (backspaceIntervalRef.current) {
      clearInterval(backspaceIntervalRef.current);
      backspaceIntervalRef.current = null;
    }
    if (backspaceDelayRef.current) {
      clearTimeout(backspaceDelayRef.current);
      backspaceDelayRef.current = null;
    }
  };

  const enRows = [
    ['Esc', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    ['Ctrl', 'Alt', 'Space', 'Left', 'Up', 'Down', 'Right']
  ];

  const arRows = [
    ['Esc', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '٠', '-', '=', 'Backspace'],
    ['Tab', 'ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د', '\\'],
    ['CapsLock', 'ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط', 'Enter'],
    ['Shift', 'ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ', 'Shift'],
    ['Ctrl', 'Alt', 'Space', 'Left', 'Up', 'Down', 'Right']
  ];

  const rows = isArabic ? arRows : enRows;

  const getKeyLabel = (key: string) => {
    if (key === 'Backspace') return <Delete size={16} />;
    if (key === 'Enter') return <CornerDownLeft size={16} />;
    if (key === 'Space') return <Space size={16} />;
    if (key === 'Shift') return <ArrowBigUp size={16} className={isShift ? 'text-blue-600' : ''} />;
    if (key === 'CapsLock') return <Type size={16} className={isCaps ? 'text-blue-600' : ''} />;
    if (key === 'Left') return <ChevronLeft size={16} />;
    if (key === 'Right') return <ChevronRight size={16} />;
    if (key === 'Up') return <ChevronUp size={16} />;
    if (key === 'Down') return <ChevronDown size={16} />;
    if (key === 'Alt') return <span className={isAltActive ? 'text-blue-600' : ''}>Alt</span>;
    
    if (!isArabic && (isShift || isCaps) && key.length === 1) {
      const shiftMap: Record<string, string> = {
        '1': '!', '2': '@', '3': '#', '4': '$', '5': '%', '6': '^', '7': '&', '8': '*', '9': '(', '0': ')',
        '-': '_', '=': '+', '[': '{', ']': '}', '\\': '|', ';': ':', "'": '"', ',': '<', '.': '>', '/': '?'
      };
      
      if (isShift && shiftMap[key]) return shiftMap[key];
      if (isCaps && !isShift) return key.toUpperCase();
      if (isShift && !isCaps) return key.toUpperCase();
      if (isShift && isCaps) return key.toLowerCase();
    }
    return key;
  };

  const handleKey = (key: string) => {
    if (key === 'Alt') {
      setIsAltActive(!isAltActive);
      return;
    }

    if (key === 'Shift' && isAltActive) {
      onLanguageToggle();
      setIsAltActive(false);
      return;
    }

    if (key === 'Shift') {
      setIsShift(!isShift);
      return;
    }
    if (key === 'CapsLock') {
      setIsCaps(!isCaps);
      return;
    }
    
    let value = key;
    if (!isArabic && (isShift || isCaps) && key.length === 1) {
      const shiftMap: Record<string, string> = {
        '1': '!', '2': '@', '3': '#', '4': '$', '5': '%', '6': '^', '7': '&', '8': '*', '9': '(', '0': ')',
        '-': '_', '=': '+', '[': '{', ']': '}', '\\': '|', ';': ':', "'": '"', ',': '<', '.': '>', '/': '?'
      };
      
      if (isShift && shiftMap[key]) {
        value = shiftMap[key];
      } else {
        const isUpper = (isShift && !isCaps) || (!isShift && isCaps);
        value = isUpper ? key.toUpperCase() : key.toLowerCase();
      }
    }
    
    onKeyClick(value);
    if (isShift) setIsShift(false);
    if (isAltActive) setIsAltActive(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-0.5 sm:mb-2 px-2">
        <div className="flex items-center gap-2">
          <span className="text-[9px] sm:text-xs font-medium text-gray-500 hidden xs:inline">Word Keyboard</span>
          <span className="text-[9px] sm:text-xs font-bold text-[#2b579a] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            {isArabic ? 'Arabic' : 'English'}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="icon" className="h-5 w-5 sm:h-6 sm:w-6" onClick={onClose}>
            <ChevronDown size={14} />
          </Button>
          <Button variant="ghost" size="icon" className="h-5 w-5 sm:h-6 sm:w-6" onClick={onClose}>
            <X size={14} />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-1 sm:gap-1.5">
        {rows.map((row, i) => (
          <div key={i} className="flex justify-center gap-0.5 sm:gap-1 w-full px-0.5">
            {row.map((key, j) => {
              const isSpecial = ['Backspace', 'Enter', 'Shift', 'Space', 'Tab', 'CapsLock', 'Ctrl', 'Alt', 'Esc', 'Left', 'Right', 'Up', 'Down'].includes(key);
              
              // Responsive widths and heights - optimized for mobile fit
              let width = 'flex-1 min-w-[22px] max-w-[40px] sm:w-10 md:w-12';
              let height = 'h-11 sm:h-12'; 
              
              if (key === 'Backspace') width = 'flex-[1.5] min-w-[45px] sm:w-20';
              if (key === 'Enter') width = 'flex-[1.5] min-w-[45px] sm:w-20';
              if (key === 'Shift') width = 'flex-[1.5] min-w-[45px] sm:w-20';
              if (key === 'CapsLock') width = 'flex-[1.5] min-w-[45px] sm:w-20';
              if (key === 'Tab') width = 'flex-1 min-w-[35px] sm:w-14';
              if (key === 'Ctrl' || key === 'Alt') width = 'flex-1 min-w-[35px] sm:w-14';
              if (key === 'Space') width = 'flex-[4] min-w-[120px] sm:w-64 md:w-80';
              if (['Left', 'Right', 'Up', 'Down'].includes(key)) width = 'flex-1 min-w-[25px] sm:w-10';
              if (key === 'Esc') width = 'flex-1 min-w-[30px] sm:w-12';

                return (
                  <Button
                    key={j}
                    variant={isSpecial ? "secondary" : "outline"}
                    className={`${width} ${height} p-0 text-[11px] sm:text-sm font-bold shadow-sm hover:bg-gray-100 active:scale-95 active:bg-blue-100 transition-all rounded-md border-gray-300`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      if (key === 'Backspace') {
                        startBackspace();
                      }
                    }}
                    onMouseUp={() => {
                      if (key === 'Backspace') stopBackspace();
                    }}
                    onMouseLeave={() => {
                      if (key === 'Backspace') stopBackspace();
                    }}
                    onTouchStart={(e) => {
                      if (key === 'Backspace') {
                        e.preventDefault();
                        startBackspace();
                      }
                    }}
                    onTouchEnd={() => {
                      if (key === 'Backspace') stopBackspace();
                    }}
                    onClick={() => {
                      if (key !== 'Backspace') handleKey(key);
                    }}
                  >
                    {getKeyLabel(key)}
                  </Button>
                );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
