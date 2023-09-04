import { TrashIcon } from '@heroicons/react/solid';

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

export { EditListHeader, ListHeader };
