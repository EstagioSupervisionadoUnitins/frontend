# PLAN-exercicio-detalhes.md
## Tela de Detalhes do Exercício com Editor de Código

---

## Visão Geral

Implementação da tela de **Detalhes do Exercício** (`/aluno/exercicio/:id`), um ambiente interativo onde o aluno pode visualizar o enunciado (gerado/avaliado por IA), escrever a solução em código utilizando o **Monaco Editor** e receber feedback em tempo real.

O design seguirá a identidade visual definida (Tailwind), priorizando uma interface de desenvolvimento limpa (IDE-like experience) dividida em painéis (enunciado vs. editor).

---

## Tipo de Projeto

**WEB** — Angular 21, PrimeNG, TailwindCSS, Monaco Editor.

---

## Critérios de Sucesso

- [ ] Rota `/aluno/exercicio/:id` ou similar, acessível.
- [ ] Interface dividida visualmente (Split layout): Painel de Instruções (esquerda) e Painel do Editor/Feedback (direita).
- [ ] Integração bem-sucedida do `monaco-editor` no Angular 21.
- [ ] Mock de fluxo de envio: Botão "Enviar Código", estado de "Avaliando pela IA..." e exibição do feedback (Sucesso/Erro com sugestões).
- [ ] Nenhum purple/violet (Purple Ban ✅).

---

## Stack Tecnológica Especifica

| Tecnologia | Papel |
|---|---|
| Angular 21 | Standalone Components, Signals para gerenciar estado do código e feedback |
| ngx-monaco-editor-v2 | Wrapper moderno para integração do Monaco Editor no Angular |
| TailwindCSS | Layout em Flexbox/Grid para a área de edição e descrição |
| PrimeNG | Componentes de UI complementares (Botões, Toast, ScrollPanel) |

---

## Identidade Visual e Layout

- **Split Screen**: Divisão 40/60 ou 30/70.
  - **Esquerda**: Enunciado, dicas, e feedback pós-submissão.
  - **Direita**: Editor Monaco ocupando o máximo de espaço, com menu de ações (Executar/Enviar) rodapé ou topo.
- **Tema Autêntico**: O Monaco será configurado preferencialmente no tema White (ex: `vs-white`) para remeter a uma IDE real.
- **Acessibilidade**: Contrastes adequados, textos legíveis.

---

## Estrutura de Arquivos Planejada

```
src/app/
├── domain/
│   └── aluno/
│       ├── models/
│       │   └── exercicio.model.ts       ← [NOVO] Interfaces de Exercicio e Feedback
│       └── services/
│           └── exercicio-mock.service.ts ← [NOVO] Mock de avaliação de código/IA
│
└── features/
    └── exercicio/                        ← [NOVO] Feature Exercicio
        ├── exercicio.ts
        ├── exercicio.html
        └── components/
            ├── painel-instrucao/         ← [NOVO] Exibe o enunciado e retorno da IA
            ├── painel-editor/            ← [NOVO] Wrapper do Monaco Editor
```

---

## Task Breakdown

### FASE 0 — Preparação e Instalação
#### T01 — Configurar Monaco Editor
- **Agente**: `frontend-specialist`
- **Prioridade**: P0
- **Ação**: Instalar `ngx-monaco-editor-v2` (ou equivalente moderno para Angular) e `monaco-editor`. Configurar no `angular.json` os assets necessários do Monaco.
- **Verify**: Projeto compila sem erros (`npx tsc --noEmit`).

### FASE 1 — Modelos e Mock Service
#### T02 — Criar Modelos e Service
- **Agente**: `frontend-specialist`
- **Prioridade**: P0
- **Ação**: Criar `exercicio.model.ts` e `exercicio-mock.service.ts`. Simular a lógica de avaliar um código via Signal e retornar um feedback fictício da IA após 2 segundos (delay).

### FASE 2 — Componentes de UI
#### T03 — Componente `PainelInstrucao`
- **Agente**: `frontend-specialist`
- **Prioridade**: P1
- **Ação**: Criar painel esquerdo que exibe título, descrição rica em marcação, botão de dica e a área de feedback gerado pela IA. Formatação flex com Tailwind.

#### T04 — Componente `PainelEditor`
- **Agente**: `frontend-specialist`
- **Prioridade**: P1
- **Ação**: Criar painel direito com a tag `<ngx-monaco-editor>` (ou uso standalone). Configurar opções (linguagem JS/TS, tema dark, minimap false). Adicionar botão de "Enviar Solução".

#### T05 — Componente Principal e Rota
- **Agente**: `frontend-specialist`
- **Prioridade**: P1
- **Ação**: Compor a tela `Exercicio` unindo instrução e editor lado a lado. Registrar a rota `/aluno/exercicio/:id` (ou rota direta) no `app.routes.ts`.

### FASE X — Verificação
1. Checar compilação `npx tsc --noEmit`
2. Testar UI rodando `npm run start`
3. Verificar se o Monaco Editor carrega corretamente e se não há quebras no terminal ou console do navegador.

---

> **Próximo passo:** Revisar dependências (instalar Monaco Editor exigirá ajustes no package.json e angular.json). Se aprovado, digite `/create` ou autorize a execução.
