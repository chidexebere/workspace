interface Props {
  children: React.ReactNode;
}

const Breadcrumb = ({ children }: Props) => {
  return (
    <nav className="rounded-md w-full">
      <ol className="list-reset flex text-2xl">{children}</ol>
    </nav>
  );
};

export default Breadcrumb;
