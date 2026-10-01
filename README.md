# AI-Enabled Finance Management System

A full-stack personal finance management application built with **React, TypeScript, Node.js, Express and MySQL**, with planned **n8n workflow automation and AI/LLM integration**.

The project is being developed as a portfolio project to demonstrate full-stack software engineering, database design, API development, automation, and practical AI integration.

> **Status:** 🚧 In development
> **Deployment:** Private / controlled environment

---

## Features

### Finance Management

* User authentication and authorisation
* Multiple financial accounts
* Income and expense tracking
* Transaction management
* Account-to-account transfers
* Transaction categorisation
* Financial dashboard
* Spending summaries
* Budget tracking
* Financial reports

### Automation

Planned integration with **n8n** for:

* Transaction workflows
* Webhooks
* Scheduled jobs
* Notifications
* Automated financial reports

### AI

Planned AI functionality includes:

* Automatic transaction categorisation
* Financial summaries
* Natural-language financial queries
* Spending pattern analysis
* Budget insights
* AI-assisted reporting

Example:

> "How much did I spend on groceries last month?"

The AI will interact with controlled backend functions rather than having unrestricted database access.

---

## Technology Stack

| Layer            | Technology         |
| ---------------- | ------------------ |
| Frontend         | React + TypeScript |
| Backend          | Node.js + Express  |
| Database         | MySQL              |
| API              | REST               |
| Automation       | n8n                |
| AI               | LLM APIs           |
| Version Control  | Git / GitHub       |
| Containerisation | Docker             |

---

## Architecture

```text
┌──────────────────────┐
│   React + TypeScript │
│      Frontend        │
└──────────┬───────────┘
           │
        REST API
           │
           ▼
┌──────────────────────┐
│   Node.js + Express  │
│      Backend API     │
└──────────┬───────────┘
           │
      ┌────┴────┐
      ▼         ▼
┌──────────┐ ┌──────────┐
│  MySQL   │ │   n8n    │
│ Database │ │Automation│
└──────────┘ └────┬─────┘
                  │
                  ▼
             ┌─────────┐
             │ AI/LLM  │
             └─────────┘
```

---

## Example API Endpoints

```http
POST   /api/auth/login
POST   /api/auth/register

GET    /api/accounts
POST   /api/accounts
PUT    /api/accounts/:id
DELETE /api/accounts/:id

GET    /api/transactions
POST   /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id

POST   /api/transfers

GET    /api/dashboard
GET    /api/reports
```

---

## AI Workflow

A future transaction categorisation workflow could look like:

```text
Transaction
     ↓
Node.js API
     ↓
MySQL
     ↓
n8n Webhook
     ↓
AI Classification
     ↓
Category
     ↓
Database
```

The longer-term goal is to allow users to interact with their financial data through natural language using controlled backend tools.

---

## Project Structure

```text
finance-management-system/
│
├── frontend/
│   └── React + TypeScript
│
├── backend/
│   └── Node.js + Express
│
├── database/
│   └── MySQL schema
│
├── workflows/
│   └── n8n workflows
│
├── docs/
│   └── Architecture and project documentation
│
└── README.md
```

---

## Roadmap

* [ ] Project setup
* [ ] Database schema
* [ ] Authentication
* [ ] Account management
* [ ] Transaction management
* [ ] Transfers
* [ ] Financial dashboard
* [ ] n8n integration
* [ ] AI transaction categorisation
* [ ] Natural-language financial queries
* [ ] AI financial insights
* [ ] Receipt processing
* [ ] Automated reporting
* [ ] Docker deployment

---

## Project Goals

This project is intended to demonstrate practical experience with:

**Full-Stack Development · REST APIs · MySQL · React · TypeScript · Node.js · Automation · AI/LLMs · Docker · Git**

The project focuses on progressively evolving a traditional finance application into an **AI-assisted financial management platform**.
