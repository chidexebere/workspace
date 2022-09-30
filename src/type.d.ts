type Params = {
  id: string;
};

type Timestamp = {
  seconds: number;
  nanoseconds: number;
};

type newBoardObject = {
  title: string;
  bgColor: string;
};

type newListObject = {
  boardId: string;
  title: string;
};

// type listObject = {
//   id: string;
//   title: string;
//   cards: string[];
//   createdAt: Timestamp;
// };

type dragCardsObject = {
  cards: string[];
  listId: string;
  boardId: string;
};

type existingListObject = {
  title: string;
  listId: string;
  boardId: string;
};

type newCardObject = {
  textContent: string;
  listId: string;
  boardId: string;
};

type cardObject = {
  cardId: string;
  boardId: string;
  // textContent: string;
  listId: string;
};

type dragCardsBetweenObject = {
  sourceCards: string[];
  destCards: string[];
  sourceListId: string;
  destListId: string;
  boardId: string;
};
