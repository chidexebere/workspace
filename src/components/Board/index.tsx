import { PencilIcon, TrashIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteBoard, useEditBoard } from '../../firebase/firestore/hooks';
import Confirm from '../Confirm';
import Modal from '../Modal';
import EditBoard from './EditBoard';

interface BoardCoverProps {
  bgColor: string;
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
}

const BoardCover = ({ bgColor, children, onClick }: BoardCoverProps) => {
  const defaultClass =
    'block p-6 rounded h-24 w-full md:max-w-xs cursor-pointer flex';

  const boardClass = bgColor ? `${bgColor} ${defaultClass}` : `${defaultClass}`;

  return (
    <div className={boardClass} onClick={onClick}>
      {children}
    </div>
  );
};

interface BoardTitleProps {
  title?: string;
  titleTextColor?: string;
}

const BoardTitle = ({ title, titleTextColor }: BoardTitleProps) => {
  const defaultClass = 'text-xl leading-tight mb-2 grow';
  const defaultClassWithtitleTextColor =
    'text-xl leading-tight mb-2 grow text-gray-900';

  const boardTitleClass = titleTextColor
    ? `${defaultClass} ${titleTextColor}`
    : `${defaultClassWithtitleTextColor}`;

  return <h5 className={boardTitleClass}>{title}</h5>;
};

interface BoardProps {
  title: string;
  bgColor: string;
  titleTextColor: string;
  userId: string;
  boardId: string;
}

const Board = ({
  bgColor,
  title,
  titleTextColor,
  userId,
  boardId,
}: BoardProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newBgColor, setNewBgColor] = useState(bgColor);
  const [inputTitle, setInputTitle] = useState('');
  const [selectedBgColor, setSelectedBgColor] = useState('');

  const editBoard = useEditBoard();
  const deleteBoard = useDeleteBoard();

  const resetEdit = () => {
    setInputTitle(newTitle);
    setSelectedBgColor(newBgColor);
  };

  const toggleEditModal = () => {
    setShowEditModal(!showEditModal);
  };

  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const openEditModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetEdit();
    toggleEditModal();
  };

  const openDeleteModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleDeleteModal();
  };

  const backgroundColors = [
    'bg-cyan-500',
    'bg-orange-500',
    'bg-lime-500',
    'bg-indigo-500',
  ];

  const handleInputChange = (value: string) => {
    setInputTitle(value);
  };

  const handleBgColorSelection = (value: string) => {
    setSelectedBgColor(value);
  };

  const handleEditBoard = () => {
    // e.preventDefault();
    if (inputTitle !== newTitle) {
      editBoard.mutate({
        userId,
        boardId,
        title: inputTitle,
        bgColor: newBgColor,
      });
      setNewTitle(inputTitle);
    }
    if (selectedBgColor !== newBgColor) {
      editBoard.mutate({
        userId,
        boardId,
        title: newTitle,
        bgColor: selectedBgColor,
      });
      setNewBgColor(selectedBgColor);
    }
    if (inputTitle !== newTitle && selectedBgColor !== newBgColor) {
      editBoard.mutate({
        userId,
        boardId,
        title: inputTitle,
        bgColor: selectedBgColor,
      });
      setNewTitle(inputTitle);
      setNewBgColor(selectedBgColor);
    }
    setShowEditModal(false);
  };

  const handleDeleteBoard = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    deleteBoard.mutate({ userId, boardId });
    toggleDeleteModal();
  };

  const navigate = useNavigate();
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/boards/${boardId}`);
  };
  return (
    <>
      <Modal
        title="Edit Board"
        isOpen={showEditModal}
        handleClick={toggleEditModal}
      >
        <EditBoard
          title={inputTitle}
          bgColor={selectedBgColor}
          backgroundColors={backgroundColors}
          onChange={handleInputChange}
          handleBgColorSelection={handleBgColorSelection}
          toggleModal={toggleEditModal}
          onSubmitHandler={handleEditBoard}
        />
      </Modal>

      <Modal
        title="Delete Board"
        isOpen={showDeleteModal}
        handleClick={toggleDeleteModal}
      >
        <Confirm
          toggleModal={toggleDeleteModal}
          handleSubmit={handleDeleteBoard}
          name="delete"
        >
          <h5 className="text-lg leading-normal text-gray-800">
            Do you want to delete this board and all its content?
          </h5>
        </Confirm>
      </Modal>

      <BoardCover bgColor={newBgColor} onClick={handleClick}>
        <BoardTitle title={newTitle} titleTextColor={titleTextColor} />
        <div className="grow-0">
          <PencilIcon
            className="h-5 w-5 text-gray-400 hover:text-gray-50"
            aria-hidden="true"
            onClick={openEditModal}
          />
          <TrashIcon
            className="mt-3 h-5 w-5 text-gray-400 hover:text-gray-50"
            aria-hidden="true"
            onClick={openDeleteModal}
          />
        </div>
      </BoardCover>
    </>
  );
};

export { Board, BoardCover, BoardTitle };
