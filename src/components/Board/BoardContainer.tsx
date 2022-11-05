import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useBoards, useCachedBoards } from '../../firebase/db/hooks';
import Breadcrumb from '../Breadcrumb';
import BoardContent from './BoardContent';

interface Props {
  user: AuthUser;
}

const BoardContainer = ({ user }: Props) => {
  const { id: boardId } = useParams<Params>();
  const cachedBoardsData = useCachedBoards();

  const { data: boards } = useBoards(user.uid);

  const boardsData = cachedBoardsData === undefined ? boards : cachedBoardsData;

  const board = boardsData?.find((item) => item.id === boardId);

  return (
    <>
      <Breadcrumb>
        <li className="text-blue-600 hover:text-blue-800">
          <Link to={`/boards`}>Dashboard</Link>
        </li>
        <li>
          <span className="text-gray-500 mx-2">/</span>
        </li>
        <li className="">{board?.title}</li>
      </Breadcrumb>

      {board && (
        <BoardContent
          userId={user.uid}
          boardId={board?.id}
          boardBgColor={board?.bgColor}
        />
      )}
    </>
  );
};

export default BoardContainer;
