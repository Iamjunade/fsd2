import { Injectable, signal } from '@angular/core';
import { auth, db } from '../firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);
  isAuthReady = signal<boolean>(false);

  constructor() {
    onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      if (user) {
        await this.loadUserProfile(user);
      } else {
        this.currentUser.set(null);
      }
      this.isAuthReady.set(true);
    });
  }

  async loadUserProfile(firebaseUser: FirebaseUser) {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userDocRef);
    
    // Check if user is the designated admin
    const isAdmin = firebaseUser.email === 'mdks9959@gmail.com';
    const targetRole = isAdmin ? 'admin' : 'user';
    
    if (userSnap.exists()) {
      const userData = userSnap.data() as User;
      
      // Upgrade to admin if needed
      if (isAdmin && userData.role !== 'admin') {
        try {
          userData.role = 'admin';
          await setDoc(userDocRef, { role: 'admin' }, { merge: true });
        } catch (e) {
          console.error('Failed to upgrade user to admin', e);
        }
      }
      
      this.currentUser.set(userData);
    } else {
      // Create new user profile
      const newUser: User = {
        uid: firebaseUser.uid,
        username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        email: firebaseUser.email || '',
        role: targetRole,
        createdAt: new Date().toISOString()
      };
      try {
        await setDoc(userDocRef, newUser);
      } catch (e) {
        console.error('Failed to create user profile', e);
      }
      this.currentUser.set(newUser);
    }
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error', error);
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error', error);
      throw error;
    }
  }
}
