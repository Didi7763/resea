const fs = require('fs');
const path = require('path');

const flowPath = path.join(__dirname, '..', 'data', 'flow.json');

class FlowService {
  constructor() {
    this.flow = this.loadFlow();
  }

  loadFlow() {
    const raw = fs.readFileSync(flowPath, 'utf-8');
    return JSON.parse(raw);
  }

  getStep(stepId) {
    return this.flow[stepId] || null;
  }

  getWelcomeStep() {
    return this.getStep('welcome');
  }
}

module.exports = new FlowService();
