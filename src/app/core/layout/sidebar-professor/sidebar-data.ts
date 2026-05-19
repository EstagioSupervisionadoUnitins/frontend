import { MenuItem } from "../sidebar-aluno/sidebar-data";

export const sidebarDataProfessor: MenuItem[] = [
    {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/professor/dashboard'
    },
    {
        label: 'Minhas Turmas',
        icon: 'pi pi-users',
        routerLink: '/turmas'
    },
    {
        label: 'Solicitações',
        icon: 'pi pi-user-plus',
        routerLink: '/professor/solicitacoes'
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
    }
];
