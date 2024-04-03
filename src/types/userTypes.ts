interface User {
  id: string;
  userId: string;
  displayName: string;
}

interface UserDto extends Omit<User, "id"> {}

export { User, UserDto };
