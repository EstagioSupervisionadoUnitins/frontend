export interface AuthResponse {
  token: string;
  exp: string;
  username: string;
  role: 'student' | 'teacher' | 'super_admin';
}
