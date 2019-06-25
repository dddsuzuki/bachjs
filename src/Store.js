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

    this.actions = actions;
    this.mutations = mutations;
    this.events = new EventEmitter();

    this.state = new Proxy((state || {}), {
      set: (obj, key, value) => {
        if (this.isMutable) {
          obj[key] = value;
        } else {
          console.error('State mutation is allowed only in Mutation.');
        }

        return true;
      }
    });
  }

  getState() {
    return Object.assign({}, this.state);
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
      state: this.getState(),
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

    this.state = this.mutations[mutation](this.getState(), payload);

    this.isMutable = false;

    this.events.emit('onUpdate', this.getState());

    return true;
  }
}
