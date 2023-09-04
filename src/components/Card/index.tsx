import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEditCard } from '../../firebase/firestore/hooks';
import Modal from '../Modal';
import EditCard from './EditCard';

interface CardContainerProps {
  children: React.ReactNode;
}
const CardContainer = ({ children }: CardContainerProps) => {
  return <div className="flex flex-col p-2 overflow-y-auto"> {children}</div>;
};

interface CardContentProps {
  textContent: string;
  handleClick: () => void;
}
const CardContent = ({ textContent, handleClick }: CardContentProps) => {
  return (
    <div className="mb-2" onClick={handleClick}>
      <div className="shadow transition-shadow duration-300 hover:shadow-xl mb-4 rounded px-1.5 py-2.5 bg-white text-gray-800 cursor-pointer">
        {textContent}
      </div>
    </div>
  );
};

interface CardProps {
  textContent: string;
  cardId: number;
  listId: string;
  userId: string;
}
const Card = ({ textContent, cardId, listId, userId }: CardProps) => {
  const [showOpenCardModal, setShowOpenCardModal] = useState(false);
  const [newTextContent, setNewTextContent] = useState(textContent);
  const [enteredTextContent, setEnteredTextContent] = useState('');

  const editCard = useEditCard();

  const { id: boardId } = useParams() as { id: string };

  const resetEdit = () => {
    setEnteredTextContent(newTextContent);
  };

  const closeEdit = () => {
    setShowOpenCardModal(!showOpenCardModal);
  };

  const toggleOpenCardModal = () => {
    resetEdit();
    setShowOpenCardModal(!showOpenCardModal);
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target as HTMLTextAreaElement;
    setEnteredTextContent(value);
  };

  const handleEditCard = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    if (enteredTextContent !== newTextContent) {
      editCard.mutate({
        cardId,
        textContent: enteredTextContent,
        listId,
        boardId,
        userId,
      });
      setNewTextContent(enteredTextContent);
    }
    setShowOpenCardModal(false);
  };

  return (
    <>
      <Modal
        title="Edit Ticket"
        isOpen={showOpenCardModal}
        handleClick={closeEdit}
      >
        <EditCard
          textContent={enteredTextContent}
          onChange={handleTextAreaChange}
          toggleOpenCardModal={closeEdit}
          handleSubmit={handleEditCard}
          listId={listId}
          boardId={boardId}
          userId={userId}
        />
      </Modal>

      <CardContent
        textContent={newTextContent}
        handleClick={toggleOpenCardModal}
      />
    </>
  );
};

export { Card, CardContainer };
