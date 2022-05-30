import { Draggable, Droppable } from 'react-beautiful-dnd';
import { DocumentData } from 'firebase/firestore';
import { Card, CardContainer } from './Card';

interface CardListProps {
  listId: string;
  cards?: DocumentData[];
}

const CardList = ({ listId, cards }: CardListProps) => {
  const cardsByListId = cards?.filter((card) => card.listId === listId);

  return (
    <Droppable droppableId={`${listId}`} type="card">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <CardContainer>
            {cardsByListId?.map((card, index) => (
              <Draggable key={card.id} draggableId={`${card.id}`} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Card
                      textContent={card.textContent}
                      cardId={card.id}
                      listId={listId}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </CardContainer>
        </div>
      )}
    </Droppable>
  );
};

export default CardList;
