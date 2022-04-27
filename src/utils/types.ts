import { DocumentData } from 'firebase/firestore';

export type Params = {
  id: string;
};

export type newListObject = {
  boardId: string;
  title: string;
};

export type listState = {
  lists: DocumentData[] | undefined;
};
