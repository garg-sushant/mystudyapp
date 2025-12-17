# 📚 Smart Study Planner

Smart Study Planner is a full-stack MERN web app that helps students organize their study life—plan tasks, set goals, log study sessions, and track progress with clear analytics.

## What This Website Does
- Provides a dashboard to view study progress and productivity at a glance
- Lets students create goals, tasks, and study sessions with status tracking
- Secures access with JWT-based authentication
- Stores data in MongoDB for persistent progress tracking

## Tech Stack
- **Frontend:** React, Redux Toolkit, React Router, React Bootstrap, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Auth:** JWT, bcryptjs
- **Tooling:** Vite, ESLint

## Features
- Authentication with JWT and hashed passwords
- Goal management with progress indicators
- Task scheduling with priorities and deadlines
- Study session logging with subject-wise history
- Analytics dashboard for productivity insights
- User streak tracking: daily streak increments when a user completes all tasks assigned for a day, resets to zero when a day has incomplete or no tasks. Streak is shown in the Navbar and is updated instantly when today's tasks are completed.
- Task `completedAt` timestamp and improved task update flow so completions update timestamps immediately (used by streak logic).

## Future Enhancements
- Add calendar view for tasks and sessions
- Export analytics reports (PDF/CSV)
- Notifications for upcoming deadlines
- Collaboration: share goals/tasks with study partners
- Dark mode toggle for better accessibility
