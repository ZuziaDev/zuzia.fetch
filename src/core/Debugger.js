export class Debugger {
  constructor() {
    this.logs = [];
    this.isEnabled = false;
  }

  enable() {
    this.isEnabled = true;
    this.setupConsoleOverrides();
  }

  disable() {
    this.isEnabled = false;
  }

  log(type, data) {
    if (!this.isEnabled) return;

    const log = {
      type,
      timestamp: new Date(),
      data
    };

    this.logs.push(log);
    this.renderLog(log);
  }

  renderLog(log) {
    const colors = {
      request: '#2196F3',
      response: '#4CAF50',
      error: '#F44336'
    };

    console.log(
      `%c[${log.type.toUpperCase()}] ${log.timestamp.toISOString()}`,
      `color: ${colors[log.type]}; font-weight: bold`
    );
    console.log(log.data);
  }

  setupConsoleOverrides() {
    // Console override logic
  }
} 