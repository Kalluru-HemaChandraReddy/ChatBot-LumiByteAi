// backend/server.js
const express = require('express');
const cors = require('cors');
const {
  sessions,
  createNewSession,
  mockStructuredResponse,
  maybeSetTitleFromFirstUserMessage,
  getSession,
  init,
  saveToDisk,
} = require('./mockData');

const app = express();
app.use(cors());
app.use(express.json());

init(); // load sessions.json

const PORT = process.env.PORT || 5000;

// GET /api/sessions - list session summaries
app.get('/api/sessions', (req, res) => {
  const list = Object.values(sessions).map(s => ({
    id: s.id,
    title: s.title,
    createdAt: s.createdAt,
    lastMessageAt: s.messages[s.messages.length - 1].createdAt,
  }));
  list.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
  res.json(list);
});

// GET /api/new-chat - create a new session and return id
app.get('/api/new-chat', (req, res) => {
  const session = createNewSession();
  res.json({ id: session.id, title: session.title });
});

// GET /api/session/:id - return full conversation for a session
app.get('/api/session/:id', (req, res) => {
  const { id } = req.params;
  const session = getSession(id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

// POST /api/chat/:id - accept a question, push to session, return structured response
app.post('/api/chat/:id', (req, res) => {
  const { id } = req.params;
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question required in body' });

  const session = getSession(id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  const userMessage = {
    id: `u_${Date.now()}`,
    role: 'user',
    text: question,
    createdAt: new Date().toISOString(),
  };
  session.messages.push(userMessage);

  // If first user message, set session title
  maybeSetTitleFromFirstUserMessage(id, question);

  const answer = mockStructuredResponse(question);
  const assistantMessage = {
    id: answer.id,
    role: 'assistant',
    text: answer.text,
    table: answer.table,
    createdAt: answer.createdAt,
    feedback: { likes: 0, dislikes: 0 },
  };
  session.messages.push(assistantMessage);

  saveToDisk();
  res.json(assistantMessage);
});

// POST /api/feedback/:sessionId/:messageId - increment like/dislike
app.post('/api/feedback/:sessionId/:messageId', (req, res) => {
  const { sessionId, messageId } = req.params;
  const { type } = req.body; // 'like' or 'dislike'
  const session = getSession(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  const msg = session.messages.find(m => m.id === messageId);
  if (!msg) return res.status(404).json({ error: 'Message not found' });
  if (!msg.feedback) msg.feedback = { likes: 0, dislikes: 0 };
  if (type === 'like') msg.feedback.likes += 1;
  else if (type === 'dislike') msg.feedback.dislikes += 1;
  else return res.status(400).json({ error: 'Invalid feedback type' });

  saveToDisk();
  res.json(msg.feedback);
});

app.listen(PORT, () => {
  console.log(`Mock API server listening on http://localhost:${PORT}`);
});
