# Conjunto Homologado — Ciclo 2026-08 (Frontend Angular / npm)

**Data:** 2026-08-22  
**Projeto:** [SmartDigitalPsicoUIDashboard](file:///c:/git/SMARTDIGITALPSICO/SmartDigitalPsicoUIDashboard)  
**Manifesto:** [package.json](file:///c:/git/SMARTDIGITALPSICO/SmartDigitalPsicoUIDashboard/package.json)  
**Guia Base:** [GuiaAtualizacaoPacotes-SmartDigitalPsicoUIDashboard.md](file:///c:/git/SMARTDIGITALPSICO/SmartDigitalPsicoUIDashboard/DOCUMENTACAO/UpdatePackages/GuiaAtualizacaoPacotes-SmartDigitalPsicoUIDashboard.md)  

---

## 1. Pacotes npm Aplicados

### Bloco A — Core Framework & Builder (Angular 22)

| Pacote | Versão Anterior | Versão Aplicada | Status / Observações |
| ------ | --------------- | --------------- | -------------------- |
| `@angular/animations` | `^22.1.0` | **`^22.1.3`** | Atualizado |
| `@angular/cdk` | `^22.1.0` | **`^22.1.3`** | Atualizado |
| `@angular/common` | `^22.1.0` | **`^22.1.3`** | Atualizado |
| `@angular/compiler` | `^22.1.0` | **`^22.1.3`** | Atualizado |
| `@angular/core` | `^22.1.0` | **`^22.1.3`** | Atualizado |
| `@angular/elements` | `^22.1.0` | **`^22.1.3`** | Atualizado |
| `@angular/forms` | `^22.1.0` | **`^22.1.3`** | Atualizado |
| `@angular/google-maps` | `^22.1.0` | **`^22.1.3`** | Atualizado |
| `@angular/localize` | `^22.1.0` | **`^22.1.3`** | Atualizado |
| `@angular/platform-browser` | `^22.1.0` | **`^22.1.3`** | Atualizado |
| `@angular/platform-browser-dynamic` | `^22.1.0` | **`^22.1.3`** | Atualizado |
| `@angular/router` | `^22.1.0` | **`^22.1.3`** | Atualizado |
| `@angular/cli` | `^22.1.2` | **`^22.1.5`** | Atualizado |
| `@angular-devkit/build-angular` | `^22.1.2` | **`^22.1.5`** | Atualizado |
| `@angular/compiler-cli` | `^22.1.0` | **`^22.1.3`** | Atualizado |
| `@angular/language-service` | `^22.1.0` | **`^22.1.3`** | Atualizado |
| `@angular-builders/custom-webpack` | `^22.0.1` | **`^22.0.1`** | Mantido compatível |

---

### Bloco B — Estado, Autenticação e i18n

| Pacote | Versão Anterior | Versão Aplicada | Status / Observações |
| ------ | --------------- | --------------- | -------------------- |
| `@ngrx/effects` | `^22.0.0-beta.0` | **`^22.0.0-rc.0`** | Atualizado |
| `@ngrx/store` | `^22.0.0-beta.0` | **`^22.0.0-rc.0`** | Atualizado |
| `@ngrx/store-devtools` | `^22.0.0-beta.0` | **`^22.0.0-rc.0`** | Atualizado |
| `@auth0/angular-jwt` | `^5.2.0` | **`^5.2.0`** | Estável |
| `@ngx-translate/core` | `^18.0.0` | **`^18.0.0`** | Estável |
| `@ngx-translate/http-loader` | `^18.0.0` | **`^18.0.0`** | Estável |

---

### Bloco C — Componentes Visuais e Calendário

| Pacote | Versão Anterior | Versão Aplicada | Status / Observações |
| ------ | --------------- | --------------- | -------------------- |
| `@fullcalendar/angular` | `^6.1.21` | **`^6.1.21`** | Mantido (linha 6.x estável) |
| `@fullcalendar/core` | `^6.1.15` | **`^6.1.21`** | Alinhado |
| `@fullcalendar/daygrid` | `^6.1.15` | **`^6.1.21`** | Alinhado |
| `@fullcalendar/interaction` | `^6.1.15` | **`^6.1.21`** | Alinhado |
| `@fullcalendar/timegrid` | `^6.1.15` | **`^6.1.21`** | Alinhado |
| `bootstrap` | `^3.4.1` | **`^3.4.1`** | **Pin deliberado** (template Light Bootstrap Pro) |
| `jquery` | `^3.7.1` | **`^3.7.1`** | Estável |

---

### Bloco D — Tooling, Linter e TypeScript

| Pacote | Versão Anterior | Versão Aplicada | Status / Observações |
| ------ | --------------- | --------------- | -------------------- |
| `eslint` | `^10.3.0` | **`^10.9.0`** | Atualizado |
| `typescript-eslint` | `8.59.2` | **`^8.67.0`** | Atualizado |
| `@types/google.maps` | `^3.55.5` | **`^3.65.5`** | Atualizado |
| `typescript` | `~6.0.0` | **`~6.0.0`** | **Pin mantido** (trava do compilador Angular 22) |

---

### Overrides de Segurança

| Pacote | Versão Forçada | Justificativa |
| ------ | -------------- | ------------- |
| `moment-timezone` | `^0.5.48` | Correção transitiva |
| `@hono/node-server` | `^2.0.12` | Correção de vulnerabilidades de ReDoS/CORS |
| `nanoid` | `^3.3.18` | Corrige loop infinito em geradores customizados |
| `uuid` | `^11.1.1` | Correção transitiva |

---

## 2. Validações Executadas

```text
1. Instalação / Resolução:
   npm install -> 0 conflitos de peer dependencies (ERESOLVE)

2. Compilação de Produção:
   npm run build:prod -> OK (0 erros, bundles gerados em dist/ com versionamento automático)

3. Auditoria de Segurança em Produção:
   npm audit --omit=dev -> 0 vulnerabilidades High/Critical (apenas aviso do Bootstrap 3 legado)
```
