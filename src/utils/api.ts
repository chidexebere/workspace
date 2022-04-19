import { collection, DocumentData, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

export const getDashItems = async (item: string) => {
  const querySnapshot = await getDocs(collection(db, item));
  const documents: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    documents.push({ id: doc.id, ...doc.data() });
  });
  return documents;
};
