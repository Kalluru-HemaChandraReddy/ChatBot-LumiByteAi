// backend/mockData.js
const { nanoid } = require('nanoid');
const fs = require('fs');
const path = require('path');

const SESSIONS_FILE = path.join(__dirname, 'sessions.json');

let sessions = {}; // will be populated by init()

function loadFromDisk() {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const raw = fs.readFileSync(SESSIONS_FILE, 'utf8');
      sessions = JSON.parse(raw);
      console.log('Loaded sessions from disk:', Object.keys(sessions).length);
    } else {
      sessions = {};
      // create a couple of sample sessions
      createNewSession();
      createNewSession();
      saveToDisk();
    }
  } catch (err) {
    console.error('Failed to load sessions.json:', err);
    sessions = {};
  }
}

function saveToDisk() {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write sessions.json:', err);
  }
}

function createNewSession() {
  const id = nanoid(8);
  const createdAt = new Date().toISOString();
  const title = `New Chat ${Object.keys(sessions).length + 1}`;
  sessions[id] = {
    id,
    title,
    createdAt,
    messages: [
      {
        id: nanoid(6),
        role: 'system',
        text: 'This is a fresh session. Ask anything!',
        createdAt,
      },
    ],
  };
  saveToDisk();
  return sessions[id];
}

function maybeSetTitleFromFirstUserMessage(sessionId, userText) {
  const session = sessions[sessionId];
  if (!session) return;
  const isDefaultTitle = session.title && (session.title.startsWith('New Chat') || session.title.startsWith('Chat'));
  const userCount = session.messages.filter(m => m.role === 'user').length;
  if (isDefaultTitle && userCount === 1) {
    const truncated = userText.length > 40 ? userText.slice(0, 37) + '...' : userText;
    session.title = truncated;
    saveToDisk();
  }
}

function getSession(sessionId) {
  return sessions[sessionId];
}

function mockStructuredResponse(question) {
  const rows = [
    { Name: 'Alice', Score: Math.floor(Math.random() * 100) },
    { Name: 'Bob', Score: Math.floor(Math.random() * 100) },
    { Name: 'Charlie', Score: Math.floor(Math.random() * 100) },
  ];

  return {
    id: nanoid(6),
    text: `Mock answer to: "${question}". Below is a small table produced as structured data.`,
    table: {
      columns: ['Name', 'Score'],
      rows,
    },
    createdAt: new Date().toISOString(),
  };
}

function init() {
  loadFromDisk();
}

module.exports = {
  sessions,
  createNewSession,
  mockStructuredResponse,
  maybeSetTitleFromFirstUserMessage,
  getSession,
  init,
  saveToDisk,
};
