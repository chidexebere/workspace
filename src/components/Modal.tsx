import { XIcon } from '@heroicons/react/outline';

interface Props {
  isOpen: boolean;
  handleClick: (e: React.MouseEvent) => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, handleClick, title, children }: Props) => {
  const defaultClass =
    'grid place-items-center fixed inset-0 z-40 bg-gray-500 bg-opacity-75 transition-opacity';
  const modalClass = isOpen ? `${defaultClass}` : `${defaultClass} hidden`;

  return (
    <div
      className={modalClass}
      id="Modal"
      // tabIndex="-1"
      aria-labelledby="ModalTitle"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-auto pointer-events-none">
        <div className="border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
          <div className="flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
            <h5
              className="text-xl font-medium leading-normal text-gray-800"
              id="ModalScrollableLabel"
            >
              {title}
            </h5>
            <div className="cursor-pointer" onClick={handleClick}>
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
