import React from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Type, List, ListOrdered, Image as ImageIcon, Table as TableIcon,
  Keyboard, Save, Undo, Redo, Search, Printer, FileText, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RibbonProps {
  onFormat: (command: string, value?: string) => void;
  onToggleKeyboard: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Ribbon: React.FC<RibbonProps> = ({ 
  onFormat, 
  onToggleKeyboard, 
  isCollapsed = false, 
  onToggleCollapse 
}) => {
  const [activeTab, setActiveTab] = React.useState('home');

  const handleFormatClick = (e: React.MouseEvent, command: string, value?: string) => {
    e.preventDefault();
    onFormat(command, value);
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm z-10 shrink-0 w-full">
      {/* Top Bar - Hidden on small mobile or landscape height or when collapsed */}
      {!isCollapsed && (
        <div className="hidden sm:flex h-7 items-center justify-between px-4 bg-[#2b579a] text-white text-[11px]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText size={12} />
              <span className="font-medium">Document1 - Word</span>
            </div>
            <div className="flex items-center gap-3 opacity-80">
              <Save size={12} className="cursor-pointer hover:opacity-100" />
              <Undo size={12} className="cursor-pointer hover:opacity-100" />
              <Redo size={12} className="cursor-pointer hover:opacity-100" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-[9px] font-bold">MA</div>
              <span>Mustafa</span>
            </div>
          </div>
        </div>
      )}

      <div className="w-full">
        <div className="flex items-center px-1 sm:px-2 bg-white border-b border-gray-200 h-9 sm:h-10">
          <div className="flex h-full p-0 gap-0">
            {['file', 'home', 'insert', 'layout', 'view'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 text-[11px] sm:text-sm h-full font-medium transition-colors capitalize ${
                  activeTab === tab 
                    ? tab === 'file' ? 'bg-[#2b579a] text-white' : 'bg-[#f3f2f1] text-[#2b579a] border-t border-x border-gray-200 rounded-t-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-1 sm:gap-2 px-1 sm:px-2">
             <Button 
               variant="ghost" 
               size="sm" 
               onClick={onToggleCollapse} 
               className="h-6 sm:h-7 w-6 sm:w-7 p-0 text-gray-500 hover:text-[#2b579a]"
             >
               <ChevronDown size={14} className={`transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} />
             </Button>
             <Button variant="ghost" size="sm" onClick={onToggleKeyboard} className="h-6 sm:h-7 gap-1 sm:gap-2 text-[#2b579a] hover:text-[#2b579a] hover:bg-blue-50 px-2 sm:px-3 border border-transparent hover:border-blue-100">
               <Keyboard size={14} />
               <span className="hidden sm:inline text-xs">Keyboard</span>
             </Button>
          </div>
        </div>

        {!isCollapsed && (
          <div className="w-full bg-[#f3f2f1]">
            {activeTab === 'file' && (
              <div className="m-0 p-0 bg-[#2b579a] text-white flex flex-col h-[80px] sm:h-[100px]">
                <div className="flex h-full">
                  <div className="w-32 sm:w-48 bg-[#1e3a63] p-1 sm:p-2 flex flex-col gap-0.5">
                    <Button variant="ghost" className="justify-start text-white hover:bg-[#2b579a] h-7 sm:h-8 text-[10px] sm:text-xs">New</Button>
                    <Button variant="ghost" className="justify-start text-white hover:bg-[#2b579a] h-7 sm:h-8 text-[10px] sm:text-xs">Open</Button>
                    <Button variant="ghost" className="justify-start text-white hover:bg-[#2b579a] h-7 sm:h-8 text-[10px] sm:text-xs">Save</Button>
                  </div>
                  <div className="flex-1 p-2 sm:p-4 flex flex-col justify-center">
                    <h3 className="text-sm sm:text-lg font-light mb-1 sm:mb-2">Good morning</h3>
                    <div className="flex gap-2 sm:gap-4">
                      <div className="w-14 h-18 sm:w-20 sm:h-24 bg-white border border-gray-400 flex items-center justify-center text-gray-400 text-[8px] sm:text-[10px]">Blank</div>
                      <div className="w-14 h-18 sm:w-20 sm:h-24 bg-white border border-gray-400 flex items-center justify-center text-gray-400 text-[8px] sm:text-[10px]">Resume</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'home' && (
              <div className="m-0 p-1 sm:p-2 flex items-center justify-start gap-2 overflow-x-auto h-[105px] sm:h-auto border-b border-gray-300 w-full">
                {/* Clipboard Group */}
                <div className="flex flex-col items-center gap-1 px-2 border-r border-gray-300 shrink-0 bg-white shadow-sm rounded-md py-1.5 border border-gray-200 min-w-[80px]">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9 bg-blue-50/30" onMouseDown={(e) => handleFormatClick(e, 'paste')}><FileText size={18} className="text-[#2b579a]" /></Button>
                    <div className="flex flex-col gap-0.5">
                      <Button variant="ghost" size="sm" className="h-4 px-2 text-[9px] hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'cut')}>Cut</Button>
                      <Button variant="ghost" size="sm" className="h-4 px-2 text-[9px] hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'copy')}>Copy</Button>
                    </div>
                  </div>
                  <span className="text-[8px] text-[#2b579a] uppercase font-bold tracking-tighter">Clipboard</span>
                </div>

                {/* Font Group */}
                <div className="flex flex-col items-center gap-1 px-2 border-r border-gray-300 shrink-0 bg-white shadow-sm rounded-md py-1.5 border border-gray-200 min-w-[160px]">
                  <div className="flex items-center gap-1.5">
                    <Select defaultValue="Arial" onValueChange={(v) => onFormat('fontName', v)}>
                      <SelectTrigger className="h-8 w-[85px] text-[11px] bg-white border-gray-300 font-semibold text-gray-800">
                        <SelectValue placeholder="Font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        <SelectItem value="Calibri">Calibri</SelectItem>
                        <SelectItem value="Courier New">Courier New</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="3" onValueChange={(v) => onFormat('fontSize', v)}>
                      <SelectTrigger className="h-8 w-[45px] text-[11px] bg-white border-gray-300 font-semibold text-gray-800">
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">8pt</SelectItem>
                        <SelectItem value="2">10pt</SelectItem>
                        <SelectItem value="3">11pt</SelectItem>
                        <SelectItem value="4">12pt</SelectItem>
                        <SelectItem value="5">14pt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button variant="ghost" size="icon" className="h-8 w-8 border border-gray-100 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'bold')}><Bold size={16} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 border border-gray-100 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'italic')}><Italic size={16} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 border border-gray-100 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'underline')}><Underline size={16} /></Button>
                  </div>
                  <span className="text-[8px] text-[#2b579a] uppercase font-bold tracking-tighter">Font</span>
                </div>

                {/* Paragraph Group */}
                <div className="flex flex-col items-center gap-1 px-2 border-r border-gray-300 shrink-0 bg-white shadow-sm rounded-md py-1.5 border border-gray-200 min-w-[140px]">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 border border-gray-100 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'insertUnorderedList')}><List size={16} /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 border border-gray-100 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'insertOrderedList')}><ListOrdered size={16} /></Button>
                    </div>
                    <Separator orientation="vertical" className="h-6 mx-0.5 bg-gray-300" />
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 border border-gray-100 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'justifyLeft')}><AlignLeft size={16} /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 border border-gray-100 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'justifyCenter')}><AlignCenter size={16} /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 border border-gray-100 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'justifyRight')}><AlignRight size={16} /></Button>
                    </div>
                  </div>
                  <span className="text-[8px] text-[#2b579a] uppercase font-bold tracking-tighter">Paragraph</span>
                </div>
              </div>
            )}

            {activeTab === 'insert' && (
              <div className="m-0 p-1 sm:p-2 flex items-center justify-start gap-3 overflow-x-auto h-[105px] sm:h-auto border-b border-gray-300 w-full">
                <div className="flex flex-col items-center gap-1 px-3 border-r border-gray-300 shrink-0 bg-white shadow-sm rounded-md py-1.5 border border-gray-200">
                  <div className="flex gap-2">
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'insertTable')}>
                      <TableIcon size={18} className="text-[#2b579a]" />
                      <span className="text-[9px] sm:text-[11px]">Table</span>
                    </Button>
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'insertImage')}>
                      <ImageIcon size={18} className="text-[#2b579a]" />
                      <span className="text-[9px] sm:text-[11px]">Pictures</span>
                    </Button>
                  </div>
                  <span className="text-[8px] sm:text-[10px] text-[#2b579a] uppercase font-bold tracking-tighter">Illustrations</span>
                </div>
              </div>
            )}

            {activeTab === 'layout' && (
              <div className="m-0 p-1 sm:p-2 flex items-center justify-start gap-3 overflow-x-auto h-[105px] sm:h-auto border-b border-gray-300 w-full">
                <div className="flex flex-col items-center gap-1 px-3 border-r border-gray-300 shrink-0 bg-white shadow-sm rounded-md py-1.5 border border-gray-200">
                  <div className="flex gap-2">
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50">
                      <AlignLeft size={18} className="rotate-90 text-[#2b579a]" />
                      <span className="text-[9px] sm:text-[11px]">Margins</span>
                    </Button>
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50">
                      <FileText size={18} className="text-[#2b579a]" />
                      <span className="text-[9px] sm:text-[11px]">Orientation</span>
                    </Button>
                  </div>
                  <span className="text-[8px] sm:text-[10px] text-[#2b579a] uppercase font-bold tracking-tighter">Page Setup</span>
                </div>
              </div>
            )}

            {activeTab === 'view' && (
              <div className="m-0 p-1 sm:p-2 flex items-center justify-start gap-3 overflow-x-auto h-[105px] sm:h-auto border-b border-gray-300 w-full">
                <div className="flex flex-col items-center gap-1 px-3 border-r border-gray-300 shrink-0 bg-white shadow-sm rounded-md py-1.5 border border-gray-200">
                  <div className="flex gap-2">
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50">
                      <Printer size={18} className="text-[#2b579a]" />
                      <span className="text-[9px] sm:text-[11px]">Print</span>
                    </Button>
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50">
                      <Search size={18} className="text-[#2b579a]" />
                      <span className="text-[9px] sm:text-[11px]">Zoom</span>
                    </Button>
                  </div>
                  <span className="text-[8px] sm:text-[10px] text-[#2b579a] uppercase font-bold tracking-tighter">Views</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
