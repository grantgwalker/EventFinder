# EventFinder - Full Stack Application

A full-stack event finder application built with:

- **Frontend**: React 19 + TypeScript
- **Server**: Express (Node.js) + TypeScript
- **Backend**: Python + Flask

## Project Structure

```
EventFinder/
├── src/                    # React TypeScript frontend
│   ├── components/         # React components
│   ├── services/          # API service layer
│   ├── types/             # TypeScript type definitions
│   └── App.tsx            # Main app component
├── server/                # Express server (Node.js)
│   ├── src/
│   │   └── index.ts       # Express server entry point
│   ├── package.json
│   └── tsconfig.json
├── backend/               # Python Flask API
│   ├── app.py            # Flask application
│   ├── requirements.txt  # Python dependencies
│   └── README.md
└── public/               # Static assets

```

## Architecture

1. **React Frontend** (Port 3000)
   - User interface built with React and TypeScript
   - Communicates with Express server

2. **Express Server** (Port 5000)
   - Node.js middleware layer
   - Proxies requests to Python backend
   - Can handle authentication, caching, etc.

3. **Python Backend** (Port 8000)
   - Flask API for business logic
   - Database operations
   - External API integrations

## Scritps

npm start - Start React development server
npm run server - Start Express server in dev mode
npm run backend - Start Python Flask backend
npm run build - Build React for production
npm run install:all - Install all dependencies (React, Server, Backend)

## Setup Instructions

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Setup Express Server

```bash
cd server
npm install
cp .env.example .env
```

### 3. Setup Python Backend

```bash
cd backend
python -m venv venv

# Activate virtual environment:
# Windows:
venv\Scripts\activate
# Unix/MacOS:
# source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```

## Running the Application

### Option 1: Run All Services Separately

**Terminal 1 - React Frontend:**

```bash
npm start
```

Runs on http://localhost:3000

**Terminal 2 - Express Server:**

```bash
npm run server
```

Runs on http://localhost:5000

**Terminal 3 - Python Backend:**

```bash
npm run backend
```

Runs on http://localhost:8000

### Option 2: Quick Install All Dependencies

```bash
npm run install:all
```

## Environment Variables

### Frontend (.env in root)

```
REACT_APP_API_URL=http://localhost:5000/api
```

### Express Server (server/.env)

```
PORT=5000
PYTHON_BACKEND_URL=http://localhost:8000
```

### Python Backend (backend/.env)

```
PORT=8000
FLASK_ENV=development
```

## Development

- Frontend uses React hot-reload
- Express server uses nodemon for auto-restart
- Python Flask runs in debug mode

## Building for Production

```bash
# Build React frontend
npm run build

# Build Express server
cd server
npm run build

# The Python backend runs directly with app.py
```

## API Endpoints

### Express Server (Port 5000)

- `GET /api/health` - Health check
- `GET /api/events` - Get all events (proxied to Python)

### Python Backend (Port 8000)

- `GET /api/health` - Health check
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID

## Tech Stack

### Frontend

- React 19
- TypeScript
- Axios for API calls
- React Testing Library

### Server

- Express
- TypeScript
- CORS
- dotenv

### Backend

- Python 3
- Flask
- Flask-CORS

## Next Steps

1. Implement your event data models
2. Connect to a database (PostgreSQL, MongoDB, etc.)
3. Add authentication/authorization
4. Implement more API endpoints
5. Add frontend components and routing
6. Deploy to production
