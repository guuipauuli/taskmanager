# Task Manager

Monorepo com a base inicial de um sistema de gerenciamento de tarefas, contendo backend em Spring Boot, frontend em React e infraestrutura local com Docker Compose.

Foi adotada a abordagem de monorepo neste momento porque o projeto está sendo conduzido como uma POC/teste, com backend, frontend e infraestrutura evoluindo em conjunto e com necessidade de setup local simples em uma única base.

## Estrutura

```text
taskmanager/
├── backend/   # Spring Boot + Maven
├── frontend/  # React + Vite
├── infra/     # Docker Compose e variáveis de ambiente locais
└── .github/   # Workflows de CI
```

## Stack

- Backend: Java 21, Spring Boot, Maven
- Frontend: React, Vite
- Banco de dados: PostgreSQL 16
- Mensageria: Kafka + Zookeeper
- Orquestração local: Docker Compose

## Desenvolvimento com GitHub Copilot

Este projeto está sendo desenvolvido com apoio do GitHub Copilot durante a estruturação do monorepo, configuração de ambiente local, organização de infraestrutura e evolução do código.

## Pré-requisitos

- Docker
- Docker Compose

Observação: o ambiente atual foi preparado para rodar localmente via containers, sem depender de Java ou Node instalados na máquina host.

## Configuração local

O Docker Compose lê variáveis a partir de `infra/.env`.

Use o arquivo de exemplo como base:

```bash
cp infra/.env.example infra/.env
```

Valores configuráveis atualmente:

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `FRONTEND_PORT`
- `SERVER_PORT`
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `SPRING_KAFKA_BOOTSTRAP_SERVERS`

## Como subir o ambiente

Na raiz do projeto:

```bash
docker compose -f infra/docker-compose.yml up -d --build
```

## Endpoints locais

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- Healthcheck: `http://localhost:8080/actuator/health`

PostgreSQL, Kafka e Zookeeper ficam acessíveis apenas na rede interna do Docker Compose por padrão.

As portas expostas acima podem ser alteradas em `infra/.env`.

## Comandos úteis

Subir o ambiente:

```bash
docker compose -f infra/docker-compose.yml up -d --build
```

Ver status dos containers:

```bash
docker compose -f infra/docker-compose.yml ps
```

Ver logs:

```bash
docker compose -f infra/docker-compose.yml logs -f
```

Parar o ambiente:

```bash
docker compose -f infra/docker-compose.yml down
```

## CI

O repositório possui workflows separados para backend e frontend:

- `.github/workflows/backend-ci.yml`
- `.github/workflows/frontend-ci.yml`

## Estado atual

- Backend inicializado com endpoint e actuator básicos
- Frontend inicializado com React e build via Vite
- Infra local preparada com PostgreSQL, Kafka e Zookeeper
- Configuração centralizada por variáveis de ambiente em `infra/.env`