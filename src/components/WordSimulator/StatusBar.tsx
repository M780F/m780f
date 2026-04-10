import React from 'react';

interface StatusBarProps {
  content: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ content }) => {
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  
  return (
    <div className="bg-[#2b579a] text-white text-[9px] sm:text-[11px] px-2 sm:px-4 py-0.5 sm:py-1 flex items-center justify-between z-10 shrink-0">
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="hidden xs:inline">Page 1 of 1</span>
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
