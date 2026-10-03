import React, { useState } from 'react';
import { Subject, NoteItem, PracticalExperiment, PracticalSubmission, Assignment, AssignmentSubmission, QuestionPaper, Quiz, User } from '../../types';
import { 
  BookOpen, 
  FlaskConical, 
  FileText, 
  HelpCircle, 
  Award, 
  Download, 
  Share2, 
  Check, 
  ExternalLink, 
  Plus, 
  Calendar, 
  MessageSquare, 
  Search, 
  Filter, 
  Eye, 
  QrCode as QrIcon,
  Play
} from 'lucide-react';

interface SubjectWorkspaceProps {
  subject: Subject;
  currentUser: User;
  notes: NoteItem[];
  practicals: PracticalExperiment[];
  submissions: PracticalSubmission[];
  assignments: Assignment[];
  assignmentSubmissions: AssignmentSubmission[];
  questionPapers: QuestionPaper[];
  quizzes: Quiz[];
  onOpenPractical: (practical: PracticalExperiment) => void;
  onOpenLiveQuiz: (code: string) => void;
  onOpenNoteReader: (note: NoteItem) => void;
}

export const SubjectWorkspace: React.FC<SubjectWorkspaceProps> = ({
  subject,
  currentUser,
  notes,
  practicals,
  submissions,
  assignments,
  assignmentSubmissions,
  questionPapers,
  quizzes,
  onOpenPractical,
  onOpenLiveQuiz,
  onOpenNoteReader,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'notes' | 'practicals' | 'assignments' | 'papers' | 'quizzes' | 'discussions'
  >('practicals'); // default to practicals to highlight the core differentiator

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isTeacher = currentUser.role === 'teacher' || currentUser.role === 'admin';

  const copyResourceLink = (shareUrl: string, id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}${shareUrl}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Subject Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 dark:text-rose-400 uppercase tracking-widest">
              <span>{subject.code}</span>
              <span className="text-slate-400">·</span>
              <span>Semester {subject.semester}</span>
              <span className="text-slate-400">·</span>
              <span>{subject.department}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {subject.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              {subject.description}
            </p>
          </div>

          {/* Teacher Badge / Action */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0">
            <img
              src={subject.teacherAvatar}
              alt={subject.teacherName}
              className="w-12 h-12 rounded-xl object-cover border border-slate-300 dark:border-slate-700"
            />
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Course Faculty</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">{subject.teacherName}</div>
              <div className="text-[11px] text-rose-800 dark:text-rose-400">Faculty In-Charge</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Segmented Control */}
        <div className="mt-8 flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs font-medium">
          <button
            onClick={() => setActiveTab('practicals')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'practicals'
                ? 'bg-rose-900 text-white font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Practicals & Virtual Labs ({practicals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-white dark:bg-slate-900 text-rose-800 dark:text-rose-400 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Notes & PDFs ({notes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'assignments'
                ? 'bg-white dark:bg-slate-900 text-rose-800 dark:text-rose-400 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Assignments ({assignments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'quizzes'
                ? 'bg-white dark:bg-slate-900 text-rose-800 dark:text-rose-400 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Quizzes & Live Arena ({quizzes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('papers')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'papers'
                ? 'bg-white dark:bg-slate-900 text-rose-800 dark:text-rose-400 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Question Papers / PYQs ({questionPapers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('discussions')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'discussions'
                ? 'bg-white dark:bg-slate-900 text-rose-800 dark:text-rose-400 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Doubts & Discussions</span>
          </button>
        </div>
      </div>

      {/* TAB: Practicals & Virtual Labs */}
      {activeTab === 'practicals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Laboratory Practical Curriculum
              </h2>
              <p className="text-xs text-slate-500">
                Connected to certified Ministry of Education / PhET Virtual Laboratory engines
              </p>
            </div>

            {isTeacher && (
              <button className="py-2 px-4 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer">
                <Plus className="w-4 h-4" />
                <span>Attach New Practical</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {practicals.map((prac) => {
              const sub = submissions.find(s => s.practicalId === prac.id);
              return (
                <div
                  key={prac.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider">
                        Practical #{prac.number.toString().padStart(2, '0')}
                      </span>
                      <span className="text-slate-500">Deadline: {prac.deadline}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {prac.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {prac.aim}
                    </p>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="text-slate-500">
                        Gateway: <strong className="text-slate-700 dark:text-slate-300">{prac.vlabIntegration.providerName}</strong>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        API Handshake Ready
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      {sub?.status === 'reviewed' ? (
                        <span className="text-xs font-bold text-emerald-600 font-mono">
                          Verified: {sub.marks}/{prac.maxMarks} Marks
                        </span>
                      ) : sub?.status === 'submitted' ? (
                        <span className="text-xs font-semibold text-amber-600">
                          Submitted (Review Pending)
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">
                          Pending Submission
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onOpenPractical(prac)}
                      className="py-2 px-4 bg-gradient-to-r from-rose-900 to-rose-700 hover:from-rose-800 hover:to-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{sub ? 'View Practical Journal' : 'Start Practical'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: Notes System & PDF Viewer */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Course Notes & Study Manuals
              </h2>
              <p className="text-xs text-slate-500">
                Official notes authored by PCCOER professors with inline document reader
              </p>
            </div>

            {isTeacher && (
              <button className="py-2 px-4 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer">
                <Plus className="w-4 h-4" />
                <span>Upload Note / PDF</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-rose-800 dark:text-rose-400">{note.module}</span>
                    <span>·</span>
                    <span>{note.topic}</span>
                    <span>·</span>
                    <span>{note.readTime} read</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {note.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {note.summary}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span>By {note.authorName} ({note.authorRole})</span>
                    <span>·</span>
                    <span>Updated {note.updatedAt}</span>
                    <span>·</span>
                    <span>{note.viewsCount} views</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => copyResourceLink(note.shareUrl, note.id)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title="Copy Shareable Link"
                  >
                    {copiedId === note.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => onOpenNoteReader(note)}
                    className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Document</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Assignments */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Course Assignments
              </h2>
              <p className="text-xs text-slate-500">Submit solutions and receive faculty feedback</p>
            </div>

            {isTeacher && (
              <button className="py-2 px-4 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer">
                <Plus className="w-4 h-4" />
                <span>Create Assignment</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {assignments.map((asg) => {
              const sub = assignmentSubmissions.find(s => s.assignmentId === asg.id);
              return (
                <div
                  key={asg.id}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-rose-800 dark:text-rose-400">{asg.module}</span>
                      <span>·</span>
                      <span>Max Marks: {asg.totalMarks}</span>
                      <span>·</span>
                      <span>Deadline: {asg.deadline}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {asg.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {asg.description}
                    </p>

                    {sub?.status === 'graded' && (
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs space-y-1 mt-2">
                        <div className="font-bold text-emerald-800 dark:text-emerald-300">
                          Grade: {sub.marks} / {sub.maxMarks} Marks
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 font-sans">
                          Feedback: "{sub.feedback}" — {sub.reviewedBy}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {sub ? (
                      <span className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-xl border border-emerald-200 dark:border-emerald-800">
                        {sub.status === 'graded' ? 'Graded ✓' : 'Submitted'}
                      </span>
                    ) : (
                      <button className="py-2.5 px-5 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer">
                        Submit Solution
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: Quizzes & Live Challenge */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          {/* Live Quiz Spotlight Banner */}
          <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 border border-rose-900/60 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-rose-900 text-rose-200 text-xs font-bold uppercase tracking-wider">
                Live Quiz Challenge Active
              </span>
              <h2 className="text-xl sm:text-2xl font-black">
                CHEM26: Water Hardness & EDTA Titration
              </h2>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Connect synchronously with classmates and faculty in real-time. Answer questions, compete on the live leaderboard, and analyze conceptual explanations instantly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={() => onOpenLiveQuiz('CHEM26')}
                className="py-3 px-6 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-rose-950/80 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isTeacher ? 'Host Live Quiz Room' : 'Join Live Quiz (CHEM26)'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Self-Paced Practice Quizzes
            </h3>
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
              >
                <div>
                  <div className="text-xs text-rose-800 dark:text-rose-400 font-semibold">{quiz.module}</div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{quiz.title}</h4>
                  <div className="text-xs text-slate-500">
                    {quiz.questions.length} Questions · {quiz.durationMinutes} Minutes · {quiz.totalMarks} Marks
                  </div>
                </div>

                <button
                  onClick={() => onOpenLiveQuiz(quiz.liveCode || 'CHEM26')}
                  className="py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold"
                >
                  Attempt Practice Quiz
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Question Papers (PYQs) */}
      {activeTab === 'papers' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Previous Year Question Papers (PYQ Repository)
            </h2>
            <p className="text-xs text-slate-500">Official university and internal semester papers for exam preparation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questionPapers.map((paper) => (
              <div
                key={paper.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span className="font-semibold text-rose-800 dark:text-rose-400">{paper.examType}</span>
                    <span>·</span>
                    <span>{paper.academicYear}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{paper.title}</h4>
                  <div className="text-xs text-slate-500">
                    Max Marks: {paper.totalMarks} · Duration: {paper.duration} · {paper.downloads} Downloads
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">SPPU Examination Archive</span>
                  <button className="py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Doubts & Discussions */}
      {activeTab === 'discussions' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Academic Doubts & Conceptual Forum
              </h2>
              <p className="text-xs text-slate-500">Ask questions regarding water technology or lab calculations; faculty and peers respond</p>
            </div>
            <button className="py-2 px-4 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Ask Doubt</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Suraj Zalke asked: "Why does the Ca-EDTA complex require pH ~10, and why not pH 12?"
              </span>
              <span className="text-[10px] text-slate-400">Yesterday</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              In the EDTA complexometric titration for determination of hardness, why do we use NH4Cl/NH4OH buffer to strictly maintain pH at 10?
            </p>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 space-y-1">
              <div className="font-bold text-rose-800 dark:text-rose-400 flex items-center gap-1">
                <span>Faculty Verified Answer</span> · <span>Prof. Dr. Aarti Sharma</span>
              </div>
              <p className="leading-relaxed">
                At pH &lt; 9, the stability constant is insufficient for complete chelation of Mg²⁺. At pH &gt; 11, magnesium precipitates as insoluble Mg(OH)₂, which prevents it from reacting with EDTA and causes erroneous total hardness values. Hence pH 10 is stoichiometric optimum.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
