import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/outline';
import { CreateCard } from '../Create';
import { TrashIcon } from '@heroicons/react/solid';
import Button from '../Button';
import Modal from '../Modal';
import CardList from '../Card/CardList';
import { DocumentData } from 'firebase/firestore';
import { useDeleteList, useEditList } from '../../api/hooks';

interface ListContainerProps {
  children: React.ReactNode;
}

const ListContainer = ({ children }: ListContainerProps) => {
  return <div className="flex flex-col rounded bg-slate-100"> {children}</div>;
};

const inputClass = `form-control block w-full px-3 py-1.5 text-base bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none font-medium`;

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
        className={`${inputClass} text-gray-700 bg-white`}
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
        className={`${inputClass} text-gray-700 bg-white font-light flex gap-x-1 items-center`}
        onClick={onClick}
      >
        <PlusIcon className="h-5 w-5" aria-hidden="true" />
        <span>Add a new list</span>
      </div>
    </div>
  );
};

interface DeleteListProps {
  toggleModal: () => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => void;
}
const DeleteList = ({ toggleModal, handleSubmit }: DeleteListProps) => {
  return (
    <form className="mb-3 p-4" onSubmit={handleSubmit}>
      <h5 className="text-lg leading-normal text-gray-800">
        Do you want to delete this list and all its content?
      </h5>

      <div className="mt-10 flex gap-x-3 justify-end">
        <Button
          variant="text-black border border-gray-300"
          handleClick={toggleModal}
        >
          <span className="uppercase">cancel</span>
        </Button>
        <Button variant="bg-red-500 text-white" handleClick={handleSubmit}>
          <span className="uppercase">delete</span>
        </Button>
      </div>
    </form>
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
      className={`${inputClass} ${bgColor} mb-3 cursor-pointer flex items-center`}
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
  boardId: string;
  lists: DocumentData[];
  cards?: DocumentData[];
}
const List = ({ title, bgColor, listId, boardId, cards }: ListProps) => {
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
      editList.mutate({ boardId, title: newTitle, listId });
    }
    setIsEditing(false);
  };

  const handleDeleteList = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    deleteList.mutate(listId);
    toggleModal();
  };

  return (
    <ListContainer>
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

      {<CardList listId={listId} cards={cards} />}

      <CreateCard listId={listId} boardId={boardId} />

      <Modal title="Delete List" isOpen={showModal} handleClick={toggleModal}>
        <DeleteList toggleModal={toggleModal} handleSubmit={handleDeleteList} />
      </Modal>
    </ListContainer>
  );
};

export { ListContainer, EditListHeader, ListHeader, AddList, List, inputClass };
