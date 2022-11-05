import { getInitials } from '../helper';

interface Props {
  user: AuthUser;
}

const Avatar = ({ user }: Props) => {
  const initials = user.displayName ? getInitials(user.displayName) : 'G';
  return (
    <div className="inline-flex overflow-hidden relative justify-center items-center w-10 h-10 bg-blue-300 rounded-full ">
      <span className="font-medium text-gray-600">{initials}</span>
    </div>
  );
};

export default Avatar;
