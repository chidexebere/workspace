import { Link } from 'react-router-dom';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Breadcrumb from '../Breadcrumb';
import { CreateList } from '../Create';
import { List } from '../List';
import {
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
  const dragCardsInSameList = useDragCardsInSameList();
  const dragCardsBetweenList = useDragCardsBetweenList();

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const list = lists.find((list) => list.id === source.droppableId);

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
      const sourceList = lists.find((list) => list.id === source.droppableId);
      const destList = lists.find(
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
                // list={list}
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
