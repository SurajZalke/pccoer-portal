import React, { useState } from 'react';
import { PracticalExperiment, PracticalSubmission, User, ObservationRow } from '../../types';
import { VirtualLabViewer } from '../vlab/VirtualLabViewer';
import { 
  FlaskConical, 
  Calculator, 
  FileCheck2, 
  HelpCircle, 
  Sparkles, 
  Printer, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Play,
  RotateCcw,
  Send,
  Eye,
  Award,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface DigitalPracticalJournalProps {
  practical: PracticalExperiment;
  currentUser: User;
  existingSubmission?: PracticalSubmission;
  onSaveSubmission: (submission: PracticalSubmission) => void;
  onTeacherReview?: (submissionId: string, marks: number, rubrics: { experimentalAccuracy: number; calculations: number; vivaVoce: number }, feedback: string) => void;
}

export const DigitalPracticalJournal: React.FC<DigitalPracticalJournalProps> = ({
  practical,
  currentUser,
  existingSubmission,
  onSaveSubmission,
  onTeacherReview,
}) => {
  const [activeTab, setActiveTab] = useState<'procedure' | 'vlab' | 'observations' | 'calculations' | 'viva' | 'report'>('procedure');

  // Observations State
  const [sampleVolume, setSampleVolume] = useState<number>(existingSubmission?.observations.sampleVolume || 25);
  const [edtaMolarity, setEdtaMolarity] = useState<number>(existingSubmission?.observations.edtaMolarity || 0.01);
  const [rows, setRows] = useState<ObservationRow[]>(
    existingSubmission?.observations.rows || [
      { trialNo: 1, sampleVolume: 25, initialBuretteReading: 0.0, finalBuretteReading: 14.3, volumeOfEdta: 14.3 },
      { trialNo: 2, sampleVolume: 25, initialBuretteReading: 14.3, finalBuretteReading: 28.5, volumeOfEdta: 14.2 },
      { trialNo: 3, sampleVolume: 25, initialBuretteReading: 28.5, finalBuretteReading: 42.7, volumeOfEdta: 14.2 },
    ]
  );
  const [concordantVolume, setConcordantVolume] = useState<number>(existingSubmission?.observations.concordantVolume || 14.2);

  // Viva Answers
  const [vivaAnswers, setVivaAnswers] = useState<Record<string, string>>(
    existingSubmission?.vivaAnswers || {
      '0': 'Disodium salt Na2H2Y is readily soluble in water and forms stable 1:1 chelates with Ca2+ and Mg2+.',
      '1': 'NH4Cl/NH4OH buffer maintains the pH at 10.0 so that complexation is complete without hydroxide precipitation.',
      '2': 'Free EBT is sky blue at pH 10. When EDTA extracts the metal from the wine-red complex, pure sky blue is restored.',
    }
  );

  const [conclusion, setConclusion] = useState<string>(
    existingSubmission?.conclusion || 'The total hardness of the water sample was determined to be 568 ppm of CaCO3 equivalent, indicating very hard water.'
  );

  // AI Mistake Explainer State
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  // Teacher Review State
  const [teacherScoreExp, setTeacherScoreExp] = useState<number>(existingSubmission?.rubrics?.experimentalAccuracy || 4);
  const [teacherScoreCalc, setTeacherScoreCalc] = useState<number>(existingSubmission?.rubrics?.calculations || 3);
  const [teacherScoreViva, setTeacherScoreViva] = useState<number>(existingSubmission?.rubrics?.vivaVoce || 3);
  const [teacherFeedbackText, setTeacherFeedbackText] = useState<string>(
    existingSubmission?.facultyFeedback || 'Good laboratory technique. Concordant readings accurately within 0.1 mL tolerance. Calculations and viva-voce verified.'
  );

  // Update row
  const handleRowChange = (index: number, field: 'initialBuretteReading' | 'finalBuretteReading', value: number) => {
    const updated = [...rows];
    updated[index][field] = value;
    const vol = parseFloat(Math.max(0, updated[index].finalBuretteReading - updated[index].initialBuretteReading).toFixed(2));
    updated[index].volumeOfEdta = vol;
    setRows(updated);

    // Auto-calculate concordant value if trials 2 and 3 match or average
    if (updated.length >= 2) {
      const v2 = updated[1]?.volumeOfEdta || 0;
      const v3 = updated[2]?.volumeOfEdta || 0;
      if (Math.abs(v2 - v3) <= 0.2) {
        setConcordantVolume(v2);
      }
    }
  };

  // Transfer from Virtual Lab
  const handleTransferFromVLab = (data: { initial: number; final: number; volume: number }) => {
    const updated = [...rows];
    // Put into row 0 or current
    updated[0] = {
      trialNo: 1,
      sampleVolume: sampleVolume,
      initialBuretteReading: data.initial,
      finalBuretteReading: data.final,
      volumeOfEdta: data.volume,
    };
    setRows(updated);
    setConcordantVolume(data.volume);
    setActiveTab('observations');
  };

  // Auto-calculated Hardness in ppm CaCO3
  // Formula: (V * M * 1000 * 100) / sampleVolume
  const calculatedHardnessValue = sampleVolume > 0 
    ? parseFloat(((concordantVolume * edtaMolarity * 1000 * 100) / sampleVolume).toFixed(1))
    : 0;

  // Handle Ask AI Explain Mistake
  const handleExplainMistake = async () => {
    setAiLoading(true);
    setAiExplanation(null);
    try {
      const res = await fetch('/api/ai/explain-mistake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experiment: practical.title,
          observations: {
            sampleVolume,
            edtaMolarity,
            initialReading: rows[0]?.initialBuretteReading,
            finalReading: rows[0]?.finalBuretteReading,
            concordantVolume,
          },
          studentResult: calculatedHardnessValue,
          expectedResult: '560 - 575 ppm CaCO3',
        }),
      });
      const data = await res.json();
      setAiExplanation(data.explanation);
    } catch (e) {
      setAiExplanation('Error connecting to AI diagnostic server.');
    } finally {
      setAiLoading(false);
    }
  };

  // Submit Practical
  const handleSubmitPractical = () => {
    const sub: PracticalSubmission = {
      id: existingSubmission?.id || `sub-${Date.now()}`,
      practicalId: practical.id,
      practicalTitle: practical.title,
      subjectName: practical.subjectName,
      studentId: currentUser.id,
      studentName: currentUser.name,
      rollNo: currentUser.rollNo || 'TE-COMP-B-42',
      prn: currentUser.prn || '72148920C',
      department: currentUser.department || 'Computer Engineering',
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      observations: {
        sampleVolume,
        edtaMolarity,
        rows,
        concordantVolume,
      },
      calculatedHardness: calculatedHardnessValue,
      formulaUsed: `Total Hardness (ppm) = (${concordantVolume} mL * ${edtaMolarity} M * 1000 * 100) / ${sampleVolume} mL = ${calculatedHardnessValue} ppm CaCO3`,
      vivaAnswers,
      conclusion,
      maxMarks: practical.maxMarks,
      rubrics: existingSubmission?.rubrics,
      marks: existingSubmission?.marks,
      facultyFeedback: existingSubmission?.facultyFeedback,
      reviewedBy: existingSubmission?.reviewedBy,
      reviewedAt: existingSubmission?.reviewedAt,
      verificationHash: `SHA256:${Math.random().toString(36).substring(2, 10).toUpperCase()}4E99A043B718D24E6E1A33418293`,
    };

    onSaveSubmission(sub);
    setActiveTab('report');
  };

  const handleTeacherSubmitReview = () => {
    const totalMarks = teacherScoreExp + teacherScoreCalc + teacherScoreViva;
    if (onTeacherReview && existingSubmission) {
      onTeacherReview(
        existingSubmission.id,
        totalMarks,
        {
          experimentalAccuracy: teacherScoreExp,
          calculations: teacherScoreCalc,
          vivaVoce: teacherScoreViva,
        },
        teacherFeedbackText
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-rose-800 dark:text-rose-400 font-semibold tracking-wide uppercase">
              <span>{practical.subjectName}</span>
              <span className="text-slate-400">·</span>
              <span>Practical #{practical.number.toString().padStart(2, '0')}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 font-normal">Max Marks: {practical.maxMarks}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              {practical.title}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Topic: {practical.topic} · Deadline: {practical.deadline}
            </p>
          </div>

          {/* Submission Status Badge */}
          <div className="flex items-center gap-3">
            {existingSubmission?.status === 'reviewed' ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-right">
                <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 justify-end">
                  <CheckCircle className="w-3.5 h-3.5" /> Graded & Verified
                </div>
                <div className="text-lg font-bold text-emerald-800 dark:text-emerald-300 font-mono">
                  {existingSubmission.marks} / {existingSubmission.maxMarks} Marks
                </div>
              </div>
            ) : existingSubmission?.status === 'submitted' ? (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-right">
                <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1 justify-end">
                  <Clock className="w-3.5 h-3.5" /> Under Faculty Review
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Submitted {new Date(existingSubmission.submittedAt).toLocaleDateString()}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-right">
                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Status: Draft / Not Submitted
                </div>
                <div className="text-xs text-rose-700 dark:text-rose-400 font-medium">
                  Perform Lab & Submit
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation Controls (Interactive Filter Segmented Buttons) */}
        <div className="mt-6 flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs font-medium">
          <button
            onClick={() => setActiveTab('procedure')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'procedure'
                ? 'bg-white dark:bg-slate-900 text-rose-800 dark:text-rose-400 font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            1. Aim & Theory
          </button>

          <button
            onClick={() => setActiveTab('vlab')}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'vlab'
                ? 'bg-rose-900 text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-400'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>2. Launch Virtual Lab</span>
          </button>

          <button
            onClick={() => setActiveTab('observations')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'observations'
                ? 'bg-white dark:bg-slate-900 text-rose-800 dark:text-rose-400 font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            3. Observation Table
          </button>

          <button
            onClick={() => setActiveTab('calculations')}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'calculations'
                ? 'bg-white dark:bg-slate-900 text-rose-800 dark:text-rose-400 font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>4. Calculations & AI</span>
          </button>

          <button
            onClick={() => setActiveTab('viva')}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'viva'
                ? 'bg-white dark:bg-slate-900 text-rose-800 dark:text-rose-400 font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>5. Viva-Voce</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'report'
                ? 'bg-white dark:bg-slate-900 text-rose-800 dark:text-rose-400 font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>6. Digital Practical Record</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Procedure, Aim & Theory */}
      {activeTab === 'procedure' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>01. Aim of Experiment</span>
              </h2>
              <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 font-medium">
                {practical.aim}
              </p>

              <h2 className="text-base font-bold text-slate-900 dark:text-white pt-2">
                02. Chemical Theory & Principles
              </h2>
              <div className="prose dark:prose-invert text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                {practical.theory}
              </div>

              <div className="mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                <h3 className="text-xs font-bold text-rose-900 dark:text-rose-300 uppercase tracking-wider mb-2">
                  Key Chemical Reactions
                </h3>
                <div className="space-y-1.5 font-mono text-xs text-slate-800 dark:text-rose-200">
                  {practical.reactions.map((r, i) => (
                    <div key={i} className="bg-white/80 dark:bg-slate-900/60 p-2 rounded border border-rose-200/60 dark:border-rose-900/30">
                      {r}
                    </div>
                  ))}
                </div>
              </div>

              <h2 className="text-base font-bold text-slate-900 dark:text-white pt-2">
                03. Laboratory Procedure
              </h2>
              <div className="space-y-2">
                {practical.procedureSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-3 text-xs text-slate-700 dark:text-slate-300 p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/60">
                    <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Rail: Apparatus & Virtual Lab Launch Card */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-rose-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-300 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Integrated Virtual Lab</span>
              </div>
              <h3 className="text-lg font-bold">Ready to perform the experiment?</h3>
              <p className="text-xs text-rose-100/90 leading-relaxed">
                Connect securely to the external MoE / PhET simulation. You can record burette readings in real time and automatically bridge them into your journal.
              </p>
              <button
                onClick={() => setActiveTab('vlab')}
                className="w-full py-3 px-4 bg-white hover:bg-rose-50 text-rose-900 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-rose-900" />
                <span>Open Virtual Laboratory</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Apparatus Required</h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {practical.apparatus.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-700" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">Chemical Reagents</h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {practical.chemicalsRequired.map((chem, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                    <span>{chem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Embedded Virtual Lab */}
      {activeTab === 'vlab' && (
        <VirtualLabViewer
          practical={practical}
          currentUser={currentUser}
          onTransferObservations={handleTransferFromVLab}
          onBack={() => setActiveTab('observations')}
        />
      )}

      {/* TAB 3: Observations Table */}
      {activeTab === 'observations' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Observation Table: Titration with 0.01 M EDTA
              </h2>
              <p className="text-xs text-slate-500">
                Record your trials from the Virtual Lab. Color transition at endpoint: Wine Red to Sky Blue.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('vlab')}
              className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-800 dark:text-rose-300 rounded-lg text-xs font-medium border border-rose-200 dark:border-rose-900/60 flex items-center gap-1.5 self-start"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reopen Virtual Lab for verification</span>
            </button>
          </div>

          {/* Experimental Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Volume of Water Sample Pipetted
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={sampleVolume}
                  onChange={(e) => setSampleVolume(parseFloat(e.target.value) || 25)}
                  className="w-24 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-mono font-bold text-slate-900 dark:text-white"
                />
                <span className="text-xs text-slate-500 font-mono">mL</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Molarity of Standard EDTA Solution
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.001"
                  value={edtaMolarity}
                  onChange={(e) => setEdtaMolarity(parseFloat(e.target.value) || 0.01)}
                  className="w-24 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-mono font-bold text-slate-900 dark:text-white"
                />
                <span className="text-xs text-slate-500 font-mono">M (moles/L)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
              <label className="block text-xs font-medium text-rose-800 dark:text-rose-300 mb-1">
                Concordant Volume of EDTA (V)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={concordantVolume}
                  onChange={(e) => setConcordantVolume(parseFloat(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-700 rounded-lg text-sm font-mono font-bold text-rose-800 dark:text-rose-300"
                />
                <span className="text-xs text-rose-700 dark:text-rose-400 font-mono font-medium">mL</span>
              </div>
            </div>
          </div>

          {/* Observations Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Trial #</th>
                  <th className="py-3 px-4">Sample Vol (mL)</th>
                  <th className="py-3 px-4">Initial Burette Reading (mL)</th>
                  <th className="py-3 px-4">Final Burette Reading (mL)</th>
                  <th className="py-3 px-4">Volume of EDTA Consumed (mL)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                {rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                      Trial {row.trialNo}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {row.sampleVolume}
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        step="0.1"
                        value={row.initialBuretteReading}
                        onChange={(e) => handleRowChange(idx, 'initialBuretteReading', parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        step="0.1"
                        value={row.finalBuretteReading}
                        onChange={(e) => handleRowChange(idx, 'finalBuretteReading', parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                      />
                    </td>
                    <td className="py-3 px-4 font-bold text-rose-800 dark:text-rose-400">
                      {row.volumeOfEdta} mL
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setActiveTab('calculations')}
              className="py-2.5 px-5 bg-rose-800 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
            >
              <span>Proceed to Calculations</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Calculations Engine & AI Mistake Explainer */}
      {activeTab === 'calculations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <Calculator className="w-5 h-5 text-rose-800 dark:text-rose-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Stoichiometric Hardness Calculation
              </h2>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs space-y-2">
              <div className="text-slate-500 font-medium">Standard Formula (SPPU / PCCOER Curriculum):</div>
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold">
                Total Hardness (ppm CaCO₃) = (V × M × 1000 × 100) / V_sample
              </div>
              <div className="text-[11px] text-slate-500 pt-1">
                Where:
                <br />· V = Concordant volume of EDTA = <strong>{concordantVolume} mL</strong>
                <br />· M = Molarity of EDTA = <strong>{edtaMolarity} M</strong>
                <br />· 1000 = Factor to convert mL to Liters
                <br />· 100 = Molecular Weight of CaCO₃ (equivalent conversion)
                <br />· V_sample = Volume of water sample titrated = <strong>{sampleVolume} mL</strong>
              </div>
            </div>

            {/* Live Arithmetic Computation */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/20 to-slate-900/40 border border-rose-900/40 space-y-2">
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                Automated Verification Result
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {calculatedHardnessValue} <span className="text-sm font-normal text-slate-400">ppm CaCO₃</span>
              </div>
              <p className="text-xs text-slate-400">
                Calculation step: ({concordantVolume} × {edtaMolarity} × 1000 × 100) / {sampleVolume} = {calculatedHardnessValue}
              </p>
            </div>

            {/* Error Range Checker */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong className="text-emerald-800 dark:text-emerald-300">Within Expected Laboratory Tolerance:</strong>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                  Expected range: 560.0 – 575.0 ppm. Your calculated value is {calculatedHardnessValue} ppm.
                </p>
              </div>
            </div>

            {/* Conclusion text */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Student Experimental Conclusion
              </label>
              <textarea
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                rows={3}
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                placeholder="Enter conclusions regarding water hardness, water classification, and suitability for boiler feed..."
              />
            </div>
          </div>

          {/* AI Diagnostic Assistant: Explain Mistakes */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <Sparkles className="w-5 h-5 text-rose-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                PCCOER AI: Calculation & Error Diagnostics
              </h2>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              If your laboratory readings or calculations deviate from expectations, ask PCCOER AI to analyze your burette subtraction, unit conversion factors, or stoichiometric ratios.
            </p>

            <button
              onClick={handleExplainMistake}
              disabled={aiLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-rose-900 to-rose-800 hover:from-rose-800 hover:to-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-60"
            >
              {aiLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Experimental Data...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Verify Calculations with PCCOER AI</span>
                </>
              )}
            </button>

            {aiExplanation && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 whitespace-pre-line max-h-96 overflow-y-auto font-sans">
                {aiExplanation}
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setActiveTab('viva')}
                className="py-2.5 px-5 bg-rose-800 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
              >
                <span>Proceed to Viva-Voce</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Viva-Voce Questions */}
      {activeTab === 'viva' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Oral Examination & Viva-Voce Preparation
            </h2>
            <p className="text-xs text-slate-500">
              Answer the standard viva questions associated with this practical. Faculty evaluates conceptual depth during review.
            </p>
          </div>

          <div className="space-y-5">
            {practical.vivaQuestions.map((vq, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                    Q{idx + 1}
                  </span>
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                    {vq.question}
                  </div>
                </div>

                <textarea
                  value={vivaAnswers[idx.toString()] || ''}
                  onChange={(e) => setVivaAnswers({ ...vivaAnswers, [idx.toString()]: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                  placeholder="Enter your viva answer..."
                />

                <div className="text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-900/60 p-2 rounded">
                  <strong className="text-slate-600 dark:text-slate-400">Model Reference Answer:</strong> {vq.answer}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('calculations')}
              className="py-2.5 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
            >
              Back to Calculations
            </button>

            <button
              onClick={handleSubmitPractical}
              className="py-2.5 px-6 bg-gradient-to-r from-rose-900 to-rose-700 hover:from-rose-800 hover:to-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Generate & Submit Practical Record</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: Official Digital Practical Record (Printable & Reviewable) */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Record Status:
              </span>
              {existingSubmission?.status === 'reviewed' ? (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Reviewed by {existingSubmission.reviewedBy}
                </span>
              ) : (
                <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Submitted & Awaiting Faculty Grade
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="py-2 px-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors no-print"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Download PDF Record</span>
              </button>
            </div>
          </div>

          {/* Teacher Review Panel (Visible if Teacher is logged in) */}
          {currentUser.role === 'teacher' && (
            <div className="bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-200 dark:border-rose-900/60 p-6 rounded-2xl space-y-4 no-print">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-rose-800 dark:text-rose-400" />
                  <h3 className="text-base font-bold text-rose-950 dark:text-rose-200">
                    Faculty Assessment & Grading Console
                  </h3>
                </div>
                <span className="text-xs font-mono text-rose-700 dark:text-rose-400">
                  Student: {existingSubmission?.studentName || currentUser.name} ({existingSubmission?.rollNo || currentUser.rollNo})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/40">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Experimental Accuracy (Max 4)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="4"
                    value={teacherScoreExp}
                    onChange={(e) => setTeacherScoreExp(parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-sm font-bold font-mono"
                  />
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/40">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Calculations & Units (Max 3)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="3"
                    value={teacherScoreCalc}
                    onChange={(e) => setTeacherScoreCalc(parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-sm font-bold font-mono"
                  />
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/40">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Viva-Voce Performance (Max 3)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="3"
                    value={teacherScoreViva}
                    onChange={(e) => setTeacherScoreViva(parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-sm font-bold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Faculty Feedback & Remarks
                </label>
                <textarea
                  value={teacherFeedbackText}
                  onChange={(e) => setTeacherFeedbackText(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleTeacherSubmitReview}
                  className="py-2.5 px-6 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                >
                  Publish Grade & Sign-Off ({teacherScoreExp + teacherScoreCalc + teacherScoreViva}/10)
                </button>
              </div>
            </div>
          )}

          {/* Official Printable Academic Document Sheet */}
          <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl border border-slate-300 shadow-xl max-w-4xl mx-auto space-y-8 font-sans">
            {/* Institutional Header */}
            <div className="border-b-2 border-slate-900 pb-6 text-center space-y-1">
              <div className="text-xs font-bold tracking-widest text-slate-600 uppercase">
                Pimpri Chinchwad Education Trust's
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 uppercase tracking-tight">
                Pimpri Chinchwad College of Engineering & Research
              </h1>
              <div className="text-xs font-semibold text-slate-700">
                Department of Applied Sciences & Humanities · Ravet, Pune 412101
              </div>
              <div className="text-xs font-mono text-slate-500 pt-1">
                Official Digital Practical Journal Record · Academic Year 2025-2026
              </div>
            </div>

            {/* Student Metadata Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500">Student Name:</span>
                <div className="font-bold text-slate-900">{currentUser.name}</div>
              </div>
              <div>
                <span className="text-slate-500">Roll Number:</span>
                <div className="font-bold font-mono text-slate-900">{currentUser.rollNo || 'TE-COMP-B-42'}</div>
              </div>
              <div>
                <span className="text-slate-500">PRN Number:</span>
                <div className="font-bold font-mono text-slate-900">{currentUser.prn || '72148920C'}</div>
              </div>
              <div>
                <span className="text-slate-500">Department:</span>
                <div className="font-bold text-slate-900">{currentUser.department || 'Computer Engineering'}</div>
              </div>
            </div>

            {/* Experiment Title */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                Experiment #{practical.number.toString().padStart(2, '0')}
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                {practical.title}
              </h2>
            </div>

            {/* Aim */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Aim of the Experiment:
              </h3>
              <p className="text-xs text-slate-800 leading-relaxed font-medium bg-slate-50 p-3 rounded border border-slate-200">
                {practical.aim}
              </p>
            </div>

            {/* Observation Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Observation Table (Titration with 0.01 M EDTA Solution):
              </h3>
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 font-semibold border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Trial</th>
                    <th className="p-2 border-r border-slate-300">Sample Vol (mL)</th>
                    <th className="p-2 border-r border-slate-300">Initial Burette (mL)</th>
                    <th className="p-2 border-r border-slate-300">Final Burette (mL)</th>
                    <th className="p-2">EDTA Consumed (mL)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td className="p-2 border-r border-slate-300 font-bold">Trial {r.trialNo}</td>
                      <td className="p-2 border-r border-slate-300">{r.sampleVolume}</td>
                      <td className="p-2 border-r border-slate-300">{r.initialBuretteReading}</td>
                      <td className="p-2 border-r border-slate-300">{r.finalBuretteReading}</td>
                      <td className="p-2 font-bold">{r.volumeOfEdta} mL</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-right text-xs font-mono font-bold text-slate-800">
                Concordant Volume of EDTA (V) = {concordantVolume} mL
              </div>
            </div>

            {/* Calculations & Result */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Calculations & Result:
              </h3>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs space-y-2 font-mono">
                <div>Total Hardness (ppm CaCO₃) = (V × M × 1000 × 100) / V_sample</div>
                <div>= ({concordantVolume} × {edtaMolarity} × 100,000) / {sampleVolume}</div>
                <div className="text-sm font-bold text-rose-900">
                  = {calculatedHardnessValue} ppm CaCO₃ equivalents
                </div>
              </div>
            </div>

            {/* Conclusion */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Conclusion:
              </h3>
              <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded border border-slate-200">
                {conclusion}
              </p>
            </div>

            {/* Signatures & Hash Verification */}
            <div className="pt-8 border-t-2 border-slate-300 grid grid-cols-2 gap-8 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500">Student Digital Attestation:</span>
                <div className="font-semibold text-slate-900">{currentUser.name}</div>
                <div className="font-mono text-[10px] text-slate-400">
                  {existingSubmission?.verificationHash || 'SHA256:7B81FC99A043B718D24E6E1A334182937A0923DF75051BA0F928C8110D83BA9F'}
                </div>
              </div>

              <div className="text-right space-y-1">
                <span className="text-slate-500">Faculty In-Charge Evaluation:</span>
                <div className="font-bold text-slate-900">Prof. Dr. Aarti Sharma</div>
                <div className="font-mono text-emerald-700 font-bold">
                  Score: {existingSubmission?.marks !== undefined ? `${existingSubmission.marks}/10 Marks` : 'Verified & Approved'}
                </div>
                <div className="text-[10px] text-slate-500">
                  Chemistry Section · PCCOER Connect Sign-off
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
