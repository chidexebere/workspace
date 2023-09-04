import { XIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import { useAddCard } from '../../firebase/firestore/hooks';
import Button from '../Button';
import { AddCard, AddCardForm } from './AddCard';

interface CreateCardProps {
  listId: string;
  boardId: string;
  userId: string;
}
const CreateCard = ({ listId, boardId, userId }: CreateCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [textContent, setTextContent] = useState('');

  const addCard = useAddCard();

  const toggleForm = () => {
    setIsOpen(!isOpen);
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target as HTMLTextAreaElement;
    setTextContent(value);
  };

  const handleAddCard = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    if (textContent) {
      const newCard = { textContent, listId, boardId, userId };
      addCard.mutate(newCard);
    }
    setTextContent('');
    toggleForm();
  };

  return isOpen ? (
    <AddCardForm
      textContent={textContent}
      onChange={handleTextAreaChange}
      handleSubmit={handleAddCard}
    >
      <div className="flex gap-x-2 items-center mt-2">
        <Button
          handleClick={handleAddCard}
          variant="bg-gray-600 hover:bg-gray-700 text-white"
        >
          Add Card
        </Button>
        <XIcon
          className="h-6 w-6 cursor-pointer"
          aria-hidden="true"
          onClick={toggleForm}
        />
      </div>
    </AddCardForm>
  ) : (
    <AddCard onClick={toggleForm} />
  );
};

export default CreateCard;
