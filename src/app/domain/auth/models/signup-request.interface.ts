export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
}
