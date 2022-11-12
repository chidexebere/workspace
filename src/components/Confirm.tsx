import Button from './Button';

interface Props {
  toggleModal: () => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => void;
  children: React.ReactNode;
  name: string;
}
const Confirm = ({ toggleModal, handleSubmit, children, name }: Props) => {
  return (
    <form className="mb-3 p-4" onSubmit={handleSubmit}>
      {children}
      <div className="mt-10 flex gap-x-3 justify-end">
        <Button
          variant="text-black border border-gray-300"
          handleClick={toggleModal}
        >
          <span className="uppercase">cancel</span>
        </Button>
        <Button variant="bg-red-500 text-white" handleClick={handleSubmit}>
          <span className="uppercase">{name}</span>
        </Button>
      </div>
    </form>
  );
};

export default Confirm;
