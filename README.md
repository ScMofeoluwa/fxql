# FXQL Statement Parser

## Overview
This is a NestJS-based implementation of a Foreign Exchange Query Language (FXQL) Statement Parser. The system allows Bureau De Change (BDC) operations to submit and standardize their exchange rate information through a RESTful API.

## Features
- FXQL statement parsing and validation
- PostgreSQL database integration
- Rate limiting
- Swagger API documentation
- Comprehensive error handling with line numbers
- Input validation
- Logging system
- Docker support

## Prerequisites
- Node.js (v16 or higher)
- PostgreSQL
- Docker (optional)

## Environment Variables
Create a `.env` file in the root directory with the following variables:
```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_username
POSTGRES_DB=fxql

DATABASE_URL="postgresql://POSTGRES_USER:POSTGRES_PASSWORD@postgres:5432/fxql?schema=public"
```

## Local Development Setup

1. Install dependencies:
```bash
yarn install
```

2. Start PostgreSQL database

3. Run migrations:
```bash
yarn run db:migrate && yarn run db:generate
```

4. Start the application:
```bash
yarn run start:dev
```

## Docker Setup

1. Run the container:
```bash
docker-compose up -d
```

2. Stop the container:
```bash
docker-compose down
```

## API Documentation

### POST /fxql/statements

Parses and stores FXQL statements.

#### Request Body
```json
{
  "FXQL": "USD-GBP {\\n BUY 100\\n SELL 200\\n CAP 93800\\n}"
}
```

#### Success Response (200 OK)
```json
{
  "message": "FXQL Statement Parsed Successfully.",
  "code": "FXQL-200",
  "data": [
    {
      "EntryId": 1,
      "SourceCurrency": "USD",
      "DestinationCurrency": "GBP",
      "SellPrice": 200,
      "BuyPrice": 100,
      "CapAmount": 93800
    }
  ]
}
```

#### Error Response (400 Bad Request)
```json
{
  "message": "Detailed error message",
  "code": "FXQL-4XX"
}
```

For more details, visit the [Swagger docs](https://fxql-parser.fly.dev/api-docs) 

## Running Tests
```bash
yarn run test
```
