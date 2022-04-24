import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

// Boards

export const getBoards = async () => {
  const querySnapshot = await getDocs(collection(db, 'boards'));
  const documents: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    documents.push({ id: doc.id, ...doc.data() });
  });
  return documents;
};

// export const getBoardById = async (id: string) => {
//   const q = query(collection(db, 'boards'), where('boardId', '==', `${id}`));
//   const querySnapshot = await getDocs(q);
//   const documents: DocumentData[] = [];
//   querySnapshot.forEach((doc) => {
//     documents.push({ id: doc.id, ...doc.data() });
//   });
//   return documents;
// };

export const addBoard = async (title: string, bgColor: string) => {
  try {
    const docRef = await addDoc(collection(db, 'boards'), {
      title: title,
      bgColor: bgColor,
    });
    console.log('Document written with ID: ', docRef.id);
    // return docRef;
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const editBoard = async (
  boardId: string,
  title: string,
  bgColor: string,
) => {
  const docRef = doc(db, 'boards', boardId);

  await updateDoc(docRef, {
    title: title,
    bgColor: bgColor,
  });
};

export const deleteBoard = async (boardId: string) => {
  await deleteDoc(doc(db, 'boards', boardId));
};

// Lists

export const getLists = async () => {
  const querySnapshot = await getDocs(collection(db, 'lists'));
  const documents: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    documents.push({ id: doc.id, ...doc.data() });
  });
  return documents;
};

export const addList = async (title: string, boardId: string) => {
  try {
    const docRef = await addDoc(collection(db, 'lists'), {
      title: title,
      boardId: boardId,
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const editList = async (
  listId: string,
  title: string,
  boardId: string,
) => {
  const washingtonRef = doc(db, 'lists', listId);

  await updateDoc(washingtonRef, {
    title: title,
    boardId: boardId,
  });
};

export const deleteList = async (listId: string) => {
  await deleteDoc(doc(db, 'lists', listId));
};

// Cards

export const getCards = async () => {
  const querySnapshot = await getDocs(collection(db, 'cards'));
  const documents: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    documents.push({ id: doc.id, ...doc.data() });
  });
  return documents;
};

export const addCard = async (
  textContent: string,
  listId: string,
  boardId: string,
) => {
  try {
    const docRef = await addDoc(collection(db, 'cards'), {
      textContent: textContent,
      listId: listId,
      boardId: boardId,
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const editCard = async (
  cardId: string,
  textContent: string,
  listId: string,
  boardId: string,
) => {
  const washingtonRef = doc(db, 'cards', cardId);

  await updateDoc(washingtonRef, {
    textContent: textContent,
    listId: listId,
    boardId: boardId,
  });
};

export const deleteCard = async (cardId: string) => {
  await deleteDoc(doc(db, 'cards', cardId));
};
