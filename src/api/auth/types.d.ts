export interface TLogin {
  email: string;
  password: string;
}

export interface TUpdate {
  id: string;
  username: string;
  email: string;
  password: string | null;
  role: number;
}
