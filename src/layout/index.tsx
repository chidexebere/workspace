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

  return (
    <div className="bg-teal-50 min-h-screen">
      <Header
        signOut={signOut}
        user={authUser}
        deleteAuthUser={deleteAuthUser}
      />
      <main className={`p-4 sm:p-8 md:p-10 mb-12`}>{children}</main>
      {footer}
    </div>
  );
};

export default Layout;
