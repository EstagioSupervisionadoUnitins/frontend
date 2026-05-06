import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { classroomGuard } from './core/guards/classroom.guard';
import { roleRedirectGuard } from './core/guards/role-redirect.guard';

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
        path: 'forgot-password',
        loadComponent: () => import('./features/forgot-password/forgot-password').then(m => m.ForgotPassword)
    },
    {
        path: 'reset-password',
        loadComponent: () => import('./features/reset-password/reset-password').then(m => m.ResetPassword)
    },
    {
        path: '',
        loadComponent: () => import('./core/layout/main-layout/main-layout').then(m => m.MainLayout),
        canActivate: [authGuard],
        children: [
            {
                path: '',
                canActivate: [roleRedirectGuard],
                pathMatch: 'full',
                children: [] // canActivate exige children ou component se não houver children, mas aqui apenas redireciona
            },
            {
                path: 'onboarding',
                loadComponent: () => import('./features/onboarding/onboarding').then(m => m.Onboarding),
                data: { roles: ['student'], breadcrumb: 'Boas-vindas' },
                canActivate: [roleGuard]
            },
            {
                path: 'turmas',
                loadComponent: () => import('./features/turmas/turmas').then(m => m.Turmas),
                data: { roles: ['teacher'], breadcrumb: 'Minhas Turmas' },
                canActivate: [roleGuard]
            },
            {
                path: 'professor',
                children: [
                    {
                        path: 'dashboard',
                        loadComponent: () => import('./features/professor/dashboard/dashboard-professor').then(m => m.DashboardProfessor),
                        data: { roles: ['teacher'], breadcrumb: 'Dashboard' },
                        canActivate: [roleGuard]
                    },
                    {
                        path: 'questoes',
                        data: { breadcrumb: 'Questões' },
                        children: [
                            {
                                path: '',
                                loadComponent: () => import('./features/professor/questoes/questoes-professor').then(m => m.QuestoesProfessor),
                                data: { roles: ['teacher'] },
                                canActivate: [roleGuard]
                            },
                            {
                                path: 'nova',
                                loadComponent: () => import('./features/professor/questoes/criar-questao/criar-questao').then(m => m.CriarQuestao),
                                data: { roles: ['teacher'], breadcrumb: 'Nova Questão' },
                                canActivate: [roleGuard]
                            },
                            {
                                path: ':id/editar',
                                loadComponent: () => import('./features/professor/questoes/editar-questao/editar-questao').then(m => m.EditarQuestao),
                                data: { roles: ['teacher'], breadcrumb: 'Editar' },
                                canActivate: [roleGuard]
                            },
                            {
                                path: 'gerar',
                                loadComponent: () => import('./features/professor/questoes/gerar-questao-ia/gerar-questao-ia').then(m => m.GerarQuestaoIA),
                                data: { roles: ['teacher'], breadcrumb: 'Gerar com IA' },
                                canActivate: [roleGuard]
                            },
                        ]
                    },
                    {
                        path: 'trilhas',
                        data: { breadcrumb: 'Trilhas' },
                        children: [
                            {
                                path: '',
                                loadComponent: () => import('./features/professor/trilhas/trilhas-professor').then(m => m.TrilhasProfessor),
                                data: { roles: ['teacher'] },
                                canActivate: [roleGuard]
                            },
                            {
                                path: 'nova',
                                loadComponent: () => import('./features/professor/trilhas/criar-trilha/criar-trilha').then(m => m.CriarTrilha),
                                data: { roles: ['teacher'], breadcrumb: 'Nova Trilha' },
                                canActivate: [roleGuard]
                            },
                            {
                                path: ':id/editar',
                                loadComponent: () => import('./features/professor/trilhas/editar-trilha/editar-trilha').then(m => m.EditarTrilha),
                                data: { roles: ['teacher'], breadcrumb: 'Editar' },
                                canActivate: [roleGuard]
                            },
                            {
                                path: ':id/analytics',
                                loadComponent: () => import('./features/professor/trilhas/analytics/analytics-trilha').then(m => m.AnalyticsTrilha),
                                data: { roles: ['teacher'], breadcrumb: 'Analytics' },
                                canActivate: [roleGuard]
                            },
                        ]
                    },
                ]
            },
            {
                path: 'aluno',
                children: [
                    {
                        path: 'dashboard',
                        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
                        data: { roles: ['student'], breadcrumb: 'Dashboard' },
                        canActivate: [roleGuard, classroomGuard]
                    },
                    {
                        path: 'trilhas',
                        loadComponent: () => import('./features/trilha/trilha').then(m => m.Trilha),
                        data: { roles: ['student'], breadcrumb: 'Minhas Trilhas' },
                        canActivate: [roleGuard, classroomGuard]
                    },
                    {
                        path: 'exercicio/:id',
                        loadComponent: () => import('./features/exercicio/exercicio').then(m => m.Exercicio),
                        data: { roles: ['student'], breadcrumb: 'Exercício' },
                        canActivate: [roleGuard, classroomGuard]
                    },
                    {
                        path: 'historico',
                        loadComponent: () => import('./features/historico-submissoes/historico-submissoes').then(m => m.HistoricoSubmissoes),
                        data: { roles: ['student'], breadcrumb: 'Histórico de Submissões' },
                        canActivate: [roleGuard, classroomGuard]
                    },
                ]
            },
            {
                path: 'ranking',
                loadComponent: () => import('./features/ranking/ranking').then(m => m.RankingPage),
                data: { breadcrumb: 'Ranking' },
                canActivate: [roleGuard]
            },
            {
                path: 'perfil',
                loadComponent: () => import('./features/perfil/perfil').then(m => m.Perfil),
                data: { roles: ['student'], breadcrumb: 'Meu Perfil' },
                canActivate: [roleGuard]
            },
            {
                path: 'teste',
                loadComponent: () => import('./features/teste/teste').then(m => m.Teste),
                data: { breadcrumb: 'Página de Teste' }
            },
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
