# Study Planner Application

A full-stack MERN (MongoDB, Express, React, Node.js) application for tracking study sessions, managing goals, and monitoring academic progress.

## 🚀 Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Goal Management**: Create, track, and manage study goals
- **Task Scheduling**: Organize and track study tasks with progress indicators
- **Study Sessions**: Log study time by subject with detailed analytics
- **Dashboard**: Real-time overview of study progress, productivity scores, and statistics
- **Analytics**: Comprehensive insights into study patterns and subject performance

## 🛠️ Technologies Used

### Frontend
- React 19.1.0
- Redux Toolkit for state management
- React Router DOM for navigation
- React Bootstrap for UI components
- Vite for build tooling

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## 📁 Project Structure

```
project1/
├── 01vite-project/          # Frontend React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── redux/           # Redux store and slices
│   │   ├── api/             # API client
│   │   └── ...
│   └── package.json
│
└── backend/                  # Backend Express API
    ├── src/
    │   ├── models/          # Mongoose models
    │   ├── routes/          # API routes
    │   └── middleware/      # Auth and logging middleware
    └── package.json
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd 01vite-project
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults to localhost:5000):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/study_planner
JWT_SECRET=your-secret-key-here
```

4. Make sure MongoDB is running locally, or update `MONGODB_URI` to your MongoDB Atlas connection string.

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend API will be available at `http://localhost:5000`

## 🔐 Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing

### Frontend (.env)
- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create a goal
- `PUT /api/goals/:id` - Update a goal
- `DELETE /api/goals/:id` - Delete a goal

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Study Sessions
- `GET /api/sessions` - Get all study sessions
- `POST /api/sessions` - Create a study session

## 🚀 Deployment

### Building for Production

**Frontend:**
```bash
cd 01vite-project
npm run build
```

**Backend:**
```bash
cd backend
npm start
```

## 📄 License

This project is open source and available for personal and educational use.

## 👤 Author

Your Name

## 🙏 Acknowledgments

- React community
- Express.js
- MongoDB
- All open-source contributors

