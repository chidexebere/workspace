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
  where,
} from 'firebase/firestore';
import { db } from '../firebase/firebase.config';
import { v4 as uuidv4 } from 'uuid';

// Helper functions
const getOrder = async (item: string, id: string) => {
  const docRef = doc(db, item, id);
  const docSnap = await getDoc(docRef);
  let document: DocumentData = {};

  if (docSnap.exists()) {
    document = docSnap.data();
  } else {
    console.log('document not available');
    document;
  }
  const empty: string[] = [];
  const docOrder = empty.concat(document.order);

  return docOrder;
};

const removeItem = async (
  dbCollection: string,
  id: string,
  queryId: string,
  orderCollection: string,
  orderId: string,
) => {
  const q = query(collection(db, dbCollection), where(id, '==', `${queryId}`));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (docu) => {
    // remove all item with id = docu.id from order collection
    const docOrderRef = doc(db, orderCollection, orderId);
    await updateDoc(docOrderRef, {
      order: arrayRemove(docu.id),
    });
    // remove item from collection
    deleteDoc(docu.ref);
  });
};

// Add ID to order collection
const addOrder = async (
  orderCollection: string,
  orderCollectionId: string,
  itemId: string,
) => {
  const docOrderRef = doc(db, orderCollection, orderCollectionId);
  await setDoc(
    docOrderRef,
    {
      order: arrayUnion(itemId),
    },
    { merge: true },
  );
};

const reOrderList = async () => {
  const listsOrder = await getOrder('listsOrder', 'lists-order-id');
  listsOrder.forEach(async (listsOrderId: string) => {
    const docRef = doc(db, 'lists', listsOrderId);
    await updateDoc(docRef, {
      listIndex: listsOrder.indexOf(listsOrderId),
    });
  });
};

const reOrderCard = async () => {
  const cardsOrder = await getOrder('cardsOrder', 'cards-order-id');

  cardsOrder.forEach(async (cardsOrderId: string) => {
    const docRef = doc(db, 'cards', cardsOrderId);
    await updateDoc(docRef, {
      cardIndex: cardsOrder.indexOf(cardsOrderId),
    });
  });
};

// Boards
export const getBoards = async () => {
  const q = query(collection(db, 'boards'));
  // const q = query(collection(db, 'boards'), orderBy('borderIndex', 'asc'));
  const querySnapshot = await getDocs(q);
  const documents: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    documents.push({ id: doc.id, ...doc.data() });
  });
  return documents;
};

// export const addBoard = async (title: string, bgColor: string) => {
//   try {
//     // Get ID
//     const uid = uuidv4();
//     // Add ID to boardsOrder collection
//     await addOrder('boardsOrder', 'boards-order-id', uid);
//     // Get boardsOrder collection
//     const boardsOrder = await getOrder('boardsOrder', 'boards-order-id');

//     // Create a new board adding index of created ID
//     const docRef = doc(db, 'boards', uid);
//     await setDoc(docRef, {
//       title: title,
//       bgColor: bgColor,
//       borderIndex: boardsOrder.indexOf(uid),
//     });
//     console.log('Board created with ID: ', docRef.id);
//   } catch (e) {
//     console.error('Error creating board: ', e);
//   }
// };

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

  // // Remove boardId from boardsOrder collection
  // const docOrderRef = doc(db, 'boardsOrder', 'boards-order-id');
  // await updateDoc(docOrderRef, {
  //   order: arrayRemove(boardId),
  // });

  // const boardsOrder = await getOrder('boardsOrder', 'boards-order-id');
  // boardsOrder.forEach(async (boardsOrderId: string) => {
  //   const docRef = doc(db, 'boards', boardsOrderId);
  //   await updateDoc(docRef, {
  //     borderIndex: boardsOrder.indexOf(boardsOrderId),
  //   });
  // });

  // await removeItem('lists', 'boardId', boardId, 'listsOrder', 'lists-order-id');
  // await reOrderList();

  // await removeItem('cards', 'boardId', boardId, 'cardsOrder', 'cards-order-id');
  // await reOrderCard();
};

// Lists
export const getListsPerBoard = async (boardId: string) => {
  const q = query(collection(db, `boards/${boardId}/lists`));
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
  // const docRef = doc(db, 'lists', listId);

  const docRef = doc(db, `boards/${boardId}/lists`, listId);

  await updateDoc(docRef, {
    title: title,
  });
};

export const deleteList = async (listId: string, boardId: string) => {
  await deleteDoc(doc(db, `boards/${boardId}/lists`, listId));
};

// Cards
// export const getCardsPerBoard = async (id: string) => {
//   const q = query(
//     collection(db, 'cards'),
//     where('boardId', '==', `${id}`),
//     orderBy('cardIndex', 'asc'),
//   );
//   const querySnapshot = await getDocs(q);
//   const documents: DocumentData[] = [];
//   querySnapshot.forEach((doc) => {
//     documents.push({ id: doc.id, ...doc.data() });
//   });
//   return documents;
// };

export const addCard = async (
  textContent: string,
  listId: string,
  boardId: string,
) => {
  try {
    // Get ID
    const uid = uuidv4();
    // Add ID to cardsOrder collection
    await addOrder('cardsOrder', 'cards-order-id', uid);
    // Get cardsOrder collection
    const cardsOrder = await getOrder('cardsOrder', 'cards-order-id');

    const docRef = doc(db, 'cards', uid);
    await setDoc(docRef, {
      textContent: textContent,
      listId: listId,
      boardId: boardId,
      cardIndex: cardsOrder.indexOf(uid),
    });
    console.log('Card created with ID: ', docRef.id);
  } catch (e) {
    console.error('Error creating board: ', e);
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

  // Remove cardId from cardsOrder collection
  const docOrderRef = doc(db, 'cardsOrder', 'cards-order-id');
  await updateDoc(docOrderRef, {
    order: arrayRemove(cardId),
  });

  await reOrderCard();
};

export const dragCardsInSameList = async (cardsCopy: DocumentData[]) => {
  cardsCopy.forEach(async (card: DocumentData) => {
    const docOrderRef = doc(db, 'cardsOrder', 'cards-order-id');
    await updateDoc(docOrderRef, {
      order: arrayRemove(card.id),
    });
  });

  cardsCopy.forEach(async (card: DocumentData) => {
    const docOrderRef = doc(db, 'cardsOrder', 'cards-order-id');
    await updateDoc(docOrderRef, {
      order: arrayUnion(card.id),
    });
  });

  await reOrderCard();
};

export const dragCardsBetweenList = async (
  cardsCopy: DocumentData[],
  cardId: string,
  listId: string,
) => {
  // const cardsOrder1 = await getOrder('cardsOrder', 'cards-order-id');
  // console.log(`1 : ${cardsOrder1}`);
  cardsCopy.forEach(async (card: DocumentData) => {
    const docOrderRef = doc(db, 'cardsOrder', 'cards-order-id');
    await updateDoc(docOrderRef, {
      order: arrayRemove(card.id),
    });
  });

  // const cardsOrder2 = await getOrder('cardsOrder', 'cards-order-id');
  // console.log(`2 : ${cardsOrder2}`);

  cardsCopy.forEach(async (card: DocumentData) => {
    const docOrderRef = doc(db, 'cardsOrder', 'cards-order-id');
    await updateDoc(docOrderRef, {
      order: arrayUnion(card.id),
    });
  });

  // const cardsOrder3 = await getOrder('cardsOrder', 'cards-order-id');
  // console.log(`3 : ${cardsOrder3}`);

  await reOrderCard();

  const docRef = doc(db, 'cards', cardId);
  await updateDoc(docRef, {
    listId: listId,
  });
};
