import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
// import { useLogout } from '../firebase/db/hooks';
import { useAuth } from '../firebase/auth/context';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // const navigate = useNavigate();
  // const { mutate } = useLogout();
  const { signOut } = useAuth();

  const location = useLocation();
  const boardsPath = '/boards';
  let footer;

  location.pathname === boardsPath && (footer = <Footer />);
  const addedClass =
    location.pathname === boardsPath
      ? `h-full min-h-[calc(100vh-10rem)]`
      : `h-[calc(100vh-8rem)]`;

  // const handleLogout = () => {
  //   mutate(undefined, {
  //     onSuccess: () => navigate('/'),
  //   });
  // };

  return (
    <>
      <Header handleLogout={signOut} />
      <main className={`relative top-20  p-4 sm:p-8 md:p-10 ${addedClass}`}>
        {children}
      </main>
      {footer}
    </>
  );
};

export default Layout;
