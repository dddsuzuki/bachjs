export default class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  subscribe(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(callback);
  }

  unsubscribe(event, callback) {
    if (!this.events.has(event)) {
      return;
    }
    this.events.get(event).delete(callback);
  }

  emit(event, payload) {
    if (!this.events.has(event)) {
      return;
    }
    for (let callback of this.events.get(event)) {
      callback(payload);
    }
  }
}
