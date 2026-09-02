# Life Tracker

Life Tracker is a full-stack application for organizing life goals in a hierarchy and managing the tasks connected to them.

[Live Demo](http://43.157.19.214)

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Radix UI, TanStack Query, and React Flow
- **Backend:** Next.js Route Handlers and Prisma ORM
- **Database:** MySQL 8
- **Tooling:** pnpm workspaces, Docker Compose, Prettier, and Nginx

## Prerequisites

- Node.js 18.18 or later
- pnpm 9
- Docker and Docker Compose

## Project Structure

```text
.
|-- packages/
|   |-- web/                 # Next.js frontend and API routes
|   |   |-- src/app/         # Pages, layouts, and route handlers
|   |   |-- src/components/  # Shared UI components
|   |   `-- src/hooks/       # Reusable React hooks
|   `-- db/                  # Prisma client and database package
|       |-- prisma/          # Prisma schema, queries, and mutations
|       `-- mysql/           # MySQL schema, seed, and utility scripts
|-- nginx/conf.d/            # Nginx configuration
|-- docker-compose.yml       # Local services
|-- package.json             # Root scripts and shared tooling
`-- pnpm-workspace.yaml      # Monorepo workspace configuration
```

## Getting Started

1. Install the dependencies:

   ```bash
   pnpm install
   ```

2. Create a `.env` file in the project root:

   ```env
   DB_ROOT_PASSWORD=password123
   DB_PORT=3306
   ```

3. Create `packages/db/.env` and `packages/web/.env.local` with the same database connection:

   ```env
   DATABASE_URL="mysql://root:password123@localhost:3306/life_tracker?charset=utf8mb4"
   ```

4. Start the local MySQL database:

   ```bash
   docker compose up -d db
   ```

   On the first start, the schema and sample data are initialized automatically.

5. Generate the Prisma client:

   ```bash
   pnpm --filter @life-tracker/db gen
   ```

6. Start the application:

   ```bash
   pnpm --filter @life-tracker/web dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To stop the database, run:

```bash
docker compose down
```

## Local Debugging

Run the web package in development mode:

```bash
pnpm --filter @life-tracker/web dev
```

Next.js provides hot reload for frontend and API changes. Use the browser developer tools for client-side debugging and the terminal output for server-side/API errors. Database logs can be viewed with:

```bash
docker compose logs -f db
```
