import { signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase.config';

// sign In Anonymously
export const signInAnon = async () => {
  try {
    await signInAnonymously(auth);
    console.log(`user signed in`);
  } catch (e) {
    console.error('Error signing in ', e);
  }
};
