import React, { useState } from 'react';
import { User, Subject } from '../../types';
import { 
  Sparkles, 
  Send, 
  BookOpen, 
  HelpCircle, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Copy, 
  Check, 
  Lightbulb, 
  X,
  ShieldCheck,
  Bot
} from 'lucide-react';

interface PccoerAiAssistantProps {
  currentUser: User;
  activeSubject?: Subject;
  onClose: () => void;
  onInsertToNotes?: (content: string) => void;
}

export const PccoerAiAssistant: React.FC<PccoerAiAssistantProps> = ({
  currentUser,
  activeSubject,
  onClose,
  onInsertToNotes,
}) => {
  const isTeacher = currentUser.role === 'teacher' || currentUser.role === 'admin';
  const [activeTab, setActiveTab] = useState<'ask' | 'revision' | 'teacher'>(
    isTeacher ? 'teacher' : 'ask'
  );

  // Student Q&A state
  const [query, setQuery] = useState<string>('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; source?: string; time: string }>>([
    {
      role: 'assistant',
      text: `Hello ${currentUser.name}! I am PCCOER AI, trained on the official PCCOER engineering syllabi, laboratory manuals, and lecture notes. How can I assist your learning today in ${activeSubject?.name || 'Engineering'}?`,
      source: 'PCCOER Curricular Knowledge Base',
      time: 'Just now'
    }
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  // Teacher generator state
  const [teacherGenType, setTeacherGenType] = useState<'mcq' | 'viva_questions' | 'summary'>('viva_questions');
  const [teacherTopic, setTeacherTopic] = useState<string>('Hardness of Water by EDTA Titration');
  const [teacherDifficulty, setTeacherDifficulty] = useState<string>('Moderate');
  const [teacherGeneratedContent, setTeacherGeneratedContent] = useState<string>('');
  const [teacherLoading, setTeacherLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Quick suggestions for student
  const quickPrompts = [
    'Explain the role of EBT indicator and why it turns wine red to sky blue.',
    'Why is NH4OH + NH4Cl buffer maintained strictly at pH 10 in EDTA titration?',
    'What is the difference between temporary and permanent hardness of water?',
    'Derive the formula used to calculate total hardness in ppm of CaCO3.',
  ];

  // Send student question to server-side Gemini API
  const handleSendQuery = async (customPrompt?: string) => {
    const qText = customPrompt || query;
    if (!qText.trim()) return;

    const newMsgs = [...messages, { role: 'user' as const, text: qText, time: 'Just now' }];
    setMessages(newMsgs);
    if (!customPrompt) setQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: qText,
          subject: activeSubject?.name || 'Engineering Chemistry',
          studentRoll: currentUser.rollNo,
          contextNotes: 'Module 1 Water Technology, EDTA Stoichiometry, SPPU 2024 Course Pattern',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([
          ...newMsgs,
          {
            role: 'assistant',
            text: data.answer,
            source: data.source,
            time: 'Just now'
          }
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          text: 'Temporary network disconnect while reaching PCCOER AI. Please verify your query or check your syllabus notes.',
          time: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Teacher generator trigger
  const handleTeacherGenerate = async () => {
    setTeacherLoading(true);
    try {
      const res = await fetch('/api/ai/teacher-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: teacherGenType,
          topic: teacherTopic,
          subject: activeSubject?.name || 'Engineering Chemistry',
          difficulty: teacherDifficulty,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTeacherGeneratedContent(data.content);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTeacherLoading(false);
    }
  };

  const copyContent = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col h-[85vh] max-h-[750px] overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-900 to-rose-600 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider">
                  PCCOER Academic Intelligence
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Grounded in Authorized Syllabi
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                PCCOER AI Assistant
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Segmented Tab Controls */}
            <div className="flex items-center bg-slate-200 dark:bg-slate-800 rounded-xl p-1 text-xs font-medium">
              <button
                onClick={() => setActiveTab('ask')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'ask'
                    ? 'bg-white dark:bg-slate-900 text-rose-800 dark:text-rose-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Subject Q&A
              </button>

              <button
                onClick={() => setActiveTab('revision')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'revision'
                    ? 'bg-white dark:bg-slate-900 text-rose-800 dark:text-rose-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Revision Flashcards
              </button>

              {isTeacher && (
                <button
                  onClick={() => setActiveTab('teacher')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'teacher'
                      ? 'bg-white dark:bg-slate-900 text-rose-800 dark:text-rose-400 font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Faculty Generator
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab 1: Student Q&A Grounded Chat */}
        {activeTab === 'ask' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Institutional Guardrail Banner */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  <strong>Academic Policy:</strong> PCCOER AI answers queries using authorized course manuals. Official exam timetables and administrative notices are only published through official PCCOER ERP circulars.
                </span>
              </div>

              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-rose-900 text-white font-medium rounded-tr-sm'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 rounded-tl-sm space-y-2 whitespace-pre-line'
                    }`}
                  >
                    {msg.text}

                    {msg.source && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700/50 flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Source: {msg.source}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 p-3 bg-slate-100 dark:bg-slate-800/40 rounded-xl w-fit">
                  <div className="w-3.5 h-3.5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                  <span>Consulting PCCOER Subject Repository & Synthesizing...</span>
                </div>
              )}
            </div>

            {/* Quick Prompts Bar */}
            <div className="px-6 py-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto text-[11px] text-slate-600 dark:text-slate-400">
              <span className="shrink-0 py-1 font-semibold text-rose-800 dark:text-rose-400">Topics:</span>
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSendQuery(p)}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-400 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer text-left"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
                placeholder={`Ask an academic question about ${activeSubject?.name || 'Engineering Chemistry'}...`}
                className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
              />
              <button
                onClick={() => handleSendQuery()}
                disabled={loading || !query.trim()}
                className="p-2.5 bg-rose-900 hover:bg-rose-800 disabled:opacity-50 text-white rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Revision Flashcards */}
        {activeTab === 'revision' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Exam Revision Summaries & Viva Flashcards
              </h3>
              <p className="text-xs text-slate-500">
                Curated high-yield study cards synthesized from PCCOER unit test and end-sem recurring question patterns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-rose-800 dark:text-rose-400 tracking-wider">
                  Flashcard #01 · High Yield
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Why is Disodium EDTA chosen over Free EDTA acid?
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Free EDTA acid is only sparingly soluble in water due to strong intra-molecular hydrogen bonding. Disodium salt (Na₂H₂Y·2H₂O) ionizes into water-soluble Na⁺ and H₂Y²⁻ ions, reacting instantaneously with Ca²⁺ / Mg²⁺ ions.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-rose-800 dark:text-rose-400 tracking-wider">
                  Flashcard #02 · Viva Voce
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Endpoint Indicator Transition Mechanism
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  At pH 10, free Eriochrome Black T is <strong>sky blue</strong>. Adding it to hard water forms an unstable wine-red [M-EBT] complex. During titration, EDTA displaces EBT due to higher chelate stability, restoring the clear <strong>sky blue</strong> color at endpoint.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-rose-800 dark:text-rose-400 tracking-wider">
                  Flashcard #03 · Numerical Formula
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Hardness Expression in CaCO₃ Equivalents
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-mono">
                  Hardness (ppm) = (Vol EDTA in mL × Molarity EDTA × 1000 × 100) / (Vol Sample in mL)
                  <br />
                  <span className="text-[11px] text-slate-500 font-sans">
                    1 ppm = 1 mg CaCO₃ per liter of water. Molecular weight of CaCO₃ is 100 g/mol.
                  </span>
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-rose-800 dark:text-rose-400 tracking-wider">
                  Flashcard #04 · Water Softening
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Ion Exchange vs Zeolite Permutit Method
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Zeolite softening removes only hardness-causing cations (Ca²⁺, Mg²⁺) replacing them with Na⁺, leaving dissolved solids high. Ion-exchange demineralization removes both cations and anions, producing pure conductivity-free demineralized water for high-pressure boilers.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Teacher Content Generator (Review Before Publish Workflow) */}
        {activeTab === 'teacher' && isTeacher && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-300">
              <strong>Faculty Content Review Guard:</strong> AI-generated content is saved as drafts for faculty review. Instructors must edit and approve all generated questions or summaries before publishing them to students.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Generation Type
                </label>
                <select
                  value={teacherGenType}
                  onChange={(e: any) => setTeacherGenType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                >
                  <option value="viva_questions">Viva-Voce Questions with Model Answers</option>
                  <option value="mcq">Unit Test / Live Quiz MCQs with Distractors</option>
                  <option value="summary">Modular Syllabus Revision Summary</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topic / Subtopic
                </label>
                <input
                  type="text"
                  value={teacherTopic}
                  onChange={(e) => setTeacherTopic(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                  placeholder="e.g. Conductometric Titrations"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Rigor
                </label>
                <select
                  value={teacherDifficulty}
                  onChange={(e) => setTeacherDifficulty(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                >
                  <option value="Fundamental">Fundamental (Bloom Level 1-2)</option>
                  <option value="Moderate">Moderate / SPPU In-Sem Pattern</option>
                  <option value="Advanced">Advanced Numerical & Analytical</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleTeacherGenerate}
              disabled={teacherLoading}
              className="py-2.5 px-6 bg-rose-900 hover:bg-rose-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-colors cursor-pointer"
            >
              {teacherLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Drafting Curriculum Content...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Syllabus-Aligned Draft</span>
                </>
              )}
            </button>

            {teacherGeneratedContent && (
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Draft Preview (Ready for Faculty Review)
                  </span>
                  <button
                    onClick={() => copyContent(teacherGeneratedContent)}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Draft'}</span>
                  </button>
                </div>

                <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans whitespace-pre-line bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 max-h-72 overflow-y-auto">
                  {teacherGeneratedContent}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
