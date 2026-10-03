import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { User } from '../../types';
import { 
  Trophy, 
  Users, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Play, 
  RotateCcw, 
  QrCode as QrIcon, 
  Share2, 
  Check, 
  Award,
  BarChart3,
  X
} from 'lucide-react';

interface LiveQuizModalProps {
  currentUser: User;
  onClose: () => void;
  initialCode?: string;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Participant {
  id: string;
  name: string;
  rollNo: string;
  score: number;
  answers: Record<number, number>;
  lastAnsweredAt?: number;
}

interface RoomData {
  code: string;
  title: string;
  subject: string;
  teacherName: string;
  status: 'waiting' | 'active' | 'completed';
  currentQuestionIndex: number;
  timePerQuestion: number;
  questions: Question[];
  participants: Participant[];
}

export const LiveQuizModal: React.FC<LiveQuizModalProps> = ({
  currentUser,
  onClose,
  initialCode = 'CHEM26',
}) => {
  const [quizCode, setQuizCode] = useState<string>(initialCode);
  const [room, setRoom] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(25);

  // Student specific state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [answerFeedback, setAnswerFeedback] = useState<{
    correct: boolean;
    correctIndex: number;
    explanation: string;
  } | null>(null);

  const isTeacher = currentUser.role === 'teacher' || currentUser.role === 'admin';

  // Fetch or sync room state
  const fetchRoom = async () => {
    try {
      const res = await fetch(`/api/live-quiz/room/${quizCode}`);
      if (res.ok) {
        const data = await res.json();
        setRoom(data.room);
      }
    } catch (e) {
      console.warn('Live quiz poll error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoom();
    // Poll room state every 1.5 seconds for realtime experience
    const interval = setInterval(fetchRoom, 1500);
    return () => clearInterval(interval);
  }, [quizCode]);

  // Generate QR code for joining
  useEffect(() => {
    const joinUrl = `${window.location.origin}?joinQuiz=${quizCode}`;
    QRCode.toDataURL(joinUrl, { width: 220, margin: 2, color: { dark: '#0F172A', light: '#FFFFFF' } })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error(err));
  }, [quizCode]);

  // Timer countdown
  useEffect(() => {
    if (room?.status !== 'active') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [room?.status, room?.currentQuestionIndex]);

  // Reset answer when question changes
  useEffect(() => {
    setSelectedOption(null);
    setHasAnswered(false);
    setAnswerFeedback(null);
    setTimeLeft(room?.timePerQuestion || 25);
  }, [room?.currentQuestionIndex]);

  // Teacher Controls
  const handleRoomControl = async (action: 'start' | 'next' | 'end' | 'reset') => {
    try {
      const res = await fetch('/api/live-quiz/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: quizCode, action }),
      });
      if (res.ok) {
        const data = await res.json();
        setRoom(data.room);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Student Submit Answer
  const handleStudentAnswer = async (optionIndex: number) => {
    if (hasAnswered || !room || room.status !== 'active') return;
    setSelectedOption(optionIndex);
    setHasAnswered(true);

    try {
      const res = await fetch('/api/live-quiz/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: quizCode,
          rollNo: currentUser.rollNo || 'TE-COMP-B-42',
          questionIndex: room.currentQuestionIndex,
          selectedOptionIndex: optionIndex,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnswerFeedback({
          correct: data.correct,
          correctIndex: data.correctIndex,
          explanation: data.explanation,
        });
        fetchRoom();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Student Join Room
  const handleJoinAsStudent = async () => {
    try {
      const res = await fetch('/api/live-quiz/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: quizCode,
          studentName: currentUser.name,
          rollNo: currentUser.rollNo || 'TE-COMP-B-42',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setRoom(data.room);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const currentQ = room?.questions[room.currentQuestionIndex];
  const participants = room?.participants || [];
  const sortedLeaderboard = [...participants].sort((a, b) => b.score - a.score);

  // Stats on answers for current question
  const answeredCount = participants.filter(p => p.answers[room?.currentQuestionIndex ?? 0] !== undefined).length;
  const unansweredCount = Math.max(0, participants.length - answeredCount);

  // Distribution of options A, B, C, D
  const optionCounts = [0, 0, 0, 0];
  participants.forEach(p => {
    const ans = p.answers[room?.currentQuestionIndex ?? 0];
    if (ans !== undefined && ans >= 0 && ans < 4) {
      optionCounts[ans]++;
    }
  });

  const copyShareLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}?joinQuiz=${quizCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Top Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-900 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-950/50">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
                  PCCOER Live Arena
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400">{room?.subject || 'Engineering Chemistry'}</span>
              </div>
              <h2 className="text-base font-bold text-white">
                {room?.title || 'Live Challenge'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Join Code Badge */}
            <div className="bg-slate-900 border border-slate-700/80 px-4 py-1.5 rounded-xl flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Quiz Code</span>
              <span className="font-mono font-extrabold text-rose-400 tracking-wider text-sm sm:text-base">
                {quizCode}
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Arena */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-400">Connecting to PCCOER Live Quiz Server...</p>
            </div>
          ) : room?.status === 'waiting' ? (
            /* WAITING LOBBY */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-4">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/40 border border-rose-900/60 text-rose-400 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    Lobby Open · Waiting for Host to Begin
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {room.title}
                  </h1>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Host: {room.teacherName} · Scan QR Code with any phone camera or enter code{' '}
                    <strong className="text-white font-mono">{quizCode}</strong> on your PCCOER CONNECT dashboard.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={copyShareLink}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                    <span>{copied ? 'Link Copied!' : 'Copy Direct Join Link'}</span>
                  </button>

                  {!isTeacher && !participants.some(p => p.rollNo === currentUser.rollNo) && (
                    <button
                      onClick={handleJoinAsStudent}
                      className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-rose-800 to-rose-600 hover:from-rose-700 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950/60 transition-all cursor-pointer"
                    >
                      Join Quiz as {currentUser.name}
                    </button>
                  )}

                  {isTeacher && (
                    <button
                      onClick={() => handleRoomControl('start')}
                      className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-rose-800 to-rose-600 hover:from-rose-700 hover:to-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-950/60 transition-all cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Start Live Challenge Now</span>
                    </button>
                  )}
                </div>

                {/* Connected Students List */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium flex items-center gap-2">
                      <Users className="w-4 h-4 text-rose-400" /> Connected Students ({participants.length})
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400">Live Pinging</span>
                  </div>

                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
                    {participants.map((p, i) => (
                      <div
                        key={i}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center gap-2 text-slate-300"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="font-medium">{p.name}</span>
                        <span className="text-[10px] font-mono text-slate-500">({p.rollNo})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* QR Code Presentation Display */}
              <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-3xl border border-slate-800/80 text-center space-y-4">
                <div className="p-3 bg-white rounded-2xl shadow-xl">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="Live Quiz QR Code" className="w-48 h-48 rounded-lg" />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center text-slate-400">
                      <QrIcon className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Join via Code</div>
                  <div className="text-3xl font-black font-mono tracking-widest text-rose-400 mt-1">
                    {quizCode}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Open PCCOER CONNECT → Live Quiz
                  </div>
                </div>
              </div>
            </div>
          ) : room?.status === 'active' && currentQ ? (
            /* ACTIVE QUIZ QUESTION SCREEN */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Question Info Bar */}
                <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-rose-950/60 border border-rose-900 text-rose-300 rounded-lg text-xs font-bold font-mono">
                      Q {room.currentQuestionIndex + 1} of {room.questions.length}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">100 Points</span>
                  </div>

                  {/* Countdown Timer Ring */}
                  <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-sm bg-rose-950/30 px-3 py-1 rounded-xl border border-rose-900/40">
                    <Clock className="w-4 h-4" />
                    <span>{timeLeft}s remaining</span>
                  </div>
                </div>

                {/* Question Text */}
                <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800">
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                    {currentQ.question}
                  </h3>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQ.options.map((option, idx) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    const isSelected = selectedOption === idx;
                    const showResult = answerFeedback !== null || (isTeacher && answeredCount === participants.length);
                    const isCorrect = idx === currentQ.correctIndex;

                    let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700';

                    if (isSelected) {
                      btnStyle = 'bg-rose-950/40 border-rose-600 text-white';
                    }

                    if (showResult) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-semibold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-red-950/40 border-red-500 text-red-200';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleStudentAnswer(idx)}
                        disabled={hasAnswered || isTeacher}
                        className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer disabled:cursor-default ${btnStyle}`}
                      >
                        <span className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-xs font-mono font-bold text-slate-400">
                          {letters[idx]}
                        </span>
                        <div className="flex-1 text-xs sm:text-sm pt-0.5 leading-relaxed">
                          {option}
                        </div>
                        {showResult && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Real-time Response Statistics Bar (Answered vs Not Answered) */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <BarChart3 className="w-4 h-4 text-rose-400" />
                      Class Real-Time Responses:
                    </span>
                    <span className="font-mono text-white font-bold">
                      {answeredCount} / {participants.length} Students Answered
                    </span>
                  </div>

                  <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden flex border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-rose-800 to-rose-500 h-full transition-all duration-500"
                      style={{ width: `${(answeredCount / Math.max(1, participants.length)) * 100}%` }}
                    />
                  </div>

                  {/* Choice Distribution */}
                  <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                    {['A', 'B', 'C', 'D'].map((letter, i) => (
                      <div key={i} className="p-2 bg-slate-900/60 rounded-lg border border-slate-800/80">
                        <div className="text-[10px] text-slate-500 font-mono">Option {letter}</div>
                        <div className="font-bold text-white font-mono">{optionCounts[i]} votes</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation Reveal */}
                {answerFeedback && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Conceptual Explanation
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {answerFeedback.explanation}
                    </p>
                  </div>
                )}

                {/* Teacher Question Progression Controls */}
                {isTeacher && (
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleRoomControl('next')}
                      className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-rose-800 to-rose-600 hover:from-rose-700 hover:to-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                    >
                      <span>
                        {room.currentQuestionIndex < room.questions.length - 1 ? 'Next Question' : 'Finish & Reveal Results'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Right Side: Real-Time Live Leaderboard */}
              <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Live Leaderboard
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">Real-Time</span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {sortedLeaderboard.slice(0, 7).map((p, idx) => (
                      <div
                        key={p.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                          p.rollNo === currentUser.rollNo
                            ? 'bg-rose-950/30 border-rose-700 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs font-mono ${
                              idx === 0
                                ? 'bg-amber-400 text-slate-950'
                                : idx === 1
                                ? 'bg-slate-300 text-slate-950'
                                : idx === 2
                                ? 'bg-amber-700 text-white'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <div>
                            <div className="font-semibold text-white leading-tight">{p.name}</div>
                            <div className="text-[10px] font-mono text-slate-500">{p.rollNo}</div>
                          </div>
                        </div>

                        <div className="font-mono font-bold text-rose-400 text-right">
                          {p.score} <span className="text-[10px] text-slate-500 font-normal">pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 text-center">
                  Scores calculated on speed + correctness
                </div>
              </div>
            </div>
          ) : (
            /* COMPLETED CHALLENGE RESULTS */
            <div className="text-center py-10 max-w-xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 mx-auto shadow-2xl">
                <Trophy className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white">Live Challenge Concluded!</h2>
                <p className="text-xs text-slate-400">
                  Congratulations to all participating students of PCCOER. Official scores recorded in academic records.
                </p>
              </div>

              {/* Podium Top 3 */}
              <div className="grid grid-cols-3 gap-3 items-end pt-4">
                {/* 2nd Place */}
                {sortedLeaderboard[1] && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-slate-400 text-xs font-bold">2nd Place</div>
                    <div className="text-sm font-bold text-white truncate">{sortedLeaderboard[1].name}</div>
                    <div className="text-xs text-rose-400 font-mono font-bold">{sortedLeaderboard[1].score} pts</div>
                  </div>
                )}

                {/* 1st Place */}
                {sortedLeaderboard[0] && (
                  <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-950/40 to-slate-950 border-2 border-amber-500/60 space-y-2 -translate-y-2 shadow-xl shadow-amber-950/40">
                    <Award className="w-6 h-6 text-amber-400 mx-auto" />
                    <div className="text-amber-400 text-xs font-bold uppercase tracking-wider">Champion</div>
                    <div className="text-base font-extrabold text-white truncate">{sortedLeaderboard[0].name}</div>
                    <div className="text-sm text-amber-300 font-mono font-bold">{sortedLeaderboard[0].score} pts</div>
                  </div>
                )}

                {/* 3rd Place */}
                {sortedLeaderboard[2] && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-slate-400 text-xs font-bold">3rd Place</div>
                    <div className="text-sm font-bold text-white truncate">{sortedLeaderboard[2].name}</div>
                    <div className="text-xs text-rose-400 font-mono font-bold">{sortedLeaderboard[2].score} pts</div>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-3 pt-4">
                {isTeacher && (
                  <button
                    onClick={() => handleRoomControl('reset')}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Quiz Room</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="py-2.5 px-6 rounded-xl bg-rose-800 hover:bg-rose-700 text-white text-xs font-bold shadow-lg"
                >
                  Exit Arena
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
