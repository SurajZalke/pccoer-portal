import React from 'react';
import { 
  Subject, 
  PracticalExperiment, 
  PracticalSubmission, 
  Assignment, 
  AssignmentSubmission, 
  NoteItem, 
  Announcement, 
  AcademicCalendarEvent, 
  User 
} from '../../types';
import { 
  FlaskConical, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Trophy, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';

interface StudentDashboardProps {
  currentUser: User;
  subjects: Subject[];
  practicals: PracticalExperiment[];
  submissions: PracticalSubmission[];
  assignments: Assignment[];
  assignmentSubmissions: AssignmentSubmission[];
  notes: NoteItem[];
  announcements: Announcement[];
  calendarEvents: AcademicCalendarEvent[];
  onOpenSubject: (subject: Subject) => void;
  onOpenPractical: (practical: PracticalExperiment) => void;
  onOpenNoteReader: (note: NoteItem) => void;
  onOpenLiveQuiz: (code: string) => void;
  onOpenAiAssistant: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  subjects,
  practicals,
  submissions,
  assignments,
  assignmentSubmissions,
  notes,
  announcements,
  calendarEvents,
  onOpenSubject,
  onOpenPractical,
  onOpenNoteReader,
  onOpenLiveQuiz,
  onOpenAiAssistant,
}) => {
  const pendingPracticals = practicals.filter(
    p => !submissions.some(s => s.practicalId === p.id && s.status === 'reviewed')
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 rounded-3xl border border-rose-900/40 p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-300 uppercase tracking-widest font-mono">
            <span>PCCOER Student Portal</span>
            <span>·</span>
            <span>{currentUser.rollNo}</span>
            <span>·</span>
            <span>Sem {currentUser.semester}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            You have <strong className="text-white">{pendingPracticals.length} pending practical records</strong> and <strong className="text-white">1 active Live Quiz challenge</strong> scheduled today.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onOpenLiveQuiz('CHEM26')}
            className="py-3 px-5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-950/60 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Join Live Challenge (CHEM26)</span>
          </button>

          <button
            onClick={onOpenAiAssistant}
            className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>PCCOER AI</span>
          </button>
        </div>
      </div>

      {/* Continue Learning Section (Mandated in Prompt) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Continue Learning</span>
            <span className="text-xs font-normal text-slate-500">· Quick resume academic activities</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Item 1: Chemistry Practical */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider font-mono">
                Engineering Chemistry
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Hardness of Water by EDTA
              </h3>
              <p className="text-xs text-slate-500">
                Perform virtual titration & enter observations
              </p>
            </div>

            <button
              onClick={() => onOpenPractical(practicals[0])}
              className="w-full py-2 px-3 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Continue Practical</span>
            </button>
          </div>

          {/* Item 2: Chemistry Notes */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider font-mono">
                Module 1 · Water Tech
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                EDTA Complexometry & Principles
              </h3>
              <p className="text-xs text-slate-500">
                12 min read · Reviewed yesterday
              </p>
            </div>

            <button
              onClick={() => onOpenNoteReader(notes[0])}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Open Notes</span>
            </button>
          </div>

          {/* Item 3: Live Quiz */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-mono">
                Active Assessment
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Water Technology Challenge
              </h3>
              <p className="text-xs text-slate-500">
                Live Quiz Code: CHEM26
              </p>
            </div>

            <button
              onClick={() => onOpenLiveQuiz('CHEM26')}
              className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Launch Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: My Subjects & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): My Subjects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Enrolled Subjects (Semester {currentUser.semester})
            </h2>
            <span className="text-xs text-slate-500 font-mono">PCCOER Autonomous Curriculum</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subjects.map((subj) => (
              <div
                key={subj.id}
                onClick={() => onOpenSubject(subj)}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-800 dark:text-rose-400 font-mono">{subj.code}</span>
                    <span className="text-slate-400">Sem {subj.semester}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-800 dark:group-hover:text-rose-400 transition-colors">
                    {subj.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {subj.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>{subj.practicalsCount} Practicals</span>
                  <span>{subj.modulesCount} Modules</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {/* Recent Campus Announcements */}
          <div className="pt-4 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Official Campus Announcements
            </h3>
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-rose-800 dark:text-rose-400">{ann.category} · {ann.department}</span>
                    <span className="text-slate-400 font-mono">{ann.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ann.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Today's Classes & Academic Timeline */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-800 dark:text-rose-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Today's Academic Schedule
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Oct 03, 2026</span>
            </div>

            <div className="space-y-3 font-sans">
              {calendarEvents.slice(0, 3).map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-900 dark:text-white">{evt.time}</span>
                    <span className="text-rose-800 dark:text-rose-400 uppercase text-[10px] font-bold">{evt.type}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{evt.title}</div>
                  {evt.location && <div className="text-[11px] text-slate-500">{evt.location}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Academic Standing Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Continuous Evaluation Progress
            </h3>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Verified Attendance:</span>
                <span className="font-bold text-emerald-600">92.6%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Practicals Completed:</span>
                <span className="font-bold text-slate-900 dark:text-white">8 / 8 Completed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Internal Marks (Avg):</span>
                <span className="font-bold text-rose-800 dark:text-rose-400">23.4 / 25</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
