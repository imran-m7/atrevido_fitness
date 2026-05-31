# Atrevido Fitness Platform
 
A full-stack web application for managing a women's fitness program — built as a final project for **CS308 – Software Engineering** at the International University of Sarajevo.
 
---
 
## Overview
 
Atrevido Fitness is a centralized platform that replaces scattered tools (messages, spreadsheets, manual notes) with a single organized system for a fitness trainer and her members.
 
**Three user roles:**
- **Guest** — browse public content, view programs, read the blog, register
- **Member** — book weekly sessions, view challenges, access nutrition content, track progress
- **Trainer/Admin** — manage members, approve programs, create schedules, manage content
---
 
## Features
 
| Area | Functionality |
|---|---|
| Authentication | Registration, login, JWT-based sessions, BCrypt password hashing |
| Program Management | Members request a plan; admin approves/rejects |
| Weekly Booking | First-come first-served session booking with capacity enforcement |
| Challenges | Admin creates challenges; members view and participate |
| Nutrition Content | PDF plan access restricted to eligible members |
| Progress Tracking | Admin records and manages member progress entries |
| Blog | Admin creates/edits posts; visible publicly |
| Profile | Members update username, password, and profile image |
| Admin Dashboard | Member management, statistics, quick actions |
 
---
 
## Tech Stack
 
### Frontend
- **React** + **Vite**
- **Tailwind CSS**
- **React Router**
### Backend
- **ASP.NET Core 8 Web API**
- **Entity Framework Core**
- **JWT Authentication**
- **BCrypt**
### Database
- **SQL Server**
### Testing
- **Vitest** + **React Testing Library** (frontend unit tests)
- **xUnit** + **EF Core InMemory** + **Moq** (backend unit tests)
- **Playwright** (end-to-end tests)
### Project Management
- **Jira** (task tracking)
- **GitHub** (version control)
---
 
## Architecture
 
The platform uses a **layered client-server architecture**:
 
```
React Frontend (Vite)
        ↕  HTTP/HTTPS + JWT
ASP.NET Core 8 API Controllers
        ↕
Business Logic Layer (DTOs, Validation, Auth Rules)
        ↕
Data Access Layer (Entity Framework Core)
        ↕
SQL Server Database
```
 
**Design patterns used:** Repository, DTO, Singleton (DI), Observer (React Context), Strategy (role-based logic), Factory-like (token generation).
 
---
 
## Getting Started
 
### Prerequisites
 
- [Node.js](https://nodejs.org/) (v18+)
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [SQL Server](https://www.microsoft.com/en-us/sql-server)
### Backend Setup
 
```bash
# Clone the repository
git clone https://github.com/your-org/atrevido-fitness.git
cd atrevido-fitness
 
# Navigate to the backend project
cd backend
 
# Configure the database connection in appsettings.json
# Update "ConnectionStrings:DefaultConnection" with your SQL Server details
 
# Apply database migrations
dotnet ef database update
 
# Run the backend
dotnet run
```
 
### Frontend Setup
 
```bash
# Navigate to the frontend project
cd frontend
 
# Install dependencies
npm install
 
# Start the development server
npm run dev
```
 
The app will be available at `http://localhost:5173` (frontend) and `http://localhost:7087` (backend API) by default.
 
---
 
## Testing
 
### Frontend Unit Tests
 
```bash
cd frontend
npm run test          # Run tests
npm run coverage      # Run with coverage report
```
 
Coverage results: **~78% statements, ~77% branches, ~81% functions, ~82% lines**
 
### Backend Unit Tests
 
```bash
cd backend
dotnet test --collect:"XPlat Code Coverage"
reportgenerator -reports:"**/coverage.cobertura.xml" -targetdir:"coverage-report"
```
 
Coverage results: **82.8% line coverage, 62% branch coverage**
 
### End-to-End Tests (Playwright)
 
```bash
cd frontend
npx playwright test           # Run all E2E tests
npx playwright show-report    # Open the HTML report
```
 
All **19 Playwright tests** pass across authentication, homepage, admin dashboard, and member dashboard flows.
 
---
 
## Repository Structure
 
```
atrevido-fitness/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   └── tests/         # Vitest + Playwright tests
├── backend/           # ASP.NET Core Web API
│   ├── Controllers/
│   ├── Models/
│   ├── DTOs/
│   ├── Helpers/
│   └── Tests/         # xUnit backend tests
└── README.md
```
 
**Branches:** `main` · `frontend` · `backend` · `testing`
 
---
 
## Team
 
| Student ID | Name |
|---|---|
| 230302139 | Faris Sikira |
| 230302176 | Ali-Harun Neimarlija |
| 230302177 | Imran Mujkanović |
| 230302198 | Lejla Goralija |
| 230302267 | Iman Mezit |
 
**Professor:** Mirza Selimović  
**Assistant:** Adna Dedić  
**Course:** CS308 – Software Engineering, IUS Sarajevo, May 2026
 
---
 
## Future Enhancements
 
- Email notifications for program approvals and reminders
- Online payment integration
- Mobile application
- Advanced analytics and reporting
- Calendar integration
- Cloud deployment
---
 
## License
 
This project was developed for academic purposes as part of CS308 at the International University of Sarajevo.
