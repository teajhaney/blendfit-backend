export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  comparePassword(password: string): Promise<boolean>;
}
