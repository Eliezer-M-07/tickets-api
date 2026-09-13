🇧🇷 Português | [🇺🇸 English](README.en.md)

---

<img width="1672" height="689" alt="Image" src="https://github.com/user-attachments/assets/a3faf7ad-352d-466e-b08f-d6c37a027fb4" />

# Tickets API

![Node.js](https://img.shields.io/badge/Node.js-24-000000?style=flat-square\&logo=node.js\&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square\&logo=express\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-000000?style=flat-square\&logo=postgresql\&logoColor=white)
![REST API](https://img.shields.io/badge/REST-API-000000?style=flat-square)
![ESM](https://img.shields.io/badge/ESM-Modules-000000?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-000000?style=flat-square)

API REST desenvolvida em **Node.js**, **Express** e **PostgreSQL** para gerenciamento de tickets, utilizando uma arquitetura em camadas com separação entre **Controllers, Services e Repositories**.

O projeto foi desenvolvido com foco em organização de código, validação de dados, boas práticas de API REST e comunicação segura com o banco de dados através de queries parametrizadas.

---

## Sobre o projeto

A **Tickets API** permite criar, consultar, atualizar e excluir tickets de atendimento.

Cada ticket possui informações como título, descrição, status, prioridade e responsável.

O projeto utiliza uma arquitetura em camadas para separar as responsabilidades da aplicação:

```text
HTTP Request
     ↓
 Controller
     ↓
  Service
     ↓
Repository
     ↓
PostgreSQL
```

Essa separação evita concentrar regras de negócio, comunicação com o banco de dados e tratamento HTTP no mesmo lugar, tornando a aplicação mais organizada e fácil de manter.

---

## Tecnologias utilizadas

| Tecnologia       | Papel no projeto                                  |
| ---------------- | ------------------------------------------------- |
| Node.js          | Runtime da aplicação                              |
| Express          | Framework HTTP e gerenciamento das rotas          |
| PostgreSQL       | Banco de dados relacional                         |
| pg               | Driver para comunicação com PostgreSQL            |
| dotenv           | Gerenciamento das variáveis de ambiente           |
| JavaScript (ESM) | Linguagem e sistema de módulos                    |
| REST API         | Arquitetura utilizada para exposição dos recursos |

---

## Funcionalidades

* Criar tickets
* Listar todos os tickets
* Buscar ticket por ID
* Atualizar completamente um ticket
* Atualizar parcialmente um ticket
* Excluir tickets
* Validação de campos obrigatórios
* Validação de tipos
* Validação de status
* Validação de prioridade
* Validação de ID
* Tratamento de tickets inexistentes
* Queries parametrizadas no PostgreSQL
* Validação de campos permitidos no PATCH
* Constraints de integridade no PostgreSQL
* Separação entre Controller, Service e Repository

---

## Arquitetura

A aplicação utiliza uma arquitetura em camadas:

### Controller

Responsável pela comunicação HTTP.

O Controller recebe a requisição, extrai os dados de `req.params` e `req.body`, chama o Service e retorna a resposta HTTP.

```text
Controller
├── recebe req
├── chama Service
└── retorna res
```

### Service

Responsável pelas regras de negócio e validações.

Exemplos:

* validar ID;
* verificar campos obrigatórios;
* validar tipos;
* validar status;
* validar prioridade;
* verificar se o ticket existe;
* determinar quais campos podem ser alterados em um PATCH.

```text
Service
├── valida dados
├── aplica regras de negócio
└── chama Repository
```

### Repository

Responsável pela comunicação com o PostgreSQL.

É nessa camada que ficam as queries SQL:

```text
Repository
├── SELECT
├── INSERT
├── UPDATE
└── DELETE
```

Essa divisão segue um padrão bastante utilizado em aplicações backend e ajuda a manter cada camada com uma responsabilidade bem definida.

---

## Estrutura da aplicação

```text
database/
└── migrations/
    └── 001_create_tickets.sql

src/
├── config/
│   └── database.js
│
├── controllers/
│   └── ticket.controller.js
│
├── repositories/
│   └── ticket.repository.js
│
├── routes/
│   └── ticket.routes.js
│
├── services/
│   └── ticket.service.js
│
└── app.js

.env
.env.example
.gitignore
package.json
README.md
```

---

## Fluxo de uma requisição

Exemplo de criação de um ticket:

```text
POST /tickets
      ↓
ticket.controller.js
      ↓
ticket.service.js
      ↓
ticket.repository.js
      ↓
PostgreSQL
      ↓
Repository retorna o ticket
      ↓
Service retorna o resultado
      ↓
Controller envia JSON
```

A ideia é evitar que uma camada assuma responsabilidades que pertencem a outra.

Por exemplo, o Controller não executa SQL diretamente e o Repository não decide se um ticket pode ou não ser criado.

---

## Database

O projeto utiliza **PostgreSQL** como banco de dados relacional.

A estrutura do banco é definida através de uma migration SQL localizada em:

```text
database/
└── migrations/
    └── 001_create_tickets.sql
```

A migration é responsável por criar:

* `SEQ_TICKET` sequence para geração dos IDs;
* tabela de tickets;
* chave primária;
* constraint para validação dos status;
* constraint para validação das prioridades;
* timestamp automático de criação.

### Database schema

```text
TB_TICKETS
├── ID_TICKET        INTEGER       PRIMARY KEY
├── NM_TITLE         VARCHAR(100)  NOT NULL
├── DS_TICKET        VARCHAR(255)  NOT NULL
├── ST_TICKET        VARCHAR(15)   NOT NULL
├── ST_PRIORITY      VARCHAR(8)    NOT NULL
├── NM_RESPONSIBLE   VARCHAR(100)  NOT NULL
└── CREATE_AT        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
```

### Status disponíveis

```text
ABERTO
EM_ANDAMENTO
FINALIZADO
```

### Prioridades disponíveis

```text
BAIXA
MEDIA
ALTA
```

Além da validação realizada na aplicação, os valores de `status` e `priority` também possuem restrições no banco através de `CHECK CONSTRAINTS`.

Isso adiciona uma segunda camada de proteção para a integridade dos dados.

---

## Migrations

A migration `001_create_tickets.sql` contém a estrutura inicial do banco:

```sql
CREATE SEQUENCE SEQ_TICKET START WITH 1 INCREMENT BY 1;

CREATE TABLE TB_TICKETS(
    ID_TICKET INTEGER DEFAULT NEXTVAL('SEQ_TICKET'),
    NM_TITLE VARCHAR(100) NOT NULL,
    DS_TICKET VARCHAR(255) NOT NULL,
    ST_TICKET VARCHAR(15) NOT NULL,
    ST_PRIORITY VARCHAR(8) NOT NULL,
    NM_RESPONSIBLE VARCHAR(100) NOT NULL,
    CREATE_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE TB_TICKETS
ADD CONSTRAINT PK_TICKET PRIMARY KEY(ID_TICKET);

ALTER TABLE TB_TICKETS
ADD CONSTRAINT CK_ST_TICKET
CHECK(ST_TICKET IN ('ABERTO', 'EM_ANDAMENTO', 'FINALIZADO'));

ALTER TABLE TB_TICKETS
ADD CONSTRAINT CK_ST_PRIORITY
CHECK(ST_PRIORITY IN ('BAIXA', 'MEDIA', 'ALTA'));
```

A migration deve ser executada no PostgreSQL antes de iniciar a utilização da API.

---

## Modelo do Ticket

Um ticket possui os seguintes campos:

| Campo            | Tipo      | Descrição                    |
| ---------------- | --------- | ---------------------------- |
| `ID_TICKET`      | Integer   | Identificador do ticket      |
| `NM_TITLE`       | String    | Título do ticket             |
| `DS_TICKET`      | String    | Descrição do problema        |
| `ST_TICKET`      | String    | Status atual do ticket       |
| `ST_PRIORITY`    | String    | Prioridade do ticket         |
| `NM_RESPONSIBLE` | String    | Responsável pelo atendimento |
| `CREATE_AT`      | Timestamp | Data e hora de criação       |

---

## Endpoints

| Método | Rota           | Descrição                        |
| :----: | -------------- | -------------------------------- |
|   GET  | `/tickets`     | Lista todos os tickets           |
|   GET  | `/tickets/:id` | Busca um ticket pelo ID          |
|  POST  | `/tickets`     | Cria um novo ticket              |
|   PUT  | `/tickets/:id` | Atualiza completamente um ticket |
|  PATCH | `/tickets/:id` | Atualiza parcialmente um ticket  |
| DELETE | `/tickets/:id` | Exclui um ticket                 |

---

## Exemplos

### Criar ticket

```http
POST /tickets
```

Body:

```json
{
  "title": "Computador não liga",
  "description": "O computador não apresenta nenhum sinal ao pressionar o botão de energia.",
  "status": "ABERTO",
  "priority": "ALTA",
  "responsible": "João"
}
```

Resposta:

```json
{
  "message": "Ticket criado com sucesso.",
  "ticket": {
    "id_ticket": 1,
    "nm_title": "Computador não liga",
    "ds_ticket": "O computador não apresenta nenhum sinal ao pressionar o botão de energia.",
    "st_ticket": "ABERTO",
    "st_priority": "ALTA",
    "nm_responsible": "João"
  }
}
```

---

### Listar tickets

```http
GET /tickets
```

Retorna todos os tickets cadastrados.

---

### Buscar ticket

```http
GET /tickets/1
```

Retorna o ticket correspondente ao ID informado.

Caso o ID seja inválido ou o ticket não exista, a API retorna um erro.

---

### Atualizar ticket — PUT

```http
PUT /tickets/1
```

O PUT representa uma atualização completa do recurso.

Todos os campos devem ser enviados:

```json
{
  "title": "Computador não liga",
  "description": "Problema identificado na fonte de alimentação.",
  "status": "EM_ANDAMENTO",
  "priority": "ALTA",
  "responsible": "Maria"
}
```

---

### Atualizar ticket — PATCH

```http
PATCH /tickets/1
```

O PATCH permite alterar apenas os campos necessários.

Por exemplo:

```json
{
  "priority": "MEDIA"
}
```

Ou:

```json
{
  "status": "FINALIZADO",
  "responsible": "Maria"
}
```

Os campos não enviados permanecem com seus valores atuais.

---

### Excluir ticket

```http
DELETE /tickets/1
```

Remove o ticket informado.

---

## Validação

As validações são realizadas principalmente na camada de **Service**.

### POST

Todos os campos são obrigatórios:

```text
title
description
status
priority
responsible
```

Também são verificados:

* existência dos campos;
* tipo dos dados;
* campos vazios;
* status permitido;
* prioridade permitida.

### PUT

O PUT utiliza as mesmas regras de uma atualização completa.

Todos os campos devem ser enviados e passar pelas validações.

### PATCH

No PATCH, somente os campos enviados são validados.

Além disso, existe uma lista de campos permitidos:

```js
const allowedFields = [
    'title',
    'description',
    'status',
    'priority',
    'responsible'
];
```

Isso impede que campos não previstos pela API sejam alterados.

---

## Segurança das queries

As queries utilizam **parâmetros do PostgreSQL** em vez de interpolação direta dos valores:

```js
await pool.query(
    'SELECT * FROM TB_TICKETS WHERE ID_TICKET = $1',
    [id]
);
```

Os valores enviados pelo usuário são tratados como parâmetros pelo PostgreSQL.

Para atualizações dinâmicas com PATCH, os nomes das colunas são controlados através de um mapa de campos permitidos:

```js
const fieldMap = {
    title: 'NM_TITLE',
    description: 'DS_TICKET',
    status: 'ST_TICKET',
    priority: 'ST_PRIORITY',
    responsible: 'NM_RESPONSIBLE'
};
```

Dessa forma, os valores continuam sendo enviados como parâmetros e os nomes das colunas são controlados pela aplicação.

---

## Códigos HTTP utilizados

| Código | Significado           | Exemplo                           |
| :----: | --------------------- | --------------------------------- |
|  `200` | OK                    | Consulta ou atualização realizada |
|  `201` | Created               | Ticket criado                     |
|  `204` | No Content            | Operação sem conteúdo de retorno  |
|  `400` | Bad Request           | Dados inválidos                   |
|  `404` | Not Found             | Ticket não encontrado             |
|  `500` | Internal Server Error | Erro inesperado no servidor       |

---

## Environment Variables

O projeto utiliza variáveis de ambiente para armazenar as configurações da aplicação e do banco de dados.

Um arquivo `.env.example` é disponibilizado como modelo:

```env
PORT=3000

DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
```

Crie um arquivo `.env` na raiz do projeto com suas configurações locais.

> O arquivo `.env` não deve ser versionado no Git.

---

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/SEU-USUARIO/tickets-api.git
cd tickets-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Crie o banco de dados

Crie um banco PostgreSQL para o projeto.

Depois, configure as credenciais no arquivo `.env`.

### 4. Execute a migration

Execute o arquivo:

```text
database/migrations/001_create_tickets.sql
```

no banco PostgreSQL.

A migration criará a tabela e as constraints necessárias para a aplicação.

### 5. Inicie a aplicação

```bash
node src/app.js
```

A API estará disponível em:

```text
http://localhost:3000
```

---

## Testando a API

A API pode ser testada utilizando ferramentas como:

* Postman
* Insomnia
* Thunder Client
* REST Client
* `curl`

Exemplo:

```bash
curl http://localhost:3000/tickets
```

Para testar operações de criação e atualização, envie os dados através do body da requisição.

---

## Boas práticas utilizadas

* Separação de responsabilidades por camadas
* Controllers focados em HTTP
* Services responsáveis pelas regras de negócio
* Repositories responsáveis pelo acesso ao banco
* Queries parametrizadas
* Whitelist de campos para atualização dinâmica
* Validação de dados antes da persistência
* Constraints para integridade dos dados no PostgreSQL
* Uso de variáveis de ambiente
* Sistema de módulos ESM
* Uso adequado dos métodos HTTP
* Diferenciação entre PUT e PATCH

---

## Melhorias futuras

Algumas evoluções que podem ser adicionadas ao projeto:

* [ ] Validação com Zod
* [ ] Utilizar ORM Prisma
* [ ] Middleware global de tratamento de erros
* [ ] Padronização de respostas de erro
* [ ] Testes automatizados
* [ ] Documentação com Swagger/OpenAPI
* [ ] Paginação da listagem de tickets
* [ ] Filtros por status e prioridade
* [ ] Autenticação e autorização
* [ ] Logs estruturados
* [ ] Variáveis de ambiente separadas por ambiente

---

## Objetivo

Este projeto foi desenvolvido como uma aplicação prática para estudo e demonstração de conceitos de **desenvolvimento backend com Node.js**, incluindo:

* construção de APIs REST;
* arquitetura em camadas;
* regras de negócio;
* validação de dados;
* operações CRUD;
* integração com PostgreSQL;
* escrita de queries SQL;
* uso de queries parametrizadas;
* utilização de PUT e PATCH;
* organização de projetos backend.

---

## Licença

Este projeto está sob a licença MIT.