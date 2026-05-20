# WorkMatch 2.0

Sistema web completo para conexão entre clientes e profissionais de serviços, desenvolvido com arquitetura moderna baseada em microsserviços, autenticação centralizada e infraestrutura containerizada.

---

# Tecnologias Utilizadas

## Frontend

* React
* Vite
* JavaScript
* Material UI
* Axios

## Backend

* Java
* Spring Boot
* Spring Security
* JPA / Hibernate
* Maven

## Gateway

* Spring Cloud Gateway
* WebFlux

## Autenticação

* Keycloak
* JWT
* OAuth2

## Banco de Dados

* PostgreSQL

## Infraestrutura

* Docker
* Docker Compose
* Nginx

---

# Arquitetura do Projeto

```txt
WorkMatch_Web_2.0/
│
├── backend/        # API principal
├── frontend/       # Interface web React
├── gateway/        # API Gateway
│
├── infra/
│   ├── docker/     # Docker Compose
│   ├── nginx/      # Configuração nginx
│   ├── postgres/   # Scripts e configs do banco
│   └── keycloak/   # Configuração do Keycloak
│
├── docs/
│   ├── auditoria/
│   ├── banco/
│   └── relatorios/
│
├── .gitignore
├── README.md
└── LICENSE
```

---

# Funcionalidades

* Cadastro de usuários
* Login com autenticação JWT
* Integração com Keycloak
* API Gateway centralizado
* Validação de CPF, telefone e e-mail
* Integração frontend + backend
* Arquitetura modular
* Containers Docker
* Estrutura preparada para microsserviços

---

# Executando o Projeto

## Pré-requisitos

* Docker
* Docker Compose
* Node.js
* Java 21
* Maven

---

# Configuração das Variáveis de Ambiente

Crie os arquivos `.env` necessários com base nos exemplos:

```bash
cp infra/.env.example .env
```

---

# Subindo os Containers

Na pasta do projeto:

```bash
docker compose -f infra/docker/docker-compose.yml up --build
```

---

# Portas Utilizadas

| Serviço    | Porta |
| ---------- | ----- |
| Frontend   | 5174  |
| Backend    | 8081  |
| Gateway    | 8082  |
| Keycloak   | 9090  |
| PostgreSQL | 5432  |

---

# Segurança

Este projeto utiliza:

* JWT Authentication
* Keycloak Identity Provider
* Variáveis de ambiente protegidas
* Separação entre ambiente de desenvolvimento e produção

---

# Organização do Repositório

Arquivos compilados, dependências e variáveis sensíveis são ignorados pelo Git através do `.gitignore`.

Exemplos:

* `node_modules/`
* `target/`
* `.env`
* builds compiladas

---

# Objetivo do Projeto

O WorkMatch foi desenvolvido com foco em:

* Aprendizado de arquitetura moderna
* Microsserviços
* Segurança com OAuth2/JWT
* Integração entre frontend e backend
* Escalabilidade
* Boas práticas de desenvolvimento

---

# Autor

Desenvolvido por Wagner e colaboradores.

---

# Status do Projeto

Em desenvolvimento.
