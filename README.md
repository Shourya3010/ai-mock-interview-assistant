# AI Mock Interview System 🚀

A production-ready, full-stack **AI Mock Interview Platform** built with **Node.js, Express, MongoDB, Socket.IO, React, Vite, and Tailwind CSS**.

The platform simulates realistic technical and HR interview scenarios by dynamically generating target questions, evaluating candidate responses across multiple dimensions, delivering adaptive follow-ups, and building comprehensive candidate performance reports.

---

## 🌟 Key Features

- **Candidate Authentication**: Secure JWT-based registration and authentication with bcrypt password hashing.
- **Dynamic Interview Engine**: Customize role (`Software Developer`, `Frontend`, `Backend`, `Full Stack`, `Data Analyst`), round type (`Technical`, `HR`, `Behavioral`, `DSA`), difficulty level (`Easy`, `Medium`, `Hard`), and topics.
- **Weighted Scoring Engine**: Calculates final performance scores using:
  - Technical Accuracy: 40%
  - Relevance: 20%
  - Completeness: 15%
  - Communication: 15%
  - Problem Solving: 10%
- **Adaptive Follow-Up System**: Generates targeted follow-up questions when a candidate's response is incomplete or missed key technical details.
- **Adaptive Difficulty**: Automatically adjusts difficulty level based on candidate score trends.
- **Speech Integration**:
  - Voice Input via Browser Web Speech API (`SpeechRecognition`).
  - Text-to-Speech question reading via `SpeechSynthesis`.
- **Interactive AI Interviewer Avatar**: State-based 3D/SVG visualizer (`idle`, `listening`, `thinking`, `speaking`).
- **Real-Time WebSockets**: Powered by `Socket.IO` for question generation, evaluation updates, and interview completion events.
- **Candidate Analytics Dashboard**: Interactive Recharts progress graph, strengths & weaknesses tracker, and session history.
- **Resumable Interview Sessions**: Automatically restores state if the browser is closed or refreshed.

---

## 🏗️ System Architecture

```text
                    React Frontend (Vite + Tailwind)
                                 |
                          REST / WebSocket
                                 |
                                 v
                        Node.js + Express
                                 |
          +----------------------+----------------------+
          |                      |                      |
          v                      v                      v
     Auth Service        Interview Service          AI Service
          |                      |                      |
          |                      |                      v
          |                      |                  LLM API / Mock
          +----------------------+
                                 |
                                 v
                              MongoDB
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **State & HTTP**: Axios + React Context API
- **Real-time**: Socket.IO Client
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Security**: JWT, bcryptjs, Helmet, express-rate-limit, CORS
- **Validation**: Zod
- **Real-time**: Socket.IO

---

## 📁 Folder Structure

```text
ai-mock-interview-system/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── InterviewerAvatar.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── AnswerInput.jsx
│   │   │   ├── VoiceRecorder.jsx
│   │   │   ├── Timer.jsx
│   │   │   ├── ScoreCard.jsx
│   │   │   ├── ProgressChart.jsx
│   │   │   └── LoadingState.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── InterviewSetup.jsx
│   │   │   ├── InterviewRoom.jsx
│   │   │   ├── InterviewHistory.jsx
│   │   │   └── Report.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.api.js
│   │   │   ├── interview.api.js
│   │   │   └── report.api.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useInterview.js
│   │   │   └── useSpeech.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── interview.controller.js
│   │   │   └── report.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validation.middleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Interview.js
│   │   │   ├── Question.js
│   │   │   ├── Answer.js
│   │   │   └── Report.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── interview.routes.js
│   │   │   └── report.routes.js
│   │   ├── services/
│   │   │   ├── ai.service.js
│   │   │   ├── interview.service.js
│   │   │   ├── evaluation.service.js
│   │   │   └── report.service.js
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   ├── scoring.js
│   │   │   └── prompts.js
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   └── interview.validator.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── API.md
├── README.md
└── package.json
```

---

## ⚡ Quick Start & Installation

### 1. Clone & Install Dependencies

```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

Create `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/ai-mock-interview
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173

# AI Provider Setup (Supports OpenAI / Fallback)
AI_PROVIDER=openai
AI_API_KEY=your_openai_api_key
AI_MODEL=gpt-4o-mini
```

### 3. Run Locally

Start the backend:
```bash
cd server
npm run dev
```

Start the frontend:
```bash
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🔐 Security & Production Best Practices

- **Password Hashing**: Passwords stored as bcrypt hashes with salt factor 10.
- **JWT Protection**: All private API endpoints enforce HTTP Bearer token verification.
- **Rate Limiting**: Auth routes protected by 5 req/min limits; API global rate limit set to 200 req/15min.
- **Request Validation**: Zod schema validation applied to all API payloads before controller execution.
- **Security Headers**: Helmet integration and CORS white-listing applied.

---

## 📄 License
ISC License.
