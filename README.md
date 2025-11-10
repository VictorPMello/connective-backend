# Connective - Backend

API REST para o sistema CRM Connective, construída com Node.js, Fastify e Prisma.

## 📋 Sobre o Projeto

Backend robusto e escalável que fornece toda a lógica de negócio e persistência de dados para o sistema Connective CRM. A API foi desenvolvida com foco em segurança, performance e boas práticas.

## ✨ Funcionalidades

- **Autenticação JWT** - Sistema seguro de autenticação com tokens
- **Gerenciamento de Contas** - CRUD completo de usuários
- **Gerenciamento de Clientes** - Cadastro e manipulação de dados de clientes
- **Gerenciamento de Projetos** - Controle de projetos e relacionamentos
- **Gerenciamento de Tarefas** - Sistema de tasks e organização
- **Rate Limiting** - Proteção contra ataques de força bruta
- **Validação de Dados** - Validação robusta com Zod
- **Testes de Segurança** - Suite completa de testes de segurança e carga

## 🚀 Tecnologias

### Core

- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript tipado
- **[Fastify](https://fastify.dev/)** - Framework web de alta performance
- **[Prisma](https://www.prisma.io/)** - ORM moderno para Node.js

### Banco de Dados

- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Redis](https://redis.io/)** - Cache e armazenamento em memória

### Segurança

- **[@fastify/jwt](https://github.com/fastify/fastify-jwt)** - Autenticação JWT
- **[@fastify/helmet](https://github.com/fastify/fastify-helmet)** - Headers de segurança
- **[@fastify/rate-limit](https://github.com/fastify/fastify-rate-limit)** - Limitação de requisições
- **[@fastify/cors](https://github.com/fastify/fastify-cors)** - Controle de CORS
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** - Hash de senhas

### Validação e Tipos

- **[Zod](https://zod.dev/)** - Validação de schemas TypeScript
- **[fastify-type-provider-zod](https://github.com/turkerdev/fastify-type-provider-zod)** - Integração Zod com Fastify

### Testes

- **[Vitest](https://vitest.dev/)** - Framework de testes unitários
- **[K6](https://k6.io/)** - Testes de carga e performance

## 📦 Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 20 ou superior)
- [PostgreSQL](https://www.postgresql.org/) (versão 16 ou superior)
- [Redis](https://redis.io/) (versão 7 ou superior)
- [Docker](https://www.docker.com/) (opcional, para ambiente containerizado)

## 🔧 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/VictorPMello/connective-backend.git
cd connective-backend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3333
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/crm_db?schema=public
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=sua_chave_secreta_aqui
```

**Para gerar o JWT_SECRET:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

4. Execute as migrations do banco de dados:

```bash
npm run db:migrate
```

5. (Opcional) Popule o banco com dados iniciais:

```bash
npm run db:seed
```

## 🐳 Docker

O projeto inclui configuração Docker com PostgreSQL e Redis:

```bash
# Subir os containers
docker-compose up -d

# Parar os containers
docker-compose down
```

### Serviços disponíveis

- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`

## 🎮 Executando o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

### Modo Produção

```bash
# Build
npm run build

# Start
npm start
```

A API estará disponível em `http://localhost:3333`

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Testes com interface visual
npm run test:ui

# Testes com cobertura
npm run test:coverage

# Testes de segurança
npm run test:security

# Testes de SQL Injection
npm run test:sql-injection

# Testes de autenticação
npm run test:auth

# Testes de força bruta
npm run test:brute-force

# Testes de carga (K6)
npm run test:load

# Executar todos os testes de segurança
npm run security:all
```

## 🏗️ Arquitetura e Princípios SOLID

Este projeto foi desenvolvido seguindo os princípios **SOLID** e boas práticas de arquitetura de software:

### Princípios Aplicados

- **S - Single Responsibility Principle**: Cada classe/módulo tem uma única responsabilidade bem definida (Controllers, Services, Repositories, DTOs)
- **O - Open/Closed Principle**: Código aberto para extensão, fechado para modificação através de abstrações
- **L - Liskov Substitution Principle**: Interfaces e abstrações que podem ser substituídas sem quebrar o sistema
- **I - Interface Segregation Principle**: Interfaces específicas e focadas em vez de interfaces genéricas
- **D - Dependency Inversion Principle**: Dependência de abstrações, não de implementações concretas

### Padrões de Design

- **Repository Pattern**: Camada de abstração para acesso a dados
- **Service Layer**: Lógica de negócio separada dos controllers
- **DTO (Data Transfer Objects)**: Validação e transformação de dados
- **Dependency Injection**: Injeção de dependências via construtores
- **Middleware Pattern**: Interceptação e processamento de requisições

### Organização Modular

Cada módulo segue a mesma estrutura consistente:

```
module/
├── controllers/    # Recebe requisições e retorna respostas
├── services/       # Lógica de negócio
├── repositories/   # Acesso a dados (Prisma)
├── dtos/           # Validação e tipagem (Zod)
├── routes.ts       # Definição de rotas
└── authRoutes.ts   # Rotas de autenticação (quando aplicável)
```

## 📁 Estrutura do Projeto

```
server/
├── prisma/
│   ├── migrations/        # Migrations do banco
│   ├── schema.prisma      # Schema do Prisma
│   └── seed.ts            # Dados iniciais
├── src/
│   ├── @types/            # Tipos TypeScript globais
│   ├── config/            # Configurações da aplicação
│   ├── helpers/           # Funções auxiliares
│   ├── middlewares/       # Middlewares (auth, error handler)
│   ├── modules/
│   │   ├── account/       # Módulo de contas
│   │   │   ├── controllers/
│   │   │   ├── dtos/
│   │   │   ├── repositories/
│   │   │   ├── services/
│   │   │   ├── authRoutes.ts
│   │   │   └── routes.ts
│   │   ├── clients/       # Módulo de clientes
│   │   ├── projects/      # Módulo de projetos
│   │   └── tasks/         # Módulo de tarefas
│   ├── app.ts             # Configuração do Fastify
│   └── server.ts          # Entrada da aplicação
├── tests/
│   ├── integration/       # Testes de integração
│   ├── load/              # Testes de carga (K6)
│   └── security/          # Testes de segurança
├── docker-compose.yml     # Configuração Docker
├── Dockerfile             # Imagem Docker
├── package.json
└── tsconfig.json
```

## 🗄️ Banco de Dados

### Comandos úteis do Prisma

```bash
# Abrir Prisma Studio (interface visual do banco)
npm run db:studio

# Criar uma nova migration
npm run db:migrate

# Resetar o banco de dados
npx prisma migrate reset
```

## 🔒 Segurança

O projeto implementa diversas camadas de segurança:

- **Rate Limiting**: Máximo de 200 requisições por minuto por IP
- **Helmet**: Headers de segurança HTTP
- **CORS**: Controle de origens permitidas
- **JWT**: Tokens com expiração de 7 dias
- **Bcrypt**: Hash seguro de senhas
- **Validação**: Schemas Zod em todas as rotas
- **SQL Injection**: Proteção via Prisma ORM

## 🔗 Endpoints da API

### Health Check

```
GET /health - Verifica o status da API
```

### Autenticação

```
POST /auth/register - Registrar novo usuário
POST /auth/login    - Login de usuário
POST /auth/logout   - Logout de usuário
GET  /auth/me       - Dados do usuário autenticado (requer autenticação)
```

### Contas (Account)

```
GET    /account/:id              - Buscar conta por ID (requer autenticação)
PUT    /account/:id              - Atualizar dados da conta (requer autenticação)
PATCH  /account/:id/last-login   - Atualizar último login (requer autenticação)
PATCH  /account/:id/password     - Atualizar senha (requer autenticação)
DELETE /account/:id              - Deletar conta (requer autenticação)
```

### Clientes

```
POST   /client                   - Criar novo cliente (requer autenticação)
GET    /client/:id               - Buscar cliente por ID (requer autenticação)
GET    /clients/:accountId       - Listar clientes por conta (requer autenticação)
PUT    /client/:id               - Atualizar cliente (requer autenticação)
DELETE /client/:id               - Deletar cliente (requer autenticação)
```

### Projetos

```
POST   /project                  - Criar novo projeto (requer autenticação)
GET    /project/:id              - Buscar projeto por ID (requer autenticação)
GET    /projects/:accountId      - Listar projetos por conta (requer autenticação)
PUT    /project/:id              - Atualizar projeto (requer autenticação)
DELETE /project/:id              - Deletar projeto (requer autenticação)
DELETE /projects                 - Deletar todos os projetos (requer autenticação)
```

### Tarefas (Tasks)

```
POST   /task                     - Criar nova tarefa (requer autenticação)
GET    /task/:id                 - Buscar tarefa por ID (requer autenticação)
GET    /project/tasks/:projectId - Listar tarefas por projeto (requer autenticação)
PUT    /task/:id                 - Atualizar tarefa (requer autenticação)
DELETE /task/:id                 - Deletar tarefa (requer autenticação)
```

## 📝 Licença

Este projeto está sob a licença ISC.

## 👤 Autor

Victor Pinheiro Mello

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!

