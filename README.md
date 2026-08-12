# StudySync

![Status](https://img.shields.io/badge/Status-Active_Development-yellow)
![Version](https://img.shields.io/badge/Version-1.4.0-blue)
![License](https://img.shields.io/badge/License-Unlicensed-lightgrey)

StudySync is an all-in-one productivity platform designed for students, learners, job seekers, and professionals. 

Our philosophy is built around a unified ecosystem. Instead of juggling multiple applications for tasks, calendars, timers, and goals, StudySync brings all core productivity modules into a single, cohesive, and distraction-free interface.

---

## ✨ Features

### ✅ Currently Implemented
- **User Authentication**: Secure Registration, Login, Logout, Forgot Password, and Password Reset.
- **Google Sign-In**: OAuth 2.0 integration for quick access.
- **Task Management**: Full CRUD operations for Tasks.
- **Categories**: Organize tasks into distinct buckets with inline category creation.
- **Subtasks**: Granular task breakdown natively attached to parent tasks.
- **Advanced Querying**: Search, Filter, Sort (by Priority, Due Date, Workflow), and Pagination.
- **Workflow Automation**: Pending → In Progress → Completed state tracking.
- **UX Polishes**: Confirmation dialogs for unfinished subtasks, inline quick-adds, state preservation.
- **Responsive UI**: Tailored layouts for Desktop and Mobile.
- **Theming**: Dark / Light Theme switching.
- **Security**: JWT Authentication (httpOnly cookies), bcrypt hashing, Joi validation.
- **API**: Layered REST APIs with centralized error handling.
- **Notifications**: Automated event-driven updates and scheduled reminders.

### 🚧 Planned Features
- Calendar
- Pomodoro Timer
- Study Goals
- Gamification
- Dashboard
- AI Assistant
- Profile
- Settings

---

## 🛠 Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL (mysql2)
- **Authentication**: JWT, Google Identity Services, bcrypt
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Validation**: Joi
- **Deployment (Planned)**: Vercel (Frontend), Railway (Backend)

---

## 📁 Project Structure

```text
studysync/
├── backend/
│   ├── src/
│   │   ├── config/          # Centralized configuration loaders
│   │   ├── controllers/     # Route request handlers
│   │   ├── database/        # MySQL connection and migrations
│   │   ├── middleware/      # Auth, error handling, rate limiting
│   │   ├── repositories/    # SQL queries and DB logic
│   │   ├── routes/          # Express routing
│   │   ├── services/        # Core business logic
│   │   └── validations/     # Joi schemas
│   └── .env.example
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── app/             # Next.js App Router (Public & Protected layouts)
│   │   ├── components/      # Shared and feature-specific UI components
│   │   ├── contexts/        # React context (Auth, Theme)
│   │   ├── services/        # Frontend API clients
│   │   └── utils/           # Helper functions
│   ├── tailwind.config.mjs  # Tailwind configuration
│   └── .env.local.example
└── docs/                    # Extensive project documentation
```

---

## 🏗 Architecture

StudySync follows a strict layered architecture pattern for robust separation of concerns on the backend:

**Frontend (Next.js)** 
↓
**REST API (Express)**
↓
**Controllers** (Parse HTTP requests & responses)
↓
**Services** (Business rules & orchestration)
↓
**Repositories** (Direct SQL interactions)
↓
**MySQL** (Database)

---

## 📊 Current Development Status

**Completed**
- Phase 1 – Project Initialization
- Phase 2 – Authentication
- Phase 3 – Application Layout
- Phase 5 – Task Management
- Phase 6 – Calendar
- Phase 7 – Pomodoro Timer
- Phase 8 – Study Goals
- Phase 9 – Notifications

**Upcoming**
- Phase 10 – Gamification

*(Note: Phase 4 – Dashboard is intentionally deferred until the core productivity modules generate sufficient data).*

---

## 📸 Screenshots

### Landing Page
*(Screenshot coming soon)*

### Login
*(Screenshot coming soon)*

### Dashboard
*(Screenshot coming soon)*

### Task Management
*(Screenshot coming soon)*

### Calendar
*(Screenshot coming soon)*

### Pomodoro
*(Screenshot coming soon)*

---

## 🚀 Getting Started

Follow these steps to run StudySync locally based on the current repository state.

### 1. Clone the Repository
```bash
git clone https://github.com/Kunalsk36/studysync.git
cd studysync
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Database Migration
Ensure you have a local MySQL server running.
Create a database named `studysync`.
Run the SQL migration scripts located in `backend/src/database/migrations/` sequentially.

### 5. Running the Application
**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:3000` and the backend on `http://localhost:5000`.

---

## 🔐 Environment Variables

You need to create `.env` files based on the provided `.env.example` templates.

### Backend (`backend/.env`)
```env
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=studysync

# Authentication
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id

# Mail / Other
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 📚 Documentation

Detailed documentation is available in the `docs/` folder:

- **00-Vision.md**: Project vision, mission, and core philosophy.
- **01-PRD.md**: Product Requirements Document detailing MVP features.
- **02-TechSpec.md**: Technical stack, architectural decisions, and constraints.
- **03-AppFlow.md**: User journey and application flow diagrams.
- **04-DatabaseSchema.md**: Complete relational database layout.
- **05-API.md**: REST API contract.
- **06-DesignSystem.md**: UI/UX design rules, tokens, and theming.
- **07-ProjectStructure.md**: Folder and codebase organization.
- **08-Rules.md**: Coding standards and implementation guidelines.
- **09-ImplementationPlan.md**: Technical roadmap for feature execution.
- **10-Tracker.md**: Current development progress tracking.
- **11-ProductFeatures.md**: Granular breakdown of feature sets.
- **12-NonGoals.md**: Out-of-scope boundaries for the MVP.
- **13-Changelog.md**: Version history and release notes.

---

## 🗺 Roadmap

- [x] Phase 1 – Project Initialization
- [x] Phase 2 – Authentication
- [x] Phase 3 – Application Layout
- [x] Phase 5 – Task Management
- [x] Phase 6 – Calendar
- [x] Phase 7 – Pomodoro Timer
- [x] Phase 8 – Study Goals
- [x] Phase 9 – Notifications
- [ ] Phase 10 – Gamification
- [ ] Phase 4 – Dashboard
- [ ] Phase 11 – AI Assistant
- [ ] Phase 12 – User Profile
- [ ] Phase 13 – Settings
- [ ] Phase 14 – Testing & Bug Fixes
- [ ] Phase 15 – Deployment
- [ ] Phase 16 – Project Finalization

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Currently not licensed.

---

## 👤 Author

**Kunal Shrikant Kavathekar**

- GitHub: [https://github.com/Kunalsk36](https://github.com/Kunalsk36)
- LinkedIn: *(Link placeholder)*
- Portfolio: *(Link placeholder)*
- Email: *(Email placeholder)*
