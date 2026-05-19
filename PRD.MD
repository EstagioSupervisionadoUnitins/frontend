
## **PRD: Plataforma de Aprendizado de Lógica com IA**

### **1. Descrição**
O projeto consiste no desenvolvimento do frontend de uma plataforma educacional focada no ensino de lógica de programação para iniciantes. O sistema utiliza Inteligência Artificial para gerar exercícios personalizados e fornecer feedback socrático, guiando o aluno na resolução de problemas práticos.

### **2. Propósito**
Resolver a dificuldade de abstração e a sobrecarga de informações que alunos iniciantes enfrentam ao iniciar na computação. O objetivo é oferecer uma ferramenta de apoio acadêmico que valide se o aluno realmente consegue aplicar a teoria na prática, permitindo o acompanhamento do desempenho pela docente.

### **3. Entrada e Saída**
* **Entradas:**
    * Credenciais de acesso (Login/Senha).
    * Código-fonte escrito pelo usuário no editor.
    * Respostas para questões de "engenharia reversa".
    * Dados de prompt e contexto para a API de IA.
* **Saídas:**
    * Exercícios de programação gerados dinamicamente.
    * Dicas socráticas (orientações sem a resposta direta).
    * Métricas de desempenho e percentual de acerto.
    * Feedback visual de erros de sintaxe ou lógica.

### **4. Stack Tecnológica**
* **Framework:** [Angular 21.1](https://angular.dev/)
* **Biblioteca de UI:** [PrimeNG](https://primeng.org/) (com foco em componentes funcionais e sérios), [Monaco Editor](https://microsoft.github.io/monaco-editor/)
* **Gráficos:** [PrimeNG Chart (`p-chart`)](https://primeng.org/chart) powered by [Chart.js v4](https://www.chartjs.org/) — instalado como peer dependency
* **Gerenciamento de Estado:** Signals e RxJS (padrão Angular moderno)
* **Estilização:** [TailwindCSS](https://tailwindcss.com/)
* **Comunicação:** HttpClient para integração futura com o backend.

### **5. Estrutura do Projeto (Frontend)**
Conforme a arquitetura definida, o diretório `src/app` será organizado da seguinte forma:

* **`core/`**: Contém o esqueleto da aplicação, incluindo o `layout` (Dashboard) e `presets` de estilização.
* **`domain/`**: Camada de lógica de negócio e modelos de dados (ex: subdiretório `auth` com `models` e `services` de autenticação).
* **`features/`**: Módulos principais do sistema, como `editor-codigo`, `login`.
* **`shared/`**: Componentes e serviços reutilizáveis, como o `toast.service.ts` para notificações.

### **6. Requisitos Funcionais (RF)**
| ID | Nome | Descrição | Prioridade |
| :--- | :--- | :--- | :--- |
| RF01 | Cadastro e Autenticação | Permitir login de alunos para persistência de progresso. | Alta |
| RF02 | Editor de Código | Interface funcional para escrita e teste de scripts. | Alta |
| RF03 | Geração de Exercícios | IA deve criar questões baseadas na trilha de conteúdo. | Alta |
| RF04 | Tutoria Socrática | Fornecer dicas progressivas sem revelar a solução. | Alta |
| RF05 | Sistema de Progressão | Exigir 60% de aproveitamento para liberar novos níveis. | Alta |
| RF06 | Engenharia Reversa | IA apresenta código para o aluno deduzir o problema. | Média |
| RF07 | Retomada de Progresso | Salvar o estado para que o aluno continue de onde parou. | Alta |

### **7. Requisitos Não Funcionais (RNF)**
* **RNF01 (Interface):** Identidade visual séria, funcional e acadêmica.
* **RNF02 (Responsividade):** Layout base deve ser responsivo para diferentes tamanhos de tela.
* **RNF03 (Segurança):** Proteção de rotas através de Guards no Angular.
* **RNF04 (Manutenibilidade):** Código seguindo a estrutura de pastas proposta para facilitar a integração futura.

### **8. Critérios de Aceite**
* O aluno só deve avançar de módulo se o percentual de acerto for $\ge 60\%$.
* O sistema deve impedir o uso de funções nativas específicas quando o exercício exigir lógica pura.
* O editor de código deve validar a nomenclatura de variáveis e clareza do código.
* Em caso de erros repetidos, o sistema deve fornecer a solução e trocar a pergunta por uma inédita.

### **9. Fora do Escopo**
* Desenvolvimento de regras de negócio no lado do servidor (Backend).
* Gerenciamento direto de banco de dados e persistência física.
* Treinamento ou fine-tuning de modelos de linguagem (LLM) próprios.
* Gamificação excessiva (medalhas, rankings lúdicos).

---

### **10. Fases de Integração com o Backend**

> **Base URL da API:** configurável via `environment.ts`
> **Autenticação:** JWT via header `Authorization: Bearer <token>`

Cada fase segue o mesmo ciclo de trabalho:
1. Criar/atualizar **models e interfaces** em `domain/`
2. Criar/atualizar **services** que consomem a API real (substituindo mocks)
3. Atualizar **features** (componentes/páginas) para usar os services reais
4. Validar com **testes manuais** contra o backend rodando localmente

---

#### **Fase 0 — Autenticação** `(RF01)`
> **Endpoints:** `POST /auth/signup` · `POST /auth/login`
> **Endpoints disponíveis (implementados na Fase 12):** `POST /auth/forgot_password` · `POST /auth/reset_password`

| Camada | Artefato | Ação |
| :--- | :--- | :--- |
| **Models** | `domain/auth/models/login-request.interface.ts` | **[CRIAR]** — `{ email, password }` |
| **Models** | `domain/auth/models/signup-request.interface.ts` | **[ATUALIZAR]** — `{ name, email, password }` (A role sempre será `"student"`, não enviar `role`) |
| **Models** | `domain/auth/models/auth-response.interface.ts` | **[CRIAR]** — `{ token, exp, username, role }` |
| **Models** | `domain/auth/models/usuario-response.interface.ts` | **[ATUALIZAR]** — alinhar com resposta real da API |
| **Service** | `domain/auth/service/auth.service.ts` | **[ATUALIZAR]** — implementar `login()` e `signup()` com `HttpClient` |
| **Interceptor** | `core/interceptors/auth.interceptor.ts` | **[CRIAR]** — injetar `Bearer token` em todas as requisições |
| **Guard** | `core/guards/auth.guard.ts` | **[CRIAR]** — proteger rotas que exigem autenticação |
| **Feature** | `features/login/` | **[ATUALIZAR]** — remover opções de Professor/Aluno no cadastro (Registro cria apenas alunos). |
| **Armazenamento** | `localStorage` ou `sessionStorage` | Persistir token JWT e dados do usuário |

> **Nota sobre Perfis:** Conforme a nova lógica da API, o fluxo de signup (`POST /auth/signup`) é exclusivo para alunos. Administradores iniciam o fluxo para professores, criando suas contas e enviando convites via `POST /admin/users`.

**Critérios de Conclusão:**
- [x] Login com credenciais válidas retorna token e redireciona ao dashboard
- [x] Signup cria conta exclusivamente de aluno e redireciona para login
- [x] Rotas protegidas redirecionam para `/login` sem token válido
- [x] Token expirado é tratado (logout automático)

---

#### **Fase 1 — Turmas (Classrooms)** `(Novo módulo)`
> **Endpoints:** `GET /classrooms` · `POST /classrooms` · `POST /classrooms/join`

| Camada | Artefato | Ação |
| :--- | :--- | :--- |
| **Models** | `domain/classroom/models/classroom.interface.ts` | **[CRIAR]** — `{ id, name, code, teacher_id }` |
| **Models** | `domain/classroom/models/classroom-request.interface.ts` | **[CRIAR]** — `{ classroom: { name, code } }` |
| **Models** | `domain/classroom/models/join-request.interface.ts` | **[CRIAR]** — `{ code }` |
| **Service** | `domain/classroom/services/classroom.service.ts` | **[CRIAR]** — `list()`, `create()`, `join()` |
| **Feature** | `features/turmas/` | **[CRIAR]** — listagem de turmas, criação (professor) e entrada (aluno) |
| **Routing** | `app.routes.ts` | **[ATUALIZAR]** — adicionar rota `/turmas` |

**Critérios de Conclusão:**
- [x] Professor cria turma e visualiza na listagem
- [x] Aluno entra na turma pelo código e visualiza na listagem
- [x] Listagem é filtrada por role (professor vê suas turmas, aluno vê onde está matriculado)

---

#### **Fase 2 — Questões (Questions)** `(RF03, RF06)`
> **Endpoints:** `GET /questions` · `GET /questions/:id` · `POST /questions` · `POST /questions/generate`

| Camada | Artefato | Ação |
| :--- | :--- | :--- |
| **Models** | `domain/question/models/question.interface.ts` | **[CRIAR]** — `{ id, title, statement, difficulty, constraints }` |
| **Models** | `domain/question/models/question-request.interface.ts` | **[CRIAR]** — body de criação manual |
| **Models** | `domain/question/models/generate-request.interface.ts` | **[CRIAR]** — `{ context, quantity, classroom_id }` para geração via IA |
| **Service** | `domain/question/services/question.service.ts` | **[CRIAR]** — `list()`, `getById()`, `create()`, `generate()` |
| **Feature** | `features/exercicio/` | **[ATUALIZAR]** — consumir questões reais da API em vez de dados mock |
| **Feature** | `features/trilha/` | **[ATUALIZAR]** — listar questões da trilha vindas da API |

**Critérios de Conclusão:**
- [x] Exercícios são carregados da API e exibidos corretamente
- [x] Professor consegue criar questão manual
- [x] Professor consegue gerar questões via IA informando contexto
- [x] Detalhe da questão (`/questions/:id`) renderiza statement e constraints

---

#### **Fase 3 — Submissões (Submissions)** `(RF02, RF04, RF05, RF07)`
> **Endpoints:** `POST /submissions` · `GET /submissions/:id`
> **Endpoint disponível (implementado na Fase 13):** `GET /submissions` (listagem/histórico)

| Camada | Artefato | Ação |
| :--- | :--- | :--- |
| **Models** | `domain/submission/models/submission.interface.ts` | **[CRIAR]** — `{ id, question_id, code, status, is_correct, feedback, socratic_hint }` |
| **Models** | `domain/submission/models/submission-request.interface.ts` | **[CRIAR]** — `{ question_id, code }` |
| **Service** | `domain/submission/services/submission.service.ts` | **[CRIAR]** — `submit()`, `getResult()` com polling |
| **Feature** | `features/editor-codigo/` | **[ATUALIZAR]** — enviar código para API e exibir feedback real |
| **UX** | Componente de feedback | **[CRIAR]** — exibir status (pending → processing → completed), `is_correct`, `feedback` e `socratic_hint` |
| **Service** | `domain/aluno/services/aluno-mock.service.ts` | **[REMOVER/SUBSTITUIR]** — substituir mock por dados reais |

**Critérios de Conclusão:**
- [x] Aluno submete código e recebe status `pending`
- [x] Polling consulta resultado até `completed`
- [x] Feedback socrático é exibido quando `is_correct = false`
- [x] Progresso do aluno é atualizado com base nos resultados reais

---

#### **Fase 4 — Rankings (Gamificação)** `(Novo módulo)`
> **Endpoints:** `GET /rankings`

| Camada | Artefato | Ação |
| :--- | :--- | :--- |
| **Models** | `domain/ranking/models/ranking.interface.ts` | **[CRIAR]** — `{ position, user_name, score }` |
| **Service** | `domain/ranking/services/ranking.service.ts` | **[CRIAR]** — `getLeaderboard()` |
| **Feature** | `features/ranking/` | **[CRIAR]** — tabela de leaderboard com top 50 |
| **Routing** | `app.routes.ts` | **[ATUALIZAR]** — adicionar rota `/ranking` |
| **Layout** | `core/layout/` | **[ATUALIZAR]** — adicionar link "Ranking" no menu lateral |

**Critérios de Conclusão:**
- [x] Leaderboard exibe top 50 alunos com pontuação
- [x] Pontuação reflete regra: Fácil (10pts), Média (20pts), Difícil (30pts)
- [x] Tela acessível pelo menu principal

---

#### **Fase Transversal — Infraestrutura**
> Tarefas que permeiam todas as fases e devem ser configuradas desde a Fase 0.

| Artefato | Ação |
| :--- | :--- |
| `environments/environment.ts` | **[ATUALIZAR]** — adicionar `apiBaseUrl` |
| `environments/environment.prod.ts` | **[ATUALIZAR]** — URL do backend em produção |
| `core/interceptors/error.interceptor.ts` | **[CRIAR]** — tratamento global de erros HTTP mapeando o novo payload padrão da API (`{ error, message, errors }`) |
| `shared/services/toast.service.ts` | **[ATUALIZAR]** — extrair e exibir o campo `message` retornado pelas exceções padronizadas do backend |
| Remoção de mocks | **[EXECUTAR]** — remover todos os `*-mock.service.ts` ao final das fases |

---

### **11. Fases de Correção e Evolução (Pós-integração)**

> As fases 0–4 cobriram a integração inicial com o backend. As fases abaixo endereçam as **lacunas identificadas no [Gap Analysis](file:///home/matheusn/.gemini/antigravity/brain/b9ca4ebd-4481-46ea-82d4-215e8f92ee42/gap_analysis.md.resolved)** e os **novos endpoints** entregues pelo backend, conforme a [documentação atualizada da API](file:///home/matheusn/dev/faculdade/estagio-frontend/api-logike-estagio/api_documentation.md).

---

#### **Fase 5 — Escopo de Turma e Onboarding** `(GAP-1.1, GAP-1.2, GAP-1.3)`
> **Endpoints:** `GET /classrooms/:id` · `GET /classrooms/:id/stats`
> **Decisão adotada:** Aluno participa de **uma única turma** no MVP.

| Camada | Artefato | Ação |
| :--- | :--- | :--- |
| **Models** | `domain/classroom/models/classroom.interface.ts` | **[ATUALIZAR]** — incluir campos retornados por `GET /classrooms/:id` |
| **Service** | `domain/classroom/services/classroom.service.ts` | **[ATUALIZAR]** — implementar `getById(id)` consumindo `GET /classrooms/:id` |
| **Guard** | `core/guards/classroom.guard.ts` | **[CRIAR]** — redirecionar aluno sem turma para tela de onboarding |
| **Feature** | `features/onboarding/` | **[CRIAR]** — tela de primeiro acesso que exige código da turma antes de liberar o app |
| **Feature** | `features/turmas/` | **[ATUALIZAR]** — após entrar na turma, persistir `classroom_id` no contexto do usuário |
| **Layout** | `core/layout/sidebar/` | **[ATUALIZAR]** — exibir nome da turma ativa na sidebar |

**Critérios de Conclusão:**
- [x] Aluno sem turma é redirecionado para a tela de onboarding
- [x] Após informar código válido, aluno é vinculado à turma e redirecionado ao dashboard
- [x] `classroom_id` é persistido e utilizado como filtro nos demais endpoints
- [x] Sidebar exibe a turma ativa do aluno

---

#### **Fase 6 — Gestão Completa de Questões** `(GAP-2.1, GAP-2.2, GAP-2.3)`
> **Endpoints:** `PATCH /questions/:id` · `DELETE /questions/:id` · `GET /questions?classroom_id=X`

| Camada | Artefato | Ação |
| :--- | :--- | :--- |
| **Models** | `domain/question/models/question.interface.ts` | **[ATUALIZAR]** — adicionar `answered: boolean` e `classroom_id: number` |
| **Models** | `domain/question/models/question-update.interface.ts` | **[CRIAR]** — body para `PATCH /questions/:id` |
| **Service** | `domain/question/services/question.service.ts` | **[ATUALIZAR]** — implementar `update(id, body)`, `delete(id)` e filtro `?classroom_id=X` no `list()` |
| **Feature** | `features/questoes-professor/` | **[ATUALIZAR]** — adicionar botões de editar e deletar em cada questão da tabela |
| **Feature** | `features/questoes-professor/editar-questao/` | **[CRIAR]** — formulário de edição reutilizando layout do `criar-questao` |
| **Feature** | `features/exercicio/` | **[ATUALIZAR]** — exibir indicador visual (✅/⬜) baseado no campo `answered` |
| **UX** | Dialog de confirmação de exclusão | **[CRIAR]** — modal de confirmação antes de deletar questão |

**Critérios de Conclusão:**
- [x] Professor edita uma questão existente e vê as alterações refletidas na listagem
- [x] Professor deleta uma questão com confirmação prévia
- [x] Listagem de questões filtra por `classroom_id` da turma ativa
- [x] Questões já respondidas pelo aluno exibem indicador visual (✅)
- [x] Questões são criadas com `classroom_id` vinculado à turma ativa do professor

---

#### **Fase 7 — Métricas Reais e Perfil** `(GAP-3.1, GAP-5.1, GAP-5.3)`
> **Endpoints:** `GET /user/stats`

| Camada | Artefato | Ação |
| :--- | :--- | :--- |
| **Models** | `domain/aluno/models/user-stats.interface.ts` | **[CRIAR]** — interface com os campos retornados por `GET /user/stats` |
| **Service** | `domain/aluno/services/aluno.service.ts` | **[CRIAR]** — `getStats()` consumindo `GET /user/stats` |
| **Service** | `domain/aluno/services/aluno-mock.service.ts` | **[REMOVER]** — substituído pelo service real |
| **Feature** | `features/dashboard/components/hero-progresso/` | **[ATUALIZAR]** — consumir `aluno.service.getStats()` em vez do mock |
| **Feature** | `features/dashboard/components/insight-ia/` | **[ATUALIZAR]** — substituir insight mockado por dados reais |
| **Feature** | `features/perfil/` | **[CRIAR]** — tela de perfil com métricas do aluno (total de submissões, acertos, pontuação, streak) |
| **Routing** | `app.routes.ts` | **[ATUALIZAR]** — adicionar rota `/perfil` |
| **Layout** | `core/layout/sidebar/` | **[ATUALIZAR]** — habilitar link de Perfil na sidebar |

**Critérios de Conclusão:**
- [x] Dashboard do aluno exibe progresso real (não mockado)
- [x] Tela de perfil acessível via sidebar com métricas reais
- [x] `AlunoMockService` completamente removido sem quebrar funcionalidades
- [x] Insight IA do dashboard usa dados reais do backend

---

#### **Fase 8 — Trilhas de Aprendizado (Playlists)** `(GAP-5.2)`
> **Endpoints:** `GET /playlists` · `GET /playlists/:id` · `POST /playlists` · `PATCH /playlists/:id` · `DELETE /playlists/:id`
> **Decisão adotada:** Trilha = playlist de questões ordenada, criada pelo professor, vinculada a uma turma.

| Camada | Artefato | Ação |
| :--- | :--- | :--- |
| **Models** | `domain/trilha/models/playlist.interface.ts` | **[CRIAR]** — `{ id, title, description, classroom_id, questions: Question[] }` |
| **Models** | `domain/trilha/models/playlist-request.interface.ts` | **[CRIAR]** — body para criação e edição |
| **Service** | `domain/trilha/services/trilha.service.ts` | **[CRIAR]** — `list()`, `getById()`, `create()`, `update()`, `delete()` consumindo `/playlists` |
| **Service** | `domain/aluno/services/trilha-mock.service.ts` | **[REMOVER]** — substituído pelo service real |
| **Feature** | `features/trilha/` | **[ATUALIZAR]** — consumir as playlists utilizando o novo campo `status` (`solved`, `pending`, `not_started`) injetado nativamente pela API |
| **Feature** | `features/trilha-professor/` | **[CRIAR]** — tela para professor criar, editar e deletar playlists com seleção de questões |
| **Routing** | `app.routes.ts` | **[ATUALIZAR]** — adicionar rotas `/trilha-professor` |

**Critérios de Conclusão:**
- [x] Professor cria playlist selecionando questões da sua turma
- [x] Professor edita e remove playlists existentes
- [x] Aluno visualiza trilhas da sua turma com progresso baseado em questões respondidas
- [x] Playlists filtram por `classroom_id` da turma ativa
- [x] `TrilhaMockService` completamente removido sem quebrar funcionalidades

> **Observação de Integração:** Atualmente o frontend envia os dados de criação/edição envelopados em uma chave `{ playlist: data }` para seguir o padrão Rails. O backend deve estar configurado para permitir `question_ids: []` no `PlaylistsController#playlist_params`.

---

#### **Fase 9 — Dashboard do Professor** `(GAP-1.4, GAP-5.4)`
> **Endpoints:** `GET /classrooms/:id/stats` · `GET /classrooms` · `GET /playlists/stats?classroom_id=X`

| Camada | Artefato | Ação |
| :--- | :--- | :--- |
| **Models** | `domain/classroom/models/classroom-stats.interface.ts` | **[CRIAR]** — interface com métricas retornadas por `GET /classrooms/:id/stats` |
| **Service** | `domain/classroom/services/classroom.service.ts` | **[ATUALIZAR]** — implementar `getStats(id)` consumindo `GET /classrooms/:id/stats` |
| **Feature** | `features/dashboard-professor/` | **[CRIAR]** — dashboard com visão geral por turma |
| **Feature** | `features/dashboard-professor/components/turma-resumo/` | **[CRIAR]** — card com nº de alunos, média, questões e submissões |
| **Feature** | `features/dashboard-professor/components/alunos-lista/` | **[CRIAR]** — lista de alunos com status de progresso |
| **Feature** | `features/dashboard-professor/components/trilhas-resumo/` | **[CRIAR]** — visão generalista das trilhas da turma (started vs finished) |
| **Routing** | `app.routes.ts` | **[ATUALIZAR]** — adicionar rota `/teacher/dashboard` |
| **Layout** | `core/layout/sidebar/` | **[ATUALIZAR]** — habilitar link "Dashboard" para professor (`disabled: false`) |

> **Observação de Evolução:** O endpoint `GET /classrooms/:id/stats` retornará futuramente o nome do aluno (`student_name`) e o título da questão (`question_title`) em `recent_submissions`. O frontend deverá ser ajustado para exibir esses nomes na tabela de submissões assim que a alteração no backend for implantada.

**Critérios de Conclusão:**
- [x] Professor acessa dashboard e visualiza lista de suas turmas
- [x] Cada turma exibe métricas: nº de alunos, média de pontuação, questões associadas
- [x] Professor navega para detalhes de uma turma e vê lista de alunos com progresso
- [x] Link "Dashboard" habilitado e funcional na sidebar do professor

---

#### **Fase 10 — Ranking por Turma** `(GAP-4.1)`
> **Endpoints:** `GET /rankings?classroom_id=X`

| Camada | Artefato | Ação |
| :--- | :--- | :--- |
| **Service** | `domain/ranking/services/ranking.service.ts` | **[ATUALIZAR]** — adicionar parâmetro `classroom_id` ao `getLeaderboard()` |
| **Feature** | `features/ranking/` | **[ATUALIZAR]** — filtrar ranking por turma do aluno por padrão, com toggle para global |
| **UX** | Toggle/Seletor de escopo | **[CRIAR]** — alternância entre "Minha Turma" e "Global" no leaderboard |

**Critérios de Conclusão:**
- [x] Ranking padrão exibe apenas alunos da turma do usuário
- [x] Aluno pode alternar entre ranking da turma e ranking global
- [x] Pontuações refletem dados reais filtrados corretamente

---

#### **Fase 11 — Analytics Detalhado de Trilhas** `(Novo módulo)`
> **Endpoints:** `GET /playlists/:id/stats`
> **Dependência instalada:** `chart.js ^4.x` (peer dependency do `p-chart` do PrimeNG)

| Camada | Artefato | Ação |
| :--- | :--- | :--- |
| **Dependência** | `chart.js` (npm) | **[INSTALADO]** — peer dependency do `p-chart` do PrimeNG |
| **Models** | `domain/trilha/models/playlist-detailed-stats.interface.ts` | **[CRIAR]** — `{ playlist_id, user_stats: UserPlaylistStat[], question_stats: QuestionStat[], insights }` |
| **Service** | `domain/trilha/services/trilha.service.ts` | **[ATUALIZAR]** — implementar `getDetailedStats(id)` consumindo `GET /playlists/:id/stats` |
| **Feature** | `features/professor/trilhas/analytics/` | **[CRIAR]** — tela de "Raio-X" com 4 seções: cards de resumo, gráfico de barras, gráfico de donut e tabela de alunos |
| **UX** | Gráfico de Barras Horizontal (`p-chart` type='bar') | **[CRIAR]** — taxa de erro por questão, ordenado do mais difícil; dados de `question_stats` |
| **UX** | Gráfico de Rosca/Donut (`p-chart` type='doughnut') | **[CRIAR]** — distribuição de status dos alunos (Concluído / Em andamento / Não iniciado); dados de `user_stats` |
| **UX** | Tabela de Alunos (`p-table`) | **[CRIAR]** — nome, questões respondidas, acertos, tentativas totais, badge de status |
| **Feature** | `features/professor/trilhas/trilhas-professor.html` | **[ATUALIZAR]** — adicionar botão "Ver Analytics" em cada linha da tabela |
| **Feature** | `features/professor/trilhas/trilhas-professor.ts` | **[ATUALIZAR]** — método `verAnalytics(id)` para navegação |
| **Routing** | `app.routes.ts` | **[ATUALIZAR]** — adicionar rota `/professor/trilhas/:id/analytics` |

**Critérios de Conclusão:**
- [x] Professor visualiza quais questões tiveram mais tentativas antes do acerto (gráfico de barras)
- [x] Professor identifica alunos que não iniciaram ou estão travados em questões específicas (tabela + gráfico donut)
- [x] Insights de IA (`hardest_questions`) são exibidos em card de destaque para auxiliar a intervenção docente
- [x] Empty state exibido quando não há dados suficientes na trilha

---

#### **Fase 12 — Recuperação de Senha** `(RF01 — Complemento)`
> **Endpoints:** `POST /auth/forgot_password` · `POST /auth/reset_password`
> **Integração externa:** O backend dispara e-mail de recuperação via workflow n8n (`notifications_hub → password_reset`). O frontend **não** envia o e-mail — apenas aciona o endpoint e apresenta a UI.

| Camada | Artefato | Ação |
| :--- | :--- | :--- |
| **Models** | `domain/auth/models/forgot-password-request.interface.ts` | **[CRIAR]** — `{ email: string }` |
| **Models** | `domain/auth/models/reset-password-request.interface.ts` | **[CRIAR]** — `{ token: string, new_password: string }` |
| **Service** | `domain/auth/service/auth.service.ts` | **[ATUALIZAR]** — implementar `forgotPassword(email)` consumindo `POST /auth/forgot_password` e `resetPassword(token, newPassword)` consumindo `POST /auth/reset_password` |
| **Feature** | `features/login/` | **[ATUALIZAR]** — adicionar link "Esqueci minha senha" na tela de login |
| **Feature** | `features/forgot-password/` | **[CRIAR]** — tela com formulário de e-mail para solicitar recuperação |
| **Feature** | `features/reset-password/` | **[CRIAR]** — tela com formulário de token + nova senha (acessada via link do e-mail) |
| **Routing** | `app.routes.ts` | **[ATUALIZAR]** — adicionar rotas `/forgot-password` e `/reset-password` (rotas públicas, sem guard) |
| **UX** | Validação e feedback | **[CRIAR]** — mensagens de sucesso ("E-mail enviado") e erro ("Token inválido ou expirado"), com redirecionamento para login após reset bem-sucedido |

**Critérios de Conclusão:**
- [x] Link "Esqueci minha senha" visível e funcional na tela de login
- [x] Tela de forgot-password envia e-mail e exibe confirmação (sem revelar se o e-mail existe)
- [x] Tela de reset-password aceita token + nova senha e redireciona para login
- [x] Erros do backend (token inválido/expirado, 401) são tratados com mensagem clara
- [x] Fluxo completo testado: forgot → e-mail recebido (n8n) → reset → login com nova senha

---

#### **Fase 13 — Histórico de Submissões do Aluno** `(RF07 — Complemento)`
> **Endpoints:** `GET /submissions`
> **Contexto:** O swagger revela `GET /submissions` (listagem), que não era consumido pelo frontend. Permite ao aluno revisar seu histórico de tentativas.

| Camada | Artefato | Ação |
| :--- | :--- | :--- |
| **Service** | `domain/submission/services/submission.service.ts` | **[ATUALIZAR]** — implementar `list()` consumindo `GET /submissions` |
| **Models** | `domain/submission/models/submission.interface.ts` | **[ATUALIZAR]** — garantir que a interface suporta todos os campos retornados pela listagem (incluir `question_title`, `created_at`) |
| **Feature** | `features/historico-submissoes/` | **[CRIAR]** — tela de histórico com tabela (`p-table`) exibindo: questão, código submetido, status, resultado, data |
| **Feature** | `features/dashboard/` | **[ATUALIZAR]** — adicionar card/link "Minhas Submissões" ou "Histórico" no dashboard do aluno |
| **Routing** | `app.routes.ts` | **[ATUALIZAR]** — adicionar rota `/historico` |
| **Layout** | `core/layout/sidebar/` | **[ATUALIZAR]** — adicionar link "Histórico" na sidebar do aluno |
| **UX** | Filtros e ordenação | **[CRIAR]** — filtrar por status (correto/incorreto) e ordenar por data |

**Critérios de Conclusão:**
- [x] Aluno acessa tela de histórico via sidebar
- [x] Tabela exibe todas as submissões do aluno com paginação
- [x] Aluno pode filtrar por resultado (acerto/erro) e ordenar por data
- [x] Clique em uma submissão expande ou navega para detalhes (feedback, código)
- [x] Empty state exibido quando não há submissões

---
---

#### **Fase Transversal 2 — Limpeza e Qualidade**
> Tarefas de finalização que devem ser executadas após todas as fases acima.

| Artefato | Ação |
| :--- | :--- |
| `domain/aluno/services/aluno-mock.service.ts` | **[VERIFICAR REMOÇÃO]** — garantir que foi removido na Fase 7 |
| `domain/aluno/services/trilha-mock.service.ts` | **[VERIFICAR REMOÇÃO]** — garantir que foi removido na Fase 8 |
| Sidebar (ambos os roles) | **[VERIFICAR]** — todos os links devem estar habilitados e funcionais |
| Todas as rotas | **[VERIFICAR]** — nenhuma rota deve apontar para componentes inexistentes |
| Guards | **[VERIFICAR]** — `ClassroomGuard` protege rotas que exigem turma ativa |
| Fluxo de recuperação de senha | **[VERIFICAR]** — `forgot-password` e `reset-password` funcionam end-to-end com n8n |
| Histórico de submissões | **[VERIFICAR]** — `GET /submissions` retorna dados corretamente e tabela renderiza |
| Cobertura de endpoints | **[VERIFICAR]** — nenhum endpoint da API documentada sem consumo no frontend |

---

#### **Fase 14 — Fluxo de Aprovação de Alunos** `(Novo módulo)`
> **Endpoints:** `POST /classrooms/join` · `GET /classrooms/:id/requests` · `PATCH /classrooms/:id/requests/:user_id/approve` · `PATCH /classrooms/:id/requests/:user_id/reject`

| Camada | Artefato | Ação |
| :--- | :--- | :--- |
| **Models** | `domain/classroom/models/classroom-request-user.interface.ts` | **[CRIAR]** — `{ id, name, email, requested_at }` |
| **Service** | `domain/classroom/services/classroom.service.ts` | **[ATUALIZAR]** — Adicionar `getJoinRequests()`, `approveJoinRequest()`, `rejectJoinRequest()` |
| **Feature** | `features/onboarding/` | **[ATUALIZAR]** — Tratar retorno do `join` de forma pendente e exibir tela de "Aguardando aprovação" com feedback claro |
| **Guard** | `core/guards/classroom.guard.ts` | **[ATUALIZAR]** — Bloquear alunos pendentes e redirecionar para tela de onboarding ("Aguardando aprovação") |
| **Feature** | `features/solicitacoes-turma/` | **[CRIAR]** — Tela/aba para professor aprovar/rejeitar alunos nas turmas |
| **Routing** | `app.routes.ts` | **[ATUALIZAR]** — Adicionar rotas de gerenciamento de solicitações no painel do professor |
| **Layout** | `core/layout/sidebar/` | **[ATUALIZAR]** — Adicionar item de menu "Solicitações" no perfil de professor |

**Critérios de Conclusão:**
- [ ] Ao submeter o código de uma turma no Onboarding, o aluno visualiza estado de "Aguardando aprovação do professor"
- [ ] O professor pode acessar aba "Solicitações" e menu "Solicitações de Entrada" para ver pedidos pendentes
- [ ] O professor pode aprovar solicitações, o que automaticamente desbloqueia o aluno ao dashboard
- [ ] O professor pode rejeitar solicitações, permitindo ao aluno tentar inserir um novo código
- [ ] `ClassroomGuard` restringe o acesso de alunos não aprovados para as rotas protegidas

---

#### **Fase 15 — Painel de Administração (Super Admin)** `(Novo módulo)`
> **Endpoints:** `POST /admin/users`
> **Contexto:** Super Admin precisa de uma interface própria para cadastrar professores e gerenciar convites.

| Camada | Artefato | Ação |
| :--- | :--- | :--- |
| **Models** | `domain/auth/models/admin-user-request.interface.ts` | **[CRIAR]** — `{ user: { name, email } }` |
| **Service** | `domain/auth/service/auth.service.ts` | **[ATUALIZAR]** — Adicionar `createTeacher(name, email)` consumindo `POST /admin/users` |
| **Guard** | `core/guards/role.guard.ts` | **[ATUALIZAR]** — Dar suporte à role `super_admin` e redirecionamento de acessos negados |
| **Guard** | `core/guards/role-redirect.guard.ts` | **[ATUALIZAR]** — Redirecionar `super_admin` para `/admin/dashboard` |
| **Feature** | `features/admin/` | **[CRIAR]** — Módulo contendo telas de gerenciamento do Super Admin |
| **Feature** | `features/admin/dashboard/` | **[CRIAR]** — Dashboard do Super Admin contendo estatísticas rápidas e o formulário de convite |
| **Feature** | `features/admin/professores/` | **[CRIAR]** — Tela de criação e listagem dos convites/professores criados (historico local) |
| **Routing** | `app.routes.ts` | **[ATUALIZAR]** — Adicionar rota `/admin/dashboard` e `/admin/professores` com proteção de role `super_admin` |
| **Layout** | `core/layout/sidebar/` | **[ATUALIZAR]** — Customizar menu lateral para exibir opções de administração apenas quando logado como `super_admin` |

**Critérios de Conclusão:**
- [ ] Usuário com role `super_admin` é redirecionado corretamente para `/admin/dashboard` após o login.
- [ ] Super Admin visualiza formulário para cadastrar novos professores com validação de nome e e-mail.
- [ ] Envio do formulário faz chamada ao `POST /admin/users` e exibe feedback de sucesso ("Professor criado e convite enviado").
- [ ] Histórico de professores cadastrados na sessão/localStorage é exibido em uma tabela elegante.
- [ ] Menu lateral adapta-se dinamicamente às permissões de `super_admin`.


