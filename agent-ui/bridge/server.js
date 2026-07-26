
const express = require('express');

const cors = require('cors');

const Pusher = require('pusher');



const app = express();

app.use(cors());

app.use(express.json());



const pusher = new Pusher({

  appId: '2173662',

  key: 'b9cc4a723e4a8e6cfd75',

  secret: '5cf4d6f83bf99ddab95f',

  cluster: 'eu',

  useTLS: true,

});



// In-memory store (replace with DB later)

const conversations = {};



// Visitor sends message

app.post('/api/chat/send', async (req, res) => {

  const { visitorId, content, visitorName, page } = req.body;

  if (!visitorId || !content) return res.status(400).json({ error: 'Missing fields' });



  const msg = { id: Date.now().toString(), role: 'visitor', content, timestamp: Date.now(), visitorName, page };



  // Store conversation

  if (!conversations[visitorId]) {

    conversations[visitorId] = { visitorId, visitorName, page, messages: [], unread: 0 };

  }

  conversations[visitorId].messages.push(msg);

  conversations[visitorId].unread++;

  conversations[visitorId].lastMessage = content;

  conversations[visitorId].lastActivity = Date.now();



  // Notify agent dashboard

  await pusher.trigger('agent-dashboard', 'new-message', {

    visitorId, visitorName, content, page,

    conversationId: visitorId,

    unread: conversations[visitorId].unread,

  });



  res.json({ success: true });

});



// Agent sends reply

app.post('/api/chat/reply', async (req, res) => {

  const { visitorId, content, agentName } = req.body;

  if (!visitorId || !content) return res.status(400).json({ error: 'Missing fields' });



  const msg = { id: Date.now().toString(), role: 'agent', content, timestamp: Date.now(), agentName };



  if (conversations[visitorId]) {

    conversations[visitorId].messages.push(msg);

    conversations[visitorId].unread = 0;

  }



  // Send to visitor widget

  await pusher.trigger(`chat-${visitorId}`, 'agent-message', {

    id: msg.id, content, agentName,

  });



  res.json({ success: true });

});



// Agent typing indicator

app.post('/api/chat/typing', async (req, res) => {

  const { visitorId } = req.body;

  await pusher.trigger(`chat-${visitorId}`, 'agent-typing', {});

  res.json({ success: true });

});



// Get all conversations (for agent dashboard)

app.get('/api/chat/conversations', (req, res) => {

  res.json(Object.values(conversations));

});



// Get single conversation

app.get('/api/chat/conversations/:visitorId', (req, res) => {

  const conv = conversations[req.params.visitorId];

  if (!conv) return res.status(404).json({ error: 'Not found' });

  res.json(conv);

});



// Mark as read

app.post('/api/chat/read', async (req, res) => {

  const { visitorId } = req.body;

  if (conversations[visitorId]) conversations[visitorId].unread = 0;

  res.json({ success: true });

});



// Resolve conversation

app.post('/api/chat/resolve', async (req, res) => {

  const { visitorId } = req.body;

  if (conversations[visitorId]) conversations[visitorId].status = 'resolved';

  res.json({ success: true });

});



const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`WolvCapital Chat Bridge running on port ${PORT}`));

