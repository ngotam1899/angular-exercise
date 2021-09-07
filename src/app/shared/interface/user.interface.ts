export interface User {
  _id: string;
  name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  isAdmin?: boolean;
  isActive?: boolean;
}