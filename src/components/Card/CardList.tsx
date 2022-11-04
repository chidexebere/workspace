import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Card, CardContainer } from '.';

interface CardListProps {
  listId: string;
  userId: string;
  cards: string[];
}

const CardList = ({ listId, userId, cards }: CardListProps) => {
  return (
    <Droppable droppableId={`${listId}`} type="card">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <CardContainer>
            {cards?.map((card, index) => (
              <Draggable
                key={`${card}${listId}}`}
                draggableId={`${card}${listId}}`}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Card
                      textContent={card}
                      cardId={index}
                      listId={listId}
                      userId={userId}
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
