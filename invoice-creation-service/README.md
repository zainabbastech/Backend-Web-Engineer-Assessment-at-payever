# Invoice Creation and Daily Sales Report System

## Overview

This system manages sales invoices and generates daily sales summary reports. It includes:

- **Invoice Creation Service**: Creates and manages invoices.
- **Email Sender Service**: Sends daily sales summary reports via email.

## Prerequisites

- Docker and Docker Compose
- Node.js and npm (for local development)

## Setup

1. **Clone the Repository**

   ```bash
   git clone https://your-repository-url.git
   cd your-repository-folder


# Invoice Creation Service
1. MongoDB Integration: Stores invoice data.
2. Endpoints:
3. POST /invoices: Create a new invoice.
4. GET /invoices/:id: Retrieve an invoice by ID.
5. GET /invoices: List all invoices (with date range filters).


# Email Sender Service
1. RabbitMQ Integration: Consumes messages from the daily_sales_report queue.
2. Email Sending: Sends the daily sales summary report via email (e.g., using SendGrid).


# Testing
1. Invoice Creation Service: Unit and integration tests for API endpoints and logic.
2. Email Sender Service: Unit tests for message processing and email sending


# Docker Configuration
1. MongoDB: Port 27017.
2. RabbitMQ: Ports 5672 (AMQP) and 15672 (management).
3. Invoice Creation Service: Port 3000.
4. Email Sender Service: Port 3001


## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
