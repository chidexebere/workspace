import { User } from 'firebase/auth';
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
import { db } from '../firebase.config';

// Users
// Add new user on auth change
export const addNewUserIfNotFound = async (user: User) => {
  const docRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log('User already exits');
  } else {
    setDoc(
      docRef,
      {
        createdAt: serverTimestamp(),
      },
      { merge: true },
    );
  }
};

export const deleteUserData = async (userId: string) => {
  await deleteDoc(doc(db, 'users', userId));
};

// Boards
export const getBoards = async (userId: string) => {
  const q = query(
    collection(db, `users/${userId}/boards`),
    orderBy('createdAt', 'asc'),
  );
  const querySnapshot = await getDocs(q);
  const documents: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    documents.push({ id: doc.id, ...doc.data() });
  });
  return documents;
};

export const addBoard = async (
  userId: string,
  title: string,
  bgColor: string,
) => {
  try {
    // Add a new board with a generated id.
    const docRef = await addDoc(collection(db, `users/${userId}/boards`), {
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
  userId: string,
  boardId: string,
  title: string,
  bgColor: string,
) => {
  const docRef = doc(db, `users/${userId}/boards`, boardId);

  await updateDoc(docRef, {
    title: title,
    bgColor: bgColor,
  });
};

export const deleteBoard = async (userId: string, boardId: string) => {
  await deleteDoc(doc(db, `users/${userId}/boards`, boardId));
};

// Lists
export const getListsPerBoard = async (userId: string, boardId: string) => {
  const q = query(
    collection(db, `users/${userId}/boards/${boardId}/lists`),
    orderBy('createdAt', 'asc'),
  );
  const querySnapshot = await getDocs(q);
  const documents: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    documents.push({ id: doc.id, ...doc.data() });
  });
  return documents;
};

export const addList = async (
  title: string,
  userId: string,
  boardId: string,
) => {
  try {
    // Add a new list with a generated id.
    const docRef = await addDoc(
      collection(db, `users/${userId}/boards/${boardId}/lists`),
      {
        title: title,
        cards: [],
        createdAt: serverTimestamp(),
      },
    );
    console.log('List created with ID: ', docRef.id);
  } catch (e) {
    console.error('Error creating board: ', e);
  }
};

export const editList = async (
  title: string,
  listId: string,
  boardId: string,
  userId: string,
) => {
  const docRef = doc(db, `users/${userId}/boards/${boardId}/lists`, listId);
  await updateDoc(docRef, {
    title: title,
  });
};

export const deleteList = async (
  listId: string,
  boardId: string,
  userId: string,
) => {
  await deleteDoc(doc(db, `users/${userId}/boards/${boardId}/lists`, listId));
};

// Cards
export const addCard = async (
  textContent: string,
  listId: string,
  boardId: string,
  userId: string,
) => {
  try {
    // Add a new list with a generated id.
    const docRef = doc(db, `users/${userId}/boards/${boardId}/lists`, listId);
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
  userId: string,
) => {
  const docRef = doc(db, `users/${userId}/boards/${boardId}/lists`, listId);
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
  userId: string,
) => {
  const docRef = doc(db, `users/${userId}/boards/${boardId}/lists`, listId);
  await updateDoc(docRef, {
    cards: arrayRemove(textContent),
  });
};

export const dragCardsInSameList = async ({
  cards,
  listId,
  boardId,
  userId,
}: dragCardsObject) => {
  const docRef = doc(db, `users/${userId}/boards/${boardId}/lists`, listId);
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
  userId,
}: dragCardsBetweenObject) => {
  const docSourceRef = doc(
    db,
    `users/${userId}/boards/${boardId}/lists`,
    sourceListId,
  );
  await setDoc(
    docSourceRef,
    {
      cards: sourceCards,
    },
    { merge: true },
  );

  const docDestRef = doc(
    db,
    `users/${userId}/boards/${boardId}/lists`,
    destListId,
  );
  await setDoc(
    docDestRef,
    {
      cards: destCards,
    },
    { merge: true },
  );
};
