# Relatório de Atualização — SmartDigitalPsicoUIDashboard (Angular)

**Status:** CONCLUÍDO  
**Projeto:** `SmartDigitalPsicoUIDashboard/`  
**Branch:** `chore/update-packages-smartdigitalpsicouidashboard-angular21` (trabalho local)  
**Data da execução:** 2026-08-01  
**Conjunto (inventário completo `package.json`):** `2026-07-LevantamentoConjuntoHomologado-SmartDigitalPsicoUIDashboard.md`  
**Plano:** `PlanoImplementacaoAtualizacaoAngular-SmartDigitalPsicoUIDashboard.md`

---

## 1. Resumo executivo

```text
Framework: Angular (mantido)
Partida: Angular 14 (^14.2.0)
Destino: Angular ~21.2.19 — família alinhada (cdk/google-maps ~21.2.14)
NgRx: 14 → 21.1.1
ngx-translate: 14/7 → 18/18 (API provideTranslateService)
FullCalendar Angular: 5 → 6.1.x (script fullcalendar@3 mantido)
TypeScript: ~4.7 → ~5.9.0
Node engines: 18.14.2 → ^20.19 || ^22.12 || ^24
Bootstrap: 3.4.x mantido
Status execução: CONCLUÍDO
Build prod: OK
Testes: 3/3 OK
ng serve: OK (HTTP 200, app-root + bundles)
```

---

## 2. Família `@angular/*`

| Pacote | Antes | Depois |
| ------ | ----- | ------ |
| `@angular/animations` | ^14.2.0 | ^21.2.19 |
| `@angular/cdk` | ^14.2.0 | ^21.2.14 |
| `@angular/common` | ^14.2.0 | ^21.2.19 |
| `@angular/compiler` | ^14.2.0 | ^21.2.19 |
| `@angular/core` | ^14.2.0 | ^21.2.19 |
| `@angular/elements` | ^14.2.0 | ^21.2.19 |
| `@angular/forms` | ^14.2.0 | ^21.2.19 |
| `@angular/google-maps` | ^14.2.0 | ^21.2.14 |
| `@angular/localize` | ^14.2.0 | ^21.2.19 |
| `@angular/platform-browser` | ^14.2.0 | ^21.2.19 |
| `@angular/platform-browser-dynamic` | ^14.2.0 | ^21.2.19 |
| `@angular/router` | ^14.2.0 | ^21.2.19 |
| `@angular/cli` | ~14.2.7 | ^21.2.19 |
| `@angular/compiler-cli` | ^14.2.0 | ^21.2.19 |
| `@angular/language-service` | 14.2.0 | ^21.2.19 |
| `@angular-devkit/build-angular` | ^14.2.7 | ^21.2.19 |
| `@angular-builders/custom-webpack` | ^14.1.0 | ^21.1.0 |

- [x] `npm ls` confirma **zero drift de major** (todas major 21)

---

## 3. Satélites e demais deps

| Pacote | Antes | Depois / ação |
| ------ | ----- | ------------- |
| `@ngrx/store` / effects / store-devtools | ^14.0.1 | ^21.1.1 |
| `@ngx-translate/core` | ^14.0.0 | ^18.0.0 |
| `@ngx-translate/http-loader` | ^7.0.0 | ^18.0.0 |
| `ngx-translate-messageformat-compiler` | ^6.2.0 | ^7.3.0 |
| `@messageformat/core` | ^3.1.0 | ^3.4.0 |
| `@auth0/angular-jwt` | ^5.1.2 | ^5.2.0 |
| `@kolkov/angular-editor` | 3.0.0-beta.2 | ^3.0.3 |
| `@fullcalendar/angular` (+ plugins) | ^5.11.3 | ^6.1.x |
| `fullcalendar` | 3.10.1 | 3.10.1 (mantido v1) |
| `@ngui/map` | 0.30.3 | **Removido** → `@angular/google-maps` |
| `angular-ng-autocomplete` | ^2.0.12 | mantido |
| `ngx-chips` | 2.2.2 | **Removido** → stub local `TagInputModule` |
| `ng2-nouislider` | 1.8.2 | **Removido** → stub local `NouisliderModule` |
| `jw-bootstrap-switch-ng2` | 2.0.5 | **Removido** → stub local `bSwitch` |
| `bootstrap` | ^3.4.1 | ^3.4.1 |
| `jquery` | 3.5.1 | ^3.7.1 |
| `sweetalert2` | 10.12.5 | 10.12.5 (mantido) |
| `rxjs` / `zone.js` / `typescript` | 7.5 / 0.11 / 4.7 | ~7.8 / ~0.15 / ~5.9 |

**Removidos:** `force`, `cli-update`, `cors`, `rxjs-compat`, `web-animations-js`, `protractor`, `@types/jasminewd2`, `codelyzer`, `webpack` (deps), `karma-coverage-istanbul-reporter`, `@ngui/map`, `jw-bootstrap-switch-ng2`, `ngx-chips`, `ng2-nouislider`

**Adicionados:** `angular-eslint` / `eslint` / `typescript-eslint`, `datatables.net`, stubs em `src/app/shared/{bswitch,tag-input,nouislider}/`

---

## 4. Gates

| Gate | Resultado |
| ---- | --------- |
| Família `@angular/*` alinhada 21.x | OK |
| Build production | OK |
| `ng test` ChromeHeadless | OK (3 SUCCESS) |
| ESLint (`ng lint`) | OK (0 errors; warnings legados documentados) |
| `ng serve` | OK — Compiled successfully; HTTP 200 `/` com `app-root` + bundles |
| Docker Node 20 | Dockerfile atualizado (`node:20`, `npm ci --legacy-peer-deps`, sem `--force`) |

---

## 5. Desvios do Conjunto v1

1. **Wrappers abandonados:** `jw-bootstrap-switch-ng2`, `ngx-chips`, `ng2-nouislider` substituídos por componentes Ivy locais (mesmo seletor/`NgModule` export name quando possível).
2. **`@ngui/map`:** migrado para `@angular/google-maps` + script Maps em `index.html`.
3. **CDK / google-maps:** patch `21.2.14` (não existe `21.2.19` nesses pacotes) — mesma major.
4. **Dual FullCalendar:** Angular 6.1.x + script jQuery `fullcalendar@3.10.1` mantido.
5. **Install:** `legacy-peer-deps` necessário por peers de libs legadas BS3.
6. **`serve`:** `browserTarget` → `buildTarget` (Angular 21 / custom-webpack).

---

## 6. Critérios de aceite

1. [x] Angular mantido; família `@angular/*` em **21.x** sem drift de major  
2. [x] Inventário do `package.json` tratado  
3. [x] NgRx 21 + translate 18 + FullCalendar 6  
4. [x] Build + test + serve OK  
5. [x] ESLint; sem Protractor/TSLint  
6. [x] Bootstrap 3 mantido  
7. [x] Engines/Docker OK  
8. [x] Sem `audit fix --force` cego  

---

## 7. Conclusão

Upgrade Angular **14 → 21.2.x** concluído com build/test/serve verdes. Wrappers mortos foram substituídos por stubs locais; maps usa `@angular/google-maps`. Bootstrap 3 + NgModules preservados.

---

## 8. Referências

- `DOCUMENTACAO/UI/2026-07-LevantamentoConjuntoHomologado-SmartDigitalPsicoUIDashboard.md`  
- `DOCUMENTACAO/UI/PlanoImplementacaoAtualizacaoAngular-SmartDigitalPsicoUIDashboard.md`  
- `package.json`  
- https://angular.dev/reference/versions  
