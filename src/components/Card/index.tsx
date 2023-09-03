import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDeleteCard, useEditCard } from '../../firebase/firestore/hooks';
import Button from '../Button';
import Modal from '../Modal';
import { PlusIcon } from '@heroicons/react/outline';
import Confirm from '../Confirm';

const defaultCardClass = `form-control block w-full m-0 px-3 py-1.5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out
focus:text-gray-700 focus:bg-white focus:border-gray-700 focus:outline-none`;

interface CardContainerProps {
  children: React.ReactNode;
}
const CardContainer = ({ children }: CardContainerProps) => {
  return <div className="flex flex-col p-2 overflow-y-auto"> {children}</div>;
};

interface AddCardFormProps {
  textContent: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => void;
  children: React.ReactNode;
}

const AddCardForm = ({
  textContent,
  onChange,
  handleSubmit,
  children,
}: AddCardFormProps) => {
  return (
    <form className="mb-2 p-4" onSubmit={handleSubmit}>
      <label htmlFor="formTextarea"></label>
      <textarea
        className={`${defaultCardClass}`}
        id="formTextarea"
        rows={2}
        value={textContent}
        placeholder="Enter title for this ticket"
        autoFocus={true}
        onChange={onChange}
      ></textarea>

      {children}
    </form>
  );
};

interface EditCardProps {
  textContent: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => void;
  toggleOpenCardModal: () => void;
  listId: string;
  boardId: string;
  userId: string;
}
const EditCard = ({
  textContent,
  onChange,
  handleSubmit,
  toggleOpenCardModal,
  listId,
  boardId,
  userId,
}: EditCardProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareLink, setShowShareLink] = useState(false);

  const deleteCard = useDeleteCard();

  const { id } = useParams<Params>();

  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const toggleShareLink = () => {
    setShowShareLink(!showShareLink);
  };

  const handleDeleteCard = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    deleteCard.mutate({ textContent, listId, boardId, userId });
    toggleDeleteModal();
    toggleOpenCardModal();
  };

  return (
    <>
      <form className="mb-2 p-4" onSubmit={handleSubmit}>
        <label htmlFor="formTextarea"></label>
        <textarea
          className={`${defaultCardClass}`}
          id="formTextarea"
          rows={2}
          value={textContent}
          placeholder="Enter title for this ticket"
          autoFocus={true}
          onChange={onChange}
        ></textarea>

        <div className="mt-10 flex flex-col gap-3 justify-center items-center">
          <Button
            variant="text-black border-0 shadow-none"
            handleClick={toggleShareLink}
          >
            <span className="uppercase">share link to this ticket</span>
          </Button>

          {showShareLink && (
            <input
              type="text"
              className="inputClass text-gray-700 bg-white"
              id="formInput"
              placeholder=""
              autoFocus={true}
              value={`http://localhost:3000/boards/${id}`}
            />
          )}
          <Button
            variant="text-red-600 border-0 shadow-none"
            handleClick={toggleDeleteModal}
          >
            <span className="uppercase">delete this ticket</span>
          </Button>
        </div>

        <div className="mt-20 flex gap-x-3 justify-end">
          <Button
            variant="text-black border border-gray-300"
            handleClick={toggleOpenCardModal}
          >
            <span className="uppercase">cancel</span>
          </Button>
          <Button variant="bg-teal-500 text-white" handleClick={handleSubmit}>
            <span className="uppercase">save changes</span>
          </Button>
        </div>
      </form>

      <Modal
        title="Delete Ticket"
        isOpen={showDeleteModal}
        handleClick={toggleDeleteModal}
      >
        <Confirm
          toggleModal={toggleDeleteModal}
          handleSubmit={handleDeleteCard}
          name="delete"
        >
          <h5 className="text-lg leading-normal text-gray-800">
            Do you want to delete this ticket?
          </h5>
        </Confirm>
      </Modal>
    </>
  );
};

const defaultAddCardClass = `w-11/12 px-3 py-1.5 text-sm bg-clip-padding rounded transition ease-in-out m-0 font-medium text-gray-700 bg-slate-100 hover:bg-slate-200 font-light flex gap-x-1 items-center`;

interface AddCardProps {
  onClick: (e: React.MouseEvent) => void;
}
const AddCard = ({ onClick }: AddCardProps) => {
  return (
    <div className="mb-2 mx-2 cursor-pointer">
      <div className={defaultAddCardClass} onClick={onClick}>
        <PlusIcon className="h-5 w-5" aria-hidden="true" />
        <span>Add a card</span>
      </div>
    </div>
  );
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

export { Card, EditCard, AddCard, AddCardForm, CardContainer };
