import { PlusIcon } from '@heroicons/react/outline';

interface AddCardProps {
  onClick: (e: React.MouseEvent) => void;
}
const AddCard = ({ onClick }: AddCardProps) => {
  return (
    <div className="mb-2 mx-2 cursor-pointer">
      <div className="defaultAddCardClass" onClick={onClick}>
        <PlusIcon className="h-5 w-5" aria-hidden="true" />
        <span>Add a card</span>
      </div>
    </div>
  );
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
        className="defaultCardClass"
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

export { AddCard, AddCardForm };
