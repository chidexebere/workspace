import { DocumentData } from 'firebase/firestore';
import { Board } from '.';
import Breadcrumb from '../Breadcrumb';
import { CreateBoard } from '../Create';

interface Props {
  boards: DocumentData[];
}

const BoardList = ({ boards }: Props) => {
  return (
    <>
      <Breadcrumb>
        <li className="">Dashboard</li>
      </Breadcrumb>

      <div className="mt-12 grid grid-cols-1 gap-y-12 gap-x-4 sm:grid-cols-2 lg:grid-cols-4">
        {boards.map((board) => (
          <Board
            key={board.id}
            bgColor={board.bgColor}
            title={board.title}
            titleTextColor="text-white"
            boardId={board.id}
          />
        ))}

        <CreateBoard />
      </div>
    </>
  );
};

export default BoardList;
