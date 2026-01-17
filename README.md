# MCAT CARS Practice App

This full-stack application helps users study for the Critical Analysis and Reasoning Skills (CARS) section of the MCAT.

## Features

- 🔐 User authentication (signup, login, logout)
- 📚 Browse and select practice passages
- ✍️ Read passages and answer questions
- ⏱️ Optional timer functionality
- ✅ Submit answers and view results
- 📖 Detailed explanations for each answer choice
- 📊 Basic progress tracking
- 🚩 Flag questions for review
- 🎯 3-5 sample MCAT passages included

## Technology Stack

### Backend
- **Runtime**: Bun.js
- **Framework**: Hono.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Auth**: JWT with bcrypt

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Routing**: React Router v6
- **Styling**: Tailwind CSS

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Bun** (v1.0.0 or higher)
   ```bash
   # macOS/Linux
   curl -fsSL https://bun.sh/install | bash

   # Or with Homebrew
   brew install oven-sh/bun/bun
   ```

2. **PostgreSQL** (v16 or higher)

   **Option 1: Docker** (Recommended)
   ```bash
   docker run --name mcat-postgres \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=mcat_cars \
     -p 5432:5432 \
     -d postgres:16
   ```

   **Option 2: Local Installation**
   ```bash
   # macOS
   brew install postgresql@16
   brew services start postgresql@16
   createdb mcat_cars

   # Ubuntu/Debian
   sudo apt-get install postgresql-16
   sudo systemctl start postgresql
   sudo -u postgres createdb mcat_cars
   ```

## Quick Start

1. **Clone the repository**
   ```bash
   cd mcat-cars-practice-app
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp packages/backend/.env.example packages/backend/.env
   ```

   Edit `packages/backend/.env` and update the values:
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/mcat_cars
   JWT_SECRET=your-secret-key-here
   PORT=3000
   NODE_ENV=development
   ```

4. **Generate and run database migrations**
   ```bash
   cd packages/backend
   bun run db:generate
   bun run db:migrate
   ```

5. **Seed the database with sample passages**
   ```bash
   bun run db:seed
   ```

6. **Start the development servers**

   From the root directory:
   ```bash
   bun run dev
   ```

   Or run separately:
   ```bash
   # Terminal 1 - Backend
   bun run dev:backend

   # Terminal 2 - Frontend
   bun run dev:frontend
   ```

7. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## Development

### Project Structure

```
mcat-cars-practice-app/
├── packages/
│   ├── backend/          # Bun.js API server
│   │   ├── src/
│   │   │   ├── db/       # Database schema and migrations
│   │   │   ├── routes/   # API endpoints
│   │   │   ├── services/ # Business logic
│   │   │   └── middleware/
│   │   └── package.json
│   ├── frontend/         # React SPA
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── store/    # Zustand state management
│   │   │   └── api/      # API client
│   │   └── package.json
│   └── shared/           # Shared TypeScript types
│       └── src/types/
├── package.json          # Workspace root
└── README.md
```

### Available Scripts

```bash
# Install dependencies
bun install

# Run both frontend and backend
bun run dev

# Run backend only
bun run dev:backend

# Run frontend only
bun run dev:frontend

# Build for production
bun run build

# Database operations
bun run db:generate    # Generate migrations from schema
bun run db:migrate     # Run migrations
bun run db:seed        # Seed sample data
bun run db:studio      # Open Drizzle Studio (database GUI)
```

### Database Management

View and manage your database using Drizzle Studio:
```bash
bun run db:studio
```

Or connect with any PostgreSQL client:
- Host: localhost
- Port: 5432
- Database: mcat_cars
- Username: postgres
- Password: password

## API Endpoints

Base URL: `http://localhost:3000/api/v1`

### Authentication
- `POST /auth/signup` - Create new user
- `POST /auth/login` - Login and receive JWT token
- `GET /auth/me` - Get current user info

### Passages
- `GET /passages` - List all passages
- `GET /passages/:id` - Get single passage with questions

### Sessions
- `POST /sessions` - Create new practice session
- `GET /sessions/:id` - Get session details
- `PATCH /sessions/:id/answer` - Submit/update answer
- `POST /sessions/:id/complete` - Complete session and calculate score
- `GET /sessions/:id/results` - Get detailed results with explanations

### Progress
- `GET /progress` - Get user progress statistics

## Testing

After setup, test the complete flow:

1. Visit http://localhost:5173
2. Sign up for a new account
3. Select a practice passage
4. Answer questions (try the timer!)
5. Flag some questions
6. Submit and review results with explanations
7. Check your progress stats

## Troubleshooting

### Bun not installed
If you see "command not found: bun", install Bun:
```bash
curl -fsSL https://bun.sh/install | bash
```

### PostgreSQL connection errors
- Ensure PostgreSQL is running: `docker ps` (if using Docker)
- Check DATABASE_URL in `.env` matches your setup
- Verify database exists: `psql -l | grep mcat_cars`

### Port already in use
- Backend (3000): Kill process using `lsof -ti:3000 | xargs kill -9`
- Frontend (5173): Kill process using `lsof -ti:5173 | xargs kill -9`

## Contributing

This is a personal practice application. Feel free to fork and modify for your own use.

## License

MIT
