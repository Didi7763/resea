const { Router } = require('express');
const ChatController = require('../controllers/ChatController');

const router = Router();

router.get('/flow', ChatController.getFlow);
router.post('/start', ChatController.startConversation);
router.post('/answer', ChatController.answerStep);

module.exports = router;
