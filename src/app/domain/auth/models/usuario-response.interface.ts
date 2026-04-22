export interface UsuarioResponse {
  username: string;
  email: string;
  role: 'student' | 'teacher';
}