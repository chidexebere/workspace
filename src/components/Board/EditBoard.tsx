import { CheckIcon } from '@heroicons/react/solid';
import Button from '../Button';

interface EditBoardProps {
  title: string;
  bgColor: string;
  backgroundColors: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBgColorSelection: (e: React.MouseEvent<HTMLButtonElement>) => void;
  toggleModal: () => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => void;
}

const EditBoard = ({
  title,
  bgColor,
  backgroundColors,
  onChange,
  handleSubmit,
  handleBgColorSelection,
  toggleModal,
}: EditBoardProps) => {
  return (
    <form className="mb-3 p-4" onSubmit={handleSubmit}>
      <label htmlFor="formInput"></label>
      <input
        type="text"
        className="inputClass text-gray-700 bg-white"
        id="formInput"
        placeholder="Enter board title"
        autoFocus={true}
        value={title}
        onChange={onChange}
      />

      <div className="mt-5">
        <h5 className="text-lg font-medium leading-normal text-gray-800">
          Select background color
        </h5>
        <div className="my-3 flex gap-x-2 justify-center">
          {backgroundColors.map((backgroundColor, index) => (
            <div key={index}>
              <Button
                variant={`${backgroundColor} focus:${backgroundColor} active:${backgroundColor} text-white`}
                value={backgroundColor}
                handleClick={handleBgColorSelection}
              >
                {backgroundColor === bgColor && (
                  <CheckIcon className="h-6 w-6" aria-hidden="true" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 flex gap-x-3 justify-end">
        <Button
          variant="text-black border border-gray-300"
          handleClick={toggleModal}
        >
          <span className="uppercase">cancel</span>
        </Button>
        <Button variant="bg-teal-500 text-white" handleClick={handleSubmit}>
          <span className="uppercase">save changes</span>
        </Button>
      </div>
    </form>
  );
};

export default EditBoard;
