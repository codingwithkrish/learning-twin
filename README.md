# Learning Twin 🧠
A production-grade intelligent learning assistant powered by Google Gemini AI and an adaptive Knowledge Graph.

## 🚀 Features
- **Adaptive Learning Engine**: Content adjusts between Child-like, Academic, and Expert levels.
- **Knowledge Graph**: Real-time tracking of concept mastery and confusion.
- **AI Tutor Chat**: Context-aware assistance during learning sessions.
- **Adaptive Quizzes**: Assessments that react to user confidence and correctness.
- **Futuristic UI**: Glassmorphic dashboard built with React + Tailwind CSS.

## 🛠 Tech Stack
- **Frontend**: React, Vite, Zustand, Framer Motion, Recharts, Tailwind CSS.
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT.
- **AI**: Google Gemini 1.5 Pro.
- **Deployment**: Docker, GCP Cloud Run.

## 📦 Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Gemini API Key

### 2. Installation
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### 3. Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_google_ai_key
```

### 4. Running Locally
```bash
# Start backend
cd backend
npm start

# Start frontend (separate terminal)
npm run dev
```

## ☁️ Deployment (GCP Cloud Run)

### 1. Build & Push Image
```bash
docker build -t gcr.io/[PROJECT_ID]/learning-twin .
docker push gcr.io/[PROJECT_ID]/learning-twin
```

### 2. Deploy to Cloud Run
```bash
gcloud run deploy learning-twin \
  --image gcr.io/[PROJECT_ID]/learning-twin \
  --platform managed \
  --set-env-vars="MONGODB_URI=...,GEMINI_API_KEY=..."
```

---
*Built as a production-grade AI learning companion.*
