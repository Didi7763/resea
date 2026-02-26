const flowService = require('../services/flowService');
const conversations = require('../models/Conversation');

const formatMessage = (message, answers = {}) => {
  if (!message) return '';
  return message.replace(/\{(\w+)\}/g, (_match, key) => {
    const value = answers[key];
    if (value === undefined || value === null || value === '') {
      return 'N/A';
    }
    return value;
  });
};

const serializeStep = (session, step, overrides = {}) => {
  if (!step) {
    return {
      sessionId: session.id,
      done: true,
      message: 'Merci d\'avoir discuté avec Dodo !'
    };
  }

  return {
    sessionId: session.id,
    stepId: overrides.stepId || step.id || null,
    message: formatMessage(step.message, session.answers),
    type: step.type,
    options: step.options || null,
    done: step.type === 'end',
    next: step.next || null
  };
};

const ChatController = {
  startConversation: (_req, res) => {
    const welcomeStep = flowService.getWelcomeStep();
    if (!welcomeStep) {
      return res.status(500).json({ error: 'Flow introuvable' });
    }

    const session = conversations.create('welcome');
    return res.json(serializeStep(session, welcomeStep, { stepId: 'welcome' }));
  },

  answerStep: (req, res) => {
    const { sessionId, answer } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId manquant' });
    }

    const session = conversations.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session introuvable' });
    }

    const currentStepId = session.currentStep;
    const currentStep = flowService.getStep(currentStepId);
    if (!currentStep) {
      return res.status(400).json({ error: `Étape inconnue: ${currentStepId}` });
    }

    if (currentStep.type !== 'end') {
      const storageKey = currentStep.storeAs || currentStepId;
      conversations.recordAnswer(sessionId, storageKey, answer);
    }

    let nextStepId = null;

    if (typeof currentStep.next === 'string') {
      nextStepId = currentStep.next;
    } else if (typeof currentStep.next === 'object' && currentStep.next !== null) {
      const formattedAnswer = answer && answer.trim ? answer.trim() : answer;
      nextStepId = currentStep.next[formattedAnswer] || currentStep.next.default || null;
    }

    if (!nextStepId) {
      conversations.update(sessionId, { currentStep: null });
      return res.json({
        sessionId,
        done: true,
        message: 'Merci d\'avoir discuté avec Dodo !',
        answers: session.answers
      });
    }

    const nextStep = flowService.getStep(nextStepId);
    if (!nextStep) {
      conversations.update(sessionId, { currentStep: null });
      return res.json({
        sessionId,
        done: true,
        message: `Fin de la conversation (étape ${nextStepId} introuvable).`
      });
    }

    conversations.update(sessionId, { currentStep: nextStepId });
    return res.json(serializeStep(session, { ...nextStep, id: nextStepId }));
  },

  getFlow: (_req, res) => {
    return res.json(flowService.flow);
  }
};

module.exports = ChatController;
