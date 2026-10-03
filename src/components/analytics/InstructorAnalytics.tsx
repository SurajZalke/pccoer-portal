import React from 'react';
import { ClassAnalytics, PracticalSubmission, AssignmentSubmission } from '../../types';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Award, 
  Clock, 
  BookOpen, 
  AlertTriangle,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface InstructorAnalyticsProps {
  analytics: ClassAnalytics;
  practicalSubmissions: PracticalSubmission[];
  assignmentSubmissions: AssignmentSubmission[];
}

export const InstructorAnalytics: React.FC<InstructorAnalyticsProps> = ({
  analytics,
  practicalSubmissions,
  assignmentSubmissions,
}) => {
  const pendingPracticalsCount = practicalSubmissions.filter(s => s.status === 'submitted').length;
  const gradedPracticalsCount = practicalSubmissions.filter(s => s.status === 'reviewed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 dark:text-rose-400 uppercase tracking-wider">
              <span>Automated Faculty Analytics</span>
              <span className="text-slate-400">·</span>
              <span>Real-Time Progress Tracking</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Class Performance Diagnostic Console
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Subject: {analytics.subjectName} · Real-time continuous evaluation data
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-right">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Class Standing</div>
              <div className="text-base font-bold text-slate-900 dark:text-white font-mono">
                {analytics.classAverageGrade}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Enrolled Students</span>
            <Users className="w-4 h-4 text-rose-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {analytics.totalEnrolled}
          </div>
          <div className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>88.4% Average Attendance</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Practical Completion</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {analytics.practicalsCompletedRate}%
          </div>
          <div className="text-xs text-slate-500">
            {pendingPracticalsCount} pending review · {gradedPracticalsCount} evaluated
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Assignment Submission</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {analytics.assignmentsSubmissionRate}%
          </div>
          <div className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+6.2% vs previous semester</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">At-Risk Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 font-mono">
            3 Students
          </div>
          <div className="text-xs text-slate-500">
            Low practical attendance / missed assignment
          </div>
        </div>
      </div>

      {/* Main Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Automated Weak Topics Heatmap & Remedial Recommendations */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-800 dark:text-rose-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Identified Weak Topics & Pedagogical Diagnostics
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Automated Error Extraction</span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            The platform aggregates recurring student calculation errors from Virtual Lab observations and quiz responses to suggest targeted revision:
          </p>

          <div className="space-y-4">
            {analytics.weakTopics.map((wt, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {wt.topic}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-400">
                    {wt.errorRate}% Error Rate
                  </span>
                </div>

                {/* Progress bar of error rate */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-700 h-full rounded-full"
                    style={{ width: `${wt.errorRate}%` }}
                  />
                </div>

                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-rose-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Recommended Faculty Action:</strong>{' '}
                    {wt.recommendedAction}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grade Distribution Bar Visualizer */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>SPPU Grade Distribution</span>
            </h2>
            <p className="text-xs text-slate-500">Based on continuous assessment + practicals</p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                <span>O Grade (Outstanding ≥ 90%)</span>
                <span className="font-bold">{analytics.gradeDistribution.o} Students</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${(analytics.gradeDistribution.o / analytics.totalEnrolled) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                <span>A+ Grade (80% - 89%)</span>
                <span className="font-bold">{analytics.gradeDistribution.aPlus} Students</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-teal-600 h-full rounded-full"
                  style={{ width: `${(analytics.gradeDistribution.aPlus / analytics.totalEnrolled) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                <span>A Grade (70% - 79%)</span>
                <span className="font-bold">{analytics.gradeDistribution.a} Students</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${(analytics.gradeDistribution.a / analytics.totalEnrolled) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                <span>B Grade (60% - 69%)</span>
                <span className="font-bold">{analytics.gradeDistribution.b} Students</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-600 h-full rounded-full"
                  style={{ width: `${(analytics.gradeDistribution.b / analytics.totalEnrolled) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                <span>C Grade (50% - 59%)</span>
                <span className="font-bold">{analytics.gradeDistribution.c} Students</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-orange-600 h-full rounded-full"
                  style={{ width: `${(analytics.gradeDistribution.c / analytics.totalEnrolled) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                <span>Re-evaluation Required (&lt; 50%)</span>
                <span className="font-bold text-red-600">{analytics.gradeDistribution.reappear} Students</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-red-600 h-full rounded-full"
                  style={{ width: `${(analytics.gradeDistribution.reappear / analytics.totalEnrolled) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            Continuous Internal Assessment (CIE) passing threshold is strictly 40% as per SPPU autonomous regulations.
          </div>
        </div>
      </div>
    </div>
  );
};
