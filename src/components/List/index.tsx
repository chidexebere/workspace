import { PlusIcon } from '@heroicons/react/outline';
import { TrashIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { useDeleteList, useEditList } from '../../firebase/firestore/hooks';
import CardList from '../Card/CardList';
import CreateCard from '../Card/CreateCard';
import Confirm from '../Confirm';
import Modal from '../Modal';

interface ListContainerProps {
  children: React.ReactNode;
}

const ListContainer = ({ children }: ListContainerProps) => {
  return <div className="rounded bg-slate-100"> {children}</div>;
};

interface EditListHeaderProps {
  title: string;
  children?: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit?: (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => void;
}

const EditListHeader = ({
  title,
  children,
  onChange,
  handleSubmit,
}: EditListHeaderProps) => {
  return (
    <form className="mb-3" onSubmit={handleSubmit} onClick={handleSubmit}>
      <label htmlFor="formInput"></label>
      <input
        type="text"
        className="inputClass text-gray-700 bg-white"
        id="formInput"
        placeholder="Add a new list"
        autoFocus={true}
        value={title}
        onChange={onChange}
      />
      {children}
    </form>
  );
};

interface AddListProps {
  onClick: (e: React.MouseEvent) => void;
}

const AddList = ({ onClick }: AddListProps) => {
  return (
    <div className="mb-3 cursor-pointer">
      <div
        className="inputClass text-gray-700 bg-white font-light flex gap-x-1 items-center"
        onClick={onClick}
      >
        <PlusIcon className="h-5 w-5" aria-hidden="true" />
        <span>Add a new list</span>
      </div>
    </div>
  );
};

interface ListHeaderProps {
  title: string;
  bgColor: string;
  openModal: (e: React.MouseEvent) => void;
  handleClick: (e: React.MouseEvent) => void;
}
const ListHeader = ({
  title,
  bgColor,
  openModal,
  handleClick,
}: ListHeaderProps) => {
  return (
    <div
      className={`inputClass ${bgColor} mb-3 cursor-pointer flex items-center`}
      onClick={handleClick}
    >
      <div className={`text-white grow`}>{title}</div>
      <div className="grow-0">
        <TrashIcon
          className="h-5 w-5 text-gray-400 hover:text-gray-50"
          aria-hidden="true"
          onClick={openModal}
        />
      </div>
    </div>
  );
};

interface ListProps {
  title: string;
  bgColor: string;
  listId: string;
  userId: string;
  boardId: string;
  cards: string[];
}
const List = ({
  title,
  bgColor,
  listId,
  userId,
  boardId,
  cards,
}: ListProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [showModal, setShowModal] = useState(false);

  const editList = useEditList();
  const deleteList = useDeleteList();

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const openDeleteModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleModal();
  };

  const handleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    setNewTitle(value);
  };

  const handleEditList = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    if (newTitle) {
      editList.mutate({ title: newTitle, listId, boardId, userId });
    }
    setIsEditing(false);
  };

  const handleDeleteList = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    deleteList.mutate({ title: '', listId, userId, boardId });
    toggleModal();
  };

  return (
    <ListContainer>
      <div className="">
        {isEditing ? (
          <EditListHeader
            title={newTitle}
            onChange={handleInputChange}
            handleSubmit={handleEditList}
          />
        ) : (
          <ListHeader
            title={newTitle}
            bgColor={bgColor}
            handleClick={handleEditing}
            openModal={openDeleteModal}
          />
        )}
      </div>

      {<CardList listId={listId} cards={cards} userId={userId} />}

      <CreateCard listId={listId} boardId={boardId} userId={userId} />

      <Modal title="Delete List" isOpen={showModal} handleClick={toggleModal}>
        <Confirm
          toggleModal={toggleModal}
          handleSubmit={handleDeleteList}
          name="delete"
        >
          <h5 className="text-lg leading-normal text-gray-800">
            Do you want to delete this list and all its content?
          </h5>
        </Confirm>
      </Modal>
    </ListContainer>
  );
};

export { AddList, EditListHeader, List, ListContainer, ListHeader };
