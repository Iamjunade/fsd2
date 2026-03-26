import { Subject } from './types';

export const TARGET_DATE = new Date('2026-05-01T00:00:00');

export const SUBJECTS: Subject[] = [
  {
    id: 'cs2201',
    code: 'CS-2201',
    name: 'Design & Analysis of Algorithms',
    instructor: 'Dr. A. Sharma',
    progress: 65,
    color: 'bg-blue-500',
    experiments: [
      {
        id: 'exp1',
        title: 'Sorting Analysis',
        description: 'Implement and analyze Merge Sort vs Quick Sort time complexity.',
        dueDate: '2024-04-10',
        status: 'graded',
        resources: [{ title: 'Sorting Notes', type: 'pdf', url: '#' }]
      },
      {
        id: 'exp2',
        title: 'Graph Traversal',
        description: 'Implement BFS and DFS for a connected graph.',
        dueDate: '2024-04-25',
        status: 'completed',
        resources: [{ title: 'Graph Theory Ref', type: 'link', url: '#' }]
      },
      {
        id: 'exp3',
        title: 'Dynamic Programming',
        description: 'Solve the Knapsack problem using DP.',
        dueDate: '2024-05-05',
        status: 'pending',
        resources: []
      }
    ]
  },
  {
    id: 'cs2202',
    code: 'CS-2202',
    name: 'Database Management Systems',
    instructor: 'Prof. M. Reynolds',
    progress: 40,
    color: 'bg-indigo-500',
    experiments: [
      {
        id: 'db1',
        title: 'ER Modeling',
        description: 'Design an ER diagram for a university library system.',
        dueDate: '2024-04-12',
        status: 'completed',
        resources: []
      },
      {
        id: 'db2',
        title: 'SQL Normalization',
        description: 'Normalize a given dataset to 3NF.',
        dueDate: '2024-05-01',
        status: 'pending',
        resources: [{ title: 'SQL Cheatsheet', type: 'pdf', url: '#' }]
      }
    ]
  },
  {
    id: 'cs2203',
    code: 'CS-2203',
    name: 'Operating Systems Lab',
    instructor: 'Dr. K. Lee',
    progress: 80,
    color: 'bg-emerald-500',
    experiments: [
      {
        id: 'os1',
        title: 'Process Scheduling',
        description: 'Simulate FCFS and Round Robin scheduling algorithms.',
        dueDate: '2024-03-15',
        status: 'graded',
        resources: [{ title: 'Scheduler Code', type: 'code', url: '#' }]
      },
      {
        id: 'os2',
        title: 'Deadlock Detection',
        description: 'Implement the Bankers Algorithm.',
        dueDate: '2024-04-20',
        status: 'completed',
        resources: []
      }
    ]
  },
  {
    id: 'ec2204',
    code: 'EC-2204',
    name: 'Microprocessor Interfacing',
    instructor: 'Prof. S. Patel',
    progress: 20,
    color: 'bg-amber-500',
    experiments: [
      {
        id: 'mp1',
        title: '8085 Basics',
        description: 'Introduction to 8085 instruction set.',
        dueDate: '2024-05-15',
        status: 'pending',
        resources: []
      }
    ]
  }
];
