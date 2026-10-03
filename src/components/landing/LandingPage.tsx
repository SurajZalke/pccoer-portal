import React from 'react';
import { UserRole, Subject, PracticalExperiment } from '../../types';
import { 
  FlaskConical, 
  BookOpen, 
  Award, 
  HelpCircle, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Calendar,
  Layers,
  GraduationCap
} from 'lucide-react';

interface LandingPageProps {
  subjects: Subject[];
  practicals: PracticalExperiment[];
  onSelectRoleLogin: (role: UserRole) => void;
  onExploreDirectly: () => void;
  onSelectSubject: (subject: Subject) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  subjects,
  practicals,
  onSelectRoleLogin,
  onExploreDirectly,
  onSelectSubject,
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Institutional Top Crest Notice */}
      <div className="border-b border-rose-900/20 bg-rose-950/5 dark:bg-rose-950/20 py-2.5 px-4 text-center">
        <p className="text-xs font-semibold text-rose-900 dark:text-rose-300">
          Pimpri Chinchwad Education Trust's · Pimpri Chinchwad College of Engineering & Research (PCCOER), Ravet, Pune
        </p>
      </div>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pt-6 sm:pt-12 text-center space-y-6">
        {/* Academic Connectivity Node Background Visual */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30 dark:opacity-20 pointer-events-none">
          <div className="w-[600px] h-[350px] bg-gradient-to-r from-rose-500/30 to-amber-500/20 blur-3xl rounded-full" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/70 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-300 text-xs font-bold tracking-wide">
          <GraduationCap className="w-4 h-4" />
          <span>Official PCCOER Digital Academic Ecosystem</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
          Your Campus. Your Learning. <br className="hidden sm:inline" />
          <span className="text-rose-900 dark:text-rose-400">One Digital Platform.</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          PCCOER CONNECT brings students, teachers, academic resources, assessments, external virtual laboratories, and intelligent academic automation together in one institutional platform.
        </p>

        {/* Quick Role Entrance Call-To-Actions */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onSelectRoleLogin('student')}
            className="py-3 px-6 bg-rose-900 hover:bg-rose-800 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-rose-950/20 hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Student Portal (Suraj Zalke)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectRoleLogin('teacher')}
            className="py-3 px-6 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>Teacher Console (Prof. Dr. Aarti Sharma)</span>
          </button>

          <button
            onClick={() => onSelectRoleLogin('admin')}
            className="py-3 px-5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            <span>Admin Governance</span>
          </button>
        </div>

        {/* Tagline Indicator */}
        <div className="pt-4 text-xs font-mono font-medium text-slate-500 uppercase tracking-widest">
          Learn · Practice · Connect · Grow
        </div>
      </section>

      {/* The Core Academic Workflow Cycle Diagram */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider">
              The Complete Academic Learning Cycle
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Connecting Classroom to Virtual Laboratory to Faculty Review
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mx-auto">
              How PCCOER CONNECT unifies lecture content with real virtual experiments and verified digital journals.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-4 text-center">
            {[
              { step: '01', title: 'Teacher Teaches', desc: 'Syllabus lecture' },
              { step: '02', title: 'Digital Notes', desc: 'PDFs & guides' },
              { step: '03', title: 'Assigns Lab', desc: 'MoE / PhET lab' },
              { step: '04', title: 'Student Lab', desc: 'Virtual titration' },
              { step: '05', title: 'Observations', desc: 'Readings import' },
              { step: '06', title: 'Calculations', desc: 'AI diagnostics' },
              { step: '07', title: 'Faculty Review', desc: 'Rubric grading' },
              { step: '08', title: 'Attested Record', desc: 'Official marks' },
            ].map((node, i) => (
              <div
                key={i}
                className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between"
              >
                <div className="text-[10px] font-mono font-bold text-rose-800 dark:text-rose-400">
                  {node.step}
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white mt-1 leading-tight">
                  {node.title}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {node.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Demonstration: Engineering Chemistry */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-rose-950 via-slate-900 to-slate-950 text-white p-8 sm:p-12 rounded-3xl border border-rose-900/60 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-900/70 border border-rose-700 text-rose-200 text-xs font-bold uppercase tracking-wider">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Featured End-to-End Practical Workflow</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Determination of Hardness of Water by EDTA Titration
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Launch the integrated virtual laboratory, adjust the burette stopcock, record observations, auto-calculate hardness in ppm CaCO₃, and generate the official PCCOER signed journal record.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Third-Party MoE Virtual Lab API</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Automated Stoichiometry Check</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>PCCOER AI Mistake Explainer</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectSubject(subjects[0])}
                className="py-3 px-6 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-950/80 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Demonstrate Chemistry Lab Workflow</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Highlights Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-400 flex items-center justify-center">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Virtual Lab Integration Layer
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Seamlessly launches certified external laboratories (Ministry of Education Virtual Labs & PhET) with session handshake tokens, live observation scratchpads, and data transfer.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              PCCOER AI Grounding Layer
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Trained strictly on approved PCCOER engineering curriculum. Diagnoses calculation errors, synthesizes viva flashcards, and assists teachers with drafting questions.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Cryptographic Practical Records
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Generates printable digital practical records with college seal, SHA-256 verification hashes, and faculty signature attestation for SPPU continuous internal evaluation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
