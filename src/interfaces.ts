export interface User {
  id: number;
  email: string;
  password?: string;
}

export interface Article {
  id: number;
  title: string;
  body: string;
  category: string;
  submitted_by: string;
  created_at: string;
}
