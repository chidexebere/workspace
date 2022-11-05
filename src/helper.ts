export const getInitials = (nameString: string) => {
  const fullName = nameString.split(' ');
  const initials = fullName[0].charAt(0) + fullName[1].charAt(0);
  return initials.toUpperCase();
};
