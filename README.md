🚀 LumiByte Chat — Full-Stack Chat Application

A simplified ChatGPT-style conversational application built with React (frontend) and Node.js + Express (backend).
Features include session management, tabular responses, dark/light mode, collapsible sidebar, feedback buttons, and persistent session storage.

📌 Features
🎨 Frontend

Fully responsive UI (Tailwind CSS)

Collapsible sidebar with hamburger menu

Dark/Light theme toggle

Chat interface with:

User messages

Mock assistant messages

Structured table responses

Like/Dislike feedback on assistant messages

Session-based chat history

First user message becomes session title

Smooth loading spinner for async operations

⚙️ Backend

Node.js + Express REST API

Creates new chat sessions using nanoid

Returns mock structured responses

Stores sessions in sessions.json

CORS enabled for frontend

Clean modular architecture

🛠 Tech Stack
Layer	Technology
Frontend	React (CRA), JavaScript, Tailwind CSS
Backend	Node.js, Express
State/Data	JSON file (sessions.json)
Utilities	nanoid, cors
Deployment	Render (recommended) 

📂 Project Structure
```
/chat-app-project
|
├── backend
│   ├── server.js           # Express server + API endpoints
│   ├── mockData.js         # Session logic + mock responses
│   ├── sessions.json       # Persistent session storage
│   ├── package.json
│   └── node_modules/
|
└── frontend
    ├── src
    │   ├── components
    │   │   ├── Sidebar.js
    │   │   ├── ThemeToggle.js
    │   │   ├── ChatInput.js
    │   │   ├── TableResponse.js
    │   │   ├── AnswerFeedback.js
    │   │   └── ChatWindow.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── node_modules/
```
💻 Local Setup
```
git clone https://github.com/<your-username>/<repo-name>.git
cd chat-app-project
```

🔧 Running the Backend
```
cd backend
npm install
npm start
```
Server will start at:
```
http://localhost:5000
```
🎨 Running the Frontend 
```
cd frontend
npm install
npm start
```
Frontend will open at:
```
http://localhost:3000
```
Ensure the backend is running simultaneously.

🌍 Environment Variables

Inside the frontend folder, create .env:
```
REACT_APP_API_URL=http://localhost:5000
```
For production, this must point to the deployed backend URL (example below).
🔌 API Endpoints
GET /api/sessions

List all sessions.

GET /api/new-chat

Create a new session: 
```
{ "id": "abc123", "title": "New Chat" }
```
GET /api/session/:id

Get full messages of a session.

POST /api/chat/:id

Send a user question & get mock structured response.

POST /api/feedback/:sessionId/:messageId

Submit 👍 or 👎. 


🧠 How Sessions Work

Clicking “New Chat” creates a new session with:

unique ID

system message

First user message becomes the session title

Sidebar loads /api/sessions

Sessions persist inside sessions.json

Titles and message timestamps update dynamically


