type Params = {
  id: string;
};

type UserId = {
  userId: string;
};

type newBoardObject = {
  userId: string;
  title: string;
  bgColor: string;
};

type newListObject = {
  userId: string;
  boardId: string;
  title: string;
};

type newCardObject = {
  textContent: string;
  listId: string;
  boardId: string;
  userId: string;
};

type dragCardsObject = {
  cards: string[];
  listId: string;
  boardId: string;
  userId: string;
};

type dragCardsBetweenObject = {
  sourceCards: string[];
  destCards: string[];
  sourceListId: string;
  destListId: string;
  boardId: string;
  userId: string;
};

type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};
