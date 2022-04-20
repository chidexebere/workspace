import { useEffect, useState } from 'react';
import { DocumentData } from 'firebase/firestore';
import Layout from '../layout';
import { getItems } from '../utils/api';
import BoardList from '../components/BoardList';
import { useQuery } from 'react-query';

// type Character = {
//   name: string;
// };

const Dashboard = () => {
  // const [boards, setBoards] = useState<DocumentData[]>([]);
  //const item = 'boards'
  // const fetchItems = getItems(item)

  const { isLoading, error, data } = useQuery<DocumentData[], Error>(
    ['boards'],
    getItems,
  );

  console.log(data);

  // useEffect(() => {
  //   getItems('boards');
  //   setBoards(boards);
  // }, []);
  if (error) {
    return <div>{error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <Layout>{data && <BoardList boards={data} />}</Layout>;
};

export default Dashboard;
