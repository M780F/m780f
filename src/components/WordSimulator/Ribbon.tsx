import React from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Type, List, ListOrdered, Image as ImageIcon, Table as TableIcon,
  Keyboard, Save, Undo, Redo, Search, Printer, FileText, ChevronDown, Palette,
  Paperclip, Square, Circle, Layout, Layers, Grid, Frame, Trash2, Rows,
  Subscript, Superscript, FileDown, ArrowLeft, Home as HomeIcon, FilePlus, FolderOpen,
  Info, Share2, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ActiveStyles {
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
}

interface RibbonProps {
  onFormat: (command: string, value?: any) => void;
  onToggleKeyboard: () => void;
  isCollapsed?: boolean;
  onToggleCollapse: () => void;
  hasSelectedImage?: boolean;
  activeStyles: ActiveStyles;
}

export const Ribbon: React.FC<RibbonProps> = ({ 
  onFormat, 
  onToggleKeyboard, 
  isCollapsed = false, 
  onToggleCollapse,
  hasSelectedImage = false,
  activeStyles
}) => {
  const [activeTab, setActiveTab] = React.useState('home');
  const [showBackstage, setShowBackstage] = React.useState(false);

  React.useEffect(() => {
    if (hasSelectedImage) {
      setActiveTab('picture-format');
    } else if (activeTab === 'picture-format' && !hasSelectedImage) {
      setActiveTab('home');
    }
  }, [hasSelectedImage]);

  const handleFormatClick = (e: React.MouseEvent, command: string, value?: string) => {
    e.preventDefault();
    onFormat(command, value);
    if (command === 'new' || command === 'open') {
      setShowBackstage(false);
      setActiveTab('home');
    }
  };

  const handleBackstageToggle = (show: boolean) => {
    setShowBackstage(show);
    // When showing backstage, set a class on body to prevent scroll if needed
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const handleTabClick = (tab: string) => {
    if (tab === 'file') {
      handleBackstageToggle(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm z-10 shrink-0 w-full">
      {/* Backstage View Overlay */}
      {showBackstage && (
        <div className="fixed inset-0 z-[1000] bg-white flex animate-in fade-in zoom-in-95 duration-300 origin-top-left">
          {/* Backstage Sidebar */}
          <div className="w-16 sm:w-64 bg-[#2b579a] text-white flex flex-col pt-4 overflow-y-auto shrink-0 shadow-2xl">
            <button 
              onClick={() => handleBackstageToggle(false)}
              className="flex items-center gap-3 px-4 py-4 hover:bg-white/10 transition-colors mb-4 group"
            >
              <div className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center group-hover:bg-white group-hover:text-[#2b579a] transition-all">
                <ArrowLeft size={20} />
              </div>
              <span className="hidden sm:inline font-bold">Back</span>
            </button>

            <nav className="flex flex-col gap-1 px-1 sm:px-0">
              <button className="flex items-center gap-4 px-4 py-3 bg-white/10 border-l-4 border-white font-semibold">
                <HomeIcon size={20} />
                <span className="hidden sm:inline">Home</span>
              </button>
              <button 
                onClick={(e) => handleFormatClick(e as any, 'new')}
                className="flex items-center gap-4 px-4 py-3 hover:bg-white/10 transition-colors"
              >
                <FilePlus size={20} />
                <span className="hidden sm:inline">New</span>
              </button>
              <button 
                onClick={(e) => handleFormatClick(e as any, 'openBrowser')}
                className="flex items-center gap-4 px-4 py-3 hover:bg-white/10 transition-colors"
              >
                <FolderOpen size={20} />
                <span className="hidden sm:inline">Open</span>
              </button>
              <button 
                onClick={(e) => handleFormatClick(e as any, 'saveDoc')}
                className="flex items-center gap-4 px-4 py-3 hover:bg-white/10 transition-colors"
              >
                <Save size={20} />
                <span className="hidden sm:inline">Save</span>
              </button>
              <button 
                 onClick={(e) => handleFormatClick(e as any, 'exportPDF')}
                 className="flex items-center gap-4 px-4 py-3 hover:bg-white/10 transition-colors"
              >
                <FileDown size={20} />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
              
              <div className="h-[1px] bg-white/20 my-2 mx-4 hidden sm:block"></div>
              
              <button className="flex items-center gap-4 px-4 py-3 hover:bg-white/10 transition-colors opacity-60 cursor-not-allowed">
                <Info size={20} />
                <span className="hidden sm:inline">Account</span>
              </button>
              <button className="flex items-center gap-4 px-4 py-3 hover:bg-white/10 transition-colors opacity-60 cursor-not-allowed">
                <Share2 size={20} />
                <span className="hidden sm:inline">Feedback</span>
              </button>
            </nav>
          </div>

          {/* Backstage Main Content */}
          <div className="flex-1 bg-[#f3f2f1] overflow-y-auto p-4 sm:p-12">
            <div className="max-w-5xl mx-auto">
              <header className="mb-12">
                <h1 className="text-3xl font-light text-gray-800 mb-2">Good morning, Mustafa</h1>
                <p className="text-gray-500">Welcome to Word Simulator. Create or resume your work.</p>
              </header>

              <section className="mb-12">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">New</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  <div 
                    onClick={(e) => handleFormatClick(e as any, 'new')}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[3/4] bg-white border border-gray-300 rounded shadow-sm hover:shadow-md hover:border-[#2b579a] transition-all flex flex-col p-3 mb-2 overflow-hidden relative">
                      <div className="w-full h-full border border-gray-100 flex flex-col gap-1 p-1">
                        <div className="w-1/2 h-0.5 bg-gray-100" />
                        <div className="w-full h-0.5 bg-gray-100" />
                        <div className="w-3/4 h-0.5 bg-gray-100" />
                        <div className="mt-2 w-full h-0.5 bg-gray-100" />
                        <div className="w-full h-0.5 bg-gray-100" />
                      </div>
                      <div className="absolute inset-0 bg-[#2b579a]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <div className="bg-[#2b579a] text-white text-[10px] px-2 py-1 rounded font-bold">New</div>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-center text-gray-700">Blank document</p>
                  </div>
                  
                  <div className="group opacity-50 cursor-not-allowed">
                    <div className="aspect-[3/4] bg-white border border-gray-300 rounded shadow-sm flex flex-col p-3 overflow-hidden">
                       <div className="w-full h-2 bg-blue-100 mb-2" />
                       <div className="w-2/3 h-1 bg-gray-100 mb-1" />
                       <div className="w-full h-1 bg-gray-100 mb-1" />
                       <div className="w-5/6 h-1 bg-gray-100" />
                    </div>
                    <p className="text-xs font-semibold text-center text-gray-700 mt-2">Welcome to Word</p>
                  </div>

                  <div className="group opacity-50 cursor-not-allowed">
                    <div className="aspect-[3/4] bg-white border border-gray-300 rounded shadow-sm flex flex-col p-3 overflow-hidden">
                       <div className="w-8 h-8 rounded-full bg-blue-50 mb-3" />
                       <div className="w-full h-1 bg-blue-100 mb-2" />
                       <div className="w-full h-1 bg-gray-100 mb-1" />
                       <div className="w-full h-1 bg-gray-100 mb-1" />
                       <div className="w-full h-1 bg-gray-100 mb-1" />
                    </div>
                    <p className="text-xs font-semibold text-center text-gray-700 mt-2">Resume template</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Recent</h2>
                <div className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                  <div className="p-4 hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 group cursor-pointer" onClick={() => setShowBackstage(false)}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-[#2b579a]">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-800">Document1</p>
                        <p className="text-xs text-gray-500">Modified 2 minutes ago</p>
                      </div>
                    </div>
                    <div className="px-2 py-1 rounded border border-gray-200 text-[10px] font-bold text-gray-400 group-hover:border-[#2b579a] group-hover:text-[#2b579a]">OPEN</div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar - Hidden on small mobile or landscape height or when collapsed */}
      {!isCollapsed && (
        <div className="hidden sm:flex h-9 items-center justify-between px-4 bg-[#2b579a] text-white text-[11px] border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/15 px-2.5 py-1 rounded-sm backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-1">
                  <span className="text-orange-400 font-black text-[10px]">UoM</span>
                  <div className="w-[1px] h-3 bg-white/20 mx-0.5" />
                  <span className="text-blue-300 font-black text-[10px]">CPME</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileText size={12} className="text-blue-200" />
                <span className="font-bold tracking-tight">Document1 - Word Simulator</span>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-80">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-white hover:bg-white/20 p-0" 
                onMouseDown={(e) => handleFormatClick(e as any, 'saveDoc')} 
                title="Save (Ctrl+S)"
              >
                <Save size={12} />
              </Button>
              <Button 
                variant="ghost" 
                className="h-6 px-2 text-white hover:bg-white/20 text-[10px] font-bold gap-1" 
                onMouseDown={(e) => handleFormatClick(e as any, 'exportPDF')} 
                title="Export to PDF"
              >
                <FileDown size={12} />
                <span>PDF</span>
              </Button>
              <div className="w-[1px] h-3 bg-white/20 mx-1"></div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-white hover:bg-white/20 p-0" 
                onMouseDown={(e) => handleFormatClick(e as any, 'undo')} 
                title="Undo (Ctrl+Z)"
              >
                <Undo size={12} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-white hover:bg-white/20 p-0" 
                onMouseDown={(e) => handleFormatClick(e as any, 'redo')} 
                title="Redo (Ctrl+Y)"
              >
                <Redo size={12} />
              </Button>
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
                onClick={() => handleTabClick(tab)}
                className={`px-4 sm:px-6 text-[11px] sm:text-sm h-full font-medium transition-colors capitalize ${
                  activeTab === tab && !showBackstage
                    ? 'bg-[#f3f2f1] text-[#2b579a] border-t border-x border-gray-200 rounded-t-sm'
                    : tab === 'file'
                      ? 'bg-[#2b579a] text-white font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
            {hasSelectedImage && (
              <button
                onClick={() => setActiveTab('picture-format')}
                className={`px-4 sm:px-6 text-[11px] sm:text-sm h-full font-bold transition-colors uppercase italic ${
                  activeTab === 'picture-format' 
                    ? 'bg-[#f3f2f1] text-[#2b579a] border-t border-x border-gray-200 rounded-t-sm'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                Picture Format
              </button>
            )}
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

        {!isCollapsed && activeTab !== 'file' && (
          <div className="w-full bg-[#f3f2f1]">
            {activeTab === 'home' && (
              <div className="m-0 p-1 sm:p-2 flex items-center justify-start gap-2 overflow-x-auto h-[105px] sm:h-auto border-b border-gray-300 w-full">
                {/* Tools Group (Undo/Redo for mobile/compact) */}
                <div className="sm:hidden flex flex-col items-center gap-1 px-2 border-r border-gray-300 shrink-0 bg-white shadow-sm rounded-md py-1.5 border border-gray-200 min-w-[70px]">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-700 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'undo')}><Undo size={16} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-700 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'redo')}><Redo size={16} /></Button>
                  </div>
                  <span className="text-[8px] text-[#2b579a] uppercase font-bold tracking-tighter">Tools</span>
                </div>

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
                <div className="flex flex-col items-center gap-1 px-2 border-r border-gray-300 shrink-0 bg-white shadow-sm rounded-md py-1.5 border border-gray-200 min-w-[200px]">
                  <div className="flex items-center gap-1.5">
                    <Select value={activeStyles.fontName} onValueChange={(v) => onFormat('fontName', v)}>
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
                    
                    <Select value={activeStyles.fontSize} onValueChange={(v) => onFormat('fontSize', v)}>
                      <SelectTrigger className="h-8 w-[45px] text-[11px] bg-white border-gray-300 font-semibold text-gray-800">
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

                    <Select value={activeStyles.color} onValueChange={(v) => onFormat('foreColor', v)}>
                      <SelectTrigger className="h-8 w-[40px] p-0 flex items-center justify-center bg-white border-gray-300">
                        <Palette size={16} style={{ color: activeStyles.color }} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="#000000"><div className="flex items-center gap-2"><div className="w-3 h-3 bg-black rounded-full" /> Black</div></SelectItem>
                        <SelectItem value="#ff0000"><div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-600 rounded-full" /> Red</div></SelectItem>
                        <SelectItem value="#0000ff"><div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-600 rounded-full" /> Blue</div></SelectItem>
                        <SelectItem value="#008000"><div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-600 rounded-full" /> Green</div></SelectItem>
                        <SelectItem value="#ffa500"><div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-full" /> Orange</div></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button variant={activeStyles.bold ? "secondary" : "ghost"} size="icon" className={`h-8 w-8 border border-transparent ${activeStyles.bold ? 'bg-blue-100 border-blue-300 text-[#2b579a]' : 'hover:bg-blue-50'}`} onMouseDown={(e) => handleFormatClick(e, 'bold')}><Bold size={16} /></Button>
                    <Button variant={activeStyles.italic ? "secondary" : "ghost"} size="icon" className={`h-8 w-8 border border-transparent ${activeStyles.italic ? 'bg-blue-100 border-blue-300 text-[#2b579a]' : 'hover:bg-blue-50'}`} onMouseDown={(e) => handleFormatClick(e, 'italic')}><Italic size={16} /></Button>
                    <Button variant={activeStyles.underline ? "secondary" : "ghost"} size="icon" className={`h-8 w-8 border border-transparent ${activeStyles.underline ? 'bg-blue-100 border-blue-300 text-[#2b579a]' : 'hover:bg-blue-50'}`} onMouseDown={(e) => handleFormatClick(e, 'underline')}><Underline size={16} /></Button>
                    <Separator orientation="vertical" className="h-6 mx-0.5 bg-gray-300" />
                    <Button variant={activeStyles.subscript ? "secondary" : "ghost"} size="icon" className={`h-8 w-8 border border-transparent ${activeStyles.subscript ? 'bg-blue-100 border-blue-300 text-[#2b579a]' : 'hover:bg-blue-50'}`} onMouseDown={(e) => handleFormatClick(e, 'subscript')}><Subscript size={16} /></Button>
                    <Button variant={activeStyles.superscript ? "secondary" : "ghost"} size="icon" className={`h-8 w-8 border border-transparent ${activeStyles.superscript ? 'bg-blue-100 border-blue-300 text-[#2b579a]' : 'hover:bg-blue-50'}`} onMouseDown={(e) => handleFormatClick(e, 'superscript')}><Superscript size={16} /></Button>
                  </div>
                  <span className="text-[8px] text-[#2b579a] uppercase font-bold tracking-tighter">Font</span>
                </div>

                {/* Paragraph Group */}
                <div className="flex flex-col items-center gap-1 px-2 border-r border-gray-300 shrink-0 bg-white shadow-sm rounded-md py-1.5 border border-gray-200 min-w-[170px]">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1">
                      <Button variant={activeStyles.align === 'left' ? "secondary" : "ghost"} size="icon" className={`h-8 w-8 border border-transparent ${activeStyles.align === 'left' ? 'bg-blue-100 border-blue-300 text-[#2b579a]' : 'hover:bg-blue-50'}`} onMouseDown={(e) => handleFormatClick(e, 'justifyLeft')}><AlignLeft size={16} /></Button>
                      <Button variant={activeStyles.align === 'center' ? "secondary" : "ghost"} size="icon" className={`h-8 w-8 border border-transparent ${activeStyles.align === 'center' ? 'bg-blue-100 border-blue-300 text-[#2b579a]' : 'hover:bg-blue-50'}`} onMouseDown={(e) => handleFormatClick(e, 'justifyCenter')}><AlignCenter size={16} /></Button>
                      <Button variant={activeStyles.align === 'right' ? "secondary" : "ghost"} size="icon" className={`h-8 w-8 border border-transparent ${activeStyles.align === 'right' ? 'bg-blue-100 border-blue-300 text-[#2b579a]' : 'hover:bg-blue-50'}`} onMouseDown={(e) => handleFormatClick(e, 'justifyRight')}><AlignRight size={16} /></Button>
                    </div>
                    
                    <Separator orientation="vertical" className="h-6 mx-0.5 bg-gray-300" />
                    
                    <div className="flex items-center gap-0.5">
                      <Button title="Bullets" variant={activeStyles.list ? "secondary" : "ghost"} size="icon" className={`h-8 w-8 border border-transparent ${activeStyles.list ? 'bg-blue-100 border-blue-300 text-[#2b579a]' : 'hover:bg-blue-50'}`} onMouseDown={(e) => handleFormatClick(e, 'insertUnorderedList')}><List size={16} /></Button>
                      
                      <div className="flex items-center group">
                        <Button title="Numbering" variant={activeStyles.orderedList ? "secondary" : "ghost"} size="icon" className={`h-8 w-8 border-y border-l rounded-r-none border-transparent ${activeStyles.orderedList ? 'bg-blue-100 border-blue-300 text-[#2b579a]' : 'hover:bg-blue-50 border-gray-200'}`} onMouseDown={(e) => handleFormatClick(e, 'insertOrderedList')}><ListOrdered size={16} /></Button>
                        <Select onValueChange={(v) => onFormat('orderedListType', v)}>
                          <SelectTrigger className="h-8 w-5 px-0 bg-white border-y border-r border-gray-200 rounded-l-none hover:bg-blue-50 flex items-center justify-center transition-colors">
                             <ChevronDown size={12} className="text-gray-500" />
                          </SelectTrigger>
                          <SelectContent className="min-w-[140px]">
                            <SelectItem value="decimal">1, 2, 3</SelectItem>
                            <SelectItem value="lower-alpha">a, b, c</SelectItem>
                            <SelectItem value="upper-alpha">A, B, C</SelectItem>
                            <SelectItem value="lower-roman">i, ii, iii</SelectItem>
                            <SelectItem value="upper-roman">I, II, III</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center ml-0.5">
                        <Select onValueChange={(v) => onFormat('lineHeight', v)}>
                          <SelectTrigger title="Line Spacing" className="h-8 w-8 px-0 bg-white border border-gray-200 hover:bg-blue-50 flex items-center justify-center transition-colors">
                             <Rows size={16} className="text-[#2b579a]" />
                          </SelectTrigger>
                          <SelectContent className="min-w-[120px]">
                            <SelectItem value="1.0">Single (1.0)</SelectItem>
                            <SelectItem value="1.5">1.5 lines</SelectItem>
                            <SelectItem value="2.0">Double (2.0)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <span className="text-[8px] text-[#2b579a] uppercase font-bold tracking-tighter">Paragraph</span>
                </div>

                {/* Styles Group */}
                <div className="flex flex-col items-center gap-1 px-2 border-r border-gray-300 shrink-0 bg-white shadow-sm rounded-md py-1.5 border border-gray-200 min-w-[110px]">
                  <Select value={activeStyles.blockType} onValueChange={(v) => onFormat('formatBlock', v)}>
                    <SelectTrigger className={`h-8 w-[100px] text-[11px] bg-white border-gray-300 font-semibold ${activeStyles.blockType !== 'p' ? 'text-[#2b579a] border-blue-300 bg-blue-50' : 'text-gray-800'}`}>
                      <SelectValue placeholder="Styles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="p" className="font-normal">Normal</SelectItem>
                      <SelectItem value="h1" className="font-bold text-lg">Heading 1</SelectItem>
                      <SelectItem value="h2" className="font-bold text-base">Heading 2</SelectItem>
                      <SelectItem value="h3" className="font-bold text-sm">Heading 3</SelectItem>
                      <SelectItem value="h4" className="font-semibold text-sm">Heading 4</SelectItem>
                      <SelectItem value="h5" className="font-semibold text-xs">Heading 5</SelectItem>
                      <SelectItem value="h6" className="font-semibold text-[10px]">Heading 6</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-[8px] text-[#2b579a] uppercase font-bold tracking-tighter">Styles</span>
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
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'insertFile')}>
                      <Paperclip size={18} className="text-[#2b579a]" />
                      <span className="text-[9px] sm:text-[11px]">Files</span>
                    </Button>
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'insertEquation')}>
                      <div className="flex items-center justify-center font-serif italic font-bold text-lg text-[#2b579a] h-[18px]">∑</div>
                      <span className="text-[9px] sm:text-[11px]">Equation</span>
                    </Button>
                  </div>
                  <span className="text-[8px] sm:text-[10px] text-[#2b579a] uppercase font-bold tracking-tighter">Illustrations</span>
                </div>

                <div className="flex flex-col items-center gap-1 px-3 border-r border-gray-300 shrink-0 bg-white shadow-sm rounded-md py-1.5 border border-gray-200">
                  <div className="flex gap-2">
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'toggleHeader')}>
                      <FileText size={18} className="text-[#2b579a]" />
                      <span className="text-[9px] sm:text-[11px]">Header</span>
                    </Button>
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'toggleFooter')}>
                      <div className="relative">
                        <FileText size={18} className="text-[#2b579a]" />
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2b579a]"></div>
                      </div>
                      <span className="text-[9px] sm:text-[11px]">Footer</span>
                    </Button>
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'insertPageNumber')}>
                      <div className="flex items-center justify-center font-bold text-[#2b579a] h-[18px] text-xs">#</div>
                      <span className="text-[9px] sm:text-[11px]">Page #</span>
                    </Button>
                    <div className="w-[1px] h-8 sm:h-10 bg-gray-200 mx-1"></div>
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'addPage')}>
                      <div className="relative">
                        <FileText size={18} className="text-green-600" />
                        <div className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px]">+</div>
                      </div>
                      <span className="text-[9px] sm:text-[11px]">Add Page</span>
                    </Button>
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'deletePage')}>
                      <div className="relative">
                        <FileText size={18} className="text-red-500" />
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px]">-</div>
                      </div>
                      <span className="text-[9px] sm:text-[11px]">Del Page</span>
                    </Button>
                  </div>
                  <span className="text-[8px] sm:text-[10px] text-[#2b579a] uppercase font-bold tracking-tighter">Header & Footer</span>
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
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'exportPDF')}>
                      <FileDown size={18} className="text-[#2b579a]" />
                      <span className="text-[9px] sm:text-[11px]">PDF</span>
                    </Button>
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

            {activeTab === 'picture-format' && (
              <div className="m-0 p-1 sm:p-2 flex items-center justify-start gap-3 overflow-x-auto h-[105px] sm:h-auto border-b border-gray-300 w-full animate-in fade-in slide-in-from-top-1 duration-200">
                {/* Shape Styles */}
                <div className="flex flex-col items-center gap-1 px-3 border-r border-gray-300 shrink-0 bg-white shadow-sm rounded-md py-1.5 border border-gray-200">
                  <div className="flex gap-3">
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'imageShape', 'square')}>
                      <Square size={18} className="text-[#2b579a]" />
                      <span className="text-[9px] sm:text-[11px]">Square</span>
                    </Button>
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'imageShape', 'rounded')}>
                      <Square size={18} className="text-[#2b579a] rounded-sm bg-blue-50" />
                      <span className="text-[9px] sm:text-[11px]">Rounded</span>
                    </Button>
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'imageShape', 'circle')}>
                      <Circle size={18} className="text-[#2b579a]" />
                      <span className="text-[9px] sm:text-[11px]">Circle</span>
                    </Button>
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'imageShape', 'soft')}>
                      <div className="w-[18px] h-[18px] rounded-full bg-[#2b579a] blur-[1px]" />
                      <span className="text-[9px] sm:text-[11px]">Soft</span>
                    </Button>
                  </div>
                  <span className="text-[8px] sm:text-[10px] text-[#2b579a] uppercase font-bold tracking-tighter">Picture Styles</span>
                </div>

                {/* Border Options */}
                <div className="flex flex-col items-center gap-1 px-3 border-r border-gray-300 shrink-0 bg-white shadow-sm rounded-md py-1.5 border border-gray-200">
                  <div className="flex gap-1.5 items-center">
                    <Select onValueChange={(v) => onFormat('imageBorder', v)}>
                      <SelectTrigger className="h-8 w-[100px] text-[11px] bg-white border-gray-300 font-semibold text-gray-800">
                        <SelectValue placeholder="Border Color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Border</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="gold">Gold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <span className="text-[8px] sm:text-[10px] text-[#2b579a] uppercase font-bold tracking-tighter">Picture Border</span>
                </div>

                {/* Shadow / Effects */}
                <div className="flex flex-col items-center gap-1 px-3 border-r border-gray-300 shrink-0 bg-white shadow-sm rounded-md py-1.5 border border-gray-200">
                  <div className="flex gap-3">
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'imageShadow', 'on')}>
                      <Layers size={18} className="text-[#2b579a]" />
                      <span className="text-[9px] sm:text-[11px]">Shadow</span>
                    </Button>
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'imageShadow', 'none')}>
                      <Layers size={18} className="text-gray-400" />
                      <span className="text-[9px] sm:text-[11px]">No Shadow</span>
                    </Button>
                  </div>
                  <span className="text-[8px] sm:text-[10px] text-[#2b579a] uppercase font-bold tracking-tighter">Effects</span>
                </div>

                {/* Layout / Wrapping */}
                <div className="flex flex-col items-center gap-1 px-3 border-r border-gray-300 shrink-0 bg-white shadow-sm rounded-md py-1.5 border border-gray-200">
                  <div className="flex gap-3">
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'imageWrap', 'inline')}>
                      <Layers size={18} className="text-[#2b579a]" />
                      <span className="text-[9px] sm:text-[11px]">Inline</span>
                    </Button>
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'imageWrap', 'block')}>
                      <Layout size={18} className="text-[#2b579a]" />
                      <span className="text-[9px] sm:text-[11px]">Block</span>
                    </Button>
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'imageWrap', 'float-left')}>
                      <Grid size={18} className="text-[#2b579a]" />
                      <span className="text-[9px] sm:text-[11px]">Left</span>
                    </Button>
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-blue-50" onMouseDown={(e) => handleFormatClick(e, 'imageWrap', 'float-right')}>
                      <Grid size={18} className="text-[#2b579a] scale-x-[-1]" />
                      <span className="text-[9px] sm:text-[11px]">Right</span>
                    </Button>
                  </div>
                  <span className="text-[8px] sm:text-[10px] text-[#2b579a] uppercase font-bold tracking-tighter">Arrange / Wrap</span>
                </div>

                {/* Delete / Actions */}
                <div className="flex flex-col items-center gap-1 px-3 border-r border-gray-300 shrink-0 bg-white shadow-sm rounded-md py-1.5 border border-gray-200">
                  <div className="flex gap-3">
                    <Button variant="ghost" className="flex flex-col h-10 w-12 sm:h-14 sm:w-14 gap-0 sm:gap-1 p-1 hover:bg-red-50 text-red-500" onMouseDown={(e) => handleFormatClick(e, 'imageDelete')}>
                      <Trash2 size={18} />
                      <span className="text-[9px] sm:text-[11px]">Remove</span>
                    </Button>
                  </div>
                  <span className="text-[8px] sm:text-[10px] text-red-500 uppercase font-bold tracking-tighter">Actions</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Ribbon;
