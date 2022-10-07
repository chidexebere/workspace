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

type newCardObject = {
  textContent: string;
  listId: string;
  boardId: string;
};

type dragCardsObject = {
  cards: string[];
  listId: string;
  boardId: string;
};

type dragCardsBetweenObject = {
  sourceCards: string[];
  destCards: string[];
  sourceListId: string;
  destListId: string;
  boardId: string;
};

type newUser = {
  fullname: string;
  email: string;
  password: string;
};
