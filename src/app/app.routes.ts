import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { classroomGuard } from './core/guards/classroom.guard';

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
                redirectTo: 'aluno/dashboard', 
                pathMatch: 'full'
            },
            {
                path: 'onboarding',
                loadComponent: () => import('./features/onboarding/onboarding').then(m => m.Onboarding),
                data: { roles: ['student'] },
                canActivate: [roleGuard]
            },
            {
                path: 'turmas',
                loadComponent: () => import('./features/turmas/turmas').then(m => m.Turmas),
                data: { roles: ['teacher'] },
                canActivate: [roleGuard]
            },
            {
                path: 'aluno/dashboard',
                loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
                data: { roles: ['student'] },
                canActivate: [roleGuard, classroomGuard]
            },
            {
                path: 'aluno/trilhas',
                loadComponent: () => import('./features/trilha/trilha').then(m => m.Trilha),
                data: { roles: ['student'] },
                canActivate: [roleGuard, classroomGuard]
            },
            {
                path: 'aluno/exercicio/:id',
                loadComponent: () => import('./features/exercicio/exercicio').then(m => m.Exercicio),
                data: { roles: ['student'] },
                canActivate: [roleGuard, classroomGuard]
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
                path: 'professor/questoes/:id/editar',
                loadComponent: () => import('./features/professor/questoes/editar-questao/editar-questao').then(m => m.EditarQuestao),
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
                path: 'professor/trilhas',
                loadComponent: () => import('./features/professor/trilhas/trilhas-professor').then(m => m.TrilhasProfessor),
                data: { roles: ['teacher'] },
                canActivate: [roleGuard]
            },
            {
                path: 'professor/trilhas/nova',
                loadComponent: () => import('./features/professor/trilhas/criar-trilha/criar-trilha').then(m => m.CriarTrilha),
                data: { roles: ['teacher'] },
                canActivate: [roleGuard]
            },
            {
                path: 'professor/trilhas/:id/editar',
                loadComponent: () => import('./features/professor/trilhas/editar-trilha/editar-trilha').then(m => m.EditarTrilha),
                data: { roles: ['teacher'] },
                canActivate: [roleGuard]
            },
            {
                path: 'ranking',
                loadComponent: () => import('./features/ranking/ranking').then(m => m.RankingPage),
                canActivate: [roleGuard]
            },
            {
                path: 'perfil',
                loadComponent: () => import('./features/perfil/perfil').then(m => m.Perfil),
                data: { roles: ['student'] },
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
