import { Board } from '.';
import { useBoards } from '../../firebase/firestore/hooks';
import Loading from '../../pages/loading';
import Breadcrumb from '../Breadcrumb';
import { CreateBoard } from '../Create';

interface Props {
  user: AuthUser;
}

const BoardList = ({ user }: Props) => {
  const { isLoading, isError, error, data: boards } = useBoards(user.uid);

  if (isError) {
    return <div>An error occured{error.message}</div>;
  }

  if (isLoading) {
    return <Loading>Loading User Boards...</Loading>;
  }

  return (
    <>
      <h2 className="font-medium leading-tight text-3xl mt-0 mb-8 text-blue-600">
        {user.displayName
          ? `Hello ${user.displayName.split(' ')[0]}`
          : 'Welcome Guest'}
        ,
      </h2>
      <Breadcrumb>
        <li className="">Dashboard</li>
      </Breadcrumb>

      <div className="mt-10 flex flex-wrap flex-col gap-y-10 gap-x-6 md:flex-row ">
        {boards?.map((board) => (
          <Board
            key={board.id}
            bgColor={board.bgColor}
            title={board.title}
            titleTextColor="text-white"
            userId={user.uid}
            boardId={board.id}
          />
        ))}

        <CreateBoard userId={user.uid} />
      </div>
    </>
  );
};

export default BoardList;
