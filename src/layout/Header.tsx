import { Link } from 'react-router-dom';

interface HeaderProps {
  handleLogout: () => void;
}

const Header = ({ handleLogout }: HeaderProps) => {
  return (
    <header className="fixed top-0 z-10 w-full h-20">
      <nav className="flex items-center justify-between bg-teal-500 p-4">
        <Link to="/">
          <h1 className="md:ml-20 font-semibold text-3xl uppercase tracking-tight text-slate-100 hover:text-white">
            WorkSpace
          </h1>
        </Link>

        <button
          className="bg-zinc-700 hover:bg-zinc-900 text-white font-bold py-2 px-4 border border-zinc-700 rounded"
          onClick={handleLogout}
        >
          logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
