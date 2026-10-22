# Financial Habit Builder & Wealth Growth Tracker

**Manage. Save. Grow.**

A full-stack personal finance application designed to help users track income and expenses, manage savings goals, build financial habits, and understand their recorded wealth.

## Features

- **Dashboard:** View a summary of your financial activity.
- **Money Management:** Record and manage income and expenses.
- **Savings Goals:** Create goals and track savings progress.
- **Financial Habits:** Record and track financial habits.
- **Wealth Analytics:** Review cash flow, investments, other assets, and estimated net worth.
- **Authentication:** Register, log in, and access protected pages.
- **Responsive Interface:** Dark-themed interface with red accents.

## Technology Stack

### Frontend
- React
- Vite
- React Router
- Chart.js and react-chartjs-2

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- bcryptjs for password hashing

## Project Structure

```text
Financial-habit-builder/
├── backend/
│   ├── server.js
│   └── package.json
├── src/
├── public/
├── package.json
└── README.md
```

## Run Locally

### Prerequisites
- Node.js and npm
- A MongoDB database

### 1. Clone the repository

```bash
git clone https://github.com/zehra-codes/Financial-habit-builder.git
cd Financial-habit-builder
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory with these variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Replace the example values with your own configuration. Never commit `.env` files or expose credentials.

### 4. Start the backend

From the `backend` directory, run:

```bash
node server.js
```

### 5. Start the frontend

Open a second terminal in the project root and run:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Production Build

From the project root, run:

```bash
npm run build
```

The production frontend files are generated in the `dist` directory.

## Security Notes

- Keep database credentials and JWT secrets private.
- Configure production environment variables on the hosting platform.
- Use HTTPS for the deployed application.
- Never use real financial credentials as test data.

## Project Repository

GitHub: https://github.com/zehra-codes/Financial-habit-builder

## Developer

Qunoot Zehra

## Deployment Progress

- Frontend production build completed successfully.
- Login and registration pages redesigned.
- Frontend API configuration supports a deployment URL.
- Backend start command configured.
- Next: configure Render environment variables, deploy the backend and frontend, and test the live application.



## Progress Update — 18 October 2026
- Continued preparing the project for deployment and final submission.


## Progress Update — 19 October 2026
- Continued tracking project progress ahead of final submission.

## Project Verification Checkpoint — 21 October 2026

- Verified that the live application opens successfully.
- Checked that the application pages are working.
- Confirmed that saved data persists after refreshing.
- Confirmed that the latest changes are synchronized with GitHub.

Live application: https://financial-habit-builder-1-y661.onrender.com

## Project Verification Checkpoint — 22 October 2026

- Confirmed the live application is accessible.
- Verified application pages and data persistence after refresh.
- Continued final submission preparation.

