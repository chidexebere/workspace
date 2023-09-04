import { useState } from 'react';
import { useDeleteCard } from '../../firebase/firestore/hooks';
import { useParams } from 'react-router-dom';
import Button from '../Button';
import Modal from '../Modal';
import Confirm from '../Confirm';

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
          className="defaultCardClass"
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

export default EditCard;
