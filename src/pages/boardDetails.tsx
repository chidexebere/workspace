import Layout from '../layout';
import { useAuth } from '../firebase/auth/context';
import BoardContainer from '../components/Board/BoardContainer';

const BoardDetails = () => {
  const { authUser } = useAuth();

  return <Layout>{authUser && <BoardContainer user={authUser} />}</Layout>;
};

export default BoardDetails;
