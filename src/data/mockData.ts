import {
  User,
  Subject,
  Department,
  NoteItem,
  QuestionPaper,
  Assignment,
  AssignmentSubmission,
  PracticalExperiment,
  PracticalSubmission,
  Quiz,
  Announcement,
  NotificationItem,
  AcademicCalendarEvent,
  ClassAnalytics
} from '../types';

export const MOCK_USERS: Record<string, User> = {
  student: {
    id: 'usr-student-01',
    name: 'Suraj Zalke',
    email: 'suraj.zalke@pccoer.in',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Engineering',
    rollNo: 'TE-COMP-B-42',
    prn: '72148920C',
    semester: 4,
    academicYear: '2025-2026',
  },
  teacher: {
    id: 'usr-teacher-01',
    name: 'Prof. Dr. Aarti Sharma',
    email: 'aarti.sharma@pccoer.in',
    role: 'teacher',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'First Year & Applied Sciences',
    designation: 'Professor & Head of Chemistry Section',
    employeeId: 'PCCOER-FAC-0142',
  },
  admin: {
    id: 'usr-admin-01',
    name: 'Dr. Harish K. Kulkarni',
    email: 'dean.academics@pccoer.in',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Deanery of Academics',
    designation: 'Dean Academics & Institutional Controller',
    employeeId: 'PCCOER-ADM-0004',
  }
};

export const MOCK_DEPARTMENTS: Department[] = [
  {
    id: 'dept-comp',
    name: 'Computer Engineering',
    code: 'COMP',
    headOfDepartment: 'Dr. Archana Chougule',
    totalStudents: 480,
    totalFaculty: 28,
  },
  {
    id: 'dept-chem',
    name: 'Applied Sciences & Chemistry',
    code: 'FE-AS',
    headOfDepartment: 'Prof. Dr. Aarti Sharma',
    totalStudents: 620,
    totalFaculty: 24,
  },
  {
    id: 'dept-mech',
    name: 'Mechanical Engineering',
    code: 'MECH',
    headOfDepartment: 'Dr. U. G. Potdar',
    totalStudents: 360,
    totalFaculty: 22,
  },
  {
    id: 'dept-entc',
    name: 'Electronics & Telecommunication',
    code: 'ENTC',
    headOfDepartment: 'Dr. Rahul Mapari',
    totalStudents: 320,
    totalFaculty: 19,
  },
  {
    id: 'dept-aids',
    name: 'Artificial Intelligence & Data Science',
    code: 'AI&DS',
    headOfDepartment: 'Dr. Priya Pimpalkar',
    totalStudents: 240,
    totalFaculty: 16,
  }
];

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 'subj-chem',
    code: 'BS-CH101',
    name: 'Engineering Chemistry',
    department: 'Applied Sciences & Humanities',
    semester: 2,
    academicYear: '2025-2026',
    teacherId: 'usr-teacher-01',
    teacherName: 'Prof. Dr. Aarti Sharma',
    teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    color: '#8B1D2C', // PCCOER Crimson
    description: 'Comprehensive study of water technology, EDTA complexometry, polymers, corrosion science, phase rule, and green chemistry analytical methods.',
    modulesCount: 6,
    practicalsCount: 8,
    assignmentsCount: 4,
    enrolledStudentsCount: 68,
  },
  {
    id: 'subj-dsa',
    code: 'CS-201',
    name: 'Data Structures & Algorithms',
    department: 'Computer Engineering',
    semester: 3,
    academicYear: '2025-2026',
    teacherId: 'usr-teacher-02',
    teacherName: 'Dr. Rajesh Kulkarni',
    teacherAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    color: '#1E3A8A', // Deep Navy
    description: 'Advanced data representations, balanced search trees, graph algorithms, dynamic programming, and amortized complexity analysis.',
    modulesCount: 6,
    practicalsCount: 10,
    assignmentsCount: 5,
    enrolledStudentsCount: 72,
  },
  {
    id: 'subj-math',
    code: 'BS-MA101',
    name: 'Engineering Mathematics-II',
    department: 'Applied Sciences',
    semester: 2,
    academicYear: '2025-2026',
    teacherId: 'usr-teacher-03',
    teacherName: 'Dr. Sunita Jagtap',
    teacherAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    color: '#065F46', // Emerald Slate
    description: 'First order ordinary differential equations, Fourier series, multivariable calculus, and vector algebra applications.',
    modulesCount: 5,
    practicalsCount: 6,
    assignmentsCount: 4,
    enrolledStudentsCount: 70,
  },
  {
    id: 'subj-bee',
    code: 'ES-EE102',
    name: 'Basic Electrical & Electronics',
    department: 'First Year Engineering',
    semester: 2,
    academicYear: '2025-2026',
    teacherId: 'usr-teacher-04',
    teacherName: 'Prof. Amit Joshi',
    teacherAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    color: '#9A3412', // Amber Rust
    description: 'Single-phase AC circuits, transformer operations, DC machines, semiconductor diodes, and operational amplifier configurations.',
    modulesCount: 5,
    practicalsCount: 8,
    assignmentsCount: 3,
    enrolledStudentsCount: 65,
  }
];

export const MOCK_NOTES: NoteItem[] = [
  {
    id: 'note-chem-01',
    subjectId: 'subj-chem',
    subjectName: 'Engineering Chemistry',
    title: 'Unit 1: Hardness of Water & EDTA Complexometry',
    module: 'Module 1 — Water Technology',
    topic: 'Hardness of Water, Causes, and EDTA Principle',
    authorName: 'Prof. Dr. Aarti Sharma',
    authorRole: 'Head of Chemistry',
    updatedAt: '2026-03-28',
    summary: 'Complete theoretical principles, structural formula of EDTA, function of Eriochrome Black T indicator at pH 10, and stoichiometric derivations.',
    content: `# Module 01: Water Technology & Hardness

## 1. Definition of Hardness
Hardness of water is defined as the soap-consuming capacity of water. It is caused by the presence of multivalent cations, primarily dissolved salts of Calcium ($Ca^{2+}$) and Magnesium ($Mg^{2+}$).

$$2C_{17}H_{35}COONa + Ca^{2+} \\rightarrow (C_{17}H_{35}COO)_2Ca \\downarrow + 2Na^+$$

## 2. Classification of Hardness
1. **Temporary Hardness (Carbonate Hardness)**:
   - Caused by bicarbonates: $Ca(HCO_3)_2$ and $Mg(HCO_3)_2$.
   - Precipitated upon boiling into insoluble carbonates:
   $$Ca(HCO_3)_2 \\xrightarrow{\\Delta} CaCO_3 \\downarrow + H_2O + CO_2 \\uparrow$$

2. **Permanent Hardness (Non-Carbonate Hardness)**:
   - Caused by chlorides, sulfates, and nitrates of Ca and Mg ($CaCl_2, MgCl_2, CaSO_4, MgSO_4$).
   - Cannot be removed by simple boiling; requires zeolite/ion-exchange or lime-soda softening.

## 3. Disodium Salt of EDTA Method
Ethylenediaminetetraacetic acid (EDTA) is a hexadentate ligand possessing four carboxylic acid groups and two nitrogen donor atoms.
- **Chelate Formation**: Forms 1:1 soluble, stable ring complexes with $Ca^{2+}$ and $Mg^{2+}$.
- **Indicator**: Eriochrome Black T (EBT) is used at pH ~10 (maintained by $NH_4Cl + NH_4OH$ buffer).
- **Color Transition**:
  - $M^{2+} + \\text{EBT} \\rightarrow [M-\\text{EBT}] \\quad \\text{(Wine Red)}$
  - $[M-\\text{EBT}] + \\text{EDTA} \\rightarrow [M-\\text{EDTA}] + \\text{EBT} \\quad \\text{(Sky Blue)}$
- **Endpoint**: Sharp transformation from **Wine Red to Sky Blue**.

## 4. Key Calculation Equations
$$\\text{Total Hardness (ppm CaCO}_3\\text{)} = \\frac{V_{\\text{EDTA}} \\times M_{\\text{EDTA}} \\times 1000 \\times 100}{\\text{Volume of Water Sample (ml)}}$$`,
    pdfUrl: '/manuals/chem-unit-1-hardness.pdf',
    fileSize: '2.4 MB',
    pageCount: 14,
    readTime: '12 min',
    isPinned: true,
    bookmarked: true,
    downloadsCount: 142,
    viewsCount: 388,
    shareUrl: '/pccoer/chemistry/notes/hardness-of-water',
  },
  {
    id: 'note-chem-02',
    subjectId: 'subj-chem',
    subjectName: 'Engineering Chemistry',
    title: 'Unit 2: High Polymers & Biodegradable Plastics',
    module: 'Module 2 — Polymer Technology',
    topic: 'Condensation Polymerization & Conducting Polymers',
    authorName: 'Prof. Dr. Aarti Sharma',
    authorRole: 'Head of Chemistry',
    updatedAt: '2026-03-20',
    summary: 'Mechanisms of addition vs condensation polymerization, synthesis of Nylon-6,6, Bakelite, and polyaniline conducting polymers.',
    content: `# Module 02: Polymer Science
Synthetic polymers form the backbone of modern structural and electrical materials in engineering.
- **Polyaniline**: Synthetic conducting polymer with tunable electrical conductivity via doping with $HCl$.
- **Biodegradable polymers**: Polylactic acid (PLA) and Polycaprolactone (PCL) degrading through enzymatic hydrolysis.`,
    pdfUrl: '/manuals/chem-unit-2-polymers.pdf',
    fileSize: '3.1 MB',
    pageCount: 18,
    readTime: '15 min',
    isPinned: false,
    bookmarked: false,
    downloadsCount: 98,
    viewsCount: 240,
    shareUrl: '/pccoer/chemistry/notes/polymers-technology',
  },
  {
    id: 'note-dsa-01',
    subjectId: 'subj-dsa',
    subjectName: 'Data Structures & Algorithms',
    title: 'AVL Trees: Self-Balancing Binary Search Trees',
    module: 'Module 3 — Advanced Trees',
    topic: 'Balance Factor, LL, RR, LR, and RL Rotations',
    authorName: 'Dr. Rajesh Kulkarni',
    authorRole: 'Associate Professor',
    updatedAt: '2026-03-25',
    summary: 'Detailed rotation invariants, height calculation, and insertion rebalancing with C++ implementations.',
    content: `# AVL Tree Rebalancing
An AVL tree guarantees $O(\\log n)$ search, insert, and delete operations by maintaining a balance factor $BF = h_{left} - h_{right} \\in \\{-1, 0, +1\\}$.`,
    pdfUrl: '/manuals/dsa-avl-trees.pdf',
    fileSize: '1.8 MB',
    pageCount: 11,
    readTime: '9 min',
    isPinned: true,
    bookmarked: true,
    downloadsCount: 176,
    viewsCount: 420,
    shareUrl: '/pccoer/dsa/notes/avl-trees-rotations',
  }
];

export const MOCK_PRACTICALS: PracticalExperiment[] = [
  {
    id: 'prac-chem-01',
    subjectId: 'subj-chem',
    subjectName: 'Engineering Chemistry',
    number: 1,
    title: 'Determination of Total, Temporary and Permanent Hardness of Water by EDTA Titration',
    topic: 'Complexometric EDTA Titration',
    learningObjectives: [
      'Understand the principles of complexometric titration and hexadentate chelation.',
      'Operate the virtual laboratory apparatus (burette, pipette, conical flask, magnetic stirrer).',
      'Accurately observe the color transformation from Wine Red to Sky Blue at pH 10.',
      'Calculate Total, Temporary, and Permanent Hardness in parts per million (ppm) of CaCO3 equivalents.',
      'Demonstrate error analysis and Stoichiometric balance in engineering water treatment.'
    ],
    aim: 'To determine Total, Temporary, and Permanent hardness of the supplied water sample using standard 0.01 M EDTA solution and Eriochrome Black T indicator at pH 10.0.',
    apparatus: [
      'Burette (50 mL capacity, graduated to 0.1 mL)',
      'Burette stand and clamp',
      'Volumetric Pipette (25 mL)',
      'Conical flasks (250 mL)',
      'Measuring cylinder (100 mL)',
      'Beakers and wash bottle',
      'Magnetic stirrer and hot plate'
    ],
    chemicalsRequired: [
      'Standard Disodium salt of EDTA solution (0.01 M)',
      'Eriochrome Black T (EBT) indicator powder/solution',
      'Ammonium chloride - Ammonium hydroxide buffer solution (pH 10.0)',
      'Hard water sample (tap/borewell water)',
      'Distilled water'
    ],
    theory: `Hardness of water is caused by multivalent metal cations, principally Ca2+ and Mg2+. 
When EDTA (ethylenediaminetetraacetic acid disodium salt) is added to hard water buffered at pH 10 in the presence of Eriochrome Black T (EBT), it first chelates any free Ca2+ and Mg2+ ions. 
Before titration, EBT combines with a small amount of metal ions to form a weak, unstable wine-red complex:
Ca2+ + EBT -> [Ca-EBT] (Wine Red)

During titration, EDTA reacts first with free metal ions, and at the endpoint, displaces EBT from the wine-red complex because the metal-EDTA complex is far more stable:
[Ca-EBT] + EDTA -> [Ca-EDTA] (Colorless) + EBT (Sky Blue)

Hence, the color change at the endpoint is Wine Red to Sky Blue.`,
    reactions: [
      'Ca2+ + EBT (Sky Blue) -> [Ca-EBT] (Wine Red) [at pH 10]',
      'Ca2+ + EDTA4- -> [Ca-EDTA]2- (Colorless)',
      '[Ca-EBT] + EDTA4- -> [Ca-EDTA]2- + EBT (Sky Blue)'
    ],
    procedureSteps: [
      '1. Rinse and fill the burette with standard 0.01 M EDTA solution. Note the initial reading (0.0 mL).',
      '2. Pipette out 25 mL of the supplied hard water sample into a clean 250 mL conical flask.',
      '3. Add 2 mL of NH4Cl-NH4OH buffer solution to maintain the pH between 9.5 and 10.0.',
      '4. Add 2-3 drops of Eriochrome Black T indicator. The solution turns wine red.',
      '5. Launch the Virtual Laboratory simulation and perform the titration by adding EDTA dropwise with swirling.',
      '6. Stop the titration immediately when the wine-red color sharply turns into a clear sky blue.',
      '7. Record the final burette reading. Repeat the titration twice more to obtain concordant readings.'
    ],
    precautions: [
      'Ensure the burette nozzle has no air bubbles before commencing titration.',
      'Maintain pH strictly at 10; at pH < 9, complexation is incomplete; at pH > 11, Mg(OH)2 precipitates.',
      'Add minimum quantity of EBT indicator, as excess indicator obscures the delicate endpoint.'
    ],
    expectedConcordantVolumeRange: [14.0, 14.5],
    standardCalculationFormula: 'Total Hardness (ppm CaCO3) = (Concordant Volume of EDTA in mL * Molarity of EDTA * 1000 * 100) / Volume of Water Sample in mL',
    vivaQuestions: [
      {
        question: 'Why is the disodium salt of EDTA used instead of free EDTA acid?',
        answer: 'Free EDTA acid is only sparingly soluble in water, whereas its disodium salt (Na2H2Y.2H2O) is highly water-soluble, stable, and easily standardized.'
      },
      {
        question: 'What is the role of the buffer solution in this titration?',
        answer: 'EDTA forms stable stoichiometric 1:1 complexes with Ca2+ and Mg2+ specifically in the alkaline range of pH 9.5-10.0. The NH4Cl/NH4OH buffer maintains this pH throughout titration despite proton release.'
      },
      {
        question: 'Why does the indicator turn from wine-red to sky blue at the endpoint?',
        answer: 'EBT is sky blue in its uncomplexed form at pH 10. In the flask it binds weakly with Ca2+/Mg2+ to form a wine-red complex. When EDTA titrant binds all metal ions due to higher stability constants, free EBT is liberated, returning the solution to its pure sky blue color.'
      }
    ],
    vlabIntegration: {
      providerId: 'moe-vlab',
      providerName: 'Ministry of Education (MoE) Virtual Labs',
      experimentId: 'exp-chem-01',
      embedUrl: 'https://vlab.amrita.edu/repo/BIOTECH/CEL/Water_Hardness/index.html',
      fallbackEmbedUrl: 'https://phet.colorado.edu/sims/html/acid-base-solutions/latest/acid-base-solutions_en.html',
      deepLinkUrl: 'https://vlab.amrita.edu/?sub=2&brch=193&sim=575&cnt=1',
      accreditation: 'NMEICT / IIT Delhi / Amrita Collaborative Gateway',
      supportedMode: 'api_handshake'
    },
    deadline: '2026-10-15',
    maxMarks: 10
  },
  {
    id: 'prac-chem-02',
    subjectId: 'subj-chem',
    subjectName: 'Engineering Chemistry',
    number: 2,
    title: 'Conductometric Titration of Strong Acid (HCl) vs Strong Base (NaOH)',
    topic: 'Electrochemical Conductometry',
    learningObjectives: [
      'Understand the variation of electrolytic conductivity with ionic mobility.',
      'Plot conductance (mS/cm) versus volume of titrant added.',
      'Locate equivalence point at minimum conductance.'
    ],
    aim: 'To determine the concentration of supplied strong acid (HCl) by titrating against standard NaOH conductometrically.',
    apparatus: ['Digital conductivity meter', 'Conductivity cell', 'Microburette (10 mL)', 'Magnetic stirrer', 'Beaker 100 mL'],
    chemicalsRequired: ['0.1 N NaOH solution', 'Unknown HCl solution', 'Distilled water'],
    theory: 'As NaOH is added to HCl, fast-moving H+ ions (mobility 350) are replaced by slower Na+ ions (mobility 50), causing conductance to fall sharply until the neutralisation point, after which excess OH- ions (mobility 198) cause conductance to rise.',
    reactions: ['H+ + Cl- + Na+ + OH- -> Na+ + Cl- + H2O'],
    procedureSteps: [
      '1. Calibrate conductivity meter with 0.1 N KCl.',
      '2. Pipette 20 mL HCl into beaker and immerse conductivity cell.',
      '3. Add NaOH in 0.5 mL increments, stir and record conductance.'
    ],
    precautions: ['Stir thoroughly before each conductance reading.', 'Avoid touching the platinum black electrodes.'],
    expectedConcordantVolumeRange: [9.8, 10.2],
    standardCalculationFormula: 'N1 * V1 = N2 * V2',
    vivaQuestions: [
      {
        question: 'Why does conductance decrease initially during titration?',
        answer: 'Highly mobile H+ ions (349.8 cm2/ohm.equiv) are neutralized and replaced by slower Na+ ions (50.1 cm2/ohm.equiv).'
      }
    ],
    vlabIntegration: {
      providerId: 'moe-vlab',
      providerName: 'Ministry of Education Virtual Labs',
      experimentId: 'exp-chem-02',
      embedUrl: 'https://vlab.amrita.edu/repo/BIOTECH/CEL/Conductometric_Titration/index.html',
      fallbackEmbedUrl: 'https://phet.colorado.edu/sims/html/concentration/latest/concentration_en.html',
      deepLinkUrl: 'https://vlab.amrita.edu/?sub=2&brch=193&sim=1548&cnt=1',
      accreditation: 'NMEICT Certified',
      supportedMode: 'api_handshake'
    },
    deadline: '2026-10-22',
    maxMarks: 10
  }
];

export const MOCK_SUBMISSIONS: PracticalSubmission[] = [
  {
    id: 'sub-chem-01',
    practicalId: 'prac-chem-01',
    practicalTitle: 'Determination of Total, Temporary and Permanent Hardness of Water by EDTA Titration',
    subjectName: 'Engineering Chemistry',
    studentId: 'usr-student-01',
    studentName: 'Suraj Zalke',
    rollNo: 'TE-COMP-B-42',
    prn: '72148920C',
    department: 'Computer Engineering',
    submittedAt: '2026-10-02T14:30:00Z',
    status: 'submitted',
    observations: {
      sampleVolume: 25,
      edtaMolarity: 0.01,
      rows: [
        { trialNo: 1, sampleVolume: 25, initialBuretteReading: 0.0, finalBuretteReading: 14.3, volumeOfEdta: 14.3 },
        { trialNo: 2, sampleVolume: 25, initialBuretteReading: 14.3, finalBuretteReading: 28.5, volumeOfEdta: 14.2 },
        { trialNo: 3, sampleVolume: 25, initialBuretteReading: 28.5, finalBuretteReading: 42.7, volumeOfEdta: 14.2 }
      ],
      concordantVolume: 14.2
    },
    calculatedHardness: 568.0,
    formulaUsed: '(V_EDTA * M_EDTA * 1000 * 100) / V_sample = (14.2 * 0.01 * 1000 * 100) / 25 = 568 ppm CaCO3 equivalents',
    vivaAnswers: {
      '0': 'Free EDTA is poorly soluble; disodium salt Na2H2Y is easily soluble and forms stable complexes.',
      '1': 'NH4Cl + NH4OH maintains pH 10; without it Ca/Mg complexes do not form stably or Mg precipitates.',
      '2': 'EBT forms wine-red with metal. At endpoint, EDTA removes metal, releasing free EBT which is sky blue.'
    },
    conclusion: 'The total hardness of the supplied water sample was experimentally determined to be 568 ppm CaCO3 equivalents, classifying it as very hard water (>300 ppm).',
    marks: undefined,
    maxMarks: 10,
    rubrics: {
      experimentalAccuracy: 4,
      calculations: 3,
      vivaVoce: 3
    },
    verificationHash: 'SHA256:7B81FC99A043B718D24E6E1A334182937A0923DF75051BA0F928C8110D83BA9F'
  }
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-chem-01',
    subjectId: 'subj-chem',
    subjectName: 'Engineering Chemistry',
    title: 'Assignment 1: Water Softening Engineering & Zeolite Calculations',
    module: 'Module 1 — Water Technology',
    description: 'Solve numerical problems on Zeolite softening capacity regeneration, Ion Exchange demineralization sizing, and boiler scale prevention mechanisms.',
    totalMarks: 25,
    deadline: '2026-10-18',
    status: 'active',
    allowedTypes: ['pdf', 'text'],
    submissionsCount: 54,
    totalStudents: 68,
  },
  {
    id: 'asg-chem-02',
    subjectId: 'subj-chem',
    subjectName: 'Engineering Chemistry',
    title: 'Assignment 2: Industrial Polymers & Green Biodegradable Composites',
    module: 'Module 2 — Polymers',
    description: 'Literature review on polycaprolactone biopolymers and comparison of recycling techniques for thermosets vs thermoplastics.',
    totalMarks: 20,
    deadline: '2026-10-30',
    status: 'active',
    allowedTypes: ['pdf'],
    submissionsCount: 22,
    totalStudents: 68,
  }
];

export const MOCK_ASSIGNMENT_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: 'asub-01',
    assignmentId: 'asg-chem-01',
    assignmentTitle: 'Assignment 1: Water Softening Engineering & Zeolite Calculations',
    studentId: 'usr-student-01',
    studentName: 'Suraj Zalke',
    rollNo: 'TE-COMP-B-42',
    submittedAt: '2026-10-01T11:20:00Z',
    status: 'graded',
    submissionContent: 'Detailed solution for 5 numerical problems on zeolite bed regeneration with 10% NaCl solution, total hardness calculation in ppm and French degrees, and chemical reactions for Clark softening.',
    fileAttachment: {
      name: 'Suraj_Zalke_Zeolite_Assignment1.pdf',
      size: '1.4 MB',
      type: 'application/pdf'
    },
    marks: 24,
    maxMarks: 25,
    feedback: 'Excellent derivations and correct conversion between ppm and Clark degrees. Neat representation of cation/anion exchange resin columns.',
    reviewedBy: 'Prof. Dr. Aarti Sharma',
    reviewedAt: '2026-10-02T09:15:00Z'
  }
];

export const MOCK_QUESTION_PAPERS: QuestionPaper[] = [
  {
    id: 'qp-2025-chem-insem',
    title: 'Engineering Chemistry — In-Sem Examination (SPPU / PCCOER Pattern)',
    subjectId: 'subj-chem',
    subjectName: 'Engineering Chemistry',
    department: 'Applied Sciences & Humanities',
    semester: 2,
    academicYear: '2025-2026',
    examType: 'In-Sem Examination',
    totalMarks: 30,
    duration: '60 minutes',
    pdfUrl: '/papers/chem-insem-2025.pdf',
    downloads: 340,
    uploadedAt: '2026-02-10'
  },
  {
    id: 'qp-2024-chem-endsem',
    title: 'Engineering Chemistry — End-Sem University Examination (Dec 2024)',
    subjectId: 'subj-chem',
    subjectName: 'Engineering Chemistry',
    department: 'Applied Sciences & Humanities',
    semester: 2,
    academicYear: '2024-2025',
    examType: 'End-Sem Examination',
    totalMarks: 70,
    duration: '150 minutes',
    pdfUrl: '/papers/chem-endsem-2024.pdf',
    downloads: 512,
    uploadedAt: '2025-01-15'
  },
  {
    id: 'qp-2025-dsa-ut1',
    title: 'Data Structures & Algorithms — Unit Test 1 Model Paper',
    subjectId: 'subj-dsa',
    subjectName: 'Data Structures & Algorithms',
    department: 'Computer Engineering',
    semester: 3,
    academicYear: '2025-2026',
    examType: 'Unit Test 1',
    totalMarks: 20,
    duration: '45 minutes',
    pdfUrl: '/papers/dsa-ut1-2025.pdf',
    downloads: 280,
    uploadedAt: '2026-03-01'
  }
];

export const MOCK_QUIZZES: Quiz[] = [
  {
    id: 'quiz-chem-01',
    subjectId: 'subj-chem',
    subjectName: 'Engineering Chemistry',
    title: 'Module 1 Mastery: Water Technology & EDTA Principles',
    module: 'Module 1 — Water Technology',
    durationMinutes: 15,
    totalMarks: 20,
    negativeMarking: 0.5,
    isLiveAvailable: true,
    liveCode: 'CHEM26',
    questions: [
      {
        id: 'q1',
        question: 'Which indicator is standardly used in the determination of total hardness of water by EDTA titration at pH 10?',
        options: ['Phenolphthalein', 'Eriochrome Black T (EBT)', 'Methyl Orange', 'Starch Solution'],
        correctIndex: 1,
        explanation: 'Eriochrome Black T forms a wine-red complex with Ca2+/Mg2+ ions, which turns sky blue at endpoint when EDTA chelates all metal ions.',
        marks: 5
      },
      {
        id: 'q2',
        question: 'What is the role of NH4OH + NH4Cl buffer in EDTA titration?',
        options: ['To bleach the solution', 'To maintain pH ~10 for stable Ca-EDTA & Mg-EDTA complex formation', 'To precipitate sulfate ions', 'To neutralize alkaline bicarbonate'],
        correctIndex: 1,
        explanation: 'EDTA forms strong complexes with Ca2+ and Mg2+ specifically around pH 9.5 - 10.0, maintained by NH4Cl/NH4OH buffer.',
        marks: 5
      },
      {
        id: 'q3',
        question: 'Permanent hardness of water cannot be removed by simple boiling because it is caused by:',
        options: ['Bicarbonates of Ca and Mg', 'Chlorides and Sulfates of Ca and Mg', 'Dissolved CO2 and Oxygen', 'Sodium Carbonate'],
        correctIndex: 1,
        explanation: 'Chlorides and sulfates do not decompose upon boiling into insoluble carbonates like bicarbonates do.',
        marks: 5
      },
      {
        id: 'q4',
        question: 'Why is hardness traditionally expressed in terms of CaCO3 equivalents?',
        options: ['CaCO3 is the only salt in water', 'CaCO3 has a convenient molecular weight of 100 and equivalent weight of 50', 'CaCO3 is completely soluble', 'It was mandated by IUPAC in 2024'],
        correctIndex: 1,
        explanation: 'CaCO3 has a molar mass of 100 g/mol and equivalent weight of 50, simplifying stoichiometric conversion factors.',
        marks: 5
      }
    ]
  }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-01',
    title: 'Schedule for Engineering Chemistry Virtual Lab Submissions & In-Sem Viva',
    category: 'Laboratory',
    department: 'Applied Sciences & Humanities',
    authorName: 'Prof. Dr. Aarti Sharma',
    authorRole: 'Head of Chemistry',
    date: '2026-10-02',
    content: 'All First and Second year students must complete Practical #01 (Hardness of Water by EDTA) on the integrated Virtual Lab portal and submit their digital records before October 15. The digital records will be evaluated for internal continuous assessment (CA-1).',
    isImportant: true,
  },
  {
    id: 'ann-02',
    title: 'SPPU In-Sem Examination Timetable Finalized — October 2026',
    category: 'Examination',
    department: 'PCCOER Exam Cell',
    authorName: 'Dr. Harish K. Kulkarni',
    authorRole: 'Dean Academics',
    date: '2026-09-28',
    content: 'The official SPPU In-Sem examination timetable is uploaded in the Examination section. Hall tickets will be issued through the student portal after clearing term-work requirements.',
    isImportant: true,
  },
  {
    id: 'ann-03',
    title: 'PCCOER Connect: Integrated MoE Virtual Lab Gateway Upgraded',
    category: 'Academic',
    department: 'Deanery of Academics',
    authorName: 'Admin Desk',
    authorRole: 'Systems Admin',
    date: '2026-09-25',
    content: 'The platform now supports authenticated session handshake with the Ministry of Education Virtual Labs (vlab.co.in) and PhET interactive engines with automated observation validation.',
    isImportant: false,
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    title: 'New Chemistry Practical Assigned',
    description: 'Determination of Hardness of Water by EDTA is now live. Launch Virtual Lab to conduct experiment.',
    timestamp: '2 hours ago',
    category: 'practical',
    isRead: false,
    actionUrl: '/practicals/prac-chem-01'
  },
  {
    id: 'notif-02',
    title: 'Live Quiz CHEM26 Scheduled',
    description: 'Prof. Dr. Aarti Sharma started a live challenge: Water Hardness & EDTA Titration.',
    timestamp: '15 mins ago',
    category: 'quiz',
    isRead: false,
    actionUrl: '/live-quiz/CHEM26'
  },
  {
    id: 'notif-03',
    title: 'Assignment 1 Evaluated',
    description: 'Your submission for Water Softening Engineering was reviewed. Score: 24/25.',
    timestamp: 'Yesterday',
    category: 'result',
    isRead: true,
    actionUrl: '/assignments/asg-chem-01'
  }
];

export const MOCK_CALENDAR_EVENTS: AcademicCalendarEvent[] = [
  {
    id: 'cal-01',
    title: 'Engineering Chemistry Lecture (Room 204)',
    date: '2026-10-03',
    type: 'lecture',
    subject: 'Engineering Chemistry',
    location: 'Building B, Room 204',
    time: '09:15 AM - 10:15 AM'
  },
  {
    id: 'cal-02',
    title: 'Chemistry Lab Batch B2 (Virtual Lab + Physical Verification)',
    date: '2026-10-03',
    type: 'practical',
    subject: 'Engineering Chemistry',
    location: 'Chemistry Lab 02 & Digital Hub',
    time: '11:15 AM - 01:15 PM'
  },
  {
    id: 'cal-03',
    title: 'Live Quiz CHEM26 (EDTA Titration)',
    date: '2026-10-03',
    type: 'practical',
    subject: 'Engineering Chemistry',
    location: 'PCCOER CONNECT Live Engine',
    time: '02:30 PM - 03:00 PM'
  },
  {
    id: 'cal-04',
    title: 'Assignment 1 Deadline: Water Softening',
    date: '2026-10-18',
    type: 'deadline',
    subject: 'Engineering Chemistry',
    time: '11:59 PM'
  },
  {
    id: 'cal-05',
    title: 'SPPU In-Sem Examination Commences',
    date: '2026-10-25',
    type: 'exam',
    location: 'Central Exam Hall',
    time: '10:00 AM'
  }
];

export const MOCK_CLASS_ANALYTICS: ClassAnalytics = {
  subjectName: 'Engineering Chemistry (BS-CH101)',
  totalEnrolled: 68,
  averageAttendance: 88.4,
  practicalsCompletedRate: 79.4,
  assignmentsSubmissionRate: 85.2,
  classAverageGrade: 'A (81.6%)',
  weakTopics: [
    {
      topic: 'Permanent Hardness vs Temporary Hardness distinction in calculations',
      errorRate: 34.2,
      recommendedAction: 'Re-demonstrate stoichiometric conversion factor using CaCO3 equivalent weight 50 vs molecular weight 100.'
    },
    {
      topic: 'Buffer pH Maintenance and Indicator Endpoint Sensitivity',
      errorRate: 28.5,
      recommendedAction: 'Provide revision notes on complex stability constant log K vs pH curve.'
    },
    {
      topic: 'Boiler Scale & Sludge thermal conductivity impact',
      errorRate: 19.8,
      recommendedAction: 'Assign practice questions from SPPU 2024 End-Sem paper.'
    }
  ],
  gradeDistribution: {
    o: 18,
    aPlus: 26,
    a: 14,
    b: 7,
    c: 2,
    reappear: 1
  }
};
