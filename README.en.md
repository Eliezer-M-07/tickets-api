🇺🇸 English | 🇧🇷 [Português](README.md)

---

<img width="1672" height="689" alt="Image" src="https://github.com/user-attachments/assets/a3faf7ad-352d-466e-b08f-d6c37a027fb4" />

# Tickets API

![Node.js](https://img.shields.io/badge/Node.js-24-000000?style=flat-square\&logo=node.js\&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square\&logo=express\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-000000?style=flat-square\&logo=postgresql\&logoColor=white)
![REST API](https://img.shields.io/badge/REST-API-000000?style=flat-square)
![ESM](https://img.shields.io/badge/ESM-Modules-000000?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-000000?style=flat-square)

REST API built with **Node.js**, **Express**, and **PostgreSQL** for ticket management, using a layered architecture with separation between **Controllers, Services, and Repositories**.

The project was developed with a focus on code organization, data validation, REST API best practices, and secure database communication through parameterized queries.

---

## About the project

The **Tickets API** allows users to create, retrieve, update, and delete support tickets.

Each ticket contains information such as title, description, status, priority, and assigned person.

The project uses a layered architecture to separate application responsibilities:

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

This separation prevents business rules, database communication, and HTTP handling from being concentrated in the same layer, making the application more organized and maintainable.

---

## Technologies

| Technology       | Role                                              |
| ---------------- | ------------------------------------------------- |
| Node.js          | Application runtime                               |
| Express          | HTTP framework and route management               |
| PostgreSQL       | Relational database                               |
| pg               | PostgreSQL client for Node.js                     |
| dotenv           | Environment variable management                   |
| JavaScript (ESM) | Programming language and module system            |
| REST API         | Architecture used to expose application resources |

---

## Features

* Create tickets
* List all tickets
* Retrieve a ticket by ID
* Fully update a ticket
* Partially update a ticket
* Delete tickets
* Required field validation
* Data type validation
* Status validation
* Priority validation
* ID validation
* Handling of non-existent tickets
* Parameterized PostgreSQL queries
* PATCH allowed-field validation
* PostgreSQL data integrity constraints
* Separation between Controller, Service, and Repository layers

---

## Architecture

The application follows a layered architecture:

### Controller

Responsible for HTTP communication.

The Controller receives the request, extracts data from `req.params` and `req.body`, calls the Service, and returns the HTTP response.

```text
Controller
├── receives req
├── calls Service
└── returns res
```

### Service

Responsible for business rules and validation.

Examples:

* validate IDs;
* check required fields;
* validate data types;
* validate status;
* validate priority;
* check whether the ticket exists;
* determine which fields can be modified through PATCH.

```text
Service
├── validates data
├── applies business rules
└── calls Repository
```

### Repository

Responsible for communication with PostgreSQL.

SQL queries are kept in this layer:

```text
Repository
├── SELECT
├── INSERT
├── UPDATE
└── DELETE
```

This separation follows a commonly used pattern in backend applications and helps keep each layer focused on a specific responsibility.

---

## Project structure

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

## Request flow

Example of creating a ticket:

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
Repository returns the ticket
      ↓
Service returns the result
      ↓
Controller sends JSON
```

The goal is to prevent one layer from taking responsibilities that belong to another.

For example, the Controller does not execute SQL directly, and the Repository does not decide whether a ticket is allowed to be created.

---

## Database

The project uses **PostgreSQL** as its relational database.

The database structure is defined through an SQL migration located at:

```text
database/
└── migrations/
    └── 001_create_tickets.sql
```

The migration is responsible for creating:

* `SEQ_TICKET` sequence for ID generation;
* tickets table;
* primary key;
* status validation constraint;
* priority validation constraint;
* automatic creation timestamp.

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

### Available statuses

```text
ABERTO
EM_ANDAMENTO
FINALIZADO
```

### Available priorities

```text
BAIXA
MEDIA
ALTA
```

In addition to application-level validation, `status` and `priority` values are also restricted at the database level through `CHECK CONSTRAINTS`.

This provides an additional layer of data integrity.

---

## Migrations

The `001_create_tickets.sql` migration contains the initial database structure:

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

The migration must be executed in PostgreSQL before using the API.

---

## Ticket model

A ticket contains the following fields:

| Field            | Type      | Description                       |
| ---------------- | --------- | --------------------------------- |
| `ID_TICKET`      | Integer   | Ticket identifier                 |
| `NM_TITLE`       | String    | Ticket title                      |
| `DS_TICKET`      | String    | Problem description               |
| `ST_TICKET`      | String    | Current ticket status             |
| `ST_PRIORITY`    | String    | Ticket priority                   |
| `NM_RESPONSIBLE` | String    | Person responsible for the ticket |
| `CREATE_AT`      | Timestamp | Ticket creation date and time     |

---

## Endpoints

| Method | Route          | Description               |
| :----: | -------------- | ------------------------- |
|   GET  | `/tickets`     | List all tickets          |
|   GET  | `/tickets/:id` | Retrieve a ticket by ID   |
|  POST  | `/tickets`     | Create a new ticket       |
|   PUT  | `/tickets/:id` | Fully update a ticket     |
|  PATCH | `/tickets/:id` | Partially update a ticket |
| DELETE | `/tickets/:id` | Delete a ticket           |

---

## Examples

### Create a ticket

```http
POST /tickets
```

Body:

```json
{
  "title": "Computer does not turn on",
  "description": "The computer shows no signs of power when the power button is pressed.",
  "status": "ABERTO",
  "priority": "ALTA",
  "responsible": "João"
}
```

Response:

```json
{
  "message": "Ticket created successfully.",
  "ticket": {
    "id_ticket": 1,
    "nm_title": "Computer does not turn on",
    "ds_ticket": "The computer shows no signs of power when the power button is pressed.",
    "st_ticket": "ABERTO",
    "st_priority": "ALTA",
    "nm_responsible": "João"
  }
}
```

---

### List tickets

```http
GET /tickets
```

Returns all registered tickets.

---

### Retrieve a ticket

```http
GET /tickets/1
```

Returns the ticket corresponding to the provided ID.

If the ID is invalid or the ticket does not exist, the API returns an error.

---

### Update a ticket — PUT

```http
PUT /tickets/1
```

PUT represents a full update of the resource.

All fields must be provided:

```json
{
  "title": "Computer does not turn on",
  "description": "A power supply issue was identified.",
  "status": "EM_ANDAMENTO",
  "priority": "ALTA",
  "responsible": "Maria"
}
```

---

### Update a ticket — PATCH

```http
PATCH /tickets/1
```

PATCH allows only the required fields to be updated.

For example:

```json
{
  "priority": "MEDIA"
}
```

Or:

```json
{
  "status": "FINALIZADO",
  "responsible": "Maria"
}
```

Fields that are not provided remain unchanged.

---

### Delete a ticket

```http
DELETE /tickets/1
```

Removes the specified ticket.

---

## Validation

Validation is mainly handled in the **Service** layer.

### POST

All fields are required:

```text
title
description
status
priority
responsible
```

The following are also validated:

* field existence;
* data types;
* empty fields;
* allowed status values;
* allowed priority values.

### PUT

PUT follows the same rules as a full update.

All fields must be provided and pass validation.

### PATCH

With PATCH, only the fields provided in the request are validated.

The API also maintains a list of allowed fields:

```js
const allowedFields = [
    'title',
    'description',
    'status',
    'priority',
    'responsible'
];
```

This prevents fields that are not part of the API contract from being modified.

---

## Query security

Queries use **PostgreSQL parameters** instead of directly interpolating values:

```js
await pool.query(
    'SELECT * FROM TB_TICKETS WHERE ID_TICKET = $1',
    [id]
);
```

User-provided values are passed as parameters and handled by PostgreSQL.

For dynamic PATCH updates, column names are controlled through a whitelist:

```js
const fieldMap = {
    title: 'NM_TITLE',
    description: 'DS_TICKET',
    status: 'ST_TICKET',
    priority: 'ST_PRIORITY',
    responsible: 'NM_RESPONSIBLE'
};
```

This ensures that values continue to be passed as parameters while column names are controlled by the application.

---

## HTTP status codes

|  Code | Meaning               | Example                                    |
| :---: | --------------------- | ------------------------------------------ |
| `200` | OK                    | Successful retrieval or update             |
| `201` | Created               | Ticket successfully created                |
| `204` | No Content            | Successful operation without response body |
| `400` | Bad Request           | Invalid request data                       |
| `404` | Not Found             | Ticket not found                           |
| `500` | Internal Server Error | Unexpected server error                    |

---

## Environment Variables

The project uses environment variables to store application and database configuration.

An `.env.example` file is provided as a template:

```env
PORT=3000

DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
```

Create a `.env` file in the project root with your local configuration.

> The `.env` file should not be committed to Git.

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/tickets-api.git
cd tickets-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the database

Create a PostgreSQL database for the project.

Then configure the database credentials in the `.env` file.

### 4. Run the migration

Execute the following file:

```text
database/migrations/001_create_tickets.sql
```

in your PostgreSQL database.

The migration will create the table and constraints required by the application.

### 5. Start the application

```bash
node src/app.js
```

The API will be available at:

```text
http://localhost:3000
```

---

## Testing the API

The API can be tested using tools such as:

* Postman
* Insomnia
* Thunder Client
* REST Client
* `curl`

Example:

```bash
curl http://localhost:3000/tickets
```

For create and update operations, send the required data in the request body.

---

## Best practices used

* Separation of responsibilities through layers
* Controllers focused on HTTP concerns
* Services responsible for business rules
* Repositories responsible for database access
* Parameterized queries
* Whitelist for dynamic field updates
* Data validation before persistence
* PostgreSQL constraints for data integrity
* Environment variables for configuration
* ESM module system
* Appropriate use of HTTP methods
* Clear distinction between PUT and PATCH

---

## Future improvements

Potential improvements for the project:

* [ ] Validation with Zod
* [ ] Prisma ORM
* [ ] Global error-handling middleware
* [ ] Standardized error responses
* [ ] Automated tests
* [ ] Swagger/OpenAPI documentation
* [ ] Pagination for ticket listing
* [ ] Filtering by status and priority
* [ ] Authentication and authorization
* [ ] Structured logging
* [ ] Environment-specific configurations

---

## Purpose

This project was developed as a practical application for studying and demonstrating **backend development with Node.js**, including:

* REST API development;
* layered architecture;
* business rules;
* data validation;
* CRUD operations;
* PostgreSQL integration;
* SQL queries;
* parameterized queries;
* PUT and PATCH usage;
* backend project organization.

---

## License

This project is licensed under the MIT License.
