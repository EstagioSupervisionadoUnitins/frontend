# PLAN-student-dashboard.md
## Dashboard do Aluno — Plataforma de Lógica com IA

---

## Visão Geral

Implementação da tela de **Dashboard do Aluno** como nova feature do projeto Angular 21. A tela exibirá o progresso do aluno, atividades recentes, insights gerados por IA e recomendações de conteúdo. Não há integração com backend nesta fase; todos os dados serão fornecidos por **mocks estáticos** via services Angular.

**Inspiração visual:** `.agent/inspiration/dashboard.png` — layout com sidebar de navegação, hero card de progresso da trilha, métricas numéricas, painel de última atividade, card de insight da IA e seção de recomendações de conteúdo.

---

## Tipo de Projeto

**WEB** — Angular 21, PrimeNG, TailwindCSS.

---

## Critérios de Sucesso

- [ ] Rota `/dashboard` acessível e protegida por Auth Guard
- [ ] Hero card de progresso exibindo `% completo`, título do módulo atual e botão CTA
- [ ] Seção de métricas (exercícios concluídos, nível atual, velocidade de aprendizado)
- [ ] Design original, não-clichê, alinhado ao RNF01 (identidade séria e acadêmica)
- [ ] Responsivo para telas ≥768px (RNF02)
- [ ] Nenhum purple/violet como cor primária (Purple Ban ✅)
- [ ] Dados completamente mockados — sem chamadas HTTP reais

---

## Stack Tecnológica

| Tecnologia | Papel |
|---|---|
| Angular 21 | Framework base, Standalone Components, Signals |
| PrimeNG | Componentes UI (Cards, ProgressBar, Chip, Skeleton) |
| TailwindCSS | Layout, espaçamento, responsividade, tipografia |
| RxJS / Signals | Estado local e reatividade |
| TypeScript 5 | Tipagem estrita, modelos de dados |

---

## Identidade Visual (Design Commitment)

> Baseado na análise da imagem de inspiração e nas regras do `frontend-specialist`:

- **Paleta:** Fundo escuro (`#0F1117`) + Verde ácido/escolar (`#28A745` ou derivado) como cor de ação. Acento âmbar para alertas. Sem azul default, sem purple.
- **Geometria:** Sharp edges (0-2px border-radius) para cards de dados; bordas suaves (8-12px) restrito ao hero card.
- **Tipografia:** Inter (Google Fonts) — weights 400/600/700. Display grande para métricas numéricas.
- **Animação:** Entrada com `staggered fade-up` (transition opacity + translateY). Hover com `scale(1.02)` nos cards clicáveis.
- **Layout:** Sidebar fixa + área de conteúdo em `grid`. Hero card em largura total no topo. Métricas em row horizontal. Grid assimétrico (60/40) para Atividade Recente + Insight IA.

---

## Estrutura de Arquivos

```
src/app/
├── core/
│   └── layout/
│       ├── sidebar/          ← [NOVO] Componente sidebar de navegação
│       │   ├── sidebar.ts
│       │   ├── sidebar.html
│       │   └── sidebar.css
│       └── dashboard-layout/ ← [NOVO] Shell layout do dashboard (sidebar + router-outlet)
│           ├── dashboard-layout.ts
│           ├── dashboard-layout.html
│           └── dashboard-layout.css
│
├── domain/
│   └── aluno/                ← [NOVO] Domínio do aluno
│       ├── models/
│       │   ├── progresso.model.ts
│       │   ├── atividade.model.ts
│       │   └── recomendacao.model.ts
│       └── services/
│           └── aluno-mock.service.ts ← [NOVO] Service com dados mockados via Signals
│
└── features/
    └── dashboard/            ← [NOVO] Feature do dashboard
        ├── dashboard.ts      ← Componente principal (standalone)
        ├── dashboard.html
        ├── dashboard.css
        └── components/       ← Sub-componentes do dashboard
            ├── hero-progresso/
            │   ├── hero-progresso.ts
            │   ├── hero-progresso.html
            │   └── hero-progresso.css
            ├── card-metrica/
            │   ├── card-metrica.ts
            │   └── card-metrica.html
            ├── atividade-recente/
            │   ├── atividade-recente.ts
            │   └── atividade-recente.html
            ├── insight-ia/
            │   ├── insight-ia.ts
            │   └── insight-ia.html
            └── recomendacoes/
                ├── recomendacoes.ts
                └── recomendacoes.html
```

---

## Task Breakdown

### FASE 0 — Modelos e Dados Mockados

---

#### T01 — Criar modelos TypeScript do domínio `aluno`

- **Agente:** `frontend-specialist`
- **Skill:** `clean-code`
- **Prioridade:** P0 (bloqueante)
- **Dependências:** nenhuma

**INPUT:** Requisitos do PRD e inspiração visual.
**OUTPUT:**
- `domain/aluno/models/progresso.model.ts` → interface `Progresso` com `percentual`, `tituloModulo`, `descricaoModulo`, `nivel`, `xp`
- `domain/aluno/models/atividade.model.ts` → interface `Atividade` com `titulo`, `tipo`, `data`, `pontuacao`, `nivel`
- `domain/aluno/models/recomendacao.model.ts` → interface `Recomendacao` com `titulo`, `categoria`, `duracao`, `dificuldade`, `imagemUrl`

**VERIFY:** `npx tsc --noEmit` sem erros. Tipagem estrita sem `any`.

---

#### T02 — Criar `AlunoMockService` com dados estáticos via Signals

- **Agente:** `frontend-specialist`
- **Skill:** `clean-code`, `react-best-practices` (equivalente Angular: Signals)
- **Prioridade:** P0 (bloqueante)
- **Dependências:** T01

**INPUT:** Modelos criados no T01.
**OUTPUT:** `domain/aluno/services/aluno-mock.service.ts`
- Signals: `progresso = signal<Progresso>(...)`, `atividades = signal<Atividade[]>(...)`, `recomendacoes = signal<Recomendacao[]>(...)`, `insightIA = signal<string>(...)`
- Dados mockados realistas (baseados no contexto de lógica de programação)

**VERIFY:** Service `@Injectable` funcionando sem erros de compilação.

---

### FASE 1 — Layout Shell e Sidebar

---

#### T03 — Criar Sidebar de Navegação

- **Agente:** `frontend-specialist`
- **Skill:** `frontend-design`, `tailwind-patterns`
- **Prioridade:** P1
- **Dependências:** nenhuma

**INPUT:** Inspiração visual (sidebar escura com logo, links e botão de IA).
**OUTPUT:** `core/layout/sidebar/` com:
- Logo do projeto no topo
- Links: Dashboard (ativo), Trilha de Aprendizado, Perfil
- Botão "Ask AI Assistant" na parte inferior
- Links Settings e Logout no rodapé
- Estilo: fundo `#0A0D14`, texto claro, item ativo com destaque em verde

**VERIFY:** Navegação visual funcional. Sem erros de lint (`npm run lint`).

---

#### T04 — Criar Dashboard Layout Shell

- **Agente:** `frontend-specialist`
- **Skill:** `tailwind-patterns`
- **Prioridade:** P1
- **Dependências:** T03

**INPUT:** Sidebar T03.
**OUTPUT:** `core/layout/dashboard-layout/` com grid `[sidebar 240px] [conteúdo flex-1]`.
- Rota pai `/dashboard` aponta para este layout
- `<router-outlet>` para o conteúdo da feature

**VERIFY:** Layout renderiza sidebar + área de conteúdo corretamente em 1280px.

---

#### T05 — Configurar rota `/dashboard` no `app.routes.ts`

- **Agente:** `frontend-specialist`
- **Skill:** `clean-code`
- **Prioridade:** P1
- **Dependências:** T04

**INPUT:** Estrutura de rotas existente (`app.routes.ts`).
**OUTPUT:** Rota `/dashboard` com `DashboardLayoutComponent` como pai e `DashboardComponent` como filho (`''`).
- Auth Guard aplicado (usar guard existente ou criar um simples que verifique token no localStorage).

**VERIFY:** Navegar para `/dashboard` no browser renderiza o layout sem erros no console.

---

### FASE 2 — Sub-componentes do Dashboard

---

#### T06 — Componente Hero de Progresso

- **Agente:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Prioridade:** P2
- **Dependências:** T01, T02

**INPUT:** `progresso` signal do AlunoMockService.
**OUTPUT:** `features/dashboard/components/hero-progresso/`
- Card largo com fundo verde escuro + gradiente sutil
- Exibe: título do módulo, `% completo`, descrição curta, botão "Continuar Trilha →"
- Ilustração/ícone decorativo no canto direito
- `p-progressbar` do PrimeNG para a barra de progresso
- Animação de entrada `fade-up` ao carregar

**VERIFY:** Componente renderiza dados do signal corretamente. Barra de progresso proporcional ao `percentual`.

---

#### T07 — Card de Métrica (componente reutilizável)

- **Agente:** `frontend-specialist`
- **Skill:** `clean-code`
- **Prioridade:** P2
- **Dependências:** T01, T02

**INPUT:** Props: `@Input() valor: number | string`, `@Input() label: string`, `@Input() icone: string`, `@Input() variacao?: string`
**OUTPUT:** `features/dashboard/components/card-metrica/`
- Card pequeno com número grande, label, ícone e variação percentual opcional
- 3 instâncias no dashboard: Exercícios Completos, Nível Atual, Streak de dias

**VERIFY:** Componente reutilizável com inputs tipados. Sem `any`.

---

#### T08 — Painel de Atividade Recente

- **Agente:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Prioridade:** P2
- **Dependências:** T01, T02

**INPUT:** `atividades` signal (lista de 4-5 atividades mockadas).
**OUTPUT:** `features/dashboard/components/atividade-recente/`
- Lista com ícone de tipo (exercício, quiz), título, data e pontuação
- Link "Ver Histórico" no cabeçalho
- Última atividade com destaque visual leve

**VERIFY:** Lista renderiza todas as atividades do mock sem erros de template.

---

#### T09 — Card Insight IA

- **Agente:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Prioridade:** P2
- **Dependências:** T02

**INPUT:** `insightIA` signal (string de sugestão mockada).
**OUTPUT:** `features/dashboard/components/insight-ia/`
- Card com cabeçalho "AI Insight", bloco de sugestão estilizado (aparência de código/citação)
- Botão "Explorar Mini-Lição"
- Indicador visual de IA (ícone de engrenagem ou bot)

**VERIFY:** Texto mockado exibido corretamente. Botão com estado hover funcional.

---

#### T10 — Seção de Recomendações

- **Agente:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Prioridade:** P2
- **Dependências:** T01, T02

**INPUT:** `recomendacoes` signal (lista de 3 itens mockados).
**OUTPUT:** `features/dashboard/components/recomendacoes/`
- Grid de 3 cards horizontais com imagem placeholder, título, categoria (chip), duração e dificuldade
- Hover com `scale(1.02)` e sombra
- Imagens geradas via `generate_image` ou placeholder SVG

**VERIFY:** Grid responsivo quebra para 1 coluna em mobile. Chips de categoria com cores distintas.

---

### FASE 3 — Composição e Polimento

---

#### T11 — Compor o `DashboardComponent` principal

- **Agente:** `frontend-specialist`
- **Skill:** `tailwind-patterns`, `frontend-design`
- **Prioridade:** P3
- **Dependências:** T06, T07, T08, T09, T10

**INPUT:** Todos os sub-componentes.
**OUTPUT:** `features/dashboard/dashboard.ts/.html/.css`
- Composição do layout: header com saudação + nível, hero card, row de métricas, grid assimétrico (atividade + insight), seção de recomendações
- Consumo do `AlunoMockService` injetado
- Animações staggered com CSS `@keyframes` + delays

**VERIFY:** Tela completa renderiza sem erros. Dados mockados aparecem em todas as seções.

---

#### T12 — Ajustes de responsividade e acessibilidade

- **Agente:** `frontend-specialist`
- **Skill:** `web-design-guidelines`
- **Prioridade:** P3
- **Dependências:** T11

**INPUT:** Dashboard completo.
**OUTPUT:** Ajuste de breakpoints (TailwindCSS `md:`, `lg:`), `aria-label` nos elementos interativos, `prefers-reduced-motion` para animações.

**VERIFY:** Tela funcional em 768px (tablet). Lint e type-check passando.

---

## Fase X — Verificação Final

> Executar após conclusão de T12.

```bash
# 1. Type check
npx tsc --noEmit

# 2. Lint
npm run lint

# 3. Auditoria UX
python .agent/skills/frontend-design/scripts/ux_audit.py .

# 4. Dev server
npm run start

# 5. Inspeção manual
# - Navegar para http://localhost:4200/dashboard
# - Verificar renderização de todos os cards
# - Testar hover dos cards de recomendação
# - Redimensionar para 768px e verificar responsividade
# - Checar console por erros
```

### Checklist de Conformidade

- [ ] Nenhum `any` no TypeScript
- [ ] Sem purple/violet como cor primária
- [ ] Dados 100% mockados (sem `HttpClient` chamado)
- [ ] Animações com `prefers-reduced-motion` respeitado
- [ ] Lint sem erros
- [ ] Rota `/dashboard` protegida com guard

---

## Dependência de Tarefas (Grafo)

```
T01 ──────┐
          ├──► T06
T02 ──────┤──► T07
          ├──► T08
          ├──► T09
          └──► T10
                    └──► T11 ──► T12
T03 ──► T04 ──► T05
```

---

> **Próximo passo:** Executar `/create` ou `/enhance` para iniciar a implementação a partir deste plano.
