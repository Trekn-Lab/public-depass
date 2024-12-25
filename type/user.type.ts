export type User = {
  id: string;
  project_id: string;
  user_id: string;
  role: string;
  is_deleted: boolean;
  created_at?: string;
  updated_at?: string;
  name: string;
  username: string;
};
