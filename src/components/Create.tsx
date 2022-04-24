import { useState } from 'react';
import { XIcon } from '@heroicons/react/outline';
import Button from './Button';
import { AddList, EditListHeader } from './List';
// import { useDispatch } from 'react-redux';
// import { addBoard, addCard, addList } from '../state/actions';
// import { AddCard, AddCardForm } from './Card';
import { AddBoard, EditBoard } from './Board';
import Modal from './Modal';
import { addBoard, addCard, addList } from '../utils/api';
import { AddCard, AddCardForm } from './Card';

const CreateBoard = () => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [bgColor, setBgColor] = useState('');
  // const dispatch = useDispatch();

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
      addBoard(title, bgColor);
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

  // const dispatch = useDispatch();

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
      addList(title, boardId);
    }
    setTitle('');
    toggleForm();
  };

  return isOpen ? (
    <EditListHeader
      title={title}
      onChange={handleInputChange}
      handleSubmit={handleAddList}
    >
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

  // const dispatch = useDispatch();

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
      addCard(textContent, listId, boardId);
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
