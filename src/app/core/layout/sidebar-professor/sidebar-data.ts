import { MenuItem } from "../sidebar-aluno/sidebar-data";

export const sidebarDataProfessor: MenuItem[] = [
    {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/teacher/dashboard',
        disabled: true
    },
    {
        label: 'Minhas Turmas',
        icon: 'pi pi-users',
        routerLink: '/turmas'
    },
    {
        label: 'Questões',
        icon: 'pi pi-book',
        routerLink: '/professor/questoes'
    },
    {
        label: 'Trilhas',
        icon: 'pi pi-map',
        routerLink: '/professor/trilhas'
    },
    {
        label: 'Ranking',
        icon: 'pi pi-trophy',
        routerLink: '/ranking'
    },
    {
        label: 'Perfil',
        icon: 'pi pi-user',
        routerLink: '/perfil',
        disabled: true
    }
];
