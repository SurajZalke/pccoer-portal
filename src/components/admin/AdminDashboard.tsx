import React, { useState } from 'react';
import { Department, Subject, User } from '../../types';
import { 
  ShieldCheck, 
  Database, 
  Layers, 
  Key, 
  Lock, 
  Users, 
  BookOpen, 
  Activity, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Cpu,
  RefreshCw
} from 'lucide-react';

interface AdminDashboardProps {
  departments: Department[];
  subjects: Subject[];
  currentUser: User;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  departments,
  subjects,
  currentUser,
}) => {
  const [activeSection, setActiveSection] = useState<'integrations' | 'security' | 'departments' | 'audit'>('integrations');

  // Virtual Lab Integration configuration state
  const [vlabProviders, setVlabProviders] = useState([
    {
      id: 'moe-vlab',
      name: 'Ministry of Education (MoE) Virtual Labs',
      accreditation: 'NMEICT / IIT Consortium',
      endpoint: 'https://vlab.amrita.edu',
      status: 'ACTIVE_CERTIFIED',
      activeExperiments: 42,
      lastHealthCheck: '10 seconds ago',
    },
    {
      id: 'phet-academic',
      name: 'PhET Interactive Simulations Academic API',
      accreditation: 'University of Colorado Boulder Licensed',
      endpoint: 'https://phet.colorado.edu/sims/html',
      status: 'ACTIVE_CERTIFIED',
      activeExperiments: 18,
      lastHealthCheck: '1 minute ago',
    },
    {
      id: 'cloud-vlab-gateway',
      name: 'PCCOER Proprietary Cloud Simulation Proxy',
      accreditation: 'PCCOER Ravet Autonomous IT Cell',
      endpoint: 'https://vlab.pccoer.in/api/v2',
      status: 'STANDBY_SECURE',
      activeExperiments: 12,
      lastHealthCheck: '5 minutes ago',
    }
  ]);

  // Audit Logs
  const auditLogs = [
    { timestamp: '2026-10-03 09:14:22', event: 'VLAB_SESSION_INITIATED', actor: 'Suraj Zalke (TE-COMP-B-42)', details: 'Token PCCOER-VLAB-3891 negotiated with MoE VLab Gateway' },
    { timestamp: '2026-10-03 08:45:10', event: 'PRACTICAL_RECORD_SIGNED', actor: 'Prof. Dr. Aarti Sharma', details: 'Graded Practical #01 (Hardness of Water) for Suraj Zalke (10/10)' },
    { timestamp: '2026-10-03 08:30:00', event: 'LIVE_QUIZ_ROOM_DEPLOYED', actor: 'Prof. Dr. Aarti Sharma', details: 'Created session CHEM26 for Engineering Chemistry' },
    { timestamp: '2026-10-02 16:10:44', event: 'AES_ENCRYPTION_KEY_ROTATED', actor: 'SYSTEM_DAEMON', details: 'Student submission vault encryption re-keyed (AES-256-GCM)' },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 dark:text-rose-400 uppercase tracking-wider">
              <span>PCCOER System Controller</span>
              <span className="text-slate-400">·</span>
              <span>Institutional Governance</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Central Administration & Security Matrix
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Logged in as: {currentUser.name} ({currentUser.designation || 'Dean of Academics'})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Institutional FERPA / Privacy Compliant</span>
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs font-medium">
          <button
            onClick={() => setActiveSection('integrations')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeSection === 'integrations'
                ? 'bg-rose-900 text-white font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Virtual Lab Gateways
          </button>

          <button
            onClick={() => setActiveSection('security')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeSection === 'security'
                ? 'bg-rose-900 text-white font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Encryption & Student Privacy
          </button>

          <button
            onClick={() => setActiveSection('departments')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeSection === 'departments'
                ? 'bg-rose-900 text-white font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Departments ({departments.length})
          </button>

          <button
            onClick={() => setActiveSection('audit')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeSection === 'audit'
                ? 'bg-rose-900 text-white font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Institutional Audit Trail
          </button>
        </div>
      </div>

      {/* SECTION: Virtual Lab Gateways */}
      {activeSection === 'integrations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Third-Party Virtual Lab Providers & Handshake Endpoints
              </h2>
              <p className="text-xs text-slate-500">
                Authorized simulation engines integrated via tokenized session envelopes
              </p>
            </div>
            <button className="py-2 px-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ping All Endpoints</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vlabProviders.map((prov) => (
              <div
                key={prov.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                      {prov.status}
                    </span>
                    <span className="text-[11px] text-slate-400">{prov.lastHealthCheck}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {prov.name}
                  </h3>

                  <div className="text-xs text-slate-500">
                    Accreditation: {prov.accreditation}
                  </div>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 truncate">
                    {prov.endpoint}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{prov.activeExperiments} Active Practicals</span>
                  <span className="text-rose-800 dark:text-rose-400 font-bold">API Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: Security & Encryption */}
      {activeSection === 'security' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-rose-800 dark:text-rose-400" />
              <span>Comprehensive Student Data Encryption & Privacy Protection</span>
            </h2>
            <p className="text-xs text-slate-500">
              Guaranteed isolation of student laboratory observation data, assignment files, and academic records
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>AES-256-GCM Envelope Encryption</span>
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                All submitted practical observation tables, teacher feedback, and assessment grades are encrypted at rest with unique per-student key derivation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero Student-to-Student Data Leakage</span>
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Strict Role-Based Access Control (RBAC) verifies user authorization tokens at server-level prior to serving any submission metadata.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>SHA-256 Practical Integrity Hashes</span>
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Each digital practical journal submission generates an immutable cryptographic signature ensuring that laboratory data cannot be altered after teacher evaluation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Automated AI Grounding Guardrails</span>
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                PCCOER AI assistant is locked to authorized syllabus repositories with strict prohibitions against hallucinating official college announcements or exam schedules.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: Departments */}
      {activeSection === 'departments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
              >
                <div className="text-xs font-bold text-rose-800 dark:text-rose-400 font-mono">
                  {dept.code}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {dept.name}
                </h3>
                <div className="text-xs text-slate-500">
                  HOD: {dept.headOfDepartment}
                </div>
                <div className="pt-2 text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800 flex justify-between font-mono">
                  <span>{dept.totalStudents} Students</span>
                  <span>{dept.totalFaculty} Faculty</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: Audit Trail */}
      {activeSection === 'audit' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Institutional Event Audit Trail
            </h2>
            <p className="text-xs text-slate-500">Immutable ledger of platform actions, submissions, and security authentications</p>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-xs">
            {auditLogs.map((log, i) => (
              <div key={i} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-800 dark:text-rose-400">{log.event}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600 dark:text-slate-300 font-sans">{log.actor}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans">{log.details}</div>
                </div>
                <div className="text-[11px] text-slate-400 shrink-0">{log.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
