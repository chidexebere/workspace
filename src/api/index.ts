import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/firebase.config';
import { v4 as uuidv4 } from 'uuid';

// Helper functions
const getItems = async (item: string) => {
  const q = query(collection(db, item));
  const querySnapshot = await getDocs(q);
  const documents: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    documents.push(doc.data());
  });
  return documents;
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
  const listsOrder = await getItems('listsOrder');
  listsOrder?.[0].order.forEach(async (listsOrderId: string) => {
    const docRef = doc(db, 'lists', listsOrderId);
    await updateDoc(docRef, {
      listIndex: listsOrder?.[0].order.indexOf(listsOrderId),
    });
  });
};

const reOrderCard = async () => {
  const cardsOrder = await getItems('cardsOrder');
  console.log(cardsOrder?.[0].order);
  cardsOrder?.[0].order.forEach(async (cardsOrderId: string) => {
    const docRef = doc(db, 'cards', cardsOrderId);
    await updateDoc(docRef, {
      cardIndex: cardsOrder?.[0].order.indexOf(cardsOrderId),
    });
  });
};

// Boards
export const getBoards = async () => {
  const q = query(collection(db, 'boards'), orderBy('borderIndex', 'asc'));
  const querySnapshot = await getDocs(q);
  const documents: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    documents.push({ id: doc.id, ...doc.data() });
  });
  return documents;
};

export const addBoard = async (title: string, bgColor: string) => {
  try {
    // Get ID
    const uid = uuidv4();
    // Add ID to boardsOrder collection
    await addOrder('boardsOrder', 'boards-order-id', uid);
    // Get boardsOrder collection
    const boardsOrder = await getItems('boardsOrder');

    // Create a new board adding index of created ID
    const docRef = doc(db, 'boards', uid);
    await setDoc(docRef, {
      title: title,
      bgColor: bgColor,
      borderIndex: boardsOrder?.[0].order.indexOf(uid),
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

  // Remove boardId from boardsOrder collection
  const docOrderRef = doc(db, 'boardsOrder', 'boards-order-id');
  await updateDoc(docOrderRef, {
    order: arrayRemove(boardId),
  });

  const boardsOrder = await getItems('boardsOrder');
  const order = boardsOrder?.[0].order;
  order.forEach(async (boardsOrderId: string) => {
    const docRef = doc(db, 'boards', boardsOrderId);
    await updateDoc(docRef, {
      borderIndex: order.indexOf(boardsOrderId),
    });
  });

  await removeItem('lists', 'boardId', boardId, 'listsOrder', 'lists-order-id');
  await reOrderList();

  await removeItem('cards', 'boardId', boardId, 'cardsOrder', 'cards-order-id');
  await reOrderCard();
};

// Lists
export const getListsPerBoard = async (id: string) => {
  const q = query(
    collection(db, 'lists'),
    where('boardId', '==', `${id}`),
    orderBy('listIndex', 'asc'),
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
    // Get ID
    const uid = uuidv4();
    // Add ID to listsOrder collection
    await addOrder('listsOrder', 'lists-order-id', uid);
    // Get listsOrder collection
    const listsOrder = await getItems('listsOrder');
    const docRef = doc(db, 'lists', uid);
    await setDoc(docRef, {
      title: title,
      boardId: boardId,
      listIndex: listsOrder?.[0].order.indexOf(uid),
    });
    console.log('List created with ID: ', docRef.id);
  } catch (e) {
    console.error('Error creating board: ', e);
  }
};

export const editList = async (title: string, listId: string) => {
  const docRef = doc(db, 'lists', listId);

  await updateDoc(docRef, {
    title: title,
  });
};

export const deleteList = async (listId: string) => {
  await deleteDoc(doc(db, 'lists', listId));

  // Remove listId from listsOrder collection
  const docOrderRef = doc(db, 'listsOrder', 'lists-order-id');
  await updateDoc(docOrderRef, {
    order: arrayRemove(listId),
  });

  await reOrderList();

  // Remove all Cards under listId
  await removeItem('cards', 'listId', listId, 'cardsOrder', 'cards-order-id');
  await reOrderCard();
};

// Cards
export const getCardsPerBoard = async (id: string) => {
  const q = query(
    collection(db, 'cards'),
    where('boardId', '==', `${id}`),
    orderBy('cardIndex', 'asc'),
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
    // Get ID
    const uid = uuidv4();
    // Add ID to cardsOrder collection
    await addOrder('cardsOrder', 'cards-order-id', uid);
    // Get cardsOrder collection
    const cardsOrder = await getItems('cardsOrder');

    const docRef = doc(db, 'cards', uid);
    await setDoc(docRef, {
      textContent: textContent,
      listId: listId,
      boardId: boardId,
      cardIndex: cardsOrder?.[0].order.indexOf(uid),
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
  // const cardsCopyIndexes: number[] = [];
  // cardsCopy.forEach((card: DocumentData) => {
  //   cardsCopyIndexes.push(card.cardIndex);
  // });
  // cardsCopyIndexes.sort((a, b) => a - b);

  // const cardsOrder = await getItems('cardsOrder');
  // const cardsOrderCopy = cardsOrder?.[0].order;

  // for (let i = 0; i < cardsCopy.length; i++) {
  //   const docRef = doc(db, 'cards', cardsCopy[i].id);
  //   await updateDoc(docRef, {
  //     cardIndex: cardsCopyIndexes[i],
  //   });

  //   const sourceIndex = cardsOrderCopy.findIndex(
  //     (id: string) => id === cardsCopy[i].id,
  //   );
  //   cardsOrderCopy.splice(sourceIndex, 1);
  //   cardsOrderCopy.splice(cardsCopyIndexes[i], 0, cardsCopy[i].id);
  // }

  // cardsOrderCopy.forEach(async (cardId: string) => {
  //   const docOrderRef = doc(db, 'cardsOrder', 'cards-order-id');
  //   await updateDoc(docOrderRef, {
  //     order: arrayRemove(cardId),
  //   });
  // });

  // cardsOrderCopy.forEach((cardId: string) => {
  //   addOrder('cardsOrder', 'cards-order-id', cardId);
  // });

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
  // const cardsCopyIndexes: number[] = [];
  // cardsCopy.forEach((card: DocumentData) => {
  //   cardsCopyIndexes.push(card.cardIndex);
  // });
  // cardsCopyIndexes.sort((a, b) => a - b);

  // const cardsOrder = await getItems('cardsOrder');
  // const cardsOrderCopy = cardsOrder?.[0].order;

  // for (let i = 0; i < cardsCopy.length; i++) {
  //   const docRef = doc(db, 'cards', cardsCopy[i].id);
  //   await updateDoc(docRef, {
  //     cardIndex: cardsCopyIndexes[i],
  //   });

  //   const sourceIndex = cardsOrderCopy.findIndex(
  //     (id: string) => id === cardsCopy[i].id,
  //   );
  //   cardsOrderCopy.splice(sourceIndex, 1);
  //   cardsOrderCopy.splice(cardsCopyIndexes[i], 0, cardsCopy[i].id);
  // }

  // cardsOrderCopy.forEach(async (cardId: string) => {
  //   const docOrderRef = doc(db, 'cardsOrder', 'cards-order-id');
  //   await updateDoc(docOrderRef, {
  //     order: arrayRemove(cardId),
  //   });
  // });

  // cardsOrderCopy.forEach((cardId: string) => {
  //   addOrder('cardsOrder', 'cards-order-id', cardId);
  // });

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

  const docRef = doc(db, 'cards', cardId);
  await updateDoc(docRef, {
    listId: listId,
  });
};
