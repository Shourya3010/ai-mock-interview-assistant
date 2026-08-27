# AI Mock Interview System - API Documentation

Base URL: `/api`

---

## 1. Authentication APIs

### Register Candidate
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public (Rate Limited: 5 req/min)
- **Request Body**:
```json
{
  "name": "Alex Mercer",
  "email": "alex@example.com",
  "password": "password123"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1Ni...",
  "user": {
    "id": "60d5ec49f1b2c80015f8e4a1",
    "name": "Alex Mercer",
    "email": "alex@example.com"
  }
}
```

### Login Candidate
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public (Rate Limited: 5 req/min)
- **Request Body**:
```json
{
  "email": "alex@example.com",
  "password": "password123"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1Ni...",
  "user": {
    "id": "60d5ec49f1b2c80015f8e4a1",
    "name": "Alex Mercer",
    "email": "alex@example.com"
  }
}
```

### Get Current User
- **Endpoint**: `GET /api/auth/me`
- **Access**: Private (`Authorization: Bearer <token>`)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "user": {
    "id": "60d5ec49f1b2c80015f8e4a1",
    "name": "Alex Mercer",
    "email": "alex@example.com"
  }
}
```

---

## 2. Interview APIs

### Create Interview Configuration
- **Endpoint**: `POST /api/interviews`
- **Access**: Private (`Authorization: Bearer <token>`)
- **Request Body**:
```json
{
  "role": "Full Stack Developer",
  "interviewType": "Technical",
  "difficulty": "Medium",
  "topics": ["JavaScript", "React", "Node.js"],
  "duration": 15
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "_id": "66c5a89f...",
    "userId": "60d5ec49...",
    "role": "Full Stack Developer",
    "interviewType": "Technical",
    "difficulty": "Medium",
    "topics": ["JavaScript", "React", "Node.js"],
    "duration": 15,
    "status": "created"
  }
}
```

### Start Interview
- **Endpoint**: `POST /api/interviews/:id/start`
- **Access**: Private (`Authorization: Bearer <token>`)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "question": {
    "_id": "66c5a910...",
    "interviewId": "66c5a89f...",
    "question": "Explain event delegation in JavaScript and why it is useful.",
    "topic": "JavaScript",
    "difficulty": "Medium",
    "sequenceNumber": 1,
    "questionType": "conceptual"
  },
  "interview": {
    "_id": "66c5a89f...",
    "status": "in-progress",
    "startedAt": "2026-08-21T09:00:00.000Z"
  }
}
```

### Submit Answer
- **Endpoint**: `POST /api/interviews/:id/answer`
- **Access**: Private (`Authorization: Bearer <token>`)
- **Request Body**:
```json
{
  "questionId": "66c5a910...",
  "answer": "Event delegation is a pattern where we attach a single event listener to a parent element rather than every child node...",
  "duration": 45
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "evaluation": {
      "technicalAccuracy": 9,
      "relevance": 9,
      "completeness": 8,
      "communication": 9,
      "problemSolving": 8,
      "score": 88,
      "strengths": ["Clear explanation of bubbling"],
      "weaknesses": ["Could mention memory optimization"],
      "feedback": "Great overview of event propagation.",
      "followUpNeeded": false
    },
    "nextQuestion": {
      "_id": "66c5a930...",
      "question": "How does React Virtual DOM diffing work under the hood?",
      "topic": "React",
      "difficulty": "Medium",
      "sequenceNumber": 2
    },
    "isCompleted": false
  }
}
```

### End Interview
- **Endpoint**: `POST /api/interviews/:id/end`
- **Access**: Private (`Authorization: Bearer <token>`)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "interview": {
      "_id": "66c5a89f...",
      "status": "completed",
      "overallScore": 85
    },
    "report": {
      "_id": "66c5a950...",
      "overallScore": 85,
      "technicalScore": 88,
      "communicationScore": 85,
      "completenessScore": 82,
      "problemSolvingScore": 80,
      "summary": "Candidate demonstrated strong technical skills across JavaScript and React."
    }
  }
}
```

---

## 3. Report & Analytics APIs

### Get Session Report
- **Endpoint**: `GET /api/reports/:interviewId`
- **Access**: Private (`Authorization: Bearer <token>`)

### Get User Analytics Dashboard Data
- **Endpoint**: `GET /api/reports`
- **Access**: Private (`Authorization: Bearer <token>`)
