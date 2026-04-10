import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Delete, CornerDownLeft, Space, ArrowBigUp, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Type } from 'lucide-react';

interface VirtualKeyboardProps {
  onKeyClick: (key: string) => void;
  onClose: () => void;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onKeyClick, onClose }) => {
  const [isShift, setIsShift] = useState(false);
  const [isCaps, setIsCaps] = useState(false);

  const rows = [
    ['Esc', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    ['Ctrl', 'Alt', 'Space', 'Left', 'Up', 'Down', 'Right']
  ];

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
    
    if ((isShift || isCaps) && key.length === 1) {
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
    if (key === 'Shift') {
      setIsShift(!isShift);
      return;
    }
    if (key === 'CapsLock') {
      setIsCaps(!isCaps);
      return;
    }
    
    let value = key;
    if ((isShift || isCaps) && key.length === 1) {
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
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-0.5 sm:mb-2 px-2">
        <span className="text-[9px] sm:text-xs font-medium text-gray-500 hidden xs:inline">Word Keyboard</span>
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="icon" className="h-5 w-5 sm:h-6 sm:w-6" onClick={onClose}>
            <ChevronDown size={14} />
          </Button>
          <Button variant="ghost" size="icon" className="h-5 w-5 sm:h-6 sm:w-6" onClick={onClose}>
            <X size={14} />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 sm:gap-1">
        {rows.map((row, i) => (
          <div key={i} className="flex justify-center gap-0.5 sm:gap-1">
            {row.map((key, j) => {
              const isSpecial = ['Backspace', 'Enter', 'Shift', 'Space', 'Tab', 'CapsLock', 'Ctrl', 'Alt', 'Esc', 'Left', 'Right', 'Up', 'Down'].includes(key);
              
              // Responsive widths and heights
              let width = 'w-6 sm:w-10 md:w-12';
              let height = 'h-6 sm:h-10'; // Further reduced height for better landscape fit
              
              if (key === 'Backspace') width = 'w-10 sm:w-20';
              if (key === 'Enter') width = 'w-10 sm:w-20';
              if (key === 'Shift') width = 'w-10 sm:w-20';
              if (key === 'CapsLock') width = 'w-10 sm:w-20';
              if (key === 'Tab') width = 'w-8 sm:w-14';
              if (key === 'Ctrl' || key === 'Alt') width = 'w-8 sm:w-14';
              if (key === 'Space') width = 'w-24 sm:w-64 md:w-80';
              if (['Left', 'Right', 'Up', 'Down'].includes(key)) width = 'w-5 sm:w-10';
              if (key === 'Esc') width = 'w-8 sm:w-12';

              return (
                <Button
                  key={j}
                  variant={isSpecial ? "secondary" : "outline"}
                  className={`${width} ${height} p-0 text-[8px] sm:text-sm font-medium shadow-sm hover:bg-gray-100 active:scale-95 transition-all rounded-sm`}
                  onClick={() => handleKey(key)}
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
