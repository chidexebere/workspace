interface Props {
  children: React.ReactNode;
}

const Loading = ({ children }: Props) => {
  return (
    <div
      className="mt-20 flex justify-center items-center text-2xl text-cyan-600"
      role="alert"
      aria-label="loading"
    >
      {children}
    </div>
  );
};

export default Loading;
