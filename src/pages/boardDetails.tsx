import { useParams } from 'react-router-dom';
import { useBoards, useCachedBoards, useListsPerBoard } from '../api/hooks';
import BoardContent from '../components/Board/BoardContent';
import Layout from '../layout';

const BoardDetails = () => {
  const cachedBoardsData = useCachedBoards();
  // const { data: boards } = useBoards(
  //   cachedBoardsData === undefined ? true : false,
  // );

  const { data: boards } = useBoards();

  const boardsData = cachedBoardsData === undefined ? boards : cachedBoardsData;

  const { id: boardId } = useParams<Params>();
  const board = boardsData?.find((item) => item.id === boardId);

  const { isLoading, data: lists } = useListsPerBoard(boardId as string);
  // console.log(lists);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      {board && lists && (
        <BoardContent
          boardId={board.id}
          boardTitle={board.title}
          boardBgColor={board.bgColor}
          lists={lists}
        />
      )}
    </Layout>
  );
};

export default BoardDetails;
