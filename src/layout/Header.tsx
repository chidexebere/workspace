import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="fixed top-0 z-10 w-full h-20">
      <nav className="flex items-center justify-center bg-teal-500 p-4">
        <Link to="/">
          <h1 className="font-semibold text-2xl uppercase tracking-tight text-slate-100 hover:text-white">
            WorkSpace
          </h1>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
