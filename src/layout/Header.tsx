import { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Confirm from '../components/Confirm';
import Modal from '../components/Modal';
import { deleteUserData } from '../firebase/firestore';

interface HeaderProps {
  signOut: () => void;
  deleteAuthUser: () => void;
  user: AuthUser | null;
}

const Header = ({ signOut, user, deleteAuthUser }: HeaderProps) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
  };

  const isGuest = user?.email === null && user?.displayName === null;
  const userName = (currentUser: AuthUser) => {
    if (currentUser.email !== null && currentUser.displayName !== null) {
      return `${currentUser.displayName.split(' ')[0]}`;
    } else {
      return 'Guest';
    }
  };

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
    <header className="sticky top-0 h-20">
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
            onClick={toggleLogoutModal}
          >
            logout
          </button>
        </div>
      </nav>
      <Modal
        title="Logout"
        isOpen={showLogoutModal}
        handleClick={toggleLogoutModal}
      >
        <Confirm
          toggleModal={toggleLogoutModal}
          handleSubmit={handleLogout}
          name="logout"
        >
          <h5 className="text-lg leading-normal text-gray-800">
            Are you sure you want to logout... {user && userName(user)}?
          </h5>

          <p className="mt-4 text-base leading-normal text-blue-600">
            {isGuest
              ? `Your data will be deleted once you logout.`
              : `Your data will be saved and will be available on your next login.`}
          </p>
        </Confirm>
      </Modal>
    </header>
  );
};

export default Header;
