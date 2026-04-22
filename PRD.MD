
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

| Camada | Artefato | Ação |
| :--- | :--- | :--- |
| **Models** | `domain/auth/models/login-request.interface.ts` | **[CRIAR]** — `{ email, password }` |
| **Models** | `domain/auth/models/signup-request.interface.ts` | **[CRIAR]** — `{ name, email, password, role }` |
| **Models** | `domain/auth/models/auth-response.interface.ts` | **[CRIAR]** — `{ token, exp, username, role }` |
| **Models** | `domain/auth/models/usuario-response.interface.ts` | **[ATUALIZAR]** — alinhar com resposta real da API |
| **Service** | `domain/auth/service/auth.service.ts` | **[ATUALIZAR]** — implementar `login()` e `signup()` com `HttpClient` |
| **Interceptor** | `core/interceptors/auth.interceptor.ts` | **[CRIAR]** — injetar `Bearer token` em todas as requisições |
| **Guard** | `core/guards/auth.guard.ts` | **[CRIAR]** — proteger rotas que exigem autenticação |
| **Feature** | `features/login/` | **[ATUALIZAR]** — conectar formulário ao `auth.service` real |
| **Armazenamento** | `localStorage` ou `sessionStorage` | Persistir token JWT e dados do usuário |

**Critérios de Conclusão:**
- [ ] Login com credenciais válidas retorna token e redireciona ao dashboard
- [ ] Signup cria conta e redireciona para login
- [ ] Rotas protegidas redirecionam para `/login` sem token válido
- [ ] Token expirado é tratado (logout automático)

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
- [ ] Professor cria turma e visualiza na listagem
- [ ] Aluno entra na turma pelo código e visualiza na listagem
- [ ] Listagem é filtrada por role (professor vê suas turmas, aluno vê onde está matriculado)

---

#### **Fase 2 — Questões (Questions)** `(RF03, RF06)`
> **Endpoints:** `GET /questions` · `GET /questions/:id` · `POST /questions` · `POST /questions/generate`

| Camada | Artefato | Ação |
| :--- | :--- | :--- |
| **Models** | `domain/question/models/question.interface.ts` | **[CRIAR]** — `{ id, title, statement, difficulty, constraints }` |
| **Models** | `domain/question/models/question-request.interface.ts` | **[CRIAR]** — body de criação manual |
| **Models** | `domain/question/models/generate-request.interface.ts` | **[CRIAR]** — `{ context }` para geração via IA |
| **Service** | `domain/question/services/question.service.ts` | **[CRIAR]** — `list()`, `getById()`, `create()`, `generate()` |
| **Feature** | `features/exercicio/` | **[ATUALIZAR]** — consumir questões reais da API em vez de dados mock |
| **Feature** | `features/trilha/` | **[ATUALIZAR]** — listar questões da trilha vindas da API |

**Critérios de Conclusão:**
- [ ] Exercícios são carregados da API e exibidos corretamente
- [ ] Professor consegue criar questão manual
- [ ] Professor consegue gerar questões via IA informando contexto
- [ ] Detalhe da questão (`/questions/:id`) renderiza statement e constraints

---

#### **Fase 3 — Submissões (Submissions)** `(RF02, RF04, RF05, RF07)`
> **Endpoints:** `POST /submissions` · `GET /submissions/:id`

| Camada | Artefato | Ação |
| :--- | :--- | :--- |
| **Models** | `domain/submission/models/submission.interface.ts` | **[CRIAR]** — `{ id, question_id, code, status, is_correct, feedback, socratic_hint }` |
| **Models** | `domain/submission/models/submission-request.interface.ts` | **[CRIAR]** — `{ question_id, code }` |
| **Service** | `domain/submission/services/submission.service.ts` | **[CRIAR]** — `submit()`, `getResult()` com polling |
| **Feature** | `features/editor-codigo/` | **[ATUALIZAR]** — enviar código para API e exibir feedback real |
| **UX** | Componente de feedback | **[CRIAR]** — exibir status (pending → processing → completed), `is_correct`, `feedback` e `socratic_hint` |
| **Service** | `domain/aluno/services/aluno-mock.service.ts` | **[REMOVER/SUBSTITUIR]** — substituir mock por dados reais |

**Critérios de Conclusão:**
- [ ] Aluno submete código e recebe status `pending`
- [ ] Polling consulta resultado até `completed`
- [ ] Feedback socrático é exibido quando `is_correct = false`
- [ ] Progresso do aluno é atualizado com base nos resultados reais

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
- [ ] Leaderboard exibe top 50 alunos com pontuação
- [ ] Pontuação reflete regra: Fácil (10pts), Média (20pts), Difícil (30pts)
- [ ] Tela acessível pelo menu principal

---

#### **Fase Transversal — Infraestrutura**
> Tarefas que permeiam todas as fases e devem ser configuradas desde a Fase 0.

| Artefato | Ação |
| :--- | :--- |
| `environments/environment.ts` | **[ATUALIZAR]** — adicionar `apiBaseUrl` |
| `environments/environment.prod.ts` | **[ATUALIZAR]** — URL do backend em produção |
| `core/interceptors/error.interceptor.ts` | **[CRIAR]** — tratamento global de erros HTTP (401, 403, 500) |
| `shared/services/toast.service.ts` | **[ATUALIZAR]** — integrar com mensagens de erro da API |
| Remoção de mocks | **[EXECUTAR]** — remover todos os `*-mock.service.ts` ao final das fases |
