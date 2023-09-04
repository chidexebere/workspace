import { PlusIcon } from '@heroicons/react/outline';

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

export default AddList;
