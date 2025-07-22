# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build & Development
- `yarn build` - Full production build (clean, vite build, i18n, server build)
- `yarn dev:watch` - Start development with hot reload for both backend and frontend
- `yarn dev` - Start backend only in development mode
- `yarn dev:backend` - Start backend with nodemon for auto-restart
- `yarn vite:dev` - Start frontend development server only

### Testing
- `make test` - Run all tests with database setup
- `make watch` - Run tests in watch mode with database setup
- `yarn test` - Run all test suites (server, app, shared)
- `yarn test:server` - Run backend tests only
- `yarn test:app` - Run frontend tests only
- `yarn test:shared` - Run shared utility tests

### Database
- `yarn db:migrate` - Apply database migrations
- `yarn db:create-migration` - Create a new migration file
- `yarn db:reset` - Drop, create, and migrate database

### Code Quality
- `yarn lint` - Lint all TypeScript files with oxlint
- `yarn lint:changed` - Lint only changed files
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting

### Quick Start
- `make up` - Complete local development setup (Redis/Postgres, SSL certs, dependencies, dev server)

## Architecture Overview

Outline is a monorepo with TypeScript throughout, using React + MobX frontend and Node.js + Koa backend.

### Frontend (`/app`)
- **React + Vite**: Modern React app compiled with Vite, uses Rolldown for bundling
- **State Management**: MobX observables for reactive state
- **Styling**: Styled Components with co-located styles
- **Key Directories**:
  - `components/` - Reusable React components
  - `scenes/` - Full-page views
  - `stores/` - MobX stores for data management
  - `models/` - Frontend data models with MobX observables
  - `menus/` - Context menu definitions
  - `hooks/` - Custom React hooks

### Backend (`/server`)
- **Framework**: Koa.js REST API server
- **Database**: PostgreSQL with Sequelize ORM
- **Queues**: Redis with Bull for background jobs
- **Authorization**: cancan policies in `/policies`
- **Key Directories**:
  - `routes/` - API route definitions
  - `models/` - Sequelize database models
  - `commands/` - Complex business logic operations
  - `policies/` - Authorization rules
  - `presenters/` - JSON response formatters
  - `queues/` - Background job definitions

### Shared (`/shared`)
- Common utilities, types, and React components
- ProseMirror-based collaborative editor
- i18n localization files

### Collaboration
Real-time collaborative editing using:
- **Hocuspocus**: WebSocket server for collaboration
- **Y.js**: CRDT for conflict-free document merging
- **ProseMirror**: Rich text editor

## Development Patterns

### Testing
- Jest with separate configs for server/frontend/shared
- Tests co-located with source files (`.test.ts` extension)
- Factories in `/server/test/factories.ts` for test data
- Database automatically set up for tests via `make test`

### Database Migrations
- Use Sequelize CLI: `yarn sequelize migration:generate --name description`
- Always run migrations in both development and production
- Test migrations with `yarn db:reset`

### Authentication & Authorization
- Multi-provider OAuth (Google, Slack, Azure, etc.) in `/plugins`
- Policy-based authorization using cancan in `/server/policies`
- JWT tokens for API authentication

### Code Organization
- TypeScript strict mode enforced
- Prettier + oxlint for code quality
- Path aliases: `~` for app, `@shared` for shared, `@server` for server
- MobX reactions for UI state management
- Sequelize models with TypeScript decorators

### Environment Setup
- Docker Compose for local PostgreSQL and Redis
- SSL certificates required for local development
- Environment variables in `.env` files
- Use `make up` for complete local setup

## Claude Code Documentation

### Feature Documentation Rules
When implementing new features or significant changes, Claude Code should create corresponding documentation files using the following pattern:

**File Naming Convention**: `CLAUDE-[feature-name].md`

**Examples**:
- `CLAUDE-rosepine-theme.md` - Theme implementation
- `CLAUDE-user-authentication.md` - Auth system changes
- `CLAUDE-api-refactor.md` - API restructuring
- `CLAUDE-database-migration.md` - Database schema changes

**Required Sections**:
```markdown
# CLAUDE - [Feature Name]

> This file documents the [feature] implementation for future Claude Code sessions.

## Feature Summary
Brief description of what was implemented and when.

## Files Modified
List of all files changed with brief descriptions.

## Implementation Overview
Technical details of the implementation including:
- Key code changes and patterns used
- Integration points with existing systems
- Design decisions and rationale

## Integration Points
How this feature connects with existing code:
- Dependencies and related systems
- Future extension opportunities

## Validation Status
Testing and code quality checks:
- ✅ Linting status
- ✅ Type checking
- ✅ Tests (if applicable)

## Claude Code Notes
Specific notes for future Claude Code sessions:
- Important context for modifications
- Gotchas or special considerations
- Ready-to-use code examples

## Related Files
List of key files that interact with this feature.
```

**Purpose**:
- Enable future Claude Code sessions to understand previous work
- Maintain context across different coding sessions
- Document design decisions and implementation rationale
- Provide ready reference for extending or modifying features

**Location**: Store all `CLAUDE-*.md` files in the project root alongside `CLAUDE.md`