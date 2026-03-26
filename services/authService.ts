import { auth } from '../firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  role: 'student' | 'admin';
  points: number;
  createdAt: string;
}

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Create or update user profile
  await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Anonymous Student',
      role: 'student' // The backend will not overwrite role if it exists
    })
  });
  
  // Force a reload to get the profile
  window.location.reload();
};

export const logout = async () => {
  await signOut(auth);
};

export const subscribeToAuthChanges = (callback: (user: FirebaseUser | null, profile: UserProfile | null) => void) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const response = await fetch(`/api/users/${user.uid}`);
        if (response.ok) {
          const userData = await response.json();
          callback(user, {
            uid: userData.uid,
            username: userData.displayName,
            email: userData.email,
            role: userData.role,
            points: userData.points,
            createdAt: userData.createdAt
          });
        } else {
          callback(user, null);
        }
      } catch (e) {
        callback(user, null);
      }
    } else {
      callback(null, null);
    }
  });
};
