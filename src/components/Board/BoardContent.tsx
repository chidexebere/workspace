import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { CreateList } from '../Create';
import { List } from '../List';
import {
  useDragCardsInSameList,
  useDragCardsBetweenList,
  useListsPerBoard,
} from '../../api/hooks';

interface Props {
  boardId: string;
  boardBgColor: string;
}
const BoardContent = ({ boardId, boardBgColor }: Props) => {
  const { isLoading, data: lists } = useListsPerBoard(boardId as string);

  const dragCardsInSameList = useDragCardsInSameList();
  const dragCardsBetweenList = useDragCardsBetweenList();

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const list = lists?.find((list) => list.id === source.droppableId);

      const cardsCopy = list?.cards.slice();

      const [removed] = cardsCopy.splice(source.index, 1);
      cardsCopy.splice(destination.index, 0, removed);

      dragCardsInSameList.mutate({
        cards: cardsCopy,
        listId: source.droppableId,
        boardId,
      });
    }

    if (source.droppableId !== destination.droppableId) {
      const sourceList = lists?.find((list) => list.id === source.droppableId);
      const destList = lists?.find(
        (list) => list.id === destination.droppableId,
      );

      const sourceCardsCopy = sourceList?.cards.slice();
      const destCardsCopy = destList?.cards.slice();

      const [removed] = sourceCardsCopy.splice(source.index, 1);
      destCardsCopy.splice(destination.index, 0, removed);

      dragCardsBetweenList.mutate({
        sourceCards: sourceCardsCopy,
        destCards: destCardsCopy,
        sourceListId: source.droppableId,
        destListId: destination.droppableId,
        boardId,
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
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
              cards={list.cards}
            />
          ))}
          <CreateList boardId={boardId} />
        </div>
      )}
    </DragDropContext>
  );
};

export default BoardContent;
