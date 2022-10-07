import { auth, db } from '../firebase/firebase.config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';

// Add New User

export const addNewUser = async ({ fullname, email, password }: newUser) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log(userCredential);
    const docRef = doc(db, 'users', userCredential.user.uid);
    await setDoc(
      docRef,
      {
        fullname,
        email,
        boards: [],
      },
      { merge: true },
    );
  } catch (e) {
    console.error('Error creating new user: ', e);
  }
};
