import { useState } from 'react';
import { XIcon } from '@heroicons/react/outline';
import Button from './Button';
import { AddList, EditListHeader } from './List';
import { AddBoard, EditBoard } from './Board';
import Modal from './Modal';
import { AddCard, AddCardForm } from './Card';
import { useAddBoard, useAddCard, useAddList } from '../api/hooks';

const CreateBoard = () => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [bgColor, setBgColor] = useState('');

  const addNewBoard = useAddBoard();

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const backgroundColors = [
    'bg-cyan-500',
    'bg-orange-500',
    'bg-lime-500',
    'bg-indigo-500',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    setTitle(value);
  };

  const handleBgColorSelection = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.target as HTMLButtonElement;
    setBgColor(value);
  };

  const handleAddBoard = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    if (title && bgColor) {
      const newBoard = { title, bgColor };
      addNewBoard.mutate(newBoard);
    }
    setTitle('');
    setBgColor('');
    toggleModal();
  };

  return (
    <>
      <Modal title="Create Board" isOpen={showModal} handleClick={toggleModal}>
        <EditBoard
          title={title}
          bgColor={bgColor}
          backgroundColors={backgroundColors}
          onChange={handleInputChange}
          handleBgColorSelection={handleBgColorSelection}
          toggleModal={toggleModal}
          handleSubmit={handleAddBoard}
        />
      </Modal>

      <AddBoard handleClick={toggleModal} />
    </>
  );
};

interface CreateListProps {
  boardId: string;
}
const CreateList = ({ boardId }: CreateListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');

  const addNewList = useAddList();

  const toggleForm = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    setTitle(value);
  };

  const handleAddList = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    if (title) {
      const newList = { title, boardId };
      addNewList.mutate(newList);
    }
    setTitle('');
    toggleForm();
  };

  return isOpen ? (
    <EditListHeader title={title} onChange={handleInputChange}>
      <div className="flex gap-x-2 items-center mt-2">
        <Button
          handleClick={handleAddList}
          variant="bg-gray-600 hover:bg-gray-700 text-white"
        >
          Add List
        </Button>
        <XIcon
          className="h-6 w-6 cursor-pointer"
          aria-hidden="true"
          onClick={toggleForm}
        />
      </div>
    </EditListHeader>
  ) : (
    <AddList onClick={toggleForm} />
  );
};

interface CreateCardProps {
  listId: string;
  boardId: string;
}
const CreateCard = ({ listId, boardId }: CreateCardProps) => {
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
      const newCard = { textContent, listId, boardId };
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

export { CreateBoard, CreateList, CreateCard };
