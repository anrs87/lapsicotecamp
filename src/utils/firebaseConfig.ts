// src/utils/firebaseConfig.ts

// Importaciones necesarias de Firebase SDK
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Importa Firestore
import { getStorage } from 'firebase/storage';     // Importa Storage

// Tu configuración de Firebase, leyendo directamente desde las variables de entorno del archivo .env.
// Asegúrate de que las variables en tu .env estén definidas como KEY="VALOR" sin comas al final
// y que los nombres de las variables aquí (process.env.NEXT_PUBLIC_FIREBASE_API_KEY, etc.)
// coincidan exactamente con los de tu archivo .env.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializa Firebase de forma segura para Next.js
// Esto evita errores de inicialización múltiple en entornos de renderizado del lado del servidor (SSR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exporta las instancias de los servicios de Firebase
// Estas son las variables que importarás en tus otros componentes (como page.tsx)
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); // Exporta la instancia de Firestore
export const storage = getStorage(app); // Exporta la instancia de Cloud Storage