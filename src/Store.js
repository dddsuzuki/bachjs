import EventEmitter from './EventEmitter';
import combine from './combine';

export default class Store {
  constructor(state, actions, mutations) {
    this.isMutable = false;

    if (state instanceof Array) {
      state = combine(state);
    }

    if (actions instanceof Array) {
      actions = combine(actions);
    }

    if (mutations instanceof Array) {
      mutations = combine(mutations);
    }

    const handler = {
      get: (target, property) => {
        if (target[property] instanceof Object) {
          return new Proxy(target[property], handler);
        }

        return target[property];
      },

      set: (target, property, value) => {
        if (this.isMutable) {
          target[property] = value;
        } else {
          console.error('State mutation is allowed only in Mutation.');
        }

        return true;
      }
    };

    this.state = new Proxy(state, handler);
    this.actions = actions;
    this.mutations = mutations;
    this.events = new EventEmitter();
  }

  getState() {
    return this.state;
  }

  subscribe(event, callback) {
    this.events.subscribe(event, callback);
  }

  unsubscribe(event, callback) {
    this.events.unsubscribe(event, callback);
  }

  emit(event, payload) {
    if (event === 'onUpdate') {
      console.error('Event \'onUpdate\' is not allowed to emit.');

      return;
    }

    this.events.emit(event, payload);
  }

  dispatch(action, payload) {
    if (typeof this.actions[action] !== 'function') {
      console.error(`Action '${action}' is not defined.`);

      return;
    }

    const context = {
      state: this.state,
      emit: this.emit.bind(this),
      dispatch: this.dispatch.bind(this),
      commit: this.commit.bind(this),
    };

    return this.actions[action](context, payload);
  }

  commit(mutation, payload) {
    if (typeof this.mutations[mutation] !== 'function') {
      console.error(`Mutation '${mutation}' is not defined.`);

      return false;
    }

    this.isMutable = true;

    const newState = this.mutations[mutation](this.state, payload);
    this.state = Object.assign(this.state, newState);

    this.isMutable = false;

    this.events.emit('onUpdate', this.state);

    return true;
  }
}
