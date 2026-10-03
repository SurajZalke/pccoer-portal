import React, { useState, useEffect } from 'react';
import { PracticalExperiment, User } from '../../types';
import { initiateVLabSession, VLabSessionResponse } from '../../services/vlabService';
import { 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  ShieldCheck, 
  RotateCw, 
  Info, 
  CheckCircle2, 
  Clock, 
  FlaskConical, 
  ArrowRight,
  Layers,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface VirtualLabViewerProps {
  practical: PracticalExperiment;
  currentUser: User;
  onTransferObservations?: (observations: { initial: number; final: number; volume: number }) => void;
  onBack: () => void;
}

export const VirtualLabViewer: React.FC<VirtualLabViewerProps> = ({
  practical,
  currentUser,
  onTransferObservations,
  onBack,
}) => {
  const [session, setSession] = useState<VLabSessionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeEngine, setActiveEngine] = useState<'primary' | 'fallback'>('fallback');
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [showObservationDrawer, setShowObservationDrawer] = useState<boolean>(true);
  const [showGuidanceModal, setShowGuidanceModal] = useState<boolean>(false);

  // Scratchpad readings during live experiment
  const [scratchInitial, setScratchInitial] = useState<string>('0.0');
  const [scratchFinal, setScratchFinal] = useState<string>('14.2');
  const [transferDone, setTransferDone] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    async function init() {
      setLoading(true);
      const res = await initiateVLabSession(practical.id, {
        id: currentUser.id,
        name: currentUser.name,
        rollNo: currentUser.rollNo || 'TE-COMP-B-42',
      });
      setSession(res);
      setLoading(false);

      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    init();

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [practical.id, currentUser]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentEmbedUrl = activeEngine === 'primary' 
    ? practical.vlabIntegration.embedUrl 
    : practical.vlabIntegration.fallbackEmbedUrl;

  const handleTransfer = () => {
    const init = parseFloat(scratchInitial) || 0;
    const fin = parseFloat(scratchFinal) || 0;
    const vol = Math.max(0, parseFloat((fin - init).toFixed(2)));
    if (onTransferObservations) {
      onTransferObservations({
        initial: init,
        final: fin,
        volume: vol,
      });
    }
    setTransferDone(true);
    setTimeout(() => setTransferDone(false), 3000);
  };

  return (
    <div className={`flex flex-col bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'min-h-[820px]'}`}>
      {/* Top Bar: Institutional VLab Gateway Header */}
      <div className="bg-slate-950/90 backdrop-blur border-b border-slate-800 px-5 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-900 to-rose-700 flex items-center justify-center text-white shadow-md">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                Third-Party VLab Gateway
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 inline" /> Encrypted Session
              </span>
            </div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              {practical.title}
            </h2>
          </div>
        </div>

        {/* Action badges & controls */}
        <div className="flex items-center gap-2">
          {/* Provider toggle */}
          <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800 text-xs">
            <button
              onClick={() => { setActiveEngine('fallback'); setIframeKey(k => k + 1); }}
              className={`px-2.5 py-1 rounded transition-colors ${activeEngine === 'fallback' ? 'bg-rose-900/60 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              title="PhET Academic Simulation Provider"
            >
              PhET Interactive Engine
            </button>
            <button
              onClick={() => { setActiveEngine('primary'); setIframeKey(k => k + 1); }}
              className={`px-2.5 py-1 rounded transition-colors ${activeEngine === 'primary' ? 'bg-rose-900/60 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              title="Ministry of Education Virtual Labs (IIT/Amrita)"
            >
              MoE Virtual Labs (NMEICT)
            </button>
          </div>

          {/* Session timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            <span>{formatTimer(elapsedTime)}</span>
          </div>

          {/* Deep link launch */}
          <a
            href={practical.vlabIntegration.deepLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            title="Open in new window with authenticated session"
          >
            <span>External Window</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          {/* Refresh iframe */}
          <button
            onClick={() => setIframeKey(k => k + 1)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Reload Experiment"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            Back to Journal
          </button>
        </div>
      </div>

      {/* Main Interactive Stage with Floating Observation Drawer */}
      <div className="relative flex-1 bg-slate-950 flex flex-col md:flex-row min-h-[640px]">
        {/* The Live Third-Party Laboratory Frame */}
        <div className="flex-1 relative flex flex-col items-center justify-center bg-slate-950 min-h-[560px]">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium">Negotiating secure API handshake with {practical.vlabIntegration.providerName}...</p>
            </div>
          ) : (
            <iframe
              key={iframeKey}
              src={currentEmbedUrl}
              title={practical.title}
              className="w-full h-full min-h-[580px] border-0 bg-slate-900"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            />
          )}

          {/* Gateway Status Pill on top of simulator */}
          <div className="absolute top-3 left-4 bg-slate-900/80 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300 flex items-center gap-2 pointer-events-none shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Engine: <strong className="text-white font-medium">{activeEngine === 'primary' ? 'MoE Virtual Labs (IIT Amrita)' : 'PhET Academic Solution Engine'}</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-slate-400 text-[11px]">{session?.sessionToken?.slice(0, 16)}...</span>
          </div>

          {/* Quick Procedure Overlay Button */}
          <button
            onClick={() => setShowGuidanceModal(!showGuidanceModal)}
            className="absolute bottom-4 left-4 bg-slate-900/90 hover:bg-slate-800 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-lg text-xs text-slate-200 flex items-center gap-1.5 shadow-lg transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-rose-400" />
            <span>Step-by-Step Procedure Guide</span>
          </button>
        </div>

        {/* Live Observation & Data Bridge Drawer (Right side) */}
        {showObservationDrawer && (
          <aside className="w-full md:w-80 lg:w-96 bg-slate-900/95 border-t md:border-t-0 md:border-l border-slate-800 p-5 flex flex-col justify-between shrink-0">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-rose-400" />
                  <h3 className="text-sm font-bold text-white">Live Observation Bridge</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">PCCOER Sync</span>
              </div>

              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                As you perform the virtual titration in the simulator, observe the burette meniscus at the sky blue endpoint and record your values here:
              </p>

              <div className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Initial Burette Reading (mL)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={scratchInitial}
                      onChange={(e) => setScratchInitial(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-rose-500 transition-colors"
                      placeholder="0.0"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">mL</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Final Burette Reading (mL)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={scratchFinal}
                      onChange={(e) => setScratchFinal(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-rose-500 transition-colors"
                      placeholder="14.2"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">mL</span>
                  </div>
                </div>

                {/* Computed volume difference */}
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">EDTA Consumed (V):</span>
                  <span className="text-sm font-bold text-rose-400 font-mono">
                    {Math.max(0, parseFloat((parseFloat(scratchFinal || '0') - parseFloat(scratchInitial || '0')).toFixed(2)))} mL
                  </span>
                </div>

                {/* Live Formula Check */}
                <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40 text-xs">
                  <div className="flex items-center gap-1.5 text-rose-300 font-medium mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Verification Preview</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono">
                    Total Hardness = (V × 0.01 × 1000 × 100) / 25
                  </div>
                  <div className="mt-1 text-xs text-emerald-400 font-semibold font-mono">
                    ≈ {(Math.max(0, parseFloat((parseFloat(scratchFinal || '0') - parseFloat(scratchInitial || '0')).toFixed(2))) * 0.01 * 1000 * 100 / 25).toFixed(1)} ppm CaCO₃
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2 mt-4">
              <button
                onClick={handleTransfer}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-rose-800 to-rose-700 hover:from-rose-700 hover:to-rose-600 text-white rounded-lg font-medium text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                {transferDone ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Transferred to Practical Journal!</span>
                  </>
                ) : (
                  <>
                    <span>Import to Digital Journal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                onClick={onBack}
                className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
              >
                Return to Laboratory Journal
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* Step-by-Step Procedure Modal */}
      {showGuidanceModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white">Laboratory Procedure Reference</h3>
              </div>
              <button
                onClick={() => setShowGuidanceModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-96 overflow-y-auto pr-2 text-xs text-slate-300">
              {practical.procedureSteps.map((step, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-900/60 text-rose-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowGuidanceModal(false)}
                className="px-4 py-2 bg-rose-800 hover:bg-rose-700 text-white rounded-lg text-xs font-medium"
              >
                Got It, Continue Experiment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
