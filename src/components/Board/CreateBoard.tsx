import { useState } from 'react';
import { useAddBoard } from '../../firebase/firestore/hooks';
import Modal from '../Modal';
import AddBoard from './AddBoard';
import EditBoard from './EditBoard';

const CreateBoard = ({ userId }: UserId) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [bgColor, setBgColor] = useState('');

  const addNewBoard = useAddBoard();

  const toggleModal = () => {
    setShowModal(!showModal);
    setTitle('');
    setBgColor('');
  };

  const backgroundColors = [
    'bg-cyan-500',
    'bg-orange-500',
    'bg-lime-500',
    'bg-indigo-500',
  ];

  const handleInputChange = (value: string) => {
    setTitle(value);
  };

  const handleBgColorSelection = (value: string) => {
    setBgColor(value);
  };

  const handleAddBoard = () => {
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
          onSubmitHandler={handleAddBoard}
        />
      </Modal>

      <AddBoard handleClick={toggleModal} />
    </>
  );
};

export default CreateBoard;
