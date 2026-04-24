import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
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
                path: '',
                redirectTo: 'aluno/dashboard', // Redirecionamento default dentro do layout
                pathMatch: 'full'
            },
            {
                path: 'turmas',
                loadComponent: () => import('./features/turmas/turmas').then(m => m.Turmas),
                data: { roles: ['student', 'teacher'] },
                canActivate: [roleGuard]
            },
            {
                path: 'aluno/dashboard',
                loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
                data: { roles: ['student'] },
                canActivate: [roleGuard]
            },
            {
                path: 'aluno/trilhas',
                loadComponent: () => import('./features/trilha/trilha').then(m => m.Trilha),
                data: { roles: ['student'] },
                canActivate: [roleGuard]
            },
            {
                path: 'aluno/exercicio/:id',
                loadComponent: () => import('./features/exercicio/exercicio').then(m => m.Exercicio),
                data: { roles: ['student'] },
                canActivate: [roleGuard]
            },
            {
                path: 'professor/questoes',
                loadComponent: () => import('./features/professor/questoes/questoes-professor').then(m => m.QuestoesProfessor),
                data: { roles: ['teacher'] },
                canActivate: [roleGuard]
            },
            {
                path: 'professor/questoes/nova',
                loadComponent: () => import('./features/professor/questoes/criar-questao/criar-questao').then(m => m.CriarQuestao),
                data: { roles: ['teacher'] },
                canActivate: [roleGuard]
            },
            {
                path: 'professor/questoes/gerar',
                loadComponent: () => import('./features/professor/questoes/gerar-questao-ia/gerar-questao-ia').then(m => m.GerarQuestaoIA),
                data: { roles: ['teacher'] },
                canActivate: [roleGuard]
            },
            {
                path: 'ranking',
                loadComponent: () => import('./features/ranking/ranking').then(m => m.RankingPage),
                canActivate: [roleGuard]
            },
            {
                path: 'teste',
                loadComponent: () => import('./features/teste/teste').then(m => m.Teste)
            },
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
