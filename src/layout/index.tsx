import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const boardsPath = '/boards';
  let footer;

  location.pathname === boardsPath && (footer = <Footer />);
  const addedClass =
    location.pathname === boardsPath
      ? `h-full min-h-[calc(100vh-10rem)]`
      : `h-[calc(100vh-8rem)]`;

  return (
    <>
      <Header />
      <main className={`relative top-20  p-4 sm:p-8 md:p-10 ${addedClass}`}>
        {children}
      </main>
      {footer}
    </>
  );
};

export default Layout;
