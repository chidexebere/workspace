import { BoardCover, BoardTitle } from '.';

interface AddBoardProps {
  handleClick: () => void;
}

const AddBoard = ({ handleClick }: AddBoardProps) => {
  return (
    <BoardCover bgColor="bg-slate-100" onClick={handleClick}>
      <BoardTitle title="Create new board" />
    </BoardCover>
  );
};

export default AddBoard;
