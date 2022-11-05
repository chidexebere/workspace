import Layout from '../layout';
import BoardList from '../components/Board/BoardList';
import { useAuth } from '../firebase/auth/context';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Dashboard = () => {
  const { authUser, isLoading } = useAuth();
  const navigate = useNavigate();

  // Listen for changes to loading and authUser, redirect if needed
  useEffect(() => {
    if (!isLoading && !authUser) {
      navigate('/');
    }
  }, [authUser, isLoading]);

  return <Layout>{authUser && <BoardList user={authUser} />}</Layout>;
};

export default Dashboard;
