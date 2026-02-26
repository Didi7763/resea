const { randomUUID } = require('crypto');

class ConversationStore {
  constructor() {
    this.sessions = new Map();
  }

  create(initialStep) {
    const id = randomUUID();
    const session = {
      id,
      currentStep: initialStep,
      answers: {},
      history: []
    };
    this.sessions.set(id, session);
    return session;
  }

  get(id) {
    return this.sessions.get(id) || null;
  }

  update(id, payload) {
    if (!this.sessions.has(id)) {
      return null;
    }
    const updated = { ...this.sessions.get(id), ...payload };
    this.sessions.set(id, updated);
    return updated;
  }

  recordAnswer(id, stepId, answer) {
    const session = this.get(id);
    if (!session) return null;

    session.history.push({ stepId, answer, timestamp: Date.now() });
    if (stepId) {
      session.answers[stepId] = answer;
    }
    return session;
  }
}

module.exports = new ConversationStore();
