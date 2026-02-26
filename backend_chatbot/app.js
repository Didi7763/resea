require('dotenv').config();
const express = require('express');
const cors = require('cors');

const chatRoutes = require('./routes/chat');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    name: 'Dodo Chatbot API',
    version: '1.0.0',
    status: 'ok',
    documentation: '/chat/flow'
  });
});

app.use('/chat', chatRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Dodo chatbot backend prêt sur le port ${PORT}`);
});
