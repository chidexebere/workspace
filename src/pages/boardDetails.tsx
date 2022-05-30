import { useParams } from 'react-router-dom';
import { useCachedBoards } from '../api/hooks';
import BoardContent from '../components/Board/BoardContent';
import Layout from '../layout';

const BoardDetails = () => {
  const { id: boardId } = useParams<Params>();

  const boardsData = useCachedBoards();
  const board = boardsData?.filter((item) => item.id === boardId);

  return (
    <Layout>
      {board && (
        <BoardContent
          boardId={board[0].id}
          boardTitle={board[0].title}
          boardBgColor={board[0].bgColor}
        />
      )}
    </Layout>
  );
};

export default BoardDetails;
