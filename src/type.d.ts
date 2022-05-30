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

type newCardObject = {
  textContent: string;
  listId: string;
  boardId: string;
};
