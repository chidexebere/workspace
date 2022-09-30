import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

// Boards
export const getBoards = async () => {
  const q = query(collection(db, 'boards'), orderBy('createdAt', 'asc'));
  const querySnapshot = await getDocs(q);
  const documents: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    documents.push({ id: doc.id, ...doc.data() });
  });
  return documents;
};

export const addBoard = async (title: string, bgColor: string) => {
  try {
    // Add a new board with a generated id.
    const docRef = await addDoc(collection(db, 'boards'), {
      title: title,
      bgColor: bgColor,
      createdAt: serverTimestamp(),
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
export const getListsPerBoard = async (boardId: string) => {
  const q = query(
    collection(db, `boards/${boardId}/lists`),
    orderBy('createdAt', 'asc'),
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
    // Add a new list with a generated id.
    const docRef = await addDoc(collection(db, `boards/${boardId}/lists`), {
      title: title,
      cards: [],
      createdAt: serverTimestamp(),
    });
    console.log('List created with ID: ', docRef.id);
  } catch (e) {
    console.error('Error creating board: ', e);
  }
};

export const editList = async (
  title: string,
  listId: string,
  boardId: string,
) => {
  const docRef = doc(db, `boards/${boardId}/lists`, listId);
  await updateDoc(docRef, {
    title: title,
  });
};

export const deleteList = async (listId: string, boardId: string) => {
  await deleteDoc(doc(db, `boards/${boardId}/lists`, listId));
};

// Cards
export const addCard = async (
  textContent: string,
  listId: string,
  boardId: string,
) => {
  try {
    // Add a new list with a generated id.
    const docRef = doc(db, `boards/${boardId}/lists`, listId);
    await updateDoc(docRef, {
      cards: arrayUnion(textContent),
    });

    console.log('New card created');
  } catch (e) {
    console.error('Error creating board: ', e);
  }
};

export const editCard = async (
  cardId: number,
  textContent: string,
  listId: string,
  boardId: string,
) => {
  const docRef = doc(db, `boards/${boardId}/lists`, listId);
  const list = (await getDoc(docRef)).data();
  const cards = list?.cards;
  cards.splice(cardId, 1, textContent);

  await setDoc(
    docRef,
    {
      cards: cards,
    },
    { merge: true },
  );
};

export const deleteCard = async (
  textContent: string,
  listId: string,
  boardId: string,
) => {
  const docRef = doc(db, `boards/${boardId}/lists`, listId);
  await updateDoc(docRef, {
    cards: arrayRemove(textContent),
  });
};

export const dragCardsInSameList = async ({
  cards,
  listId,
  boardId,
}: dragCardsObject) => {
  const docRef = doc(db, `boards/${boardId}/lists`, listId);
  await setDoc(
    docRef,
    {
      cards: cards,
    },
    { merge: true },
  );
};

export const dragCardsBetweenList = async ({
  sourceCards,
  destCards,
  sourceListId,
  destListId,
  boardId,
}: dragCardsBetweenObject) => {
  const docSourceRef = doc(db, `boards/${boardId}/lists`, sourceListId);
  await setDoc(
    docSourceRef,
    {
      cards: sourceCards,
    },
    { merge: true },
  );

  const docDestRef = doc(db, `boards/${boardId}/lists`, destListId);
  await setDoc(
    docDestRef,
    {
      cards: destCards,
    },
    { merge: true },
  );
};
