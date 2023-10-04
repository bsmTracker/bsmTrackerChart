export type User = {
  id: number;
  name: string;
  email: string;
  level: number;
  createdAt: string;
};

export type UserLoginDto = {
  email: string;
  password: string;
};
