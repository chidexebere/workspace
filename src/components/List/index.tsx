import { useState } from 'react';
import { useDeleteList, useEditList } from '../../firebase/firestore/hooks';
import CardList from '../Card/CardList';
import CreateCard from '../Card/CreateCard';
import Confirm from '../Confirm';
import Modal from '../Modal';
import { EditListHeader, ListHeader } from './EditListHeader';

interface ListContainerProps {
  children: React.ReactNode;
}

const ListContainer = ({ children }: ListContainerProps) => {
  return <div className="rounded bg-slate-100"> {children}</div>;
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

export { List, ListContainer };
