import { Injectable, signal, inject } from '@angular/core';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  FirestoreError
} from 'firebase/firestore';
import { Submission } from '../models/types';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  userSubmissions = signal<Submission[]>([]);
  loading = signal<boolean>(false);

  authService = inject(AuthService);

  constructor() {
    // We'll load submissions when needed
  }

  loadUserSubmissions(userId: string) {
    this.loading.set(true);
    const q = query(
      collection(db, 'submissions'), 
      where('userId', '==', userId)
      // Removed orderBy to bypass mandatory composite index requirement
    );
    
    onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      let submissions: Submission[] = [];
      snapshot.forEach((doc) => {
        submissions.push({ id: doc.id, ...doc.data() } as Submission);
      });
      
      // Sort manually in JS to ensure descending order by time
      submissions.sort((a, b) => {
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      });

      this.userSubmissions.set(submissions);
      this.loading.set(false);
    }, (error: FirestoreError) => {
      console.error('Error loading submissions', error);
      this.loading.set(false);
    });
  }

  async compileCode(language: string, code: string): Promise<{ errors: unknown[] }> {
    try {
      const response = await fetch('/api/compile-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code })
      });
      return response.json();
    } catch {
      return { errors: [] };
    }
  }

  async runCode(language: string, code: string, input: string): Promise<{ output: string, status: string }> {
    const response = await fetch('/api/run-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, code, input })
    });
    return response.json();
  }

  async submitCode(language: string, code: string, input: string, problemId: string, userId: string): Promise<Submission> {
    const response = await fetch('/api/submit-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, code, input, problemId, userId })
    });
    
    const result = await response.json();
    
    const submission: Omit<Submission, 'id'> = {
      userId,
      problemId,
      code,
      language: language as 'python' | 'cpp' | 'java' | 'javascript',
      status: result.status,
      executionTime: result.executionTime,
      submittedAt: new Date().toISOString(),
      testCases: result.testCases
    };
    
    const docRef = await addDoc(collection(db, 'submissions'), submission);
    return { id: docRef.id, ...submission };
  }
}
