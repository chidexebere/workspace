import Layout from '../layout';
import { useAuth } from '../firebase/auth/context';
import BoardContainer from '../components/Board/BoardContainer';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const BoardDetails = () => {
  const { authUser, isLoading } = useAuth();

  const navigate = useNavigate();

  // Listen for changes to loading and authUser, redirect if needed
  useEffect(() => {
    if (!isLoading && !authUser) {
      navigate('/');
    }
  }, [authUser, isLoading]);

  return <Layout>{authUser && <BoardContainer user={authUser} />}</Layout>;
};

export default BoardDetails;
