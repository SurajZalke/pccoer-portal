export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  department: string;
  rollNo?: string;
  prn?: string; // Permanent Registration Number
  semester?: number;
  academicYear?: string;
  designation?: string; // For teachers/admins
  employeeId?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headOfDepartment: string;
  totalStudents: number;
  totalFaculty: number;
}

export interface Subject {
  id: string;
  code: string; // e.g., BS-CH101
  name: string; // Engineering Chemistry
  department: string;
  semester: number;
  academicYear: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  color: string;
  description: string;
  modulesCount: number;
  practicalsCount: number;
  assignmentsCount: number;
  enrolledStudentsCount: number;
}

export interface NoteItem {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  module: string;
  topic: string;
  authorName: string;
  authorRole: string;
  updatedAt: string;
  summary: string;
  content: string; // Rich markdown-like content
  pdfUrl?: string;
  fileSize?: string;
  pageCount?: number;
  readTime: string;
  isPinned?: boolean;
  bookmarked?: boolean;
  downloadsCount: number;
  viewsCount: number;
  shareUrl: string;
}

export interface QuestionPaper {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  department: string;
  semester: number;
  academicYear: string; // e.g., "Winter 2025 (In-Sem)", "End-Sem 2024"
  examType: 'In-Sem Examination' | 'End-Sem Examination' | 'Unit Test 1' | 'Unit Test 2' | 'Model Question Paper';
  totalMarks: number;
  duration: string;
  pdfUrl: string;
  downloads: number;
  uploadedAt: string;
}

export interface Assignment {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  module: string;
  description: string;
  totalMarks: number;
  deadline: string;
  status: 'active' | 'closed';
  allowedTypes: ('text' | 'pdf' | 'image' | 'code')[];
  submissionsCount: number;
  totalStudents: number;
  attachmentUrl?: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  submittedAt: string;
  status: 'submitted' | 'under_review' | 'graded' | 'resubmit_required';
  submissionContent: string;
  fileAttachment?: {
    name: string;
    size: string;
    type: string;
  };
  marks?: number;
  maxMarks: number;
  feedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface ObservationRow {
  trialNo: number;
  sampleVolume: number; // in mL
  initialBuretteReading: number; // in mL
  finalBuretteReading: number; // in mL
  volumeOfEdta: number; // in mL
}

export interface PracticalExperiment {
  id: string;
  subjectId: string;
  subjectName: string;
  number: number;
  title: string; // e.g. "Determination of Hardness of Water by EDTA Titration"
  topic: string;
  learningObjectives: string[];
  aim: string;
  apparatus: string[];
  chemicalsRequired: string[];
  theory: string;
  reactions: string[];
  procedureSteps: string[];
  precautions: string[];
  expectedConcordantVolumeRange: [number, number]; // e.g., [14.0, 14.4]
  standardCalculationFormula: string;
  vivaQuestions: Array<{
    question: string;
    answer: string;
  }>;
  vlabIntegration: {
    providerId: string;
    providerName: string;
    experimentId: string;
    embedUrl: string;
    fallbackEmbedUrl: string;
    deepLinkUrl: string;
    accreditation: string;
    supportedMode: 'iframe' | 'deep_link' | 'api_handshake';
  };
  deadline: string;
  maxMarks: number;
}

export interface PracticalSubmission {
  id: string;
  practicalId: string;
  practicalTitle: string;
  subjectName: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  prn: string;
  department: string;
  submittedAt: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'resubmit_required';
  observations: {
    sampleVolume: number;
    edtaMolarity: number;
    rows: ObservationRow[];
    concordantVolume: number;
  };
  calculatedHardness: number; // ppm CaCO3
  formulaUsed: string;
  vivaAnswers: Record<string, string>;
  conclusion: string;
  marks?: number;
  maxMarks: number;
  rubrics?: {
    experimentalAccuracy: number; // max 4
    calculations: number; // max 3
    vivaVoce: number; // max 3
  };
  facultyFeedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  verificationHash: string; // SHA-256 for academic record integrity
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  marks: number;
}

export interface Quiz {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  module: string;
  durationMinutes: number;
  totalMarks: number;
  negativeMarking: number;
  questions: QuizQuestion[];
  isLiveAvailable: boolean;
  liveCode?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  score: number;
  totalMarks: number;
  percentage: number;
  attemptedAt: string;
  timeTakenMinutes: number;
  answers: Record<string, number>;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Examination' | 'Academic' | 'Laboratory' | 'Event' | 'Urgent';
  department: string;
  authorName: string;
  authorRole: string;
  date: string;
  content: string;
  isImportant: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: 'practical' | 'assignment' | 'quiz' | 'result' | 'announcement';
  isRead: boolean;
  actionUrl?: string;
}

export interface AcademicCalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'lecture' | 'practical' | 'deadline' | 'exam' | 'event';
  subject?: string;
  location?: string;
  time: string;
}

export interface ClassAnalytics {
  subjectName: string;
  totalEnrolled: number;
  averageAttendance: number;
  practicalsCompletedRate: number;
  assignmentsSubmissionRate: number;
  classAverageGrade: string;
  weakTopics: Array<{
    topic: string;
    errorRate: number;
    recommendedAction: string;
  }>;
  gradeDistribution: {
    o: number; // Outstanding >= 90
    aPlus: number; // 80-89
    a: number; // 70-79
    b: number; // 60-69
    c: number; // 50-59
    reappear: number; // < 50
  };
}
