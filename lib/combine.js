"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = combine;

function combine(objects) {
  var result = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = objects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var object = _step.value;

      for (var key in object) {
        if (Object.prototype.hasOwnProperty.call(result, key)) {
          console.error("'".concat(key, "' is duplicated."));
        }
      }

      Object.assign(result, object);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return result;
}