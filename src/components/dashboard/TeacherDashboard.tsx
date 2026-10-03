import React from 'react';
import { 
  Subject, 
  PracticalExperiment, 
  PracticalSubmission, 
  Assignment, 
  AssignmentSubmission, 
  User 
} from '../../types';
import { 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Play, 
  FlaskConical, 
  FileText, 
  Sparkles, 
  Award, 
  BarChart3,
  ArrowRight
} from 'lucide-react';

interface TeacherDashboardProps {
  currentUser: User;
  subjects: Subject[];
  practicals: PracticalExperiment[];
  submissions: PracticalSubmission[];
  assignments: Assignment[];
  assignmentSubmissions: AssignmentSubmission[];
  onOpenSubject: (subject: Subject) => void;
  onReviewPractical: (practical: PracticalExperiment, submission: PracticalSubmission) => void;
  onOpenLiveQuiz: (code: string) => void;
  onOpenAiAssistant: () => void;
  onOpenAnalytics: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  currentUser,
  subjects,
  practicals,
  submissions,
  assignments,
  assignmentSubmissions,
  onOpenSubject,
  onReviewPractical,
  onOpenLiveQuiz,
  onOpenAiAssistant,
  onOpenAnalytics,
}) => {
  const pendingSubmissions = submissions.filter(s => s.status === 'submitted');

  return (
    <div className="space-y-8">
      {/* Teacher Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-3xl border border-rose-900/40 p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-300 uppercase tracking-widest font-mono">
            <span>Faculty Console</span>
            <span>·</span>
            <span>{currentUser.employeeId || 'PCCOER-FAC-0142'}</span>
            <span>·</span>
            <span>{currentUser.department}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {pendingSubmissions.length} practical submissions require faculty review. Live challenge <strong className="text-white font-mono">CHEM26</strong> is active.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onOpenLiveQuiz('CHEM26')}
            className="py-3 px-5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-950/80 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Live Quiz (CHEM26)</span>
          </button>

          <button
            onClick={onOpenAnalytics}
            className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-rose-400" />
            <span>Class Analytics</span>
          </button>

          <button
            onClick={onOpenAiAssistant}
            className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>Draft Curriculum (AI)</span>
          </button>
        </div>
      </div>

      {/* Quick Action Buttons (Prompt Requirement) */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Quick Faculty Actions
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: '+ Create Note', icon: BookOpen },
            { label: '+ Upload PDF Manual', icon: FileText },
            { label: '+ Create Quiz', icon: Award },
            { label: '+ Launch Live Quiz', icon: Play, action: () => onOpenLiveQuiz('CHEM26') },
            { label: '+ Create Assignment', icon: CheckCircle2 },
            { label: '+ Add Practical Activity', icon: FlaskConical },
            { label: '+ Attach Virtual Lab API', icon: FlaskConical },
            { label: '+ Publish Announcement', icon: AlertCircle },
          ].map((action, i) => (
            <button
              key={i}
              onClick={action.action}
              className="py-2 px-3.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-xs text-slate-500 uppercase font-semibold">Total Students</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">68 Enrolled</div>
          <div className="text-[11px] text-slate-400">Class Batch: First Year Engg Division B</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-xs text-slate-500 uppercase font-semibold">Pending Submissions</div>
          <div className="text-2xl font-bold font-mono text-amber-600">{pendingSubmissions.length} Records</div>
          <div className="text-[11px] text-slate-400">Requires experimental rubric evaluation</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-xs text-slate-500 uppercase font-semibold">Practical Completion</div>
          <div className="text-2xl font-bold font-mono text-emerald-600">79.4%</div>
          <div className="text-[11px] text-slate-400">MoE Virtual Lab verified sessions</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-xs text-slate-500 uppercase font-semibold">Class Performance Average</div>
          <div className="text-2xl font-bold font-mono text-rose-800 dark:text-rose-400">81.6% (Grade A)</div>
          <div className="text-[11px] text-slate-400">SPPU Continuous Evaluation criteria</div>
        </div>
      </div>

      {/* Demonstration Highlight: Practical Submissions Awaiting Faculty Review */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-rose-800 dark:text-rose-400" />
              <span>Demonstration Scenario: Practical Submissions Queue</span>
            </h2>
            <p className="text-xs text-slate-500">
              Review student observation tables, calculation accuracy, and assign grades
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-rose-800 dark:text-rose-400">
            {pendingSubmissions.length} Submissions Ready
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {submissions.map((sub) => {
            const practical = practicals.find(p => p.id === sub.practicalId) || practicals[0];
            return (
              <div
                key={sub.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-900 dark:text-white font-mono">{sub.studentName}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-mono text-slate-500">{sub.rollNo}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-rose-800 dark:text-rose-400 font-semibold">{sub.subjectName}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {sub.practicalTitle}
                  </h3>
                  <div className="text-xs text-slate-500 font-mono">
                    Concordant Volume: <strong>{sub.observations.concordantVolume} mL</strong> · Calculated Hardness: <strong>{sub.calculatedHardness} ppm CaCO₃</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    {sub.status === 'reviewed' ? `Reviewed (${sub.marks}/10)` : 'Needs Evaluation'}
                  </span>

                  <button
                    onClick={() => onReviewPractical(practical, sub)}
                    className="py-2 px-4 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <span>Evaluate Practical & Assign Marks</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Subjects Taught */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Active Subjects Under Your Instruction
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((subj) => (
            <div
              key={subj.id}
              onClick={() => onOpenSubject(subj)}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-800 dark:text-rose-400 font-mono">{subj.code}</span>
                <span className="text-slate-400">{subj.enrolledStudentsCount} Students Enrolled</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {subj.name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {subj.description}
              </p>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono border-t border-slate-100 dark:border-slate-800">
                <span>{subj.practicalsCount} Practicals Configured</span>
                <span className="text-rose-800 dark:text-rose-400 font-bold flex items-center gap-1">
                  Manage Workspace <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
