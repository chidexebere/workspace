import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const APIKEY = process.env.REACT_APP_FIREBASE_CONFIG_KEY;

const firebaseConfig = {
  apiKey: APIKEY,
  authDomain: 'workspace-api-2810a.firebaseapp.com',
  projectId: 'workspace-api-2810a',
  storageBucket: 'workspace-api-2810a.appspot.com',
  messagingSenderId: '360411721331',
  appId: '1:360411721331:web:d252c764b07ea57bc20406',
  measurementId: 'G-Z95DW9V4YP',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { app, db, auth };
