type Params = {
  id: string;
};

type Timestamp = {
  seconds: number;
  nanoseconds: number;
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

type newUser = {
  fullname: string;
  email: string;
  password: string;
};

type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

type newLogin = {
  email: string;
  password: string;
};

type newUserObject = newUser | undefined;

type newLoginObject = newlogin | undefined;
