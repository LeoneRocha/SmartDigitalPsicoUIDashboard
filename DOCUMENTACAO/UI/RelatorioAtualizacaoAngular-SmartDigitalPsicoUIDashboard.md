# Relatório de Atualização — SmartDigitalPsicoUIDashboard (Angular)

**Status:** CONCLUÍDO  
**Projeto:** `SmartDigitalPsicoUIDashboard/`  
**Branch:** trabalho local (sem commit/PR neste ciclo)  
**Data da execução:** 2026-08-01  
**Conjunto (inventário completo `package.json`):** `2026-07-LevantamentoConjuntoHomologado-SmartDigitalPsicoUIDashboard.md`  
**Planos:** `PlanoImplementacaoAtualizacaoAngular-SmartDigitalPsicoUIDashboard.md` (14→21); plano Angular 21→22 (Cursor)

---

## 1. Resumo executivo

```text
Framework: Angular (mantido)
Partida original: Angular 14 (^14.2.0)
Ciclo anterior: Angular ~21.2.19 (LTS)
Destino atual: Angular ~22.1.0 — linha ativa (não LTS; LTS continua 21)
Família alinhada: @angular/* 22.1.0; CDK/google-maps 22.1.0; CLI/build 22.1.2
NgRx: 21.1.1 → 22.0.0-beta.0 (única linha 22 publicada no npm)
ngx-translate: 18/18 (mantido)
FullCalendar Angular: 6.1.x (mantido)
TypeScript: ~5.9 → ~6.0.0 (strict:false explícito — TS6 default strict=true)
Node engines: ^22.22.3 || ^24.15.0 || ^26.0.0 (Node 20 removido)
Bootstrap: 3.4.x mantido
Status execução: CONCLUÍDO
Build prod: OK
Testes: 3/3 OK
ng serve: OK (HTTP 200 /, app-root + bundles)
```

---

## 2. Família `@angular/*` (após 21 → 22)

| Pacote | Antes (21) | Depois (22) |
| ------ | ---------- | ----------- |
| `@angular/animations` | ^21.2.19 | ^22.1.0 |
| `@angular/cdk` | ^21.2.14 | ^22.1.0 |
| `@angular/common` | ^21.2.19 | ^22.1.0 |
| `@angular/compiler` | ^21.2.19 | ^22.1.0 |
| `@angular/core` | ^21.2.19 | ^22.1.0 |
| `@angular/elements` | ^21.2.19 | ^22.1.0 |
| `@angular/forms` | ^21.2.19 | ^22.1.0 |
| `@angular/google-maps` | ^21.2.14 | ^22.1.0 |
| `@angular/localize` | ^21.2.19 | ^22.1.0 |
| `@angular/platform-browser` | ^21.2.19 | ^22.1.0 |
| `@angular/platform-browser-dynamic` | ^21.2.19 | ^22.1.0 |
| `@angular/router` | ^21.2.19 | ^22.1.0 |
| `@angular/cli` | ^21.2.19 | ^22.1.2 |
| `@angular/compiler-cli` | ^21.2.19 | ^22.1.0 |
| `@angular/language-service` | ^21.2.19 | ^22.1.0 |
| `@angular-devkit/build-angular` | ^21.2.19 | ^22.1.2 |
| `@angular-builders/custom-webpack` | ^21.1.0 | ^22.0.1 |

- [x] Família core/CLI em **22.x** sem drift de major

---

## 3. Satélites e demais deps (delta 21 → 22)

| Pacote | Antes | Depois / ação |
| ------ | ----- | ------------- |
| `@ngrx/store` / effects / store-devtools | ^21.1.1 | ^22.0.0-beta.0 |
| `angular-eslint` | 21.4.0 | ^22.1.0 |
| `typescript` | ~5.9.0 | ~6.0.0 |
| `zone.js` | ^0.15.1 | ^0.15.1 (mantido) |
| Demais satélites (translate, FullCalendar, Bootstrap 3, etc.) | — | mantidos |

**Migrations `ng update` aceitas:** `ChangeDetectionStrategy.Eager` em componentes; `provideHttpClient(withXhr(), …)`; `$safeNavigationMigration` no modal de calendário; `strictTemplates: false`.

**Compat explícita:** `RouterModule.forRoot({ paramsInheritanceStrategy: 'emptyOnly' })` (default 22 = `always`).

**Ajustes de build TS6 / Angular 22:** `strict: false` + `ignoreDeprecations: "6.0"` + `esModuleInterop` nos tsconfigs; `import moment from 'moment'`; remoção do import morto `ComponentFactoryResolver`.

**Não feito neste ciclo:** Karma → Vitest; application builder (`@angular/build:application`).

---

## 4. Gates (ciclo 21 → 22)

| Gate | Resultado |
| ---- | --------- |
| Família `@angular/*` alinhada 22.x | OK |
| Build production | OK |
| `ng test` ChromeHeadless | OK (3 SUCCESS) |
| `ng serve` | OK — Compiled successfully; HTTP 200 `/` com `app-root` |
| Docker Node 22 | Dockerfile: `node:22`, `@angular/cli@22`, `npm ci --legacy-peer-deps` |

---

## 5. Desvios / notas

1. **NgRx 22 estável ainda não no npm** — usado `22.0.0-beta.0` (peer `@angular/core` ^22).
2. **TS 6** muda default `strict=true`; projeto restaura `strict: false` para evitar refatoração ampla.
3. **`extendedDiagnostics` + `strictTemplates:false`** conflitam (NG4003) — diagnostics de suppress removidos; `strictTemplates: false` mantido.
4. **Install:** `--legacy-peer-deps` (Bootstrap 3 / jQuery / `@kolkov/angular-editor` peers).
5. Builder Webpack legado continua em uso (avisos de depreciação do CLI 22).

---

## 6. Critérios de aceite (ciclo 22)

1. [x] Família `@angular/*` em **22.x**  
2. [x] Node engines sem 20; TypeScript 6  
3. [x] Eager CD + `emptyOnly` + HttpClient XHR  
4. [x] Build + test + serve OK  
5. [x] Dockerfile Node 22 + CLI 22  
6. [x] Karma mantido (sem Vitest)  

---

## 7. Conclusão

Upgrade Angular **21.2.x → 22.1.x** (active line) concluído com build/test/serve verdes. Toolchain em Node ≥22.22.3 e TypeScript 6; NgRx em beta 22 até release estável. Bootstrap 3 + NgModules + Karma preservados.

Histórico do ciclo **14 → 21** permanece nas seções do plano antigo e no inventário homologado; este relatório reflete o estado **atual** pós-22.

---

## 8. Referências

- `DOCUMENTACAO/UI/2026-07-LevantamentoConjuntoHomologado-SmartDigitalPsicoUIDashboard.md`  
- `DOCUMENTACAO/UI/PlanoImplementacaoAtualizacaoAngular-SmartDigitalPsicoUIDashboard.md`  
- `package.json`  
- https://angular.dev/reference/versions  
