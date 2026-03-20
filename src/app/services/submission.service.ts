import { Injectable, signal, inject } from '@angular/core';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  updateDoc,
  increment,
  QuerySnapshot,
  DocumentData,
  FirestoreError
} from 'firebase/firestore';
import { Submission, Problem } from '../models/types';
import { AuthService } from './auth.service';
import { ProblemService } from './problem.service';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  userSubmissions = signal<Submission[]>([]);
  loading = signal<boolean>(false);

  authService = inject(AuthService);
  problemService = inject(ProblemService);

  constructor() {
    // We'll load submissions when needed
  }

  loadUserSubmissions(userId: string) {
    this.loading.set(true);
    const q = query(
      collection(db, 'codelab', 'submissions', 'items'), 
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
    const mappedStatus = this.mapStatusForFirebase(result.status);
    
    const submission: Omit<Submission, 'id'> = {
      userId,
      problemId,
      code,
      language: language as 'python' | 'cpp' | 'java' | 'javascript',
      status: mappedStatus, 
      executionTime: result.executionTime || 0,
      submittedAt: new Date().toISOString(),
      testCases: result.testCases || []
    };
    
    const docRef = await addDoc(collection(db, 'codelab', 'submissions', 'items'), submission);

    // UPDATE LEADERBOARD XP
    if (mappedStatus === 'accepted') {
      try {
        const problem = await this.problemService.getProblem(problemId);
        let xp = 50;
        if (problem?.difficulty === 'Medium') xp = 100;
        if (problem?.difficulty === 'Hard') xp = 200;

        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          points: increment(xp)
        });
      } catch (e) {
        console.error('Failed to update XP:', e);
      }
    }

    return { id: docRef.id, ...submission };
  }

  private mapStatusForFirebase(apiStatus: string): any {
    const s = (apiStatus || 'pending').toLowerCase();
    if (s.includes('accepted')) return 'accepted';
    if (s.includes('wrong')) return 'wrong';
    if (s.includes('error') || s.includes('timeout')) return 'runtime_error';
    return 'pending';
  }
}
