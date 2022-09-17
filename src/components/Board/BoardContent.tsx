import { Link } from 'react-router-dom';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Breadcrumb from '../Breadcrumb';
import { CreateList } from '../Create';
import { List } from '../List';
import {
  useCardsPerBoard,
  useDragCardsInSameList,
  useDragCardsBetweenList,
} from '../../api/hooks';
import { DocumentData } from 'firebase/firestore';

interface Props {
  boardId: string;
  boardTitle: string;
  boardBgColor: string;
  lists: DocumentData[];
}
const BoardContent = ({ boardId, boardTitle, boardBgColor, lists }: Props) => {
  const { data: cards } = useCardsPerBoard(boardId);

  const dragCardsInSameList = useDragCardsInSameList();
  const dragCardsBetweenList = useDragCardsBetweenList();

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId && cards != undefined) {
      const cardsCopy = cards.slice();

      console.log(cards.slice());
      const sourceCardListFirstIndex = cardsCopy.findIndex(
        (card) => card.listId === source.droppableId,
      );

      console.log(sourceCardListFirstIndex);
      const sourceCardList = cardsCopy.filter(
        (card) => card.listId === source.droppableId,
      );

      const [removed] = sourceCardList.splice(source.index, 1);
      sourceCardList.splice(destination.index, 0, removed);

      cardsCopy.splice(
        sourceCardListFirstIndex,
        sourceCardList.length,
        ...sourceCardList,
      );

      console.log(cardsCopy);

      dragCardsInSameList.mutate(cardsCopy);
    }

    if (source.droppableId !== destination.droppableId && cards != undefined) {
      console.log(source.droppableId);
      console.log(destination.droppableId);

      const cardsCopy = cards.slice();

      const sourceCardIndex = cardsCopy.findIndex(
        (card) => card.id === draggableId,
      );
      // const [sourceCard] = cardsCopy.filter((card) => card.id === draggableId);
      // cardsCopy.splice(sourceCardIndex, 1);

      const [sourceCard] = cardsCopy.splice(sourceCardIndex, 1);

      const destinationCardListFirstIndex = cardsCopy.findIndex(
        (card) => card.listId === destination.droppableId,
      );

      console.log(destinationCardListFirstIndex);
      console.log(source.index);
      console.log(destination.index);

      const destinationCardList = cardsCopy.filter(
        (card) => card.listId === destination.droppableId,
      );

      cardsCopy.splice(
        destinationCardListFirstIndex,
        destinationCardList.length,
      );
      destinationCardList.splice(destination.index, 0, sourceCard);

      cardsCopy.splice(
        destinationCardListFirstIndex,
        0,
        ...destinationCardList,
      );

      dragCardsBetweenList.mutate({
        cardsCopy,
        cardId: draggableId,
        listId: destination.droppableId,
      });
    }
  };

  return (
    <>
      <Breadcrumb>
        <li className="text-gray-600 hover:text-gray-800">
          <Link to={`/boards`}>Dashboard</Link>
        </li>
        <li>
          <span className="text-gray-500 mx-2">/</span>
        </li>
        <li className="">{boardTitle}</li>
      </Breadcrumb>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        {lists && (
          <div className="mt-10 grid grid-flow-col overflow-x-auto h-full items-start auto-cols-220 gap-x-2 md:auto-cols-270 md:gap-x-4">
            {lists.map((list) => (
              <List
                key={list.id}
                title={list.title}
                listId={list.id}
                boardId={boardId}
                bgColor={boardBgColor}
                lists={lists}
                cards={list.cards}
              />
            ))}
            <CreateList boardId={boardId} />
          </div>
        )}
      </DragDropContext>
    </>
  );
};

export default BoardContent;
