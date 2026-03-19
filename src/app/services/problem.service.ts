import { Injectable, signal } from '@angular/core';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  QuerySnapshot,
  DocumentData,
  FirestoreError
} from 'firebase/firestore';
import { Problem } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class ProblemService {
  problems = signal<Problem[]>([]);
  loading = signal<boolean>(true);

  constructor() {
    this.loadProblems();
  }

  loadProblems() {
    const q = query(collection(db, 'problems'), orderBy('createdAt', 'desc'));
    onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const loadedProblems: Problem[] = [];
      snapshot.forEach((doc) => {
        loadedProblems.push({ id: doc.id, ...doc.data() } as Problem);
      });
      this.problems.set(loadedProblems);
      this.loading.set(false);
    }, (error: FirestoreError) => {
      console.error('Error loading problems', error);
      this.loading.set(false);
    });
  }

  async getProblem(id: string): Promise<Problem | null> {
    const docRef = doc(db, 'problems', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Problem;
    }
    return null;
  }

  async addProblem(problem: Omit<Problem, 'id'>) {
    await addDoc(collection(db, 'problems'), problem);
  }

  async updateProblem(id: string, problem: Partial<Problem>) {
    const docRef = doc(db, 'problems', id);
    await updateDoc(docRef, problem);
  }

  async deleteProblem(id: string) {
    const docRef = doc(db, 'problems', id);
    await deleteDoc(docRef);
  }
}
