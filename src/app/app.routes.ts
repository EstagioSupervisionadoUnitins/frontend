import { Routes } from '@angular/router';

export const routes: Routes = [


    {
        path: 'login',
        loadComponent: () => import('./features/login/login').then(m => m.Login)
    },
    {
        path: '',
        loadComponent: () => import('./core/layout/main-layout/main-layout').then(m => m.MainLayout),
        children: [
            {
                path: 'teste',
                loadComponent: () => import('./features/teste/teste').then(m => m.Teste)
            }
        ]
    }
];
