import React from 'react';

interface StatusBarProps {
  content: string;
  saveStatus?: 'saved' | 'saving' | 'error';
}

export const StatusBar: React.FC<StatusBarProps> = ({ content, saveStatus = 'saved' }) => {
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  
  return (
    <div className="bg-[#2b579a] text-white text-[9px] sm:text-[11px] px-2 sm:px-4 py-0.5 sm:py-1 flex items-center justify-between z-10 shrink-0">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1.5 border-r border-white/20 pr-3 mr-1">
          {saveStatus === 'saving' ? (
            <span className="flex items-center gap-1 opacity-70">
              <span className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse" />
              Saving...
            </span>
          ) : saveStatus === 'error' ? (
            <span className="flex items-center gap-1 text-orange-300 font-bold">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
              Save Error (Storage full)
            </span>
          ) : (
            <span className="flex items-center gap-1 opacity-70">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              Saved
            </span>
          )}
        </div>
        <span>{wordCount} words</span>
        <span className="hidden md:inline">English (United States)</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <span>100%</span>
          <div className="w-16 sm:w-24 h-1 bg-white/30 rounded-full overflow-hidden relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
