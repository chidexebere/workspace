import { DocumentData } from 'firebase/firestore';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import BoardContent from '../components/BoardContent';
import Layout from '../layout';
import { getBoards } from '../utils/api';
import { Params } from '../utils/types';

const BoardDetails = () => {
  const { id: boardId } = useParams<Params>();

  const { isLoading, error, data } = useQuery<DocumentData[], Error>(
    ['boards'],
    getBoards,
  );
  const board = data?.filter((item) => item.id === boardId);

  if (error) {
    return <div>{error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      {board && (
        <BoardContent
          boardId={boardId}
          boardTitle={board[0].title}
          boardBgColor={board[0].bgColor}
        />
      )}
    </Layout>
  );
};

export default BoardDetails;
