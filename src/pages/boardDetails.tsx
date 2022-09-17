import { useParams } from 'react-router-dom';
import { useBoards, useCachedBoards, useListsPerBoard } from '../api/hooks';
import BoardContent from '../components/Board/BoardContent';
import Layout from '../layout';

const BoardDetails = () => {
  const cachedBoardsData = useCachedBoards();
  const { data: boards } = useBoards(
    cachedBoardsData === undefined ? true : false,
  );

  const boardsData = cachedBoardsData === undefined ? boards : cachedBoardsData;

  const { id: boardId } = useParams<Params>();
  const board = boardsData?.filter((item) => item.id === boardId);

  const { isLoading, data: lists } = useListsPerBoard(boardId as string);
  console.log(lists);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      {board && lists && (
        <BoardContent
          boardId={board[0].id}
          boardTitle={board[0].title}
          boardBgColor={board[0].bgColor}
          lists={lists}
        />
      )}
    </Layout>
  );
};

export default BoardDetails;
