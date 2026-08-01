# SmartDigitalPsico — UI Dashboard

<p align="center">
  <img src="https://sonarcloud.io/api/project_badges/measure?project=lionscorp_smartdigitalpsico&metric=coverage"/>
  <img src="http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=RED&style=for-the-badge"/>
</p>

<p align="center"><strong>Atendimento inteligente digital de pacientes de psicologia</strong> — frontend Angular (dashboard).</p>

<p align="center">🚧 Em desenvolvimento 🚧</p>

---

## Índice

- [Sobre](#sobre)
- [Links de publicação](#links-de-publicação)
- [Build e deploy](#build-e-deploy)
- [Pré-requisitos](#pré-requisitos)
- [Tecnologias](#tecnologias)
- [Como executar](#como-executar)
- [Ambientes / API](#ambientes--api)
- [Documentação interna](#documentação-interna)
- [Template base](#template-base)
- [Contribuindo](#contribuindo)
- [Autor](#autor)
- [Licença](#licença)

---

## Sobre

SPA Angular do **SmartDigitalPsico**: cadastros administrativos e perfil médico (pacientes, prontuário, agenda, etc.), consumindo a API REST.

Backend: [`SmartDigitalPsicoAPI`](https://github.com/LeoneRocha/SmartDigitalPsicoAPI)  
Documentação geral da solução: [README da API](https://github.com/LeoneRocha/SmartDigitalPsicoAPI/blob/main/README.md)

---

## Links de publicação

### Produção

| Serviço | URL |
| ------- | --- |
| Frontend (login) | https://smartdigitalpsicoui.azurewebsites.net/authpages/login |
| Backend (API / Swagger) | https://smartdigitalpsicoapi.azurewebsites.net/ |

> Ambiente de **homologação/staging não está mais disponível** (API e UI).

---

## Build e deploy

| Ambiente | Status pacote | Publicação |
| -------- | ------------- | ---------- |
| Produção | [![Build status](https://lionscorp.visualstudio.com/SMARTDIGITALPSICO/_apis/build/status/Production/CI-Production-SMARTDIGITALPSICO-UI)](https://lionscorp.visualstudio.com/SMARTDIGITALPSICO/_build/latest?definitionId=30) | [![Release](https://lionscorp.vsrm.visualstudio.com/_apis/public/Release/badge/4f28fc9c-3bc3-4ea2-8eac-62870312ef10/12/12)](https://lionscorp.visualstudio.com/SMARTDIGITALPSICO/_release) |

Azure DevOps: https://lionscorp.visualstudio.com/SMARTDIGITALPSICO

---

## Pré-requisitos

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/) — ver `engines` em `package.json` (hoje pinado em Node `18.14.2` / npm `9.6.3`; alinhar ao ambiente local/CI)
- npm
- API local ou de produção acessível (CORS/JWT)

---

## Tecnologias

- Angular **14**
- TypeScript
- NgRx (store / effects)
- ngx-translate
- Bootstrap **3** + jQuery (template Light Bootstrap Dashboard Pro)
- JWT (`@auth0/angular-jwt`)
- Karma / Jasmine (testes)

---

## Como executar

```bash
git clone https://github.com/LeoneRocha/SmartDigitalPsicoUIDashboard.git
cd SmartDigitalPsicoUIDashboard

npm install
npm start
# equivalente: ng serve
```

Ajuste a URL da API em:

- `src/environments/environment.ts` (dev)
- `src/environments/environment.production.ts` (produção → `https://smartdigitalpsicoapi.azurewebsites.net/api`)

Build de produção:

```bash
npm run build -- --configuration=production
```

Testes:

```bash
npm test
```

---

## Ambientes / API

| Ambiente | Frontend | API |
| -------- | -------- | --- |
| Produção | https://smartdigitalpsicoui.azurewebsites.net/authpages/login | https://smartdigitalpsicoapi.azurewebsites.net/ |
| Homologação / staging | **Descontinuado** | **Descontinuado** |
| Local | `ng serve` (porta padrão do Angular CLI) | API local (ex.: `https://localhost:53892`) |

O arquivo `environment.homologation.ts` pode ainda existir no código apontando para staging antigo — **não usar** para publicação; o ambiente publicado é apenas produção.

---

## Documentação interna

- `DOCUMENTACAO/UI/` — levantamento, plano e relatório de atualização Angular/pacotes
- Anotações NgRx: `src/app/storereduxngrx/readme.txt` (notas internas)

---

## Template base

Este projeto deriva do tema **Light Bootstrap Dashboard Pro Angular** (Creative Tim).  
O README original do template está em [`READMEmdORIGINAL`](./READMEmdORIGINAL) (referência histórica; não descreve a publicação SmartDigitalPsico).

---

## Contribuindo

1. Fork  
2. Branch: `git checkout -b minha-feature`  
3. Commit / push  
4. Pull Request  

---

## Autor

**Leone Costa Rocha**

[![LinkedIn](https://img.shields.io/badge/-Leone-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/leone-costa-rocha-14049722)
[![Gmail](https://img.shields.io/badge/-leonecrocha@gmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white)](mailto:leonecrocha@gmail.com)

---

## Licença

Consulte o arquivo de licença do repositório / termos do template Creative Tim conforme aplicável ao tema base.
