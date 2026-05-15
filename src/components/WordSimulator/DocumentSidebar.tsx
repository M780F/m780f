import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  FileEdit, 
  X, 
  LogOut, 
  User as UserIcon,
  Search,
  Clock
} from 'lucide-react';
import { WordDocument } from '../../services/documentService';
import { User } from 'firebase/auth';

interface DocumentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  documents: WordDocument[];
  activeDocId: string | null;
  onSelect: (docId: string) => void;
  onCreate: () => void;
  onDelete: (docId: string) => void;
  onLogout: () => void;
  onRename: (docId: string, newTitle: string) => void;
}

export const DocumentSidebar: React.FC<DocumentSidebarProps> = ({
  isOpen,
  onClose,
  user,
  documents,
  activeDocId,
  onSelect,
  onCreate,
  onDelete,
  onLogout,
  onRename,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartRename = (e: React.MouseEvent, doc: WordDocument) => {
    e.stopPropagation();
    setRenamingId(doc.id);
    setRenameValue(doc.title);
  };

  const handleFinishRename = (docId: string) => {
    if (renameValue.trim()) {
      onRename(docId, renameValue.trim());
    }
    setRenamingId(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
          />
          
          {/* Sidebar */}
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-[101] flex flex-col font-sans"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="text-[#2b579a]" size={24} />
                </div>
                <h2 className="font-bold text-xl text-gray-900">All Files</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Info */}
            {user && (
              <div className="p-4 mx-4 my-4 bg-gray-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 truncate">{user.displayName || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}

            {/* Search */}
            <div className="px-6 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* New Document Button */}
            <div className="px-6 mb-6">
              <button 
                onClick={() => { onCreate(); onClose(); }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#2b579a] text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-[#1e3e6d] transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <Plus size={20} />
                New Document
              </button>
            </div>

            {/* Document List */}
            <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
              <div className="flex items-center gap-2 px-2 mb-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <Clock size={12} />
                Recent Files
              </div>
              
              <div className="space-y-1">
                {filteredDocs.map((doc) => (
                  <div 
                    key={doc.id}
                    onClick={() => { onSelect(doc.id); onClose(); }}
                    className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      activeDocId === doc.id 
                      ? 'bg-blue-50 border-blue-100' 
                      : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg transition-colors ${
                      activeDocId === doc.id ? 'bg-blue-100 text-[#2b579a]' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'
                    }`}>
                      <FileText size={20} />
                    </div>
                    
                    <div className="flex-1 overflow-hidden">
                      {renamingId === doc.id ? (
                        <input 
                          autoFocus
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={() => handleFinishRename(doc.id)}
                          onKeyDown={(e) => e.key === 'Enter' && handleFinishRename(doc.id)}
                          className="w-full bg-white border-2 border-blue-500 rounded px-1 outline-none font-medium"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <>
                          <p className={`font-bold text-sm truncate ${activeDocId === doc.id ? 'text-[#2b579a]' : 'text-gray-700'}`}>
                            {doc.title}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            Edited {doc.updatedAt?.toDate?.() ? doc.updatedAt.toDate().toLocaleDateString() : 'Just now'}
                          </p>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => handleStartRename(e, doc)}
                        className="p-1.5 hover:bg-blue-100 text-blue-600 rounded-md transition-colors"
                      >
                        <FileEdit size={14} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(doc.id); }}
                        className="p-1.5 hover:bg-red-100 text-red-600 rounded-md transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {filteredDocs.length === 0 && (
                  <div className="py-12 text-center text-gray-400">
                    <p className="text-sm">No documents found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Word Online Cloud Storage</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
