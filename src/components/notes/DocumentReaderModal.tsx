import React, { useState } from 'react';
import { NoteItem, User } from '../../types';
import { 
  BookOpen, 
  Download, 
  Share2, 
  Bookmark, 
  Check, 
  X, 
  FileText, 
  Eye, 
  Sparkles, 
  Printer, 
  ZoomIn, 
  ZoomOut,
  StickyNote
} from 'lucide-react';

interface DocumentReaderModalProps {
  note: NoteItem;
  currentUser: User;
  onClose: () => void;
  onAskAiAboutNote?: (noteTitle: string) => void;
}

export const DocumentReaderModal: React.FC<DocumentReaderModalProps> = ({
  note,
  currentUser,
  onClose,
  onAskAiAboutNote,
}) => {
  const [bookmarked, setBookmarked] = useState<boolean>(note.bookmarked || false);
  const [copied, setCopied] = useState<boolean>(false);
  const [personalNotes, setPersonalNotes] = useState<string>('');
  const [showPersonalNoteBox, setShowPersonalNoteBox] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}${note.shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col h-[90vh] max-h-[850px] overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-900 text-white flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-rose-800 dark:text-rose-400">{note.subjectName}</span>
                <span>·</span>
                <span>{note.module}</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate max-w-md">
                {note.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Ask AI about this note */}
            {onAskAiAboutNote && (
              <button
                onClick={() => onAskAiAboutNote(note.title)}
                className="py-1.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ask AI About Note</span>
              </button>
            )}

            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 rounded-xl border text-xs flex items-center transition-colors ${
                bookmarked
                  ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 border-rose-300'
                  : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'
              }`}
              title="Bookmark"
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={copyLink}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Share Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reader Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 max-w-3xl mx-auto w-full">
          {/* Note Metadata Banner */}
          <div className="pb-6 border-b border-slate-200 dark:border-slate-800 space-y-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {note.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-sans">
              <span>Author: <strong>{note.authorName}</strong> ({note.authorRole})</span>
              <span>·</span>
              <span>Published: {note.updatedAt}</span>
              <span>·</span>
              <span>Est. Read Time: {note.readTime}</span>
              <span>·</span>
              <span>Downloads: {note.downloadsCount}</span>
            </div>
          </div>

          {/* Formatted Content */}
          <div className={`prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed space-y-4 ${
            fontSize === 'large' ? 'text-sm' : 'text-xs'
          }`}>
            <div className="whitespace-pre-line font-sans">
              {note.content}
            </div>
          </div>

          {/* Personal Annotation Drawer */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <button
              onClick={() => setShowPersonalNoteBox(!showPersonalNoteBox)}
              className="text-xs font-semibold text-rose-800 dark:text-rose-400 flex items-center gap-1.5"
            >
              <StickyNote className="w-3.5 h-3.5" />
              <span>{showPersonalNoteBox ? 'Hide Personal Study Notes' : '+ Add Personal Note on this topic'}</span>
            </button>

            {showPersonalNoteBox && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <textarea
                  value={personalNotes}
                  onChange={(e) => setPersonalNotes(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200"
                  placeholder="Record your personal key takeaways, doubts for lecture, or formulas..."
                />
                <div className="flex justify-end">
                  <span className="text-[10px] text-slate-400">Saved to student study binder</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-950 px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>PCCOER CONNECT Institutional Digital Library</span>
          <span>SPPU Syllabus Aligned</span>
        </div>
      </div>
    </div>
  );
};
