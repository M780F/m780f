import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  deleteDoc, 
  serverTimestamp,
  Timestamp,
  updateDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export interface WordDocument {
  id: string;
  userId: string;
  title: string;
  pages: string[];
  headerContent: string;
  footerContent: string;
  updatedAt: any;
  createdAt: any;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const documentService = {
  async createDocument(userId: string, title: string = 'Untitled Document'): Promise<string> {
    const docId = doc(collection(db, 'documents')).id;
    const path = `documents/${docId}`;
    try {
      const newDoc = {
        userId,
        title,
        pages: [''],
        headerContent: '',
        footerContent: '',
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'documents', docId), newDoc);
      return docId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return '';
    }
  },

  async updateDocument(docId: string, updates: Partial<WordDocument>) {
    const path = `documents/${docId}`;
    try {
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };
      // Remove immutable fields if they accidentally slipped in
      delete (updateData as any).userId;
      delete (updateData as any).createdAt;
      delete (updateData as any).id;

      await updateDoc(doc(db, 'documents', docId), updateData);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async getDocuments(userId: string): Promise<WordDocument[]> {
    const path = 'documents';
    try {
      const q = query(
        collection(db, 'documents'),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WordDocument[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async getDocument(docId: string): Promise<WordDocument | null> {
    const path = `documents/${docId}`;
    try {
      const docSnap = await getDoc(doc(db, 'documents', docId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as WordDocument;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  async deleteDocument(docId: string) {
    const path = `documents/${docId}`;
    try {
      await deleteDoc(doc(db, 'documents', docId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
};
