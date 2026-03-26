export interface Experiment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'graded';
  resources: Resource[];
}

export interface Resource {
  title: string;
  type: 'pdf' | 'link' | 'code';
  url: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  instructor: string;
  progress: number;
  color: string;
  experiments: Experiment[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}
