import { MenuItem } from "../sidebar-aluno/sidebar-data";

export const sidebarDataAdmin: MenuItem[] = [
    {
        label: 'Professores',
        icon: 'pi pi-user-edit',
        routerLink: '/admin/professores'
    },
    {
        label: 'Status do Sistema',
        icon: 'pi pi-server',
        routerLink: '/admin/status'
    }
];
