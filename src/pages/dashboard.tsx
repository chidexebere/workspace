import Layout from '../layout';
import BoardList from '../components/Board/BoardList';
import { useBoards } from '../api/hooks';

const Dashboard = () => {
  // const { isLoading, isError, data } = useBoards(true);

  const { isLoading, isError, data } = useBoards();

  if (isError) {
    return <div>An error occured</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <Layout>{data && <BoardList boards={data} />}</Layout>;
};

export default Dashboard;
