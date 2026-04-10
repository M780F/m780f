import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm z-10 shrink-0">
      {/* Top Bar - Hidden on small mobile or landscape height or when collapsed */}
      {!isCollapsed && (
        <div className="hidden sm:flex h-7 items-center justify-between px-4 bg-[#2b579a] text-white text-[11px] animate-in slide-in-from-top duration-200">
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

      <Tabs defaultValue="home" className="w-full">
        <div className="flex items-center px-1 sm:px-2 bg-white border-b border-gray-100 h-8 sm:h-9">
          <TabsList className="bg-transparent border-none h-full p-0 gap-0">
            <TabsTrigger value="file" className="data-[state=active]:bg-[#2b579a] data-[state=active]:text-white data-[state=active]:border-none rounded-none px-3 sm:px-5 text-[10px] sm:text-xs h-full font-medium transition-colors">File</TabsTrigger>
            <TabsTrigger value="home" className="data-[state=active]:bg-white data-[state=active]:text-[#2b579a] data-[state=active]:border-b-2 data-[state=active]:border-[#2b579a] rounded-none px-3 sm:px-5 text-[10px] sm:text-xs h-full font-medium transition-colors">Home</TabsTrigger>
            <TabsTrigger value="insert" className="data-[state=active]:bg-white data-[state=active]:text-[#2b579a] data-[state=active]:border-b-2 data-[state=active]:border-[#2b579a] rounded-none px-3 sm:px-5 text-[10px] sm:text-xs h-full font-medium transition-colors">Insert</TabsTrigger>
            <TabsTrigger value="layout" className="data-[state=active]:bg-white data-[state=active]:text-[#2b579a] data-[state=active]:border-b-2 data-[state=active]:border-[#2b579a] rounded-none px-3 sm:px-5 text-[10px] sm:text-xs h-full font-medium transition-colors">Layout</TabsTrigger>
            <TabsTrigger value="view" className="data-[state=active]:bg-white data-[state=active]:text-[#2b579a] data-[state=active]:border-b-2 data-[state=active]:border-[#2b579a] rounded-none px-3 sm:px-5 text-[10px] sm:text-xs h-full font-medium transition-colors">View</TabsTrigger>
          </TabsList>
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
          <>
            <TabsContent value="file" className="m-0 p-0 bg-[#2b579a] text-white flex flex-col h-[80px] sm:h-[100px] animate-in slide-in-from-top-1 duration-200">
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
        </TabsContent>

        <TabsContent value="home" className="m-0 p-1 sm:p-2 bg-[#f3f2f1] flex items-center gap-3 overflow-x-auto h-[90px] sm:h-auto animate-in slide-in-from-top-1 duration-200">
          {/* Clipboard Group */}
          <div className="flex flex-col items-center gap-1 px-3 border-r border-gray-300 shrink-0 bg-white/40 rounded-md py-1">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => onFormat('paste')}><FileText size={14} className="sm:w-[18px]" /></Button>
              <div className="flex flex-col gap-0.5">
                <Button variant="ghost" size="sm" className="h-3 px-2 text-[8px] sm:text-[10px]" onClick={() => onFormat('cut')}>Cut</Button>
                <Button variant="ghost" size="sm" className="h-3 px-2 text-[8px] sm:text-[10px]" onClick={() => onFormat('copy')}>Copy</Button>
              </div>
            </div>
            <span className="text-[8px] sm:text-[9px] text-gray-500 uppercase font-bold">Clipboard</span>
          </div>

          {/* Font Group */}
          <div className="flex flex-col items-center gap-1 px-3 border-r border-gray-300 shrink-0 bg-white/40 rounded-md py-1">
            <div className="flex items-center gap-2">
              <Select defaultValue="Arial" onValueChange={(v) => onFormat('fontName', v)}>
                <SelectTrigger className="h-7 w-[85px] sm:h-7 sm:w-[100px] text-[10px] sm:text-xs bg-white border-gray-300">
                  <SelectValue placeholder="Font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Calibri">Calibri</SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="3" onValueChange={(v) => onFormat('fontSize', v)}>
                <SelectTrigger className="h-7 w-[45px] sm:h-7 sm:w-[50px] text-[10px] sm:text-xs bg-white border-gray-300">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">8pt</SelectItem>
                  <SelectItem value="2">10pt</SelectItem>
                  <SelectItem value="3">11pt</SelectItem>
                  <SelectItem value="4">12pt</SelectItem>
                  <SelectItem value="5">14pt</SelectItem>
                  <SelectItem value="6">18pt</SelectItem>
                  <SelectItem value="7">24pt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-7 sm:w-7" onClick={() => onFormat('bold')}><Bold size={14} className="sm:w-[14px]" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-7 sm:w-7" onClick={() => onFormat('italic')}><Italic size={14} className="sm:w-[14px]" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-7 sm:w-7" onClick={() => onFormat('underline')}><Underline size={14} className="sm:w-[14px]" /></Button>
            </div>
            <span className="text-[8px] sm:text-[9px] text-gray-500 uppercase font-bold">Font</span>
          </div>

          {/* Paragraph Group */}
          <div className="flex flex-col items-center gap-1 px-3 border-r border-gray-300 shrink-0 bg-white/40 rounded-md py-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-7 sm:w-7" onClick={() => onFormat('insertUnorderedList')}><List size={14} className="sm:w-[14px]" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-7 sm:w-7" onClick={() => onFormat('insertOrderedList')}><ListOrdered size={14} className="sm:w-[14px]" /></Button>
              </div>
              <Separator orientation="vertical" className="h-5 sm:h-6 mx-1" />
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-7 sm:w-7" onClick={() => onFormat('justifyLeft')}><AlignLeft size={14} className="sm:w-[14px]" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-7 sm:w-7" onClick={() => onFormat('justifyCenter')}><AlignCenter size={14} className="sm:w-[14px]" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-7 sm:w-7" onClick={() => onFormat('justifyRight')}><AlignRight size={14} className="sm:w-[14px]" /></Button>
              </div>
            </div>
            <span className="text-[8px] sm:text-[9px] text-gray-500 uppercase font-bold">Paragraph</span>
          </div>
        </TabsContent>

        <TabsContent value="insert" className="m-0 p-1 sm:p-2 bg-[#f3f2f1] flex items-center gap-2 overflow-x-auto h-[75px] sm:h-auto animate-in slide-in-from-top-1 duration-200">
           <div className="flex flex-col items-center gap-0 px-2 border-r border-gray-300 shrink-0 bg-white/40 rounded-sm py-0.5">
             <div className="flex gap-2">
               <Button variant="ghost" className="flex flex-col h-8 w-10 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1" onClick={() => onFormat('insertTable')}>
                 <TableIcon size={16} className="sm:w-[20px]" />
                 <span className="text-[8px] sm:text-[10px]">Table</span>
               </Button>
               <Button variant="ghost" className="flex flex-col h-8 w-10 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1" onClick={() => onFormat('insertImage')}>
                 <ImageIcon size={16} className="sm:w-[20px]" />
                 <span className="text-[8px] sm:text-[10px]">Pictures</span>
               </Button>
             </div>
             <span className="text-[7px] sm:text-[9px] text-gray-500 uppercase">Illustrations</span>
           </div>
        </TabsContent>

        <TabsContent value="layout" className="m-0 p-1 sm:p-2 bg-[#f3f2f1] flex items-center gap-2 overflow-x-auto h-[75px] sm:h-auto animate-in slide-in-from-top-1 duration-200">
          <div className="flex flex-col items-center gap-0 px-2 border-r border-gray-300 shrink-0 bg-white/40 rounded-sm py-0.5">
            <div className="flex gap-2">
              <Button variant="ghost" className="flex flex-col h-8 w-10 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1">
                <AlignLeft size={16} className="rotate-90 sm:w-[20px]" />
                <span className="text-[8px] sm:text-[10px]">Margins</span>
              </Button>
              <Button variant="ghost" className="flex flex-col h-8 w-10 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1">
                <FileText size={16} className="sm:w-[20px]" />
                <span className="text-[8px] sm:text-[10px]">Orientation</span>
              </Button>
            </div>
            <span className="text-[7px] sm:text-[9px] text-gray-500 uppercase">Page Setup</span>
          </div>
        </TabsContent>

        <TabsContent value="view" className="m-0 p-1 sm:p-2 bg-[#f3f2f1] flex items-center gap-2 overflow-x-auto h-[75px] sm:h-auto animate-in slide-in-from-top-1 duration-200">
          <div className="flex flex-col items-center gap-0 px-2 border-r border-gray-300 shrink-0 bg-white/40 rounded-sm py-0.5">
            <div className="flex gap-2">
              <Button variant="ghost" className="flex flex-col h-8 w-10 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1">
                <Printer size={16} className="sm:w-[20px]" />
                <span className="text-[8px] sm:text-[10px]">Print</span>
              </Button>
              <Button variant="ghost" className="flex flex-col h-8 w-10 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1">
                <Search size={16} className="sm:w-[20px]" />
                <span className="text-[8px] sm:text-[10px]">Zoom</span>
              </Button>
            </div>
            <span className="text-[7px] sm:text-[9px] text-gray-500 uppercase">Views</span>
          </div>
        </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};
