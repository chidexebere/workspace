type Params = {
  id: string;
};

type newBoardObject = {
  title: string;
  bgColor: string;
};

type newListObject = {
  boardId: string;
  title: string;
};

type existingListObject = {
  title: string;
  listId: string;
};

type newCardObject = {
  textContent: string;
  listId: string;
  boardId: string;
};

type dragBetweenObject = {
  cardsCopy: DocumentData[];
  cardId: string;
  listId: string;
};
