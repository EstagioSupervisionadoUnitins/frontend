# PLAN-trilha-aprendizado.md
## Trilha de Aprendizado — Lógica de Programação

---

## Visão Geral

Implementação da tela de **Trilha de Aprendizado** (`/aluno/trilhas`), baseada na inspiração visual fornecida. O objetivo é apresentar o roteiro de estudos de Lógica de Programação de forma estruturada, com módulos sequenciais e aulas.

O design seguirá a mesma identidade visual estabelecida no dashboard (Tailwind, PrimeNG, sem gamificação excessiva).

---

## Tipo de Projeto

**WEB** — Angular 21, PrimeNG, TailwindCSS.

---

## Critérios de Sucesso

- [ ] Rota `/aluno/trilhas` acessível no `app.routes.ts` como filha do `MainLayout`
- [ ] Renderização visual da trilha (ex: formato de timeline ou listagem de módulos)
- [ ] Diferenciação visual entre módulos Concluídos, Em Andamento e Bloqueados
- [ ] Conteúdo programático básico (Variáveis, Condicionais, Repetições, etc.) inserido de forma mockada via novo service `TrilhaMockService` ou adaptando o existente.
- [ ] Nenhum purple/violet (Purple Ban ✅)

---

## Stack Tecnológica

| Tecnologia | Papel |
|---|---|
| Angular 21 | Standalone Components, Signals para estado |
| PrimeNG | Componentes base (Timeline, Chips, Tag se necessário) |
| TailwindCSS | Estilização, layout responsivo flex/grid |

---

## Identidade Visual

- **Paleta**: Fundo claro/neutro ou alinhado ao dashboard, uso do verde (`#16a34a`) para sucesso/concluído, cores neutras apagadas para itens bloqueados.
- **Layout**: Lista vertical conectada (estilo timeline) que demonstra a progressão linear.
- **Responsividade**: Adaptação para mobile, garantindo boa usabilidade de leitura do conteúdo programático.

---

## Estrutura de Arquivos

```
src/app/
├── domain/
│   └── aluno/
│       ├── models/
│       │   └── trilha.model.ts       ← [NOVO] Interfaces Modulo e Aula
│       └── services/
│           └── trilha-mock.service.ts ← [NOVO] Dados mockados da trilha
│
└── features/
    └── trilha/                       ← [NOVO] Feature Trilha
        ├── trilha.ts
        ├── trilha.html
        └── components/
            ├── trilha-header/        ← [NOVO] Cabeçalho descritivo
            └── trilha-timeline/      ← [NOVO] Timeline visual do conteúdo
```

---

## Task Breakdown

### FASE 0 — Modelos e Mock Service

#### T01 — Criar Modelos da Trilha
- **Agente**: `frontend-specialist`
- **Prioridade**: P0
- **Ação**: Criar `trilha.model.ts` com as interfaces `Modulo` (id, titulo, descricao, status) e `Aula` (titulo, tipo, concluida).
- **Verify**: `npx tsc --noEmit` sem erros.

#### T02 — Criar `TrilhaMockService`
- **Agente**: `frontend-specialist`
- **Prioridade**: P0
- **Ação**: Criar service com dados mockados focados em Lógica (1. Variáveis, 2. If/Else, 3. Loops, 4. Arrays). Usar Signals.

### FASE 1 — UI Components e Layout

#### T03 — Componente `TrilhaHeader`
- **Agente**: `frontend-specialist`
- **Prioridade**: P1
- **Ação**: Criar header com o título do curso, descrição geral e indicador de progresso total. Apenas Tailwind.

#### T04 — Componente `TrilhaTimeline`
- **Agente**: `frontend-specialist`
- **Prioridade**: P1
- **Ação**: Desenvolver o componente visual da trilha. Exibir módulos expandíveis ou lista sequencial mostrando o status (Concluído/Desbloqueado/Bloqueado). Apenas Tailwind.

#### T05 — Componente Principal e Rota
- **Agente**: `frontend-specialist`
- **Prioridade**: P1
- **Ação**: Compor a tela e registrar rota `/aluno/trilhas` no `app.routes.ts` sob o `MainLayout`.

### FASE X — Verificação

1. Rodar `npx tsc --noEmit`
2. Checar interface visual (`npm run start`) quanto aos guias de design.

---

> **Próximo passo:** Revisar a estrutura. Se aprovada, o usuário pode digitar `/create` ou `/enhance` para que a AI implemente o código.
