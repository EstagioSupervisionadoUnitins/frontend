export interface MenuItem {
    label: string;
    icon: string;
    routerLink: string;
    disabled?: boolean;
}


export const sidebarDataAluno: MenuItem[] = [
    {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/aluno/dashboard'
    },
    {
        label: 'Trilha de Aprendizado',
        icon: 'pi pi-briefcase',
        routerLink: '/aluno/trilhas'
    },
    {
        label: 'Ranking',
        icon: 'pi pi-trophy',
        routerLink: '/ranking'
    },
    {
        label: 'Perfil',
        icon: 'pi pi-user',
        routerLink: '/perfil'
    }
];