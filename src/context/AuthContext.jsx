import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';

const DEMO_SESSION_KEY = 'demo-admin-session';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });
      return unsubscribe;
    }
    // Demo mode: no Firebase project connected yet. Persist a lightweight
    // client-side session so the admin panel UI is fully clickable.
    setUser(sessionStorage.getItem(DEMO_SESSION_KEY) ? { email: sessionStorage.getItem(DEMO_SESSION_KEY), demo: true } : null);
    setLoading(false);
  }, []);

  async function login(email, password) {
    if (isFirebaseConfigured) {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      setUser(cred.user);
      return;
    }
    if (!email || !password) throw new Error('Email and password are required.');
    sessionStorage.setItem(DEMO_SESSION_KEY, email);
    setUser({ email, demo: true });
  }

  async function logout() {
    if (isFirebaseConfigured) {
      await firebaseSignOut(auth);
      setUser(null);
      return;
    }
    sessionStorage.removeItem(DEMO_SESSION_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isDemo: !isFirebaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
