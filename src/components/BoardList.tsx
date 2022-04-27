import { DocumentData } from 'firebase/firestore';
import { useState } from 'react';
import { Board } from './Board';
import Breadcrumb from './Breadcrumb';
import { CreateBoard } from './Create';

interface Props {
  boards: DocumentData[];
}

const BoardList = ({ boards }: Props) => {
  const [boardList, setBoardList] = useState(boards);

  // console.log(boardList);

  return (
    <>
      <Breadcrumb>
        <li className="text-gray-600">Dashboard</li>
      </Breadcrumb>

      <div className="mt-12 grid grid-cols-1 gap-y-12 gap-x-4 sm:grid-cols-2 lg:grid-cols-4">
        {boardList.map((board) => (
          <div key={board.id}>
            <Board
              bgColor={board.bgColor}
              title={board.title}
              titleTextColor="text-white"
              boardId={board.id}
              boards={boardList}
              setBoardList={setBoardList}
            />
          </div>
        ))}

        <CreateBoard boards={boardList} setBoardList={setBoardList} />
      </div>
    </>
  );
};

export default BoardList;
