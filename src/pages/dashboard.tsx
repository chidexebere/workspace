import { DocumentData } from 'firebase/firestore';
import Layout from '../layout';
import { getBoards } from '../utils/api';
import BoardList from '../components/BoardList';
import { useQuery } from 'react-query';

const Dashboard = () => {
  const { isLoading, error, data } = useQuery<DocumentData[], Error>(
    ['boards'],
    getBoards,
  );

  if (error) {
    return <div>{error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <Layout>{data && <BoardList boards={data} />}</Layout>;
};

export default Dashboard;
