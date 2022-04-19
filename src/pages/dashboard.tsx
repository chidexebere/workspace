import { useEffect, useState } from 'react';
import { db } from '../firebase/firebase.config';
import { collection, DocumentData, getDocs } from 'firebase/firestore';
import Layout from '../layout';
// import { boardObject } from '../utils/types';

const Dashboard = () => {
  const [blogs, setBlogs] = useState<DocumentData[]>([]);

  const getDashboard = async () => {
    const querySnapshot = await getDocs(collection(db, 'boards'));
    const documents: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    setBlogs(documents);
  };

  console.log(blogs);

  useEffect(() => {
    getDashboard();
  }, []);

  return (
    <Layout>
      {/* {error && <div>{error}</div>}
      {isLoading && <div>Loading...</div>}
      {!isLoading && error === null && boardList && (
        <BoardList boards={boardList} />
      )} */}
      <h1> hello</h1>
    </Layout>
  );
};

export default Dashboard;
