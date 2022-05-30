import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

// Boards

export const getBoards = async () => {
  const q = query(collection(db, 'boards'), orderBy('timestamp', 'asc'));
  const querySnapshot = await getDocs(q);
  const documents: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    documents.push({ id: doc.id, ...doc.data() });
  });
  return documents;
};

export const addBoard = async (title: string, bgColor: string) => {
  try {
    const docRef = await addDoc(collection(db, 'boards'), {
      title: title,
      bgColor: bgColor,
      timestamp: serverTimestamp(),
    });
    console.log('Board created with ID: ', docRef.id);
  } catch (e) {
    console.error('Error creating board: ', e);
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

export const getListsPerBoard = async (id: string) => {
  const q = query(
    collection(db, 'lists'),
    where('boardId', '==', `${id}`),
    orderBy('timestamp', 'asc'),
  );
  const querySnapshot = await getDocs(q);
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
      timestamp: serverTimestamp(),
    });
    console.log('List created with ID: ', docRef.id);
  } catch (e) {
    console.error('Error creating list: ', e);
  }
};

export const editList = async (
  listId: string,
  title: string,
  boardId: string,
) => {
  const docRef = doc(db, 'lists', listId);

  await updateDoc(docRef, {
    title: title,
    boardId: boardId,
  });
};

export const deleteList = async (listId: string) => {
  await deleteDoc(doc(db, 'lists', listId));
};

// Cards

export const getCardsPerBoard = async (id: string) => {
  const q = query(
    collection(db, 'cards'),
    where('boardId', '==', `${id}`),
    orderBy('timestamp', 'asc'),
  );
  const querySnapshot = await getDocs(q);
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
      timestamp: serverTimestamp(),
    });
    console.log('Card created with ID: ', docRef.id);
  } catch (e) {
    console.error('Error creating card: ', e);
  }
};

export const editCard = async (
  cardId: string,
  textContent: string,
  listId: string,
  boardId: string,
) => {
  const docRef = doc(db, 'cards', cardId);

  await updateDoc(docRef, {
    textContent: textContent,
    listId: listId,
    boardId: boardId,
  });
};

export const deleteCard = async (cardId: string) => {
  await deleteDoc(doc(db, 'cards', cardId));
};
