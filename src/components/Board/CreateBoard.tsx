import { useState } from 'react';
import { AddBoard, EditBoard } from '.';
import { useAddBoard } from '../../firebase/firestore/hooks';
import Modal from '../Modal';

const CreateBoard = ({ userId }: UserId) => {
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
      const newBoard = { userId, title, bgColor };
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

export default CreateBoard;
