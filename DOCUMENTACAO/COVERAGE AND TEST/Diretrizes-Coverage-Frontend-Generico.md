# Diretrizes para Testes Automatizados e Cobertura (Coverage) — Frontend (Genérico TypeScript / SPA)

**Documento:** Guia operacional padronizado e reutilizável para engenharia de testes e cobertura frontend  
**Arquivo:** `Diretrizes-Coverage-Frontend-Generico.md`  
**Escopo:** Aplicações SPA, bibliotecas cliente e componentes web em TypeScript (Angular, React, Vue, Jasmine, Karma, Vitest, Jest)  
**Ferramental de Referência:** Jasmine, Karma, Vitest, Jest, Testing Library, Istanbul / LCOV  
**Target Platform:** TypeScript 5+ / 6+ / ECMAScript Moderno  
**Data da Revisão:** 2026-08-28  

---

## 1. Objetivo

Padronizar a criação, estruturação e manutenção de testes unitários e de integração em ecossistemas frontend baseados em TypeScript / SPA, garantindo:

1. **Alta Cobertura e Não-Regressão:** Atingir e manter metas rigorosas de cobertura (**Statements**, **Branches**, **Functions** e **Lines**) em componentes visuais, telas, serviços HTTP, gerenciadores de estado (NgRx / Redux / Pinia), interceptors, guards e utilitários.
2. **Isolamento e Determinismo:** Testes rápidos e independentes, utilizando mocks e spies (`spyOn()`, `jasmine.createSpyObj`, `vi.fn()`, `HttpClientTestingModule`) para isolar chamadas de rede HTTP, autenticação, armazenamento local (`localStorage`/`sessionStorage`), timers e bibliotecas externas.
3. **Clareza com Padrão AAA:** Estrutura clara baseada em **Arrange / Act / Assert**.
4. **Resiliência e Testabilidade pelo Comportamento:** Foco em testar o comportamento da aplicação a partir da perspectiva do usuário e das regras de negócio, validando fluxos de dados, interações e manipulação de erros.

---

## 2. Padrões Obrigatórios de Escrita de Testes Frontend

### 2.1 Nomenclatura em Inglês
Os blocos `describe` e métodos `it` / `test` devem ser redigidos em inglês seguindo a convenção tripartite:
```typescript
describe('UserFormComponent', () => {
  it('loadData_WhenUserIsAuthenticated_RendersAvailableOptions', async () => { ... });
  it('submitForm_WithInvalidInput_DisplaysValidationMessage', async () => { ... });
});
```

---

### 2.2 Comentários de Contexto em Português
Acima de cada teste ou bloco de cenários, adicionar um comentário em português explicando o cenário e o objetivo:

```typescript
// Cenário: Submissão de formulário de login com credenciais válidas.
// Objetivo: Garantir que o token de autenticação seja persistido e o usuário redirecionado.
it('submitForm_WithValidCredentials_StoresTokenAndRedirects', async () => {
  // Arrange
  // Act
  // Assert
});
```

---

### 2.3 Estrutura Arrange / Act / Assert (AAA)

```typescript
// Cenário: Tentativa de operação quando a API remota retorna erro HTTP 500.
// Objetivo: Validar que a notificação de erro seja acionada e o estado de carregamento desligado.
it('fetchResource_WhenApiFails_ShowsErrorNotificationAndResetsLoading', () => {
  // Arrange
  const notificationSpy = spyOn(notificationService, 'showError');
  spyOn(dataService, 'getById').and.returnValue(throwError(() => new Error('Server Error')));

  // Act
  component.loadDetails(123);

  // Assert
  expect(notificationSpy).toHaveBeenCalledWith(jasmine.stringMatching(/Erro/i));
  expect(component.isLoading).toBeFalse();
});
```

---

## 3. Tipologia de Testes no Frontend

```mermaid
flowchart TD
    FrontendTests[Testes Automatizados Frontend] --> ServiceTests[Testes de Serviços & Clientes HTTP\n(HttpClient, Auth, Session, Storage, Interceptors)]
    FrontendTests --> ComponentTests[Testes de Componentes & Telas\n(Templates, DOM, Eventos, Modais, Formulários)]
    FrontendTests --> StateTests[Testes de Gerenciamento de Estado\n(NgRx / Redux / Store: Reducers, Effects, Selectors)]
    FrontendTests --> GuardTests[Testes de Roteamento & Guards\n(AuthGuard, CanActivate, CanDeactivate)]
    FrontendTests --> HelperTests[Testes de Utilitários & Pipes\n(Formatadores, Máscaras, Sanitizadores)]
```

### 3.1 Testes de Serviços e Clientes HTTP
- Utilizar módulos de teste HTTP dedicados (`HttpClientTestingModule` / `HttpTestingController` ou mock adapters).
- Validar envio de tokens nos headers de autenticação (`Authorization: Bearer ...`), deserialização de DTOs e captura adequada de códigos de status HTTP (400, 401, 403, 500).

### 3.2 Testes de Componentes Visuais e Telas
- Configurar o test bed (`TestBed.configureTestingModule` ou testing-library).
- Simular interações de usuário (cliques, digitação em formulários reativos, acionamento de modais).

---

## 4. Métricas e Gestão de Exclusões de Cobertura

### 4.1 As 4 Métricas Fundamentais de Cobertura
1. **Statements (% de Instruções):** Proporção de instruções de código executadas.
2. **Branches (% de Ramos/Condições):** Proporção de caminhos lógicos (`if/else`, `switch`, operadores ternários, `?.`) testados.
3. **Functions (% de Funções):** Proporção de métodos e callbacks invocados.
4. **Lines (% de Linhas):** Proporção de linhas físicas executadas.

### 4.2 Exclusões de Cobertura Válidas
Arquivos que **não contêm lógica testável** devem ser excluídos na configuração de cobertura do runner e no `sonar-project.properties`:
- Arquivos de bootstrap (`main.ts`, `polyfills.ts`, `index.html`).
- Definições de tipos e interfaces puras (`models/**`, `interfaces/**`, `enums/**`).
- Mocks e arquivos de configuração de testes (`test.ts`, `karma.conf.js`).
- Módulos puramente declarativos de rotas ou assets estáticos.

---

## 5. Roteiro Operacional de Execução

```powershell
# 1. Executar suíte completa de testes
npm test

# 2. Executar testes em modo headless para CI/CD com coleta de cobertura
npm run test -- --no-watch --no-progress --browsers=ChromeHeadless --code-coverage

# 3. Validar arquivo de relatório gerado
# O relatório LCOV será gerado em coverage/lcov.info
```

---

## 6. Checklist de Qualidade Frontend

- [ ] Nome do teste em inglês no padrão `Metodo_Cenario_Resultado`.
- [ ] Comentários em português `// Cenário:` e `// Objetivo:` presentes.
- [ ] Padrão AAA respeitado com asserções declarativas (`expect(...)`).
- [ ] Spies e mocks limpos e isolados entre cada teste.
- [ ] Cobertura de ramos (*branch coverage*) validando cenários de sucesso e erro.
- [ ] Zero dependência de servidores backend reais (100% das requisições HTTP mockadas).
