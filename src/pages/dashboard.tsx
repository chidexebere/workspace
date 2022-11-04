import Layout from '../layout';
import BoardList from '../components/Board/BoardList';
import { useAuth } from '../firebase/auth/context';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Dashboard = () => {
  const { authUser, isLoading: isLoadingUser } = useAuth();
  const navigate = useNavigate();

  // Listen for changes to loading and authUser, redirect if needed
  useEffect(() => {
    if (!isLoadingUser && !authUser) {
      navigate('/');
    }
  }, [authUser, isLoadingUser]);

  return <Layout>{authUser && <BoardList user={authUser} />}</Layout>;
};

export default Dashboard;
