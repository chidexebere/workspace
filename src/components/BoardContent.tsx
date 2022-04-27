import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext } from 'react-beautiful-dnd';
// import {
//   dragCardsBetweenList,
//   dragCardsInSameList,
//   getLists,
// } from '../state/actions';
import Breadcrumb from './Breadcrumb';
import { CreateList } from './Create';
import { List } from './List';
import {
  collection,
  DocumentData,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

interface Props {
  boardId: string;
  boardTitle: string;
  boardBgColor: string;
}
const BoardContent = ({ boardId, boardTitle, boardBgColor }: Props) => {
  const [lists, setLists] = useState<DocumentData[]>([]);
  const [cards, setCards] = useState<DocumentData[]>([]);
  const getListsPerBoard = async () => {
    const q = query(collection(db, 'lists'), where('boardId', '==', boardId));
    const querySnapshot = await getDocs(q);
    const documents: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    setLists(documents);
  };
  // const { data: listsPerBoard } = useQuery<DocumentData[], Error>(
  //   ['lists'],
  //   getListsPerBoard,
  // );
  // setLists(listsPerBoard);

  const getCardsPerBoard = async () => {
    const q = query(collection(db, 'cards'), where('boardId', '==', boardId));
    const querySnapshot = await getDocs(q);
    const documents: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    setCards(documents);
  };
  // const { data: cardsPerBoard } = useQuery<DocumentData[], Error>(
  //   ['cards'],
  //   getCardsPerBoard,
  // );
  // setCards(cardsPerBoard);
  // console.log(cardsPerBoard);

  useEffect(() => {
    getListsPerBoard();
    getCardsPerBoard();
  }, []);

  const handleOnDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    // console.log(result);

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const cardsCopy = cards.slice();
      const [removed] = cardsCopy.splice(source.index, 1);
      cardsCopy?.splice(destination.index, 0, removed);

      // dispatch(dragCardsInSameList(cardsCopy));
    }

    if (source.droppableId !== destination.droppableId) {
      const cardsCopy = cards.slice();
      cardsCopy.splice(source.index, 1);

      const destinationDroppableId = Number(destination.droppableId);

      // dispatch(
      //   dragCardsBetweenList(
      //     cardsCopy,
      //     draggableId,
      //     destinationDroppableId,
      //     destination.index,
      //   ),
      // );
    }
  };

  // useEffect(() => {
  //   dispatch(getLists(boardId));
  // }, []);

  return (
    <>
      <Breadcrumb>
        <li className="hover:text-gray-500">
          <Link to={`/boards`}>Dashboard</Link>
        </li>
        <li>
          <span className="text-gray-500 mx-2">/</span>
        </li>
        <li className="text-gray-600">{boardTitle}</li>
      </Breadcrumb>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        {lists && (
          <div className="mt-10 grid grid-flow-col overflow-x-auto h-full items-start auto-cols-220 gap-x-2 md:auto-cols-270 md:gap-x-4">
            {lists.map((list) => (
              <div key={`${list.id}`}>
                <List
                  title={list.title}
                  listId={list.id}
                  boardId={boardId}
                  bgColor={boardBgColor}
                  lists={lists}
                  setLists={setLists}
                  cards={cards}
                  setCards={setCards}
                />
              </div>
            ))}

            <CreateList boardId={boardId} lists={lists} setLists={setLists} />
          </div>
        )}
      </DragDropContext>
    </>
  );
};

export default BoardContent;
