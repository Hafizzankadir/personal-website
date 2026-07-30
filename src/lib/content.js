import {
  collection,
  doc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  limit as fsLimit,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import {
  mockMarketOutlook,
  mockTradeIdeas,
  mockPhilosophy,
  mockKnowledgeHub,
  mockProjects,
} from './mockData';

// Thin Firestore data-access layer. Every read gracefully falls back to
// mock data when Firebase hasn't been configured yet (no API keys) or when
// a call fails (e.g. collection doesn't exist yet), so the public site is
// always fully functional.

async function safeGetCollection(name, orderField) {
  if (!isFirebaseConfigured) return null;
  try {
    const q = orderField
      ? query(collection(db, name), orderBy(orderField, 'desc'))
      : collection(db, name);
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn(`[content] falling back to mock data for "${name}":`, err.message);
    return null;
  }
}

// ---------- Market Outlook ----------

export async function getMarketOutlook(period) {
  const docs = await safeGetCollection('marketOutlook', 'updatedAt');
  if (docs) {
    const match = docs.find((d) => d.period === period);
    if (match) return match;
  }
  return mockMarketOutlook[period] ?? null;
}

export async function getAllMarketOutlookEntries() {
  const docs = await safeGetCollection('marketOutlook', 'updatedAt');
  return docs ?? Object.values(mockMarketOutlook);
}

export async function publishMarketOutlook(entry) {
  if (!isFirebaseConfigured) throw new Error('Firebase is not configured yet.');
  const ref = await addDoc(collection(db, 'marketOutlook'), {
    ...entry,
    updatedAt: new Date().toISOString().slice(0, 10),
  });
  return ref.id;
}

// ---------- Trade Ideas ----------

export async function getTradeIdeas() {
  const docs = await safeGetCollection('tradeIdeas', 'date');
  return docs ?? mockTradeIdeas;
}

export async function addTradeIdea(idea) {
  if (!isFirebaseConfigured) throw new Error('Firebase is not configured yet.');
  const ref = await addDoc(collection(db, 'tradeIdeas'), idea);
  return ref.id;
}

export async function updateTradeIdea(id, updates) {
  if (!isFirebaseConfigured) throw new Error('Firebase is not configured yet.');
  await updateDoc(doc(db, 'tradeIdeas', id), updates);
}

// ---------- Philosophy ----------

export async function getPhilosophy() {
  if (!isFirebaseConfigured) return mockPhilosophy;
  try {
    const snap = await getDocs(query(collection(db, 'philosophy'), fsLimit(1)));
    if (snap.empty) return mockPhilosophy;
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
  } catch (err) {
    console.warn('[content] falling back to mock philosophy:', err.message);
    return mockPhilosophy;
  }
}

export async function savePhilosophy(philosophyDocId, data) {
  if (!isFirebaseConfigured) throw new Error('Firebase is not configured yet.');
  const id = philosophyDocId || 'main';
  await setDoc(doc(db, 'philosophy', id), data, { merge: true });
}

// ---------- Knowledge Hub ----------

export async function getKnowledgeHub() {
  const docs = await safeGetCollection('knowledgeHub', 'date');
  return docs ?? mockKnowledgeHub;
}

export async function addKnowledgeHubEntry(entry) {
  if (!isFirebaseConfigured) throw new Error('Firebase is not configured yet.');
  const ref = await addDoc(collection(db, 'knowledgeHub'), entry);
  return ref.id;
}

// ---------- Projects ----------

export async function getProjects() {
  const docs = await safeGetCollection('projects');
  return docs ?? mockProjects;
}
