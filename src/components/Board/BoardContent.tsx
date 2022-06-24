import { Link } from 'react-router-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import Breadcrumb from '../Breadcrumb';
import { CreateList } from '../Create';
import { List } from '../List';
import {
  useCardsPerBoard,
  useListsPerBoard,
  useDragCardsInSameList,
  useDragCardsBetweenList,
} from '../../api/hooks';
// import { dragCardsInSameList } from '../../api';

interface Props {
  boardId: string;
  boardTitle: string;
  boardBgColor: string;
}
const BoardContent = ({ boardId, boardTitle, boardBgColor }: Props) => {
  const { isLoading, data: lists } = useListsPerBoard(boardId);
  // console.log(lists);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  const { data: cards } = useCardsPerBoard(boardId);

  // console.log(cards);
  const dragCardsInSameList = useDragCardsInSameList();
  const dragCardsBetweenList = useDragCardsBetweenList();

  const handleOnDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId && cards != undefined) {
      // console.log(source.droppableId);
      // console.log(destination.droppableId);

      const cardsCopy = cards.slice();
      const [removed] = cardsCopy.splice(source.index, 1);
      cardsCopy?.splice(destination.index, 0, removed);
      dragCardsInSameList.mutate(cardsCopy);
    }

    if (source.droppableId !== destination.droppableId && cards != undefined) {
      // console.log(source.droppableId);
      // console.log(destination.droppableId);
      // const cardsCopy = cards.slice();
      // cardsCopy.splice(source.index, 1);
      // const destinationDroppableId = Number(destination.droppableId);
      // dispatch(
      //   dragCardsBetweenList(
      //     cardsCopy,
      //     draggableId,
      //     destinationDroppableId,
      //     destination.index,
      //   ),
      // );
      const cardsCopy = cards.slice();
      const [removed] = cardsCopy.splice(source.index, 1);
      cardsCopy?.splice(destination.index, 0, removed);
      // console.log(cardsCopy[source.index].cardIndex);
      // console.log(cardsCopy[destination.index].cardIndex);

      dragCardsBetweenList.mutate({
        cardsCopy,
        cardId: removed.id,
        listId: destination.droppableId,
      });
    }
  };

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
              <List
                key={list.id}
                title={list.title}
                listId={list.id}
                boardId={boardId}
                bgColor={boardBgColor}
                lists={lists}
                cards={cards}
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
