# GTIC School Management — Backend

Backend API for the GTIC school-management platform.

The API is built with AdonisJS and PostgreSQL and provides the business logic for authentication, student and teacher management, classes, courses, grades, payments, pricing, notifications, and administrative activity tracking.

## Main Features

- Authentication and session-protected routes
- Role-based administrative access
- User management
- Student and inactive-student management
- Teacher management
- Parent management
- Course and grade management
- Class creation, extension, and inactive-class handling
- Student-to-class enrollment
- Pricing management
- Payment management
- Notifications
- Administrative activity logs

## Tech Stack

- **Runtime:** Node.js
- **Framework:** AdonisJS 6
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Lucid
- **Authentication:** AdonisJS Auth
- **Validation:** VineJS
- **Testing:** Japa
- **Code quality:** ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js
- npm
- PostgreSQL

### Installation

```bash
git clone https://github.com/dacolate/gtic-backend.git
cd gtic-backend
npm install
```

Configure the required environment variables for the AdonisJS application and database.

Run database migrations as required by your local setup, then start the development server:

```bash
npm run dev
```

## Useful Commands

```bash
npm run dev
npm run build
npm run test
npm run lint
npm run typecheck
```

## Related Repository

The frontend for this application is available in [gtic-frontend](https://github.com/dacolate/gtic-frontend).
