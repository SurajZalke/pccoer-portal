import React, { useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  Subject, 
  PracticalExperiment, 
  PracticalSubmission, 
  NoteItem,
  AssignmentSubmission
} from './types';
import { 
  MOCK_USERS, 
  MOCK_SUBJECTS, 
  MOCK_DEPARTMENTS, 
  MOCK_NOTES, 
  MOCK_PRACTICALS, 
  MOCK_SUBMISSIONS, 
  MOCK_ASSIGNMENTS, 
  MOCK_ASSIGNMENT_SUBMISSIONS, 
  MOCK_QUESTION_PAPERS, 
  MOCK_QUIZZES, 
  MOCK_ANNOUNCEMENTS, 
  MOCK_NOTIFICATIONS, 
  MOCK_CALENDAR_EVENTS, 
  MOCK_CLASS_ANALYTICS 
} from './data/mockData';

import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { SubjectWorkspace } from './components/subjects/SubjectWorkspace';
import { DigitalPracticalJournal } from './components/practicals/DigitalPracticalJournal';
import { LiveQuizModal } from './components/quiz/LiveQuizModal';
import { PccoerAiAssistant } from './components/ai/PccoerAiAssistant';
import { DocumentReaderModal } from './components/notes/DocumentReaderModal';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { StudentPortfolioView } from './components/profile/StudentPortfolioView';
import { InstructorAnalytics } from './components/analytics/InstructorAnalytics';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { 
  FlaskConical, 
  Sparkles, 
  Users, 
  Award, 
  ShieldCheck, 
  Play, 
  CheckCircle2, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS.student);
  const [currentView, setCurrentView] = useState<
    'landing' | 'dashboard' | 'subject' | 'practical' | 'portfolio' | 'analytics' | 'admin'
  >('dashboard');

  const [selectedSubject, setSelectedSubject] = useState<Subject>(MOCK_SUBJECTS[0]);
  const [selectedPractical, setSelectedPractical] = useState<PracticalExperiment>(MOCK_PRACTICALS[0]);
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);

  // Submissions State (supports dynamic submission and teacher review)
  const [submissions, setSubmissions] = useState<PracticalSubmission[]>(MOCK_SUBMISSIONS);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<AssignmentSubmission[]>(MOCK_ASSIGNMENT_SUBMISSIONS);

  // Modals
  const [showLiveQuiz, setShowLiveQuiz] = useState<boolean>(false);
  const [liveQuizCode, setLiveQuizCode] = useState<string>('CHEM26');
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);

  // Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle Role Switch
  const handleSwitchRole = (role: UserRole) => {
    setCurrentUser(MOCK_USERS[role]);
    if (role === 'admin') {
      setCurrentView('admin');
    } else if (currentView === 'landing') {
      setCurrentView('dashboard');
    }
  };

  // Practical Submission Handler
  const handleSavePracticalSubmission = (sub: PracticalSubmission) => {
    setSubmissions(prev => {
      const idx = prev.findIndex(s => s.id === sub.id || (s.practicalId === sub.practicalId && s.studentId === sub.studentId));
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = sub;
        return updated;
      }
      return [...prev, sub];
    });
  };

  // Teacher Review Handler
  const handleTeacherReview = (
    submissionId: string,
    marks: number,
    rubrics: { experimentalAccuracy: number; calculations: number; vivaVoce: number },
    feedback: string
  ) => {
    setSubmissions(prev => {
      return prev.map(s => {
        if (s.id === submissionId) {
          return {
            ...s,
            status: 'reviewed',
            marks,
            rubrics,
            facultyFeedback: feedback,
            reviewedBy: currentUser.name,
            reviewedAt: new Date().toISOString(),
          };
        }
        return s;
      });
    });
  };

  const currentSubmission = submissions.find(
    s => s.practicalId === selectedPractical.id && s.studentId === currentUser.id
  ) || submissions.find(s => s.practicalId === selectedPractical.id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Demonstration Scenario Quick Bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-rose-400">PCCOER CONNECT DEMO BAR:</span>
          <span className="text-slate-300 hidden sm:inline">
            Active Persona: <strong className="text-white font-mono">{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Quick Switch:</span>
          <button
            onClick={() => handleSwitchRole('student')}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
              currentUser.role === 'student'
                ? 'bg-rose-900 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Student (Suraj)
          </button>

          <button
            onClick={() => handleSwitchRole('teacher')}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
              currentUser.role === 'teacher'
                ? 'bg-rose-900 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Teacher (Dr. Aarti)
          </button>

          <button
            onClick={() => handleSwitchRole('admin')}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
              currentUser.role === 'admin'
                ? 'bg-rose-900 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Admin (Dean)
          </button>
        </div>
      </div>

      {/* Main Institutional Navigation */}
      <Navbar
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onOpenLiveQuiz={() => setShowLiveQuiz(true)}
        onOpenAiAssistant={() => setShowAiModal(true)}
        onOpenSearch={() => setShowSearchModal(true)}
        onNavigateHome={() => setCurrentView('landing')}
        onNavigatePortfolio={() => setCurrentView('portfolio')}
        onNavigateAnalytics={() => setCurrentView('analytics')}
        onNavigateAdmin={() => setCurrentView('admin')}
        notifications={MOCK_NOTIFICATIONS}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Secondary Breadcrumb / Subnav if in app */}
      {currentView !== 'landing' && (
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur px-4 sm:px-6 lg:px-8 py-2.5 text-xs flex items-center justify-between text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="hover:text-rose-800 dark:hover:text-rose-400 font-semibold cursor-pointer"
            >
              Dashboard
            </button>
            <span>/</span>
            {currentView === 'subject' && (
              <span className="text-slate-900 dark:text-white font-bold">{selectedSubject.name}</span>
            )}
            {currentView === 'practical' && (
              <>
                <button
                  onClick={() => setCurrentView('subject')}
                  className="hover:text-rose-800 dark:hover:text-rose-400 cursor-pointer"
                >
                  {selectedSubject.name}
                </button>
                <span>/</span>
                <span className="text-slate-900 dark:text-white font-bold">Practical #{selectedPractical.number}</span>
              </>
            )}
            {currentView === 'portfolio' && (
              <span className="text-slate-900 dark:text-white font-bold">Academic Portfolio</span>
            )}
            {currentView === 'analytics' && (
              <span className="text-slate-900 dark:text-white font-bold">Class Analytics Console</span>
            )}
            {currentView === 'admin' && (
              <span className="text-slate-900 dark:text-white font-bold">Central Administration</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${currentView === 'dashboard' ? 'text-rose-800 dark:text-rose-400 font-bold' : ''}`}
            >
              My Dashboard
            </button>
            <span>·</span>
            <button
              onClick={() => { setSelectedSubject(MOCK_SUBJECTS[0]); setCurrentView('subject'); }}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${currentView === 'subject' ? 'text-rose-800 dark:text-rose-400 font-bold' : ''}`}
            >
              Engineering Chemistry
            </button>
            <span>·</span>
            <button
              onClick={() => { setSelectedPractical(MOCK_PRACTICALS[0]); setCurrentView('practical'); }}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${currentView === 'practical' ? 'text-rose-800 dark:text-rose-400 font-bold' : ''}`}
            >
              Virtual Lab
            </button>
          </div>
        </div>
      )}

      {/* Main Page Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentView === 'landing' && (
          <LandingPage
            subjects={MOCK_SUBJECTS}
            practicals={MOCK_PRACTICALS}
            onSelectRoleLogin={(role) => {
              handleSwitchRole(role);
              setCurrentView('dashboard');
            }}
            onExploreDirectly={() => setCurrentView('dashboard')}
            onSelectSubject={(subj) => {
              setSelectedSubject(subj);
              setCurrentView('subject');
            }}
          />
        )}

        {currentView === 'dashboard' && currentUser.role === 'student' && (
          <StudentDashboard
            currentUser={currentUser}
            subjects={MOCK_SUBJECTS}
            practicals={MOCK_PRACTICALS}
            submissions={submissions}
            assignments={MOCK_ASSIGNMENTS}
            assignmentSubmissions={assignmentSubmissions}
            notes={MOCK_NOTES}
            announcements={MOCK_ANNOUNCEMENTS}
            calendarEvents={MOCK_CALENDAR_EVENTS}
            onOpenSubject={(subj) => {
              setSelectedSubject(subj);
              setCurrentView('subject');
            }}
            onOpenPractical={(prac) => {
              setSelectedPractical(prac);
              setCurrentView('practical');
            }}
            onOpenNoteReader={(note) => setSelectedNote(note)}
            onOpenLiveQuiz={(code) => {
              setLiveQuizCode(code);
              setShowLiveQuiz(true);
            }}
            onOpenAiAssistant={() => setShowAiModal(true)}
          />
        )}

        {currentView === 'dashboard' && currentUser.role === 'teacher' && (
          <TeacherDashboard
            currentUser={currentUser}
            subjects={MOCK_SUBJECTS}
            practicals={MOCK_PRACTICALS}
            submissions={submissions}
            assignments={MOCK_ASSIGNMENTS}
            assignmentSubmissions={assignmentSubmissions}
            onOpenSubject={(subj) => {
              setSelectedSubject(subj);
              setCurrentView('subject');
            }}
            onReviewPractical={(prac, sub) => {
              setSelectedPractical(prac);
              setCurrentView('practical');
            }}
            onOpenLiveQuiz={(code) => {
              setLiveQuizCode(code);
              setShowLiveQuiz(true);
            }}
            onOpenAiAssistant={() => setShowAiModal(true)}
            onOpenAnalytics={() => setCurrentView('analytics')}
          />
        )}

        {currentView === 'dashboard' && currentUser.role === 'admin' && (
          <AdminDashboard
            departments={MOCK_DEPARTMENTS}
            subjects={MOCK_SUBJECTS}
            currentUser={currentUser}
          />
        )}

        {currentView === 'subject' && (
          <SubjectWorkspace
            subject={selectedSubject}
            currentUser={currentUser}
            notes={MOCK_NOTES.filter(n => n.subjectId === selectedSubject.id || selectedSubject.id === 'subj-chem')}
            practicals={MOCK_PRACTICALS.filter(p => p.subjectId === selectedSubject.id || selectedSubject.id === 'subj-chem')}
            submissions={submissions}
            assignments={MOCK_ASSIGNMENTS.filter(a => a.subjectId === selectedSubject.id || selectedSubject.id === 'subj-chem')}
            assignmentSubmissions={assignmentSubmissions}
            questionPapers={MOCK_QUESTION_PAPERS.filter(qp => qp.subjectId === selectedSubject.id || selectedSubject.id === 'subj-chem')}
            quizzes={MOCK_QUIZZES.filter(q => q.subjectId === selectedSubject.id || selectedSubject.id === 'subj-chem')}
            onOpenPractical={(prac) => {
              setSelectedPractical(prac);
              setCurrentView('practical');
            }}
            onOpenLiveQuiz={(code) => {
              setLiveQuizCode(code);
              setShowLiveQuiz(true);
            }}
            onOpenNoteReader={(note) => setSelectedNote(note)}
          />
        )}

        {currentView === 'practical' && (
          <DigitalPracticalJournal
            practical={selectedPractical}
            currentUser={currentUser}
            existingSubmission={currentSubmission}
            onSaveSubmission={handleSavePracticalSubmission}
            onTeacherReview={handleTeacherReview}
          />
        )}

        {currentView === 'portfolio' && (
          <StudentPortfolioView
            user={currentUser}
            submissions={submissions}
            assignments={assignmentSubmissions}
          />
        )}

        {currentView === 'analytics' && (
          <InstructorAnalytics
            analytics={MOCK_CLASS_ANALYTICS}
            practicalSubmissions={submissions}
            assignmentSubmissions={assignmentSubmissions}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            departments={MOCK_DEPARTMENTS}
            subjects={MOCK_SUBJECTS}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Floating Modals */}

      {/* Live Quiz Modal */}
      {showLiveQuiz && (
        <LiveQuizModal
          currentUser={currentUser}
          initialCode={liveQuizCode}
          onClose={() => setShowLiveQuiz(false)}
        />
      )}

      {/* PCCOER AI Assistant */}
      {showAiModal && (
        <PccoerAiAssistant
          currentUser={currentUser}
          activeSubject={selectedSubject}
          onClose={() => setShowAiModal(false)}
        />
      )}

      {/* Document / PDF Reader Modal */}
      {selectedNote && (
        <DocumentReaderModal
          note={selectedNote}
          currentUser={currentUser}
          onClose={() => setSelectedNote(null)}
          onAskAiAboutNote={(noteTitle) => {
            setSelectedNote(null);
            setShowAiModal(true);
          }}
        />
      )}

      {/* Global Search Modal */}
      {showSearchModal && (
        <GlobalSearchModal
          subjects={MOCK_SUBJECTS}
          notes={MOCK_NOTES}
          practicals={MOCK_PRACTICALS}
          assignments={MOCK_ASSIGNMENTS}
          questionPapers={MOCK_QUESTION_PAPERS}
          quizzes={MOCK_QUIZZES}
          onClose={() => setShowSearchModal(false)}
          onSelectPractical={(p) => {
            setSelectedPractical(p);
            setCurrentView('practical');
          }}
          onSelectNote={(n) => setSelectedNote(n)}
          onSelectSubject={(s) => {
            setSelectedSubject(s);
            setCurrentView('subject');
          }}
        />
      )}

      {/* Institutional Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="font-bold text-slate-800 dark:text-slate-200">
              Pimpri Chinchwad College of Engineering & Research (PCCOER)
            </div>
            <div>
              Sector 26, Pradhikaran, Nigdi / Ravet, Pune 412101 · Affiliated to Savitribai Phule Pune University (SPPU)
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono">
            <span>PCCOER CONNECT v1.0</span>
            <span>·</span>
            <span>MoE Virtual Lab Certified API</span>
            <span>·</span>
            <span>AES-256 Data Protection</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
