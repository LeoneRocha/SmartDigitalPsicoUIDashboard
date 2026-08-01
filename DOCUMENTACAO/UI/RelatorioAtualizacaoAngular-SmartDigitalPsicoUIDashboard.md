# Relatório de Atualização — SmartDigitalPsicoUIDashboard (Angular)

**Status:** PENDENTE (não executado)  
**Projeto:** `SmartDigitalPsicoUIDashboard/`  
**Branch:** `chore/update-packages-smartdigitalpsicouidashboard-angular21`  
**Data da execução:** _a preencher_  
**Conjunto (inventário completo `package.json`):** `2026-07-LevantamentoConjuntoHomologado-SmartDigitalPsicoUIDashboard.md`  
**Plano:** `PlanoImplementacaoAtualizacaoAngular-SmartDigitalPsicoUIDashboard.md`

---

## 1. Resumo executivo

```text
Framework: Angular (mantido)
Partida: Angular 14 (^14.2.0) — 12 pacotes @angular/* + tooling 14
Destino: Angular ~21.2.x — mesma versão em toda a família
NgRx: 14 → 21
ngx-translate: 14/7 → 18/18
FullCalendar Angular: 5 → 6.1.x (script fullcalendar@3 mantido no v1)
TypeScript: ~4.7 → ~5.9
Node engines: 18.14.2 → ^20.19 || ^22.12 || ^24
Bootstrap: 3.4.x mantido
Remoções previstas: force, cli-update, cors?, protractor, codelyzer, rxjs-compat, web-animations-js
Status execução: PENDENTE
```

---

## 2. Família `@angular/*` (preencher na execução)

| Pacote | Antes | Depois |
| ------ | ----- | ------ |
| `@angular/animations` | ^14.2.0 | _pendente_ ~21.2.x |
| `@angular/cdk` | ^14.2.0 | _pendente_ |
| `@angular/common` | ^14.2.0 | _pendente_ |
| `@angular/compiler` | ^14.2.0 | _pendente_ |
| `@angular/core` | ^14.2.0 | _pendente_ |
| `@angular/elements` | ^14.2.0 | _pendente_ |
| `@angular/forms` | ^14.2.0 | _pendente_ |
| `@angular/google-maps` | ^14.2.0 | _pendente_ |
| `@angular/localize` | ^14.2.0 | _pendente_ |
| `@angular/platform-browser` | ^14.2.0 | _pendente_ |
| `@angular/platform-browser-dynamic` | ^14.2.0 | _pendente_ |
| `@angular/router` | ^14.2.0 | _pendente_ |
| `@angular/cli` | ~14.2.7 | _pendente_ |
| `@angular/compiler-cli` | ^14.2.0 | _pendente_ |
| `@angular/language-service` | 14.2.0 | _pendente_ |
| `@angular-devkit/build-angular` | ^14.2.7 | _pendente_ |
| `@angular-builders/custom-webpack` | ^14.1.0 | _pendente_ |

- [ ] `npm ls` confirma **zero drift** de major entre os pacotes acima  

---

## 3. Satélites e demais deps (preencher)

| Pacote | Antes | Depois / ação |
| ------ | ----- | ------------- |
| `@ngrx/store` / effects / store-devtools | ^14.0.1 | _pendente_ 21.x |
| `@ngx-translate/core` | ^14.0.0 | _pendente_ 18.x |
| `@ngx-translate/http-loader` | ^7.0.0 | _pendente_ 18.x |
| `ngx-translate-messageformat-compiler` | ^6.2.0 | _pendente_ |
| `@messageformat/core` | ^3.1.0 | _pendente_ |
| `@auth0/angular-jwt` | ^5.1.2 | _pendente_ |
| `@kolkov/angular-editor` | 3.0.0-beta.2 | _pendente_ estável |
| `@fullcalendar/angular` (+ daygrid/timegrid/interaction) | ^5.11.3 | _pendente_ 6.1.x |
| `fullcalendar` | 3.10.1 | _pendente_ (manter v1 / nota) |
| `@ngui/map` | 0.30.3 | _pendente_ |
| `angular-ng-autocomplete` | ^2.0.12 | _pendente_ |
| `ngx-chips` | 2.2.2 | _pendente_ |
| `ng2-nouislider` / `nouislider` | 1.8.2 / 14.6.3 | _pendente_ |
| `jw-bootstrap-switch-ng2` | 2.0.5 | _pendente_ |
| `bootstrap` | ^3.4.1 | 3.4.x |
| `jquery` | 3.5.1 | _pendente_ |
| `sweetalert2` | 10.12.5 | _pendente_ |
| `rxjs` / `zone.js` / `typescript` | 7.5 / 0.11 / 4.7 | _pendente_ |
| Plugins BS3/jQuery restantes | ver levantamento §4.5 | _manter/patch_ |

**Removidos:**

| Pacote | Removido? |
| ------ | --------- |
| `force` | _pendente_ |
| `cli-update` | _pendente_ |
| `cors` | _pendente_ |
| `rxjs-compat` | _pendente_ |
| `web-animations-js` | _pendente_ |
| `protractor` / `@types/jasminewd2` / `codelyzer` | _pendente_ |
| `webpack` (de dependencies) | _pendente_ |

**Adicionados:**

| Pacote | Versão |
| ------ | ------ |
| `@angular-eslint/*` / eslint | _pendente_ |

---

## 4. Gates

| Gate | Resultado |
| ---- | --------- |
| Família `@angular/*` alinhada 21.2.x | _pendente_ |
| `npm ci` sem `--force` | _pendente_ |
| Build production | _pendente_ |
| `ng test` | _pendente_ |
| ESLint | _pendente_ |
| `npm audit --omit=dev` | _pendente_ |
| Smoke (JWT, i18n, NgRx, calendar, editor, maps, forms UI, DataTables) | _pendente_ |
| Docker Node 20/22 | _pendente_ |

---

## 5. Desvios do Conjunto v1

_Listar pins forçados (ex.: wrapper sem peer Angular 21), dual FullCalendar, types bootstrap, etc._

---

## 6. Critérios de aceite

1. [ ] Angular mantido; família `@angular/*` em **21.2.x** sem drift  
2. [ ] Inventário do `package.json` tratado (atualizar/manter/remover)  
3. [ ] NgRx 21 + translate 18 + FullCalendar 6 (ou desvio justificado)  
4. [ ] Build + smoke OK  
5. [ ] ESLint; sem Protractor/TSLint  
6. [ ] Bootstrap 3 mantido  
7. [ ] Engines/Docker OK; lockfile commitado  
8. [ ] Sem `audit fix --force` cego  

---

## 7. Conclusão

_Preencher após execução._ Enquanto **PENDENTE**, só a documentação/especificação está pronta.

---

## 8. Referências

- `DOCUMENTACAO/UI/2026-07-LevantamentoConjuntoHomologado-SmartDigitalPsicoUIDashboard.md`  
- `DOCUMENTACAO/UI/PlanoImplementacaoAtualizacaoAngular-SmartDigitalPsicoUIDashboard.md`  
- `package.json` (fonte do inventário)  
- https://angular.dev/reference/versions  
