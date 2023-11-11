import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../firebase/auth/context';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { authUser, signOut, deleteAuthUser } = useAuth();

  const location = useLocation();
  const boardsPath = '/boards';
  let footer;

  location.pathname === boardsPath && (footer = <Footer />);

  const addedClass =
    location.pathname === boardsPath
      ? `min-h-[calc(100vh-10rem)]`
      : `min-h-[calc(100vh-5rem)]`;

  return (
    <div className="md:min-h-screen bg-gradient-to-r from-blue-100 to-teal-100 ">
      <Header
        signOut={signOut}
        user={authUser}
        deleteAuthUser={deleteAuthUser}
      />
      <main className={`p-4 sm:p-8 md:p-10 ${addedClass}`}>{children}</main>
      {footer}
    </div>
  );
};

export default Layout;
