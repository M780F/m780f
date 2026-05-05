import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, BookOpen, GraduationCap, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IntroScreenProps {
  onStart: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleStart = () => {
    setIsVisible(false);
    setTimeout(onStart, 800);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] bg-white flex flex-col items-center justify-center p-6 overflow-hidden"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#2b579a] blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#2b579a] blur-[120px]" />
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-full max-w-4xl bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-[2rem] p-8 md:p-16 flex flex-col items-center relative z-10"
          >
            {/* Logo Section */}
            <div className="flex items-center justify-center gap-8 md:gap-16 mb-12 w-full">
              <div className="flex flex-col items-center gap-2">
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="bg-orange-100 p-4 rounded-full mb-2"
                >
                  <GraduationCap className="text-orange-600" size={32} />
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-orange-600 font-extrabold text-lg md:text-2xl uppercase tracking-tighter text-center"
                >
                  University <span className="block text-sm font-normal tracking-[0.3em] text-orange-400">of Mosul</span>
                </motion.h2>
              </div>
              
              <div className="w-[1px] h-24 bg-gray-100 hidden md:block" />
              
              <div className="flex flex-col items-center gap-2">
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="bg-blue-100 p-4 rounded-full mb-2"
                >
                  <BookOpen className="text-[#2b579a]" size={32} />
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="text-[#2b579a] font-extrabold text-lg md:text-2xl uppercase tracking-tighter text-center"
                >
                  Petroleum <span className="block text-sm font-normal tracking-[0.3em] text-blue-400">& Mining Eng.</span>
                </motion.h2>
              </div>
            </div>

            {/* Title Section */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#2b579a] text-xs font-bold uppercase tracking-widest mb-6"
              >
                <Code size={14} />
                Software Presentation
              </motion.div>
              
              <motion.h1 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-4xl md:text-6xl font-light text-gray-900 mb-4 tracking-tight"
              >
                Word <span className="font-bold text-[#2b579a]">Simulator</span>
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex items-center justify-center gap-4 text-gray-400 font-medium"
              >
                <div className="h-[1px] w-8 bg-gray-200" />
                <span className="text-lg">Project M7</span>
                <div className="h-[1px] w-8 bg-gray-200" />
              </motion.div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#2b579a] shrink-0">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Developer</p>
                  <p className="text-xl font-bold text-gray-800">Mustafa Mohammed</p>
                  <p className="text-sm text-gray-500 font-medium mt-1">Creative Engineer • M7</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#2b579a] shrink-0">
                  <BookOpen size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Academic Context</p>
                  <p className="text-lg font-bold text-gray-800">Dept: Oil Reservoir</p>
                  <p className="text-sm text-gray-500 font-medium mt-1">Supervised by: <span className="text-[#2b579a] font-bold">Dr. Zaydon</span></p>
                </div>
              </motion.div>
            </div>

            {/* Start Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <Button 
                onClick={handleStart}
                className="h-16 px-10 rounded-full bg-[#2b579a] hover:bg-[#1e3a63] text-white text-lg font-bold shadow-2xl hover:shadow-blue-200 transition-all duration-300 gap-3 group"
              >
                <Play size={20} className="fill-current" />
                <span>Launch Simulator</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Code size={18} className="opacity-60" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>

          {/* Footer Text */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="absolute bottom-8 left-0 right-0 text-center text-gray-400 text-sm font-medium"
          >
            © 2026 Word Simulator Project • All Rights Reserved
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
