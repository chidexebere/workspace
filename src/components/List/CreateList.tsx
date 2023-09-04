import { XIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import { useAddList } from '../../firebase/firestore/hooks';
import Button from '../Button';
import { EditListHeader } from './EditListHeader';
import AddList from './AddList';

interface CreateListProps {
  userId: string;
  boardId: string;
}
const CreateList = ({ userId, boardId }: CreateListProps) => {
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
      const newList = { title, userId, boardId };
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

export default CreateList;
