
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
