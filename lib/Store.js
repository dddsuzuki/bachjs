"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _EventEmitter = _interopRequireDefault(require("./EventEmitter"));

var _combine = _interopRequireDefault(require("./combine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Store =
/*#__PURE__*/
function () {
  function Store(state, actions, mutations) {
    _classCallCheck(this, Store);

    if (state instanceof Array) {
      state = (0, _combine["default"])(state);
    }

    if (actions instanceof Array) {
      actions = (0, _combine["default"])(actions);
    }

    if (mutations instanceof Array) {
      mutations = (0, _combine["default"])(mutations);
    }

    this.actions = actions;
    this.mutations = mutations;
    this.events = new _EventEmitter["default"]();
  }

  _createClass(Store, [{
    key: "getState",
    value: function getState() {
      return Object.assign({}, this.state);
    }
  }, {
    key: "subscribe",
    value: function subscribe(event, callback) {
      this.events.subscribe(event, callback);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(event, callback) {
      this.events.unsubscribe(event, callback);
    }
  }, {
    key: "emit",
    value: function emit(event, payload) {
      if (event === 'onUpdate') {
        console.error('Event \'onUpdate\' is not allowed to emit.');
        return;
      }

      this.events.emit(event, payload);
    }
  }, {
    key: "dispatch",
    value: function dispatch(action, payload) {
      if (typeof this.actions[action] !== 'function') {
        console.error("Action '".concat(action, "' is not defined."));
        return;
      }

      var context = {
        state: this.getState(),
        emit: this.emit.bind(this),
        dispatch: this.dispatch.bind(this),
        commit: this.commit.bind(this)
      };
      return this.actions[action](context, payload);
    }
  }, {
    key: "commit",
    value: function commit(mutation, payload) {
      if (typeof this.mutations[mutation] !== 'function') {
        console.error("Mutation '".concat(mutation, "' is not defined."));
        return false;
      }

      this.state = this.mutations[mutation](this.getState(), payload);
      this.events.emit('onUpdate', this.getState());
      return true;
    }
  }]);

  return Store;
}();

exports["default"] = Store;