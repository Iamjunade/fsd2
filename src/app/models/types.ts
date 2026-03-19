export interface User {
  uid: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  points: number;
  createdAt: string;
}

export interface Problem {
  id?: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  sampleInput: string;
  sampleOutput: string;
  createdAt: string;
  tags?: string[];
  subsystem?: string;
}

export interface TestCaseResult {
  id: number;
  type: string;
  status: string;
  time: number;
}

export interface Submission {
  id?: string;
  userId: string;
  problemId: string;
  code: string;
  language: 'javascript' | 'python' | 'cpp' | 'java';
  status: 'Accepted' | 'Wrong Answer' | 'Error' | 'Pending' | 'Runtime Error' | 'Time Limit Exceeded' | 'Compile Error';
  executionTime: number;
  submittedAt: string;
  testCases?: TestCaseResult[];
}
