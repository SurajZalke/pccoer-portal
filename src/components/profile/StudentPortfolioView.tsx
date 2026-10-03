import React, { useState } from 'react';
import { User, PracticalSubmission, AssignmentSubmission } from '../../types';
import { 
  Award, 
  CheckCircle2, 
  Share2, 
  ExternalLink, 
  ShieldCheck, 
  Download, 
  Calendar, 
  BookOpen, 
  FlaskConical, 
  Check, 
  Lock, 
  Globe,
  FileBadge
} from 'lucide-react';

interface StudentPortfolioViewProps {
  user: User;
  submissions: PracticalSubmission[];
  assignments: AssignmentSubmission[];
}

export const StudentPortfolioView: React.FC<StudentPortfolioViewProps> = ({
  user,
  submissions,
  assignments,
}) => {
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const portfolioUrl = `${window.location.origin}/student/suraj-zalke`;

  const copyPortfolioLink = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Portfolio Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-rose-800 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {user.name}
                </h1>
                <span className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400" title="Verified Institutional Enrolment">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                PRN: <strong>{user.prn || '72148920C'}</strong> · Roll: <strong>{user.rollNo || 'TE-COMP-B-42'}</strong>
              </div>
              <div className="text-xs text-rose-800 dark:text-rose-400 font-semibold">
                {user.department} · Semester {user.semester} · Batch {user.academicYear}
              </div>
            </div>
          </div>

          {/* Privacy & Shareable Link */}
          <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPublic(!isPublic)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isPublic
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                }`}
              >
                {isPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{isPublic ? 'Public Portfolio Active' : 'Private (Campus Only)'}</span>
              </button>

              <button
                onClick={copyPortfolioLink}
                className="py-1.5 px-3 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied' : 'Share Profile'}</span>
              </button>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              /student/suraj-zalke
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Academic Highlights & Verified Records */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Academic Credentials */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Academic Standing
            </h3>
            
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 font-sans">Cumulative SGPA:</span>
                <span className="font-bold text-rose-800 dark:text-rose-400">9.14 / 10.0</span>
              </div>

              <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 font-sans">Attendance Record:</span>
                <span className="font-bold text-emerald-600">92.6% Verified</span>
              </div>

              <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 font-sans">Practicals Completed:</span>
                <span className="font-bold text-slate-900 dark:text-white">8 of 8</span>
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pt-2">
              Verified Technical Skills
            </h3>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['Engineering Chemistry', 'EDTA Titrimetry', 'Stoichiometric Calculation', 'Conductometry', 'Data Structures (C++)', 'Linux Systems', 'Analytical Lab Tech'].map((skill, i) => (
                <span key={i} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Verified Practical Records Transcripts */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileBadge className="w-5 h-5 text-rose-800 dark:text-rose-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Verified Digital Practical Transcripts
                </h3>
              </div>
              <span className="text-xs text-slate-400">Cryptographically Attested</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every completed practical on PCCOER CONNECT contains tamper-evident SHA-256 hashes linked to faculty signatures and laboratory observations:
            </p>

            <div className="space-y-3">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {sub.practicalTitle}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                      {sub.marks ? `${sub.marks}/10 Marks` : 'Submitted & Verified'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Calculated Result: <strong className="font-mono text-slate-900 dark:text-white">{sub.calculatedHardness} ppm CaCO₃</strong> · Concordant Volume: {sub.observations.concordantVolume} mL
                  </div>

                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-1">
                    <span className="truncate max-w-xs">{sub.verificationHash}</span>
                    <span>Sign-off: Prof. Dr. Aarti Sharma</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
