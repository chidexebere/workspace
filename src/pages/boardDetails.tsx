import { useParams, Link } from 'react-router-dom';
import { useBoards, useCachedBoards } from '../firebase/db/hooks';
import BoardContent from '../components/Board/BoardContent';
import Breadcrumb from '../components/Breadcrumb';
import Layout from '../layout';
import { useAuth } from '../firebase/auth/context';

const BoardDetails = () => {
  const { authUser } = useAuth();

  const cachedBoardsData = useCachedBoards();
  // const { data: boards } = useBoards(
  //   cachedBoardsData === undefined ? true : false,
  // );

  const { data: boards } = useBoards(authUser?.uid as string);

  const boardsData = cachedBoardsData === undefined ? boards : cachedBoardsData;

  const { id: boardId } = useParams<Params>();
  const board = boardsData?.find((item) => item.id === boardId);

  return (
    <Layout>
      {authUser && board && (
        <>
          <Breadcrumb>
            <li className="text-gray-600 hover:text-gray-800">
              <Link to={`/boards`}>Dashboard</Link>
            </li>
            <li>
              <span className="text-gray-500 mx-2">/</span>
            </li>
            <li className="">{board.title}</li>
          </Breadcrumb>

          <BoardContent
            userId={authUser.uid}
            boardId={board.id}
            boardBgColor={board.bgColor}
          />
        </>
      )}
    </Layout>
  );
};

export default BoardDetails;
