import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'aluno/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/login/login').then(m => m.Login)
    },
    {
        path: 'signup',
        loadComponent: () => import('./features/signup/signup').then(m => m.Signup)
    },
    {
        path: '',
        loadComponent: () => import('./core/layout/main-layout/main-layout').then(m => m.MainLayout),
        canActivate: [authGuard],
        children: [
            {
                path: 'teste',
                loadComponent: () => import('./features/teste/teste').then(m => m.Teste)
            },
            {
                path: 'aluno/dashboard',
                loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
            },
            {
                path: 'aluno/trilhas',
                loadComponent: () => import('./features/trilha/trilha').then(m => m.Trilha)
            },
            {
                path: 'aluno/exercicio/:id',
                loadComponent: () => import('./features/exercicio/exercicio').then(m => m.Exercicio)
            }
        ]
    }
];
