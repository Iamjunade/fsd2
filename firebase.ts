import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCwzrz15w-1xdrH3AKOOYIqHXVZFIquCP8",
  authDomain: "lablink-ab7aa.firebaseapp.com",
  projectId: "lablink-ab7aa",
  storageBucket: "lablink-ab7aa.firebasestorage.app",
  messagingSenderId: "582820061141",
  appId: "1:582820061141:web:d80c7f723f22bcb855675c",
  measurementId: "G-J8960KTX3P"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
