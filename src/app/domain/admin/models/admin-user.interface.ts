export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'teacher';
  account_status: 'pending' | 'active';
  created_at: string;
  updated_at: string;
}
