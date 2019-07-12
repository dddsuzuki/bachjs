'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

(function () {
  function l() {
    function n(a) {
      return a ? "object" === typeof a || "function" === typeof a : !1;
    }

    var p = null;

    var g = function (a, b) {
      function f() {}

      if (!n(a) || !n(b)) throw new TypeError("Cannot create proxy with a non-object as target or handler");

      p = function () {
        f = function (a) {
          throw new TypeError("Cannot perform '" + a + "' on a proxy that has been revoked");
        };
      };

      var e = b;
      b = {
        get: null,
        set: null,
        apply: null,
        construct: null
      };

      for (var k in e) {
        if (!(k in b)) throw new TypeError("Proxy polyfill does not support trap '" + k + "'");
        b[k] = e[k];
      }

      "function" === typeof e && (b.apply = e.apply.bind(e));
      var c = this,
          g = !1,
          q = !1;
      "function" === typeof a ? (c = function () {
        var h = this && this.constructor === c,
            d = Array.prototype.slice.call(arguments);
        f(h ? "construct" : "apply");
        return h && b.construct ? b.construct.call(this, a, d) : !h && b.apply ? b.apply(a, this, d) : h ? (d.unshift(a), new (a.bind.apply(a, d))()) : a.apply(this, d);
      }, g = !0) : a instanceof Array && (c = [], q = !0);
      var r = b.get ? function (a) {
        f("get");
        return b.get(this, a, c);
      } : function (a) {
        f("get");
        return this[a];
      },
          v = b.set ? function (a, d) {
        f("set");
        b.set(this, a, d, c);
      } : function (a, b) {
        f("set");
        this[a] = b;
      },
          t = {};
      Object.getOwnPropertyNames(a).forEach(function (b) {
        if (!((g || q) && b in c)) {
          var d = {
            enumerable: !!Object.getOwnPropertyDescriptor(a, b).enumerable,
            get: r.bind(a, b),
            set: v.bind(a, b)
          };
          Object.defineProperty(c, b, d);
          t[b] = !0;
        }
      });
      e = !0;
      Object.setPrototypeOf ? Object.setPrototypeOf(c, Object.getPrototypeOf(a)) : c.__proto__ ? c.__proto__ = a.__proto__ : e = !1;
      if (b.get || !e) for (var m in a) t[m] || Object.defineProperty(c, m, {
        get: r.bind(a, m)
      });
      Object.seal(a);
      Object.seal(c);
      return c;
    };

    g.revocable = function (a, b) {
      return {
        proxy: new g(a, b),
        revoke: p
      };
    };

    return g;
  }
  var u = "undefined" !== typeof process && "[object process]" === {}.toString.call(process) || "undefined" !== typeof navigator && "ReactNative" === navigator.product ? global : self;
  u.Proxy || (u.Proxy = l(), u.Proxy.revocable = u.Proxy.revocable);
})();

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
    var _this = this;

    if (state instanceof Array) {
      state = combine(state);
    }

    if (actions instanceof Array) {
      actions = combine(actions);
    }

    if (mutations instanceof Array) {
      mutations = combine(mutations);
    }

    var handler = {
      get: function get(target, property) {
        if (target[property] instanceof Object) {
          return new Proxy(target[property], handler);
        }

        return target[property];
      },
      set: function set(target, property, value) {
        if (_this.isMutable) {
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
