# Multi Chain Explorer

Try it out at https://explorer.base.one

## Getting Started

Install dependencies:
```
yarn install
```

Create .env.local:

```
cp .env.example .env.local
```

Update environment variable values:

```
DB_DATABASE=xxx
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=xxx
DB_DIALECT=postgres

NEXT_PUBLIC_TRON_NODE_API=xxx
NEXT_PUBLIC_SOLANA_NODE_API=xxx
```

Run the development server:

```
yarn dev
```

Open http://localhost:3000 with your browser to see the result.