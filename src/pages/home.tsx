import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useNavigate } from 'react-router-dom';
import { useSignInAnon } from '../firebase/auth/hooks';
import KanbanBoardImage from '../assets/images/kanban-board.png';
import Modal from '../components/Modal';
import { useAuth } from '../firebase/auth/context';
import { auth } from '../firebase/firebase.config';
import Loading from './loading';

const REDIRECT_PAGE = '/boards';

// Configure FirebaseUI.
const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: REDIRECT_PAGE,
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
    GoogleAuthProvider.PROVIDER_ID,
  ],
};

const Home = () => {
  const [login, setLogin] = useState(false);

  const { authUser, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if finished loading and there's an existing user (user is logged in)
  useEffect(() => {
    if (!isLoading && authUser) {
      navigate(REDIRECT_PAGE);
    }
  }, [authUser, isLoading]);

  const { mutate } = useSignInAnon();

  const handleSignInWithAnon = () => {
    mutate(undefined, {
      onSuccess: () => navigate(REDIRECT_PAGE),
    });
  };

  return isLoading || (!isLoading && !!authUser) ? (
    <Loading>Loading...</Loading>
  ) : (
    <section className="flex flex-col lg:flex-row ">
      <div className="flex-1 w-full lg:w-1/2 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
          <div className="sm:text-center lg:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block text-teal-500 xl:inline">WorkSpace</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              A minimal Kanban board on which you can plan your projects, create
              and view tickets.
            </p>
            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
              <button
                className="w-full rounded-md shadow text-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 md:py-4 md:text-lg md:px-10"
                onClick={() => setLogin(!login)}
              >
                Login / Register
              </button>
              <button
                className="mt-3 sm:mt-0 sm:ml-3 w-full rounded-md shadow text-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-rose-500 hover:bg-rose-700 md:py-4 md:text-lg md:px-10"
                onClick={handleSignInWithAnon}
              >
                Continue as guest
              </button>
            </div>
          </div>
        </main>
      </div>

      <div className="flex-1 w-full h-full lg:w-1/2 ">
        <img
          src={KanbanBoardImage}
          loading="lazy"
          width="700"
          height="600"
          alt="Kanban board image"
        />
      </div>
      <Modal
        isOpen={login}
        handleClick={() => setLogin(!login)}
        title="Sign In"
      >
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      </Modal>
    </section>
  );
};

export default Home;
