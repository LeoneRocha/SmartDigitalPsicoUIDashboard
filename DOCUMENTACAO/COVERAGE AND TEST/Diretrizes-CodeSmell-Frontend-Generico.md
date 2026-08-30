# Diretrizes para Ajuste de Issues e Code Smells — Frontend (Genérico TypeScript / SPA)

**Documento:** Guia operacional padronizado e reutilizável para qualidade estática e governança de código frontend  
**Arquivo:** `Diretrizes-CodeSmell-Frontend-Generico.md`  
**Escopo:** Aplicações SPA, bibliotecas web e SDKs em TypeScript / JavaScript (Angular, React, Vue, Node.js Tooling)  
**Ferramental de Referência:** SonarQube, SonarCloud, ESLint, TypeScript Compiler (`tsc`), Sanitizadores de HTML (DOMPurify, DomSanitizer)  
**Target Platform:** TypeScript 5+ / 6+ / ECMAScript Moderno  
**Data da Revisão:** 2026-08-28  

---

## 1. Objetivo

Padronizar e orientar o processo de identificação, diagnóstico e remediação de **Code Smells**, **Bugs**, **Vulnerabilidades** e **Security Hotspots** apontados por analisadores estáticos (SonarQube, SonarCloud, ESLint, typescript-eslint, TypeScript) em ecossistemas frontend, assegurando:

1. **Zero Regressão de Interface e Negócio:** Nenhuma refatoração para eliminação de Code Smell pode alterar o comportamento visual, reatividade de estado, contratos de APIs REST ou acessibilidade (a11y).
2. **Alta Manutenibilidade e Legibilidade (*Maintainability Rating A*):** Eliminar complexidade cognitiva excessiva, duplicação de lógica, código morto, renderizações desnecessárias e acoplamentos espúrios.
3. **Prevenção de Memory Leaks e Vulnerabilidades:** Eliminar vazamentos de memória (event listeners, timers, subscrições RxJS/Observables e abort controllers não cancelados em destruição de componentes) e brechas de segurança (Cross-Site Scripting - XSS, injeção de raw HTML, manipulação insegura de DOM, links vulneráveis).
4. **Governança Ética de Linters:** Proibir a supressão indiscriminada de regras via `// eslint-disable` ou `@ts-ignore` sem justificativa arquitetural documentada e aprovada.

---

## 2. Taxonomia de Issues do Sonar e ESLint no Frontend

```mermaid
flowchart TD
    Issue[Issue SonarQube / SonarCloud / ESLint] --> CS[Code Smell\n(Manutenibilidade / Débito Técnico)]
    Issue --> Bug[Bug\n(Confiabilidade / Memory Leaks / Ciclos de Vida)]
    Issue --> Vuln[Vulnerabilidade\n(Segurança / XSS / ReDoS / Tabnabbing)]
    Issue --> Hotspot[Security Hotspot\n(Revisão de Contexto)]

    CS --> S1[Complexidade Cognitiva & Tamanho de Componente]
    CS --> S2[Nomenclatura, Tipos Implícitos 'any' & Código Morto]
    CS --> S3[Imports Duplicados & Comparações Redundantes]

    Bug --> B1[Vazamento de Memória em Subscrições / Timers sem Cleanup]
    Bug --> B2[Violação de Ciclo de Vida & Missing Dependencies]
    Bug --> B3[Acesso a Propriedades Nulas / Indefinidas]

    Vuln --> V1[Cross-Site Scripting via raw HTML inseguro]
    Vuln --> V2[Links target=_blank sem rel=noopener noreferrer]
    Vuln --> V3[Expressões Regulares Inseguras - ReDoS]
```

---

## 3. Catálogo de Regras Sonar / ESLint Frontend e Padrões de Correção

### 3.1 Manutenibilidade e Code Smells

| Regra Sonar / ESLint | Descrição | Causa Típica | Solução Recomendada (TypeScript / SPA) |
| -------------------- | --------- | ------------ | -------------------------------------- |
| **`typescript:S2234`** / **`S1940`** | *Comparisons should be simplified* | `typeof x === 'undefined'` em escopos onde `x` é tipado | Comparar diretamente com `undefined` (`x === undefined`) ou utilizar checagem de presença (`!x`). |
| **`typescript:S3776`** | *Cognitive Complexity of functions should not be too high* | Componentes ou helpers com muitos `if/else`, loops aninhados e ternários | Decompor em componentes menores (*Sub-components*) ou extrair lógica para serviços / helpers puros. |
| **`typescript:S1144`** / **`@typescript-eslint/no-unused-vars`** | *Unused variables, methods and imports* | Variáveis, parâmetros ou imports declarados mas nunca utilizados | Remover o identificador não utilizado. Em parâmetros posicionais de callback obrigatórios, prefixar com `_` (ex.: `_event`). |
| **`typescript:S1128`** | *Unused / Duplicated imports should be removed* | Múltiplos imports do mesmo módulo no mesmo arquivo | Agrupar imports em uma única declaração e remover referências obsoletas. |
| **`typescript:S1488`** | *Local variables should not be declared and immediately returned* | `const result = format(data); return result;` | Retornar diretamente a expressão: `return format(data);`. |
| **`typescript:S3317`** | *Top-level declarations should be in separate files* | Múltiplos componentes ou interfaces grandes no mesmo arquivo | Separar cada componente, serviço ou modelo em seu próprio arquivo correspondente. |
| **`@typescript-eslint/no-explicit-any`** | *Unexpected any. Specify a different type* | Tipagem genérica `any` em retornos de APIs ou estados | Definir interfaces/tipos estritos em modelos de domínio (*DTOs/Interfaces*). |

---

### 3.2 Confiabilidade e Bugs

| Regra Sonar / ESLint | Descrição | Causa Típica | Solução Recomendada |
| -------------------- | --------- | ------------ | ------------------- |
| **`typescript:S3800`** / **`S4200`** | *Event Listeners, Timers and Subscriptions must be cleaned up* | Usar `setInterval`, `addEventListener` ou `Observable.subscribe()` sem unsubscribe no encerramento | Implementar cleanup explícito no unmount (`ngOnDestroy`, `useEffect cleanup`, `takeUntilDestroyed` ou `clearInterval`). |
| **`typescript:S2259`** | *Objects should not be accessed when possibly null/undefined* | Acessar propriedades de objetos assíncronos sem checagem prévia | Usar encadeamento opcional (*optional chaining* `obj?.prop`) e coalescência nula (`obj?.prop ?? defaultValue`). |
| **`javascript:S2699`** | *Tests should include assertions* | Blocos de teste (`it` / `test`) sem asserção `expect(...)` | Adicionar asserções explícitas (`expect(component).toBeTruthy()`, `expect(result).toBe(...)`). |

---

### 3.3 Segurança e Vulnerabilidades

| Regra Sonar / ESLint | Descrição | Causa Típica | Solução Recomendada |
| -------------------- | --------- | ------------ | ------------------- |
| **`typescript:S5147`** / **`S6096`** | *Cross-Site Scripting (XSS) via raw HTML* | Injeção de HTML dinâmico sem sanitização estrita | Sanitizar obrigatoriamente a string com `DomSanitizer` (Angular) ou `DOMPurify.sanitize()` antes da injeção. |
| **`javascript:S2819`** | *Links with target="_blank" must include rel="noopener noreferrer"* | Tags `<a>` com `target="_blank"` sem isolamento de janela | Adicionar sempre `rel="noopener noreferrer"` para impedir ataques de *Tabnabbing*. |
| **`typescript:S4507`** | *Debugging statements should not be present in production* | Comandos `debugger;` ou `console.log()` esquecidos no código | Remover instruções de depuração antes do build de produção. |
| **`javascript:S5852`** | *Regular expressions should not be vulnerable to ReDoS* | Expressões regulares com quantificadores ambíguos sujeitas a backtracking | Reescrever o regex de forma determinística ou utilizar validadores padronizados. |

---

## 4. Fluxo Operacional de Saneamento Passo a Passo

```mermaid
flowchart TD
    P1[1. Análise Estática com ESLint / Sonar] --> P2[2. Triagem e Priorização\n(Vulnerabilidades > Bugs > Code Smells)]
    P2 --> P3[3. Diagnóstico e Causa Raiz]
    P3 --> P4[4. Refatoração Limpa e Tipagem Estrita TypeScript]
    P4 --> P5[5. Execução de Testes Automatizados e Build]
    P5 --> P6{Passou com 0 erros e 100% testes?}
    P6 -- Não --> P3
    P6 -- Sim --> P7[6. Reanálise Sonar e Emissão de Evidências]
```

### 4.1 Comandos de Diagnóstico e Validação

```powershell
# 1. Executar análise do ESLint
npm run lint

# 2. Executar validação estrita de tipos do TypeScript / Build
npm run build

# 3. Executar toda a suíte de testes unitários
npm test

# 4. Compilar bundle otimizado de produção
npm run build:prod
```

---

## 5. Checklist de Qualidade Obrigatório

- [ ] **Linter Limpo**: `npm run lint` conclui com 0 erros e 0 warnings.
- [ ] **TypeScript Estrito**: Compilação TypeScript conclui sem erros de tipagem.
- [ ] **100% dos Testes Aprovados**: Todos os testes unitários passando (`npm test`).
- [ ] **Build de Produção OK**: `npm run build:prod` gera bundles minificados em `dist/` sem falhas.
- [ ] **Zero Supressões Arbitrárias**: Nenhum `// eslint-disable` ou `@ts-ignore` inserido sem justificativa formal.
- [ ] **Sanitização XSS Ativa**: Todo conteúdo dinâmico HTML validado via sanitizador homologado (`DomSanitizer` / `DOMPurify`).
- [ ] **Memory Leaks Prevenidos**: Subscrições e timers cancelados deterministicamente na destruição de componentes.

---

## 6. Template de Registro de Evidências

```text
================================================================================
RELATÓRIO DE SANEAMENTO DE CODE SMELLS (FRONTEND)
================================================================================
Data: AAAA-MM-DD
Projeto: <NomeDoProjetoUI>

1. Sumário de Issues Resolvidas:
   - Vulnerabilidades (XSS, ReDoS, Tabnabbing): 0 pendentes
   - Bugs / Memory Leaks (Cleanups, Subscriptions, Timers): 0 pendentes
   - Code Smells (Linter, Tipos, Imports): N corrigidos

2. Principais Regras Saneadas:
   - typescript:S3800: Subscrições RxJS e timers com cleanup no destroy
   - typescript:S5147: Sanitização aplicada em renderizações de HTML dinâmico
   - typescript:S1128: Imports duplicados e variáveis não utilizadas eliminados
   - javascript:S2819: Adicionado rel="noopener noreferrer" em links externos

3. Validação:
   - ESLint: 0 erros / 0 warnings
   - Testes Unitários: N / N aprovados (100%)
   - Build Prod: Concluído com sucesso (dist/)
================================================================================
```
