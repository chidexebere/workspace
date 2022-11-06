import { Link } from 'react-router-dom';
import Avatar from '../components/Avatar';
import { deleteUserData } from '../firebase/firestore';

interface HeaderProps {
  signOut: () => void;
  deleteAuthUser: () => void;
  user: AuthUser | null;
}

const Header = ({ signOut, user, deleteAuthUser }: HeaderProps) => {
  const handleLogout = async () => {
    signOut();
    if (user !== null) {
      if (user.email === null && user.displayName === null) {
        deleteAuthUser();
        await deleteUserData(user.uid);
      }
    }
  };
  return (
    <header className="sticky top-0">
      <nav className="flex items-center justify-between bg-teal-500 p-4">
        <Link to="/">
          <h1 className="md:ml-8 font-semibold text-3xl uppercase tracking-tight text-slate-100 hover:text-white">
            WorkSpace
          </h1>
        </Link>
        <div className="flex gap-x-4">
          {user && <Avatar user={user} />}
          <button
            className="bg-zinc-700 hover:bg-zinc-900 text-white font-bold py-2 px-4 border border-zinc-700 rounded"
            onClick={handleLogout}
          >
            logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
