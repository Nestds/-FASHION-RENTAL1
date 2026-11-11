/**
 * DRESSÉ – Firebase Initialization & Connection Diagnostics
 * Compliant with Firebase Integration Security & Error Standards
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  authInstance?: Auth
) {
  const currentAuth = authInstance || auth;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentAuth?.currentUser?.uid,
      email: currentAuth?.currentUser?.email,
      emailVerified: currentAuth?.currentUser?.emailVerified,
      isAnonymous: currentAuth?.currentUser?.isAnonymous,
      tenantId: currentAuth?.currentUser?.tenantId,
      providerInfo: currentAuth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('[Firestore Error Details]:', JSON.stringify(errInfo, null, 2));
  throw new Error(JSON.stringify(errInfo));
}

export interface FirebaseConnectionStatus {
  isConnected: boolean;
  isConfigured: boolean;
  projectId?: string;
  errorMessage?: string;
  isTesting: boolean;
}

// Global Firebase service instances
export let firebaseApp: FirebaseApp | null = null;
export let auth: Auth | null = null;
export let db: Firestore | null = null;
export let storage: FirebaseStorage | null = null;

// Initialize Firebase if config exists in window, localStorage, or environment
export function initFirebase(customConfig?: Record<string, string>): FirebaseConnectionStatus {
  try {
    const existingApps = getApps();
    let config = customConfig;

    // Check Vite environment variables (e.g. from .env file when run locally or hosted on Vercel/GitHub)
    if (!config && typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_API_KEY) {
      config = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
      };
    }

    if (!config && typeof window !== 'undefined') {
      const stored = localStorage.getItem('dresse_firebase_config');
      if (stored) {
        try {
          config = JSON.parse(stored);
        } catch {
          // invalid stored config
        }
      }
    }

    if (!config) {
      return {
        isConnected: false,
        isConfigured: false,
        errorMessage: 'ยังไม่ได้ตั้งค่า Firebase Configuration (กรุณาระบุใน .env หรือปุ่ม Firebase Diagnostics)',
        isTesting: false,
      };
    }

    if (existingApps.length === 0) {
      firebaseApp = initializeApp(config);
    } else {
      firebaseApp = existingApps[0];
    }

    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp, (config as any).firestoreDatabaseId);
    storage = getStorage(firebaseApp);

    return {
      isConnected: true,
      isConfigured: true,
      projectId: config.projectId,
      isTesting: false,
    };
  } catch (err: any) {
    console.warn('Firebase init warning:', err);
    return {
      isConnected: false,
      isConfigured: false,
      errorMessage: err.message,
      isTesting: false,
    };
  }
}

// Test live server connection
export async function testFirestoreConnection(): Promise<{ success: boolean; message: string }> {
  if (!db) {
    return {
      success: false,
      message: 'Firestore ยังไม่ได้ถูก Initialize (ต้องการ Firebase Configuration)',
    };
  }

  try {
    await getDocFromServer(doc(db, 'system', 'connection_test'));
    return { success: true, message: 'เชื่อมต่อ Cloud Firestore จริงสำเร็จเรียบร้อย' };
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      return { success: false, message: 'Client ออฟไลน์ หรือโปรเจกต์ยังไม่ได้เปิดใช้งาน Firestore' };
    }
    // If permission denied or not found, it still proves server connection
    return { success: true, message: 'ติดต่อ Cloud Firestore Server สำเร็จ (' + error.code + ')' };
  }
}
