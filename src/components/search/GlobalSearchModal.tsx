import React, { useState } from 'react';
import { Subject, NoteItem, PracticalExperiment, Assignment, QuestionPaper, Quiz } from '../../types';
import { 
  Search, 
  X, 
  BookOpen, 
  FlaskConical, 
  FileText, 
  Award, 
  ArrowRight,
  Filter
} from 'lucide-react';

interface GlobalSearchModalProps {
  subjects: Subject[];
  notes: NoteItem[];
  practicals: PracticalExperiment[];
  assignments: Assignment[];
  questionPapers: QuestionPaper[];
  quizzes: Quiz[];
  onClose: () => void;
  onSelectPractical: (p: PracticalExperiment) => void;
  onSelectNote: (n: NoteItem) => void;
  onSelectSubject: (s: Subject) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  subjects,
  notes,
  practicals,
  assignments,
  questionPapers,
  quizzes,
  onClose,
  onSelectPractical,
  onSelectNote,
  onSelectSubject,
}) => {
  const [query, setQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');

  const q = query.toLowerCase().trim();

  const filteredPracticals = practicals.filter(p => 
    (filterType === 'all' || filterType === 'practical') &&
    (p.title.toLowerCase().includes(q) || p.aim.toLowerCase().includes(q) || p.topic.toLowerCase().includes(q))
  );

  const filteredNotes = notes.filter(n => 
    (filterType === 'all' || filterType === 'note') &&
    (n.title.toLowerCase().includes(q) || n.topic.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
  );

  const filteredSubjects = subjects.filter(s => 
    (filterType === 'all' || filterType === 'subject') &&
    (s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
  );

  const filteredPapers = questionPapers.filter(qp => 
    (filterType === 'all' || filterType === 'paper') &&
    (qp.title.toLowerCase().includes(q) || qp.examType.toLowerCase().includes(q))
  );

  const totalResults = filteredPracticals.length + filteredNotes.length + filteredSubjects.length + filteredPapers.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Box */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-rose-800 dark:text-rose-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, virtual practicals, subjects, PYQs..."
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-semibold text-slate-400">Filters:</span>
          {['all', 'practical', 'note', 'subject', 'paper'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                filterType === t
                  ? 'bg-rose-900 text-white font-semibold'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {t === 'all' ? 'All Content' : `${t}s`}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {totalResults === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-1">
              <p>No matching academic resources found for "{query}".</p>
              <p className="text-[11px] text-slate-500">Try searching "EDTA", "Hardness", "Water", or "AVL Trees".</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Practicals */}
              {filteredPracticals.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Virtual Lab Practicals ({filteredPracticals.length})
                  </div>
                  {filteredPracticals.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => { onSelectPractical(p); onClose(); }}
                      className="p-3 bg-slate-50 dark:bg-slate-950 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <FlaskConical className="w-4 h-4 text-rose-800 dark:text-rose-400" />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{p.title}</div>
                          <div className="text-[11px] text-slate-500">{p.subjectName} · {p.vlabIntegration.providerName}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Notes */}
              {filteredNotes.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Lecture Notes & PDFs ({filteredNotes.length})
                  </div>
                  {filteredNotes.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => { onSelectNote(n); onClose(); }}
                      className="p-3 bg-slate-50 dark:bg-slate-950 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</div>
                          <div className="text-[11px] text-slate-500">{n.subjectName} · {n.module}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Subjects */}
              {filteredSubjects.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Courses & Workspaces ({filteredSubjects.length})
                  </div>
                  {filteredSubjects.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => { onSelectSubject(s); onClose(); }}
                      className="p-3 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{s.name} ({s.code})</div>
                        <div className="text-[11px] text-slate-500">{s.department} · Faculty: {s.teacherName}</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
