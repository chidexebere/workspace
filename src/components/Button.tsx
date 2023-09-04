interface Props {
  variant?: string;
  handleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isDisabled?: boolean;
  children: React.ReactNode;
  value?: string;
  type?: 'button' | 'reset' | 'submit';
}

const Button = ({
  variant,
  handleClick,
  isDisabled,
  children,
  value,
  type,
}: Props) => {
  const defaultClass =
    'inline-block px-4 py-2 font-medium text-xs leading-normal rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0  active:shadow-lg transition duration-150 ease-in-out flex align-center';

  const buttonClass = variant
    ? `${defaultClass} ${variant}`
    : `${defaultClass}`;

  const buttonType = type ? type : 'button';

  return (
    <button
      type={buttonType}
      disabled={isDisabled}
      className={buttonClass}
      value={value}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default Button;
