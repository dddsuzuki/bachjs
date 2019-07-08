'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var EventEmitter =
/*#__PURE__*/
function () {
  function EventEmitter() {
    this.events = new Map();
  }

  var _proto = EventEmitter.prototype;

  _proto.subscribe = function subscribe(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    this.events.get(event).add(callback);
  };

  _proto.unsubscribe = function unsubscribe(event, callback) {
    if (!this.events.has(event)) {
      return;
    }

    this.events.get(event).delete(callback);
  };

  _proto.emit = function emit(event, payload) {
    if (!this.events.has(event)) {
      return;
    }

    for (var _iterator = this.events.get(event), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var callback = _ref;
      callback(payload);
    }
  };

  return EventEmitter;
}();

function combine(objects) {
  var result = {};

  for (var _iterator = objects, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var object = _ref;

    for (var key in object) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        console.error("'" + key + "' is duplicated.");
      }
    }

    Object.assign(result, object);
  }

  return result;
}

var Store =
/*#__PURE__*/
function () {
  function Store(state, actions, mutations) {
    if (state instanceof Array) {
      state = combine(state);
    }

    if (actions instanceof Array) {
      actions = combine(actions);
    }

    if (mutations instanceof Array) {
      mutations = combine(mutations);
    }

    this.state = state;
    this.actions = actions;
    this.mutations = mutations;
    this.events = new EventEmitter();
  }

  var _proto = Store.prototype;

  _proto.getState = function getState() {
    return Object.assign({}, this.state);
  };

  _proto.subscribe = function subscribe(event, callback) {
    this.events.subscribe(event, callback);
  };

  _proto.unsubscribe = function unsubscribe(event, callback) {
    this.events.unsubscribe(event, callback);
  };

  _proto.emit = function emit(event, payload) {
    if (event === 'onUpdate') {
      console.error('Event \'onUpdate\' is not allowed to emit.');
      return;
    }

    this.events.emit(event, payload);
  };

  _proto.dispatch = function dispatch(action, payload) {
    if (typeof this.actions[action] !== 'function') {
      console.error("Action '" + action + "' is not defined.");
      return;
    }

    var context = {
      state: this.getState(),
      emit: this.emit.bind(this),
      dispatch: this.dispatch.bind(this),
      commit: this.commit.bind(this)
    };
    return this.actions[action](context, payload);
  };

  _proto.commit = function commit(mutation, payload) {
    if (typeof this.mutations[mutation] !== 'function') {
      console.error("Mutation '" + mutation + "' is not defined.");
      return false;
    }

    this.state = this.mutations[mutation](this.getState(), payload);
    this.events.emit('onUpdate', this.getState());
    return true;
  };

  return Store;
}();

exports.Store = Store;
