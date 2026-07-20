export interface TLogin {
  email: string;
  password: string;
}

export interface TSignup {
  username: string;
  email: string;
  password: string;
  role?: number;
}

export interface TUpdate {
  id: string;
  username: string;
  email: string;
  password: string | null;
  role: number;
}
