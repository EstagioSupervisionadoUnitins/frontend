export interface UsuarioResponse {
    id: number;
    nome: string;
    email: string;
    perfil: {
        id: number;
        label: string;
    };
}