(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/coffee/main.coffee":[function(require,module,exports){
var $, App, Backbone, LoginComponent, MainRouter, config, handleLinkClicks, loadAppData, loadEditData, searchQuery, startApp;

Backbone = require('backbone');

$ = Backbone.$ = require('jquery');

config = require('./config');

App = require('./app');

MainRouter = require('./routers/main');

loadEditData = require('./helpers/load-edit-data');

loadAppData = require('./helpers/load-app-data').loadAll;

LoginComponent = require('hibb-login');

LoginComponent.init({
  basic: {
    url: "" + (config.get('facetedSearchBaseUrl')) + "/authenticate"
  },
  federated: {
    url: config.get('federatedLoginUrl')
  }
});

LoginComponent.createUser({
  tokenPrefix: config.get('tokenPrefix'),
  url: function() {
    return "" + (config.get('baseUrl')) + (config.get('userInfoPath'));
  },
  headers: {
    VRE_ID: 'WomenWriters'
  }
});

searchQuery = require('./helpers/search').searchQuery;

handleLinkClicks = function(e) {
  var href;
  href = $(this).attr('href');
  if (href != null) {
    e.preventDefault();
    if (href.match(/^https?:/)) {
      href = href.replace(config.get('baseUrl'), '');
    }
    return Backbone.history.navigate(href, {
      trigger: true
    });
  }
};

startApp = function() {
  var app, mainRouter;
  app = new App();
  $('body').append(app.el);
  mainRouter = new MainRouter({
    controller: app,
    root: 'womenwriters'
  });
  mainRouter.on('route', (function(_this) {
    return function(route) {
      return app.updateNavBar(route);
    };
  })(this));
  config.set('router', mainRouter);
  return mainRouter.start();
};

$(function() {
  $(document).on('click', 'a:not([target])', handleLinkClicks);
  LoginComponent.getUser().authorize();
  return loadAppData().done(function() {
    return loadEditData().done(function() {
      return startApp();
    });
  });
});



},{"./app":"/home/gijs/Projects/women-writers/src/coffee/app.coffee","./config":"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee","./helpers/load-app-data":"/home/gijs/Projects/women-writers/src/coffee/helpers/load-app-data.coffee","./helpers/load-edit-data":"/home/gijs/Projects/women-writers/src/coffee/helpers/load-edit-data.coffee","./helpers/search":"/home/gijs/Projects/women-writers/src/coffee/helpers/search.coffee","./routers/main":"/home/gijs/Projects/women-writers/src/coffee/routers/main.coffee","backbone":false,"hibb-login":"/home/gijs/Projects/women-writers/node_modules/hibb-login/dist/index.js","jquery":false}],"/home/gijs/Projects/women-writers/node_modules/hibb-login/dist/index.js":[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.hibbLogin=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = _dereq_('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":8}],2:[function(_dereq_,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = _dereq_('base64-js')
var ieee754 = _dereq_('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

},{"base64-js":3,"ieee754":4}],3:[function(_dereq_,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS)
			return 62 // '+'
		if (code === SLASH)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],4:[function(_dereq_,module,exports){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],5:[function(_dereq_,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],6:[function(_dereq_,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],7:[function(_dereq_,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],8:[function(_dereq_,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = _dereq_('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = _dereq_('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,_dereq_("FWaASH"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":7,"FWaASH":6,"inherits":5}],9:[function(_dereq_,module,exports){
(function (Buffer){
(function () {
  "use strict";

  function btoa(str) {
    var buffer
      ;

    if (str instanceof Buffer) {
      buffer = str;
    } else {
      buffer = new Buffer(str.toString(), 'binary');
    }

    return buffer.toString('base64');
  }

  module.exports = btoa;
}());

}).call(this,_dereq_("buffer").Buffer)
},{"buffer":2}],10:[function(_dereq_,module,exports){
(function() {
  var __hasProp = {}.hasOwnProperty;

  module.exports = {
    get: function(url, options) {
      if (options == null) {
        options = {};
      }
      return this._sendRequest('GET', url, options);
    },
    post: function(url, options) {
      if (options == null) {
        options = {};
      }
      return this._sendRequest('POST', url, options);
    },
    put: function(url, options) {
      if (options == null) {
        options = {};
      }
      return this._sendRequest('PUT', url, options);
    },
    _promise: function() {
      return {
        done: function(fn) {
          return this.callDone = fn;
        },
        callDone: null,
        fail: function(fn) {
          return this.callFail = fn;
        },
        callFail: null,
        always: function(fn) {
          return this.callAlways = fn;
        },
        callAlways: null
      };
    },
    _sendRequest: function(method, url, options) {
      var header, promise, value, xhr, _ref;
      if (options == null) {
        options = {};
      }
      promise = this._promise();
      if (options.headers == null) {
        options.headers = {};
      }
      xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        var _ref;
        if (xhr.readyState === 4) {
          if (promise.callAlways != null) {
            promise.callAlways(xhr);
          }
          if ((200 <= (_ref = xhr.status) && _ref <= 206) || xhr.status === 1223) {
            if (promise.callDone != null) {
              return promise.callDone(xhr);
            }
          } else {
            if (promise.callFail != null) {
              return promise.callFail(xhr);
            }
          }
        }
      };
      xhr.open(method, url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      _ref = options.headers;
      for (header in _ref) {
        if (!__hasProp.call(_ref, header)) continue;
        value = _ref[header];
        xhr.setRequestHeader(header, value);
      }
      xhr.send(options.data);
      return promise;
    }
  };

}).call(this);

},{}],11:[function(_dereq_,module,exports){
(function (global){
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.Pagination=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

},{}],2:[function(_dereq_,module,exports){
(function (global){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.jade=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return (Array.isArray(val) ? val.map(joinClasses) :
    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
    [val]).filter(nulls).join(' ');
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};


exports.style = function (val) {
  if (val && typeof val === 'object') {
    return Object.keys(val).map(function (style) {
      return style + ':' + val[style];
    }).join(';');
  } else {
    return val;
  }
};
/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if (key === 'style') {
    val = exports.style(val);
  }
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    if (JSON.stringify(val).indexOf('&') !== -1) {
      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
                   'will be escaped to `&amp;`');
    };
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will eliminate the double quotes around dates in ' +
                   'ISO form after 2.0.0');
    }
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  var result = String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || _dereq_('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

},{"fs":2}],2:[function(_dereq_,module,exports){

},{}]},{},[1])(1)
});
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"fs":1}],3:[function(_dereq_,module,exports){
var $, Backbone, Modal, modalManager, tpl, _,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

Backbone = _dereq_('backbone');

_ = _dereq_('underscore');

$ = _dereq_('jquery');

tpl = _dereq_('./main.jade');

modalManager = _dereq_('./manager');


/*
 * @class
 * @uses ModalManager
 */

Modal = (function(_super) {
  __extends(Modal, _super);

  function Modal() {
    return Modal.__super__.constructor.apply(this, arguments);
  }


  /*
  	 * @property
  	 * @type {String}
   */

  Modal.prototype.className = "hibb-modal";


  /*
  	 * @method
  	 * @return {Object} Default options.
   */

  Modal.prototype.defaultOptions = function() {
    return {
      title: '',
      titleClass: '',
      cancelAndSubmit: true,
      cancelValue: 'Cancel',
      submitValue: 'Submit',
      customClassName: '',
      focusOnFirstInput: true,
      clickOverlay: true
    };
  };


  /*
  	 * @method
  	 * @construct
  	 * @param {Object} [this.options]
  	 * @param {String} [this.options.title=''] Title of the modal.
  	 * @param {String} [this.options.titleClass=''] Deprecated by customClassName?
  	 * @param {String} [this.options.width] Width of the modal in px, %, vw or auto. 
  	 * @param {String} [this.options.height] Height of the modal in px, %, vw or auto.
  	 * @param {String} [this.options.html]
  	 * @param {Boolean} [this.options.cancelAndSubmit=true] Show cancel and submit button.
  	 * @param {String} [this.options.cancelValue='Cancel'] Value for the cancel button.
  	 * @param {String} [this.options.submitValue='Submit'] Value for the submit button.
  	 * @param {String} [this.options.customClassName=''] Add a className to top level to support styling and DOM manipulation. 
  	 * @param {Boolean} [this.options.focusOnFirstInput=true] Set the focus to the first <input> when the modal is shown.
  	 * @param {Boolean} [this.options.clickOverlay=true] If the overlay is clicked, cancel is triggered. Defaults to true.
   */

  Modal.prototype.initialize = function(_at_options) {
    this.options = _at_options != null ? _at_options : {};
    Modal.__super__.initialize.apply(this, arguments);
    this.options = _.extend(this.defaultOptions(), this.options);
    if (this.options.customClassName.length > 0) {
      this.$el.addClass(this.options.customClassName);
    }
    return this.render();
  };


  /*
  	 * @method
   */

  Modal.prototype.render = function() {
    var body, bodyTop, firstInput, marginLeft, offsetTop, rtpl, viewportHeight;
    rtpl = tpl(this.options);
    this.$el.html(rtpl);
    body = this.$('.body');
    if (this.options.html != null) {
      body.html(this.options.html);
    } else {
      body.hide();
    }
    this.$('.body').scroll((function(_this) {
      return function(ev) {
        return ev.stopPropagation();
      };
    })(this));
    modalManager.add(this);
    if (this.options.width != null) {
      this.$('.modalbody').css('width', this.options.width);
      marginLeft = -1 * parseInt(this.options.width, 10) / 2;
      if (this.options.width.slice(-1) === '%') {
        marginLeft += '%';
      }
      if (this.options.width.slice(-2) === 'vw') {
        marginLeft += 'vw';
      }
      if (this.options.width === 'auto') {
        marginLeft = this.$('.modalbody').width() / -2;
      }
      this.$('.modalbody').css('margin-left', marginLeft);
    }
    if (this.options.height != null) {
      this.$('.modalbody').css('height', this.options.height);
    }
    viewportHeight = document.documentElement.clientHeight;
    offsetTop = this.$('.modalbody').outerHeight() / 2;
    bodyTop = this.$('.modalbody').offset().top;
    if (offsetTop > bodyTop) {
      offsetTop = bodyTop - 20;
    }
    this.$('.modalbody').css('margin-top', -1 * offsetTop);
    this.$('.modalbody .body').css('max-height', viewportHeight - 175);
    if (this.options.focusOnFirstInput) {
      firstInput = this.$('input[type="text"]').first();
      if (firstInput.length > 0) {
        firstInput.focus();
      }
    }
    return this;
  };


  /*
  	 * @method
  	 * @return {Object}
   */

  Modal.prototype.events = function() {
    return {
      "click button.submit": '_submit',
      "click button.cancel": "_cancel",
      "click .overlay": function() {
        if (this.options.clickOverlay) {
          return this._cancel();
        }
      },
      "keydown input": function(ev) {
        if (ev.keyCode === 13) {
          ev.preventDefault();
          return this._submit(ev);
        }
      }
    };
  };


  /*
  	 * @method
  	 * @private
   */

  Modal.prototype._submit = function(ev) {
    var target;
    target = $(ev.currentTarget);
    if (!target.hasClass('loader')) {
      target.addClass('loader');
      this.$('button.cancel').hide();
      return this.trigger('submit');
    }
  };


  /*
  	 * @method
  	 * @private
   */

  Modal.prototype._cancel = function(ev) {
    if (ev != null) {
      ev.preventDefault();
    }
    this.trigger('cancel');
    return this.close();
  };


  /*
  	 * @method
   */

  Modal.prototype.close = function() {
    this.trigger('close');
    return modalManager.remove(this);
  };


  /*
  	 * Alias for close.
  	#
  	 * @method
   */

  Modal.prototype.destroy = function() {
    return this.close();
  };


  /*
  	 * @method
   */

  Modal.prototype.fadeOut = function(delay) {
    var speed;
    if (delay == null) {
      delay = 1000;
    }
    speed = delay === 0 ? 0 : 500;
    this.$(".modalbody").delay(delay).fadeOut(speed);
    return setTimeout(((function(_this) {
      return function() {
        return _this.close();
      };
    })(this)), delay + speed - 100);
  };


  /*
  	 * @method
   */

  Modal.prototype.message = function(type, message) {
    if (["success", "warning", "error"].indexOf(type) === -1) {
      return console.error("Unknown message type!");
    }
    this.$("p.message").show();
    return this.$("p.message").html(message).addClass(type);
  };


  /*
  	 * @method
  	 * @param {String} type One of success, warning, error
  	 * @param {String} message
  	 * @param {Delay} [delay] Time to wait before fading
   */

  Modal.prototype.messageAndFade = function(type, message, delay) {
    this.$(".modalbody .body").hide();
    this.$("footer").hide();
    this.message(type, message);
    return this.fadeOut(delay);
  };

  return Modal;

})(Backbone.View);

module.exports = Modal;



},{"./main.jade":4,"./manager":5}],4:[function(_dereq_,module,exports){
var jade = _dereq_("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (cancelAndSubmit, cancelValue, submitValue, title, titleClass) {
buf.push("<div class=\"overlay\"></div><div class=\"modalbody\"><header>");
if ( (title !== ''))
{
buf.push("<h2" + (jade.cls([titleClass], [true])) + ">" + (null == (jade_interp = title) ? "" : jade_interp) + "</h2>");
}
buf.push("<p class=\"message\"></p></header><div class=\"body\"></div>");
if ( (cancelAndSubmit))
{
buf.push("<footer><button class=\"cancel\">" + (jade.escape(null == (jade_interp = cancelValue) ? "" : jade_interp)) + "</button><button class=\"submit\">" + (jade.escape(null == (jade_interp = submitValue) ? "" : jade_interp)) + "</button></footer>");
}
buf.push("</div>");}.call(this,"cancelAndSubmit" in locals_for_with?locals_for_with.cancelAndSubmit:typeof cancelAndSubmit!=="undefined"?cancelAndSubmit:undefined,"cancelValue" in locals_for_with?locals_for_with.cancelValue:typeof cancelValue!=="undefined"?cancelValue:undefined,"submitValue" in locals_for_with?locals_for_with.submitValue:typeof submitValue!=="undefined"?submitValue:undefined,"title" in locals_for_with?locals_for_with.title:typeof title!=="undefined"?title:undefined,"titleClass" in locals_for_with?locals_for_with.titleClass:typeof titleClass!=="undefined"?titleClass:undefined));;return buf.join("");
};
},{"jade/runtime":2}],5:[function(_dereq_,module,exports){
var $, ModalManager;

$ = _dereq_('jquery');


/*
 * @class
 */

ModalManager = (function() {

  /*
  	 * @method
   */
  function ModalManager() {
    this._modals = [];
  }


  /*
  	 * Add a modal (Backbone.View) to modalManager.
  	#
  	 * @method
  	 * @param {Modal} modal
   */

  ModalManager.prototype.add = function(modal) {
    var arrLength, m, _i, _len, _ref;
    _ref = this._modals;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      m = _ref[_i];
      m.$('.overlay').css('opacity', '0.2');
    }
    arrLength = this._modals.push(modal);
    modal.$('.overlay').css('z-index', 10000 + (arrLength * 2) - 1);
    modal.$('.modalbody').css('z-index', 10000 + (arrLength * 2));
    return $('body').prepend(modal.$el);
  };


  /*
  	 * Remove a modal (Backbone.View) to modalManager.
  	 * 
  	 * For now, the modal to be removed is always the last modal. In theory we could call Array.pop(),
  	 * but in the future we might implement a modal drag so underlying modals can be removed first.
  	 * @method
  	 * @param {Modal} modal
   */

  ModalManager.prototype.remove = function(modal) {
    var index;
    index = this._modals.indexOf(modal);
    this._modals.splice(index, 1);
    if (this._modals.length > 0) {
      this._modals[this._modals.length - 1].$('.overlay').css('opacity', '0.7');
    }
    modal.trigger('removed');
    modal.off();
    return modal.remove();
  };

  return ModalManager;

})();

module.exports = new ModalManager();



},{}]},{},[3])
(3)
});
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],12:[function(_dereq_,module,exports){
(function (global){
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.jade=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return Array.isArray(val) ? val.map(joinClasses).filter(nulls).join(' ') : val;
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};

/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  var result = String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || _dereq_('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

},{"fs":2}],2:[function(_dereq_,module,exports){

},{}]},{},[1])
(1)
});
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],13:[function(_dereq_,module,exports){
var $, Login, Main, User, assert;

$ = _dereq_('jquery');

Login = _dereq_('./views/login');

User = _dereq_('./models/user');

assert = _dereq_('assert');

Main = (function() {
  function Main() {
    this.initialized = false;
    this._views = {
      login: null
    };
    this._user = null;
  }


  /*
  	 * @method
  	 * @param {Object} this.settings - Initialize the LoginComponent with settings.
  	 * @param {Object} [this.settings.federated]
  	 * @param {String} [this.settings.federated.url]
  	 * @param {Object} [this.settings.basic]
  	 * @param {String} [this.settings.basic.url]
  	 * @param {String} [this.settings.requestAccessUrl]
   */

  Main.prototype.init = function(settings) {
    this.settings = settings != null ? settings : {};
    assert.ok((this.settings.federated != null) || (this.settings.basic != null), "HIBB Login: There must either be a federated or a basic login! Set federated or basic to true with the LoginComponent's init method: see https://github.com/HuygensING/hibb-login#init%C3%ACalize.");
    return this.initialized = true;
  };

  Main.prototype.getLoginView = function(options) {
    if (options == null) {
      options = {};
    }
    assert.ok(this.initialized, "HIBB Login: Initialize with settings first: see https://github.com/HuygensING/hibb-login#init%C3%ACalize");
    options.user = this.getUser();
    this.destroyLoginView();
    return this._views.login = new Login(this.settings, options);
  };

  Main.prototype.destroyLoginView = function() {
    if (this._views.login != null) {
      return this._views.login.destroy();
    }
  };

  Main.prototype.getUser = function() {
    if (this._user == null) {
      throw new Error("HIBB Login: you have to create the user before you can get it!");
    }
    return this._user;
  };


  /*
  	@param {Object} options
  	@param {String} tokenPrefix
  	@param {String} tokenType="" - The type of token. Is used as a prefix when sending the Authorization header.
  	@param {Function} url
  	@param {Object} headers
   */

  Main.prototype.createUser = function(options) {
    if (options == null) {
      options = {};
    }
    if (options.tokenType == null) {
      options.tokenType = "";
    }
    this._user = new User([], this.settings, options);
    return null;
  };

  return Main;

})();

module.exports = new Main();



},{"./models/user":14,"./views/login":19,"assert":1}],14:[function(_dereq_,module,exports){
var $, Backbone, User, btoa, funcky, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = _dereq_('backbone');

$ = _dereq_('jquery');

_ = _dereq_('underscore');

funcky = _dereq_('funcky.req');

btoa = _dereq_('btoa');


/*
EVENTS TRIGGERED

basic:authorized
basic:unauthorized
unauthorized
data-fetched
 */

User = (function(_super) {
  __extends(User, _super);

  function User() {
    return User.__super__.constructor.apply(this, arguments);
  }

  User.prototype.initialize = function(attrs, settings, options) {
    this.settings = settings;
    this.options = options;
    if (this.options.url != null) {
      this.url = this.options.url();
    }
    this.fetched = false;
    this._prefix = "hi-" + this.options.tokenPrefix;
    return this.tokenPropertyName = "" + this._prefix + "-auth-token";
  };

  User.prototype._checkTokenInUrl = function() {
    var key, param, parameters, path, value, _i, _len, _ref, _results;
    path = window.location.search.substr(1);
    parameters = path.split('&');
    _results = [];
    for (_i = 0, _len = parameters.length; _i < _len; _i++) {
      param = parameters[_i];
      _ref = param.split('='), key = _ref[0], value = _ref[1];
      if (key === 'hsid') {
        this.setToken(value);
        _results.push(Backbone.history.navigate(window.location.pathname, {
          trigger: true
        }));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  User.prototype._fetchUserData = function() {
    var options;
    options = {
      success: (function(_this) {
        return function() {
          _this.trigger('data-fetched');
          return _this.fetched = true;
        };
      })(this),
      error: (function(_this) {
        return function(m, response, opts) {
          if (response.status === 401) {
            _this.removeToken();
            return _this.trigger('unauthorized', response);
          }
        };
      })(this),
      headers: {
        Authorization: this.getToken()
      }
    };
    _.extend(options.headers, this.options.headers);
    return this.fetch(options);
  };

  User.prototype.basicLogin = function(username, password) {
    var options, req;
    options = {
      headers: {
        Authorization: 'Basic ' + btoa(username + ':' + password)
      }
    };
    req = funcky.post(this.settings.basic.url, options);
    req.done((function(_this) {
      return function(res) {
        var token;
        token = res.getResponseHeader('X_AUTH_TOKEN');
        _this.trigger('basic:authorized', token);
        _this.setToken(token);
        return _this._fetchUserData();
      };
    })(this));
    return req.fail((function(_this) {
      return function(res) {
        var response;
        if (res.hasOwnProperty('response')) {
          response = JSON.parse(res.response);
        }
        return _this.trigger('basic:unauthorized', res);
      };
    })(this));
  };

  User.prototype.federatedLogin = function() {
    var form, hsURL, hsUrlEl, loginURL, wl;
    wl = window.location;
    hsURL = wl.origin + wl.pathname;
    loginURL = this.settings.federated.url;
    form = $('<form>');
    form.attr({
      method: 'POST',
      action: loginURL
    });
    hsUrlEl = $('<input>').attr({
      name: 'hsurl',
      value: hsURL,
      type: 'hidden'
    });
    form.append(hsUrlEl);
    $('body').append(form);
    return form.submit();
  };

  User.prototype.authorize = function() {
    if (this.settings.federated) {
      this._checkTokenInUrl();
    }
    if (!this.fetched) {
      this._fetchUserData();
    }
    return this;
  };

  User.prototype.isLoggedIn = function() {
    return this.getToken() != null;
  };

  User.prototype.removeToken = function() {
    return localStorage.removeItem(this.tokenPropertyName);
  };

  User.prototype.setToken = function(token) {
    return localStorage.setItem(this.tokenPropertyName, this.options.tokenType + token);
  };

  User.prototype.getToken = function() {
    return localStorage.getItem(this.tokenPropertyName);
  };

  User.prototype.setFederatedLoginStarted = function() {
    return localStorage.setItem("" + this._prefix + "-federated-login-started", true);
  };

  User.prototype.federatedLoginHasStarted = function() {
    return localStorage.getItem("" + this._prefix + "-federated-login-started") != null;
  };

  return User;

})(Backbone.Model);

module.exports = User;



},{"btoa":9,"funcky.req":10}],15:[function(_dereq_,module,exports){
var Backbone, Basic, tpl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = _dereq_('backbone');

tpl = _dereq_('./index.jade');


/*
@class
@extends Backbone.View
 */

Basic = (function(_super) {
  __extends(Basic, _super);

  function Basic() {
    return Basic.__super__.constructor.apply(this, arguments);
  }

  Basic.prototype.className = 'local';


  /*
  	@constructs
   */

  Basic.prototype.initialize = function(options) {
    this.options = options;
    return this.render();
  };

  Basic.prototype.render = function() {
    this.$el.append(tpl());
    return this;
  };

  Basic.prototype.events = function() {
    return {
      'click button': '_handleLogin',
      'keyup input[type="password"]': '_handlePasswordInputKeyup'
    };
  };

  Basic.prototype._handlePasswordInputKeyup = function(ev) {
    if (ev.keyCode === 13) {
      return this._handleLogin();
    }
  };

  Basic.prototype._handleLogin = function(ev) {
    var pass, user;
    if (ev != null) {
      ev.preventDefault();
    }
    if (this.$el.hasClass('has-error')) {
      return;
    }
    user = this.$('input[type="text"]').val();
    pass = this.$('input[type="password"]').val();
    if (user.length === 0 || pass.length === 0) {
      return this._showError("Username or password is empty.");
    }
    this.options.user.basicLogin(user, pass);
    return this.listenTo(this.options.user, 'basic:unauthorized', (function(_this) {
      return function(res) {
        var message;
        message = JSON.parse(res.response).message;
        if (res.status === 401) {
          return _this._showError(message);
        }
      };
    })(this));
  };

  Basic.prototype._showError = function(msg) {
    this.$('button').html(msg);
    this.$el.addClass('has-error');
    return setTimeout(((function(_this) {
      return function() {
        _this.$('button').html('Login');
        return _this.$el.removeClass('has-error');
      };
    })(this)), 4000);
  };

  Basic.prototype.destroy = function() {
    return this.remove();
  };

  return Basic;

})(Backbone.View);

module.exports = Basic;



},{"./index.jade":16}],16:[function(_dereq_,module,exports){
var jade = _dereq_("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<h3>Basic login</h3><form><ul><li><input type=\"text\" placeholder=\"Username or email address\"/></li><li><input type=\"password\" placeholder=\"Password\"/></li><li><button>Login</button></li></ul></form>");;return buf.join("");
};
},{"jade/runtime":12}],17:[function(_dereq_,module,exports){
var $, Backbone, Federated, tpl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = _dereq_('backbone');

$ = _dereq_('jquery');

tpl = _dereq_('./index.jade');


/*
@class
@extends Backbone.View
 */

Federated = (function(_super) {
  __extends(Federated, _super);

  function Federated() {
    return Federated.__super__.constructor.apply(this, arguments);
  }

  Federated.prototype.className = 'federated';


  /*
  	@constructs
   */

  Federated.prototype.initialize = function(options) {
    this.options = options;
    return this.render();
  };

  Federated.prototype.render = function() {
    this.$el.append(tpl());
    return this;
  };

  Federated.prototype.events = function() {
    return {
      'click button': '_handleFederatedLogin'
    };
  };

  Federated.prototype._handleFederatedLogin = function(ev) {
    return this.options.user.federatedLogin();
  };

  Federated.prototype.destroy = function() {
    return this.remove();
  };

  return Federated;

})(Backbone.View);

module.exports = Federated;



},{"./index.jade":18}],18:[function(_dereq_,module,exports){
var jade = _dereq_("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<button>Federated login</button>");;return buf.join("");
};
},{"jade/runtime":12}],19:[function(_dereq_,module,exports){
var $, Backbone, Basic, Federated, Login, Modal, RequestAccess,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = _dereq_('backbone');

$ = _dereq_('jquery');

Modal = _dereq_('hibb-modal');

Federated = _dereq_('./federated');

Basic = _dereq_('./basic');

RequestAccess = _dereq_('./request-access');


/*
@class
@extends Backbone.View
 */

Login = (function(_super) {
  __extends(Login, _super);

  function Login() {
    this._handleBasicSuccess = __bind(this._handleBasicSuccess, this);
    return Login.__super__.constructor.apply(this, arguments);
  }

  Login.prototype.id = 'hibb-login';


  /*
  	@constructs
  	
  	@param {object} this.settings
  	@param {object} this.settings.basic
  	@param {string} this.settings.basic.url
  	@param {object} this.settings.federated
  	@param {string} this.settings.federated.url
  
  	@param {object} this.options
  	@param {object} this.options.user - Passed by Main
  	@param {function} this.options.success - Callback after succesful login.
  	@param {boolean} [this.options.modal=false] - Render login form in a modal.
  	@param {boolean} [this.options.requestAccess=false] - Render request access button.
   */

  Login.prototype.initialize = function(settings, options) {
    var _base;
    this.settings = settings;
    this.options = options;
    if ((_base = this.options).modal == null) {
      _base.modal = false;
    }
    this.listenTo(this.options.user, 'basic:authorized', this._handleBasicSuccess);
    return this.render();
  };

  Login.prototype.render = function() {
    var basic, federated, requestAccess;
    if (this.settings.federated != null) {
      federated = new Federated({
        user: this.options.user
      });
      this.$el.append(federated.el);
    }
    if (this.settings.basic != null) {
      basic = new Basic({
        user: this.options.user
      });
      this.$el.append(basic.el);
    }
    if (this.options.requestAccess) {
      requestAccess = new RequestAccess(this.settings);
      this.listenTo(requestAccess, "request-access", (function(_this) {
        return function() {
          return _this.$el.addClass('request-access-active');
        };
      })(this));
      this.listenTo(requestAccess, "request-send", (function(_this) {
        return function() {
          if (_this.options.modal) {
            _this._modal.close();
          }
          return _this.trigger("request-access-complete");
        };
      })(this));
      this.$el.append(requestAccess.el);
    }
    if (this.options.modal) {
      this._modal = new Modal({
        html: this.el,
        cancelAndSubmit: false,
        title: this.options.title,
        width: '400px',
        clickOverlay: false
      });
      this.listenTo(this._modal, 'cancel', (function(_this) {
        return function() {
          return _this.trigger('modal:cancel');
        };
      })(this));
    }
    return this;
  };

  Login.prototype.destroy = function() {
    if (this.options.modal) {
      this._modal.destroy();
    }
    return this.remove();
  };

  Login.prototype._handleBasicSuccess = function(token) {
    if (this.options.modal) {
      this._modal.messageAndFade('success', "Access granted!");
      return this.listenToOnce(this._modal, 'close', (function(_this) {
        return function() {
          if (_this.options.success != null) {
            return _this.options.success();
          }
        };
      })(this));
    } else {
      if (this.options.success != null) {
        return this.options.success();
      }
    }
  };

  return Login;

})(Backbone.View);

module.exports = Login;



},{"./basic":15,"./federated":17,"./request-access":20,"hibb-modal":11}],20:[function(_dereq_,module,exports){
var $, Backbone, RequestAccess, funcky, tpl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = _dereq_('backbone');

$ = _dereq_('jquery');

funcky = _dereq_('funcky.req');

tpl = _dereq_('./index.jade');


/*
@class
 */

RequestAccess = (function(_super) {
  __extends(RequestAccess, _super);

  function RequestAccess() {
    return RequestAccess.__super__.constructor.apply(this, arguments);
  }

  RequestAccess.prototype.className = 'request-access inactive';


  /*
  	@constructs
   */

  RequestAccess.prototype.initialize = function(settings) {
    this.settings = settings;
    return this.render();
  };

  RequestAccess.prototype.render = function() {
    this.$el.append(tpl());
    return this;
  };

  RequestAccess.prototype.events = function() {
    return {
      'click h3': '_handleClick',
      'click button': "_handleSubmit"
    };
  };

  RequestAccess.prototype._handleClick = function(ev) {
    this.$el.removeClass('inactive');
    return this.trigger('request-access');
  };

  RequestAccess.prototype._handleSubmit = function(ev) {
    var data, form, req;
    ev.preventDefault();
    form = this.el.querySelector('form');
    data = JSON.stringify({
      "full-name": form.elements["full-name"].value,
      "email": form.elements["email"].value
    });
    req = funcky.post(this.settings.requestAccessUrl, {
      data: data
    });
    req.done((function(_this) {
      return function() {
        return _this._handleRequestSend();
      };
    })(this));
    return req.fail((function(_this) {
      return function() {
        return console.log('fail!');
      };
    })(this));
  };

  RequestAccess.prototype._handleRequestSend = function() {
    this.$('form').hide();
    this.$('.message').show();
    return setTimeout(((function(_this) {
      return function() {
        return _this.trigger("request-send");
      };
    })(this)), 2000);
  };

  RequestAccess.prototype.destroy = function() {
    return this.remove();
  };

  return RequestAccess;

})(Backbone.View);

module.exports = RequestAccess;



},{"./index.jade":21,"funcky.req":10}],21:[function(_dereq_,module,exports){
var jade = _dereq_("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<h3>Request access</h3><div class=\"message\">Request for access has been send.</div><form><ul><li><input type=\"text\" name=\"full-name\" placeholder=\"Full name\"/></li><li><input type=\"text\" name=\"email\" placeholder=\"Emailaddress\"/></li><li><button>Send request</button></li></ul></form>");;return buf.join("");
};
},{"jade/runtime":12}]},{},[13])
(13)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/home/gijs/Projects/women-writers/node_modules/hibb-modal/dist/index.js":[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.Pagination=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

},{}],2:[function(_dereq_,module,exports){
(function (global){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.jade=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return (Array.isArray(val) ? val.map(joinClasses) :
    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
    [val]).filter(nulls).join(' ');
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};


exports.style = function (val) {
  if (val && typeof val === 'object') {
    return Object.keys(val).map(function (style) {
      return style + ':' + val[style];
    }).join(';');
  } else {
    return val;
  }
};
/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if (key === 'style') {
    val = exports.style(val);
  }
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    if (JSON.stringify(val).indexOf('&') !== -1) {
      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
                   'will be escaped to `&amp;`');
    };
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will eliminate the double quotes around dates in ' +
                   'ISO form after 2.0.0');
    }
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  var result = String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || _dereq_('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

},{"fs":2}],2:[function(_dereq_,module,exports){

},{}]},{},[1])(1)
});
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"fs":1}],3:[function(_dereq_,module,exports){
var $, Backbone, Modal, modalManager, tpl, _,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

Backbone = _dereq_('backbone');

_ = _dereq_('underscore');

$ = _dereq_('jquery');

tpl = _dereq_('./main.jade');

modalManager = _dereq_('./manager');


/*
 * @class
 * @uses ModalManager
 */

Modal = (function(_super) {
  __extends(Modal, _super);

  function Modal() {
    return Modal.__super__.constructor.apply(this, arguments);
  }


  /*
  	 * @property
  	 * @type {String}
   */

  Modal.prototype.className = "hibb-modal";


  /*
  	 * @method
  	 * @return {Object} Default options.
   */

  Modal.prototype.defaultOptions = function() {
    return {
      title: '',
      titleClass: '',
      cancelAndSubmit: true,
      cancelValue: 'Cancel',
      submitValue: 'Submit',
      customClassName: '',
      focusOnFirstInput: true,
      clickOverlay: true
    };
  };


  /*
  	 * @method
  	 * @construct
  	 * @param {Object} [this.options]
  	 * @param {String} [this.options.title=''] Title of the modal.
  	 * @param {String} [this.options.titleClass=''] Deprecated by customClassName?
  	 * @param {String} [this.options.width] Width of the modal in px, %, vw or auto. 
  	 * @param {String} [this.options.height] Height of the modal in px, %, vw or auto.
  	 * @param {String} [this.options.html]
  	 * @param {Boolean} [this.options.cancelAndSubmit=true] Show cancel and submit button.
  	 * @param {String} [this.options.cancelValue='Cancel'] Value for the cancel button.
  	 * @param {String} [this.options.submitValue='Submit'] Value for the submit button.
  	 * @param {String} [this.options.customClassName=''] Add a className to top level to support styling and DOM manipulation. 
  	 * @param {Boolean} [this.options.focusOnFirstInput=true] Set the focus to the first <input> when the modal is shown.
  	 * @param {Boolean} [this.options.clickOverlay=true] If the overlay is clicked, cancel is triggered. Defaults to true.
   */

  Modal.prototype.initialize = function(_at_options) {
    this.options = _at_options != null ? _at_options : {};
    Modal.__super__.initialize.apply(this, arguments);
    this.options = _.extend(this.defaultOptions(), this.options);
    if (this.options.customClassName.length > 0) {
      this.$el.addClass(this.options.customClassName);
    }
    return this.render();
  };


  /*
  	 * @method
   */

  Modal.prototype.render = function() {
    var body, bodyTop, firstInput, marginLeft, offsetTop, rtpl, viewportHeight;
    rtpl = tpl(this.options);
    this.$el.html(rtpl);
    body = this.$('.body');
    if (this.options.html != null) {
      body.html(this.options.html);
    } else {
      body.hide();
    }
    this.$('.body').scroll((function(_this) {
      return function(ev) {
        return ev.stopPropagation();
      };
    })(this));
    modalManager.add(this);
    if (this.options.width != null) {
      this.$('.modalbody').css('width', this.options.width);
      marginLeft = -1 * parseInt(this.options.width, 10) / 2;
      if (this.options.width.slice(-1) === '%') {
        marginLeft += '%';
      }
      if (this.options.width.slice(-2) === 'vw') {
        marginLeft += 'vw';
      }
      if (this.options.width === 'auto') {
        marginLeft = this.$('.modalbody').width() / -2;
      }
      this.$('.modalbody').css('margin-left', marginLeft);
    }
    if (this.options.height != null) {
      this.$('.modalbody').css('height', this.options.height);
    }
    viewportHeight = document.documentElement.clientHeight;
    offsetTop = this.$('.modalbody').outerHeight() / 2;
    bodyTop = this.$('.modalbody').offset().top;
    if (offsetTop > bodyTop) {
      offsetTop = bodyTop - 20;
    }
    this.$('.modalbody').css('margin-top', -1 * offsetTop);
    this.$('.modalbody .body').css('max-height', viewportHeight - 175);
    if (this.options.focusOnFirstInput) {
      firstInput = this.$('input[type="text"]').first();
      if (firstInput.length > 0) {
        firstInput.focus();
      }
    }
    return this;
  };


  /*
  	 * @method
  	 * @return {Object}
   */

  Modal.prototype.events = function() {
    return {
      "click button.submit": '_submit',
      "click button.cancel": "_cancel",
      "click .overlay": function() {
        if (this.options.clickOverlay) {
          return this._cancel();
        }
      },
      "keydown input": function(ev) {
        if (ev.keyCode === 13) {
          ev.preventDefault();
          return this._submit(ev);
        }
      }
    };
  };


  /*
  	 * @method
  	 * @private
   */

  Modal.prototype._submit = function(ev) {
    var target;
    target = $(ev.currentTarget);
    if (!target.hasClass('loader')) {
      target.addClass('loader');
      this.$('button.cancel').hide();
      return this.trigger('submit');
    }
  };


  /*
  	 * @method
  	 * @private
   */

  Modal.prototype._cancel = function(ev) {
    if (ev != null) {
      ev.preventDefault();
    }
    this.trigger('cancel');
    return this.close();
  };


  /*
  	 * @method
   */

  Modal.prototype.close = function() {
    this.trigger('close');
    return modalManager.remove(this);
  };


  /*
  	 * Alias for close.
  	#
  	 * @method
   */

  Modal.prototype.destroy = function() {
    return this.close();
  };


  /*
  	 * @method
   */

  Modal.prototype.fadeOut = function(delay) {
    var speed;
    if (delay == null) {
      delay = 1000;
    }
    speed = delay === 0 ? 0 : 500;
    this.$(".modalbody").delay(delay).fadeOut(speed);
    return setTimeout(((function(_this) {
      return function() {
        return _this.close();
      };
    })(this)), delay + speed - 100);
  };


  /*
  	 * @method
   */

  Modal.prototype.message = function(type, message) {
    if (["success", "warning", "error"].indexOf(type) === -1) {
      return console.error("Unknown message type!");
    }
    this.$("p.message").show();
    return this.$("p.message").html(message).addClass(type);
  };


  /*
  	 * @method
  	 * @param {String} type One of success, warning, error
  	 * @param {String} message
  	 * @param {Delay} [delay] Time to wait before fading
   */

  Modal.prototype.messageAndFade = function(type, message, delay) {
    this.$(".modalbody .body").hide();
    this.$("footer").hide();
    this.message(type, message);
    return this.fadeOut(delay);
  };

  return Modal;

})(Backbone.View);

module.exports = Modal;



},{"./main.jade":4,"./manager":5}],4:[function(_dereq_,module,exports){
var jade = _dereq_("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (cancelAndSubmit, cancelValue, submitValue, title, titleClass) {
buf.push("<div class=\"overlay\"></div><div class=\"modalbody\"><header>");
if ( (title !== ''))
{
buf.push("<h2" + (jade.cls([titleClass], [true])) + ">" + (null == (jade_interp = title) ? "" : jade_interp) + "</h2>");
}
buf.push("<p class=\"message\"></p></header><div class=\"body\"></div>");
if ( (cancelAndSubmit))
{
buf.push("<footer><button class=\"cancel\">" + (jade.escape(null == (jade_interp = cancelValue) ? "" : jade_interp)) + "</button><button class=\"submit\">" + (jade.escape(null == (jade_interp = submitValue) ? "" : jade_interp)) + "</button></footer>");
}
buf.push("</div>");}.call(this,"cancelAndSubmit" in locals_for_with?locals_for_with.cancelAndSubmit:typeof cancelAndSubmit!=="undefined"?cancelAndSubmit:undefined,"cancelValue" in locals_for_with?locals_for_with.cancelValue:typeof cancelValue!=="undefined"?cancelValue:undefined,"submitValue" in locals_for_with?locals_for_with.submitValue:typeof submitValue!=="undefined"?submitValue:undefined,"title" in locals_for_with?locals_for_with.title:typeof title!=="undefined"?title:undefined,"titleClass" in locals_for_with?locals_for_with.titleClass:typeof titleClass!=="undefined"?titleClass:undefined));;return buf.join("");
};
},{"jade/runtime":2}],5:[function(_dereq_,module,exports){
var $, ModalManager;

$ = _dereq_('jquery');


/*
 * @class
 */

ModalManager = (function() {

  /*
  	 * @method
   */
  function ModalManager() {
    this._modals = [];
  }


  /*
  	 * Add a modal (Backbone.View) to modalManager.
  	#
  	 * @method
  	 * @param {Modal} modal
   */

  ModalManager.prototype.add = function(modal) {
    var arrLength, m, _i, _len, _ref;
    _ref = this._modals;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      m = _ref[_i];
      m.$('.overlay').css('opacity', '0.2');
    }
    arrLength = this._modals.push(modal);
    modal.$('.overlay').css('z-index', 10000 + (arrLength * 2) - 1);
    modal.$('.modalbody').css('z-index', 10000 + (arrLength * 2));
    return $('body').prepend(modal.$el);
  };


  /*
  	 * Remove a modal (Backbone.View) to modalManager.
  	 * 
  	 * For now, the modal to be removed is always the last modal. In theory we could call Array.pop(),
  	 * but in the future we might implement a modal drag so underlying modals can be removed first.
  	 * @method
  	 * @param {Modal} modal
   */

  ModalManager.prototype.remove = function(modal) {
    var index;
    index = this._modals.indexOf(modal);
    this._modals.splice(index, 1);
    if (this._modals.length > 0) {
      this._modals[this._modals.length - 1].$('.overlay').css('opacity', '0.7');
    }
    modal.trigger('removed');
    modal.off();
    return modal.remove();
  };

  return ModalManager;

})();

module.exports = new ModalManager();



},{}]},{},[3])
(3)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/node_modules/funcky.util/dist/latest/index.min.js":[function(require,module,exports){
(function(){module.exports={generateID:function(t){var n,r;for(t=null!=t&&t>0?t-1:7,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",r=n.charAt(Math.floor(52*Math.random()));t--;)r+=n.charAt(Math.floor(Math.random()*n.length));return r},setResetTimeout:function(){var t;return t=null,function(n,r,e){return null!=t&&(null!=e&&e(),clearTimeout(t)),t=setTimeout(function(){return t=null,r()},n)}}()}}).call(this);
},{}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/collections/list.options.coffee":[function(require,module,exports){
var Backbone, ListOptions, Models, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

Models = {
  Option: require('../models/facets/list.option.coffee')
};

ListOptions = (function(_super) {
  __extends(ListOptions, _super);

  function ListOptions() {
    return ListOptions.__super__.constructor.apply(this, arguments);
  }

  ListOptions.prototype.model = Models.Option;

  ListOptions.prototype.initialize = function() {
    return this.comparator = this.strategies.amount_desc;
  };

  ListOptions.prototype.revert = function() {
    this.comparator = this.strategies.amount_desc;
    return this.each((function(_this) {
      return function(option) {
        return option.set('checked', false, {
          silent: true
        });
      };
    })(this));
  };

  ListOptions.prototype.updateOptions = function(newOptions) {
    if (newOptions == null) {
      newOptions = [];
    }
    this.each((function(_this) {
      return function(option) {
        return option.set('count', 0, {
          silent: true
        });
      };
    })(this));
    _.each(newOptions, (function(_this) {
      return function(newOption) {
        var opt;
        opt = _this.get(newOption.name);
        if (opt != null) {
          return opt.set('count', newOption.count, {
            silent: true
          });
        } else {
          opt = new Models.Option(newOption);
          return _this.add(opt);
        }
      };
    })(this));
    return this.sort();
  };

  ListOptions.prototype.strategies = {
    alpha_asc: function(model) {
      return +(!model.get('visible')) + (+(!model.get('count')) + model.get('name'));
    },
    alpha_desc: function(model) {
      var str;
      str = String.fromCharCode.apply(String, _.map(model.get('name').split(''), function(c) {
        return 0xffff - c.charCodeAt();
      }));
      return +(!model.get('visible')) + (+(!model.get('count')) + str);
    },
    amount_asc: function(model) {
      var cnt, tmp;
      tmp = model.get('visible') ? 0 : 10;
      tmp += +(!model.get('count'));
      cnt = model.get('count') === 0 ? model.get('total') : model.get('count');
      return tmp -= 1 / cnt;
    },
    amount_desc: function(model) {
      var cnt, tmp;
      tmp = model.get('visible') ? 0 : 10;
      tmp += +(!model.get('count'));
      cnt = model.get('count') === 0 ? model.get('total') : model.get('count');
      return tmp += 1 / cnt;
    }
  };

  ListOptions.prototype.orderBy = function(strategy) {
    this.comparator = this.strategies[strategy];
    return this.sort();
  };

  ListOptions.prototype.setAllVisible = function() {
    this.each(function(model) {
      return model.set('visible', true);
    });
    return this.sort();
  };

  return ListOptions;

})(Backbone.Collection);

module.exports = ListOptions;



},{"../models/facets/list.option.coffee":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/models/facets/list.option.coffee","backbone":false,"underscore":false}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/collections/searchresults.coffee":[function(require,module,exports){
var Backbone, SearchResult, SearchResults, funcky, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

SearchResult = require('../models/searchresult');

funcky = require('funcky.req');

SearchResults = (function(_super) {
  __extends(SearchResults, _super);

  function SearchResults() {
    return SearchResults.__super__.constructor.apply(this, arguments);
  }

  SearchResults.prototype.model = SearchResult;

  SearchResults.prototype.initialize = function(options) {
    this.config = options.config;
    this.cachedModels = {};
    this.queryAmount = 0;
    return this.on('add', this.setCurrent, this);
  };

  SearchResults.prototype.clearCache = function() {
    return this.cachedModels = {};
  };

  SearchResults.prototype.setCurrent = function(current) {
    var changeMessage, _ref;
    this.current = current;
    changeMessage = ((_ref = this.current.options) != null ? _ref.url : void 0) != null ? 'change:cursor' : 'change:results';
    return this.trigger(changeMessage, this.current);
  };

  SearchResults.prototype.runQuery = function(queryOptions, options) {
    var queryOptionsString, resultRows;
    if (options == null) {
      options = {};
    }
    if (options.cache == null) {
      options.cache = true;
    }
    this.queryAmount = this.queryAmount + 1;
    if (queryOptions.hasOwnProperty('resultRows')) {
      resultRows = queryOptions.resultRows;
      delete queryOptions.resultRows;
    }
    queryOptionsString = JSON.stringify(queryOptions);
    if (options.cache && this.cachedModels.hasOwnProperty(queryOptionsString)) {
      return this.setCurrent(this.cachedModels[queryOptionsString]);
    } else {
      return this.postQuery(queryOptions, (function(_this) {
        return function(url) {
          return _this.getResults(url, function(response) {
            return _this.addModel(response, queryOptionsString);
          });
        };
      })(this));
    }
  };

  SearchResults.prototype.addModel = function(attrs, cacheId) {
    this.cachedModels[cacheId] = new this.model(attrs);
    return this.add(this.cachedModels[cacheId]);
  };

  SearchResults.prototype.moveCursor = function(direction) {
    var url;
    url = direction === '_prev' || direction === '_next' ? this.current.get(direction) : direction;
    if (url != null) {
      if (this.cachedModels.hasOwnProperty(url)) {
        return this.setCurrent(this.cachedModels[url]);
      } else {
        return this.getResults(url, (function(_this) {
          return function(response) {
            return _this.addModel(response, url);
          };
        })(this));
      }
    }
  };

  SearchResults.prototype.page = function(pagenumber, database) {
    var start, url;
    start = this.config.get('resultRows') * (pagenumber - 1);
    url = this.postURL + ("?rows=" + (this.config.get('resultRows')) + "&start=" + start);
    if (database != null) {
      url += "&database=" + database;
    }
    return this.getResults(url, (function(_this) {
      return function(attrs) {
        return _this.trigger('change:page', new _this.model(attrs), database);
      };
    })(this));
  };

  SearchResults.prototype.postQuery = function(queryOptions, done) {
    var ajaxOptions, req;
    this.trigger('request');
    ajaxOptions = {
      data: JSON.stringify(queryOptions)
    };
    if (this.config.has('requestOptions')) {
      _.extend(ajaxOptions, this.config.get('requestOptions'));
    }
    req = funcky.post(this.config.get('baseUrl') + this.config.get('searchPath'), ajaxOptions);
    req.done((function(_this) {
      return function(res) {
        var url;
        if (res.status === 201) {
          _this.postURL = res.getResponseHeader('Location');
          url = _this.config.has('resultRows') ? _this.postURL + '?rows=' + _this.config.get('resultRows') : _this.postURL;
          return done(url);
        }
      };
    })(this));
    return req.fail((function(_this) {
      return function(res) {
        if (res.status === 401) {
          return _this.trigger('unauthorized');
        } else {
          _this.trigger('request:failed', res);
          throw new Error('Failed posting FacetedSearch queryOptions to the server!', res);
        }
      };
    })(this));
  };

  SearchResults.prototype.getResults = function(url, done) {
    var req;
    this.trigger('request');
    req = funcky.get(url);
    req.done((function(_this) {
      return function(res) {
        done(JSON.parse(res.responseText));
        return _this.trigger('sync');
      };
    })(this));
    return req.fail((function(_this) {
      return function(res) {
        if (res.status === 401) {
          return _this.trigger('unauthorized');
        } else {
          _this.trigger('request:failed', res);
          throw new Error('Failed getting FacetedSearch results from the server!', res);
        }
      };
    })(this));
  };

  return SearchResults;

})(Backbone.Collection);

module.exports = SearchResults;



},{"../models/searchresult":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/models/searchresult.coffee","backbone":false,"funcky.req":"/usr/local/lib/node_modules/funcky.req/dist/main.js","underscore":false}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/config.coffee":[function(require,module,exports){
var Backbone, Config,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

Config = (function(_super) {
  __extends(Config, _super);

  function Config() {
    return Config.__super__.constructor.apply(this, arguments);
  }

  Config.prototype.defaults = function() {
    return {
      resultRows: null,
      baseUrl: '',
      searchPath: '',
      textSearch: 'advanced',
      token: null,
      queryOptions: {},
      facetTitleMap: {},
      templates: {},
      autoSearch: true
    };
  };

  return Config;

})(Backbone.Model);

module.exports = Config;



},{"backbone":false}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/main.coffee":[function(require,module,exports){
var $, Backbone, Config, MainView, QueryOptions, SearchResults, Views, funcky, tpl, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

$ = require('jquery');

Backbone.$ = $;

_ = require('underscore');

funcky = require('funcky.el').el;

Config = require('./config');

QueryOptions = require('./models/query-options');

SearchResults = require('./collections/searchresults');

Views = {
  TextSearch: require('./views/text-search'),
  Facets: require('./views/facets')
};

tpl = require('../jade/main.jade');

MainView = (function(_super) {
  __extends(MainView, _super);

  function MainView() {
    return MainView.__super__.constructor.apply(this, arguments);
  }

  MainView.prototype.initialize = function(options) {
    if (options == null) {
      options = {};
    }
    if (options.facetViewMap != null) {
      this.facetViewMap = _.clone(options.facetViewMap);
      delete options.facetViewMap;
    }
    this.extendConfig(options);
    this.initQueryOptions();
    this.initSearchResults();
    this.render();
    if (this.config.get('development')) {
      this.searchResults.add(JSON.parse(localStorage.getItem('faceted-search-dev-model')));
      this.searchResults.cachedModels['{"facetValues":[],"sortParameters":[]}'] = this.searchResults.first();
      return setTimeout(((function(_this) {
        return function() {
          return _this.$('.overlay').hide();
        };
      })(this)), 100);
    }
  };

  MainView.prototype.render = function() {
    if (this.config.get('templates').hasOwnProperty('main')) {
      tpl = this.config.get('templates').main;
    }
    this.el.innerHTML = tpl();
    this.$('.faceted-search').addClass("search-type-" + (this.config.get('textSearch')));
    this.initFacets(this.facetViewMap);
    return this;
  };

  MainView.prototype.renderTextSearch = function() {
    var textSearchPlaceholder;
    this.textSearch = new Views.TextSearch({
      config: this.config,
      fields: this.searchResults.current.get('fullTextSearchFields')
    });
    textSearchPlaceholder = this.el.querySelector('.text-search-placeholder');
    if (textSearchPlaceholder != null) {
      textSearchPlaceholder.parentNode.replaceChild(this.textSearch.el, textSearchPlaceholder);
    }
    this.listenTo(this.textSearch, 'change', (function(_this) {
      return function(queryOptions) {
        return _this.queryOptions.set(queryOptions, {
          silent: true
        });
      };
    })(this));
    return this.listenTo(this.textSearch, 'search', (function(_this) {
      return function() {
        return _this.search();
      };
    })(this));
  };

  MainView.prototype.events = function() {
    return {
      'click ul.facets-menu li.collapse-expand': function(ev) {
        return this.facets.toggle(ev);
      },
      'click ul.facets-menu li.reset': 'onReset',
      'click ul.facets-menu li.switch button': 'onSwitchType'
    };
  };

  MainView.prototype.onSwitchType = function(ev) {
    var textSearch;
    ev.preventDefault();
    textSearch = this.config.get('textSearch') === 'advanced' ? 'simple' : 'advanced';
    this.config.set({
      textSearch: textSearch
    });
    this.$('.faceted-search').toggleClass('search-type-simple');
    this.$('.faceted-search').toggleClass('search-type-advanced');
    if (this.searchResults.queryAmount === 1) {
      return this.search();
    } else if (this.searchResults.queryAmount > 1) {
      return this.update();
    }
  };

  MainView.prototype.onReset = function(ev) {
    ev.preventDefault();
    return this.reset();
  };

  MainView.prototype.destroy = function() {
    if (this.facets != null) {
      this.facets.destroy();
    }
    if (this.textSearch != null) {
      this.textSearch.destroy();
    }
    return this.remove();
  };

  MainView.prototype.extendConfig = function(options) {
    var ftm;
    ftm = options.facetTitleMap;
    delete options.facetTitleMap;
    this.config = new Config(options);
    this.config.set({
      facetTitleMap: _.extend(this.config.get('facetTitleMap'), ftm)
    });
    if (['none', 'simple', 'advanced'].indexOf(this.config.get('textSearch')) === -1) {
      return this.config.set({
        textSearch: 'advanced'
      });
    }
  };

  MainView.prototype.initQueryOptions = function() {
    var attrs;
    attrs = _.extend(this.config.get('queryOptions'), this.config.get('textSearchOptions'));
    this.queryOptions = new QueryOptions(attrs);
    this.listenTo(this.queryOptions, 'change', (function(_this) {
      return function() {
        return _this.trigger('change:queryoptions', _this.queryOptions);
      };
    })(this));
    if (this.config.get('autoSearch')) {
      return this.listenTo(this.queryOptions, 'change', (function(_this) {
        return function() {
          return _this.search();
        };
      })(this));
    }
  };

  MainView.prototype.initSearchResults = function() {
    this.searchResults = new SearchResults({
      config: this.config
    });
    this.listenTo(this.searchResults, 'change:results', (function(_this) {
      return function(responseModel) {
        if (_this.config.get('textSearch') !== 'simple') {
          _this.update();
        }
        return _this.trigger('change:results', responseModel);
      };
    })(this));
    this.listenTo(this.searchResults, 'change:cursor', (function(_this) {
      return function(responseModel) {
        return _this.trigger('change:results', responseModel);
      };
    })(this));
    this.listenTo(this.searchResults, 'change:page', (function(_this) {
      return function(responseModel, database) {
        return _this.trigger('change:page', responseModel, database);
      };
    })(this));
    this.listenTo(this.searchResults, 'request', (function(_this) {
      return function() {
        return _this.showLoader();
      };
    })(this));
    this.listenTo(this.searchResults, 'sync', (function(_this) {
      return function() {
        return _this.hideLoader();
      };
    })(this));
    this.listenTo(this.searchResults, 'unauthorized', (function(_this) {
      return function() {
        return _this.trigger('unauthorized');
      };
    })(this));
    return this.listenTo(this.searchResults, 'request:failed', (function(_this) {
      return function(res) {
        return _this.trigger('request:failed', res);
      };
    })(this));
  };

  MainView.prototype.initFacets = function(viewMap) {
    var facetsPlaceholder;
    if (viewMap == null) {
      viewMap = {};
    }
    this.facets = new Views.Facets({
      viewMap: viewMap,
      config: this.config
    });
    facetsPlaceholder = this.el.querySelector('.facets-placeholder');
    facetsPlaceholder.parentNode.replaceChild(this.facets.el, facetsPlaceholder);
    return this.listenTo(this.facets, 'change', (function(_this) {
      return function(queryOptions, options) {
        return _this.queryOptions.set(queryOptions, options);
      };
    })(this));
  };

  MainView.prototype.showLoader = function() {
    var facetedSearch, fsBox, left, loader, overlay, top;
    overlay = this.el.querySelector('.overlay');
    if (overlay.style.display === 'block') {
      return false;
    }
    loader = overlay.children[0];
    facetedSearch = this.el.querySelector('.faceted-search');
    fsBox = funcky(facetedSearch).boundingBox();
    if (fsBox.width === 0) {
      fsBox.width = 300;
    }
    if (fsBox.height === 0) {
      fsBox.height = 100;
    }
    overlay.style.width = fsBox.width + 'px';
    overlay.style.height = fsBox.height + 'px';
    overlay.style.display = 'block';
    left = fsBox.left + fsBox.width / 2 - 12;
    loader.style.left = left + 'px';
    top = fsBox.top + fsBox.height / 2 - 12;
    if (fsBox.height > window.innerHeight) {
      top = '50vh';
    }
    return loader.style.top = top + 'px';
  };

  MainView.prototype.hideLoader = function() {
    return this.el.querySelector('.overlay').style.display = 'none';
  };

  MainView.prototype.update = function() {
    var facets;
    facets = this.searchResults.current.get('facets');
    if (this.searchResults.queryAmount === 1) {
      this.renderTextSearch();
      return this.facets.renderFacets(facets);
    } else if (this.searchResults.queryAmount > 1) {
      return this.facets.update(facets);
    }
  };

  MainView.prototype.page = function(pagenumber, database) {
    return this.searchResults.page(pagenumber, database);
  };

  MainView.prototype.next = function() {
    return this.searchResults.moveCursor('_next');
  };

  MainView.prototype.prev = function() {
    return this.searchResults.moveCursor('_prev');
  };

  MainView.prototype.hasNext = function() {
    return this.searchResults.current.has('_next');
  };

  MainView.prototype.hasPrev = function() {
    return this.searchResults.current.has('_prev');
  };

  MainView.prototype.sortResultsBy = function(field) {
    return this.queryOptions.set({
      sortParameters: [
        {
          fieldname: field,
          direction: 'asc'
        }
      ]
    });
  };

  MainView.prototype.reset = function(cache) {
    if (cache == null) {
      cache = false;
    }
    if (this.textSearch != null) {
      this.textSearch.reset();
    }
    this.facets.reset();
    this.queryOptions.reset();
    if (!cache) {
      this.searchResults.clearCache();
    }
    return this.search({
      cache: cache
    });
  };

  MainView.prototype.getSearchResultURL = function() {
    return this.searchResults.postURL;
  };

  MainView.prototype.xlsUrl = function() {
    return this.getSearchResultURL() + "/xls";
  };

  MainView.prototype.csvUrl = function() {
    return this.getSearchResultURL() + "/csv";
  };

  MainView.prototype.search = function() {
    return this.searchResults.runQuery(this.queryOptions.attributes);
  };

  return MainView;

})(Backbone.View);

module.exports = MainView;



},{"../jade/main.jade":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/jade/main.jade","./collections/searchresults":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/collections/searchresults.coffee","./config":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/config.coffee","./models/query-options":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/models/query-options.coffee","./views/facets":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/views/facets.coffee","./views/text-search":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/views/text-search.coffee","backbone":false,"funcky.el":"/usr/local/lib/node_modules/funcky.el/dist/index.js","jquery":false,"underscore":false}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/models/facets/boolean.coffee":[function(require,module,exports){
var BooleanFacet, Models,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Models = {
  Facet: require('./main')
};

BooleanFacet = (function(_super) {
  __extends(BooleanFacet, _super);

  function BooleanFacet() {
    return BooleanFacet.__super__.constructor.apply(this, arguments);
  }

  BooleanFacet.prototype.set = function(attrs, options) {
    if (attrs === 'options') {
      options = this.parseOptions(options);
    } else if (attrs.hasOwnProperty('options')) {
      attrs.options = this.parseOptions(attrs.options);
    }
    return BooleanFacet.__super__.set.call(this, attrs, options);
  };

  BooleanFacet.prototype.parseOptions = function(options) {
    var _ref;
    options = (_ref = this.get('options')) != null ? _ref : options;
    if (options.length === 1) {
      options.push({
        name: (!JSON.parse(options[0].name)).toString(),
        count: 0
      });
    }
    return options;
  };

  return BooleanFacet;

})(Models.Facet);

module.exports = BooleanFacet;



},{"./main":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/models/facets/main.coffee"}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/models/facets/date.coffee":[function(require,module,exports){




},{}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/models/facets/list.coffee":[function(require,module,exports){
var List, Models,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Models = {
  Facet: require('./main')
};

List = (function(_super) {
  __extends(List, _super);

  function List() {
    return List.__super__.constructor.apply(this, arguments);
  }

  return List;

})(Models.Facet);

module.exports = List;



},{"./main":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/models/facets/main.coffee"}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/models/facets/list.option.coffee":[function(require,module,exports){
var Backbone, ListOption,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

ListOption = (function(_super) {
  __extends(ListOption, _super);

  function ListOption() {
    return ListOption.__super__.constructor.apply(this, arguments);
  }

  ListOption.prototype.idAttribute = 'name';

  ListOption.prototype.defaults = function() {
    return {
      name: '',
      count: 0,
      total: 0,
      checked: false,
      visible: false
    };
  };

  ListOption.prototype.parse = function(attrs) {
    attrs.total = attrs.count;
    return attrs;
  };

  return ListOption;

})(Backbone.Model);

module.exports = ListOption;



},{"backbone":false}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/models/facets/main.coffee":[function(require,module,exports){
var Backbone, Facet, config,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

config = require('../../config');

Facet = (function(_super) {
  __extends(Facet, _super);

  function Facet() {
    return Facet.__super__.constructor.apply(this, arguments);
  }

  Facet.prototype.idAttribute = 'name';

  Facet.prototype.defaults = function() {
    return {
      name: null,
      title: null,
      type: null,
      options: null
    };
  };

  return Facet;

})(Backbone.Model);

module.exports = Facet;



},{"../../config":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/config.coffee","backbone":false}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/models/facets/range.coffee":[function(require,module,exports){
var FacetModel, RangeFacet, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

FacetModel = require('./main');

_ = require('underscore');

RangeFacet = (function(_super) {
  __extends(RangeFacet, _super);

  function RangeFacet() {
    return RangeFacet.__super__.constructor.apply(this, arguments);
  }

  RangeFacet.prototype.defaults = function() {
    return _.extend({}, RangeFacet.__super__.defaults.apply(this, arguments), {
      min: null,
      max: null,
      currentMin: null,
      currentMax: null
    });
  };

  RangeFacet.prototype.set = function(attrs, options) {
    if (attrs.hasOwnProperty('currentMin')) {
      if (attrs.currentMin > this.get('currentMax')) {
        attrs.currentMax = +attrs.currentMin;
        attrs.currentMin = this.get('currentMax');
      }
    }
    if (attrs.hasOwnProperty('currentMax')) {
      if (attrs.currentMax < this.get('currentMin')) {
        attrs.currentMin = +attrs.currentMax;
        attrs.currentMax = this.get('currentMin');
      }
    }
    if (attrs.hasOwnProperty('currentMin') && attrs.currentMin < this.get('min')) {
      attrs.currentMin = this.get('min');
    }
    if (attrs.hasOwnProperty('currentMax') && attrs.currentMax > this.get('max')) {
      attrs.currentMax = this.get('max');
    }
    return RangeFacet.__super__.set.apply(this, arguments);
  };

  RangeFacet.prototype.parse = function(attrs) {
    RangeFacet.__super__.parse.apply(this, arguments);
    attrs.options = {
      lowerLimit: +((attrs.options[0].lowerLimit + '').substr(0, 4)),
      upperLimit: +((attrs.options[0].upperLimit + '').substr(0, 4))
    };
    attrs.min = attrs.currentMin = attrs.options.lowerLimit;
    attrs.max = attrs.currentMax = attrs.options.upperLimit;
    return attrs;
  };

  return RangeFacet;

})(FacetModel);

module.exports = RangeFacet;



},{"./main":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/models/facets/main.coffee","underscore":false}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/models/query-options.coffee":[function(require,module,exports){
var Backbone, QueryOptions, config, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

config = require('../config');

QueryOptions = (function(_super) {
  __extends(QueryOptions, _super);

  function QueryOptions() {
    return QueryOptions.__super__.constructor.apply(this, arguments);
  }

  QueryOptions.prototype.defaults = function() {
    return {
      facetValues: [],
      sortParameters: []
    };
  };

  QueryOptions.prototype.initialize = function(initialAttributes, options) {
    this.initialAttributes = initialAttributes;
  };

  QueryOptions.prototype.set = function(attrs, options) {
    var facetValues;
    if (attrs.facetValue != null) {
      facetValues = _.reject(this.get('facetValues'), function(data) {
        return data.name === attrs.facetValue.name;
      });
      if (attrs.facetValue.values != null) {
        if (attrs.facetValue.values.length > 0) {
          facetValues.push(attrs.facetValue);
        }
      } else {
        facetValues.push(attrs.facetValue);
      }
      attrs.facetValues = facetValues;
      delete attrs.facetValue;
    }
    return QueryOptions.__super__.set.call(this, attrs, options);
  };

  QueryOptions.prototype.reset = function() {
    this.clear({
      silent: true
    });
    this.set(this.defaults(), {
      silent: true
    });
    return this.set(this.initialAttributes, {
      silent: true
    });
  };

  return QueryOptions;

})(Backbone.Model);

module.exports = QueryOptions;



},{"../config":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/config.coffee","backbone":false,"underscore":false}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/models/search.coffee":[function(require,module,exports){
var Backbone, Search, escapeTerm, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

escapeTerm = function(term) {
  var char, escaped, regex, special, _i, _len;
  special = '\\ + - & | ! ( ) { } [ ] ^ " ~ * ? :'.split(/\s+/);
  escaped = term;
  for (_i = 0, _len = special.length; _i < _len; _i++) {
    char = special[_i];
    if (!(char)) {
      continue;
    }
    regex = '\\' + char;
    console.log("Replacing " + char, RegExp("" + regex, "g"));
    escaped = escaped.replace(RegExp("" + regex, "g"), '\\' + char);
  }
  console.log(escaped);
  return escaped;
};

Search = (function(_super) {
  __extends(Search, _super);

  function Search() {
    return Search.__super__.constructor.apply(this, arguments);
  }

  Search.prototype.defaults = function() {
    return {};
  };

  Search.prototype.queryData = function() {
    var attrs, data, key, value;
    attrs = _.extend({}, this.attributes);
    data = (function() {
      var _results;
      _results = [];
      for (key in attrs) {
        value = attrs[key];
        _results.push({
          name: key,
          term: "*" + (escapeTerm(value)) + "*"
        });
      }
      return _results;
    })();
    return {
      fullTextSearchParameters: data
    };
  };

  return Search;

})(Backbone.Model);

module.exports = Search;



},{"backbone":false,"underscore":false}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/models/searchresult.coffee":[function(require,module,exports){
var Backbone, SearchResult, config, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

config = require('../config');

SearchResult = (function(_super) {
  __extends(SearchResult, _super);

  function SearchResult() {
    return SearchResult.__super__.constructor.apply(this, arguments);
  }

  SearchResult.prototype.defaults = function() {
    return {
      _next: null,
      _prev: null,
      ids: [],
      numFound: null,
      results: [],
      rows: null,
      solrquery: '',
      sortableFields: [],
      start: null,
      term: ''
    };
  };

  return SearchResult;

})(Backbone.Model);

module.exports = SearchResult;



},{"../config":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/config.coffee","backbone":false,"underscore":false}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/views/facets.coffee":[function(require,module,exports){
var Backbone, Facets, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

Facets = (function(_super) {
  __extends(Facets, _super);

  function Facets() {
    this.renderFacet = __bind(this.renderFacet, this);
    return Facets.__super__.constructor.apply(this, arguments);
  }

  Facets.prototype.className = 'facets';

  Facets.prototype.viewMap = {
    BOOLEAN: require('./facets/boolean'),
    DATE: require('./facets/date'),
    RANGE: require('./facets/range'),
    LIST: require('./facets/list')
  };

  Facets.prototype.initialize = function(options) {
    _.extend(this.viewMap, options.viewMap);
    this.config = options.config;
    this.views = {};
    return this.render();
  };

  Facets.prototype.render = function() {
    if (this.config.get('templates').hasOwnProperty('facets')) {
      this.el.innerHTML = this.config.get('templates').facets();
    }
    return this;
  };

  Facets.prototype.renderFacets = function(data) {
    var facetData, fragment, index, placeholder, _i, _len;
    this.destroyFacets();
    if (this.config.get('templates').hasOwnProperty('facets')) {
      for (index = _i = 0, _len = data.length; _i < _len; index = ++_i) {
        facetData = data[index];
        if (this.viewMap.hasOwnProperty(facetData.type)) {
          placeholder = this.el.querySelector("." + facetData.name + "-placeholder");
          if (placeholder == null) {
            placeholder = this.el.querySelector("[data-name=" + facetData.name + "]");
          }
          if (placeholder != null) {
            placeholder.parentNode.replaceChild(this.renderFacet(facetData).el, placeholder);
          }
        }
      }
    } else {
      fragment = document.createDocumentFragment();
      for (index in data) {
        if (!__hasProp.call(data, index)) continue;
        facetData = data[index];
        if (this.viewMap.hasOwnProperty(facetData.type)) {
          fragment.appendChild(this.renderFacet(facetData).el);
          fragment.appendChild(document.createElement('hr'));
        } else {
          console.error('Unknown facetView', facetData.type);
        }
      }
      this.el.innerHTML = '';
      this.el.appendChild(fragment);
    }
    return this;
  };

  Facets.prototype.renderFacet = function(facetData) {
    var View, _ref;
    if (_.isString(facetData)) {
      facetData = _.findWhere(this.searchResults.first().get('facets'), {
        name: facetData
      });
    }
    if (((_ref = this.config.facetTitleMap) != null ? _ref[facetData.name] : void 0) != null) {
      facetData.title = this.config.facetTitleMap[facetData.name];
    }
    if (this.config.get('startCollapsed')) {
      facetData.collapsed = true;
    }
    View = this.viewMap[facetData.type];
    this.views[facetData.name] = new View({
      attrs: facetData,
      config: this.config
    });
    this.listenTo(this.views[facetData.name], 'change', (function(_this) {
      return function(queryOptions, options) {
        if (options == null) {
          options = {};
        }
        return _this.trigger('change', queryOptions, options);
      };
    })(this));
    return this.views[facetData.name];
  };

  Facets.prototype.update = function(facetData) {
    var data, options, view, viewName, _ref, _results;
    _ref = this.views;
    _results = [];
    for (viewName in _ref) {
      if (!__hasProp.call(_ref, viewName)) continue;
      view = _ref[viewName];
      data = _.findWhere(facetData, {
        name: viewName
      });
      options = data != null ? data.options : [];
      _results.push(view.update(options));
    }
    return _results;
  };

  Facets.prototype.reset = function() {
    var facetView, key, _ref, _results;
    _ref = this.views;
    _results = [];
    for (key in _ref) {
      if (!__hasProp.call(_ref, key)) continue;
      facetView = _ref[key];
      if (typeof facetView.reset === 'function') {
        _results.push(facetView.reset());
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Facets.prototype.destroyFacets = function() {
    var view, viewName, _ref;
    this.stopListening();
    _ref = this.views;
    for (viewName in _ref) {
      if (!__hasProp.call(_ref, viewName)) continue;
      view = _ref[viewName];
      view.destroy();
      delete this.views[viewName];
    }
    return this.render();
  };

  Facets.prototype.destroy = function() {
    this.destroyFacets();
    return this.remove();
  };

  Facets.prototype.toggle = function(ev) {
    var $, facetNames, icon, index, open, slideFacet, span, text, _ref;
    ev.preventDefault();
    $ = Backbone.$;
    icon = $(ev.currentTarget).find('i.fa');
    span = $(ev.currentTarget).find('span');
    open = icon.hasClass('fa-expand');
    icon.toggleClass('fa-compress');
    icon.toggleClass('fa-expand');
    text = open ? 'Collapse' : 'Expand';
    span.text("" + text + " facets");
    facetNames = (_ref = this.config.facets) != null ? _ref : _.keys(this.views);
    index = 0;
    slideFacet = (function(_this) {
      return function() {
        var facet, facetName;
        facetName = facetNames[index++];
        facet = _this.views[facetName];
        if (facet != null) {
          if (open) {
            return facet.showBody(function() {
              return slideFacet();
            });
          } else {
            return facet.hideBody(function() {
              return slideFacet();
            });
          }
        }
      };
    })(this);
    return slideFacet();
  };

  return Facets;

})(Backbone.View);

module.exports = Facets;



},{"./facets/boolean":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/views/facets/boolean.coffee","./facets/date":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/views/facets/date.coffee","./facets/list":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/views/facets/list.coffee","./facets/range":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/views/facets/range.coffee","backbone":false,"underscore":false}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/views/facets/boolean.coffee":[function(require,module,exports){
var $, BooleanFacet, Models, Views, bodyTpl, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

$ = require('jquery');

_ = require('underscore');

Models = {
  Boolean: require('../../models/facets/boolean')
};

Views = {
  Facet: require('./main')
};

bodyTpl = require('../../../jade/facets/boolean.body.jade');

BooleanFacet = (function(_super) {
  __extends(BooleanFacet, _super);

  function BooleanFacet() {
    return BooleanFacet.__super__.constructor.apply(this, arguments);
  }

  BooleanFacet.prototype.className = 'facet boolean';

  BooleanFacet.prototype.initialize = function(options) {
    BooleanFacet.__super__.initialize.apply(this, arguments);
    this.model = new Models.Boolean(options.attrs, {
      parse: true
    });
    this.listenTo(this.model, 'change:options', this.render);
    return this.render();
  };

  BooleanFacet.prototype.render = function() {
    var rtpl;
    BooleanFacet.__super__.render.apply(this, arguments);
    rtpl = bodyTpl(_.extend(this.model.attributes, {
      ucfirst: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
    }));
    this.$('.body').html(rtpl);
    this.$('header i.fa').remove();
    return this;
  };

  BooleanFacet.prototype.events = function() {
    return _.extend({}, BooleanFacet.__super__.events.apply(this, arguments), {
      'click i': 'checkChanged',
      'click label': 'checkChanged'
    });
  };

  BooleanFacet.prototype.checkChanged = function(ev) {
    var $target, option, value, _i, _len, _ref;
    $target = ev.currentTarget.tagName === 'LABEL' ? this.$('i[data-value="' + ev.currentTarget.getAttribute('data-value') + '"]') : $(ev.currentTarget);
    $target.toggleClass('fa-square-o');
    $target.toggleClass('fa-check-square-o');
    value = $target.attr('data-value');
    _ref = this.model.get('options');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      option = _ref[_i];
      if (option.name === value) {
        option.checked = $target.hasClass('fa-check-square-o');
      }
    }
    return this.trigger('change', {
      facetValue: {
        name: this.model.get('name'),
        values: _.map(this.$('i.fa-check-square-o'), function(cb) {
          return cb.getAttribute('data-value');
        })
      }
    });
  };

  BooleanFacet.prototype.update = function(newOptions) {
    return this.model.set('options', newOptions);
  };

  BooleanFacet.prototype.reset = function() {
    return this.render();
  };

  return BooleanFacet;

})(Views.Facet);

module.exports = BooleanFacet;



},{"../../../jade/facets/boolean.body.jade":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/jade/facets/boolean.body.jade","../../models/facets/boolean":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/models/facets/boolean.coffee","./main":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/views/facets/main.coffee","jquery":false,"underscore":false}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/views/facets/date.coffee":[function(require,module,exports){
var DateFacet, Models, Views, tpl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Models = {
  Date: require('../../models/facets/date')
};

Views = {
  Facet: require('./main')
};

tpl = require('../../../jade/facets/date.jade');

DateFacet = (function(_super) {
  __extends(DateFacet, _super);

  function DateFacet() {
    return DateFacet.__super__.constructor.apply(this, arguments);
  }

  DateFacet.prototype.className = 'facet date';

  DateFacet.prototype.initialize = function(options) {
    DateFacet.__super__.initialize.apply(this, arguments);
    this.model = new Models.Date(options.attrs, {
      parse: true
    });
    this.listenTo(this.model, 'change:options', this.render);
    return this.render();
  };

  DateFacet.prototype.render = function() {
    var rtpl;
    DateFacet.__super__.render.apply(this, arguments);
    rtpl = tpl(_.extend(this.model.attributes, {
      ucfirst: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
    }));
    this.$('.placeholder').html(rtpl);
    return this;
  };

  DateFacet.prototype.update = function(newOptions) {};

  DateFacet.prototype.reset = function() {};

  return DateFacet;

})(Views.Facet);

module.exports = DateFacet;



},{"../../../jade/facets/date.jade":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/jade/facets/date.jade","../../models/facets/date":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/models/facets/date.coffee","./main":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/views/facets/main.coffee"}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/views/facets/list.coffee":[function(require,module,exports){
var $, Collections, ListFacet, Models, Views, menuTpl, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

$ = require('jquery');

_ = require('underscore');

Models = {
  List: require('../../models/facets/list')
};

Collections = {
  Options: require('../../collections/list.options')
};

Views = {
  Facet: require('./main'),
  Options: require('./list.options')
};

menuTpl = require('../../../jade/facets/list.menu.jade');

ListFacet = (function(_super) {
  __extends(ListFacet, _super);

  function ListFacet() {
    return ListFacet.__super__.constructor.apply(this, arguments);
  }

  ListFacet.prototype.className = 'facet list';

  ListFacet.prototype.initialize = function(options) {
    ListFacet.__super__.initialize.apply(this, arguments);
    this.config = options.config;
    this.model = new Models.List(options.attrs, {
      parse: true
    });
    this.collection = new Collections.Options(options.attrs.options, {
      parse: true
    });
    return this.render();
  };

  ListFacet.prototype.render = function() {
    var menu;
    ListFacet.__super__.render.apply(this, arguments);
    if (this.$('header .options').length > 0) {
      if (this.config.get('templates').hasOwnProperty('list.menu')) {
        menuTpl = this.config.get('templates')['list.menu'];
      }
      menu = menuTpl({
        model: this.model.attributes
      });
      this.$('header .options').html(menu);
    }
    this.optionsView = new Views.Options({
      collection: this.collection,
      facetName: this.model.get('name'),
      config: this.config
    });
    this.$('.body').html(this.optionsView.el);
    this.listenTo(this.optionsView, 'filter:finished', this.renderFilteredOptionCount);
    this.listenTo(this.optionsView, 'change', (function(_this) {
      return function(data) {
        return _this.trigger('change', data);
      };
    })(this));
    if (this.collection.length <= 3) {
      this.$('header i.openclose').hide();
    }
    return this;
  };

  ListFacet.prototype.renderFilteredOptionCount = function() {
    var filteredModels, value, visibleModels, _ref;
    visibleModels = this.collection.filter(function(model) {
      return model.get('visible');
    });
    value = (0 < (_ref = visibleModels.length) && _ref < 21) ? 'visible' : 'hidden';
    this.$('input[type="checkbox"][name="all"]').css('visibility', value);
    filteredModels = this.collection.filter(function(model) {
      return model.get('visible');
    });
    if (filteredModels.length === 0 || filteredModels.length === this.collection.length) {
      this.$('header .options input[name="filter"]').addClass('nonefound');
    } else {
      this.$('header .options input[name="filter"]').removeClass('nonefound');
    }
    this.$('header small.optioncount').html(filteredModels.length + ' of ' + this.collection.length);
    return this;
  };

  ListFacet.prototype.events = function() {
    return _.extend({}, ListFacet.__super__.events.apply(this, arguments), {
      'keyup input[name="filter"]': function(ev) {
        return this.optionsView.filterOptions(ev.currentTarget.value);
      },
      'change header .options input[type="checkbox"][name="all"]': function(ev) {
        return this.optionsView.setCheckboxes(ev);
      },
      'click header .menu i.filter': 'toggleFilterMenu',
      'click header .menu i.alpha': 'changeOrder',
      'click header .menu i.amount': 'changeOrder'
    });
  };

  ListFacet.prototype.toggleFilterMenu = function() {
    var filterIcon, optionsDiv;
    optionsDiv = this.$('header .options');
    filterIcon = this.$('i.filter');
    filterIcon.toggleClass('active');
    return optionsDiv.slideToggle(150, (function(_this) {
      return function() {
        var input;
        input = optionsDiv.find('input[name="filter"]');
        if (filterIcon.hasClass('active')) {
          input.focus();
          _this.optionsView.appendOptions(true);
          return _this.renderFilteredOptionCount();
        } else {
          input.val('');
          return _this.collection.setAllVisible();
        }
      };
    })(this));
  };

  ListFacet.prototype.changeOrder = function(ev) {
    var $target, order, type;
    $target = Backbone.$(ev.currentTarget);
    if ($target.hasClass('active')) {
      if ($target.hasClass('alpha')) {
        $target.toggleClass('fa-sort-alpha-desc');
        $target.toggleClass('fa-sort-alpha-asc');
      } else if ($target.hasClass('amount')) {
        $target.toggleClass('fa-sort-amount-desc');
        $target.toggleClass('fa-sort-amount-asc');
      }
    } else {
      this.$('.active').removeClass('active');
      $target.addClass('active');
    }
    type = $target.hasClass('alpha') ? 'alpha' : 'amount';
    order = $target.hasClass('fa-sort-' + type + '-desc') ? 'desc' : 'asc';
    return this.collection.orderBy(type + '_' + order);
  };

  ListFacet.prototype.update = function(newOptions) {
    return this.collection.updateOptions(newOptions);
  };

  ListFacet.prototype.reset = function() {
    return this.collection.revert();
  };

  return ListFacet;

})(Views.Facet);

module.exports = ListFacet;



},{"../../../jade/facets/list.menu.jade":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/jade/facets/list.menu.jade","../../collections/list.options":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/collections/list.options.coffee","../../models/facets/list":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/models/facets/list.coffee","./list.options":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/views/facets/list.options.coffee","./main":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/views/facets/main.coffee","jquery":false,"underscore":false}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/views/facets/list.options.coffee":[function(require,module,exports){
var $, Backbone, ListFacetOptions, Models, bodyTpl, funcky, optionTpl, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

$ = require('jquery');

_ = require('underscore');

funcky = require('funcky.util');

Models = {
  List: require('../../models/facets/list')
};

bodyTpl = require('../../../jade/facets/list.body.jade');

optionTpl = require('../../../jade/facets/list.option.jade');

ListFacetOptions = (function(_super) {
  __extends(ListFacetOptions, _super);

  function ListFacetOptions() {
    this.triggerChange = __bind(this.triggerChange, this);
    return ListFacetOptions.__super__.constructor.apply(this, arguments);
  }

  ListFacetOptions.prototype.className = 'container';

  ListFacetOptions.prototype.initialize = function(options) {
    this.config = options.config;
    this.facetName = options.facetName;
    this.showingCursor = 0;
    this.showingIncrement = 50;
    this.listenTo(this.collection, 'sort', (function(_this) {
      return function() {
        return _this.rerender();
      };
    })(this));
    if (this.config.get('templates').hasOwnProperty('list.option')) {
      optionTpl = this.config.get('templates')['list.option'];
    }
    return this.render();
  };

  ListFacetOptions.prototype.render = function() {
    if (this.config.get('templates').hasOwnProperty('list.body')) {
      bodyTpl = this.config.get('templates')['list.body'];
    }
    this.$el.html(bodyTpl({
      facetName: this.facetName
    }));
    this.appendOptions();
    return this;
  };

  ListFacetOptions.prototype.rerender = function() {
    var i, model, tpl, visible;
    tpl = '';
    i = 0;
    model = this.collection.at(i);
    visible = model != null ? model.get('visible') : void 0;
    while (visible) {
      tpl += optionTpl({
        option: model
      });
      i = i + 1;
      model = this.collection.at(i);
      visible = (model != null) && model.get('visible') ? true : false;
    }
    return this.el.querySelector('ul').innerHTML = tpl;
  };

  ListFacetOptions.prototype.appendOptions = function(all) {
    var model, tpl;
    if (all == null) {
      all = false;
    }
    if (all) {
      this.showingIncrement = this.collection.length;
    }
    tpl = '';
    while (this.showingCursor < this.showingIncrement && this.showingCursor < this.collection.length) {
      model = this.collection.at(this.showingCursor);
      model.set('visible', true);
      tpl += optionTpl({
        option: model
      });
      this.showingCursor = this.showingCursor + 1;
    }
    return this.$('ul').append(tpl);
  };

  ListFacetOptions.prototype.renderAll = function() {
    return this.collection.setAllVisible();
  };

  ListFacetOptions.prototype.events = function() {
    return {
      'click li': 'checkChanged',
      'scroll': 'onScroll'
    };
  };

  ListFacetOptions.prototype.onScroll = function(ev) {
    var target, topPerc;
    if (this.showingCursor < this.collection.length) {
      target = ev.currentTarget;
      topPerc = target.scrollTop / target.scrollHeight;
      if (topPerc > (this.showingCursor / 2) / this.collection.length) {
        this.showingIncrement += this.showingIncrement;
        return this.appendOptions();
      }
    }
  };

  ListFacetOptions.prototype.checkChanged = function(ev) {
    var $target, id, isChecked;
    $target = $(ev.currentTarget);
    id = $target.attr('data-value');
    isChecked = $target.attr('data-state') === 'checked';
    $target.attr('data-state', isChecked ? 'unchecked' : 'checked');
    isChecked = $target.attr('data-state') === 'checked';
    this.collection.get(id).set('checked', isChecked);
    if (($target.attr('data-state') === 'unchecked') || !this.config.get('autoSearch')) {
      return this.triggerChange();
    } else {
      return funcky.setResetTimeout(1000, (function(_this) {
        return function() {
          return _this.triggerChange();
        };
      })(this));
    }
  };

  ListFacetOptions.prototype.triggerChange = function(values) {
    var checkedModels;
    if (values == null) {
      checkedModels = this.collection.filter(function(item) {
        return item.get('checked');
      });
      values = _.map(checkedModels, function(item) {
        return item.get('name');
      });
    }
    return this.trigger('change', {
      facetValue: {
        name: this.facetName,
        values: values
      }
    });
  };


  /*
  Called by parent (ListFacet) when user types in the search input
   */

  ListFacetOptions.prototype.filterOptions = function(value) {
    this.collection.map(function(model) {
      var re;
      re = new RegExp(value, 'i');
      return model.set('visible', re.test(model.id));
    });
    this.collection.sort();
    return this.trigger('filter:finished');
  };

  ListFacetOptions.prototype.setCheckboxes = function(ev) {
    var model, values, visibleModels, _i, _len;
    visibleModels = this.collection.filter(function(model) {
      return model.get('visible');
    });
    for (_i = 0, _len = visibleModels.length; _i < _len; _i++) {
      model = visibleModels[_i];
      model.set('checked', ev.currentTarget.checked);
    }
    if (ev.currentTarget.checked) {
      values = _.map(visibleModels, function(item) {
        return item.get('name');
      });
      return this.triggerChange(values);
    } else {
      return this.triggerChange();
    }
  };

  return ListFacetOptions;

})(Backbone.View);

module.exports = ListFacetOptions;



},{"../../../jade/facets/list.body.jade":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/jade/facets/list.body.jade","../../../jade/facets/list.option.jade":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/jade/facets/list.option.jade","../../models/facets/list":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/models/facets/list.coffee","backbone":false,"funcky.util":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/node_modules/funcky.util/dist/latest/index.min.js","jquery":false,"underscore":false}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/views/facets/main.coffee":[function(require,module,exports){
var $, Backbone, Facet, tpl, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

$ = require('jquery');

_ = require('underscore');

tpl = require('../../../jade/facets/main.jade');

Facet = (function(_super) {
  __extends(Facet, _super);

  function Facet() {
    return Facet.__super__.constructor.apply(this, arguments);
  }

  Facet.prototype.renderedBefore = false;

  Facet.prototype.initialize = function(options) {
    this.config = options.config;
    if (this.config.get('facetTitleMap').hasOwnProperty(options.attrs.name)) {
      return options.attrs.title = this.config.get('facetTitleMap')[options.attrs.name];
    }
  };

  Facet.prototype.render = function() {
    if (this.config.get('templates').hasOwnProperty('facets.main')) {
      tpl = this.config.get('templates')['facets.main'];
    }
    this.$el.html(tpl(this.model.attributes));
    if (this.model.get('collapsed') && !this.renderedBefore) {
      this.hideBody();
    }
    this.renderedBefore = true;
    this.$el.attr('data-name', this.model.get('name'));
    return this;
  };

  Facet.prototype.events = function() {
    return {
      'click h3': 'toggleBody'
    };
  };

  Facet.prototype.toggleBody = function(ev) {
    var func;
    func = this.$el.hasClass('collapsed') ? this.showBody : this.hideBody;
    if (_.isFunction(ev)) {
      return func.call(this, ev);
    } else {
      return func.call(this);
    }
  };

  Facet.prototype.hideMenu = function() {
    var $button;
    $button = this.$('header i.openclose');
    $button.addClass('fa-plus-square-o');
    $button.removeClass('fa-minus-square-o');
    return this.$('header .options').slideUp(150);
  };

  Facet.prototype.hideBody = function(done) {
    this.hideMenu();
    this.$('.body').one('transitionend', function() {
      if (done != null) {
        return done();
      }
    });
    return this.$el.addClass('collapsed');
  };

  Facet.prototype.showBody = function(done) {
    this.$el.removeClass('collapsed');
    return this.$('.body').one('transitionend', function() {
      if (done != null) {
        return done();
      }
    });
  };

  Facet.prototype.destroy = function() {
    return this.remove();
  };

  Facet.prototype.update = function(newOptions) {};

  Facet.prototype.reset = function() {};

  return Facet;

})(Backbone.View);

module.exports = Facet;



},{"../../../jade/facets/main.jade":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/jade/facets/main.jade","backbone":false,"jquery":false,"underscore":false}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/views/facets/range.coffee":[function(require,module,exports){
var $, Models, RangeFacet, Views, bodyTpl, dragStopper, resizer, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

$ = require('jquery');

_ = require('underscore');

Models = {
  Range: require('../../models/facets/range')
};

Views = {
  Facet: require('./main')
};

bodyTpl = require('../../../jade/facets/range.body.jade');

dragStopper = null;

resizer = null;

RangeFacet = (function(_super) {
  __extends(RangeFacet, _super);

  function RangeFacet() {
    return RangeFacet.__super__.constructor.apply(this, arguments);
  }

  RangeFacet.prototype.className = 'facet range';

  RangeFacet.prototype.initialize = function(options) {
    RangeFacet.__super__.initialize.apply(this, arguments);
    this.config = options.config;
    this.draggingMin = false;
    this.draggingMax = false;
    this.model = new Models.Range(options.attrs, {
      parse: true
    });
    this.listenTo(this.model, 'change:options', this.render);
    this.listenTo(this.model, 'change', (function(_this) {
      return function(model) {
        if (model.changed.hasOwnProperty('currentMin') || model.changed.hasOwnProperty('currentMax')) {
          return _this.checkInputOverlap();
        }
      };
    })(this));
    this.listenTo(this.model, 'change:currentMin', this.updateMinHandle);
    this.listenTo(this.model, 'change:currentMax', this.updateMaxHandle);
    return this.render();
  };

  RangeFacet.prototype.render = function() {
    var rtpl;
    RangeFacet.__super__.render.apply(this, arguments);
    if (this.config.get('templates').hasOwnProperty('range.body')) {
      bodyTpl = this.config.get('templates')['range.body'];
    }
    rtpl = bodyTpl(this.model.attributes);
    this.$('.body').html(rtpl);
    this.$('header .menu').hide();
    dragStopper = this.stopDragging.bind(this);
    this.$el.on('mouseleave', dragStopper);
    resizer = this.onResize.bind(this);
    window.addEventListener('resize', resizer);
    setTimeout(((function(_this) {
      return function() {
        return _this.postRender();
      };
    })(this)), 0);
    return this;
  };

  RangeFacet.prototype.postRender = function() {
    this.slider = this.$('.slider');
    this.sliderWidth = this.slider.width();
    this.sliderLeft = this.slider.offset().left;
    this.handleMin = this.$('.handle-min');
    this.handleMax = this.$('.handle-max');
    this.handleWidth = this.handleMin.width();
    this.handleMinLeft = this.handleMin.position().left;
    this.handleMaxLeft = this.handleMax.position().left;
    this.inputMin = this.$('input.min');
    this.inputMax = this.$('input.max');
    this.bar = this.$('.bar');
    return this.button = this.el.querySelector('button');
  };

  RangeFacet.prototype.events = function() {
    return _.extend({}, RangeFacet.__super__.events.apply(this, arguments), {
      'mousedown .handle': 'startDragging',
      'mousedown .bar': 'startDragging',
      'mouseup': 'stopDragging',
      'mousemove': 'drag',
      'blur input': 'setYear',
      'keyup input': 'setYear',
      'click button': 'doSearch'
    });
  };

  RangeFacet.prototype.setYear = function(ev) {
    if (ev.type === 'focusout' || ev.type === 'blur' || (ev.type === 'keyup' && ev.keyCode === 13)) {
      if (ev.currentTarget.className.indexOf('min') > -1) {
        this.model.set({
          currentMin: +ev.currentTarget.value
        });
        return this.disableInputEditable(this.inputMin);
      } else if (ev.currentTarget.className.indexOf('max') > -1) {
        this.model.set({
          currentMax: +ev.currentTarget.value
        });
        return this.disableInputEditable(this.inputMax);
      }
    }
  };

  RangeFacet.prototype.doSearch = function(ev) {
    ev.preventDefault();
    return this.triggerChange();
  };

  RangeFacet.prototype.startDragging = function(ev) {
    var input, target;
    target = $(ev.currentTarget);
    input = target.find('input');
    if (input.length > 0) {
      if (input.attr('disabled') == null) {
        return;
      }
    }
    if (target.hasClass('handle-min')) {
      this.draggingMin = true;
      this.handleMax.css('z-index', 10);
      return target.css('z-index', 11);
    } else if (target.hasClass('handle-max')) {
      this.draggingMax = true;
      this.handleMin.css('z-index', 10);
      return target.css('z-index', 11);
    } else if (target.hasClass('bar')) {
      return this.draggingBar = {
        offsetLeft: (ev.clientX - this.sliderLeft) - this.handleMinLeft,
        barWidth: this.bar.width()
      };
    }
  };

  RangeFacet.prototype.drag = function(ev) {
    var dragMax, dragMin, mousePosLeft;
    mousePosLeft = ev.clientX - this.sliderLeft;
    if (this.draggingMin || this.draggingMax) {
      this.disableInputOverlap();
    }
    dragMin = (function(_this) {
      return function(newPos) {
        if ((-1 < newPos && newPos <= _this.handleMaxLeft)) {
          _this.handleMinLeft = newPos;
          _this.handleMin.css('left', newPos);
          _this.bar.css('left', newPos);
          _this.updateDash();
          return _this.updateHandleLabel('min', newPos);
        }
      };
    })(this);
    dragMax = (function(_this) {
      return function(newPos) {
        if ((_this.handleMinLeft < newPos && newPos <= _this.sliderWidth)) {
          _this.handleMaxLeft = newPos;
          _this.handleMax.css('left', newPos);
          _this.bar.css('right', _this.sliderWidth - newPos);
          return _this.updateHandleLabel('max', newPos);
        }
      };
    })(this);
    if (this.draggingBar != null) {
      if (this.handleMinLeft + this.draggingBar.barWidth <= this.sliderWidth) {
        dragMin(mousePosLeft - this.draggingBar.offsetLeft);
        dragMax(this.handleMinLeft + this.draggingBar.barWidth);
      }
    }
    if (this.draggingMin) {
      dragMin(mousePosLeft - (this.handleWidth / 2));
    }
    if (this.draggingMax) {
      return dragMax(mousePosLeft - (this.handleWidth / 2));
    }
  };

  RangeFacet.prototype.enableInputEditable = function(input) {
    input.attr('disabled', null);
    return input.focus();
  };

  RangeFacet.prototype.disableInputEditable = function(input) {
    return input.attr('disabled', true);
  };

  RangeFacet.prototype.enableInputOverlap = function(diff) {
    this.inputMin.css('left', -20 - diff / 2);
    this.inputMax.css('right', -20 - diff / 2);
    this.updateDash();
    this.$('.dash').show();
    this.inputMin.addClass('overlap');
    return this.inputMax.addClass('overlap');
  };

  RangeFacet.prototype.updateDash = function() {
    return this.$('.dash').css('left', this.handleMinLeft + ((this.handleMaxLeft - this.handleMinLeft) / 2) + 3);
  };

  RangeFacet.prototype.disableInputOverlap = function() {
    this.inputMin.css('left', -20);
    this.inputMax.css('right', -20);
    this.$('.dash').hide();
    this.inputMin.removeClass('overlap');
    return this.inputMax.removeClass('overlap');
  };

  RangeFacet.prototype.stopDragging = function() {
    if (this.draggingMin || this.draggingMax || (this.draggingBar != null)) {
      if (this.draggingMin) {
        if (this.model.get('currentMin') !== +this.inputMin.val()) {
          this.model.set({
            currentMin: +this.inputMin.val()
          });
        } else {
          this.enableInputEditable(this.inputMin);
        }
      }
      if (this.draggingMax) {
        if (this.model.get('currentMax') !== +this.inputMax.val()) {
          this.model.set({
            currentMax: +this.inputMax.val()
          });
        } else {
          this.enableInputEditable(this.inputMax);
        }
      }
      this.draggingMin = false;
      this.draggingMax = false;
      this.draggingBar = null;
      if (!this.config.get('autoSearch')) {
        return this.triggerChange({
          silent: true
        });
      }
    }
  };

  RangeFacet.prototype.destroy = function() {
    this.$el.off('mouseleave', dragStopper);
    window.removeEventListener('resize', resizer);
    return this.remove();
  };

  RangeFacet.prototype.triggerChange = function(options) {
    var queryOptions;
    if (options == null) {
      options = {};
    }
    queryOptions = {
      facetValue: {
        name: this.model.get('name'),
        lowerLimit: this.model.get('currentMin') + '0101',
        upperLimit: this.model.get('currentMax') + '1231'
      }
    };
    return this.trigger('change', queryOptions, options);
  };

  RangeFacet.prototype.onResize = function() {
    this.postRender();
    this.update({
      lowerLimit: this.model.get('currentMin'),
      upperLimit: this.model.get('currentMax')
    });
    return this.checkInputOverlap();
  };

  RangeFacet.prototype.checkInputOverlap = function() {
    var diff, maxRect, minRect;
    minRect = this.inputMin[0].getBoundingClientRect();
    maxRect = this.inputMax[0].getBoundingClientRect();
    if (!(minRect.right < maxRect.left || minRect.left > maxRect.right || minRect.bottom < maxRect.top || minRect.top > maxRect.bottom)) {
      diff = minRect.right - maxRect.left;
      return this.enableInputOverlap(diff);
    } else {
      return this.disableInputOverlap();
    }
  };

  RangeFacet.prototype.updateHandleLabel = function(handle, leftPos) {
    var input;
    if ((this.button != null) && this.config.get('autoSearch')) {
      this.button.style.display = 'block';
    }
    input = handle === 'min' ? this.inputMin : this.inputMax;
    return input.val(this.getYearFromLeftPos(leftPos));
  };

  RangeFacet.prototype.getYearFromLeftPos = function(leftPos) {
    var ll, ul;
    ll = this.model.get('options').lowerLimit;
    ul = this.model.get('options').upperLimit;
    return Math.floor(ll + leftPos / this.sliderWidth * (ul - ll));
  };

  RangeFacet.prototype.getLeftPosFromYear = function(year) {
    var left, ll, ul;
    ll = this.model.get('options').lowerLimit;
    ul = this.model.get('options').upperLimit;
    left = ((year - ll) / (ul - ll)) * this.sliderWidth;
    return Math.floor(left);
  };

  RangeFacet.prototype.update = function(newOptions) {
    if (_.isArray(newOptions)) {
      if (newOptions[0] != null) {
        newOptions = newOptions[0];
      } else {
        newOptions = {
          lowerLimit: this.model.get('options').lowerLimit,
          upperLimit: this.model.get('options').upperLimit
        };
      }
    }
    this.model.set({
      currentMin: +(newOptions.lowerLimit + '').substr(0, 4),
      currentMax: +(newOptions.upperLimit + '').substr(0, 4)
    });
    if (this.button != null) {
      return this.button.style.display = 'none';
    }
  };

  RangeFacet.prototype.updateMaxHandle = function(model) {
    var leftMax, year;
    year = model.get('currentMax');
    this.inputMax.val(year);
    leftMax = this.getLeftPosFromYear(year);
    this.handleMax.css('left', leftMax - (this.handleWidth / 2));
    this.bar.css('right', this.sliderWidth - leftMax);
    return this.handleMaxLeft = leftMax - (this.handleWidth / 2);
  };

  RangeFacet.prototype.updateMinHandle = function(model) {
    var leftMin, year;
    year = model.get('currentMin');
    this.inputMin.val(year);
    leftMin = this.getLeftPosFromYear(year);
    this.handleMin.css('left', leftMin - (this.handleWidth / 2));
    this.bar.css('left', leftMin);
    return this.handleMinLeft = leftMin - (this.handleWidth / 2);
  };

  return RangeFacet;

})(Views.Facet);

module.exports = RangeFacet;



},{"../../../jade/facets/range.body.jade":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/jade/facets/range.body.jade","../../models/facets/range":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/models/facets/range.coffee","./main":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/views/facets/main.coffee","jquery":false,"underscore":false}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/views/text-search.coffee":[function(require,module,exports){
var Backbone, Models, TextSearch, tpl, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

Models = {
  Search: require('../models/search')
};

tpl = require('../../jade/text-search.jade');

TextSearch = (function(_super) {
  __extends(TextSearch, _super);

  function TextSearch() {
    return TextSearch.__super__.constructor.apply(this, arguments);
  }

  TextSearch.prototype.className = 'text-search';

  TextSearch.prototype.initialize = function(options) {
    this.config = options.config;
    this.fields = options.fields;
    return this.reset();
  };

  TextSearch.prototype.setModel = function() {
    if (this.model != null) {
      this.stopListening(this.model);
    }
    return this.model = new Models.Search(this.config.get('textSearchOptions'));
  };

  TextSearch.prototype.render = function() {
    if (this.config.has('templates').hasOwnProperty('text-search')) {
      tpl = this.config.get('templates')['text-search'];
    }
    this.$el.html(tpl({
      model: this.model,
      fields: this.fields,
      textSearchTitles: this.config.get('textSearchTitleMap') || {}
    }));
    return this;
  };

  TextSearch.prototype.events = function() {
    return {
      'click i.fa-search': 'search',
      'keyup input[name="search"]': 'onKeyUp',
      'focus input[name="search"]': function() {
        return this.$('.body .menu').slideDown(150);
      },
      'click .menu .fa-times': function() {
        return this.$('.body .menu').slideUp(150);
      },
      'change input[type="checkbox"]': 'checkboxChanged'
    };
  };

  TextSearch.prototype.onKeyUp = function(ev) {
    var changed, field;
    if (ev.keyCode === 13) {
      ev.preventDefault();
      return this.search(ev);
    }
    field = ev.currentTarget.getAttribute('data-field');
    changed = this.model.get(field) !== ev.currentTarget.value;
    if (changed) {
      this.model.set(field, ev.currentTarget.value);
    }
    this.updateQueryModel();
    return this.$('button.search').toggleClass('changed', changed);
  };

  TextSearch.prototype.search = function(ev) {
    ev.preventDefault();
    return this.trigger('search');
  };

  TextSearch.prototype.updateQueryModel = function() {
    return this.trigger('change', this.model.queryData());
  };

  TextSearch.prototype.reset = function() {
    this.setModel();
    return this.render();
  };

  TextSearch.prototype.destroy = function() {
    return this.remove();
  };

  return TextSearch;

})(Backbone.View);

module.exports = TextSearch;



},{"../../jade/text-search.jade":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/jade/text-search.jade","../models/search":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/models/search.coffee","backbone":false,"underscore":false}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/jade/facets/boolean.body.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (options, ucfirst) {
buf.push("<ul>");
// iterate options
;(function(){
  var $$obj = options;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var option = $$obj[$index];

buf.push("<li><div class=\"row span6\"><div class=\"cell span5\"><i" + (jade.attr("data-value", option.name, true, false)) + (jade.cls([option.checked?'fa fa-check-square-o':'fa fa-square-o'], [true])) + "></i><label" + (jade.attr("data-value", option.name, true, false)) + ">" + (jade.escape(null == (jade_interp = ucfirst(option.name)) ? "" : jade_interp)) + "</label></div><div class=\"cell span1 alignright\"><div class=\"count\">" + (jade.escape(null == (jade_interp = option.count) ? "" : jade_interp)) + "</div></div></div></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var option = $$obj[$index];

buf.push("<li><div class=\"row span6\"><div class=\"cell span5\"><i" + (jade.attr("data-value", option.name, true, false)) + (jade.cls([option.checked?'fa fa-check-square-o':'fa fa-square-o'], [true])) + "></i><label" + (jade.attr("data-value", option.name, true, false)) + ">" + (jade.escape(null == (jade_interp = ucfirst(option.name)) ? "" : jade_interp)) + "</label></div><div class=\"cell span1 alignright\"><div class=\"count\">" + (jade.escape(null == (jade_interp = option.count) ? "" : jade_interp)) + "</div></div></div></li>");
    }

  }
}).call(this);

buf.push("</ul>");}.call(this,"options" in locals_for_with?locals_for_with.options:typeof options!=="undefined"?options:undefined,"ucfirst" in locals_for_with?locals_for_with.ucfirst:typeof ucfirst!=="undefined"?ucfirst:undefined));;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/jade/facets/date.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (name, title, options) {
buf.push("<header><h3" + (jade.attr("data-name", name, true, false)) + ">" + (jade.escape(null == (jade_interp = title) ? "" : jade_interp)) + "</h3></header><div class=\"body\"><label>From:</label><select>");
// iterate options
;(function(){
  var $$obj = options;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var option = $$obj[$index];

buf.push("<option>" + (jade.escape(null == (jade_interp = option) ? "" : jade_interp)) + "</option>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var option = $$obj[$index];

buf.push("<option>" + (jade.escape(null == (jade_interp = option) ? "" : jade_interp)) + "</option>");
    }

  }
}).call(this);

buf.push("</select><label>To:</label><select>");
// iterate options.reverse()
;(function(){
  var $$obj = options.reverse();
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var option = $$obj[$index];

buf.push("<option>" + (jade.escape(null == (jade_interp = option) ? "" : jade_interp)) + "</option>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var option = $$obj[$index];

buf.push("<option>" + (jade.escape(null == (jade_interp = option) ? "" : jade_interp)) + "</option>");
    }

  }
}).call(this);

buf.push("</select></div>");}.call(this,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"title" in locals_for_with?locals_for_with.title:typeof title!=="undefined"?title:undefined,"options" in locals_for_with?locals_for_with.options:typeof options!=="undefined"?options:undefined));;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/jade/facets/list.body.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<ul></ul>");;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/jade/facets/list.menu.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<input type=\"checkbox\" name=\"all\"/><input type=\"text\" name=\"filter\" placeholder=\"Filter options...\"/><small class=\"optioncount\"></small>");;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/jade/facets/list.option.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (option) {
buf.push("<li" + (jade.attr("data-count", option.get('count'), true, false)) + (jade.attr("data-value", option.id, true, false)) + (jade.attr("data-state", option.get('checked') ? 'checked' : 'unchecked', true, false)) + "><i" + (jade.attr("data-value", option.id, true, false)) + (jade.cls(['unchecked','fa','fa-square-o',option.get('checked')?'hidden':'visible'], [null,null,null,true])) + "></i><i" + (jade.attr("data-value", option.id, true, false)) + (jade.cls(['checked','fa','fa-check-square-o',option.get('checked')?'visible':'hidden'], [null,null,null,true])) + "></i><label" + (jade.attr("data-value", option.id, true, false)) + ">" + (null == (jade_interp = option.id === ':empty' ? '<em>(empty)</em>' : option.id) ? "" : jade_interp) + "</label><div class=\"count\">" + (jade.escape(null == (jade_interp = option.get('count') === 0 ? option.get('total') : option.get('count')) ? "" : jade_interp)) + "</div></li>");}.call(this,"option" in locals_for_with?locals_for_with.option:typeof option!=="undefined"?option:undefined));;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/jade/facets/main.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (title) {
buf.push("<header><h3>" + (jade.escape(null == (jade_interp = title) ? "" : jade_interp)) + "</h3><div class=\"menu\"><i title=\"Filter options\" class=\"filter fa fa-filter\"></i><i title=\"Sort alphabetically\" class=\"alpha fa fa-sort-alpha-asc\"></i><i title=\"Sort numerically\" class=\"amount active fa fa-sort-amount-desc\"></i></div><div class=\"options\"></div></header><div class=\"body\"></div>");}.call(this,"title" in locals_for_with?locals_for_with.title:typeof title!=="undefined"?title:undefined));;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/jade/facets/range.body.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (options) {
buf.push("<div class=\"slider\"><span class=\"dash\">-</span><div class=\"handle-min handle\"><input" + (jade.attr("value", options.lowerLimit, true, false)) + " disabled=\"disabled\" class=\"min\"/></div><div class=\"handle-max handle\"><input" + (jade.attr("value", options.upperLimit, true, false)) + " disabled=\"disabled\" class=\"max\"/></div><div class=\"bar\">&nbsp;</div><button>Search?</button></div>");}.call(this,"options" in locals_for_with?locals_for_with.options:typeof options!=="undefined"?options:undefined));;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/jade/main.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"overlay\"><div><i class=\"fa fa-spinner fa-spin fa-2x\"></i></div></div><div class=\"faceted-search\"><div class=\"text-search-placeholder\"></div><ul class=\"facets-menu\"><li class=\"reset\"><button><i class=\"fa fa-refresh\"></i><span>Reset search</span></button></li><li class=\"switch\"><button><i class=\"fa fa-angle-double-down\"></i><span>Switch to</span></button></li><li class=\"collapse-expand\"><button><i class=\"fa fa-compress\"></i><span>Collapse facets</span></button></li></ul><div class=\"facets-placeholder\"></div></div>");;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/jade/text-search.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (fields, textSearchTitles) {
buf.push("<div class=\"placeholder\"><header><h3>Text search</h3><button class=\"search\"><i class=\"fa fa-search\"></i></button></header>");
// iterate fields
;(function(){
  var $$obj = fields;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var field = $$obj[$index];

buf.push("<div" + (jade.attr("data-name", field, true, false)) + " class=\"search-input\"><h4>" + (jade.escape(null == (jade_interp = textSearchTitles[field]) ? "" : jade_interp)) + "</h4><input type=\"text\" name=\"search\"" + (jade.attr("data-field", field, true, false)) + "/></div>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var field = $$obj[$index];

buf.push("<div" + (jade.attr("data-name", field, true, false)) + " class=\"search-input\"><h4>" + (jade.escape(null == (jade_interp = textSearchTitles[field]) ? "" : jade_interp)) + "</h4><input type=\"text\" name=\"search\"" + (jade.attr("data-field", field, true, false)) + "/></div>");
    }

  }
}).call(this);

buf.push("</div>");}.call(this,"fields" in locals_for_with?locals_for_with.fields:typeof fields!=="undefined"?fields:undefined,"textSearchTitles" in locals_for_with?locals_for_with.textSearchTitles:typeof textSearchTitles!=="undefined"?textSearchTitles:undefined));;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js":[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.jade=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return Array.isArray(val) ? val.map(joinClasses).filter(nulls).join(' ') : val;
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};

/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  var result = String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || _dereq_('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

},{"fs":2}],2:[function(_dereq_,module,exports){

},{}]},{},[1])
(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/home/gijs/Projects/women-writers/src/coffee/app.coffee":[function(require,module,exports){
var $, App, Author, Backbone, Document, DocumentForm, DocumentSearchView, DocumentView, Modal, Person, PersonGraphView, PersonSearchView, PersonView, Publication, React, ReceptionSearchView, SourceList, UserStatusView, addDocumentTpl, addPersonTpl, baseTemplate, config, _, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

Backbone = require('backbone');

$ = require('jquery');

_ = require('underscore');

React = require("react");

baseTemplate = require('../jade/views/base.jade');

config = require('./config');

UserStatusView = require('./views/user-status');

Person = require('./models/person');

_ref = require("../edit-person/build/development"), Author = _ref.Author, Publication = _ref.Publication;

PersonView = require('./views/person/view');

PersonGraphView = require('./views/person/graph');

PersonSearchView = require('./views/person/search');

Document = require('./models/document');

DocumentForm = require('./views/document/edit');

DocumentView = require('./views/document/view');

DocumentSearchView = require('./views/document/search');

ReceptionSearchView = require('./views/reception/search');

SourceList = require('./views/sources/view');

Modal = require('hibb-modal');

addPersonTpl = require('../jade/views/person/add.jade');

addDocumentTpl = require('../jade/views/document/add.jade');

App = (function(_super) {
  __extends(App, _super);

  function App() {
    return App.__super__.constructor.apply(this, arguments);
  }

  App.prototype.className = 'container';

  App.prototype.template = baseTemplate;

  App.prototype.initialize = function() {
    _.extend(this, Backbone.Events);
    return this.render();
  };

  App.prototype.updateNavBar = function(route) {
    var category, match;
    match = route.match(/show([A-Z][a-z]+)/);
    if (match) {
      category = match[1].toLowerCase();
      this.$('.navigation a').removeClass('active');
      return this.$(".navigation a." + category).addClass('active');
    }
  };

  App.prototype.events = {
    'click i.fa.fa-adjust': 'toggleHighContrast',
    'click span.add-person': '_showAddPersonModal',
    'click span.add-document': '_showAddDocumentModal'
  };

  App.prototype._showAddPersonModal = function() {
    var modal;
    modal = new Modal({
      customClassName: "add-person-modal",
      title: "Add person",
      html: $('<div />').html(addPersonTpl()),
      submitValue: 'Save'
    });
    return modal.on('submit', (function(_this) {
      return function() {
        var cb, formData, url;
        formData = modal.$("form").serializeArray();
        if (formData["last-name"] === "") {
          return modal.message("error", "A person should have a last name.");
        } else {
          url = new Person().url();
          cb = function(response, textStatus, jqXHR) {
            console.log(response, textStatus);
            return modal.messageAndFade('success', 'Person saved!');
          };
          return $.ajax({
            url: url,
            type: "POST",
            data: new Person().parseFormData(formData),
            success: cb,
            contentType: "application/json",
            headers: {
              VRE_ID: "WomenWriters",
              Authorization: localStorage.getItem("hi-womenwriters-auth-token")
            }
          });
        }
      };
    })(this));
  };

  App.prototype._showAddDocumentModal = function() {
    var fetchLocations, fetchPersons, formData, jqXHRPostLocations, jqXHRPostPersons, loader, showModal;
    showModal = (function(_this) {
      return function() {
        var capitalizePerson, modal, rhtml;
        capitalizePerson = function(person) {
          person.displayName = person.displayName.charAt(0).toUpperCase() + person.displayName.substr(1);
          return person;
        };
        rhtml = addDocumentTpl({
          genres: _.sortBy(config.get("genres"), "label"),
          languages: _.sortBy(config.get("languages"), "label"),
          persons: _.chain(config.get("persons")).map(capitalizePerson).sortBy("displayName").value(),
          locations: _.sortBy(config.get("locations"), "displayName")
        });
        modal = new Modal({
          customClassName: "add-document-modal",
          title: "Add document",
          html: $('<div />').html(rhtml),
          submitValue: 'Save'
        });
        return modal.on('submit', function() {
          var doc, formData, saveDocumentRelations;
          formData = modal.$("form").serializeArray();
          if (formData.title === "") {
            return modal.message("error", "A document should have a title.");
          } else {
            doc = new Document();
            saveDocumentRelations = function(sourceId) {
              var field, jqXHRs, relationName, _i, _len, _ref1;
              jqXHRs = [];
              _ref1 = ["isCreatedBy", "hasWorkLanguage", "hasGenre", "hasPublishLocation"];
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                relationName = _ref1[_i];
                field = formData.filter(function(formField) {
                  return formField.name === relationName;
                });
                if (field[0].value !== "") {
                  jqXHRs.push(doc.saveRelation(relationName, sourceId, field[0].value));
                }
              }
              if (jqXHRs.length) {
                return $.when.apply($, jqXHRs).done(function() {
                  return modal.messageAndFade('success', 'Document saved!');
                });
              } else {
                return modal.messageAndFade('success', 'Document saved!');
              }
            };
            return $.ajax({
              url: doc.url(),
              type: "POST",
              data: doc.parseFormData(formData),
              success: function(response, textStatus, xhr) {
                var docId, docLoc;
                docLoc = xhr.getResponseHeader("Location");
                docId = docLoc.substr(docLoc.lastIndexOf("/") + 1);
                return saveDocumentRelations(docId);
              },
              contentType: "application/json",
              headers: {
                VRE_ID: "WomenWriters",
                Authorization: localStorage.getItem("hi-womenwriters-auth-token")
              }
            });
          }
        });
      };
    })(this);
    if (config.has("persons") && config.has("locations")) {
      return showModal();
    } else {
      loader = new Modal({
        html: "Please wait, loading...",
        cancelAndSubmit: false
      });
      formData = {
        type: "POST",
        data: '{"term": "*"}',
        contentType: "application/json; charset=UTF-8",
        headers: {
          VRE_ID: "WomenWriters"
        }
      };
      fetchPersons = new $.Deferred();
      fetchLocations = new $.Deferred();
      jqXHRPostPersons = $.ajax(_.extend(formData, {
        url: "https://acc.repository.huygens.knaw.nl/v1/search/wwpersons"
      }));
      jqXHRPostPersons.done((function(_this) {
        return function(response, textStatus, xhr) {
          var jqXHRGetPersons;
          jqXHRGetPersons = $.ajax({
            url: xhr.getResponseHeader("Location") + "?rows=10000"
          });
          return jqXHRGetPersons.done(function(response) {
            return fetchPersons.resolve(response);
          });
        };
      })(this));
      jqXHRPostLocations = $.ajax(_.extend(formData, {
        url: "https://acc.repository.huygens.knaw.nl/v1/search/wwlocations"
      }));
      jqXHRPostLocations.done((function(_this) {
        return function(response, textStatus, xhr) {
          var jqXHRGetLocations;
          jqXHRGetLocations = $.ajax({
            url: xhr.getResponseHeader("Location") + "?rows=200"
          });
          return jqXHRGetLocations.done(function(response) {
            return fetchLocations.resolve(response);
          });
        };
      })(this));
      return $.when(fetchPersons, fetchLocations).done((function(_this) {
        return function(persons, locations) {
          loader.destroy();
          config.set("persons", persons.refs);
          config.set("locations", locations.refs);
          return showModal();
        };
      })(this));
    }
  };

  App.prototype.toggleHighContrast = function(ev) {
    return $('body').toggleClass('high-contrast');
  };

  App.prototype.home = function() {};

  App.prototype.showPersonForm = function(id) {
    var Factory;
    console.log("SHOW: ", id);
    Factory = React.createFactory(Author);
    return React.render(Factory({
      id: id
    }), document.getElementById("view"));
  };

  App.prototype.showDocumentForm = function(id) {
    var Factory;
    console.log("SHOW: ", id);
    Factory = React.createFactory(Publication);
    React.render(Factory({
      id: id
    }), document.getElementById("view"));
    return this.showView();
  };

  App.prototype.showPersonSearch = function() {
    var _ref1, _ref2;
    if (this.personSearch == null) {
      this.personSearch = new PersonSearchView({
        el: '#search .persons'
      });
    }
    this.showSearch();
    if ((_ref1 = this.documentSearch) != null) {
      _ref1.$el.fadeOut(75);
    }
    if ((_ref2 = this.receptionSearch) != null) {
      _ref2.$el.fadeOut(75);
    }
    return this.personSearch.$el.fadeIn(75);
  };

  App.prototype.showDocumentSearch = function() {
    var _ref1, _ref2;
    if (this.documentSearch == null) {
      this.documentSearch = new DocumentSearchView({
        el: '#search .documents'
      });
    }
    this.showSearch();
    if ((_ref1 = this.personSearch) != null) {
      _ref1.$el.fadeOut(75);
    }
    if ((_ref2 = this.receptionSearch) != null) {
      _ref2.$el.fadeOut(75);
    }
    return this.documentSearch.$el.fadeIn(75);
  };

  App.prototype.showReceptionSearch = function() {
    var _ref1, _ref2;
    if (this.receptionSearch == null) {
      this.receptionSearch = new ReceptionSearchView({
        el: '#search .receptions'
      });
    }
    this.showSearch();
    if ((_ref1 = this.personSearch) != null) {
      _ref1.$el.fadeOut(75);
    }
    if ((_ref2 = this.documentSearch) != null) {
      _ref2.$el.fadeOut(75);
    }
    return this.receptionSearch.$el.fadeIn(75);
  };

  App.prototype.showPersonView = function(id, version) {
    var fetchPerson, person, showPerson;
    person = new Person({
      _id: id
    });
    showPerson = (function(_this) {
      return function() {
        var p, pseudonym, pseudonymsLoaded, view, _ref1;
        if ('hasPseudonym' in person.get('@relations')) {
          person.set({
            pseudonyms: {}
          });
          pseudonymsLoaded = (function() {
            var _i, _len, _ref1, _results;
            _ref1 = person.get('@relations').hasPseudonym;
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              p = _ref1[_i];
              pseudonym = new Person({
                _id: p.id
              });
              _results.push(pseudonym.fetch());
            }
            return _results;
          })();
          return (_ref1 = Backbone.$).when.apply(_ref1, pseudonymsLoaded).done(function() {
            var r, results, view, _i, _len, _ref1, _ref2;
            results = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            for (_i = 0, _len = results.length; _i < _len; _i++) {
              r = results[_i];
              pseudonym = r[0];
              if (pseudonym != null ? (_ref1 = pseudonym['@relations']) != null ? (_ref2 = _ref1['isCreatorOf']) != null ? _ref2.length : void 0 : void 0 : void 0) {
                person.get('pseudonyms')[pseudonym._id] = pseudonym;
              }
            }
            view = new PersonView({
              model: person,
              showingRevision: version != null
            });
            _this.switchView(view);
            return _this.showView();
          });
        } else {
          view = new PersonView({
            model: person,
            showingRevision: version != null
          });
          _this.switchView(view);
          return _this.showView();
        }
      };
    })(this);
    fetchPerson = version != null ? person.fetchVersion(version) : person.fetch();
    return fetchPerson.done((function(_this) {
      return function() {
        return showPerson();
      };
    })(this));
  };

  App.prototype.showPersonGraph = function(id) {
    var person, showGraph;
    person = new Person({
      _id: id
    });
    showGraph = (function(_this) {
      return function() {
        var view;
        view = new PersonGraphView({
          model: person
        });
        _this.switchView(view);
        return _this.showView();
      };
    })(this);
    return person.fetch().done((function(_this) {
      return function() {
        return showGraph();
      };
    })(this));
  };

  App.prototype.showDocumentView = function(id, version) {
    var document, fetchDocument, showDocument;
    document = new Document({
      _id: id
    });
    showDocument = (function(_this) {
      return function() {
        var view;
        view = new DocumentView({
          model: document,
          showingRevision: version != null
        });
        _this.switchView(view);
        return _this.showView();
      };
    })(this);
    fetchDocument = version != null ? document.fetchVersion(version) : document.fetch();
    return fetchDocument.done((function(_this) {
      return function() {
        return showDocument();
      };
    })(this));
  };

  App.prototype.showSourceView = function() {
    return this.showDocumentView.apply(this, arguments);
  };

  App.prototype.showSourceList = function() {
    var view;
    view = new SourceList;
    this.switchView(view);
    return this.showView();
  };

  App.prototype.showSearch = function() {
    this.$('#search').show();
    return this.$('#view').hide();
  };

  App.prototype.showView = function() {
    this.$('#search').hide();
    this.$('#view').show();
    return this.$el.scrollTop(0);
  };

  App.prototype.switchView = function(view) {
    var _ref1;
    if ((_ref1 = this.currentView) != null) {
      _ref1.remove();
    }
    this.$('#view').html(view.el);
    return this.currentView = view;
  };

  App.prototype.render = function() {
    var html, wrapper;
    wrapper = $('<div/>').attr({
      "class": 'body-wrap'
    }).append(this.$el.html());
    html = $(this.template({
      config: config
    }));
    new UserStatusView({
      el: html.find('.user-status')
    });
    this.$el.html(wrapper).append(html.hide()).find('.body-wrap').fadeOut(150, (function(_this) {
      return function() {
        _this.$('.body-wrap').remove();
        return html.fadeIn(100);
      };
    })(this));
    return this;
  };

  return App;

})(Backbone.View);

module.exports = App;



},{"../edit-person/build/development":"/home/gijs/Projects/women-writers/src/edit-person/build/development/index.js","../jade/views/base.jade":"/home/gijs/Projects/women-writers/src/jade/views/base.jade","../jade/views/document/add.jade":"/home/gijs/Projects/women-writers/src/jade/views/document/add.jade","../jade/views/person/add.jade":"/home/gijs/Projects/women-writers/src/jade/views/person/add.jade","./config":"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee","./models/document":"/home/gijs/Projects/women-writers/src/coffee/models/document.coffee","./models/person":"/home/gijs/Projects/women-writers/src/coffee/models/person.coffee","./views/document/edit":"/home/gijs/Projects/women-writers/src/coffee/views/document/edit.coffee","./views/document/search":"/home/gijs/Projects/women-writers/src/coffee/views/document/search.coffee","./views/document/view":"/home/gijs/Projects/women-writers/src/coffee/views/document/view.coffee","./views/person/graph":"/home/gijs/Projects/women-writers/src/coffee/views/person/graph.coffee","./views/person/search":"/home/gijs/Projects/women-writers/src/coffee/views/person/search.coffee","./views/person/view":"/home/gijs/Projects/women-writers/src/coffee/views/person/view.coffee","./views/reception/search":"/home/gijs/Projects/women-writers/src/coffee/views/reception/search.coffee","./views/sources/view":"/home/gijs/Projects/women-writers/src/coffee/views/sources/view.coffee","./views/user-status":"/home/gijs/Projects/women-writers/src/coffee/views/user-status.coffee","backbone":false,"hibb-modal":"/home/gijs/Projects/women-writers/node_modules/hibb-modal/dist/index.js","jquery":false,"react":"react","underscore":false}],"/home/gijs/Projects/women-writers/src/coffee/config/base.coffee":[function(require,module,exports){
module.exports = {
  "baseUrl": "-",
  "searchPath": "-",
  "relationSearchPath": "-",
  "facetedSearchBaseUrl": "-",
  "personsRootUrl": "/domain/wwpersons",
  "documentsRootUrl": "/domain/wwdocuments",
  "VRE_ID": "WomenWriters",
  "adminVreId": "Admin",
  "relationTypeVariation": "wwrelation",
  "receptionGraphPath": "/receptiongraph",
  "educationPath": "/domain/wwkeywords?type=education",
  "financialSituationPath": "/domain/wwkeywords?type=financialSituation",
  "maritalStatusPath": "/domain/wwkeywords?type=maritalStatus",
  "professionPath": "/domain/wwkeywords?type=profession",
  "religionPath": "/domain/wwkeywords?type=religion",
  "socialClassPath": "/domain/wwkeywords?type=socialClass",
  "sourceCategoryPath": "/domain/keywords?type=docSourceType",
  "genrePath": "/domain/wwkeywords?type=genre",
  "receptionsPath": "/api/system/vres/",
  "personTypeString": "wwperson",
  "documentTypeString": "wwdocument",
  "userInfoPath": "/api/system/users/me",
  "federatedLoginUrl": "https://secure.huygens.knaw.nl/saml2/login",
  "resultRows": 100,
  "isProduction": false,
  "textSearchTitles": {
    "dynamic_t_tempspouse": "Spouse",
    "dynamic_t_name": "Name",
    "dynamic_t_title": "Title",
    "dynamic_t_notes": "Notes"
  },
  "personFacetTitles": {
    "dynamic_s_gender": "Gender",
    "dynamic_s_birthDate": "Year of Birth",
    "dynamic_s_residence": "Country",
    "dynamic_s_language": "Language",
    "dynamic_s_birthplace": "Place of Birth",
    "dynamic_s_deathDate": "Year of Death",
    "dynamic_s_deathplace": "Place of Death",
    "dynamic_s_collective": "Memberships",
    "dynamic_s_religion": "Religion",
    "dynamic_s_types": "Type"
  },
  "documentFacetTitles": {
    "dynamic_s_date": "Year of first publication",
    "dynamic_s_origin": "Origin",
    "dynamic_s_document_type": "Document Type",
    "dynamic_s_creator": "Creator",
    "dynamic_s_language": "Language",
    "dynamic_s_subject": "Subject",
    "dynamic_s_genre": "Genre"
  },
  "receptionTypeLabels": {
    "isWorkCommentedOnIn": "is commented upon in",
    "isPersonCommentedOnIn": "is commented upon in",
    "containedInAnthology": "has been anthologized in",
    "isAnthologyContaining": "is anthology containing",
    "hasPreface": "is prefaced in",
    "isPrefaceOf": "is a preface to",
    "hasAnnotationsOn": "made handwritten comments in copy of",
    "isAnnotatedIn": "was annotated (by hand) in",
    "hasTranslation": "was translated in",
    "isTranslationOf": "is a translation of",
    "hasAdaptation": "was adapted into",
    "isAdaptationOf": "is adaptation of",
    "hasPlagiarismBy": "was plagiarized in",
    "isPlagiarismOf": "plagiarized",
    "hasSequel": "was continued by",
    "isSequelOf": "is a sequel of",
    "isParodiedBy": "is parodied by",
    "isParodyOf": "parodied",
    "hasBiography": "has been \"biographed\" in",
    "isBiographyOf": "is a biography of",
    "hasObituary": "features in obituary",
    "isObituaryOf": "is an obituary of",
    "hasEdition": "was reissued in",
    "isEditionOf": "is/provided an edition of",
    "isCopiedBy": "is (partly) copied in",
    "isCopyOf": "copied (by hand parts of)",
    "isCensoredBy": "was censored in",
    "isCensoringOf": "censors",
    "isWorkAwarded": "received an award from",
    "isAwardForWork": "awarded",
    "isPersonAwarded": "received an award from",
    "isAwardForPerson": "awarded",
    "isDedicatedPersonOf": "received dedication in",
    "isDedicatedTo": "is dedicated to",
    "isPersonQuotedIn": "is quoted in",
    "quotesPerson": "quotes",
    "isWorkQuotedIn": "is quoted in",
    "quotesWork": "quotes",
    "isIntertextualOf": "has intertextual relations with",
    "isIntertextualTo": "has intertextual relations with",
    "isWorkMentionedIn": "is mentioned in",
    "mentionsWork": "mentions",
    "isPersonMentionedIn": "is mentioned in",
    "mentionsPerson": "mentions",
    "isWorkListedOn": "is listed on",
    "listsWork": "lists",
    "isPersonListedOn": "is listed on",
    "listsPerson": "lists",
    "isPersonReferencedIn": "referenced to in",
    "referencesPerson": "references",
    "isWorkReferencedIn": "referenced to in",
    "referencesWork": "references",
    "hasBibliography": "is in bibliography",
    "isBibliographyOf": "is bibliography containing"
  }
};



},{}],"/home/gijs/Projects/women-writers/src/coffee/config/env.coffee":[function(require,module,exports){
module.exports = {
  "baseUrl": "https://acc.repository.huygens.knaw.nl",
  "searchPath": "/v1/search",
  "facetedSearchBaseUrl": "https://acc.repository.huygens.knaw.nl",
  "tokenPrefix": "womenwriters",
  "relationSearchPath": "/search/relations",
  "receptionsPath": "/system/vres/",
  "userInfoPath": "/system/users/me"
};



},{}],"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee":[function(require,module,exports){
var Backbone, Config, baseConfig, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

baseConfig = require('./base');

Config = (function(_super) {
  __extends(Config, _super);

  function Config() {
    return Config.__super__.constructor.apply(this, arguments);
  }

  Config.prototype.defaults = function() {
    var targetConfig;
    targetConfig = require('./env');
    return _.extend(baseConfig, targetConfig);
  };

  Config.prototype.initialize = function() {
    var hasLocalStorage;
    try {
      hasLocalStorage = window.localStorage != null;
    } catch (_error) {
      hasLocalStorage = false;
    }
    if (hasLocalStorage && (this.get('authToken') == null)) {
      this.set({
        authToken: window.localStorage.getItem('authToken')
      });
      return this.on('change:authToken', (function(_this) {
        return function() {
          return window.localStorage.setItem('authToken', _this.get('authToken'));
        };
      })(this));
    }
  };

  Config.prototype.searchUrl = function(type) {
    return this.get('baseUrl') + this.searchPath(type);
  };

  Config.prototype.searchPath = function(type) {
    if (type) {
      return this.get('searchPath') + '/' + type;
    } else {
      return this.get('searchPath');
    }
  };

  Config.prototype.excelResultsUrl = function(queryId) {
    return this.get('baseUrl') + this.get('searchPath') + ("/" + queryId + "/xls");
  };

  Config.prototype.relationsUrl = function() {
    return this.get('baseUrl') + '/domain/wwrelations';
  };

  Config.prototype.allPersonsUrl = function() {
    return this.get('facetedSearchBaseUrl') + this.get('personsRootUrl');
  };

  Config.prototype.personUrl = function(id) {
    return this.allPersonsUrl() + '/' + id;
  };

  Config.prototype.personViewPath = function(id) {
    return '/persons/' + id;
  };

  Config.prototype.personViewUrl = function(id) {
    return this.get('baseUrl') + this.personViewPath(id);
  };

  Config.prototype.personGraphPath = function(id) {
    return "/persons/" + id + "/graph";
  };

  Config.prototype.personGraphUrl = function(id) {
    return this.get('baseUrl') + this.personGraphPath(id);
  };

  Config.prototype.personGraphDataUrl = function(id) {
    var vreId;
    vreId = this.get('VRE_ID');
    return this.get('facetedSearchBaseUrl') + this.get('receptionGraphPath') + ("?vreId=" + vreId + "&personId=" + id);
  };

  Config.prototype.personEditUrl = function(id) {
    return this.personViewUrl(id) + '/edit';
  };

  Config.prototype.allDocumentsUrl = function() {
    return this.get('facetedSearchBaseUrl') + this.get('documentsRootUrl');
  };

  Config.prototype.documentUrl = function(id) {
    return this.allDocumentsUrl() + '/' + id;
  };

  Config.prototype.documentViewPath = function(id) {
    return '/documents/' + id;
  };

  Config.prototype.documentViewUrl = function(id) {
    return this.get('baseUrl') + this.documentViewPath(id);
  };

  Config.prototype.documentEditUrl = function(id) {
    return this.documentViewUrl(id) + '/edit';
  };

  Config.prototype.sourceViewUrl = function(id) {
    return this.get('baseUrl') + '/sources/' + id;
  };

  Config.prototype.viewUrl = function(id) {
    if (id == null) {
      id = '';
    }
    if (id.match(/^DOC/)) {
      return this.documentViewUrl(id);
    } else if (id.match(/^PERS/)) {
      return this.personViewUrl(id);
    }
  };

  Config.prototype.editUrl = function(id) {
    if (id.match(/^DOC/)) {
      return this.documentEditUrl(id);
    } else if (id.match(/^PERS/)) {
      return this.personEditUrl(id);
    }
  };

  Config.prototype.educationUrl = function() {
    return this.get('facetedSearchBaseUrl') + this.get('educationPath');
  };

  Config.prototype.financialSituationUrl = function() {
    return this.get('facetedSearchBaseUrl') + this.get('financialSituationPath');
  };

  Config.prototype.maritalStatusUrl = function() {
    return this.get('facetedSearchBaseUrl') + this.get('maritalStatusPath');
  };

  Config.prototype.professionUrl = function() {
    return this.get('facetedSearchBaseUrl') + this.get('professionPath');
  };

  Config.prototype.religionUrl = function() {
    return this.get('facetedSearchBaseUrl') + this.get('religionPath');
  };

  Config.prototype.socialClassUrl = function() {
    return this.get('facetedSearchBaseUrl') + this.get('socialClassPath');
  };

  Config.prototype.sourceCategoryUrl = function() {
    return this.get('facetedSearchBaseUrl') + this.get('sourceCategoryPath');
  };

  Config.prototype.genreUrl = function() {
    return this.get('facetedSearchBaseUrl') + this.get('genrePath');
  };

  Config.prototype.userInfoUrl = function() {
    return this.get('baseUrl') + this.get('userInfoPath');
  };

  Config.prototype.receptionsUrl = function() {
    return this.get('baseUrl') + this.get('receptionsPath') + this.get('VRE_ID');
  };

  Config.prototype.receptionsFor = function(type) {
    var r, receptions, _i, _len, _results;
    receptions = this.get('receptions');
    _results = [];
    for (_i = 0, _len = receptions.length; _i < _len; _i++) {
      r = receptions[_i];
      if (r.baseSourceType === type) {
        _results.push(r);
      }
    }
    return _results;
  };

  Config.prototype.personReceptions = function() {
    return this.receptionsFor('person');
  };

  Config.prototype.documentReceptions = function() {
    return this.receptionsFor('document');
  };

  Config.prototype.receptionTypeLabel = function(type) {
    return this.get('receptionTypeLabels')[type];
  };

  Config.prototype.mapGenderOption = function(o) {
    var options;
    options = {
      MALE: 'Male',
      FEMALE: 'Female',
      NOT_APPLICABLE: 'Neutral',
      UNKNOWN: 'Unknown'
    };
    return options[o];
  };

  Config.prototype.componentsToName = function(nameComponents) {
    var c, name, rest, surnames;
    surnames = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = nameComponents.length; _i < _len; _i++) {
        c = nameComponents[_i];
        if (c.type === 'SURNAME') {
          _results.push(c.value);
        }
      }
      return _results;
    })();
    rest = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = nameComponents.length; _i < _len; _i++) {
        c = nameComponents[_i];
        if (c.type !== 'SURNAME') {
          _results.push(c.value);
        }
      }
      return _results;
    })();
    name = surnames.join(" ");
    if (rest.length) {
      name += ", " + rest.join(" ");
    }
    return name;
  };

  Config.prototype.router = function() {
    return this.get('router');
  };

  return Config;

})(Backbone.Model);

module.exports = new Config;



},{"./base":"/home/gijs/Projects/women-writers/src/coffee/config/base.coffee","./env":"/home/gijs/Projects/women-writers/src/coffee/config/env.coffee","backbone":false,"underscore":false}],"/home/gijs/Projects/women-writers/src/coffee/helpers/base-view-helper.coffee":[function(require,module,exports){
var config, helpers, linkTemplate, nameComponentTemplate, nameTemplate;

config = require('../config');

linkTemplate = require('../../jade/views/base-link.jade');

nameComponentTemplate = require('../../jade/views/person/name-component.jade');

nameTemplate = require('../../jade/views/person/name.jade');

helpers = {
  relationField: function(name, title, map) {
    if (map == null) {
      map = {};
    }
    return {
      title: title,
      field: name,
      "in": '@relations',
      type: 'Array',
      group: true,
      map: function(value) {
        var all, el;
        all = (function() {
          var _i, _len, _ref, _results;
          _ref = value || [];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            el = _ref[_i];
            if (el.accepted) {
              if (config.viewUrl(el.id)) {
                _results.push(linkTemplate({
                  link: {
                    url: config.viewUrl(el.id),
                    label: el.displayName
                  }
                }));
              } else {
                _results.push(el.displayName);
              }
            }
          }
          return _results;
        })();
        return all;
      }
    };
  },
  namesMap: function(value) {
    var c, components, name, names, _i, _len;
    names = [];
    for (_i = 0, _len = value.length; _i < _len; _i++) {
      name = value[_i];
      components = (function() {
        var _j, _len1, _ref, _results;
        _ref = name.components;
        _results = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          c = _ref[_j];
          if (c.type != null) {
            _results.push(nameComponentTemplate(c));
          }
        }
        return _results;
      })();
      if (components.length) {
        names.push(nameTemplate({
          components: components
        }));
      }
    }
    return names;
  },
  linksMap: function(links) {
    var link, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = links.length; _i < _len; _i++) {
      link = links[_i];
      if (link.url != null) {
        _results.push(linkTemplate({
          link: link
        }));
      }
    }
    return _results;
  },
  externalLinksMap: function(links) {
    var link;
    links = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = links.length; _i < _len; _i++) {
        link = links[_i];
        if (!(link.url != null)) {
          continue;
        }
        link.external = true;
        _results.push(linkTemplate({
          link: link
        }));
      }
      return _results;
    })();
    return links;
  }
};

module.exports = helpers;



},{"../../jade/views/base-link.jade":"/home/gijs/Projects/women-writers/src/jade/views/base-link.jade","../../jade/views/person/name-component.jade":"/home/gijs/Projects/women-writers/src/jade/views/person/name-component.jade","../../jade/views/person/name.jade":"/home/gijs/Projects/women-writers/src/jade/views/person/name.jade","../config":"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee"}],"/home/gijs/Projects/women-writers/src/coffee/helpers/load-app-data.coffee":[function(require,module,exports){
var $, Backbone, config, loadPromise, loadedReceptions, loadedSourceCategories, loadedSources, searchQuery, _;

Backbone = require('backbone');

_ = require("underscore");

$ = Backbone.$ = require('jquery');

config = require('../config');

searchQuery = require('./search').searchQuery;

loadedReceptions = function() {
  var deferred;
  deferred = new $.Deferred();
  $.getJSON(config.receptionsUrl()).then(function(data) {
    config.set({
      receptions: data.receptions
    });
    return deferred.resolve();
  });
  return deferred;
};

loadedSources = function() {
  var deferred;
  deferred = new $.Deferred();
  searchQuery({
    query: {
      term: '*',
      facetValues: [
        {
          name: 'dynamic_b_is_source',
          values: ['true']
        }
      ]
    },
    options: {
      searchUrl: config.searchUrl('wwdocuments'),
      resultRows: 5000
    }
  }).then(function(data) {
    var byId, s;
    byId = _.groupBy(data.results, function(r) {
      return r._id;
    });
    config.set({
      sources: (function() {
        var _i, _len, _ref, _results;
        _ref = data.refs;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          s = _ref[_i];
          _results.push({
            id: s.id,
            title: s.displayName,
            notes: byId[s.id][0].notes
          });
        }
        return _results;
      })()
    });
    return deferred.resolve();
  });
  return deferred;
};

loadPromise = function(url, key) {
  var promise;
  promise = new $.Deferred();
  $.getJSON(url).then(function(data) {
    var el;
    config.set(key, (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        el = data[_i];
        _results.push({
          value: el._id,
          label: el.value
        });
      }
      return _results;
    })());
    return promise.resolve();
  });
  return promise;
};

loadedSourceCategories = function() {
  return loadPromise(config.sourceCategoryUrl(), 'sourceCategories');
};

module.exports = {
  loadSources: function() {
    return loadedSources();
  },
  loadAll: function() {
    return $.when(loadedReceptions(), loadedSourceCategories());
  }
};



},{"../config":"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee","./search":"/home/gijs/Projects/women-writers/src/coffee/helpers/search.coffee","backbone":false,"jquery":false,"underscore":false}],"/home/gijs/Projects/women-writers/src/coffee/helpers/load-edit-data.coffee":[function(require,module,exports){
var $, Backbone, config, searchQuery;

Backbone = require('backbone');

$ = Backbone.$ = require('jquery');

config = require('../config');

searchQuery = require('./search').searchQuery;

module.exports = function() {
  var l, languages, loadPromise, loadedEducations, loadedFinancialSituations, loadedGenres, loadedMaritalStatuses, loadedProfessions, loadedRelationTypesDocument, loadedRelationTypesPerson, loadedReligions, loadedSocialClasses;
  loadedRelationTypesPerson = new $.Deferred();
  $.getJSON(config.get('facetedSearchBaseUrl') + '/system/relationtypes?iname=wwperson').then(function(data) {
    var relationTypes, t, _i, _len;
    relationTypes = {};
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      t = data[_i];
      if (t.sourceTypeName === 'person') {
        relationTypes[t.regularName] = t;
      }
      if (t.targetTypeName === 'person') {
        relationTypes[t.inverseName] = t;
      }
    }
    config.set({
      personRelationTypes: relationTypes
    });
    return loadedRelationTypesPerson.resolve();
  });
  loadedRelationTypesDocument = new $.Deferred();
  $.getJSON(config.get('facetedSearchBaseUrl') + '/system/relationtypes?iname=wwdocument').then(function(data) {
    var relationTypes, t, _i, _len;
    relationTypes = {};
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      t = data[_i];
      relationTypes[t.regularName] = t;
    }
    config.set({
      documentRelationTypes: relationTypes
    });
    return loadedRelationTypesDocument.resolve();
  });
  languages = {
    "sortableFields": [],
    "numFound": 45,
    "results": [
      {
        "@type": "wwlanguage",
        "name": "Norwegian Nynorsk",
        "core": true,
        "_id": "LANG000000004747",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "nno",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000004747"
          }, {
            "type": "baselanguage",
            "id": "LANG000000004747"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000004747"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Swedish",
        "core": true,
        "_id": "LANG000000006131",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "swe",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000006131"
          }, {
            "type": "baselanguage",
            "id": "LANG000000006131"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000006131"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Italian",
        "core": true,
        "_id": "LANG000000002645",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "ita",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000002645"
          }, {
            "type": "baselanguage",
            "id": "LANG000000002645"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000002645"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Russian",
        "core": true,
        "_id": "LANG000000005658",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "rus",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000005658"
          }, {
            "type": "baselanguage",
            "id": "LANG000000005658"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000005658"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Galician",
        "core": true,
        "_id": "LANG000000002137",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "glg",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000002137"
          }, {
            "type": "baselanguage",
            "id": "LANG000000002137"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000002137"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Catalan",
        "core": true,
        "_id": "LANG000000001176",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "cat",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000001176"
          }, {
            "type": "baselanguage",
            "id": "LANG000000001176"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000001176"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Basque",
        "core": true,
        "_id": "LANG000000001880",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "eus",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000001880"
          }, {
            "type": "baselanguage",
            "id": "LANG000000001880"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000001880"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Breton",
        "core": true,
        "_id": "LANG000000000938",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "bre",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000000938"
          }, {
            "type": "baselanguage",
            "id": "LANG000000000938"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000000938"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Serbian",
        "core": true,
        "_id": "LANG000000006042",
        "^rev": 4,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "srp",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000006042"
          }, {
            "type": "baselanguage",
            "id": "LANG000000006042"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000006042"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Latin",
        "core": true,
        "_id": "LANG000000003487",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "lat",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000003487"
          }, {
            "type": "baselanguage",
            "id": "LANG000000003487"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000003487"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Spanish",
        "core": true,
        "_id": "LANG000000005996",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "spa",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000005996"
          }, {
            "type": "baselanguage",
            "id": "LANG000000005996"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000005996"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "French",
        "core": true,
        "_id": "LANG000000001948",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "fra",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000001948"
          }, {
            "type": "baselanguage",
            "id": "LANG000000001948"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000001948"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Esperanto",
        "core": true,
        "_id": "LANG000000001846",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "epo",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000001846"
          }, {
            "type": "baselanguage",
            "id": "LANG000000001846"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000001846"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Occitan (post 1500)",
        "core": true,
        "_id": "LANG000000004956",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "oci",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000004956"
          }, {
            "type": "baselanguage",
            "id": "LANG000000004956"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000004956"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Ukrainian",
        "core": true,
        "_id": "LANG000000006749",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "ukr",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000006749"
          }, {
            "type": "baselanguage",
            "id": "LANG000000006749"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000006749"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Ancient Hebrew",
        "core": true,
        "_id": "LANG000000002345",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "hbo",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000002345"
          }, {
            "type": "baselanguage",
            "id": "LANG000000002345"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000002345"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Romanian",
        "core": true,
        "_id": "LANG000000005628",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "ron",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000005628"
          }, {
            "type": "baselanguage",
            "id": "LANG000000005628"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000005628"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Armenian",
        "core": true,
        "_id": "LANG000000002506",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "hye",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000002506"
          }, {
            "type": "baselanguage",
            "id": "LANG000000002506"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000002506"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Arabic",
        "core": true,
        "_id": "LANG000000000348",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "ara",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000000348"
          }, {
            "type": "baselanguage",
            "id": "LANG000000000348"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000000348"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Ottoman Turkish (1500-1928)",
        "core": true,
        "_id": "LANG000000005079",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "ota",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000005079"
          }, {
            "type": "baselanguage",
            "id": "LANG000000005079"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000005079"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Western Frisian",
        "core": true,
        "_id": "LANG000000001959",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "fry",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000001959"
          }, {
            "type": "baselanguage",
            "id": "LANG000000001959"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000001959"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Persian",
        "core": true,
        "_id": "LANG000000001906",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "fas",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000001906"
          }, {
            "type": "baselanguage",
            "id": "LANG000000001906"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000001906"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Lithuanian",
        "core": true,
        "_id": "LANG000000003612",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "lit",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000003612"
          }, {
            "type": "baselanguage",
            "id": "LANG000000003612"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000003612"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Icelandic",
        "core": true,
        "_id": "LANG000000002638",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "isl",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000002638"
          }, {
            "type": "baselanguage",
            "id": "LANG000000002638"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000002638"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Croatian",
        "core": true,
        "_id": "LANG000000002458",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "hrv",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000002458"
          }, {
            "type": "baselanguage",
            "id": "LANG000000002458"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000002458"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Chinese",
        "core": true,
        "_id": "LANG000000007742",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "zho",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000007742"
          }, {
            "type": "baselanguage",
            "id": "LANG000000007742"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000007742"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Japanese",
        "core": true,
        "_id": "LANG000000002777",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "jpn",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000002777"
          }, {
            "type": "baselanguage",
            "id": "LANG000000002777"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000002777"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Uzbek",
        "core": true,
        "_id": "LANG000000006836",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "uzb",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000006836"
          }, {
            "type": "baselanguage",
            "id": "LANG000000006836"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000006836"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Portuguese",
        "core": true,
        "_id": "LANG000000005341",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "por",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000005341"
          }, {
            "type": "baselanguage",
            "id": "LANG000000005341"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000005341"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Irish",
        "core": true,
        "_id": "LANG000000002136",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "gle",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000002136"
          }, {
            "type": "baselanguage",
            "id": "LANG000000002136"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000002136"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Modern Greek (1453-)",
        "core": true,
        "_id": "LANG000000001809",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "ell",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000001809"
          }, {
            "type": "baselanguage",
            "id": "LANG000000001809"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000001809"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Polish",
        "core": true,
        "_id": "LANG000000005335",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "pol",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000005335"
          }, {
            "type": "baselanguage",
            "id": "LANG000000005335"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000005335"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Czech",
        "core": true,
        "_id": "LANG000000001232",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "ces",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000001232"
          }, {
            "type": "baselanguage",
            "id": "LANG000000001232"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000001232"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Finnish",
        "core": true,
        "_id": "LANG000000001922",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "fin",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000001922"
          }, {
            "type": "baselanguage",
            "id": "LANG000000001922"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000001922"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Turkish",
        "core": true,
        "_id": "LANG000000006631",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "tur",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000006631"
          }, {
            "type": "baselanguage",
            "id": "LANG000000006631"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000006631"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Bulgarian",
        "core": true,
        "_id": "LANG000000001019",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "bul",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000001019"
          }, {
            "type": "baselanguage",
            "id": "LANG000000001019"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000001019"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Slovenian",
        "core": true,
        "_id": "LANG000000005917",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "slv",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000005917"
          }, {
            "type": "baselanguage",
            "id": "LANG000000005917"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000005917"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Slovak",
        "core": true,
        "_id": "LANG000000005907",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "slk",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000005907"
          }, {
            "type": "baselanguage",
            "id": "LANG000000005907"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000005907"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "English",
        "core": true,
        "_id": "LANG000000001834",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "eng",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000001834"
          }, {
            "type": "baselanguage",
            "id": "LANG000000001834"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000001834"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "German",
        "core": true,
        "_id": "LANG000000001550",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "deu",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000001550"
          }, {
            "type": "baselanguage",
            "id": "LANG000000001550"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000001550"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Dutch",
        "core": true,
        "_id": "LANG000000004692",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "nld",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000004692"
          }, {
            "type": "baselanguage",
            "id": "LANG000000004692"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000004692"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Hungarian",
        "core": true,
        "_id": "LANG000000002484",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "hun",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000002484"
          }, {
            "type": "baselanguage",
            "id": "LANG000000002484"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000002484"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Estonian",
        "core": true,
        "_id": "LANG000000001867",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "est",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000001867"
          }, {
            "type": "baselanguage",
            "id": "LANG000000001867"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000001867"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Albanian",
        "core": true,
        "_id": "LANG000000006018",
        "^rev": 5,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "sqi",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000006018"
          }, {
            "type": "baselanguage",
            "id": "LANG000000006018"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000006018"
          }
        ]
      }, {
        "@type": "wwlanguage",
        "name": "Danish",
        "core": true,
        "_id": "LANG000000001492",
        "^rev": 2,
        "^created": {
          "timeStamp": 1429107283185,
          "userId": "importer",
          "vreId": "base"
        },
        "^modified": {
          "timeStamp": 1429107503869,
          "userId": "importer",
          "vreId": "neww"
        },
        "^pid": null,
        "^deleted": false,
        "@relationCount": 0,
        "@properties": {},
        "@relations": {},
        "^code": "dan",
        "@variationRefs": [
          {
            "type": "language",
            "id": "LANG000000001492"
          }, {
            "type": "baselanguage",
            "id": "LANG000000001492"
          }, {
            "type": "wwlanguage",
            "id": "LANG000000001492"
          }
        ]
      }
    ],
    "ids": ["LANG000000004747", "LANG000000006131", "LANG000000002645", "LANG000000005658", "LANG000000002137", "LANG000000001176", "LANG000000001880", "LANG000000000938", "LANG000000006042", "LANG000000003487", "LANG000000005996", "LANG000000001948", "LANG000000001846", "LANG000000004956", "LANG000000006749", "LANG000000002345", "LANG000000005628", "LANG000000002506", "LANG000000000348", "LANG000000005079", "LANG000000001959", "LANG000000001906", "LANG000000003612", "LANG000000002638", "LANG000000002458", "LANG000000007742", "LANG000000002777", "LANG000000006836", "LANG000000005341", "LANG000000002136", "LANG000000001809", "LANG000000005335", "LANG000000001232", "LANG000000001922", "LANG000000006631", "LANG000000001019", "LANG000000005917", "LANG000000005907", "LANG000000001834", "LANG000000001550", "LANG000000004692", "LANG000000002484", "LANG000000001867", "LANG000000006018", "LANG000000001492"],
    "start": 0,
    "rows": 45,
    "term": "*",
    "facets": null,
    "refs": [
      {
        "type": "wwlanguage",
        "id": "LANG000000004747",
        "path": "domain/wwlanguages/LANG000000004747",
        "displayName": "Norwegian Nynorsk",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000006131",
        "path": "domain/wwlanguages/LANG000000006131",
        "displayName": "Swedish",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000002645",
        "path": "domain/wwlanguages/LANG000000002645",
        "displayName": "Italian",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000005658",
        "path": "domain/wwlanguages/LANG000000005658",
        "displayName": "Russian",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000002137",
        "path": "domain/wwlanguages/LANG000000002137",
        "displayName": "Galician",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000001176",
        "path": "domain/wwlanguages/LANG000000001176",
        "displayName": "Catalan",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000001880",
        "path": "domain/wwlanguages/LANG000000001880",
        "displayName": "Basque",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000000938",
        "path": "domain/wwlanguages/LANG000000000938",
        "displayName": "Breton",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000006042",
        "path": "domain/wwlanguages/LANG000000006042",
        "displayName": "Serbian",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000003487",
        "path": "domain/wwlanguages/LANG000000003487",
        "displayName": "Latin",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000005996",
        "path": "domain/wwlanguages/LANG000000005996",
        "displayName": "Spanish",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000001948",
        "path": "domain/wwlanguages/LANG000000001948",
        "displayName": "French",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000001846",
        "path": "domain/wwlanguages/LANG000000001846",
        "displayName": "Esperanto",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000004956",
        "path": "domain/wwlanguages/LANG000000004956",
        "displayName": "Occitan (post 1500)",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000006749",
        "path": "domain/wwlanguages/LANG000000006749",
        "displayName": "Ukrainian",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000002345",
        "path": "domain/wwlanguages/LANG000000002345",
        "displayName": "Ancient Hebrew",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000005628",
        "path": "domain/wwlanguages/LANG000000005628",
        "displayName": "Romanian",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000002506",
        "path": "domain/wwlanguages/LANG000000002506",
        "displayName": "Armenian",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000000348",
        "path": "domain/wwlanguages/LANG000000000348",
        "displayName": "Arabic",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000005079",
        "path": "domain/wwlanguages/LANG000000005079",
        "displayName": "Ottoman Turkish (1500-1928)",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000001959",
        "path": "domain/wwlanguages/LANG000000001959",
        "displayName": "Western Frisian",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000001906",
        "path": "domain/wwlanguages/LANG000000001906",
        "displayName": "Persian",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000003612",
        "path": "domain/wwlanguages/LANG000000003612",
        "displayName": "Lithuanian",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000002638",
        "path": "domain/wwlanguages/LANG000000002638",
        "displayName": "Icelandic",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000002458",
        "path": "domain/wwlanguages/LANG000000002458",
        "displayName": "Croatian",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000007742",
        "path": "domain/wwlanguages/LANG000000007742",
        "displayName": "Chinese",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000002777",
        "path": "domain/wwlanguages/LANG000000002777",
        "displayName": "Japanese",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000006836",
        "path": "domain/wwlanguages/LANG000000006836",
        "displayName": "Uzbek",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000005341",
        "path": "domain/wwlanguages/LANG000000005341",
        "displayName": "Portuguese",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000002136",
        "path": "domain/wwlanguages/LANG000000002136",
        "displayName": "Irish",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000001809",
        "path": "domain/wwlanguages/LANG000000001809",
        "displayName": "Modern Greek (1453-)",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000005335",
        "path": "domain/wwlanguages/LANG000000005335",
        "displayName": "Polish",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000001232",
        "path": "domain/wwlanguages/LANG000000001232",
        "displayName": "Czech",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000001922",
        "path": "domain/wwlanguages/LANG000000001922",
        "displayName": "Finnish",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000006631",
        "path": "domain/wwlanguages/LANG000000006631",
        "displayName": "Turkish",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000001019",
        "path": "domain/wwlanguages/LANG000000001019",
        "displayName": "Bulgarian",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000005917",
        "path": "domain/wwlanguages/LANG000000005917",
        "displayName": "Slovenian",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000005907",
        "path": "domain/wwlanguages/LANG000000005907",
        "displayName": "Slovak",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000001834",
        "path": "domain/wwlanguages/LANG000000001834",
        "displayName": "English",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000001550",
        "path": "domain/wwlanguages/LANG000000001550",
        "displayName": "German",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000004692",
        "path": "domain/wwlanguages/LANG000000004692",
        "displayName": "Dutch",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000002484",
        "path": "domain/wwlanguages/LANG000000002484",
        "displayName": "Hungarian",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000001867",
        "path": "domain/wwlanguages/LANG000000001867",
        "displayName": "Estonian",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000006018",
        "path": "domain/wwlanguages/LANG000000006018",
        "displayName": "Albanian",
        "data": null
      }, {
        "type": "wwlanguage",
        "id": "LANG000000001492",
        "path": "domain/wwlanguages/LANG000000001492",
        "displayName": "Danish",
        "data": null
      }
    ],
    "fullTextSearchFields": ["dynamic_t_name"]
  };
  languages = (function() {
    var _i, _len, _ref, _results;
    _ref = languages.refs;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      l = _ref[_i];
      _results.push({
        value: l.id,
        label: l.displayName
      });
    }
    return _results;
  })();
  config.set("languages", languages);
  loadPromise = function(url, key) {
    var promise;
    promise = new $.Deferred();
    $.getJSON(url).then(function(data) {
      var el;
      config.set(key, (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          el = data[_i];
          _results.push({
            value: el._id,
            label: el.value
          });
        }
        return _results;
      })());
      return promise.resolve();
    });
    return promise;
  };
  loadedEducations = loadPromise(config.educationUrl(), 'educations');
  loadedFinancialSituations = loadPromise(config.financialSituationUrl(), 'financialSituations');
  loadedMaritalStatuses = loadPromise(config.maritalStatusUrl(), 'maritalStatuses');
  loadedProfessions = loadPromise(config.professionUrl(), 'professions');
  loadedReligions = loadPromise(config.religionUrl(), 'religions');
  loadedSocialClasses = loadPromise(config.socialClassUrl(), 'socialClasses');
  loadedGenres = loadPromise(config.genreUrl(), 'genres');
  return $.when(loadedRelationTypesPerson, loadedRelationTypesDocument, loadedEducations, loadedFinancialSituations, loadedMaritalStatuses, loadedProfessions, loadedReligions, loadedSocialClasses, loadedGenres);
};



},{"../config":"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee","./search":"/home/gijs/Projects/women-writers/src/coffee/helpers/search.coffee","backbone":false,"jquery":false}],"/home/gijs/Projects/women-writers/src/coffee/helpers/reception-service.coffee":[function(require,module,exports){
var Backbone, ReceptionService, config;

Backbone = require('backbone');

config = require('../config');

ReceptionService = (function() {
  function ReceptionService(options) {
    var _ref;
    if (options == null) {
      options = {};
    }
    this.searchUrl = (_ref = options.url) != null ? _ref : config.get('baseUrl') + config.get('relationSearchPath');
    this.lastSearch = null;
  }

  ReceptionService.prototype.search = function(parameters, numRows) {
    var fetchResults, searchOptions;
    if (parameters == null) {
      parameters = {};
    }
    if (numRows == null) {
      numRows = 100;
    }
    searchOptions = {
      url: this.searchUrl,
      headers: {
        VRE_ID: config.get('VRE_ID')
      },
      type: 'POST',
      data: JSON.stringify(parameters),
      contentType: 'application/json'
    };
    fetchResults = (function(_this) {
      return function(data, status, request) {
        _this.lastSearchUrl = request.getResponseHeader('Location');
        return Backbone.$.getJSON(_this.lastSearchUrl + '?rows=' + numRows);
      };
    })(this);
    return Backbone.$.ajax(searchOptions).then(fetchResults);
  };

  ReceptionService.prototype.setResultRows = function(numRows) {
    return Backbone.$.getJSON(this.lastSearchUrl + '?rows=' + numRows);
  };

  return ReceptionService;

})();

module.exports = ReceptionService;



},{"../config":"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee","backbone":false}],"/home/gijs/Projects/women-writers/src/coffee/helpers/search.coffee":[function(require,module,exports){
var Backbone, FacetedSearch, config, createFacetedSearch, escapeTerm, facetPlaceholderList, facetedSearchMainTemplate, searchLocation, searchQuery, simpleSearch, _;

Backbone = require('backbone');

_ = require("underscore");

FacetedSearch = require('huygens-faceted-search/src/coffee/main');

facetedSearchMainTemplate = require('../../jade/faceted-search/main.jade');

config = require('../config');

facetPlaceholderList = function(facets) {
  var f, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = facets.length; _i < _len; _i++) {
    f = facets[_i];
    _results.push("<div class='" + f + "-placeholder'></div>");
  }
  return _results;
};

createFacetedSearch = function(searchCfg) {
  var collapsed, facetTitleMap, options, queryOptions, resultRows, templates, textSearchTitleMap;
  if (searchCfg == null) {
    searchCfg = {};
  }
  queryOptions = searchCfg.queryOptions, facetTitleMap = searchCfg.facetTitleMap, textSearchTitleMap = searchCfg.textSearchTitleMap, resultRows = searchCfg.resultRows, collapsed = searchCfg.collapsed, templates = searchCfg.templates;
  if (collapsed == null) {
    collapsed = true;
  }
  options = {
    baseUrl: config.get('baseUrl'),
    searchPath: config.searchPath(searchCfg.type),
    requestOptions: {
      headers: {
        VRE_ID: config.get('VRE_ID')
      }
    },
    queryOptions: queryOptions,
    resultRows: config.get('resultRows'),
    facetTitleMap: facetTitleMap,
    startCollapsed: collapsed,
    textSearchTitleMap: textSearchTitleMap,
    autoSearch: true,
    templates: {
      main: facetedSearchMainTemplate
    }
  };
  if (templates != null) {
    _.extend(options.templates, templates);
  }
  return new FacetedSearch(options);
};

searchQuery = function(args) {
  var deferred, options, query, req;
  query = args.query, options = args.options;
  deferred = Backbone.$.Deferred();
  req = Backbone.$.ajax({
    type: 'POST',
    url: options.searchUrl,
    data: JSON.stringify(query),
    dataType: 'text',
    contentType: 'application/json; charset=utf-8',
    headers: {
      VRE_ID: options.vreId || config.get('VRE_ID')
    }
  });
  req.done((function(_this) {
    return function(data, textStatus, jqXHR) {
      var locationUrl;
      if (jqXHR.status === 201) {
        locationUrl = jqXHR.getResponseHeader('location');
        if (options.resultRows) {
          locationUrl += '?rows=' + options.resultRows;
        }
        return Backbone.$.getJSON(locationUrl).done(function(data) {
          return deferred.resolve(data);
        });
      }
    };
  })(this));
  req.fail((function(_this) {
    return function(jqXHR, textStatus, errorThrown) {
      if (typeof console !== "undefined" && console !== null) {
        console.error('Failed search', textStatus, errorThrown);
      }
      return deferred.reject();
    };
  })(this));
  return deferred.promise();
};

simpleSearch = function(term, type, limit, queryOptions) {
  var escaped;
  if (limit == null) {
    limit = 500;
  }
  if (queryOptions == null) {
    queryOptions = {};
  }
  escaped = escapeTerm(term);
  _.defaults(queryOptions, {
    term: "*" + escaped + "*",
    typeString: type
  });
  return searchQuery({
    query: queryOptions,
    options: {
      searchUrl: config.searchUrl(type + 's'),
      resultRows: limit
    }
  });
};

searchLocation = function(term, type, limit, vreId) {
  var escaped, queryOptions;
  if (type == null) {
    type = 'location';
  }
  if (limit == null) {
    limit = 500;
  }
  if (vreId == null) {
    vreId = config.get('adminVreId');
  }
  escaped = escapeTerm(term);
  queryOptions = {
    term: "*" + escaped + "*",
    typeString: type
  };
  return searchQuery({
    query: queryOptions,
    options: {
      searchUrl: config.searchUrl(type + 's'),
      resultRows: limit,
      vreId: vreId
    }
  });
};

escapeTerm = function(term) {
  var char, escaped, special, _i, _len;
  special = '+ - & | ! ( ) { } [ ] ^ " ~ * ? : \ '.split(/\s+/);
  escaped = term;
  for (_i = 0, _len = special.length; _i < _len; _i++) {
    char = special[_i];
    escaped = term.replace(/#{char}/g, '\\' + char);
  }
  return escaped;
};

module.exports = {
  createFacetedSearch: createFacetedSearch,
  searchQuery: searchQuery,
  searchLocation: searchLocation,
  simpleSearch: simpleSearch,
  escapeTerm: escapeTerm
};



},{"../../jade/faceted-search/main.jade":"/home/gijs/Projects/women-writers/src/jade/faceted-search/main.jade","../config":"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee","backbone":false,"huygens-faceted-search/src/coffee/main":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/main.coffee","underscore":false}],"/home/gijs/Projects/women-writers/src/coffee/models/base.coffee":[function(require,module,exports){
var Backbone, BaseModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

BaseModel = (function(_super) {
  __extends(BaseModel, _super);

  function BaseModel() {
    return BaseModel.__super__.constructor.apply(this, arguments);
  }

  BaseModel.prototype.idAttribute = '_id';

  BaseModel.prototype.fetchVersion = function(version) {
    return this.fetch({
      url: "" + this.urlRoot + "/" + this.id + "?rev=" + version
    });
  };

  return BaseModel;

})(Backbone.Model);

module.exports = BaseModel;



},{"backbone":false}],"/home/gijs/Projects/women-writers/src/coffee/models/document.coffee":[function(require,module,exports){
var $, BaseModel, Document, config, types,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

$ = require("jquery");

BaseModel = require('./base');

config = require('../config');

types = {
  hasGenre: "wwrelation",
  hasPublishLocation: "wwrelation",
  hasWorkLanguage: "wwrelation",
  isCreatedBy: "wwrelation"
};

Document = (function(_super) {
  __extends(Document, _super);

  function Document() {
    return Document.__super__.constructor.apply(this, arguments);
  }

  Document.prototype.defaults = {
    "@type": "wwdocument"
  };

  Document.prototype.urlRoot = config.allDocumentsUrl();

  Document.prototype.parseFormData = function(formData) {
    var data;
    data = this._nameValueToObject(formData);
    delete data["hasGenre"];
    delete data["hasPublishLocation"];
    delete data["hasWorkLanguage"];
    delete data["isCreatedBy"];
    this.set(data);
    return JSON.stringify(this.attributes);
  };

  Document.prototype.saveRelation = function(name, sourceId, targetId) {
    var data, relation;
    relation = config.get("documentRelationTypes")[name];
    data = {
      "accepted": true,
      "@type": types[name],
      "^typeId": relation._id,
      "^sourceId": sourceId,
      "^sourceType": relation.sourceTypeName,
      "^targetId": targetId,
      "^targetType": relation.targetTypeName
    };
    return $.ajax({
      url: "https://acc.repository.huygens.knaw.nl/domain/wwrelations",
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      headers: {
        VRE_ID: "WomenWriters",
        Authorization: localStorage.getItem("hi-womenwriters-auth-token")
      }
    });
  };

  Document.prototype._nameValueToObject = function(arr) {
    var reducer;
    reducer = function(prev, curr) {
      prev[curr.name] = curr.value;
      return prev;
    };
    return arr.reduce(reducer, {});
  };

  return Document;

})(BaseModel);

module.exports = Document;



},{"../config":"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee","./base":"/home/gijs/Projects/women-writers/src/coffee/models/base.coffee","jquery":false}],"/home/gijs/Projects/women-writers/src/coffee/models/graph.coffee":[function(require,module,exports){
var Backbone, Graph,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

Graph = (function(_super) {
  __extends(Graph, _super);

  function Graph() {
    return Graph.__super__.constructor.apply(this, arguments);
  }

  Graph.prototype.nodes = function() {
    return this.get('nodes');
  };

  Graph.prototype.links = function() {
    return this.get('links');
  };

  return Graph;

})(Backbone.Model);

module.exports = Graph;



},{"backbone":false}],"/home/gijs/Projects/women-writers/src/coffee/models/person.coffee":[function(require,module,exports){
var BaseModel, Person, config,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseModel = require('./base');

config = require('../config');

Person = (function(_super) {
  __extends(Person, _super);

  function Person() {
    return Person.__super__.constructor.apply(this, arguments);
  }

  Person.prototype.defaults = {
    "@type": "wwperson"
  };

  Person.prototype.urlRoot = config.allPersonsUrl();

  Person.prototype.parseFormData = function(formData) {
    var data;
    data = this._nameValueToObject(formData);
    data["names"] = [];
    data["names"].push(this._parseNames(data["first-name"], data["last-name"]));
    delete data["first-name"];
    delete data["last-name"];
    data["types"] = [data["types"]];
    this.set(data);
    return JSON.stringify(this.attributes);
  };

  Person.prototype._parseNames = function(first, last) {
    return {
      "components": [
        {
          "type": "FORENAME",
          "value": first
        }, {
          "type": "SURNAME",
          "value": last
        }
      ]
    };
  };

  Person.prototype._nameValueToObject = function(arr) {
    var reducer;
    reducer = function(prev, curr) {
      prev[curr.name] = curr.value;
      return prev;
    };
    return arr.reduce(reducer, {});
  };

  return Person;

})(BaseModel);

module.exports = Person;



},{"../config":"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee","./base":"/home/gijs/Projects/women-writers/src/coffee/models/base.coffee"}],"/home/gijs/Projects/women-writers/src/coffee/routers/main.coffee":[function(require,module,exports){
var Backbone, MainRouter, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

MainRouter = (function(_super) {
  __extends(MainRouter, _super);

  function MainRouter() {
    return MainRouter.__super__.constructor.apply(this, arguments);
  }

  MainRouter.prototype.routes = {
    'persons(/)': 'showPersonSearch',
    'persons/:id(/)': 'showPersonView',
    'persons/:id/:version': 'showPersonView',
    'persons/:id/edit': 'showPersonForm',
    'persons/:id/graph': 'showPersonGraph',
    'documents(/)': 'showDocumentSearch',
    'documents/:id(/)': 'showDocumentView',
    'documents/:id/:version': 'showDocumentView',
    'documents/:id/edit': 'showDocumentForm',
    'sources/:id(/)': 'showSourceView',
    'sources(/)': 'showSourceList',
    'receptions(/)': 'showReceptionSearch',
    '': 'home'
  };

  MainRouter.prototype.initialize = function(options) {
    MainRouter.__super__.initialize.apply(this, arguments);
    this.controller = options.controller, this.root = options.root;
    return this.processRoutes();
  };

  MainRouter.prototype.start = function() {
    return Backbone.history.start({
      root: this.root,
      pushState: true
    });
  };

  MainRouter.prototype.processRoutes = function() {
    var method, methodName, route, _ref, _results;
    _ref = this.routes;
    _results = [];
    for (route in _ref) {
      methodName = _ref[route];
      if (!(methodName in this.controller)) {
        continue;
      }
      method = _.bind(this.controller[methodName], this.controller);
      _results.push(this.route(route, methodName, method));
    }
    return _results;
  };

  return MainRouter;

})(Backbone.Router);

module.exports = MainRouter;



},{"backbone":false,"underscore":false}],"/home/gijs/Projects/women-writers/src/coffee/views/base-search.coffee":[function(require,module,exports){
var $, Backbone, LoginComponent, SearchView, config, createFacetedSearch, resultsTemplate, searchTemplate, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

$ = Backbone.$;

searchTemplate = require('../../jade/views/search.jade');

resultsTemplate = require('../../jade/views/search-results.jade');

createFacetedSearch = require('../helpers/search.coffee').createFacetedSearch;

config = require('../config');

LoginComponent = require('hibb-login');

SearchView = (function(_super) {
  __extends(SearchView, _super);

  function SearchView() {
    return SearchView.__super__.constructor.apply(this, arguments);
  }

  SearchView.prototype.template = searchTemplate;

  SearchView.prototype.resultsTemplate = resultsTemplate;

  SearchView.prototype.events = {
    'click .cursor .next': 'nextResults',
    'click .cursor .prev': 'prevResults',
    'change .order-by select': 'sortResults'
  };

  SearchView.prototype.initialize = function(options) {
    var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
    this.options = options != null ? options : {};
    _.extend(this, Backbone.Events);
    this.type = (_ref = this.options.type) != null ? _ref : this.type;
    this.textSearchTitleMap = (_ref1 = this.options.textSearchTitleMap) != null ? _ref1 : this.textSearchTitleMap;
    this.queryOptions = (_ref2 = this.options.queryOptions) != null ? _ref2 : this.queryOptions;
    this.facets = (_ref3 = this.options.facets) != null ? _ref3 : this.facets;
    this.facetTitleMap = (_ref4 = this.options.facetTitleMap) != null ? _ref4 : this.facetTitleMap;
    this.sortableFieldsMap = (_ref5 = (_ref6 = this.options.sortableFieldsMap) != null ? _ref6 : this.sortableFieldsMap) != null ? _ref5 : {};
    this.startCollapsed = (_ref7 = this.options.startCollapsed) != null ? _ref7 : this.startCollapsed;
    this.fsTemplates = (_ref8 = this.options.templates) != null ? _ref8 : this.fsTemplates;
    this.search = createFacetedSearch({
      type: this.type,
      queryOptions: this.queryOptions,
      facets: this.facets,
      facetTitleMap: this.facetTitleMap,
      textSearchTitleMap: this.textSearchTitleMap,
      collapsed: this.startCollapsed,
      templates: this.fsTemplates
    });
    this.search.$el.find('.facets-menu').hide();
    this.listenToOnce(this.search, 'change:results', (function(_this) {
      return function(results) {
        return _this.search.$el.find('.facets-menu').show();
      };
    })(this));
    return this.listenTo(this.search, 'change:results', (function(_this) {
      return function(results) {
        config.set({
          currentResultIds: results.get('ids')
        });
        return _this.renderResults(results);
      };
    })(this));
  };

  SearchView.prototype.nextResults = function() {
    this.showLoader();
    return this.search.next();
  };

  SearchView.prototype.prevResults = function() {
    this.showLoader();
    return this.search.prev();
  };

  SearchView.prototype.sortResults = function(e) {
    var oldSortField;
    oldSortField = this.sortField;
    this.sortField = $(e.currentTarget).val();
    if (this.sortField !== oldSortField) {
      return this.search.sortResultsBy(this.sortField);
    }
  };

  SearchView.prototype.resetSearch = function() {
    return this.search.reset();
  };

  SearchView.prototype.showLoader = function() {
    var doIt;
    this.displayLoader = true;
    doIt = (function(_this) {
      return function() {
        if (_this.displayLoader) {
          _this.$('.cursor .position').hide();
          return _this.$('.cursor .loader').fadeIn(150);
        }
      };
    })(this);
    return _.delay(doIt, 200);
  };

  SearchView.prototype.renderResults = function(rsp) {
    var byId, r, _i, _len, _ref;
    byId = {};
    _ref = rsp.get('results');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      r = _ref[_i];
      byId[r._id] = r;
    }
    this.$('.results').html(this.resultsTemplate({
      response: rsp.attributes,
      sortableFieldsMap: this.sortableFieldsMap,
      objectUrl: this.objectUrl,
      config: config,
      sortedBy: this.sortField,
      showCurated: function(o) {
        var isCurated;
        isCurated = byId[o.id]['^modified'].userId !== 'importer';
        return isCurated && LoginComponent.getUser().isLoggedIn();
      }
    }));
    this.$('.cursor .loader').hide();
    this.$('.cursor .position').show();
    this.displayLoader = false;
    this.$('.cursor .next').toggle(this.search.hasNext());
    this.$('.cursor .prev').toggle(this.search.hasPrev());
    return this.$('.results').css('counter-reset', "li-result " + rsp.attributes.start);
  };

  SearchView.prototype.render = function() {
    this.$el.html(this.template());
    this.$('.search').html(this.search.el);
    return this.search.search();
  };

  return SearchView;

})(Backbone.View);

module.exports = SearchView;



},{"../../jade/views/search-results.jade":"/home/gijs/Projects/women-writers/src/jade/views/search-results.jade","../../jade/views/search.jade":"/home/gijs/Projects/women-writers/src/jade/views/search.jade","../config":"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee","../helpers/search.coffee":"/home/gijs/Projects/women-writers/src/coffee/helpers/search.coffee","backbone":false,"hibb-login":"/home/gijs/Projects/women-writers/node_modules/hibb-login/dist/index.js","underscore":false}],"/home/gijs/Projects/women-writers/src/coffee/views/base-view.coffee":[function(require,module,exports){
var Backbone, BaseView, LoginComponent, niceify, slugify, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

Backbone = require('backbone');

_ = require("underscore");

LoginComponent = require('hibb-login');

niceify = function(str) {
  return String(str).replace(/([A-Z](?![A-Z]))/g, ' $1').replace(/^./, function(s) {
    return s.toUpperCase();
  });
};

slugify = function(str) {
  if (str == null) {
    str = "";
  }
  return String(str).replace(/([A-Z](?![A-Z]))/g, '-$1').toLowerCase();
};

BaseView = (function(_super) {
  __extends(BaseView, _super);

  function BaseView() {
    return BaseView.__super__.constructor.apply(this, arguments);
  }

  BaseView.prototype.tagName = 'div';

  BaseView.prototype.fieldsetTemplate = require('../../jade/views/base-fieldset.jade');

  BaseView.prototype.fieldTemplate = require('../../jade/views/base-field.jade');

  BaseView.prototype.events = {
    'click .controls .delete': 'deleteRecord'
  };

  BaseView.prototype.initialize = function(options) {
    if (options == null) {
      options = {};
    }
    this.config = options.config, this.showingRevision = options.showingRevision;
    if (this.config == null) {
      this.config = require('../config');
    }
    return this.render();
  };

  BaseView.prototype.isReception = function(r) {
    var receptions, rel, _i, _len, _ref;
    receptions = this.config.get('receptions');
    _ref = receptions || [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      rel = _ref[_i];
      if (r === rel.regularName || r === rel.inverseName) {
        return true;
      }
      false;
    }
  };

  BaseView.prototype.getReceptions = function() {
    var relType, relations, results, _i, _len, _ref;
    relations = this.model.get('@relations');
    results = {};
    _ref = _.keys(relations);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      relType = _ref[_i];
      if (this.isReception(relType)) {
        results[relType] = relations[relType];
      }
    }
    return results;
  };

  BaseView.prototype.deleteRecord = function() {
    var btn;
    btn = this.$('.controls .delete');
    if (btn.hasClass('confirm')) {
      return this.model.destroy({
        beforeSend: (function(_this) {
          return function(xhr) {
            xhr.setRequestHeader('Authorization', LoginComponent.getUser().getToken());
            return xhr.setRequestHeader('VRE_ID', _this.config.get('VRE_ID'));
          };
        })(this)
      }).success((function(_this) {
        return function() {
          return console.log("OMG");
        };
      })(this)).fail((function(_this) {
        return function() {
          alert("Could not delete record");
          btn.removeClass('confirm');
          btn.removeClass('red');
          btn.addClass('gray');
          return btn.removeClass('alert');
        };
      })(this));
    } else {
      btn.toggleClass('confirm');
      btn.toggleClass('red');
      btn.toggleClass('gray');
      return btn.addClass('alert');
    }
  };

  BaseView.prototype.showControls = function(toggle) {
    var _ref;
    return (_ref = this.$controls) != null ? _ref.toggle(LoginComponent.getUser().isLoggedIn()) : void 0;
  };

  BaseView.prototype._processField = function(field) {
    field.html = this._fieldHtml(field);
    return field;
  };

  BaseView.prototype._processFieldset = function(fieldset) {
    var field, idx, m, matcher, matchingFields, maybeMap, newField, store, subfield, val, values, _i, _j, _len, _len1, _ref, _ref1, _ref2;
    values = {};
    _ref = fieldset.fields;
    for (idx = _i = 0, _len = _ref.length; _i < _len; idx = ++_i) {
      field = _ref[idx];
      matcher = field.field != null ? field.field : field;
      store = field["in"] != null ? this.model.get(field["in"]) : this.model.attributes;
      maybeMap = (function(_this) {
        return function(v) {
          if (field.map != null) {
            return field.map(v, _this.model);
          } else {
            return v;
          }
        };
      })(this);
      if (_.isRegExp(matcher)) {
        for (subfield in store) {
          val = store[subfield];
          if (subfield.match(matcher)) {
            values[subfield] = maybeMap(val);
          }
        }
      } else {
        values[matcher] = maybeMap(store[matcher]);
      }
    }
    _ref1 = fieldset.fields;
    for (idx = _j = 0, _len1 = _ref1.length; _j < _len1; idx = ++_j) {
      field = _ref1[idx];
      matcher = _.isRegExp(field) ? field : _.isRegExp(field.field) ? field.field : void 0;
      if (!matcher) {
        continue;
      }
      matchingFields = (function() {
        var _k, _len2, _ref2, _results;
        _ref2 = _.keys(values);
        _results = [];
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          m = _ref2[_k];
          if (!(m.match(matcher))) {
            continue;
          }
          newField = field.field != null ? _.clone(field) : {};
          newField.field = m;
          newField.value = values[m];
          _results.push(newField);
        }
        return _results;
      })();
      (_ref2 = fieldset.fields).splice.apply(_ref2, [idx, 1].concat(__slice.call(matchingFields)));
    }
    return values;
  };

  BaseView.prototype._fieldHtml = function(field) {
    var data, html, noValue, value;
    html = "";
    value = field.value;
    data = _.extend(_.clone(field), {
      title: field.title != null ? niceify(field.title) : field.field,
      value: value
    });
    if (field.formatNewlines === true) {
      value = String(value != null ? value : '').replace(/\n/g, '<br>');
    }
    data.classes = ["field-" + slugify(data.field)];
    if (data.newLine) {
      data.classes.push('new-line');
    }
    if (data.large) {
      data.classes.push('large');
    }
    noValue = data.value === '' || data.value === void 0 || (_.isArray(data.value) && data.value.length === 0) || (data.value == null);
    if (noValue) {
      data.classes.push('no-value');
    }
    html = this.fieldTemplate({
      field: data
    });
    return html;
  };

  BaseView.prototype._fieldsetHtml = function(fieldset) {
    var data, field, idx, noValues, _i, _len, _ref;
    data = this._processFieldset(fieldset);
    noValues = 0;
    _ref = fieldset.fields;
    for (idx = _i = 0, _len = _ref.length; _i < _len; idx = ++_i) {
      field = _ref[idx];
      if (_.isString(field)) {
        field = {
          title: field,
          field: field,
          type: 'Text',
          value: data[field]
        };
      } else {
        field.value = data[field.field];
      }
      field.html = this._fieldHtml(field);
      fieldset.fields[idx] = field;
      if (field.html.match(/no-value/)) {
        noValues++;
      }
    }
    if (noValues === fieldset.fields.length) {
      fieldset.empty = true;
    }
    return this.fieldsetTemplate({
      fieldset: fieldset
    });
  };

  BaseView.prototype.renderFieldsets = function() {
    var fieldset, html, _i, _len, _ref, _ref1, _results;
    this.$fieldsets.empty();
    _ref1 = (_ref = this.fieldsets) != null ? _ref : [];
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      fieldset = _ref1[_i];
      if (fieldset.showOnlyWhenLoggedIn && !LoginComponent.getUser().isLoggedIn()) {
        continue;
      }
      html = this._fieldsetHtml(fieldset);
      _results.push(this.$fieldsets.append(html));
    }
    return _results;
  };

  BaseView.prototype.render = function() {
    var canEdit, hasPid, isDeleted, nextId, nextIdx, prevId, prevIdx, resultIds, resultIndex;
    hasPid = this.model.get('^pid') != null;
    isDeleted = this.model.get('^deleted');
    canEdit = hasPid && !isDeleted;
    resultIds = this.config.get('currentResultIds') || [];
    resultIndex = resultIds.indexOf(this.model.id);
    if (resultIndex > -1) {
      if (resultIndex - 1 >= 0) {
        prevIdx = resultIndex - 1;
      }
      if (prevIdx > -1) {
        prevId = resultIds[prevIdx];
      }
      if (resultIndex + 1 < resultIds.length) {
        nextIdx = resultIndex + 1;
      }
      if (nextIdx) {
        nextId = resultIds[nextIdx];
      }
    }
    this.$el.html(this.template({
      data: this.model.attributes,
      modified: this.model.get('^modified'),
      canEdit: hasPid,
      isDeleted: isDeleted,
      showingRevision: this.showingRevision,
      componentsToName: this.config.componentsToName,
      config: this.config,
      nextId: nextId,
      prevId: prevId,
      resultIndex: resultIndex + 1,
      resultTotal: resultIds.length,
      versions: [],
      revisions: [],
      receptions: this.getReceptions()
    }));
    this.$controls = this.$('.controls');
    this.showControls();
    this.$fieldsets = this.$('.fieldsets');
    return this.renderFieldsets();
  };

  return BaseView;

})(Backbone.View);

module.exports = BaseView;



},{"../../jade/views/base-field.jade":"/home/gijs/Projects/women-writers/src/jade/views/base-field.jade","../../jade/views/base-fieldset.jade":"/home/gijs/Projects/women-writers/src/jade/views/base-fieldset.jade","../config":"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee","backbone":false,"hibb-login":"/home/gijs/Projects/women-writers/node_modules/hibb-login/dist/index.js","underscore":false}],"/home/gijs/Projects/women-writers/src/coffee/views/document/edit.coffee":[function(require,module,exports){
var Backbone, Document, LoginComponent, StatusIndicator, config, documentDescription, searchLocation, simpleSearch, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

config = require('../../config');

documentDescription = require('../../../data/metadata/wwdocument.json');

StatusIndicator = require('../status');

_ref = require('../../helpers/search'), simpleSearch = _ref.simpleSearch, searchLocation = _ref.searchLocation;

LoginComponent = require('hibb-login');

Document = (function(_super) {
  __extends(Document, _super);

  function Document() {
    return Document.__super__.constructor.apply(this, arguments);
  }

  Document.prototype.className = 'document-edit';

  Document.prototype.template = require('../../../jade/views/document/edit.jade');

  Document.prototype.receptionOf = 'timbuctoo-relation.receptionOf';

  Document.prototype.receivedIn = 'timbuctoo-relation.receivedIn';

  Document.prototype.relationTypes = ['hasDocumentSource', 'hasWorkLanguage', 'hasGenre', 'hasPublishLocation', 'hasSourceCategory', 'isCreatedBy'];

  Document.prototype.events = {
    'click .save': 'save',
    'click .cancel': 'cancel'
  };

  Document.prototype.save = function() {
    var errors, margin, result, status, top, _ref1;
    status = new StatusIndicator;
    _ref1 = this.form.save(), result = _ref1.result, errors = _ref1.errors;
    if (errors == null) {
      status.show().loading();
      result.error((function(_this) {
        return function(rsp, data) {
          var e, errorMessage;
          try {
            errorMessage = JSON.parse(rsp.responseText).message;
          } catch (_error) {
            e = _error;
            errorMessage = rsp.status;
          }
          console.log(errorMessage);
          return status.show().error(errorMessage);
        };
      })(this));
      return result.done((function(_this) {
        return function() {
          return _this.model.fetch().done(function() {
            return status.show().success(function() {
              return config.router().navigate(config.documentViewPath(_this.model.id), {
                trigger: true
              });
            });
          });
        };
      })(this));
    } else {
      margin = 100;
      top = this.$('.field.error').first().offset().top;
      return Backbone.$('html, body').animate({
        scrollTop: top - margin
      });
    }
  };

  Document.prototype.initialize = function() {
    this.render();
    return this.model.on('sync', (function(_this) {
      return function() {
        return _this.render();
      };
    })(this));
  };

  Document.prototype.render = function() {
    var autocompleteFactory, receivedInTypes, receptionOfTypes, relationType, schema, type, _i, _len, _ref1;
    this.$el.html(this.template({
      config: config,
      document: this.model.attributes
    }));
    schema = createTimbuctooSchema(documentDescription, {
      exclude: [/^[_@^]/, 'DELETED', 'ID', 'PID', 'ROLES', 'VARIATIONS', 'names', 'topoi', 'resourceFormat', 'resourceType', 'rights', 'description'],
      readonly: [/^temp/]
    });
    schema['notes'].type = 'TextArea';
    _ref1 = this.relationTypes;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      type = _ref1[_i];
      relationType = config.get('documentRelationTypes')[type];
      schema["timbuctoo-relation." + type] = {
        type: 'Relation',
        relationTypeDescription: {
          relationTypeVariation: config.get('relationTypeVariation'),
          baseSourceType: relationType.sourceTypeName,
          baseTargetType: relationType.targetTypeName,
          typeId: relationType._id
        }
      };
    }
    _.extend(schema['timbuctoo-relation.hasWorkLanguage'], {
      title: 'Language',
      options: config.get('languages'),
      onlyOne: true,
      relationTypeHelper: new DynamicRelationTypeHelper()
    });
    _.extend(schema['timbuctoo-relation.hasGenre'], {
      title: 'Genre',
      options: config.get('genres'),
      onlyOne: true,
      relationTypeHelper: new DynamicRelationTypeHelper()
    });
    _.extend(schema['timbuctoo-relation.hasPublishLocation'], {
      title: 'Publish location',
      autocomplete: function(value) {
        return searchLocation(value);
      },
      onlyOne: true,
      relationTypeHelper: new DynamicRelationTypeHelper()
    });
    _.extend(schema['timbuctoo-relation.hasSourceCategory'], {
      title: 'Has source categories',
      onlyOne: false,
      options: config.get('sourceCategories'),
      relationTypeHelper: new DynamicRelationTypeHelper()
    });
    _.extend(schema['timbuctoo-relation.hasDocumentSource'], {
      title: 'Has sources',
      onlyOne: false,
      autocomplete: function(value) {
        return simpleSearch(value, 'wwdocument', 5000);
      },
      relationTypeHelper: new DynamicRelationTypeHelper(),
      placeholderString: 'Sources'
    });
    _.extend(schema['timbuctoo-relation.isCreatedBy'], {
      title: 'Creator',
      onlyOne: false,
      autocomplete: function(value) {
        return simpleSearch(value, 'wwperson', 5000);
      },
      relationTypeHelper: new DynamicRelationTypeHelper(),
      placeholderString: 'Persons'
    });
    receivedInTypes = _.filter(config.get('receptions'), function(r) {
      return r.baseSourceType === 'document';
    });
    receptionOfTypes = _.filter(config.get('receptions'), function(r) {
      return r.baseTargetType === 'document';
    });
    autocompleteFactory = function(relatedType) {
      var query;
      query = function(value) {
        return simpleSearch(value, relatedType, 5000);
      };
      return query;
    };
    schema[this.receptionOf] = {
      type: 'DynamicRelations',
      title: 'Reception of',
      relationTypes: receptionOfTypes,
      relationTypeVariation: config.get('relationTypeVariation'),
      relationName: 'reception',
      relationTypeHelper: new DynamicInverseRelationTypeHelper(autocompleteFactory)
    };
    schema[this.receivedIn] = {
      type: 'DynamicRelations',
      title: 'Received in',
      relationTypes: receivedInTypes,
      relationTypeVariation: config.get('relationTypeVariation'),
      relationName: 'reception',
      relationTypeHelper: new DynamicRelationTypeHelper(autocompleteFactory)
    };
    schema['date'].validators = ['datable'];
    this.form = new Form({
      className: 'timbuctoo-form',
      authToken: LoginComponent.getUser().getToken(),
      VRE_ID: config.get('VRE_ID'),
      relationsUrl: config.relationsUrl(),
      model: this.model,
      schema: schema,
      fieldsets: [
        {
          fields: ['title', 'englishTitle', 'description', 'tempCreator', 'timbuctoo-relation.isCreatedBy', 'notes']
        }, {
          legend: 'Additional information',
          collapsed: true,
          fields: ['tempLanguage', 'timbuctoo-relation.hasWorkLanguage', 'timbuctoo-relation.hasGenre', 'tempOrigin', 'timbuctoo-relation.hasPublishLocation', 'edition', 'date', 'documentType', 'source', 'timbuctoo-relation.hasSourceCategory', 'timbuctoo-relation.hasDocumentSource', 'links', 'reference']
        }, {
          legend: 'Receptions',
          collapsed: true,
          fields: [this.receptionOf, this.receivedIn]
        }
      ]
    });
    return this.$('.form').html(this.form.el);
  };

  return Document;

})(Backbone.View);

module.exports = Document;



},{"../../../data/metadata/wwdocument.json":"/home/gijs/Projects/women-writers/src/data/metadata/wwdocument.json","../../../jade/views/document/edit.jade":"/home/gijs/Projects/women-writers/src/jade/views/document/edit.jade","../../config":"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee","../../helpers/search":"/home/gijs/Projects/women-writers/src/coffee/helpers/search.coffee","../status":"/home/gijs/Projects/women-writers/src/coffee/views/status.coffee","backbone":false,"hibb-login":"/home/gijs/Projects/women-writers/node_modules/hibb-login/dist/index.js"}],"/home/gijs/Projects/women-writers/src/coffee/views/document/search.coffee":[function(require,module,exports){
var Backbone, BaseSearch, DocumentSearch, config,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

BaseSearch = require('../base-search.coffee');

config = require('../../config');

DocumentSearch = (function(_super) {
  __extends(DocumentSearch, _super);

  function DocumentSearch() {
    return DocumentSearch.__super__.constructor.apply(this, arguments);
  }

  DocumentSearch.prototype.resultsTemplate = require('../../../jade/views/document/document-search-results.jade');

  DocumentSearch.prototype.type = 'wwdocuments';

  DocumentSearch.prototype.queryOptions = {
    term: '*',
    facetValues: [
      {
        name: 'dynamic_b_is_source',
        values: ['false']
      }
    ],
    sortParameters: [
      {
        fieldname: 'dynamic_sort_creator',
        direction: 'asc'
      }
    ],
    typeString: config.get('documentTypeString')
  };

  DocumentSearch.prototype.facetTitleMap = config.get('documentFacetTitles');

  DocumentSearch.prototype.sortableFieldsMap = {
    dynamic_sort_creator: 'Creator',
    dynamic_sort_title: 'Title'
  };

  DocumentSearch.prototype.textSearchTitleMap = config.get('textSearchTitles');

  DocumentSearch.prototype.fsTemplates = {
    facets: require('../../../jade/faceted-search/document.jade')
  };

  DocumentSearch.prototype.initialize = function(options) {
    this.options = options;
    DocumentSearch.__super__.initialize.apply(this, arguments);
    return this.render();
  };

  return DocumentSearch;

})(BaseSearch);

module.exports = DocumentSearch;



},{"../../../jade/faceted-search/document.jade":"/home/gijs/Projects/women-writers/src/jade/faceted-search/document.jade","../../../jade/views/document/document-search-results.jade":"/home/gijs/Projects/women-writers/src/jade/views/document/document-search-results.jade","../../config":"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee","../base-search.coffee":"/home/gijs/Projects/women-writers/src/coffee/views/base-search.coffee","backbone":false}],"/home/gijs/Projects/women-writers/src/coffee/views/document/view.coffee":[function(require,module,exports){
var BaseView, DocumentView, config, externalLinksMap, namesMap, relationField, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../../config');

BaseView = require('../base-view');

_ref = require('../../helpers/base-view-helper'), relationField = _ref.relationField, namesMap = _ref.namesMap, externalLinksMap = _ref.externalLinksMap;

DocumentView = (function(_super) {
  __extends(DocumentView, _super);

  function DocumentView() {
    return DocumentView.__super__.constructor.apply(this, arguments);
  }

  DocumentView.prototype.className = 'document view';

  DocumentView.prototype.template = require('../../../jade/views/document/view.jade');

  DocumentView.prototype.fieldsets = [
    {
      fields: [
        'title', relationField('isCreatedBy', 'Creator'), relationField('hasWorkLanguage', 'Language'), relationField('hasPublishLocation', 'Published in'), relationField('isPublishedBy', 'Published by'), relationField('isStoredAt', 'Stored at'), relationField('hasGenre', 'Genre'), relationField('hasSourceCategory', 'Source Category'), relationField('hasDocumentSource', 'Document Source'), relationField('isDocumentSourceOf', 'Source for'), 'description', 'edition', 'date', {
          title: 'Links',
          field: 'links',
          type: 'Array',
          large: true,
          group: true,
          map: externalLinksMap
        }, 'reference', {
          title: 'Notes',
          field: 'notes',
          large: true,
          formatNewlines: true
        }, 'topoi', {
          field: '^pid',
          title: 'Persistent ID',
          newLine: true
        }
      ]
    }, {
      title: 'Temporary Fields',
      showOnlyWhenLoggedIn: true,
      fields: [/^temp/]
    }
  ];

  return DocumentView;

})(BaseView);

module.exports = DocumentView;



},{"../../../jade/views/document/view.jade":"/home/gijs/Projects/women-writers/src/jade/views/document/view.jade","../../config":"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee","../../helpers/base-view-helper":"/home/gijs/Projects/women-writers/src/coffee/helpers/base-view-helper.coffee","../base-view":"/home/gijs/Projects/women-writers/src/coffee/views/base-view.coffee"}],"/home/gijs/Projects/women-writers/src/coffee/views/person/graph.coffee":[function(require,module,exports){
var Backbone, Graph, PersonNetworkGraph, config, d3,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

d3 = require('d3');

config = require('../../config');

Graph = require('../../models/graph');

PersonNetworkGraph = (function(_super) {
  __extends(PersonNetworkGraph, _super);

  function PersonNetworkGraph() {
    return PersonNetworkGraph.__super__.constructor.apply(this, arguments);
  }

  PersonNetworkGraph.prototype.className = 'person-network-graph';

  PersonNetworkGraph.prototype.template = require('../../../jade/views/person/graph.jade');

  PersonNetworkGraph.prototype.initialize = function(options) {
    this.attachTo = options.attachTo;
    this.navigation = [];
    return this.fetchData(this.model.id).done((function(_this) {
      return function(data) {
        console.log("DATA", data);
        return _this.render();
      };
    })(this));
  };

  PersonNetworkGraph.prototype.fetchData = function(id) {
    this.graph = new Graph;
    return this.graph.fetch({
      url: config.personGraphDataUrl(id)
    });
  };

  PersonNetworkGraph.prototype.navigateGraphToPerson = function(key) {
    var id, type, _ref;
    _ref = key.split('/'), type = _ref[0], id = _ref[1];
    return this.fetchData(id).done((function(_this) {
      return function() {
        var person;
        person = _.find(_this.graph.nodes(), function(n) {
          return n.key === key;
        });
        _this.renderTitle(person.label);
        if (!_.find(_this.navigation, function(n) {
          return n.key === key;
        })) {
          _this.navigation.push({
            key: key,
            label: person.label
          });
          _this.updateNavigation();
        }
        return _this.renderGraph();
      };
    })(this));
  };

  PersonNetworkGraph.prototype.updateNavigation = function() {
    var li, n, _i, _len, _ref, _results;
    this.$('ul').empty();
    _ref = this.navigation;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      n = _ref[_i];
      li = Backbone.$('li').text(n.label);
      _results.push(this.$('ul').append(li));
    }
    return _results;
  };

  PersonNetworkGraph.prototype.renderTitle = function(name) {
    var _ref, _ref1;
    if (name != null) {
      return this.$('.title .name').text(name);
    } else {
      return this.$('.title .name').text(config.componentsToName((_ref = this.model.get('names')) != null ? (_ref1 = _ref[0]) != null ? _ref1.components : void 0 : void 0));
    }
  };

  PersonNetworkGraph.prototype.renderGraph = function() {
    var circle, depth, force, height, label, linkArc, links, maxWeight, minWeight, nodes, numParts, path, strokeWidth, svg, text, tick, transform, width;
    depth = Backbone.$("#depth").val() || "1";
    width = this.$el.outerWidth();
    height = 700;
    svg = d3.select('svg').attr("width", width).attr("height", height);
    nodes = this.graph.nodes();
    links = this.graph.links();
    transform = function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    };
    tick = function() {
      path.attr("d", linkArc);
      circle.attr("transform", transform);
      text.attr("transform", transform);
      return label.attr("x", function(d) {
        return (d.source.x + d.target.x) / 2;
      }).attr("y", function(d) {
        return (d.source.y + d.target.y) / 2;
      });
    };
    linkArc = function(d) {
      var dr, dx, dy;
      dx = d.target.x - d.source.x;
      dy = d.target.y - d.source.y;
      dr = Math.sqrt(dx * dx + dy * dy) * 2;
      return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    };
    force = d3.layout.force().nodes(nodes).links(links).size([width, height]).linkDistance(150).charge(-300).on("tick", tick).start();
    svg.selectAll("*").remove();
    minWeight = _.min(links, function(l) {
      return l.weight;
    });
    maxWeight = _.max(links, function(l) {
      return l.weight;
    });
    numParts = 3;
    ((maxWeight - minWeight) / numParts) + 1;
    _.groupBy(_.sortBy(links, function(l) {
      return l.weight;
    }), strokeWidth = function(weight) {
      width = (function() {
        switch (false) {
          case !(weight < 5):
            return 'light-stroke';
          case !(weight < 10):
            return 'medium-stroke';
          case !(weight > 10):
            return 'heavy-stroke';
        }
      })();
      return width;
    });
    path = svg.append("g").selectAll("path").data(force.links()).enter().append("path").attr("class", function(d) {
      return "link " + (strokeWidth(d.weight));
    });
    label = svg.append("g").selectAll("text").data(force.links()).enter().append("text").attr("x", function(d) {
      return (d.source.y + d.target.y) / 2;
    }).attr("y", function(d) {
      return (d.source.x + d.target.x) / 2;
    }).attr("text-anchor", "middle").attr("font-style", "italic").text(function(d) {
      return d.type;
    });
    circle = svg.append("g").selectAll("circle").data(force.nodes()).enter().append("circle").attr("r", 6).attr("class", function(d) {
      return "node " + (d.data.gender.toLowerCase());
    }).on('click', function(d) {
      return console.log("Clicking " + d.key);
    });
    text = svg.append("g").attr('class', 'labels').selectAll("g.text").data(force.nodes()).enter().append('g').attr('class', 'text');
    text.append('rect').attr('x', 0).attr('y', -10).attr('rx', 3).attr('ry', 3).attr('width', 200).attr('height', 20).on('click', (function(_this) {
      return function(d) {
        return _this.navigateGraphToPerson(d.key);
      };
    })(this)).call(force.drag).on("mousedown", function() {
      return d3.event.stopPropagation();
    });
    text.append("text").attr("x", 8).attr("y", ".31em").text(function(d) {
      return d.label;
    }).on('click', (function(_this) {
      return function(d) {
        _this.navigateGraphToPerson(d.key);
        return console.log("CLicked", d);
      };
    })(this));
    return text.each(function(n) {
      var w;
      w = Backbone.$('text', this).outerWidth();
      return Backbone.$('rect', this).attr({
        width: w + 15
      });
    });
  };

  PersonNetworkGraph.prototype.render = function() {
    this.$el.html(this.template());
    this.renderTitle();
    return this.renderGraph();
  };

  return PersonNetworkGraph;

})(Backbone.View);

module.exports = PersonNetworkGraph;



},{"../../../jade/views/person/graph.jade":"/home/gijs/Projects/women-writers/src/jade/views/person/graph.jade","../../config":"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee","../../models/graph":"/home/gijs/Projects/women-writers/src/coffee/models/graph.coffee","backbone":false,"d3":false}],"/home/gijs/Projects/women-writers/src/coffee/views/person/search.coffee":[function(require,module,exports){
var Backbone, BaseSearch, PersonSearch, config,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

BaseSearch = require('../base-search.coffee');

config = require('../../config');

PersonSearch = (function(_super) {
  __extends(PersonSearch, _super);

  function PersonSearch() {
    return PersonSearch.__super__.constructor.apply(this, arguments);
  }

  PersonSearch.prototype.resultsTemplate = require('../../../jade/views/person/person-search-results.jade');

  PersonSearch.prototype.type = 'wwpersons';

  PersonSearch.prototype.queryOptions = {
    term: '*',
    typeString: config.get('personTypeString'),
    sortParameters: [
      {
        fieldname: 'dynamic_sort_name',
        direction: 'asc'
      }
    ],
    sortParameters: [
      {
        fieldname: 'dynamic_sort_name',
        direction: 'asc'
      }
    ]
  };

  PersonSearch.prototype.facetTitleMap = config.get('personFacetTitles');

  PersonSearch.prototype.sortableFieldsMap = {
    dynamic_k_deathDate: 'Year of Death',
    dynamic_k_birthDate: 'Year of Birth',
    dynamic_sort_name: 'Name'
  };

  PersonSearch.prototype.textSearchTitleMap = config.get('textSearchTitles');

  PersonSearch.prototype.fsTemplates = {
    facets: require('../../../jade/faceted-search/person.jade')
  };

  PersonSearch.prototype.initialize = function(options) {
    this.options = options;
    PersonSearch.__super__.initialize.apply(this, arguments);
    return this.render();
  };

  return PersonSearch;

})(BaseSearch);

module.exports = PersonSearch;



},{"../../../jade/faceted-search/person.jade":"/home/gijs/Projects/women-writers/src/jade/faceted-search/person.jade","../../../jade/views/person/person-search-results.jade":"/home/gijs/Projects/women-writers/src/jade/views/person/person-search-results.jade","../../config":"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee","../base-search.coffee":"/home/gijs/Projects/women-writers/src/coffee/views/base-search.coffee","backbone":false}],"/home/gijs/Projects/women-writers/src/coffee/views/person/view.coffee":[function(require,module,exports){
var BaseView, PersonView, config, externalLinksMap, linkTemplate, namesMap, relationField, ucFirst, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../../config');

BaseView = require('../base-view');

_ref = require('../../helpers/base-view-helper'), relationField = _ref.relationField, namesMap = _ref.namesMap, externalLinksMap = _ref.externalLinksMap;

linkTemplate = require('../../../jade/views/base-link.jade');

ucFirst = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

PersonView = (function(_super) {
  __extends(PersonView, _super);

  function PersonView() {
    return PersonView.__super__.constructor.apply(this, arguments);
  }

  PersonView.prototype.className = 'person view';

  PersonView.prototype.template = require('../../../jade/views/person/view.jade');

  PersonView.prototype.fieldsets = [
    {
      fields: [
        {
          title: 'Type',
          field: 'types',
          map: function(types) {
            return types.map(function(t) {
              return ucFirst(t);
            });
          }
        }, {
          title: 'Names',
          field: 'names',
          type: 'Array',
          map: function(names) {
            names.shift();
            return namesMap(names);
          }
        }, {
          field: 'gender',
          title: 'Gender',
          map: function(v) {
            return config.mapGenderOption(v);
          }
        }, relationField('hasPseudonym', 'Pseudonyms'), relationField('isPseudonymOf', 'Is pseudonym of'), {
          title: 'Date of birth',
          field: 'birthDate'
        }, relationField('hasBirthPlace', 'Place of birth'), {
          title: 'Date of death',
          field: 'deathDate'
        }, relationField('hasDeathPlace', 'Place of death'), relationField('hasResidenceLocation', 'Lived in'), 'nationality', relationField('hasPersonLanguage', 'Languages'), relationField('isCollaboratorOf', 'Collaborators'), relationField('isMemberOf', 'Collectives'), relationField('isRelatedTo', 'Related to'), relationField('isSpouseOf', 'Spouse'), relationField('hasEducation', 'Education'), relationField('hasFinancialSituation', 'Financials'), relationField('hasMaritalStatus', 'Marital Status'), relationField('hasProfession', 'Profession'), relationField('hasReligion', 'Religion'), relationField('hasSocialClass', 'Social class'), {
          field: 'children',
          title: 'Children',
          map: function(c) {
            return ucFirst(c);
          }
        }, 'livedIn', relationField('isCreatorOf', 'Author of'), {
          title: 'Created by Pseudonyms',
          field: 'pseudonyms',
          type: 'Array',
          group: true,
          map: function(value, model) {
            var id, pseudoDisplayName, pseudonym, work, workLinks, _results;
            pseudoDisplayName = function(id) {
              var all, p;
              all = model.get('@relations')['hasPseudonym'];
              p = _.find(all, function(ps) {
                return ps.id === id;
              });
              return p.displayName;
            };
            _results = [];
            for (id in value) {
              pseudonym = value[id];
              workLinks = (function() {
                var _i, _len, _ref1, _ref2, _ref3, _results1;
                _ref3 = (_ref1 = (_ref2 = pseudonym['@relations']) != null ? _ref2['isCreatorOf'] : void 0) != null ? _ref1 : [];
                _results1 = [];
                for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
                  work = _ref3[_i];
                  _results1.push(linkTemplate({
                    link: {
                      url: config.viewUrl(work.id),
                      label: work.displayName
                    }
                  }));
                }
                return _results1;
              })();
              if (workLinks.length) {
                _results.push('<h5>' + pseudoDisplayName(id) + '</h5>' + workLinks.join("<br>"));
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          }
        }, {
          title: 'Notes',
          field: 'notes',
          large: true
        }, {
          title: 'Links',
          field: 'links',
          type: 'Array',
          large: true,
          group: true,
          map: externalLinksMap
        }, {
          title: 'Bibliography',
          field: 'bibliography',
          large: true
        }, {
          title: 'Health',
          field: 'health',
          large: true
        }, {
          field: 'personalSituation',
          title: 'Personal situation',
          large: true
        }, {
          field: '^pid',
          title: 'Persistent ID'
        }
      ]
    }, {
      title: 'Temporary Fields',
      showOnlyWhenLoggedIn: true,
      fields: [/^temp/]
    }
  ];

  return PersonView;

})(BaseView);

module.exports = PersonView;



},{"../../../jade/views/base-link.jade":"/home/gijs/Projects/women-writers/src/jade/views/base-link.jade","../../../jade/views/person/view.jade":"/home/gijs/Projects/women-writers/src/jade/views/person/view.jade","../../config":"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee","../../helpers/base-view-helper":"/home/gijs/Projects/women-writers/src/coffee/helpers/base-view-helper.coffee","../base-view":"/home/gijs/Projects/women-writers/src/coffee/views/base-view.coffee"}],"/home/gijs/Projects/women-writers/src/coffee/views/reception/receptee-selector.coffee":[function(require,module,exports){
var Backbone, RecepteeSelector, config, createFacetedSearch, documentFacetsSearchTemplate, mainReceptionSearchTemplate, personFacetsSearchTemplate,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

config = require('../../config');

createFacetedSearch = require('../../helpers/search').createFacetedSearch;

mainReceptionSearchTemplate = require('../../../jade/faceted-search/reception-main.jade');

documentFacetsSearchTemplate = require('../../../jade/faceted-search/document.jade');

personFacetsSearchTemplate = require('../../../jade/faceted-search/person.jade');

RecepteeSelector = (function(_super) {
  __extends(RecepteeSelector, _super);

  function RecepteeSelector() {
    return RecepteeSelector.__super__.constructor.apply(this, arguments);
  }

  RecepteeSelector.prototype.template = require('../../../jade/views/reception/source-query-builder.jade');

  RecepteeSelector.prototype.className = 'query-builder';

  RecepteeSelector.prototype.initialize = function(options) {
    if (options == null) {
      options = {};
    }
    this.facetValues = [];
    return this.type = null;
  };

  RecepteeSelector.prototype.createSearch = function(type) {
    var options, _ref;
    if ((_ref = this.search) != null) {
      _ref.destroy();
    }
    options = {
      collapsed: true,
      templates: {
        main: mainReceptionSearchTemplate
      }
    };
    if (type === 'work') {
      options.type = 'wwdocuments';
      options.templates.facets = documentFacetsSearchTemplate;
      options.facetTitleMap = config.get('documentFacetTitles');
      options.queryOptions = {
        facetValues: [
          {
            name: 'dynamic_b_is_source',
            values: ['false']
          }
        ],
        term: '*'
      };
    } else if (this.type === 'person') {
      options.type = 'wwpersons';
      options.templates.facets = personFacetsSearchTemplate;
      options.facetTitleMap = config.get('personFacetTitles');
    }
    this.search = createFacetedSearch(options);
    this.facetValues = [];
    this.listenTo(this.search, 'change:queryoptions', (function(_this) {
      return function(queryOptions) {
        _this.setValues(queryOptions.get('facetValues'));
        return _this.trigger('change', queryOptions);
      };
    })(this));
    this.listenTo(this.search, 'change:results', (function(_this) {
      return function() {
        return _this.trigger('change:results');
      };
    })(this));
    return this.search.search();
  };

  RecepteeSelector.prototype.setValues = function(values) {
    return this.facetValues = values;
  };

  RecepteeSelector.prototype.getValues = function() {
    var f, _i, _len, _ref, _results;
    _ref = this.facetValues;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      f = _ref[_i];
      if (!f.name.match(/is_source/)) {
        _results.push(f);
      }
    }
    return _results;
  };

  RecepteeSelector.prototype.getQueryId = function() {
    return this.search.getSearchResultURL().split('/').pop();
  };

  RecepteeSelector.prototype.render = function() {
    this.$el.html(this.template());
    if (this.search != null) {
      return this.$('.search-container').append(this.search.el);
    }
  };

  RecepteeSelector.prototype.setType = function(type) {
    if (type !== this.type) {
      this.type = type;
      this.createSearch(type);
      return this.render();
    }
  };

  RecepteeSelector.prototype.hide = function() {
    return this.$el.addClass('hidden');
  };

  RecepteeSelector.prototype.show = function() {
    return this.$el.removeClass('hidden');
  };

  return RecepteeSelector;

})(Backbone.View);

module.exports = RecepteeSelector;



},{"../../../jade/faceted-search/document.jade":"/home/gijs/Projects/women-writers/src/jade/faceted-search/document.jade","../../../jade/faceted-search/person.jade":"/home/gijs/Projects/women-writers/src/jade/faceted-search/person.jade","../../../jade/faceted-search/reception-main.jade":"/home/gijs/Projects/women-writers/src/jade/faceted-search/reception-main.jade","../../../jade/views/reception/source-query-builder.jade":"/home/gijs/Projects/women-writers/src/jade/views/reception/source-query-builder.jade","../../config":"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee","../../helpers/search":"/home/gijs/Projects/women-writers/src/coffee/helpers/search.coffee","backbone":false}],"/home/gijs/Projects/women-writers/src/coffee/views/reception/reception-selector.coffee":[function(require,module,exports){
var Backbone, ReceptionSelector, config, createFacetedSearch, documentFacetsSearchTemplate, mainReceptionSearchTemplate,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

config = require('../../config');

createFacetedSearch = require('../../helpers/search').createFacetedSearch;

mainReceptionSearchTemplate = require('../../../jade/faceted-search/reception-main.jade');

documentFacetsSearchTemplate = require('../../../jade/faceted-search/document.jade');

ReceptionSelector = (function(_super) {
  __extends(ReceptionSelector, _super);

  function ReceptionSelector() {
    return ReceptionSelector.__super__.constructor.apply(this, arguments);
  }

  ReceptionSelector.prototype.template = require('../../../jade/views/reception/reception-selector.jade');

  ReceptionSelector.prototype.initialize = function(options) {
    if (options == null) {
      options = {};
    }
    this.search = createFacetedSearch({
      type: 'wwdocuments',
      collapsed: true,
      facetTitleMap: config.get('documentFacetTitles'),
      templates: {
        main: mainReceptionSearchTemplate,
        facets: documentFacetsSearchTemplate
      }
    });
    this.facetValues = [];
    this.listenTo(this.search, 'change:queryoptions', (function(_this) {
      return function(queryOptions) {
        _this.setValues(queryOptions.get('facetValues'));
        return _this.trigger('change', queryOptions);
      };
    })(this));
    this.listenTo(this.search, 'change:results', (function(_this) {
      return function() {
        return _this.trigger('change:results');
      };
    })(this));
    return this.search.search();
  };

  ReceptionSelector.prototype.setValues = function(values) {
    return this.facetValues = values;
  };

  ReceptionSelector.prototype.getValues = function() {
    return this.facetValues;
  };

  ReceptionSelector.prototype.getQueryId = function() {
    return this.search.getSearchResultURL().split('/').pop();
  };

  ReceptionSelector.prototype.render = function() {
    this.$el.html(this.template());
    return this.$('.search-container').html(this.search.el);
  };

  ReceptionSelector.prototype.hide = function() {
    return this.$el.addClass('hidden');
  };

  ReceptionSelector.prototype.show = function() {
    return this.$el.removeClass('hidden');
  };

  ReceptionSelector.prototype.getSearchId = function() {
    return this.search.getSearchId();
  };

  return ReceptionSelector;

})(Backbone.View);

module.exports = ReceptionSelector;



},{"../../../jade/faceted-search/document.jade":"/home/gijs/Projects/women-writers/src/jade/faceted-search/document.jade","../../../jade/faceted-search/reception-main.jade":"/home/gijs/Projects/women-writers/src/jade/faceted-search/reception-main.jade","../../../jade/views/reception/reception-selector.jade":"/home/gijs/Projects/women-writers/src/jade/views/reception/reception-selector.jade","../../config":"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee","../../helpers/search":"/home/gijs/Projects/women-writers/src/coffee/helpers/search.coffee","backbone":false}],"/home/gijs/Projects/women-writers/src/coffee/views/reception/results.coffee":[function(require,module,exports){
var $, Backbone, ReceptionSearchResult, config, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require("underscore");

$ = require('jquery');

config = require('../../config');

ReceptionSearchResult = (function(_super) {
  __extends(ReceptionSearchResult, _super);

  function ReceptionSearchResult() {
    return ReceptionSearchResult.__super__.constructor.apply(this, arguments);
  }

  ReceptionSearchResult.prototype.template = require('../../../jade/views/reception/search-result.jade');

  ReceptionSearchResult.prototype.initialize = function(options) {
    if (options == null) {
      options = {};
    }
    _.extend(this, Backbone.Events);
    this.listenTo(this.collection, 'change:results', (function(_this) {
      return function() {
        return _this.render();
      };
    })(this));
    return this.render();
  };

  ReceptionSearchResult.prototype.events = {
    'click .next': 'clickNext',
    'click .prev': 'clickPrev',
    'click .num-rows li': 'clickNumberOfResultRows'
  };

  ReceptionSearchResult.prototype.clickNext = function() {
    return this.collection.moveCursor('_next');
  };

  ReceptionSearchResult.prototype.clickPrev = function() {
    return this.collection.moveCursor('_prev');
  };

  ReceptionSearchResult.prototype.queryId = function() {
    var id, _ref, _ref1;
    _ref1 = (_ref = this.collection.postURL) != null ? _ref.split('/') : void 0, id = _ref1[_ref1.length - 1];
    return id;
  };

  ReceptionSearchResult.prototype.clickNumberOfResultRows = function(e) {
    var numResults;
    numResults = $(e.currentTarget).attr('data-result-rows');
    return this.trigger('change:number-of-result-rows', numResults);
  };

  ReceptionSearchResult.prototype.render = function() {
    var relIds, relation, response, _i, _len, _ref;
    response = this.collection.current;
    if (response != null) {
      relIds = {};
      _ref = response.attributes.results;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        relation = _ref[_i];
        relIds[relation._id] = relation;
      }
      return this.$el.html(this.template({
        response: response.attributes,
        excelUrl: config.excelResultsUrl(this.queryId()),
        shortenTitle: function(title, len) {
          if (String(title).length > len) {
            return String(title).substring(0, len) + "…";
          } else {
            return title;
          }
        },
        config: config,
        relIds: relIds
      }));
    }
  };

  return ReceptionSearchResult;

})(Backbone.View);

module.exports = ReceptionSearchResult;



},{"../../../jade/views/reception/search-result.jade":"/home/gijs/Projects/women-writers/src/jade/views/reception/search-result.jade","../../config":"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee","backbone":false,"jquery":false,"underscore":false}],"/home/gijs/Projects/women-writers/src/coffee/views/reception/search.coffee":[function(require,module,exports){
var Backbone, RecepteeSelector, ReceptionResultsView, ReceptionSearch, ReceptionSelector, ReceptionService, ReceptionTypeSelector, SearchResults, config, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

SearchResults = require('huygens-faceted-search/src/coffee/collections/searchresults');

config = require('../../config');

ReceptionTypeSelector = require('./type-selector');

ReceptionSelector = require('./reception-selector');

RecepteeSelector = require('./receptee-selector');

ReceptionResultsView = require('./results');

ReceptionService = require('../../helpers/reception-service');

ReceptionSearch = (function(_super) {
  __extends(ReceptionSearch, _super);

  function ReceptionSearch() {
    return ReceptionSearch.__super__.constructor.apply(this, arguments);
  }

  ReceptionSearch.prototype.template = require('../../../jade/views/reception/search.jade');

  ReceptionSearch.prototype.className = 'reception-search';

  ReceptionSearch.prototype.numRows = 100;

  ReceptionSearch.prototype.events = {
    'click .tab.type': function() {
      return this.selectTab('type');
    },
    'click .tab.reception': function() {
      return this.selectTab('reception');
    },
    'click .tab.receptee': function() {
      return this.selectTab('receptee');
    },
    'click .tab.search .search-receptions': 'search'
  };

  ReceptionSearch.prototype.initialize = function(options) {
    _.extend(this, Backbone.Events);
    this.model = new Backbone.Model;
    this.receptionService = new ReceptionService;
    this.query = null;
    this.tabs = {};
    this.types = [];
    this.recepteeType = null;
    this.searchResults = new SearchResults({
      config: {
        resultRows: 100,
        baseUrl: config.get('baseUrl'),
        searchPath: config.get('relationSearchPath')
      }
    });
    this.receptionSearchId = null;
    this.recepteeSearchId = null;
    this.tabs['type'] = this.receptionTypeSelector = new ReceptionTypeSelector;
    this.tabs['reception'] = this.receptionSelector = new ReceptionSelector;
    this.listenTo(this.receptionSelector, 'change', (function(_this) {
      return function() {
        _this.enableSearchButton();
        return _this.renderReceptionTab();
      };
    })(this));
    this.tabs['receptee'] = this.recepteeSelector = new RecepteeSelector;
    this.listenTo(this.recepteeSelector, 'change', (function(_this) {
      return function() {
        _this.enableSearchButton();
        return _this.renderRecepteeTab();
      };
    })(this));
    this.listenTo(this.receptionTypeSelector, 'change', (function(_this) {
      return function(selection) {
        _this.changeType(selection);
        _this.recepteeSelector.setType(selection.category);
        return _this.renderRecepteeTab();
      };
    })(this));
    this.listenTo(this.recepteeSelector, 'change:results', (function(_this) {
      return function() {
        return _this.enableSearchButton();
      };
    })(this));
    this.listenTo(this.receptionSelector, 'change:results', (function(_this) {
      return function() {
        return _this.enableSearchButton();
      };
    })(this));
    return this.render();
  };

  ReceptionSearch.prototype.enableSearchButton = function() {
    return this.$('.btn.search-receptions').attr('disabled', false);
  };

  ReceptionSearch.prototype.setTypeSelected = function() {
    return this.$('.tabs').addClass('type-selected');
  };

  ReceptionSearch.prototype.changeType = function(selection) {
    this.types = selection.types;
    this.setRecepteeType(selection.category);
    this.setTypeSelected();
    return this.renderTypeTab();
  };

  ReceptionSearch.prototype.setRecepteeType = function(type) {
    this.recepteeType = type;
    return this.renderRecepteeTab();
  };

  ReceptionSearch.prototype.selectTab = function(tab) {
    var name, view, _ref;
    this.$('.tabs .tab.selected').removeClass('selected');
    this.$(".tabs .tab." + tab).addClass('selected');
    _ref = this.tabs;
    for (name in _ref) {
      view = _ref[name];
      if (name !== tab) {
        view.hide();
      }
    }
    this.$('.views').removeClass('slide-up');
    return this.tabs[tab].show();
  };

  ReceptionSearch.prototype.search = function(e) {
    var recepteeId, receptionId, t, typeIds;
    this.$el.removeClass('failed');
    this.$el.addClass('searching');
    this.$('.views').addClass('slide-up');
    recepteeId = this.recepteeSelector.getQueryId();
    receptionId = this.receptionSelector.getQueryId();
    typeIds = (function() {
      var _i, _len, _ref, _results;
      _ref = this.types;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        t = _ref[_i];
        _results.push(t.id);
      }
      return _results;
    }).call(this);
    this.query = {
      sourceSearchId: recepteeId,
      targetSearchId: receptionId,
      relationTypeIds: typeIds,
      typeString: 'wwrelation'
    };
    return this.receptionService.search(this.query, this.numRows).done((function(_this) {
      return function(data) {
        _this.searchResults.postURL = _this.receptionService.lastSearchUrl;
        _this.searchResults.addModel(data, JSON.stringify(_this.query));
        return _this.$el.removeClass('searching');
      };
    })(this)).fail(function() {
      this.$el.removeClass('searching');
      this.$el.addClass('failed');
      return typeof console !== "undefined" && console !== null ? console.error("Failed searching receptions", arguments) : void 0;
    });
  };

  ReceptionSearch.prototype.renderTypeTab = function() {
    var $typeText, text, toNiceName;
    $typeText = this.$('.tabs .tab.type .text');
    toNiceName = function(r) {
      return config.receptionTypeLabel(r.name);
    };
    if (this.types.length > 3) {
      text = this.types.slice(0, 3).map(toNiceName).join(', ');
      text += " <span class=more>and " + (this.types.length - 3) + " more</span>";
      $typeText.html(text);
    } else {
      $typeText.text(this.types.map(toNiceName).join(', '));
    }
    return $typeText.show();
  };

  ReceptionSearch.prototype.renderReceptionTab = function() {
    var $receptionLink, $receptionText, facet, facetTitles, name, text, values, _i, _len, _ref;
    $receptionText = this.$('.tabs .tab.reception .text');
    $receptionLink = this.$('.tabs .tab.reception .link');
    values = this.receptionSelector.getValues();
    facetTitles = config.get('documentFacetTitles');
    text = "with ";
    for (_i = 0, _len = values.length; _i < _len; _i++) {
      facet = values[_i];
      name = (_ref = facetTitles[facet.name]) != null ? _ref : facet.name;
      text += name.toLowerCase();
      if (facet.values.length > 1) {
        text += 's';
      }
      text += ' ' + facet.values.join(', ');
      text += '; ';
    }
    text = text.replace(/; $/, '');
    $receptionText.text(text).show();
    return $receptionLink.hide();
  };

  ReceptionSearch.prototype.renderRecepteeTab = function() {
    var $recepteeLink, $recepteeText, facet, facetTitles, name, text, values, _i, _len, _ref;
    $recepteeText = this.$('.tabs .tab.receptee .text');
    $recepteeLink = this.$('.tabs .tab.receptee .link');
    if (this.recepteeType === 'work') {
      facetTitles = config.get('documentFacetTitles');
    } else {
      facetTitles = config.get('personFacetTitles');
    }
    values = this.recepteeSelector.getValues();
    text = 'on ';
    if (values.length === 0) {
      text += 'all ';
    }
    text += this.recepteeType + 's';
    if (values.length) {
      text += ' with ';
      for (_i = 0, _len = values.length; _i < _len; _i++) {
        facet = values[_i];
        name = (_ref = facetTitles[facet.name]) != null ? _ref : facet.name;
        text += name.toLowerCase();
        text += ' ' + facet.values.join(', ');
        text += '; ';
      }
    }
    $recepteeText.text(text);
    $recepteeText.text(text).show();
    return $recepteeLink.hide();
  };

  ReceptionSearch.prototype.render = function() {
    var $queryEditor;
    this.$el.html(this.template());
    $queryEditor = this.$('.query-editor');
    this.receptionTypeSelector.setElement(this.$('.select-type'));
    this.receptionTypeSelector.render();
    this.receptionSelector.setElement(this.$('.select-reception'));
    this.receptionSelector.render();
    this.recepteeSelector.setElement(this.$('.select-receptee'));
    this.recepteeSelector.render();
    this.resultsView = new ReceptionResultsView({
      collection: this.searchResults,
      el: this.$('.reception-results')
    });
    return this.listenTo(this.resultsView, 'change:number-of-result-rows', (function(_this) {
      return function(numRows) {
        return _this.receptionService.setResultRows(numRows).done(function(data) {
          return _this.searchResults.addModel(data, JSON.stringify(_this.query));
        });
      };
    })(this));
  };

  return ReceptionSearch;

})(Backbone.View);

module.exports = ReceptionSearch;



},{"../../../jade/views/reception/search.jade":"/home/gijs/Projects/women-writers/src/jade/views/reception/search.jade","../../config":"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee","../../helpers/reception-service":"/home/gijs/Projects/women-writers/src/coffee/helpers/reception-service.coffee","./receptee-selector":"/home/gijs/Projects/women-writers/src/coffee/views/reception/receptee-selector.coffee","./reception-selector":"/home/gijs/Projects/women-writers/src/coffee/views/reception/reception-selector.coffee","./results":"/home/gijs/Projects/women-writers/src/coffee/views/reception/results.coffee","./type-selector":"/home/gijs/Projects/women-writers/src/coffee/views/reception/type-selector.coffee","backbone":false,"huygens-faceted-search/src/coffee/collections/searchresults":"/home/gijs/Projects/women-writers/node_modules/huygens-faceted-search/src/coffee/collections/searchresults.coffee","underscore":false}],"/home/gijs/Projects/women-writers/src/coffee/views/reception/type-selector.coffee":[function(require,module,exports){
var $, Backbone, ReceptionTypeSelector, config, receptionTypes, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

$ = Backbone.$;

config = require('../../config');

receptionTypes = {};

ReceptionTypeSelector = (function(_super) {
  __extends(ReceptionTypeSelector, _super);

  function ReceptionTypeSelector() {
    return ReceptionTypeSelector.__super__.constructor.apply(this, arguments);
  }

  ReceptionTypeSelector.prototype.template = require('../../../jade/views/reception/type-selector.jade');

  ReceptionTypeSelector.prototype.selection = {
    category: null,
    types: []
  };

  ReceptionTypeSelector.prototype.events = {
    'click li': 'clickType'
  };

  ReceptionTypeSelector.prototype.clickType = function(e) {
    var $category, $target, category, selectedTypes, type;
    $target = $(e.currentTarget);
    type = $target.attr('data-type');
    $category = $target.closest('.category');
    category = $category.attr('data-category');
    if (category !== this.selection.category) {
      this.selection.types = [];
      $category.siblings('.category').removeClass('active');
      $category.addClass('active');
      this.$('li').removeClass('selected');
      this.selection.category = category;
    }
    $target.toggleClass('selected');
    selectedTypes = $category.find('li.selected');
    this.selection.types = selectedTypes.map(function() {
      return {
        name: this.getAttribute('data-type'),
        id: this.getAttribute('data-type-id')
      };
    }).get();
    return this.trigger('change', this.selection);
  };

  ReceptionTypeSelector.prototype.initialize = function(options) {
    this.options = options != null ? options : {};
    _.extend(this, Backbone.Events);
    return this.render();
  };

  ReceptionTypeSelector.prototype.hide = function() {
    return this.$el.addClass('hidden');
  };

  ReceptionTypeSelector.prototype.show = function() {
    return this.$el.removeClass('hidden');
  };

  ReceptionTypeSelector.prototype.render = function() {
    return this.$el.html(this.template({
      config: config,
      documentReceptions: config.documentReceptions(),
      personReceptions: config.personReceptions()
    }));
  };

  return ReceptionTypeSelector;

})(Backbone.View);

module.exports = ReceptionTypeSelector;



},{"../../../jade/views/reception/type-selector.jade":"/home/gijs/Projects/women-writers/src/jade/views/reception/type-selector.jade","../../config":"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee","backbone":false,"underscore":false}],"/home/gijs/Projects/women-writers/src/coffee/views/sources/view.coffee":[function(require,module,exports){
var Backbone, SourceList, config, loadSources, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require("underscore");

config = require('../../config');

loadSources = require('../../helpers/load-app-data').loadSources;

SourceList = (function(_super) {
  __extends(SourceList, _super);

  function SourceList() {
    return SourceList.__super__.constructor.apply(this, arguments);
  }

  SourceList.prototype.template = require('../../../jade/views/sources/list.jade');

  SourceList.prototype.className = 'sources centered';

  SourceList.prototype.events = {
    'click ul.index li': 'clickLetter'
  };

  SourceList.prototype.initialize = function(options) {
    if (options == null) {
      options = {};
    }
    if (!config.get('sources')) {
      this.renderWaiting();
      return loadSources().done((function(_this) {
        return function() {
          return _this.render();
        };
      })(this));
    } else {
      return this.render();
    }
  };

  SourceList.prototype.clickLetter = function(e) {
    var letter;
    letter = e.currentTarget.getAttribute('data-letter');
    console.log("LET", letter);
    return this.scrollToLetter(letter);
  };

  SourceList.prototype.scrollToLetter = function(letter) {
    var margin, top;
    margin = 100;
    top = this.$(".letter[data-letter=" + letter + "]").offset().top;
    return Backbone.$('html, body').animate({
      scrollTop: top - margin
    });
  };

  SourceList.prototype.renderWaiting = function() {
    return this.$el.html('Waiting for sources to load, please stand by');
  };

  SourceList.prototype.render = function() {
    var alphabetized, byFirstLetter, sources;
    sources = config.get('sources');
    if (sources != null) {
      byFirstLetter = function(s) {
        return s.title.substr(0, 1).toUpperCase();
      };
      alphabetized = _.groupBy(sources, byFirstLetter);
      return this.$el.html(this.template({
        sources: alphabetized,
        letters: _.keys(alphabetized).sort(),
        config: config
      }));
    }
  };

  return SourceList;

})(Backbone.View);

module.exports = SourceList;



},{"../../../jade/views/sources/list.jade":"/home/gijs/Projects/women-writers/src/jade/views/sources/list.jade","../../config":"/home/gijs/Projects/women-writers/src/coffee/config/index.coffee","../../helpers/load-app-data":"/home/gijs/Projects/women-writers/src/coffee/helpers/load-app-data.coffee","backbone":false,"underscore":false}],"/home/gijs/Projects/women-writers/src/coffee/views/status.coffee":[function(require,module,exports){
var $, Backbone, Status, statusTemplate, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

$ = Backbone.$;

statusTemplate = require('../../jade/views/status.jade');

Status = (function(_super) {
  __extends(Status, _super);

  function Status() {
    return Status.__super__.constructor.apply(this, arguments);
  }

  Status.prototype.template = statusTemplate;

  Status.prototype.className = 'status-indicator';

  Status.prototype.waitBeforeClose = 500;

  Status.prototype.events = {
    'click button.btn': 'done'
  };

  Status.prototype.initialize = function(options) {
    this.options = options != null ? options : {};
    if (this.options.template != null) {
      this.template = this.options.template;
    }
    if (this.options.waitBeforeClose != null) {
      this.waitBeforeClose = this.options.waitBeforeClose;
    }
    return this.render();
  };

  Status.prototype.setStatus = function(status, errorMessage) {
    var cls, _i, _len, _ref;
    if (errorMessage == null) {
      errorMessage = '';
    }
    if (status === 'error') {
      this.$('.error-message').text(errorMessage).show();
    } else {
      this.$('.error-message').hide();
    }
    _ref = this.$el.attr('class').split(/\s+/);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cls = _ref[_i];
      if (cls.match(/^status-(?!indicator)/)) {
        this.$el.removeClass(cls);
      }
    }
    return this.$el.addClass("status-" + status);
  };

  Status.prototype.error = function(message) {
    this.setStatus('error', message);
    return this.show();
  };

  Status.prototype.success = function(callback) {
    var closeStatusWindow, showStatusWindow;
    this.setStatus('success');
    showStatusWindow = (function(_this) {
      return function() {
        return _this.show();
      };
    })(this);
    _.delay(showStatusWindow, 250);
    closeStatusWindow = (function(_this) {
      return function() {
        return _this.done(callback);
      };
    })(this);
    return _.delay(closeStatusWindow, 250 + this.waitBeforeClose);
  };

  Status.prototype.loading = function() {
    return this.setStatus('loading');
  };

  Status.prototype.done = function(callback) {
    return this.$el.fadeOut(150, (function(_this) {
      return function() {
        _this.$el.remove();
        return typeof callback === "function" ? callback() : void 0;
      };
    })(this));
  };

  Status.prototype.show = function() {
    this.$el.fadeIn(150);
    return this;
  };

  Status.prototype.hide = function() {
    this.$el.fadeOut(150);
    return this;
  };

  Status.prototype.render = function() {
    this.$el.html(this.template({
      error: this.error
    }));
    this.$el.hide();
    return $('body').append(this.el);
  };

  return Status;

})(Backbone.View);

module.exports = Status;



},{"../../jade/views/status.jade":"/home/gijs/Projects/women-writers/src/jade/views/status.jade","backbone":false,"underscore":false}],"/home/gijs/Projects/women-writers/src/coffee/views/user-status.coffee":[function(require,module,exports){
var $, Backbone, LoginComponent, UserStatus, tpl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

$ = require('jquery');

LoginComponent = require('hibb-login');

tpl = require('../../jade/views/user-status.jade');

UserStatus = (function(_super) {
  __extends(UserStatus, _super);

  function UserStatus() {
    return UserStatus.__super__.constructor.apply(this, arguments);
  }

  UserStatus.prototype.events = {
    'click a.login': '_showLoginModal'
  };

  UserStatus.prototype.initialize = function() {
    var user;
    user = LoginComponent.getUser();
    this.listenTo(user, 'unauthorized', (function(_this) {
      return function() {
        return _this.render();
      };
    })(this));
    this.listenTo(user, 'data-fetched', (function(_this) {
      return function() {
        return _this.render();
      };
    })(this));
    return this.render();
  };

  UserStatus.prototype._showLoginModal = function() {
    return LoginComponent.getLoginView({
      title: "Login",
      modal: true
    });
  };

  UserStatus.prototype.render = function() {
    var user;
    user = LoginComponent.getUser();
    this.$el.html(tpl({
      username: user.get('commonName')
    }));
    return this.$el.toggleClass('logged-in', user.isLoggedIn());
  };

  return UserStatus;

})(Backbone.View);

module.exports = UserStatus;



},{"../../jade/views/user-status.jade":"/home/gijs/Projects/women-writers/src/jade/views/user-status.jade","backbone":false,"hibb-login":"/home/gijs/Projects/women-writers/node_modules/hibb-login/dist/index.js","jquery":false}],"/home/gijs/Projects/women-writers/src/data/metadata/wwdocument.json":[function(require,module,exports){
module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports={
  "edition" : {
    "type" : "String"
  },
  "tempCreator" : {
    "type" : "String"
  },
  "documentType" : {
    "value" : [ "UNKNOWN", "ANTHOLOGY", "ARTICLE", "AWARD", "CATALOGUE", "COMPILATION", "DIARY", "LETTER", "LIST", "MONOGRAPH", "PERIODICAL", "PICTURE", "PUBLICITY", "SHEETMUSIC", "THEATERSCRIPT", "WORK" ],
    "type" : "String"
  },
  "englishTitle" : {
    "type" : "String"
  },
  "PID" : {
    "value" : "^pid",
    "type" : "String"
  },
  "^deleted" : {
    "type" : "boolean"
  },
  "rights" : {
    "type" : "String"
  },
  "^created" : {
    "type" : "Change"
  },
  "tempLanguage" : {
    "type" : "String"
  },
  "date" : {
    "type" : "Datable"
  },
  "^modified" : {
    "type" : "Change"
  },
  "tempOrigin" : {
    "type" : "String"
  },
  "title" : {
    "type" : "String"
  },
  "_id" : {
    "type" : "String"
  },
  "description" : {
    "type" : "String"
  },
  "ID" : {
    "value" : "_id",
    "type" : "String"
  },
  "@relations" : {
    "type" : "Map of (String, List of (EntityRef))"
  },
  "DELETED" : {
    "value" : "^deleted",
    "type" : "String"
  },
  "^pid" : {
    "type" : "String"
  },
  "VARIATIONS" : {
    "value" : "^variations",
    "type" : "String"
  },
  "ROLES" : {
    "value" : "^roles",
    "type" : "String"
  },
  "links" : {
    "type" : "List of (Link)"
  },
  "topoi" : {
    "type" : "List of (String)"
  },
  "reference" : {
    "type" : "String"
  },
  "resourceType" : {
    "value" : [ "UNKNOWN", "IMAGE", "SOUND", "TEXT" ],
    "type" : "String"
  },
  "resourceFormat" : {
    "type" : "String"
  },
  "source" : {
    "type" : "boolean"
  },
  "^rev" : {
    "type" : "int"
  },
  "^variations" : {
    "type" : "List of (String)"
  },
  "@relationCount" : {
    "type" : "int"
  },
  "tempOldId" : {
    "type" : "String"
  },
  "notes" : {
    "type" : "String"
  },
  "^roles" : {
    "type" : "List of (Role)"
  }
}
},{}],"/home/gijs/Projects/women-writers/src/edit-person/build/development/index.js":[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.WomenWritersEditPerson = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
"use strict";

(function (f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = f();
	} else if (typeof define === "function" && define.amd) {
		define([], f);
	} else {
		var g;if (typeof window !== "undefined") {
			g = window;
		} else if (typeof global !== "undefined") {
			g = global;
		} else if (typeof self !== "undefined") {
			g = self;
		} else {
			g = this;
		}g.HireFormsAutocomplete = f();
	}
})(function () {
	var define, module, exports;return (function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = typeof _dereq_ == "function" && _dereq_;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw (f.code = "MODULE_NOT_FOUND", f);
				}var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
					var n = t[o][1][e];return s(n ? n : e);
				}, l, l.exports, e, t, n, r);
			}return n[o].exports;
		}var i = typeof _dereq_ == "function" && _dereq_;for (var o = 0; o < r.length; o++) s(r[o]);return s;
	})({ 1: [function (_dereq_, module, exports) {
			/*!
     Copyright (c) 2015 Jed Watson.
     Licensed under the MIT License (MIT), see
     http://jedwatson.github.io/classnames
   */

			(function () {
				"use strict";

				function classNames() {

					var classes = "";

					for (var i = 0; i < arguments.length; i++) {
						var arg = arguments[i];
						if (!arg) continue;

						var argType = typeof arg;

						if ("string" === argType || "number" === argType) {
							classes += " " + arg;
						} else if (Array.isArray(arg)) {
							classes += " " + classNames.apply(null, arg);
						} else if ("object" === argType) {
							for (var key in arg) {
								if (arg.hasOwnProperty(key) && arg[key]) {
									classes += " " + key;
								}
							}
						}
					}

					return classes.substr(1);
				}

				if (typeof define === "function" && typeof define.amd === "object" && define.amd) {
					// AMD. Register as an anonymous module.
					define(function () {
						return classNames;
					});
				} else if (typeof module !== "undefined" && module.exports) {
					module.exports = classNames;
				} else {
					window.classNames = classNames;
				}
			})();
		}, {}], 2: [function (_dereq_, module, exports) {
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { "default": obj };
			}

			var _react = _dereq_("react");

			var _react2 = _interopRequireDefault(_react);

			var _classnames = _dereq_("classnames");

			var _classnames2 = _interopRequireDefault(_classnames);

			var Input = _react2["default"].createClass({
				displayName: "Input",

				propTypes: {
					onChange: _react2["default"].PropTypes.func,
					onInvalid: _react2["default"].PropTypes.func,
					onKeyDown: _react2["default"].PropTypes.func,
					onKeyUp: _react2["default"].PropTypes.func,
					placeholder: _react2["default"].PropTypes.string,
					style: _react2["default"].PropTypes.object,
					valid: _react2["default"].PropTypes.bool,
					validate: _react2["default"].PropTypes.func,
					value: _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.number])
				},

				getDefaultProps: function getDefaultProps() {
					return {
						value: ""
					};
				},

				getInitialState: function getInitialState() {
					return {
						focus: false,
						valid: true
					};
				},

				componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
					if (this.props.value === nextProps.value) {
						return;
					}

					if (nextProps.value === "") {
						if (!this.state.valid) {
							this.setState({ valid: true });
						}

						return;
					}

					if (this.props.validate) {
						var valid = this.props.validate(nextProps.value);

						this.setState({ valid: valid });

						if (!valid && this.props.onInvalid) {
							this.props.onInvalid(nextProps.value);
						}
					}
				},

				shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
					var propsValueChange = this.props.value !== nextProps.value;
					var stateFocusChange = this.state.focus !== nextState.focus;

					return propsValueChange || stateFocusChange;
				},

				toggleFocus: function toggleFocus() {
					this.setState({ focus: !this.state.focus });
				},

				handleKeyDown: function handleKeyDown(ev) {
					if (this.props.onKeyDown) {
						this.props.onKeyDown(ev);
					}
				},

				handleKeyUp: function handleKeyUp(ev) {
					if (this.props.onKeyUp) {
						this.props.onKeyUp(ev);
					}
				},

				handleChange: function handleChange(ev) {
					this.props.onChange(ev.currentTarget.value, ev);
				},

				render: function render() {
					return _react2["default"].createElement("input", {
						className: (0, _classnames2["default"])("hire-input", { invalid: !this.state.valid }),
						onBlur: this.toggleFocus,
						onChange: this.handleChange,
						onFocus: this.toggleFocus,
						onKeyDown: this.handleKeyDown,
						onKeyUp: this.handleKeyUp,
						placeholder: this.props.placeholder,
						style: this.props.style,
						value: this.props.value });
				}
			});

			exports["default"] = Input;
			module.exports = exports["default"];
		}, { "classnames": 1, "react": "react" }], 3: [function (_dereq_, module, exports) {
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { "default": obj };
			}

			var _react = _dereq_("react");

			var _react2 = _interopRequireDefault(_react);

			var keyValueMap = _react2["default"].PropTypes.shape({
				key: _react2["default"].PropTypes.string.isRequired,
				value: _react2["default"].PropTypes.string.isRequired
			});

			exports.keyValueMap = keyValueMap;
			// ARRAY OF

			var arrayOfKeyValueMaps = _react2["default"].PropTypes.arrayOf(keyValueMap);

			exports.arrayOfKeyValueMaps = arrayOfKeyValueMaps;
			var arrayOfStrings = _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string);

			exports.arrayOfStrings = arrayOfStrings;
			var arrayOfElements = _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.element);

			exports.arrayOfElements = arrayOfElements;
			// OR

			var stringOrArray = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.array]);

			exports.stringOrArray = stringOrArray;
			var stringOrKeyValueMap = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, keyValueMap]);

			exports.stringOrKeyValueMap = stringOrKeyValueMap;
			var stringOrArrayOfStrings = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, arrayOfStrings]);

			exports.stringOrArrayOfStrings = stringOrArrayOfStrings;
			var elementOrArrayOfElement = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.element, arrayOfElements]);

			exports.elementOrArrayOfElement = elementOrArrayOfElement;
			var arrayOfStringsOrArrayOfKeyValueMaps = _react2["default"].PropTypes.oneOfType([arrayOfStrings, arrayOfKeyValueMaps]);

			exports.arrayOfStringsOrArrayOfKeyValueMaps = arrayOfStringsOrArrayOfKeyValueMaps;
			var keyValueMapOrArrayOfKeyValueMaps = _react2["default"].PropTypes.oneOfType([keyValueMap, arrayOfKeyValueMaps]);
			exports.keyValueMapOrArrayOfKeyValueMaps = keyValueMapOrArrayOfKeyValueMaps;
		}, { "react": "react" }], 4: [function (_dereq_, module, exports) {

			/*
    * @param {Array} list
    * @returns {Boolean}
    */
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});
			exports.isListOfStrings = isListOfStrings;
			exports.isKeyValueMap = isKeyValueMap;
			exports.castArray = castArray;
			exports.castKeyValueArray = castKeyValueArray;

			function isListOfStrings(list) {
				if (!Array.isArray(list) || !list.length) {
					return false;
				}

				return list.every(function (item) {
					return typeof item === "string";
				});
			}

			/*
    * @param {Object} map
    * @returns {Boolean}
    */

			function isKeyValueMap(map) {
				if (map == null) {
					return false;
				}

				return map.hasOwnProperty("key") && map.hasOwnProperty("value");
			}

			/*
    * Always return an array.
    *
    * @param {String|Array} arr
    * @returns {Array}
    */

			function castArray(arr) {
				return Array.isArray(arr) ? arr : [arr];
			}

			;

			/*
    * Always return an array of key/value maps.
    *
    * @param {Number|String|Boolean|Array} list
    * @returns {Array} Array of key value maps, ie: [{key: "A", value: "A"}, {key: "B", value: "B"}, ...]
    */

			function castKeyValueArray(list) {
				list = castArray(list);

				return list.map(function (item) {
					return isKeyValueMap(item) ? item : {
						key: item,
						value: item
					};
				});
			}
		}, {}], 5: [function (_dereq_, module, exports) {
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});

			var _createClass = (function () {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
					}
				}return function (Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
				};
			})();

			var _get = function get(_x, _x2, _x3) {
				var _again = true;_function: while (_again) {
					var object = _x,
					    property = _x2,
					    receiver = _x3;desc = parent = getter = undefined;_again = false;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
						var parent = Object.getPrototypeOf(object);if (parent === null) {
							return undefined;
						} else {
							_x = parent;_x2 = property;_x3 = receiver;_again = true;continue _function;
						}
					} else if ("value" in desc) {
						return desc.value;
					} else {
						var getter = desc.get;if (getter === undefined) {
							return undefined;
						}return getter.call(receiver);
					}
				}
			};

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { "default": obj };
			}

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== "function" && superClass !== null) {
					throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
				}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
			}

			var _react = _dereq_("react");

			var _react2 = _interopRequireDefault(_react);

			var _hireFormsInput = _dereq_("hire-forms-input");

			var _hireFormsInput2 = _interopRequireDefault(_hireFormsInput);

			var _hireFormsOptions = _dereq_("hire-forms-options");

			var _hireFormsOptions2 = _interopRequireDefault(_hireFormsOptions);

			var _hireFormsPropTypes = _dereq_("hire-forms-prop-types");

			var _hireFormsUtils = _dereq_("hire-forms-utils");

			var Autocomplete = (function (_React$Component) {
				function Autocomplete(props) {
					_classCallCheck(this, Autocomplete);

					_get(Object.getPrototypeOf(Autocomplete.prototype), "constructor", this).call(this, props);

					this.cache = {};

					this.state = {
						options: [],
						query: props.value.value
					};
				}

				_inherits(Autocomplete, _React$Component);

				_createClass(Autocomplete, [{
					key: "componentWillReceiveProps",
					value: function componentWillReceiveProps(nextProps) {
						this.setState({
							query: nextProps.value.value,
							options: []
						});
					}
				}, {
					key: "handleInputChange",
					value: function handleInputChange(inputValue) {
						// Return empty options if inputValue length is beneath a treshold.
						if (inputValue.length < this.props.minLength) {
							return this.setState({
								query: inputValue,
								options: []
							});
						}

						// Return cache if inputValue is found in the cache.
						if (this.cache.hasOwnProperty(inputValue)) {
							return this.setState({
								query: inputValue,
								options: this.cache[inputValue]
							});
						}

						if (this.props.async == null) {
							this.filter(inputValue);
						} else {
							this.filterAsync(inputValue);
						}
					}
				}, {
					key: "filterAsync",
					value: function filterAsync(inputValue) {
						this.setState({ "query": inputValue });

						var done = function done(response) {
							// Add the options to the cache.
							this.cache[inputValue] = response;

							// Get the cache from the current (!!!) inputValue. The results trail behind
							// the user typing, so we have to pass the options of the current inputValue,
							// not the options of the inputValue of the fetch.
							var state = this.cache.hasOwnProperty(this.state.query) ? { options: this.cache[this.state.query] } : { options: [] };

							this.setState(state);
						};

						this.props.async(inputValue, done.bind(this));
					}
				}, {
					key: "filter",
					value: function filter(inputValue) {
						this.cache[inputValue] = inputValue === "" ? [] : this.props.options.filter(function (value) {
							if ((0, _hireFormsUtils.isKeyValueMap)(value)) {
								value = value.value;
							}

							return value.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
						});

						this.setState({
							query: inputValue,
							options: this.cache[inputValue]
						});
					}
				}, {
					key: "handleInputKeyDown",
					value: function handleInputKeyDown(ev) {
						// Up
						if (ev.keyCode === 38) {
							this.refs.options.highlightPrev();
						}

						// Down
						if (ev.keyCode === 40) {
							this.refs.options.highlightNext();
						}

						// Enter
						if (ev.keyCode === 13) {
							this.refs.options.select();
						}

						// Escape
						if (ev.keyCode === 27) {
							this.setState({
								options: [],
								query: ""
							});
						}
					}
				}, {
					key: "handleOptionsChange",

					/*
      * @param {Object} value Key/value map, ie: {key: "A", value: "A"}
      */
					value: function handleOptionsChange(value) {
						this.props.onChange(value);
					}
				}, {
					key: "render",
					value: function render() {
						var options = this.state.options.length !== 0 ? _react2["default"].createElement(_hireFormsOptions2["default"], {
							onChange: this.handleOptionsChange.bind(this),
							query: this.state.query,
							ref: "options",
							value: this.props.value,
							values: (0, _hireFormsUtils.castKeyValueArray)(this.state.options) }) : null;

						return _react2["default"].createElement("div", {
							className: "hire-forms-autocomplete",
							style: { position: "relative" } }, _react2["default"].createElement(_hireFormsInput2["default"], {
							onChange: this.handleInputChange.bind(this),
							onKeyDown: this.handleInputKeyDown.bind(this),
							placeholder: this.props.placeholder,
							ref: "input",
							value: this.state.query }), this.props.children, options);
					}
				}]);

				return Autocomplete;
			})(_react2["default"].Component);

			Autocomplete.propTypes = {
				async: _react2["default"].PropTypes.func,
				children: _react2["default"].PropTypes.element,
				minLength: _react2["default"].PropTypes.number,
				onChange: _react2["default"].PropTypes.func,
				options: _hireFormsPropTypes.arrayOfKeyValueMaps,
				placeholder: _react2["default"].PropTypes.string,
				value: _hireFormsPropTypes.keyValueMap
			};

			Autocomplete.defaultProps = {
				minLength: 1,
				value: ""
			};

			exports["default"] = Autocomplete;
			module.exports = exports["default"];
		}, { "hire-forms-input": 2, "hire-forms-options": 6, "hire-forms-prop-types": 3, "hire-forms-utils": 4, "react": "react" }], 6: [function (_dereq_, module, exports) {
			(function (global) {
				(function (f) {
					if (typeof exports === "object" && typeof module !== "undefined") {
						module.exports = f();
					} else if (typeof define === "function" && define.amd) {
						define([], f);
					} else {
						var g;if (typeof window !== "undefined") {
							g = window;
						} else if (typeof global !== "undefined") {
							g = global;
						} else if (typeof self !== "undefined") {
							g = self;
						} else {
							g = this;
						}g.HireFormsOptions = f();
					}
				})(function () {
					var define, module, exports;return (function e(t, n, r) {
						function s(o, u) {
							if (!n[o]) {
								if (!t[o]) {
									var a = typeof _dereq_ == "function" && _dereq_;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw (f.code = "MODULE_NOT_FOUND", f);
								}var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
									var n = t[o][1][e];return s(n ? n : e);
								}, l, l.exports, e, t, n, r);
							}return n[o].exports;
						}var i = typeof _dereq_ == "function" && _dereq_;for (var o = 0; o < r.length; o++) s(r[o]);return s;
					})({ 1: [function (_dereq_, module, exports) {
							"use strict";

							Object.defineProperty(exports, "__esModule", {
								value: true
							});

							function _interopRequireDefault(obj) {
								return obj && obj.__esModule ? obj : { "default": obj };
							}

							var _react = _dereq_("react");

							var _react2 = _interopRequireDefault(_react);

							var keyValueMap = _react2["default"].PropTypes.shape({
								key: _react2["default"].PropTypes.string.isRequired,
								value: _react2["default"].PropTypes.string.isRequired
							});

							exports.keyValueMap = keyValueMap;
							// ARRAY OF

							var arrayOfKeyValueMaps = _react2["default"].PropTypes.arrayOf(keyValueMap);

							exports.arrayOfKeyValueMaps = arrayOfKeyValueMaps;
							var arrayOfStrings = _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string);

							exports.arrayOfStrings = arrayOfStrings;
							var arrayOfElements = _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.element);

							exports.arrayOfElements = arrayOfElements;
							// OR

							var stringOrArray = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.array]);

							exports.stringOrArray = stringOrArray;
							var stringOrKeyValueMap = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, keyValueMap]);

							exports.stringOrKeyValueMap = stringOrKeyValueMap;
							var stringOrArrayOfStrings = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, arrayOfStrings]);

							exports.stringOrArrayOfStrings = stringOrArrayOfStrings;
							var elementOrArrayOfElement = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.element, arrayOfElements]);

							exports.elementOrArrayOfElement = elementOrArrayOfElement;
							var arrayOfStringsOrArrayOfKeyValueMaps = _react2["default"].PropTypes.oneOfType([arrayOfStrings, arrayOfKeyValueMaps]);

							exports.arrayOfStringsOrArrayOfKeyValueMaps = arrayOfStringsOrArrayOfKeyValueMaps;
							var keyValueMapOrArrayOfKeyValueMaps = _react2["default"].PropTypes.oneOfType([keyValueMap, arrayOfKeyValueMaps]);
							exports.keyValueMapOrArrayOfKeyValueMaps = keyValueMapOrArrayOfKeyValueMaps;
						}, { "react": "react" }], 2: [function (_dereq_, module, exports) {

							/*
        * @param {Array} list
        * @returns {Boolean}
        */
							"use strict";

							Object.defineProperty(exports, "__esModule", {
								value: true
							});
							exports.isListOfStrings = isListOfStrings;
							exports.isKeyValueMap = isKeyValueMap;
							exports.castArray = castArray;
							exports.castKeyValueArray = castKeyValueArray;

							function isListOfStrings(list) {
								if (!Array.isArray(list) || !list.length) {
									return false;
								}

								return list.every(function (item) {
									return typeof item === "string";
								});
							}

							/*
        * @param {Object} map
        * @returns {Boolean}
        */

							function isKeyValueMap(map) {
								if (map == null) {
									return false;
								}

								return map.hasOwnProperty("key") && map.hasOwnProperty("value");
							}

							/*
        * Always return an array.
        *
        * @param {String|Array} arr
        * @returns {Array}
        */

							function castArray(arr) {
								return Array.isArray(arr) ? arr : [arr];
							}

							;

							/*
        * Always return an array of key/value maps.
        *
        * @param {Number|String|Boolean|Array} list
        * @returns {Array} Array of key value maps, ie: [{key: "A", value: "A"}, {key: "B", value: "B"}, ...]
        */

							function castKeyValueArray(list) {
								list = castArray(list);

								return list.map(function (item) {
									return isKeyValueMap(item) ? item : {
										key: item,
										value: item
									};
								});
							}
						}, {}], 3: [function (_dereq_, module, exports) {
							"use strict";

							Object.defineProperty(exports, "__esModule", {
								value: true
							});

							var _createClass = (function () {
								function defineProperties(target, props) {
									for (var i = 0; i < props.length; i++) {
										var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
									}
								}return function (Constructor, protoProps, staticProps) {
									if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
								};
							})();

							function _interopRequireDefault(obj) {
								return obj && obj.__esModule ? obj : { "default": obj };
							}

							function _classCallCheck(instance, Constructor) {
								if (!(instance instanceof Constructor)) {
									throw new TypeError("Cannot call a class as a function");
								}
							}

							function _inherits(subClass, superClass) {
								if (typeof superClass !== "function" && superClass !== null) {
									throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
								}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
							}

							var _react = _dereq_("react");

							var _react2 = _interopRequireDefault(_react);

							var _classnames = _dereq_("classnames");

							var _classnames2 = _interopRequireDefault(_classnames);

							var _hireFormsPropTypes = _dereq_("hire-forms-prop-types");

							var _hireFormsUtils = _dereq_("hire-forms-utils");

							var HIGHTLIGHT_CLASS = "highlight";

							/**
        * Options are rendered beneath the autocomplete and select components.
        *
        * @class
        * @extends React.Component
        */

							var Options = (function (_React$Component) {
								function Options() {
									_classCallCheck(this, Options);

									if (_React$Component != null) {
										_React$Component.apply(this, arguments);
									}
								}

								_inherits(Options, _React$Component);

								_createClass(Options, [{
									key: "componentDidMount",
									value: function componentDidMount() {
										var node = _react2["default"].findDOMNode(this);

										if (node) {
											node.style.zIndex = 1000;
										}
									}
								}, {
									key: "componentWillUnmount",
									value: function componentWillUnmount() {
										var node = _react2["default"].findDOMNode(this);
										node.style.zIndex = 0;
									}
								}, {
									key: "sortRelevance",

									/**
          * Sort props.values on relevance. A result is more relevant
          * when the search query is more at the beginning of the string.
          * String.indexOf(props.query): lower is better.
          *
          * @returns {Array<String>} Sorted values on relevance
          */
									value: function sortRelevance(values) {
										var _this = this;

										return values.sort(function (a, b) {
											a = a.value.toLowerCase();
											b = b.value.toLowerCase();

											var indexA = a.indexOf(_this.props.query);
											var indexB = b.indexOf(_this.props.query);

											if (indexA > indexB) {
												return 1;
											}

											if (indexA < indexB) {
												return -1;
											}

											if (indexA === indexB) {
												if (a > b) {
													return 1;
												}

												if (a < b) {
													return -1;
												}
											}

											return 0;
										});
									}
								}, {
									key: "highlight",
									value: function highlight(target) {
										// Check if target is an event object.
										if (target.hasOwnProperty("currentTarget")) {
											target = target.currentTarget;
										}

										target.classList.add(HIGHTLIGHT_CLASS);
									}
								}, {
									key: "unhighlight",

									/**
          * Unhighlight the currently highlighted option.
          *
          *
          */
									value: function unhighlight() {
										var el = undefined;
										var node = _react2["default"].findDOMNode(this);

										if (node) {
											el = node.querySelector("li.highlight");

											if (el) {
												el.classList.remove(HIGHTLIGHT_CLASS);
											}
										}

										return el;
									}
								}, {
									key: "handleClick",
									value: function handleClick(ev) {
										this.props.onChange(this.getOptionData(ev.currentTarget));
									}
								}, {
									key: "highlightPrev",
									value: function highlightPrev() {
										var prev = undefined;
										var current = this.unhighlight();

										if (current) {
											prev = current.previousElementSibling;
										}

										// If current and prev aren't found, start at the top.
										// Current is not found if there is no list item highlighted.
										// Prev is not found if the first list item is highlighted.
										if (!prev) {
											prev = _react2["default"].findDOMNode(this).lastChild;
										}

										this.highlight(prev);
									}
								}, {
									key: "highlightNext",
									value: function highlightNext() {
										var next = undefined;
										var current = this.unhighlight();

										if (current) {
											next = current.nextElementSibling;
										}

										// If current and next aren't found, start at the top.
										// Current is not found if there is no list item highlighted.
										// Next is not found if the last list item is highlighted.
										if (!next) {
											next = _react2["default"].findDOMNode(this).firstChild;
										}

										this.highlight(next);
									}
								}, {
									key: "select",
									value: function select() {
										var current = this.unhighlight();

										if (current) {
											this.props.onChange(this.getOptionData(current));
										}
									}
								}, {
									key: "getOptionData",

									/**
          * Get the key (id) and value (display name) of an option DOM element.
          *
          * @param {Object} el - Option DOM element
          * @returns {Object}
          */
									value: function getOptionData(el) {
										return {
											key: el.getAttribute("data-key"),
											value: el.getAttribute("data-value")
										};
									}
								}, {
									key: "render",
									value: function render() {
										var _this2 = this;

										if (this.props.values.length === 0) {
											return null;
										}

										var values = this.props.sortRelevance ? this.sortRelevance(this.props.values) : this.props.values;

										var listitems = values.map(function (data, index) {
											var displayValue = data.value;

											if (_this2.props.query.length) {
												var re = new RegExp(_this2.props.query, "ig");
												displayValue = data.value.replace(re, "<span class=\"highlight\">$&</span>");
											}

											var selectedValue = (0, _hireFormsUtils.castArray)(_this2.props.value);

											return _react2["default"].createElement("li", {
												className: (0, _classnames2["default"])({ selected: selectedValue.indexOf(data.value) > -1 }),
												dangerouslySetInnerHTML: { __html: displayValue },
												"data-key": data.key,
												"data-value": data.value,
												key: index,
												onClick: _this2.handleClick.bind(_this2),
												onMouseEnter: _this2.highlight.bind(_this2),
												onMouseLeave: _this2.unhighlight.bind(_this2) });
										});

										return _react2["default"].createElement("ul", {
											className: "hire-options" }, listitems);
									}
								}]);

								return Options;
							})(_react2["default"].Component);

							Options.defaultProps = {
								query: "",
								sortRelevance: true,
								value: "",
								values: []
							};

							Options.propTypes = {
								onChange: _react2["default"].PropTypes.func.isRequired,
								query: _react2["default"].PropTypes.string,
								sortRelevance: _react2["default"].PropTypes.bool,
								value: _hireFormsPropTypes.keyValueMapOrArrayOfKeyValueMaps,
								values: _hireFormsPropTypes.arrayOfKeyValueMaps
							};

							exports["default"] = Options;
							module.exports = exports["default"];
						}, { "classnames": "classnames", "hire-forms-prop-types": 1, "hire-forms-utils": 2, "react": "react" }] }, {}, [3])(3);
				});
			}).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
		}, { "classnames": 7, "hire-forms-prop-types": 8, "hire-forms-utils": 9, "react": "react" }], 7: [function (_dereq_, module, exports) {
			arguments[4][1][0].apply(exports, arguments);
		}, { "dup": 1 }], 8: [function (_dereq_, module, exports) {
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { "default": obj };
			}

			var _react = _dereq_("react");

			var _react2 = _interopRequireDefault(_react);

			var elementOrArrayOfElement = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.element, _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.element)]);

			exports.elementOrArrayOfElement = elementOrArrayOfElement;
			/**
    * A string or an object,
    * example: {key: "somekey", value: "somevalue"}.
    */
			var stringOrKeyValue = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.shape({
				key: _react2["default"].PropTypes.string,
				value: _react2["default"].PropTypes.string
			})]);

			exports.stringOrKeyValue = stringOrKeyValue;
			var stringOrArray = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.array]);

			exports.stringOrArray = stringOrArray;
			var stringOrArrayOfString = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string)]);

			exports.stringOrArrayOfString = stringOrArrayOfString;
			var arrayOfKeyValue = _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.shape({
				key: _react2["default"].PropTypes.string.isRequired,
				value: _react2["default"].PropTypes.string.isRequired
			}));

			exports.arrayOfKeyValue = arrayOfKeyValue;
			/**
    * An array of strings or an array of key/value objects,
    * example: [{key: "somekey", value: "somevalue"}].
    */
			var arrayOfStringOrArrayOfKeyValue = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string), _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.shape({
				key: _react2["default"].PropTypes.string,
				value: _react2["default"].PropTypes.string
			}))]);
			exports.arrayOfStringOrArrayOfKeyValue = arrayOfStringOrArrayOfKeyValue;
		}, { "react": "react" }], 9: [function (_dereq_, module, exports) {
			arguments[4][4][0].apply(exports, arguments);
		}, { "dup": 4 }] }, {}, [5])(5);
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(_dereq_,module,exports){
(function (global){
"use strict";

(function (f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = f();
	} else if (typeof define === "function" && define.amd) {
		define([], f);
	} else {
		var g;if (typeof window !== "undefined") {
			g = window;
		} else if (typeof global !== "undefined") {
			g = global;
		} else if (typeof self !== "undefined") {
			g = self;
		} else {
			g = this;
		}g.HireFormsForm = f();
	}
})(function () {
	var define, module, exports;return (function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = typeof _dereq_ == "function" && _dereq_;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw (f.code = "MODULE_NOT_FOUND", f);
				}var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
					var n = t[o][1][e];return s(n ? n : e);
				}, l, l.exports, e, t, n, r);
			}return n[o].exports;
		}var i = typeof _dereq_ == "function" && _dereq_;for (var o = 0; o < r.length; o++) s(r[o]);return s;
	})({ 1: [function (_dereq_, module, exports) {
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { "default": obj };
			}

			var _react = _dereq_("react");

			var _react2 = _interopRequireDefault(_react);

			var keyValueMap = _react2["default"].PropTypes.shape({
				key: _react2["default"].PropTypes.string.isRequired,
				value: _react2["default"].PropTypes.string.isRequired
			});

			exports.keyValueMap = keyValueMap;
			// ARRAY OF

			var arrayOfKeyValueMaps = _react2["default"].PropTypes.arrayOf(keyValueMap);

			exports.arrayOfKeyValueMaps = arrayOfKeyValueMaps;
			var arrayOfStrings = _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string);

			exports.arrayOfStrings = arrayOfStrings;
			var arrayOfElements = _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.element);

			exports.arrayOfElements = arrayOfElements;
			// OR

			var stringOrArray = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.array]);

			exports.stringOrArray = stringOrArray;
			var stringOrKeyValueMap = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, keyValueMap]);

			exports.stringOrKeyValueMap = stringOrKeyValueMap;
			var stringOrArrayOfStrings = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, arrayOfStrings]);

			exports.stringOrArrayOfStrings = stringOrArrayOfStrings;
			var elementOrArrayOfElement = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.element, arrayOfElements]);

			exports.elementOrArrayOfElement = elementOrArrayOfElement;
			var arrayOfStringsOrArrayOfKeyValueMaps = _react2["default"].PropTypes.oneOfType([arrayOfStrings, arrayOfKeyValueMaps]);

			exports.arrayOfStringsOrArrayOfKeyValueMaps = arrayOfStringsOrArrayOfKeyValueMaps;
			var keyValueMapOrArrayOfKeyValueMaps = _react2["default"].PropTypes.oneOfType([keyValueMap, arrayOfKeyValueMaps]);
			exports.keyValueMapOrArrayOfKeyValueMaps = keyValueMapOrArrayOfKeyValueMaps;
		}, { "react": "react" }], 2: [function (_dereq_, module, exports) {

			/*
    * @param {Array} list
    * @returns {Boolean}
    */
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});
			exports.isListOfStrings = isListOfStrings;
			exports.isKeyValueMap = isKeyValueMap;
			exports.castArray = castArray;
			exports.castKeyValueArray = castKeyValueArray;

			function isListOfStrings(list) {
				if (!Array.isArray(list) || !list.length) {
					return false;
				}

				return list.every(function (item) {
					return typeof item === "string";
				});
			}

			/*
    * @param {Object} map
    * @returns {Boolean}
    */

			function isKeyValueMap(map) {
				if (map == null) {
					return false;
				}

				return map.hasOwnProperty("key") && map.hasOwnProperty("value");
			}

			/*
    * Always return an array.
    *
    * @param {String|Array} arr
    * @returns {Array}
    */

			function castArray(arr) {
				return Array.isArray(arr) ? arr : [arr];
			}

			;

			/*
    * Always return an array of key/value maps.
    *
    * @param {Number|String|Boolean|Array} list
    * @returns {Array} Array of key value maps, ie: [{key: "A", value: "A"}, {key: "B", value: "B"}, ...]
    */

			function castKeyValueArray(list) {
				list = castArray(list);

				return list.map(function (item) {
					return isKeyValueMap(item) ? item : {
						key: item,
						value: item
					};
				});
			}
		}, {}], 3: [function (_dereq_, module, exports) {
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});

			var _extends = Object.assign || function (target) {
				for (var i = 1; i < arguments.length; i++) {
					var source = arguments[i];for (var key in source) {
						if (Object.prototype.hasOwnProperty.call(source, key)) {
							target[key] = source[key];
						}
					}
				}return target;
			};

			var _createClass = (function () {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
					}
				}return function (Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
				};
			})();

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { "default": obj };
			}

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== "function" && superClass !== null) {
					throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
				}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
			}

			var _react = _dereq_("react");

			var _react2 = _interopRequireDefault(_react);

			var _hireFormsPropTypes = _dereq_("hire-forms-prop-types");

			var _hireFormsUtils = _dereq_("hire-forms-utils");

			exports["default"] = function (ComposedComponent) {
				var classNames = arguments[1] === undefined ? [] : arguments[1];

				var Form = (function (_React$Component) {
					function Form() {
						_classCallCheck(this, Form);

						if (_React$Component != null) {
							_React$Component.apply(this, arguments);
						}
					}

					_inherits(Form, _React$Component);

					_createClass(Form, [{
						key: "handleChange",
						value: function handleChange(key, value) {
							var attr = (0, _hireFormsUtils.castArray)(this.props.attr);

							this.props.onChange(attr.concat(key), value);
						}
					}, {
						key: "handleDelete",
						value: function handleDelete(key) {
							var attr = (0, _hireFormsUtils.castArray)(this.props.attr);

							this.props.onDelete(attr.concat(key));
						}
					}, {
						key: "handleInvalid",
						value: function handleInvalid(key) {
							var attr = (0, _hireFormsUtils.castArray)(this.props.attr);

							this.props.onInvalid(attr.concat(key));
						}
					}, {
						key: "render",
						value: function render() {
							return _react2["default"].createElement("div", { className: "hire-forms-form " + (0, _hireFormsUtils.castArray)(classNames).join(" ") }, _react2["default"].createElement(ComposedComponent, _extends({}, this.props, {
								handleChange: this.handleChange,
								handleDelete: this.handleDelete,
								handleInvalid: this.handleInvalid })));
						}
					}]);

					return Form;
				})(_react2["default"].Component);

				Form.propTypes = {
					// The array can consist of strings and numbers.
					attr: _hireFormsPropTypes.stringOrArray,
					onChange: _react2["default"].PropTypes.func.isRequired,
					onDelete: _react2["default"].PropTypes.func,
					onInvalid: _react2["default"].PropTypes.func,
					value: _react2["default"].PropTypes.object
				};

				Form.defaultProps = {
					attr: []
				};

				return Form;
			};

			module.exports = exports["default"];
		}, { "hire-forms-prop-types": 1, "hire-forms-utils": 2, "react": "react" }] }, {}, [3])(3);
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(_dereq_,module,exports){
(function (global){
"use strict";

(function (f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = f();
	} else if (typeof define === "function" && define.amd) {
		define([], f);
	} else {
		var g;if (typeof window !== "undefined") {
			g = window;
		} else if (typeof global !== "undefined") {
			g = global;
		} else if (typeof self !== "undefined") {
			g = self;
		} else {
			g = this;
		}g.HireFormsTextarea = f();
	}
})(function () {
	var define, module, exports;return (function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = typeof _dereq_ == "function" && _dereq_;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw (f.code = "MODULE_NOT_FOUND", f);
				}var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
					var n = t[o][1][e];return s(n ? n : e);
				}, l, l.exports, e, t, n, r);
			}return n[o].exports;
		}var i = typeof _dereq_ == "function" && _dereq_;for (var o = 0; o < r.length; o++) s(r[o]);return s;
	})({ 1: [function (_dereq_, module, exports) {
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});

			var _createClass = (function () {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
					}
				}return function (Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
				};
			})();

			var _get = function get(_x, _x2, _x3) {
				var _again = true;_function: while (_again) {
					var object = _x,
					    property = _x2,
					    receiver = _x3;desc = parent = getter = undefined;_again = false;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
						var parent = Object.getPrototypeOf(object);if (parent === null) {
							return undefined;
						} else {
							_x = parent;_x2 = property;_x3 = receiver;_again = true;continue _function;
						}
					} else if ("value" in desc) {
						return desc.value;
					} else {
						var getter = desc.get;if (getter === undefined) {
							return undefined;
						}return getter.call(receiver);
					}
				}
			};

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { "default": obj };
			}

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== "function" && superClass !== null) {
					throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
				}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
			}

			var _react = _dereq_("react");

			var _react2 = _interopRequireDefault(_react);

			var _classnames = _dereq_("classnames");

			var _classnames2 = _interopRequireDefault(_classnames);

			var Input = (function (_React$Component) {
				function Input(props) {
					_classCallCheck(this, Input);

					_get(Object.getPrototypeOf(Input.prototype), "constructor", this).call(this, props);

					this.state = {
						valid: true,
						invalidMessage: null
					};
				}

				_inherits(Input, _React$Component);

				_createClass(Input, [{
					key: "componentWillReceiveProps",
					value: function componentWillReceiveProps(nextProps) {
						if (this.props.value === nextProps.value) {
							return;
						}

						if (nextProps.value === "") {
							if (!this.state.valid) {
								this.setState({
									valid: true,
									invalidMessage: null
								});
							}

							return;
						} else if (this.props.validate) {
							var validator = this.props.validate(nextProps.value);

							this.setState({
								valid: validator.isValid,
								invalidMessage: validator.message
							});

							if (!validator.isValid && this.props.onInvalid) {
								this.props.onInvalid(validator.message, nextProps.value);
							}
						}
					}
				}, {
					key: "shouldComponentUpdate",
					value: function shouldComponentUpdate(nextProps, nextState) {
						return this.props.value !== nextProps.value;
					}
				}, {
					key: "handleKeyDown",
					value: function handleKeyDown(ev) {
						if (this.props.onKeyDown) {
							this.props.onKeyDown(ev);
						}
					}
				}, {
					key: "handleKeyUp",
					value: function handleKeyUp(ev) {
						if (this.props.onKeyUp) {
							this.props.onKeyUp(ev);
						}
					}
				}, {
					key: "handleChange",
					value: function handleChange(ev) {
						this.props.onChange(ev.currentTarget.value, ev);
					}
				}, {
					key: "render",
					value: function render() {
						var invalidMessage = this.state.invalidMessage ? _react2["default"].createElement("div", { className: "hire-forms-invalid-message" }, this.state.invalidMessage) : null;

						return _react2["default"].createElement("div", {
							className: (0, _classnames2["default"])("hire-input", { invalid: !this.state.valid }) }, _react2["default"].createElement("input", {
							onChange: this.handleChange.bind(this),
							onKeyDown: this.handleKeyDown.bind(this),
							onKeyUp: this.handleKeyUp.bind(this),
							placeholder: this.props.placeholder,
							style: this.props.style,
							value: this.props.value }), invalidMessage);
					}
				}]);

				return Input;
			})(_react2["default"].Component);

			Input.propTypes = {
				onChange: _react2["default"].PropTypes.func,
				onInvalid: _react2["default"].PropTypes.func,
				onKeyDown: _react2["default"].PropTypes.func,
				onKeyUp: _react2["default"].PropTypes.func,
				placeholder: _react2["default"].PropTypes.string,
				style: _react2["default"].PropTypes.object,
				valid: _react2["default"].PropTypes.bool,
				validate: _react2["default"].PropTypes.func,
				value: _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.number])
			};

			Input.defaultProps = {
				value: ""
			};

			exports["default"] = Input;
			module.exports = exports["default"];
		}, { "classnames": "classnames", "react": "react" }] }, {}, [1])(1);
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(_dereq_,module,exports){
(function (global){
"use strict";

(function (f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = f();
	} else if (typeof define === "function" && define.amd) {
		define([], f);
	} else {
		var g;if (typeof window !== "undefined") {
			g = window;
		} else if (typeof global !== "undefined") {
			g = global;
		} else if (typeof self !== "undefined") {
			g = self;
		} else {
			g = this;
		}g.HireFormsTextarea = f();
	}
})(function () {
	var define, module, exports;return (function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = typeof _dereq_ == "function" && _dereq_;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw (f.code = "MODULE_NOT_FOUND", f);
				}var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
					var n = t[o][1][e];return s(n ? n : e);
				}, l, l.exports, e, t, n, r);
			}return n[o].exports;
		}var i = typeof _dereq_ == "function" && _dereq_;for (var o = 0; o < r.length; o++) s(r[o]);return s;
	})({ 1: [function (_dereq_, module, exports) {
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { "default": obj };
			}

			var _react = _dereq_("react");

			var _react2 = _interopRequireDefault(_react);

			var elementOrArrayOfElement = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.element, _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.element)]);

			exports.elementOrArrayOfElement = elementOrArrayOfElement;
			/**
    * A string or an object,
    * example: {key: "somekey", value: "somevalue"}.
    */
			var stringOrKeyValue = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.shape({
				key: _react2["default"].PropTypes.string,
				value: _react2["default"].PropTypes.string
			})]);

			exports.stringOrKeyValue = stringOrKeyValue;
			var stringOrArray = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.array]);

			exports.stringOrArray = stringOrArray;
			var stringOrArrayOfString = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string)]);

			exports.stringOrArrayOfString = stringOrArrayOfString;
			var arrayOfKeyValue = _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.shape({
				key: _react2["default"].PropTypes.string.isRequired,
				value: _react2["default"].PropTypes.string.isRequired
			}));

			exports.arrayOfKeyValue = arrayOfKeyValue;
			/**
    * An array of strings or an array of key/value objects,
    * example: [{key: "somekey", value: "somevalue"}].
    */
			var arrayOfStringOrArrayOfKeyValue = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string), _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.shape({
				key: _react2["default"].PropTypes.string,
				value: _react2["default"].PropTypes.string
			}))]);
			exports.arrayOfStringOrArrayOfKeyValue = arrayOfStringOrArrayOfKeyValue;
		}, { "react": "react" }], 2: [function (_dereq_, module, exports) {
			//TODO fix propType for this.props.view
			//TODO rename this.props.value to this.props.values

			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});

			var _createClass = (function () {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
					}
				}return function (Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
				};
			})();

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { "default": obj };
			}

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== "function" && superClass !== null) {
					throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
				}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
			}

			var _react = _dereq_("react");

			var _react2 = _interopRequireDefault(_react);

			var _immutable = _dereq_("immutable");

			var _immutable2 = _interopRequireDefault(_immutable);

			var _classnames = _dereq_("classnames");

			var _classnames2 = _interopRequireDefault(_classnames);

			var _hireFormsUtils = _dereq_("hire-forms-utils");

			var _hireFormsPropTypes = _dereq_("hire-forms-prop-types");

			var MultiForm = (function (_React$Component) {
				function MultiForm() {
					_classCallCheck(this, MultiForm);

					if (_React$Component != null) {
						_React$Component.apply(this, arguments);
					}
				}

				_inherits(MultiForm, _React$Component);

				_createClass(MultiForm, [{
					key: "handleAddForm",

					/**
      * Add a form.
      *
      * The key is the Immutable.List size (equal to highest index + 1).
      * The value is an Immutable.Map. The form will extend/merge the map
      * with default values.
      *
      * @method
      */
					value: function handleAddForm() {
						var attr = (0, _hireFormsUtils.castArray)(this.props.attr);
						var index = this.props.values.size;
						var key = attr.concat(index);

						this.props.onChange(key, new _immutable2["default"].Map());
					}
				}, {
					key: "handleRemoveForm",
					value: function handleRemoveForm(index) {
						var attr = (0, _hireFormsUtils.castArray)(this.props.attr);
						var key = attr.concat(index);

						this.props.onDelete(key);
					}
				}, {
					key: "handleChange",
					value: function handleChange(key, value) {
						this.props.onChange(key, value);
					}
				}, {
					key: "handleDelete",
					value: function handleDelete(key) {
						this.props.onDelete(key);
					}
				}, {
					key: "handleInvalid",
					value: function handleInvalid(key) {
						this.props.onInvalid(key);
					}
				}, {
					key: "render",
					value: function render() {
						var _this = this;

						var attr = (0, _hireFormsUtils.castArray)(this.props.attr);

						var renderedFormComponents = this.props.values.map(function (listItem, index) {
							return _react2["default"].createElement("li", { key: index }, _react2["default"].createElement(_this.props.component, {
								attr: attr.concat(index),
								onChange: _this.handleChange.bind(_this),
								onDelete: _this.handleDelete.bind(_this),
								onInvalid: _this.handleInvalid.bind(_this),
								value: listItem }), _react2["default"].createElement("button", {
								className: "hire-remove-form",
								onClick: _this.handleRemoveForm.bind(_this, index),
								title: "Remove" }, "-"));
						});

						var formList = renderedFormComponents.size ? _react2["default"].createElement("ul", null, renderedFormComponents) : null;

						return _react2["default"].createElement("div", { className: "hire-multi-form" }, formList, _react2["default"].createElement("button", {
							className: (0, _classnames2["default"])("hire-add-form", { first: this.props.value.size === 0 }),
							onClick: this.handleAddForm.bind(this),
							title: "Add" }, "+"));
					}
				}]);

				return MultiForm;
			})(_react2["default"].Component);

			MultiForm.defaultProps = {
				value: new _immutable2["default"].List()
			};

			// view: React.PropTypes.element.isRequired
			MultiForm.propTypes = {
				attr: _hireFormsPropTypes.stringOrArrayOfString,
				onChange: _react2["default"].PropTypes.func,
				onDelete: _react2["default"].PropTypes.func,
				onInvalid: _react2["default"].PropTypes.func,
				values: _react2["default"].PropTypes.instanceOf(_immutable2["default"].List),
				component: _react2["default"].PropTypes.func
			};

			exports["default"] = MultiForm;
			module.exports = exports["default"];
		}, { "classnames": "classnames", "hire-forms-prop-types": 1, "hire-forms-utils": 3, "immutable": "immutable", "react": "react" }], 3: [function (_dereq_, module, exports) {

			/*
    * @param {Array} list
    * @returns {Boolean}
    */
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});
			exports.isListOfStrings = isListOfStrings;
			exports.isKeyValueMap = isKeyValueMap;
			exports.castArray = castArray;
			exports.castKeyValueArray = castKeyValueArray;

			function isListOfStrings(list) {
				if (!Array.isArray(list) || !list.length) {
					return false;
				}

				return list.every(function (item) {
					return typeof item === "string";
				});
			}

			/*
    * @param {Object} map
    * @returns {Boolean}
    */

			function isKeyValueMap(map) {
				if (map == null) {
					return false;
				}

				return map.hasOwnProperty("key") && map.hasOwnProperty("value");
			}

			/*
    * Always return an array.
    *
    * @param {String|Array} arr
    * @returns {Array}
    */

			function castArray(arr) {
				return Array.isArray(arr) ? arr : [arr];
			}

			;

			/*
    * Always return an array of key/value maps.
    *
    * @param {Number|String|Boolean|Array} list
    * @returns {Array} Array of key value maps, ie: [{key: "A", value: "A"}, {key: "B", value: "B"}, ...]
    */

			function castKeyValueArray(list) {
				list = castArray(list);

				return list.map(function (item) {
					return isKeyValueMap(item) ? item : {
						key: item,
						value: item
					};
				});
			}
		}, {}] }, {}, [2])(2);
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"classnames":"classnames","hire-forms-prop-types":5,"hire-forms-utils":12,"immutable":"immutable","react":"react"}],5:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var elementOrArrayOfElement = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.element, _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.element)]);

exports.elementOrArrayOfElement = elementOrArrayOfElement;
/**
 * A string or an object,
 * example: {key: "somekey", value: "somevalue"}.
 */
var stringOrKeyValue = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.shape({
	key: _react2["default"].PropTypes.string,
	value: _react2["default"].PropTypes.string
})]);

exports.stringOrKeyValue = stringOrKeyValue;
var stringOrArray = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.array]);

exports.stringOrArray = stringOrArray;
var stringOrArrayOfString = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string)]);

exports.stringOrArrayOfString = stringOrArrayOfString;
var arrayOfKeyValue = _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.shape({
	key: _react2["default"].PropTypes.string.isRequired,
	value: _react2["default"].PropTypes.string.isRequired
}));

exports.arrayOfKeyValue = arrayOfKeyValue;
/**
 * An array of strings or an array of key/value objects,
 * example: [{key: "somekey", value: "somevalue"}].
 */
var arrayOfStringOrArrayOfKeyValue = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string), _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.shape({
	key: _react2["default"].PropTypes.string,
	value: _react2["default"].PropTypes.string
}))]);
exports.arrayOfStringOrArrayOfKeyValue = arrayOfStringOrArrayOfKeyValue;

},{"react":"react"}],6:[function(_dereq_,module,exports){
(function (global){
"use strict";

(function (f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = f();
	} else if (typeof define === "function" && define.amd) {
		define([], f);
	} else {
		var g;if (typeof window !== "undefined") {
			g = window;
		} else if (typeof global !== "undefined") {
			g = global;
		} else if (typeof self !== "undefined") {
			g = self;
		} else {
			g = this;
		}g.HireFormsOptions = f();
	}
})(function () {
	var define, module, exports;return (function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = typeof _dereq_ == "function" && _dereq_;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw (f.code = "MODULE_NOT_FOUND", f);
				}var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
					var n = t[o][1][e];return s(n ? n : e);
				}, l, l.exports, e, t, n, r);
			}return n[o].exports;
		}var i = typeof _dereq_ == "function" && _dereq_;for (var o = 0; o < r.length; o++) s(r[o]);return s;
	})({ 1: [function (_dereq_, module, exports) {
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { "default": obj };
			}

			var _react = _dereq_("react");

			var _react2 = _interopRequireDefault(_react);

			var keyValueMap = _react2["default"].PropTypes.shape({
				key: _react2["default"].PropTypes.string.isRequired,
				value: _react2["default"].PropTypes.string.isRequired
			});

			exports.keyValueMap = keyValueMap;
			// ARRAY OF

			var arrayOfKeyValueMaps = _react2["default"].PropTypes.arrayOf(keyValueMap);

			exports.arrayOfKeyValueMaps = arrayOfKeyValueMaps;
			var arrayOfStrings = _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string);

			exports.arrayOfStrings = arrayOfStrings;
			var arrayOfElements = _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.element);

			exports.arrayOfElements = arrayOfElements;
			// OR

			var stringOrArray = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.array]);

			exports.stringOrArray = stringOrArray;
			var stringOrKeyValueMap = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, keyValueMap]);

			exports.stringOrKeyValueMap = stringOrKeyValueMap;
			var stringOrArrayOfStrings = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, arrayOfStrings]);

			exports.stringOrArrayOfStrings = stringOrArrayOfStrings;
			var elementOrArrayOfElement = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.element, arrayOfElements]);

			exports.elementOrArrayOfElement = elementOrArrayOfElement;
			var arrayOfStringsOrArrayOfKeyValueMaps = _react2["default"].PropTypes.oneOfType([arrayOfStrings, arrayOfKeyValueMaps]);

			exports.arrayOfStringsOrArrayOfKeyValueMaps = arrayOfStringsOrArrayOfKeyValueMaps;
			var keyValueMapOrArrayOfKeyValueMaps = _react2["default"].PropTypes.oneOfType([keyValueMap, arrayOfKeyValueMaps]);
			exports.keyValueMapOrArrayOfKeyValueMaps = keyValueMapOrArrayOfKeyValueMaps;
		}, { "react": "react" }], 2: [function (_dereq_, module, exports) {

			/*
    * @param {Array} list
    * @returns {Boolean}
    */
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});
			exports.isListOfStrings = isListOfStrings;
			exports.isKeyValueMap = isKeyValueMap;
			exports.castArray = castArray;
			exports.castKeyValueArray = castKeyValueArray;

			function isListOfStrings(list) {
				if (!Array.isArray(list) || !list.length) {
					return false;
				}

				return list.every(function (item) {
					return typeof item === "string";
				});
			}

			/*
    * @param {Object} map
    * @returns {Boolean}
    */

			function isKeyValueMap(map) {
				if (map == null) {
					return false;
				}

				return map.hasOwnProperty("key") && map.hasOwnProperty("value");
			}

			/*
    * Always return an array.
    *
    * @param {String|Array} arr
    * @returns {Array}
    */

			function castArray(arr) {
				return Array.isArray(arr) ? arr : [arr];
			}

			;

			/*
    * Always return an array of key/value maps.
    *
    * @param {Number|String|Boolean|Array} list
    * @returns {Array} Array of key value maps, ie: [{key: "A", value: "A"}, {key: "B", value: "B"}, ...]
    */

			function castKeyValueArray(list) {
				list = castArray(list);

				return list.map(function (item) {
					return isKeyValueMap(item) ? item : {
						key: item,
						value: item
					};
				});
			}
		}, {}], 3: [function (_dereq_, module, exports) {
			// TODO move listitem to seperate component (so we don't have to store data-key and data-value as attributes)
			// Move util functions to seperate module

			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});

			var _createClass = (function () {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
					}
				}return function (Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
				};
			})();

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { "default": obj };
			}

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== "function" && superClass !== null) {
					throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
				}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
			}

			var _react = _dereq_("react");

			var _react2 = _interopRequireDefault(_react);

			var _classnames = _dereq_("classnames");

			var _classnames2 = _interopRequireDefault(_classnames);

			var _hireFormsPropTypes = _dereq_("hire-forms-prop-types");

			var _hireFormsUtils = _dereq_("hire-forms-utils");

			/**
    * Options are rendered beneath the autocomplete and select components.
    *
    * @class
    * @extends React.Component
    */

			var Options = (function (_React$Component) {
				function Options() {
					_classCallCheck(this, Options);

					if (_React$Component != null) {
						_React$Component.apply(this, arguments);
					}
				}

				_inherits(Options, _React$Component);

				_createClass(Options, [{
					key: "componentDidMount",
					value: function componentDidMount() {
						var node = _react2["default"].findDOMNode(this);

						if (node) {
							node.style.zIndex = 1000;
						}
					}
				}, {
					key: "componentWillUnmount",
					value: function componentWillUnmount() {
						var node = _react2["default"].findDOMNode(this);
						node.style.zIndex = 0;
					}
				}, {
					key: "sortRelevance",

					/**
      * Sort values on relevance. A result is more relevant when the search
      * query is more at the beginning of the string. In other words:
      * String.indexOf(props.query): lower is better.
      * @param {Array<Object>} value An array of key/value maps
      * @param {String} query A search query
      * @returns {Array<Object>} Sorted values on relevance
      */
					value: function sortRelevance(values, query) {
						return values.sort(function (a, b) {
							a = a.value.toLowerCase();
							b = b.value.toLowerCase();

							var indexA = a.indexOf(query);
							var indexB = b.indexOf(query);

							if (indexA > indexB) {
								return 1;
							}

							if (indexA < indexB) {
								return -1;
							}

							if (indexA === indexB) {
								if (a > b) {
									return 1;
								}

								if (a < b) {
									return -1;
								}
							}

							return 0;
						});
					}
				}, {
					key: "highlight",

					/*
      * highlight the currently highlighted option.
      *
      * @param {Object} target An HTMLElement or event object
      * @param {String} className Name of the highlight class
      */
					value: function highlight(target, className) {
						// Check if target is an event object.
						if (target.hasOwnProperty("currentTarget")) {
							target = target.currentTarget;
						}

						target.classList.add(className);
					}
				}, {
					key: "unhighlight",

					/**
      * Unhighlight the currently highlighted option.
      *
      * @param {String} className Name of the highlight class
      * @return {Object} The unhighlighted HTMLElement
      */
					value: function unhighlight(className) {
						var el = undefined;
						var node = _react2["default"].findDOMNode(this);

						if (node) {
							el = node.querySelector("li." + className);

							if (el) {
								el.classList.remove(className);
							}
						}

						return el;
					}
				}, {
					key: "handleClick",
					value: function handleClick(ev) {
						this.props.onChange(this.getOptionData(ev.currentTarget));
					}
				}, {
					key: "highlightPrev",
					value: function highlightPrev() {
						var prev = undefined;
						var current = this.unhighlight(this.props.highlightClass);

						if (current) {
							prev = current.previousElementSibling;
						}

						// If current and prev aren't found, start at the top.
						// Current is not found if there is no list item highlighted.
						// Prev is not found if the first list item is highlighted.
						if (!prev) {
							prev = _react2["default"].findDOMNode(this).lastChild;
						}

						this.highlight(prev, this.props.highlightClass);
					}
				}, {
					key: "highlightNext",
					value: function highlightNext() {
						var next = undefined;
						var current = this.unhighlight(this.props.highlightClass);

						if (current) {
							next = current.nextElementSibling;
						}

						// If current and next aren't found, start at the top.
						// Current is not found if there is no list item highlighted.
						// Next is not found if the last list item is highlighted.
						if (!next) {
							next = _react2["default"].findDOMNode(this).firstChild;
						}

						this.highlight(next, this.props.highlightClass);
					}
				}, {
					key: "select",
					value: function select() {
						var current = this.unhighlight(this.props.highlightClass);

						if (current) {
							this.props.onChange(this.getOptionData(current));
						}
					}
				}, {
					key: "getOptionData",

					/**
      * Get the key (id) and value (display name) of an option DOM element.
      *
      * @param {Object} el - Option DOM element
      * @returns {Object}
      */
					value: function getOptionData(el) {
						return {
							key: el.getAttribute("data-key"),
							value: el.getAttribute("data-value")
						};
					}
				}, {
					key: "render",
					value: function render() {
						var _this = this;

						if (this.props.values.length === 0) {
							return null;
						}

						var values = this.props.sortRelevance && this.props.query !== "" ? this.sortRelevance(this.props.values, this.props.querySelector) : this.props.values;

						var listitems = values.map(function (data, index) {
							var displayValue = data.value;

							if (_this.props.query.length) {
								var re = new RegExp(_this.props.query, "ig");
								displayValue = data.value.replace(re, "<span class=\"highlight\">$&</span>");
							}

							var selectedValue = (0, _hireFormsUtils.castArray)(_this.props.value);

							return _react2["default"].createElement("li", {
								className: (0, _classnames2["default"])({
									"hire-forms-option": true,
									selected: selectedValue.indexOf(data.value) > -1
								}),
								dangerouslySetInnerHTML: { __html: displayValue },
								"data-key": data.key,
								"data-value": data.value,
								key: index,
								onClick: _this.handleClick.bind(_this) });
						});

						return _react2["default"].createElement("ul", {
							className: "hire-options" }, listitems);
					}
				}]);

				return Options;
			})(_react2["default"].Component);

			Options.defaultProps = {
				highlightClass: "highlight",
				query: "",
				sortRelevance: true,
				value: { key: "", value: "" },
				values: []
			};

			Options.propTypes = {
				highlightClass: _react2["default"].PropTypes.string,
				onChange: _react2["default"].PropTypes.func.isRequired,
				query: _react2["default"].PropTypes.string,
				sortRelevance: _react2["default"].PropTypes.bool,
				value: _hireFormsPropTypes.keyValueMapOrArrayOfKeyValueMaps,
				values: _hireFormsPropTypes.arrayOfKeyValueMaps
			};

			exports["default"] = Options;
			module.exports = exports["default"];
		}, { "classnames": "classnames", "hire-forms-prop-types": 1, "hire-forms-utils": 2, "react": "react" }] }, {}, [3])(3);
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"classnames":"classnames","hire-forms-prop-types":7,"hire-forms-utils":8,"react":"react"}],7:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var keyValueMap = _react2["default"].PropTypes.shape({
	key: _react2["default"].PropTypes.string.isRequired,
	value: _react2["default"].PropTypes.string.isRequired
});

exports.keyValueMap = keyValueMap;
// ARRAY OF

var arrayOfKeyValueMaps = _react2["default"].PropTypes.arrayOf(keyValueMap);

exports.arrayOfKeyValueMaps = arrayOfKeyValueMaps;
var arrayOfStrings = _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string);

exports.arrayOfStrings = arrayOfStrings;
var arrayOfElements = _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.element);

exports.arrayOfElements = arrayOfElements;
// OR

var stringOrArray = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.array]);

exports.stringOrArray = stringOrArray;
var stringOrKeyValueMap = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, keyValueMap]);

exports.stringOrKeyValueMap = stringOrKeyValueMap;
var stringOrArrayOfStrings = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, arrayOfStrings]);

exports.stringOrArrayOfStrings = stringOrArrayOfStrings;
var elementOrArrayOfElement = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.element, arrayOfElements]);

exports.elementOrArrayOfElement = elementOrArrayOfElement;
var arrayOfStringsOrArrayOfKeyValueMaps = _react2["default"].PropTypes.oneOfType([arrayOfStrings, arrayOfKeyValueMaps]);

exports.arrayOfStringsOrArrayOfKeyValueMaps = arrayOfStringsOrArrayOfKeyValueMaps;
var keyValueMapOrArrayOfKeyValueMaps = _react2["default"].PropTypes.oneOfType([keyValueMap, arrayOfKeyValueMaps]);
exports.keyValueMapOrArrayOfKeyValueMaps = keyValueMapOrArrayOfKeyValueMaps;

},{"react":"react"}],8:[function(_dereq_,module,exports){

/*
 * @param {Array} list
 * @returns {Boolean}
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.isListOfStrings = isListOfStrings;
exports.isKeyValueMap = isKeyValueMap;
exports.castArray = castArray;
exports.castKeyValueArray = castKeyValueArray;

function isListOfStrings(list) {
	if (!Array.isArray(list) || !list.length) {
		return false;
	}

	return list.every(function (item) {
		return typeof item === "string";
	});
}

/*
 * @param {Object} map
 * @returns {Boolean}
 */

function isKeyValueMap(map) {
	if (map == null) {
		return false;
	}

	return map.hasOwnProperty("key") && map.hasOwnProperty("value");
}

/*
 * Always return an array.
 *
 * @param {String|Array} arr
 * @returns {Array}
 */

function castArray(arr) {
	return Array.isArray(arr) ? arr : [arr];
}

;

/*
 * Always return an array of key/value maps.
 *
 * @param {Number|String|Boolean|Array} list
 * @returns {Array} Array of key value maps, ie: [{key: "A", value: "A"}, {key: "B", value: "B"}, ...]
 */

function castKeyValueArray(list) {
	list = castArray(list);

	return list.map(function (item) {
		return isKeyValueMap(item) ? item : {
			key: item,
			value: item
		};
	});
}

},{}],9:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { "default": obj };
}

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var keyValueMap = _react2["default"].PropTypes.shape({
	key: _react2["default"].PropTypes.string.isRequired,
	value: _react2["default"].PropTypes.string.isRequired
});

exports.keyValueMap = keyValueMap;
// ARRAY OF

var arrayOfKeyValueMaps = _react2["default"].PropTypes.arrayOf(keyValueMap);

exports.arrayOfKeyValueMaps = arrayOfKeyValueMaps;
var arrayOfStrings = _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string);

exports.arrayOfStrings = arrayOfStrings;
var arrayOfElements = _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.element);

exports.arrayOfElements = arrayOfElements;
// OR

var stringOrArray = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.array]);

exports.stringOrArray = stringOrArray;
var stringOrKeyValueMap = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, keyValueMap]);

exports.stringOrKeyValueMap = stringOrKeyValueMap;
var stringOrArrayOfStrings = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, arrayOfStrings]);

exports.stringOrArrayOfStrings = stringOrArrayOfStrings;
var elementOrArrayOfElement = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.element, arrayOfElements]);

exports.elementOrArrayOfElement = elementOrArrayOfElement;
var arrayOfStringsOrArrayOfKeyValueMaps = _react2["default"].PropTypes.oneOfType([arrayOfStrings, arrayOfKeyValueMaps]);

exports.arrayOfStringsOrArrayOfKeyValueMaps = arrayOfStringsOrArrayOfKeyValueMaps;
var keyValueMapOrArrayOfKeyValueMaps = _react2["default"].PropTypes.oneOfType([keyValueMap, arrayOfKeyValueMaps]);
exports.keyValueMapOrArrayOfKeyValueMaps = keyValueMapOrArrayOfKeyValueMaps;

},{"react":"react"}],10:[function(_dereq_,module,exports){
(function (global){
"use strict";

(function (f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = f();
	} else if (typeof define === "function" && define.amd) {
		define([], f);
	} else {
		var g;if (typeof window !== "undefined") {
			g = window;
		} else if (typeof global !== "undefined") {
			g = global;
		} else if (typeof self !== "undefined") {
			g = self;
		} else {
			g = this;
		}g.HireFormsSelect = f();
	}
})(function () {
	var define, module, exports;return (function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = typeof _dereq_ == "function" && _dereq_;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw (f.code = "MODULE_NOT_FOUND", f);
				}var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
					var n = t[o][1][e];return s(n ? n : e);
				}, l, l.exports, e, t, n, r);
			}return n[o].exports;
		}var i = typeof _dereq_ == "function" && _dereq_;for (var o = 0; o < r.length; o++) s(r[o]);return s;
	})({ 1: [function (_dereq_, module, exports) {
			(function (global) {
				(function (f) {
					if (typeof exports === "object" && typeof module !== "undefined") {
						module.exports = f();
					} else if (typeof define === "function" && define.amd) {
						define([], f);
					} else {
						var g;if (typeof window !== "undefined") {
							g = window;
						} else if (typeof global !== "undefined") {
							g = global;
						} else if (typeof self !== "undefined") {
							g = self;
						} else {
							g = this;
						}g.HireFormsOptions = f();
					}
				})(function () {
					var define, module, exports;return (function e(t, n, r) {
						function s(o, u) {
							if (!n[o]) {
								if (!t[o]) {
									var a = typeof _dereq_ == "function" && _dereq_;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw (f.code = "MODULE_NOT_FOUND", f);
								}var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
									var n = t[o][1][e];return s(n ? n : e);
								}, l, l.exports, e, t, n, r);
							}return n[o].exports;
						}var i = typeof _dereq_ == "function" && _dereq_;for (var o = 0; o < r.length; o++) s(r[o]);return s;
					})({ 1: [function (_dereq_, module, exports) {
							"use strict";

							Object.defineProperty(exports, "__esModule", {
								value: true
							});

							function _interopRequireDefault(obj) {
								return obj && obj.__esModule ? obj : { "default": obj };
							}

							var _react = _dereq_("react");

							var _react2 = _interopRequireDefault(_react);

							var keyValueMap = _react2["default"].PropTypes.shape({
								key: _react2["default"].PropTypes.string.isRequired,
								value: _react2["default"].PropTypes.string.isRequired
							});

							exports.keyValueMap = keyValueMap;
							// ARRAY OF

							var arrayOfKeyValueMaps = _react2["default"].PropTypes.arrayOf(keyValueMap);

							exports.arrayOfKeyValueMaps = arrayOfKeyValueMaps;
							var arrayOfStrings = _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string);

							exports.arrayOfStrings = arrayOfStrings;
							var arrayOfElements = _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.element);

							exports.arrayOfElements = arrayOfElements;
							// OR

							var stringOrArray = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.array]);

							exports.stringOrArray = stringOrArray;
							var stringOrKeyValueMap = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, keyValueMap]);

							exports.stringOrKeyValueMap = stringOrKeyValueMap;
							var stringOrArrayOfStrings = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, arrayOfStrings]);

							exports.stringOrArrayOfStrings = stringOrArrayOfStrings;
							var elementOrArrayOfElement = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.element, arrayOfElements]);

							exports.elementOrArrayOfElement = elementOrArrayOfElement;
							var arrayOfStringsOrArrayOfKeyValueMaps = _react2["default"].PropTypes.oneOfType([arrayOfStrings, arrayOfKeyValueMaps]);

							exports.arrayOfStringsOrArrayOfKeyValueMaps = arrayOfStringsOrArrayOfKeyValueMaps;
							var keyValueMapOrArrayOfKeyValueMaps = _react2["default"].PropTypes.oneOfType([keyValueMap, arrayOfKeyValueMaps]);
							exports.keyValueMapOrArrayOfKeyValueMaps = keyValueMapOrArrayOfKeyValueMaps;
						}, { "react": "react" }], 2: [function (_dereq_, module, exports) {

							/*
        * @param {Array} list
        * @returns {Boolean}
        */
							"use strict";

							Object.defineProperty(exports, "__esModule", {
								value: true
							});
							exports.isListOfStrings = isListOfStrings;
							exports.isKeyValueMap = isKeyValueMap;
							exports.castArray = castArray;
							exports.castKeyValueArray = castKeyValueArray;

							function isListOfStrings(list) {
								if (!Array.isArray(list) || !list.length) {
									return false;
								}

								return list.every(function (item) {
									return typeof item === "string";
								});
							}

							/*
        * @param {Object} map
        * @returns {Boolean}
        */

							function isKeyValueMap(map) {
								if (map == null) {
									return false;
								}

								return map.hasOwnProperty("key") && map.hasOwnProperty("value");
							}

							/*
        * Always return an array.
        *
        * @param {String|Array} arr
        * @returns {Array}
        */

							function castArray(arr) {
								return Array.isArray(arr) ? arr : [arr];
							}

							;

							/*
        * Always return an array of key/value maps.
        *
        * @param {Number|String|Boolean|Array} list
        * @returns {Array} Array of key value maps, ie: [{key: "A", value: "A"}, {key: "B", value: "B"}, ...]
        */

							function castKeyValueArray(list) {
								list = castArray(list);

								return list.map(function (item) {
									return isKeyValueMap(item) ? item : {
										key: item,
										value: item
									};
								});
							}
						}, {}], 3: [function (_dereq_, module, exports) {
							// TODO move listitem to seperate component (so we don't have to store data-key and data-value as attributes)
							// Move util functions to seperate module

							"use strict";

							Object.defineProperty(exports, "__esModule", {
								value: true
							});

							var _createClass = (function () {
								function defineProperties(target, props) {
									for (var i = 0; i < props.length; i++) {
										var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
									}
								}return function (Constructor, protoProps, staticProps) {
									if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
								};
							})();

							function _interopRequireDefault(obj) {
								return obj && obj.__esModule ? obj : { "default": obj };
							}

							function _classCallCheck(instance, Constructor) {
								if (!(instance instanceof Constructor)) {
									throw new TypeError("Cannot call a class as a function");
								}
							}

							function _inherits(subClass, superClass) {
								if (typeof superClass !== "function" && superClass !== null) {
									throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
								}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
							}

							var _react = _dereq_("react");

							var _react2 = _interopRequireDefault(_react);

							var _classnames = _dereq_("classnames");

							var _classnames2 = _interopRequireDefault(_classnames);

							var _hireFormsPropTypes = _dereq_("hire-forms-prop-types");

							var _hireFormsUtils = _dereq_("hire-forms-utils");

							/**
        * Options are rendered beneath the autocomplete and select components.
        *
        * @class
        * @extends React.Component
        */

							var Options = (function (_React$Component) {
								function Options() {
									_classCallCheck(this, Options);

									if (_React$Component != null) {
										_React$Component.apply(this, arguments);
									}
								}

								_inherits(Options, _React$Component);

								_createClass(Options, [{
									key: "componentDidMount",
									value: function componentDidMount() {
										var node = _react2["default"].findDOMNode(this);

										if (node) {
											node.style.zIndex = 1000;
										}
									}
								}, {
									key: "componentWillUnmount",
									value: function componentWillUnmount() {
										var node = _react2["default"].findDOMNode(this);
										node.style.zIndex = 0;
									}
								}, {
									key: "sortRelevance",

									/**
          * Sort values on relevance. A result is more relevant when the search
          * query is more at the beginning of the string. In other words:
          * String.indexOf(props.query): lower is better.
          * @param {Array<Object>} value An array of key/value maps
          * @param {String} query A search query
          * @returns {Array<Object>} Sorted values on relevance
          */
									value: function sortRelevance(values, query) {
										return values.sort(function (a, b) {
											a = a.value.toLowerCase();
											b = b.value.toLowerCase();

											var indexA = a.indexOf(query);
											var indexB = b.indexOf(query);

											if (indexA > indexB) {
												return 1;
											}

											if (indexA < indexB) {
												return -1;
											}

											if (indexA === indexB) {
												if (a > b) {
													return 1;
												}

												if (a < b) {
													return -1;
												}
											}

											return 0;
										});
									}
								}, {
									key: "highlight",

									/*
          * highlight the currently highlighted option.
          *
          * @param {Object} target An HTMLElement or event object
          * @param {String} className Name of the highlight class
          */
									value: function highlight(target, className) {
										// Check if target is an event object.
										if (target.hasOwnProperty("currentTarget")) {
											target = target.currentTarget;
										}

										target.classList.add(className);
									}
								}, {
									key: "unhighlight",

									/**
          * Unhighlight the currently highlighted option.
          *
          * @param {String} className Name of the highlight class
          * @return {Object} The unhighlighted HTMLElement
          */
									value: function unhighlight(className) {
										var el = undefined;
										var node = _react2["default"].findDOMNode(this);

										if (node) {
											el = node.querySelector("li." + className);

											if (el) {
												el.classList.remove(className);
											}
										}

										return el;
									}
								}, {
									key: "handleClick",
									value: function handleClick(ev) {
										this.props.onChange(this.getOptionData(ev.currentTarget));
									}
								}, {
									key: "highlightPrev",
									value: function highlightPrev() {
										var prev = undefined;
										var current = this.unhighlight(this.props.highlightClass);

										if (current) {
											prev = current.previousElementSibling;
										}

										// If current and prev aren't found, start at the top.
										// Current is not found if there is no list item highlighted.
										// Prev is not found if the first list item is highlighted.
										if (!prev) {
											prev = _react2["default"].findDOMNode(this).lastChild;
										}

										this.highlight(prev, this.props.highlightClass);
									}
								}, {
									key: "highlightNext",
									value: function highlightNext() {
										var next = undefined;
										var current = this.unhighlight(this.props.highlightClass);

										if (current) {
											next = current.nextElementSibling;
										}

										// If current and next aren't found, start at the top.
										// Current is not found if there is no list item highlighted.
										// Next is not found if the last list item is highlighted.
										if (!next) {
											next = _react2["default"].findDOMNode(this).firstChild;
										}

										this.highlight(next, this.props.highlightClass);
									}
								}, {
									key: "select",
									value: function select() {
										var current = this.unhighlight(this.props.highlightClass);

										if (current) {
											this.props.onChange(this.getOptionData(current));
										}
									}
								}, {
									key: "getOptionData",

									/**
          * Get the key (id) and value (display name) of an option DOM element.
          *
          * @param {Object} el - Option DOM element
          * @returns {Object}
          */
									value: function getOptionData(el) {
										return {
											key: el.getAttribute("data-key"),
											value: el.getAttribute("data-value")
										};
									}
								}, {
									key: "render",
									value: function render() {
										var _this = this;

										if (this.props.values.length === 0) {
											return null;
										}

										var values = this.props.sortRelevance && this.props.query !== "" ? this.sortRelevance(this.props.values, this.props.querySelector) : this.props.values;

										var listitems = values.map(function (data, index) {
											var displayValue = data.value;

											if (_this.props.query.length) {
												var re = new RegExp(_this.props.query, "ig");
												displayValue = data.value.replace(re, "<span class=\"highlight\">$&</span>");
											}

											var selectedValue = (0, _hireFormsUtils.castArray)(_this.props.value);

											return _react2["default"].createElement("li", {
												className: (0, _classnames2["default"])({
													"hire-forms-option": true,
													selected: selectedValue.indexOf(data.value) > -1
												}),
												dangerouslySetInnerHTML: { __html: displayValue },
												"data-key": data.key,
												"data-value": data.value,
												key: index,
												onClick: _this.handleClick.bind(_this) });
										});

										return _react2["default"].createElement("ul", {
											className: "hire-options" }, listitems);
									}
								}]);

								return Options;
							})(_react2["default"].Component);

							Options.defaultProps = {
								highlightClass: "highlight",
								query: "",
								sortRelevance: true,
								value: { key: "", value: "" },
								values: []
							};

							Options.propTypes = {
								highlightClass: _react2["default"].PropTypes.string,
								onChange: _react2["default"].PropTypes.func.isRequired,
								query: _react2["default"].PropTypes.string,
								sortRelevance: _react2["default"].PropTypes.bool,
								value: _hireFormsPropTypes.keyValueMapOrArrayOfKeyValueMaps,
								values: _hireFormsPropTypes.arrayOfKeyValueMaps
							};

							exports["default"] = Options;
							module.exports = exports["default"];
						}, { "classnames": "classnames", "hire-forms-prop-types": 1, "hire-forms-utils": 2, "react": "react" }] }, {}, [3])(3);
				});
			}).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
		}, { "classnames": "classnames", "hire-forms-prop-types": 2, "hire-forms-utils": 3, "react": "react" }], 2: [function (_dereq_, module, exports) {
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { "default": obj };
			}

			var _react = _dereq_("react");

			var _react2 = _interopRequireDefault(_react);

			var keyValueMap = _react2["default"].PropTypes.shape({
				key: _react2["default"].PropTypes.string.isRequired,
				value: _react2["default"].PropTypes.string.isRequired
			});

			exports.keyValueMap = keyValueMap;
			// ARRAY OF

			var arrayOfKeyValueMaps = _react2["default"].PropTypes.arrayOf(keyValueMap);

			exports.arrayOfKeyValueMaps = arrayOfKeyValueMaps;
			var arrayOfStrings = _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string);

			exports.arrayOfStrings = arrayOfStrings;
			var arrayOfElements = _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.element);

			exports.arrayOfElements = arrayOfElements;
			// OR

			var stringOrArray = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.array]);

			exports.stringOrArray = stringOrArray;
			var stringOrKeyValueMap = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, keyValueMap]);

			exports.stringOrKeyValueMap = stringOrKeyValueMap;
			var stringOrArrayOfStrings = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, arrayOfStrings]);

			exports.stringOrArrayOfStrings = stringOrArrayOfStrings;
			var elementOrArrayOfElement = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.element, arrayOfElements]);

			exports.elementOrArrayOfElement = elementOrArrayOfElement;
			var arrayOfStringsOrArrayOfKeyValueMaps = _react2["default"].PropTypes.oneOfType([arrayOfStrings, arrayOfKeyValueMaps]);

			exports.arrayOfStringsOrArrayOfKeyValueMaps = arrayOfStringsOrArrayOfKeyValueMaps;
			var keyValueMapOrArrayOfKeyValueMaps = _react2["default"].PropTypes.oneOfType([keyValueMap, arrayOfKeyValueMaps]);
			exports.keyValueMapOrArrayOfKeyValueMaps = keyValueMapOrArrayOfKeyValueMaps;
		}, { "react": "react" }], 3: [function (_dereq_, module, exports) {

			/*
    * @param {Array} list
    * @returns {Boolean}
    */
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});
			exports.isListOfStrings = isListOfStrings;
			exports.isKeyValueMap = isKeyValueMap;
			exports.castArray = castArray;
			exports.castKeyValueArray = castKeyValueArray;

			function isListOfStrings(list) {
				if (!Array.isArray(list) || !list.length) {
					return false;
				}

				return list.every(function (item) {
					return typeof item === "string";
				});
			}

			/*
    * @param {Object} map
    * @returns {Boolean}
    */

			function isKeyValueMap(map) {
				if (map == null) {
					return false;
				}

				return map.hasOwnProperty("key") && map.hasOwnProperty("value");
			}

			/*
    * Always return an array.
    *
    * @param {String|Array} arr
    * @returns {Array}
    */

			function castArray(arr) {
				return Array.isArray(arr) ? arr : [arr];
			}

			;

			/*
    * Always return an array of key/value maps.
    *
    * @param {Number|String|Boolean|Array} list
    * @returns {Array} Array of key value maps, ie: [{key: "A", value: "A"}, {key: "B", value: "B"}, ...]
    */

			function castKeyValueArray(list) {
				list = castArray(list);

				return list.map(function (item) {
					return isKeyValueMap(item) ? item : {
						key: item,
						value: item
					};
				});
			}
		}, {}], 4: [function (_dereq_, module, exports) {
			arguments[4][2][0].apply(exports, arguments);
		}, { "dup": 2, "react": "react" }], 5: [function (_dereq_, module, exports) {
			arguments[4][3][0].apply(exports, arguments);
		}, { "dup": 3 }], 6: [function (_dereq_, module, exports) {
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});

			var _createClass = (function () {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
					}
				}return function (Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
				};
			})();

			var _get = function get(_x, _x2, _x3) {
				var _again = true;_function: while (_again) {
					var object = _x,
					    property = _x2,
					    receiver = _x3;desc = parent = getter = undefined;_again = false;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
						var parent = Object.getPrototypeOf(object);if (parent === null) {
							return undefined;
						} else {
							_x = parent;_x2 = property;_x3 = receiver;_again = true;continue _function;
						}
					} else if ("value" in desc) {
						return desc.value;
					} else {
						var getter = desc.get;if (getter === undefined) {
							return undefined;
						}return getter.call(receiver);
					}
				}
			};

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { "default": obj };
			}

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== "function" && superClass !== null) {
					throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
				}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
			}

			var _react = _dereq_("react");

			var _react2 = _interopRequireDefault(_react);

			var _classnames = _dereq_("classnames");

			var _classnames2 = _interopRequireDefault(_classnames);

			var _hireFormsOptions = _dereq_("hire-forms-options");

			var _hireFormsOptions2 = _interopRequireDefault(_hireFormsOptions);

			var _hireFormsPropTypes = _dereq_("hire-forms-prop-types");

			var _hireFormsUtils = _dereq_("hire-forms-utils");

			var Select = (function (_React$Component) {
				function Select(props) {
					_classCallCheck(this, Select);

					_get(Object.getPrototypeOf(Select.prototype), "constructor", this).call(this, props);

					this.state = {
						options: props.options,
						visible: false
					};
				}

				_inherits(Select, _React$Component);

				_createClass(Select, [{
					key: "componentDidMount",
					value: function componentDidMount() {
						var _this = this;

						if (this.props.async != null) {
							this.props.async(function (response) {
								_this.setState({
									options: response
								});
							});
						}
					}
				}, {
					key: "handleInputClick",
					value: function handleInputClick() {
						// Visible state shouldn't change when there are no options.
						if (this.state.options.length > 0) {
							this.setState({ visible: !this.state.visible });
						}
					}
				}, {
					key: "handleOptionsChange",

					/**
      * @method
      * @param {object} value Map of key and value: {key: "somekey", value: "somevalue"}
      */
					value: function handleOptionsChange(value) {
						this.setState({ visible: false });

						// If the options prop is an array of strings, return a string.
						if ((0, _hireFormsUtils.isListOfStrings)(this.state.options)) {
							value = value.value;
						}

						this.props.onChange(value);
					}
				}, {
					key: "render",
					value: function render() {
						var optionValues = undefined,
						    options = undefined;

						if (this.state.visible) {
							options = _react2["default"].createElement(_hireFormsOptions2["default"], {
								onChange: this.handleOptionsChange.bind(this),
								sortRelevance: this.props.sortRelevance,
								values: (0, _hireFormsUtils.castKeyValueArray)(this.state.options) });
						}

						// If value prop is a key/value map, extract the value.
						var value = (0, _hireFormsUtils.isKeyValueMap)(this.props.value) ? this.props.value.value : this.props.value;

						// Create new var so we can check value in cx()
						var inputValue = value === "" ? this.props.placeholder : value;

						return _react2["default"].createElement("div", { className: "hire-select" }, _react2["default"].createElement("div", {
							className: "input-container",
							onClick: this.handleInputClick.bind(this) }, _react2["default"].createElement("div", { className: (0, _classnames2["default"])({
								"input": true,
								"placeholder": value === "" }) }, inputValue), _react2["default"].createElement("button", null, "▾")), options);
					}
				}]);

				return Select;
			})(_react2["default"].Component);

			Select.defaultProps = {
				options: [],
				value: ""
			};

			Select.propTypes = {
				async: _react2["default"].PropTypes.func,
				onChange: _react2["default"].PropTypes.func.isRequired,
				options: _hireFormsPropTypes.arrayOfStringsOrArrayOfKeyValueMaps,
				placeholder: _react2["default"].PropTypes.string,
				sortRelevance: _react2["default"].PropTypes.bool,
				value: _hireFormsPropTypes.stringOrKeyValueMap
			};

			exports["default"] = Select;
			module.exports = exports["default"];
		}, { "classnames": "classnames", "hire-forms-options": 1, "hire-forms-prop-types": 4, "hire-forms-utils": 5, "react": "react" }] }, {}, [6])(6);
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"classnames":"classnames","hire-forms-options":6,"hire-forms-prop-types":9,"hire-forms-utils":12,"react":"react"}],11:[function(_dereq_,module,exports){
(function (global){
"use strict";

(function (f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = f();
	} else if (typeof define === "function" && define.amd) {
		define([], f);
	} else {
		var g;if (typeof window !== "undefined") {
			g = window;
		} else if (typeof global !== "undefined") {
			g = global;
		} else if (typeof self !== "undefined") {
			g = self;
		} else {
			g = this;
		}g.HireFormsTextarea = f();
	}
})(function () {
	var define, module, exports;return (function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = typeof _dereq_ == "function" && _dereq_;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw (f.code = "MODULE_NOT_FOUND", f);
				}var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
					var n = t[o][1][e];return s(n ? n : e);
				}, l, l.exports, e, t, n, r);
			}return n[o].exports;
		}var i = typeof _dereq_ == "function" && _dereq_;for (var o = 0; o < r.length; o++) s(r[o]);return s;
	})({ 1: [function (_dereq_, module, exports) {
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});

			var _createClass = (function () {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
					}
				}return function (Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
				};
			})();

			var _get = function get(_x, _x2, _x3) {
				var _again = true;_function: while (_again) {
					var object = _x,
					    property = _x2,
					    receiver = _x3;desc = parent = getter = undefined;_again = false;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
						var parent = Object.getPrototypeOf(object);if (parent === null) {
							return undefined;
						} else {
							_x = parent;_x2 = property;_x3 = receiver;_again = true;continue _function;
						}
					} else if ("value" in desc) {
						return desc.value;
					} else {
						var getter = desc.get;if (getter === undefined) {
							return undefined;
						}return getter.call(receiver);
					}
				}
			};

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { "default": obj };
			}

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== "function" && superClass !== null) {
					throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
				}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
			}

			var _react = _dereq_("react");

			var _react2 = _interopRequireDefault(_react);

			var _classnames = _dereq_("classnames");

			var _classnames2 = _interopRequireDefault(_classnames);

			var Textarea = (function (_React$Component) {
				function Textarea(props) {
					_classCallCheck(this, Textarea);

					_get(Object.getPrototypeOf(Textarea.prototype), "constructor", this).call(this, props);

					this.state = { focus: false };
				}

				_inherits(Textarea, _React$Component);

				_createClass(Textarea, [{
					key: "componentDidMount",
					value: function componentDidMount() {
						this.adjustHeight(_react2["default"].findDOMNode(this));
					}
				}, {
					key: "shouldComponentUpdate",
					value: function shouldComponentUpdate(nextProps, nextState) {
						var propsValueChange = this.props.value !== nextProps.value;
						var stateFocusChange = this.state.focus !== nextState.focus;

						return propsValueChange || stateFocusChange;
					}
				}, {
					key: "componentDidUpdate",
					value: function componentDidUpdate(prevProps) {
						if (this.props.value !== prevProps.value) {
							this.adjustHeight();
						}
					}
				}, {
					key: "adjustHeight",
					value: function adjustHeight() {
						var textarea = _react2["default"].findDOMNode(this);

						textarea.style.height = "auto";
						textarea.style.height = textarea.scrollHeight + 6 > 32 ? textarea.scrollHeight + 6 + "px" : "32px";
					}
				}, {
					key: "toggleFocus",
					value: function toggleFocus() {
						this.setState({ focus: !this.state.focus });
					}
				}, {
					key: "handleKeyDown",
					value: function handleKeyDown(ev) {
						if (this.props.onKeyDown) {
							this.props.onKeyDown(ev);
						}
					}
				}, {
					key: "handleKeyUp",
					value: function handleKeyUp(ev) {
						if (this.props.onKeyUp) {
							this.props.onKeyUp(ev);
						}
					}
				}, {
					key: "handleChange",
					value: function handleChange(ev) {
						this.props.onChange(ev.currentTarget.value, ev);
					}
				}, {
					key: "render",
					value: function render() {
						return _react2["default"].createElement("textarea", {
							className: (0, _classnames2["default"])("hire-textarea", { focus: this.state.focus }),
							onBlur: this.toggleFocus.bind(this),
							onChange: this.handleChange.bind(this),
							onFocus: this.toggleFocus.bind(this),
							onKeyDown: this.handleKeyDown.bind(this),
							onKeyUp: this.handleKeyUp.bind(this),
							placeholder: this.props.placeholder,
							style: this.props.style,
							value: this.props.value });
					}
				}]);

				return Textarea;
			})(_react2["default"].Component);

			Textarea.defaultProps = {
				autoResize: true,
				value: ""
			};

			Textarea.propTypes = {
				autoResize: _react2["default"].PropTypes.bool,
				onChange: _react2["default"].PropTypes.func,
				onKeyDown: _react2["default"].PropTypes.func,
				onKeyUp: _react2["default"].PropTypes.func,
				placeholder: _react2["default"].PropTypes.string,
				style: _react2["default"].PropTypes.object,
				value: _react2["default"].PropTypes.string
			};

			exports["default"] = Textarea;
			module.exports = exports["default"];
		}, { "classnames": "classnames", "react": "react" }] }, {}, [1])(1);
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"classnames":"classnames","react":"react"}],12:[function(_dereq_,module,exports){

/*
 * @param {Array} list
 * @returns {Boolean}
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.isListOfStrings = isListOfStrings;
exports.isKeyValueMap = isKeyValueMap;
exports.castArray = castArray;
exports.castKeyValueArray = castKeyValueArray;

function isListOfStrings(list) {
	if (!Array.isArray(list) || !list.length) {
		return false;
	}

	return list.every(function (item) {
		return typeof item === "string";
	});
}

/*
 * @param {Object} map
 * @returns {Boolean}
 */

function isKeyValueMap(map) {
	if (map == null) {
		return false;
	}

	return map.hasOwnProperty("key") && map.hasOwnProperty("value");
}

/*
 * Always return an array.
 *
 * @param {String|Array} arr
 * @returns {Array}
 */

function castArray(arr) {
	return Array.isArray(arr) ? arr : [arr];
}

;

/*
 * Always return an array of key/value maps.
 *
 * @param {Number|String|Boolean|Array} list
 * @returns {Array} Array of key value maps, ie: [{key: "A", value: "A"}, {key: "B", value: "B"}, ...]
 */

function castKeyValueArray(list) {
	list = castArray(list);

	return list.map(function (item) {
		return isKeyValueMap(item) ? item : {
			key: item,
			value: item
		};
	});
}

},{}],13:[function(_dereq_,module,exports){
(function (global){
"use strict";

(function (f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = f();
	} else if (typeof define === "function" && define.amd) {
		define([], f);
	} else {
		var g;if (typeof window !== "undefined") {
			g = window;
		} else if (typeof global !== "undefined") {
			g = global;
		} else if (typeof self !== "undefined") {
			g = self;
		} else {
			g = this;
		}g.HireTabs = f();
	}
})(function () {
	var define, module, exports;return (function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = typeof _dereq_ == "function" && _dereq_;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw (f.code = "MODULE_NOT_FOUND", f);
				}var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
					var n = t[o][1][e];return s(n ? n : e);
				}, l, l.exports, e, t, n, r);
			}return n[o].exports;
		}var i = typeof _dereq_ == "function" && _dereq_;for (var o = 0; o < r.length; o++) s(r[o]);return s;
	})({ 1: [function (_dereq_, module, exports) {
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { "default": obj };
			}

			var _react = _dereq_("react");

			var _react2 = _interopRequireDefault(_react);

			var elementOrArrayOfElement = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.element, _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.element)]);

			exports.elementOrArrayOfElement = elementOrArrayOfElement;
			/**
    * A string or an object,
    * example: {key: "somekey", value: "somevalue"}.
    */
			var stringOrKeyValue = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.shape({
				key: _react2["default"].PropTypes.string,
				value: _react2["default"].PropTypes.string
			})]);

			exports.stringOrKeyValue = stringOrKeyValue;
			var stringOrArray = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.array]);

			exports.stringOrArray = stringOrArray;
			var stringOrArrayOfString = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string)]);

			exports.stringOrArrayOfString = stringOrArrayOfString;
			var arrayOfKeyValue = _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.shape({
				key: _react2["default"].PropTypes.string.isRequired,
				value: _react2["default"].PropTypes.string.isRequired
			}));

			exports.arrayOfKeyValue = arrayOfKeyValue;
			/**
    * An array of strings or an array of key/value objects,
    * example: [{key: "somekey", value: "somevalue"}].
    */
			var arrayOfStringOrArrayOfKeyValue = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string), _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.shape({
				key: _react2["default"].PropTypes.string,
				value: _react2["default"].PropTypes.string
			}))]);
			exports.arrayOfStringOrArrayOfKeyValue = arrayOfStringOrArrayOfKeyValue;
		}, { "react": "react" }], 2: [function (_dereq_, module, exports) {
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { "default": obj };
			}

			var _tabs = _dereq_("./tabs");

			var _tabs2 = _interopRequireDefault(_tabs);

			var _tab = _dereq_("./tab");

			var _tab2 = _interopRequireDefault(_tab);

			exports.Tabs = _tabs2["default"];
			exports.Tab = _tab2["default"];
		}, { "./tab": 3, "./tabs": 4 }], 3: [function (_dereq_, module, exports) {
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});

			var _createClass = (function () {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
					}
				}return function (Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
				};
			})();

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { "default": obj };
			}

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== "function" && superClass !== null) {
					throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
				}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
			}

			var _react = _dereq_("react");

			var _react2 = _interopRequireDefault(_react);

			var _hireFormsPropTypes = _dereq_("hire-forms-prop-types");

			var Tab = (function (_React$Component) {
				function Tab() {
					_classCallCheck(this, Tab);

					if (_React$Component != null) {
						_React$Component.apply(this, arguments);
					}
				}

				_inherits(Tab, _React$Component);

				_createClass(Tab, [{
					key: "render",
					value: function render() {
						if (this.props.active) {
							return _react2["default"].createElement("div", { className: "hire-tab" }, this.props.children);
						}

						return null;
					}
				}]);

				return Tab;
			})(_react2["default"].Component);

			Tab.defaultProps = {
				active: false
			};

			Tab.propTypes = {
				active: _react2["default"].PropTypes.bool,
				children: _hireFormsPropTypes.elementOrArrayOfElement
			};

			exports["default"] = Tab;
			module.exports = exports["default"];
		}, { "hire-forms-prop-types": 1, "react": "react" }], 4: [function (_dereq_, module, exports) {
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});

			var _createClass = (function () {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
					}
				}return function (Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
				};
			})();

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { "default": obj };
			}

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== "function" && superClass !== null) {
					throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
				}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
			}

			var _react = _dereq_("react");

			var _react2 = _interopRequireDefault(_react);

			var _classnames = _dereq_("classnames");

			var _classnames2 = _interopRequireDefault(_classnames);

			var _hireFormsPropTypes = _dereq_("hire-forms-prop-types");

			var _hireFormsUtils = _dereq_("hire-forms-utils");

			var Tabs = (function (_React$Component) {
				function Tabs() {
					_classCallCheck(this, Tabs);

					if (_React$Component != null) {
						_React$Component.apply(this, arguments);
					}
				}

				_inherits(Tabs, _React$Component);

				_createClass(Tabs, [{
					key: "handleClick",
					value: function handleClick(index) {
						if (this.props.onChange) {
							var tabLabel = this.props.children[index].props.label;
							this.props.onChange(tabLabel, index);
						}
					}
				}, {
					key: "render",
					value: function render() {
						var _this = this;

						var children = (0, _hireFormsUtils.castArray)(this.props.children);

						var labels = children.map(function (tab, index) {
							return _react2["default"].createElement("li", {
								className: (0, _classnames2["default"])({ active: tab.props.active }),
								key: index,
								onClick: _this.handleClick.bind(_this, index) }, _react2["default"].createElement("span", { className: "label" }, tab.props.label));
						});

						return _react2["default"].createElement("div", { className: "hire-tabs" }, _react2["default"].createElement("ul", null, labels), children);
					}
				}]);

				return Tabs;
			})(_react2["default"].Component);

			Tabs.propTypes = {
				children: _hireFormsPropTypes.elementOrArrayOfElement,
				onChange: _react2["default"].PropTypes.func
			};

			exports["default"] = Tabs;
			module.exports = exports["default"];
		}, { "classnames": "classnames", "hire-forms-prop-types": 1, "hire-forms-utils": 5, "react": "react" }], 5: [function (_dereq_, module, exports) {
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});
			var castArray = function castArray(array) {
				return Array.isArray(array) ? array : [array];
			};
			exports.castArray = castArray;
		}, {}] }, {}, [2])(2);
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],14:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

module.exports.Dispatcher = _dereq_('./lib/Dispatcher')

},{"./lib/Dispatcher":15}],15:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Dispatcher
 * @typechecks
 */

"use strict";

var invariant = _dereq_('./invariant');

var _lastID = 1;
var _prefix = 'ID_';

/**
 * Dispatcher is used to broadcast payloads to registered callbacks. This is
 * different from generic pub-sub systems in two ways:
 *
 *   1) Callbacks are not subscribed to particular events. Every payload is
 *      dispatched to every registered callback.
 *   2) Callbacks can be deferred in whole or part until other callbacks have
 *      been executed.
 *
 * For example, consider this hypothetical flight destination form, which
 * selects a default city when a country is selected:
 *
 *   var flightDispatcher = new Dispatcher();
 *
 *   // Keeps track of which country is selected
 *   var CountryStore = {country: null};
 *
 *   // Keeps track of which city is selected
 *   var CityStore = {city: null};
 *
 *   // Keeps track of the base flight price of the selected city
 *   var FlightPriceStore = {price: null}
 *
 * When a user changes the selected city, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'city-update',
 *     selectedCity: 'paris'
 *   });
 *
 * This payload is digested by `CityStore`:
 *
 *   flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'city-update') {
 *       CityStore.city = payload.selectedCity;
 *     }
 *   });
 *
 * When the user selects a country, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'country-update',
 *     selectedCountry: 'australia'
 *   });
 *
 * This payload is digested by both stores:
 *
 *    CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       CountryStore.country = payload.selectedCountry;
 *     }
 *   });
 *
 * When the callback to update `CountryStore` is registered, we save a reference
 * to the returned token. Using this token with `waitFor()`, we can guarantee
 * that `CountryStore` is updated before the callback that updates `CityStore`
 * needs to query its data.
 *
 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       // `CountryStore.country` may not be updated.
 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
 *       // `CountryStore.country` is now guaranteed to be updated.
 *
 *       // Select the default city for the new country
 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
 *     }
 *   });
 *
 * The usage of `waitFor()` can be chained, for example:
 *
 *   FlightPriceStore.dispatchToken =
 *     flightDispatcher.register(function(payload) {
 *       switch (payload.actionType) {
 *         case 'country-update':
 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
 *           FlightPriceStore.price =
 *             getFlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *
 *         case 'city-update':
 *           FlightPriceStore.price =
 *             FlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *     }
 *   });
 *
 * The `country-update` payload will be guaranteed to invoke the stores'
 * registered callbacks in order: `CountryStore`, `CityStore`, then
 * `FlightPriceStore`.
 */

  function Dispatcher() {
    this.$Dispatcher_callbacks = {};
    this.$Dispatcher_isPending = {};
    this.$Dispatcher_isHandled = {};
    this.$Dispatcher_isDispatching = false;
    this.$Dispatcher_pendingPayload = null;
  }

  /**
   * Registers a callback to be invoked with every dispatched payload. Returns
   * a token that can be used with `waitFor()`.
   *
   * @param {function} callback
   * @return {string}
   */
  Dispatcher.prototype.register=function(callback) {
    var id = _prefix + _lastID++;
    this.$Dispatcher_callbacks[id] = callback;
    return id;
  };

  /**
   * Removes a callback based on its token.
   *
   * @param {string} id
   */
  Dispatcher.prototype.unregister=function(id) {
    invariant(
      this.$Dispatcher_callbacks[id],
      'Dispatcher.unregister(...): `%s` does not map to a registered callback.',
      id
    );
    delete this.$Dispatcher_callbacks[id];
  };

  /**
   * Waits for the callbacks specified to be invoked before continuing execution
   * of the current callback. This method should only be used by a callback in
   * response to a dispatched payload.
   *
   * @param {array<string>} ids
   */
  Dispatcher.prototype.waitFor=function(ids) {
    invariant(
      this.$Dispatcher_isDispatching,
      'Dispatcher.waitFor(...): Must be invoked while dispatching.'
    );
    for (var ii = 0; ii < ids.length; ii++) {
      var id = ids[ii];
      if (this.$Dispatcher_isPending[id]) {
        invariant(
          this.$Dispatcher_isHandled[id],
          'Dispatcher.waitFor(...): Circular dependency detected while ' +
          'waiting for `%s`.',
          id
        );
        continue;
      }
      invariant(
        this.$Dispatcher_callbacks[id],
        'Dispatcher.waitFor(...): `%s` does not map to a registered callback.',
        id
      );
      this.$Dispatcher_invokeCallback(id);
    }
  };

  /**
   * Dispatches a payload to all registered callbacks.
   *
   * @param {object} payload
   */
  Dispatcher.prototype.dispatch=function(payload) {
    invariant(
      !this.$Dispatcher_isDispatching,
      'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.'
    );
    this.$Dispatcher_startDispatching(payload);
    try {
      for (var id in this.$Dispatcher_callbacks) {
        if (this.$Dispatcher_isPending[id]) {
          continue;
        }
        this.$Dispatcher_invokeCallback(id);
      }
    } finally {
      this.$Dispatcher_stopDispatching();
    }
  };

  /**
   * Is this Dispatcher currently dispatching.
   *
   * @return {boolean}
   */
  Dispatcher.prototype.isDispatching=function() {
    return this.$Dispatcher_isDispatching;
  };

  /**
   * Call the callback stored with the given id. Also do some internal
   * bookkeeping.
   *
   * @param {string} id
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_invokeCallback=function(id) {
    this.$Dispatcher_isPending[id] = true;
    this.$Dispatcher_callbacks[id](this.$Dispatcher_pendingPayload);
    this.$Dispatcher_isHandled[id] = true;
  };

  /**
   * Set up bookkeeping needed when dispatching.
   *
   * @param {object} payload
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_startDispatching=function(payload) {
    for (var id in this.$Dispatcher_callbacks) {
      this.$Dispatcher_isPending[id] = false;
      this.$Dispatcher_isHandled[id] = false;
    }
    this.$Dispatcher_pendingPayload = payload;
    this.$Dispatcher_isDispatching = true;
  };

  /**
   * Clear bookkeeping used for dispatching.
   *
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_stopDispatching=function() {
    this.$Dispatcher_pendingPayload = null;
    this.$Dispatcher_isDispatching = false;
  };


module.exports = Dispatcher;

},{"./invariant":16}],16:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (false) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

},{}],17:[function(_dereq_,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.HireFormsSelect = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.HireFormsOptions = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var elementOrArrayOfElement = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.element, _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.element)]);

exports.elementOrArrayOfElement = elementOrArrayOfElement;
/**
 * A string or an object,
 * example: {key: "somekey", value: "somevalue"}.
 */
var stringOrKeyValue = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.shape({
	key: _react2["default"].PropTypes.string,
	value: _react2["default"].PropTypes.string
})]);

exports.stringOrKeyValue = stringOrKeyValue;
var stringOrArray = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.array]);

exports.stringOrArray = stringOrArray;
var stringOrArrayOfString = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string)]);

exports.stringOrArrayOfString = stringOrArrayOfString;
var arrayOfKeyValue = _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.shape({
	key: _react2["default"].PropTypes.string.isRequired,
	value: _react2["default"].PropTypes.string.isRequired
}));

exports.arrayOfKeyValue = arrayOfKeyValue;
/**
 * An array of strings or an array of key/value objects,
 * example: [{key: "somekey", value: "somevalue"}].
 */
var arrayOfStringOrArrayOfKeyValue = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string), _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.shape({
	key: _react2["default"].PropTypes.string,
	value: _react2["default"].PropTypes.string
}))]);
exports.arrayOfStringOrArrayOfKeyValue = arrayOfStringOrArrayOfKeyValue;

},{"react":"react"}],2:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _hireFormsPropTypes = _dereq_("hire-forms-prop-types");

var HIGHTLIGHT_CLASS = "highlight";

/**
 * Options are rendered beneath the autocomplete and select components.
 *
 * @class
 * @extends React.Component
 */

var Options = (function (_React$Component) {
	function Options() {
		_classCallCheck(this, Options);

		if (_React$Component != null) {
			_React$Component.apply(this, arguments);
		}
	}

	_inherits(Options, _React$Component);

	_createClass(Options, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			var node = _react2["default"].findDOMNode(this);

			if (node) {
				node.style.zIndex = 1000;
			}
		}
	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			var node = _react2["default"].findDOMNode(this);
			node.style.zIndex = 0;
		}
	}, {
		key: "sortRelevance",

		/**
   * Sort props.values on relevance. A result is more relevant
   * when the search query is more at the beginning of the string.
   * String.indexOf(props.query): lower is better.
   *
   * @returns {Array<String>} Sorted values on relevance
   */
		value: function sortRelevance(values) {
			var _this = this;

			return values.sort(function (a, b) {
				a = a.value.toLowerCase();
				b = b.value.toLowerCase();

				var indexA = a.indexOf(_this.props.query);
				var indexB = b.indexOf(_this.props.query);

				if (indexA > indexB) {
					return 1;
				}

				if (indexA < indexB) {
					return -1;
				}

				if (indexA === indexB) {
					if (a > b) {
						return 1;
					}

					if (a < b) {
						return -1;
					}
				}

				return 0;
			});
		}
	}, {
		key: "highlight",
		value: function highlight(target) {
			// Check if target is an event object.
			if (target.hasOwnProperty("currentTarget")) {
				target = target.currentTarget;
			}

			target.classList.add(HIGHTLIGHT_CLASS);
		}
	}, {
		key: "unhighlight",

		/**
   * Unhighlight the currently highlighted option.
   *
   *
   */
		value: function unhighlight() {
			var el = undefined;
			var node = _react2["default"].findDOMNode(this);

			if (node) {
				el = node.querySelector("li.highlight");

				if (el) {
					el.classList.remove(HIGHTLIGHT_CLASS);
				}
			}

			return el;
		}
	}, {
		key: "handleClick",
		value: function handleClick(ev) {
			this.props.onChange(this.getOptionData(ev.currentTarget));
		}
	}, {
		key: "highlightPrev",
		value: function highlightPrev() {
			var prev = undefined;
			var current = this.unhighlight();

			if (current) {
				prev = current.previousElementSibling;
			}

			// If current and prev aren't found, start at the top.
			// Current is not found if there is no list item highlighted.
			// Prev is not found if the first list item is highlighted.
			if (!prev) {
				prev = _react2["default"].findDOMNode(this).lastChild;
			}

			this.highlight(prev);
		}
	}, {
		key: "highlightNext",
		value: function highlightNext() {
			var next = undefined;
			var current = this.unhighlight();

			if (current) {
				next = current.nextElementSibling;
			}

			// If current and next aren't found, start at the top.
			// Current is not found if there is no list item highlighted.
			// Next is not found if the last list item is highlighted.
			if (!next) {
				next = _react2["default"].findDOMNode(this).firstChild;
			}

			this.highlight(next);
		}
	}, {
		key: "select",
		value: function select() {
			var current = this.unhighlight();

			if (current) {
				this.props.onChange(this.getOptionData(current));
			}
		}
	}, {
		key: "getOptionData",

		/**
   * Get the key (id) and value (display name) of an option DOM element.
   *
   * @param {Object} el - Option DOM element
   * @returns {Object}
   */
		value: function getOptionData(el) {
			return {
				key: el.getAttribute("data-key"),
				value: el.getAttribute("data-value")
			};
		}
	}, {
		key: "render",
		value: function render() {
			var _this2 = this;

			if (this.props.values.length === 0) {
				return null;
			}

			var values = this.props.sortRelevance ? this.sortRelevance(this.props.values) : this.props.values;

			var listitems = values.map(function (data, index) {
				var displayValue = data.value;

				if (_this2.props.query.length) {
					var re = new RegExp(_this2.props.query, "ig");
					displayValue = data.value.replace(re, "<span class=\"highlight\">$&</span>");
				}

				var selectedValue = Array.isArray(_this2.props.value) ? _this2.props.value : [_this2.props.value];

				return _react2["default"].createElement("li", {
					className: (0, _classnames2["default"])({ selected: selectedValue.indexOf(data.value) > -1 }),
					dangerouslySetInnerHTML: { __html: displayValue },
					"data-key": data.key,
					"data-value": data.value,
					key: index,
					onClick: _this2.handleClick.bind(_this2),
					onMouseEnter: _this2.highlight.bind(_this2),
					onMouseLeave: _this2.unhighlight.bind(_this2) });
			});

			return _react2["default"].createElement(
				"ul",
				{
					className: "hire-options" },
				listitems
			);
		}
	}]);

	return Options;
})(_react2["default"].Component);

Options.defaultProps = {
	query: "",
	sortRelevance: true,
	value: "",
	values: []
};

Options.propTypes = {
	onChange: _react2["default"].PropTypes.func.isRequired,
	query: _react2["default"].PropTypes.string,
	sortRelevance: _react2["default"].PropTypes.bool,
	value: _hireFormsPropTypes.stringOrArrayOfString,
	values: _hireFormsPropTypes.arrayOfKeyValue
};

exports["default"] = Options;
module.exports = exports["default"];

},{"classnames":"classnames","hire-forms-prop-types":1,"react":"react"}]},{},[2])(2)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"classnames":"classnames","hire-forms-prop-types":2,"react":"react"}],2:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var elementOrArrayOfElement = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.element, _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.element)]);

exports.elementOrArrayOfElement = elementOrArrayOfElement;
/**
 * A string or an object,
 * example: {key: "somekey", value: "somevalue"}.
 */
var stringOrKeyValue = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.shape({
	key: _react2["default"].PropTypes.string,
	value: _react2["default"].PropTypes.string
})]);

exports.stringOrKeyValue = stringOrKeyValue;
var stringOrArray = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.array]);

exports.stringOrArray = stringOrArray;
var stringOrArrayOfString = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string)]);

exports.stringOrArrayOfString = stringOrArrayOfString;
var arrayOfKeyValue = _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.shape({
	key: _react2["default"].PropTypes.string.isRequired,
	value: _react2["default"].PropTypes.string.isRequired
}));

exports.arrayOfKeyValue = arrayOfKeyValue;
/**
 * An array of strings or an array of key/value objects,
 * example: [{key: "somekey", value: "somevalue"}].
 */
var arrayOfStringOrArrayOfKeyValue = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string), _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.shape({
	key: _react2["default"].PropTypes.string,
	value: _react2["default"].PropTypes.string
}))]);
exports.arrayOfStringOrArrayOfKeyValue = arrayOfStringOrArrayOfKeyValue;

},{"react":"react"}],3:[function(_dereq_,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2,"react":"react"}],4:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _hireFormsOptions = _dereq_("hire-forms-options");

var _hireFormsOptions2 = _interopRequireDefault(_hireFormsOptions);

var _hireFormsPropTypes = _dereq_("hire-forms-prop-types");

var Select = (function (_React$Component) {
	function Select(props) {
		_classCallCheck(this, Select);

		_get(Object.getPrototypeOf(Select.prototype), "constructor", this).call(this, props);

		this.state = { visible: false };
	}

	_inherits(Select, _React$Component);

	_createClass(Select, [{
		key: "isListOfStrings",
		value: function isListOfStrings(list) {
			return list.length && typeof list[0] === "string";
		}
	}, {
		key: "isKeyValueMap",
		value: function isKeyValueMap(map) {
			return map.hasOwnProperty("key") && map.hasOwnProperty("value");
		}
	}, {
		key: "stringArray2KeyValueArray",
		value: function stringArray2KeyValueArray(list) {
			return list.map(function (item) {
				return {
					key: item,
					value: item
				};
			});
		}
	}, {
		key: "handleInputClick",
		value: function handleInputClick() {
			this.setState({ visible: !this.state.visible });
		}
	}, {
		key: "handleOptionsChange",

		/**
   * @method
   * @param {object} value Map of key and value: {key: "somekey", value: "somevalue"}
   */
		value: function handleOptionsChange(value) {
			this.setState({ visible: false });

			// If the options prop is an array of strings,
			// return a string.
			if (this.isListOfStrings(this.props.options)) {
				value = value.value;
			}

			this.props.onChange(value);
		}
	}, {
		key: "render",
		value: function render() {
			var optionValues = undefined,
			    options = undefined;

			if (this.state.visible) {
				optionValues = this.isListOfStrings(this.props.options) ? this.stringArray2KeyValueArray(this.props.options) : this.props.options;

				options = _react2["default"].createElement(_hireFormsOptions2["default"], {
					onChange: this.handleOptionsChange.bind(this),
					sortRelevance: this.props.sortRelevance,
					values: optionValues });
			}

			var value = this.props.value === "" ? this.props.placeholder : this.props.value;

			if (this.isKeyValueMap(this.props.value)) {
				value = this.props.value.value;
			}

			return _react2["default"].createElement(
				"div",
				{ className: "hire-select" },
				_react2["default"].createElement(
					"div",
					{
						className: "input-container",
						onClick: this.handleInputClick.bind(this) },
					_react2["default"].createElement(
						"div",
						{ className: (0, _classnames2["default"])({
								"input": true,
								"placeholder": this.props.value === "" }) },
						value
					),
					_react2["default"].createElement(
						"button",
						null,
						"▾"
					)
				),
				options
			);
		}
	}]);

	return Select;
})(_react2["default"].Component);

Select.defaultProps = {
	value: "",
	options: []
};

Select.propTypes = {
	onChange: _react2["default"].PropTypes.func.isRequired,
	options: _hireFormsPropTypes.arrayOfStringOrArrayOfKeyValue,
	placeholder: _react2["default"].PropTypes.string,
	sortRelevance: _react2["default"].PropTypes.bool,
	value: _hireFormsPropTypes.stringOrKeyValue
};

exports["default"] = Select;
module.exports = exports["default"];

},{"classnames":"classnames","hire-forms-options":1,"hire-forms-prop-types":3,"react":"react"}]},{},[4])(4)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"classnames":"classnames","hire-forms-options":18,"hire-forms-prop-types":19,"react":"react"}],18:[function(_dereq_,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.HireFormsOptions = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var elementOrArrayOfElement = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.element, _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.element)]);

exports.elementOrArrayOfElement = elementOrArrayOfElement;
/**
 * A string or an object,
 * example: {key: "somekey", value: "somevalue"}.
 */
var stringOrKeyValue = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.shape({
	key: _react2["default"].PropTypes.string,
	value: _react2["default"].PropTypes.string
})]);

exports.stringOrKeyValue = stringOrKeyValue;
var stringOrArray = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.array]);

exports.stringOrArray = stringOrArray;
var stringOrArrayOfString = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string)]);

exports.stringOrArrayOfString = stringOrArrayOfString;
var arrayOfKeyValue = _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.shape({
	key: _react2["default"].PropTypes.string.isRequired,
	value: _react2["default"].PropTypes.string.isRequired
}));

exports.arrayOfKeyValue = arrayOfKeyValue;
/**
 * An array of strings or an array of key/value objects,
 * example: [{key: "somekey", value: "somevalue"}].
 */
var arrayOfStringOrArrayOfKeyValue = _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string), _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.shape({
	key: _react2["default"].PropTypes.string,
	value: _react2["default"].PropTypes.string
}))]);
exports.arrayOfStringOrArrayOfKeyValue = arrayOfStringOrArrayOfKeyValue;

},{"react":"react"}],2:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _hireFormsPropTypes = _dereq_("hire-forms-prop-types");

var HIGHTLIGHT_CLASS = "highlight";

/**
 * Options are rendered beneath the autocomplete and select components.
 *
 * @class
 * @extends React.Component
 */

var Options = (function (_React$Component) {
	function Options() {
		_classCallCheck(this, Options);

		if (_React$Component != null) {
			_React$Component.apply(this, arguments);
		}
	}

	_inherits(Options, _React$Component);

	_createClass(Options, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			var node = _react2["default"].findDOMNode(this);

			if (node) {
				node.style.zIndex = 1000;
			}
		}
	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			var node = _react2["default"].findDOMNode(this);
			node.style.zIndex = 0;
		}
	}, {
		key: "sortRelevance",

		/**
   * Sort props.values on relevance. A result is more relevant
   * when the search query is more at the beginning of the string.
   * String.indexOf(props.query): lower is better.
   *
   * @returns {Array<String>} Sorted values on relevance
   */
		value: function sortRelevance(values) {
			var _this = this;

			return values.sort(function (a, b) {
				a = a.value.toLowerCase();
				b = b.value.toLowerCase();

				var indexA = a.indexOf(_this.props.query);
				var indexB = b.indexOf(_this.props.query);

				if (indexA > indexB) {
					return 1;
				}

				if (indexA < indexB) {
					return -1;
				}

				if (indexA === indexB) {
					if (a > b) {
						return 1;
					}

					if (a < b) {
						return -1;
					}
				}

				return 0;
			});
		}
	}, {
		key: "highlight",
		value: function highlight(target) {
			// Check if target is an event object.
			if (target.hasOwnProperty("currentTarget")) {
				target = target.currentTarget;
			}

			target.classList.add(HIGHTLIGHT_CLASS);
		}
	}, {
		key: "unhighlight",

		/**
   * Unhighlight the currently highlighted option.
   *
   *
   */
		value: function unhighlight() {
			var el = undefined;
			var node = _react2["default"].findDOMNode(this);

			if (node) {
				el = node.querySelector("li.highlight");

				if (el) {
					el.classList.remove(HIGHTLIGHT_CLASS);
				}
			}

			return el;
		}
	}, {
		key: "handleClick",
		value: function handleClick(ev) {
			this.props.onChange(this.getOptionData(ev.currentTarget));
		}
	}, {
		key: "highlightPrev",
		value: function highlightPrev() {
			var prev = undefined;
			var current = this.unhighlight();

			if (current) {
				prev = current.previousElementSibling;
			}

			// If current and prev aren't found, start at the top.
			// Current is not found if there is no list item highlighted.
			// Prev is not found if the first list item is highlighted.
			if (!prev) {
				prev = _react2["default"].findDOMNode(this).lastChild;
			}

			this.highlight(prev);
		}
	}, {
		key: "highlightNext",
		value: function highlightNext() {
			var next = undefined;
			var current = this.unhighlight();

			if (current) {
				next = current.nextElementSibling;
			}

			// If current and next aren't found, start at the top.
			// Current is not found if there is no list item highlighted.
			// Next is not found if the last list item is highlighted.
			if (!next) {
				next = _react2["default"].findDOMNode(this).firstChild;
			}

			this.highlight(next);
		}
	}, {
		key: "select",
		value: function select() {
			var current = this.unhighlight();

			if (current) {
				this.props.onChange(this.getOptionData(current));
			}
		}
	}, {
		key: "getOptionData",

		/**
   * Get the key (id) and value (display name) of an option DOM element.
   *
   * @param {Object} el - Option DOM element
   * @returns {Object}
   */
		value: function getOptionData(el) {
			return {
				key: el.getAttribute("data-key"),
				value: el.getAttribute("data-value")
			};
		}
	}, {
		key: "render",
		value: function render() {
			var _this2 = this;

			if (this.props.values.length === 0) {
				return null;
			}

			var values = this.props.sortRelevance ? this.sortRelevance(this.props.values) : this.props.values;

			var listitems = values.map(function (data, index) {
				var displayValue = data.value;

				if (_this2.props.query.length) {
					var re = new RegExp(_this2.props.query, "ig");
					displayValue = data.value.replace(re, "<span class=\"highlight\">$&</span>");
				}

				var selectedValue = Array.isArray(_this2.props.value) ? _this2.props.value : [_this2.props.value];

				return _react2["default"].createElement("li", {
					className: (0, _classnames2["default"])({ selected: selectedValue.indexOf(data.value) > -1 }),
					dangerouslySetInnerHTML: { __html: displayValue },
					"data-key": data.key,
					"data-value": data.value,
					key: index,
					onClick: _this2.handleClick.bind(_this2),
					onMouseEnter: _this2.highlight.bind(_this2),
					onMouseLeave: _this2.unhighlight.bind(_this2) });
			});

			return _react2["default"].createElement(
				"ul",
				{
					className: "hire-options" },
				listitems
			);
		}
	}]);

	return Options;
})(_react2["default"].Component);

Options.defaultProps = {
	query: "",
	sortRelevance: true,
	value: "",
	values: []
};

Options.propTypes = {
	onChange: _react2["default"].PropTypes.func.isRequired,
	query: _react2["default"].PropTypes.string,
	sortRelevance: _react2["default"].PropTypes.bool,
	value: _hireFormsPropTypes.stringOrArrayOfString,
	values: _hireFormsPropTypes.arrayOfKeyValue
};

exports["default"] = Options;
module.exports = exports["default"];

},{"classnames":"classnames","hire-forms-prop-types":1,"react":"react"}]},{},[2])(2)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"classnames":"classnames","hire-forms-prop-types":19,"react":"react"}],19:[function(_dereq_,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5,"react":"react"}],20:[function(_dereq_,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],21:[function(_dereq_,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8}],22:[function(_dereq_,module,exports){
"use strict";
var window = _dereq_("global/window")
var once = _dereq_("once")
var parseHeaders = _dereq_("parse-headers")


var XHR = window.XMLHttpRequest || noop
var XDR = "withCredentials" in (new XHR()) ? XHR : window.XDomainRequest

module.exports = createXHR

function createXHR(options, callback) {
    function readystatechange() {
        if (xhr.readyState === 4) {
            loadFunc()
        }
    }

    function getBody() {
        // Chrome with requestType=blob throws errors arround when even testing access to responseText
        var body = undefined

        if (xhr.response) {
            body = xhr.response
        } else if (xhr.responseType === "text" || !xhr.responseType) {
            body = xhr.responseText || xhr.responseXML
        }

        if (isJson) {
            try {
                body = JSON.parse(body)
            } catch (e) {}
        }

        return body
    }
    
    var failureResponse = {
                body: undefined,
                headers: {},
                statusCode: 0,
                method: method,
                url: uri,
                rawRequest: xhr
            }
    
    function errorFunc(evt) {
        clearTimeout(timeoutTimer)
        if(!(evt instanceof Error)){
            evt = new Error("" + (evt || "unknown") )
        }
        evt.statusCode = 0
        callback(evt, failureResponse)
    }

    // will load the data & process the response in a special response object
    function loadFunc() {
        clearTimeout(timeoutTimer)
        
        var status = (xhr.status === 1223 ? 204 : xhr.status)
        var response = failureResponse
        var err = null
        
        if (status !== 0){
            response = {
                body: getBody(),
                statusCode: status,
                method: method,
                headers: {},
                url: uri,
                rawRequest: xhr
            }
            if(xhr.getAllResponseHeaders){ //remember xhr can in fact be XDR for CORS in IE
                response.headers = parseHeaders(xhr.getAllResponseHeaders())
            }
        } else {
            err = new Error("Internal XMLHttpRequest Error")
        }
        callback(err, response, response.body)
        
    }
    
    if (typeof options === "string") {
        options = { uri: options }
    }

    options = options || {}
    if(typeof callback === "undefined"){
        throw new Error("callback argument missing")
    }
    callback = once(callback)

    var xhr = options.xhr || null

    if (!xhr) {
        if (options.cors || options.useXDR) {
            xhr = new XDR()
        }else{
            xhr = new XHR()
        }
    }

    var key
    var uri = xhr.url = options.uri || options.url
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data
    var headers = xhr.headers = options.headers || {}
    var sync = !!options.sync
    var isJson = false
    var timeoutTimer

    if ("json" in options) {
        isJson = true
        headers["Accept"] || (headers["Accept"] = "application/json") //Don't override existing accept header declared by user
        if (method !== "GET" && method !== "HEAD") {
            headers["Content-Type"] = "application/json"
            body = JSON.stringify(options.json)
        }
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = loadFunc
    xhr.onerror = errorFunc
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    xhr.ontimeout = errorFunc
    xhr.open(method, uri, !sync, options.username, options.password)
    //has to be after open
    if(!sync) {
        xhr.withCredentials = !!options.withCredentials
    }
    // Cannot set timeout with sync request
    // not setting timeout on the xhr object, because of old webkits etc. not handling that correctly
    // both npm's request and jquery 1.x use this kind of timeout, so this is being consistent
    if (!sync && options.timeout > 0 ) {
        timeoutTimer = setTimeout(function(){
            xhr.abort("timeout");
        }, options.timeout+2 );
    }

    if (xhr.setRequestHeader) {
        for(key in headers){
            if(headers.hasOwnProperty(key)){
                xhr.setRequestHeader(key, headers[key])
            }
        }
    } else if (options.headers) {
        throw new Error("Headers cannot be set on an XDomainRequest object")
    }

    if ("responseType" in options) {
        xhr.responseType = options.responseType
    }
    
    if ("beforeSend" in options && 
        typeof options.beforeSend === "function"
    ) {
        options.beforeSend(xhr)
    }

    xhr.send(body)

    return xhr


}


function noop() {}

},{"global/window":23,"once":24,"parse-headers":28}],23:[function(_dereq_,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window;
} else if (typeof global !== "undefined") {
    module.exports = global;
} else if (typeof self !== "undefined"){
    module.exports = self;
} else {
    module.exports = {};
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],24:[function(_dereq_,module,exports){
module.exports = once

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })
})

function once (fn) {
  var called = false
  return function () {
    if (called) return
    called = true
    return fn.apply(this, arguments)
  }
}

},{}],25:[function(_dereq_,module,exports){
var isFunction = _dereq_('is-function')

module.exports = forEach

var toString = Object.prototype.toString
var hasOwnProperty = Object.prototype.hasOwnProperty

function forEach(list, iterator, context) {
    if (!isFunction(iterator)) {
        throw new TypeError('iterator must be a function')
    }

    if (arguments.length < 3) {
        context = this
    }
    
    if (toString.call(list) === '[object Array]')
        forEachArray(list, iterator, context)
    else if (typeof list === 'string')
        forEachString(list, iterator, context)
    else
        forEachObject(list, iterator, context)
}

function forEachArray(array, iterator, context) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            iterator.call(context, array[i], i, array)
        }
    }
}

function forEachString(string, iterator, context) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        iterator.call(context, string.charAt(i), i, string)
    }
}

function forEachObject(object, iterator, context) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            iterator.call(context, object[k], k, object)
        }
    }
}

},{"is-function":26}],26:[function(_dereq_,module,exports){
module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};

},{}],27:[function(_dereq_,module,exports){

exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};

},{}],28:[function(_dereq_,module,exports){
var trim = _dereq_('trim')
  , forEach = _dereq_('for-each')
  , isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    }

module.exports = function (headers) {
  if (!headers)
    return {}

  var result = {}

  forEach(
      trim(headers).split('\n')
    , function (row) {
        var index = row.indexOf(':')
          , key = trim(row.slice(0, index)).toLowerCase()
          , value = trim(row.slice(index + 1))

        if (typeof(result[key]) === 'undefined') {
          result[key] = value
        } else if (isArray(result[key])) {
          result[key].push(value)
        } else {
          result[key] = [ result[key], value ]
        }
      }
  )

  return result
}
},{"for-each":25,"trim":27}],29:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _dispatcher = _dereq_("../dispatcher");

var _dispatcher2 = _interopRequireDefault(_dispatcher);

var _api = _dereq_("../api");

var _api2 = _interopRequireDefault(_api);

var authorActions = {
	getAuthor: function getAuthor(id) {
		_api2["default"].getAuthor(id);
	},

	setKey: function setKey(key, value) {
		_dispatcher2["default"].handleViewAction({
			actionType: "AUTHOR_SET_KEY",
			key: key,
			value: value
		});
	},

	deleteKey: function deleteKey(key) {
		_dispatcher2["default"].handleViewAction({
			actionType: "AUTHOR_DELETE_KEY",
			key: key
		});
	}
};

exports["default"] = authorActions;
module.exports = exports["default"];

},{"../api":32,"../dispatcher":39}],30:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _dispatcher = _dereq_("../dispatcher");

var _dispatcher2 = _interopRequireDefault(_dispatcher);

var publicationActions = {
	setKey: function setKey(key, value) {
		_dispatcher2["default"].handleViewAction({
			actionType: "PUBLICATION_SET_KEY",
			key: key,
			value: value
		});
	},

	deleteKey: function deleteKey(key) {
		_dispatcher2["default"].handleViewAction({
			actionType: "PUBLICATION_DELETE_KEY",
			key: key
		});
	}
};

exports["default"] = publicationActions;
module.exports = exports["default"];

},{"../dispatcher":39}],31:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _dispatcher = _dereq_("../dispatcher");

var _dispatcher2 = _interopRequireDefault(_dispatcher);

var serverActions = {
	receiveAuthor: function receiveAuthor(data) {
		_dispatcher2["default"].handleServerAction({
			actionType: "AUTHOR_RECEIVE",
			data: data
		});
	},

	updateAuthor: function updateAuthor(data) {
		_dispatcher2["default"].handleServerAction({
			actionType: "AUTHOR_UPDATE",
			data: data
		});
	},

	receivePublication: function receivePublication(data) {
		_dispatcher2["default"].handleServerAction({
			actionType: "PUBLICATION_RECEIVE",
			data: data
		});
	},

	updatePublication: function updatePublication(data) {
		_dispatcher2["default"].handleServerAction({
			actionType: "PUBLICATION_UPDATE",
			data: data
		});
	},

	receivelanguages: function receivelanguages(data) {
		_dispatcher2["default"].handleServerAction({
			actionType: "LANGUAGES_RECEIVE",
			data: data
		});
	}
};

exports["default"] = serverActions;
module.exports = exports["default"];

},{"../dispatcher":39}],32:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _xhr = _dereq_("xhr");

var _xhr2 = _interopRequireDefault(_xhr);

var _actionsServer = _dereq_("./actions/server");

var _actionsServer2 = _interopRequireDefault(_actionsServer);

var _parsersAuthor = _dereq_("./parsers/author");

var baseUrl = "https://acc.repository.huygens.knaw.nl";

var handleError = function handleError(err, resp, body) {
	console.error("Some xhr request failed!", err);
};

var getAutocompleteValues = function getAutocompleteValues(name, query, done) {
	var options = {
		headers: {
			"Content-Type": "application/json",
			"VRE_ID": "WomenWriters"
		},
		url: baseUrl + "/v2/domain/ww" + name + "/autocomplete?query=*" + query + "*"
	};

	var xhrDone = function xhrDone(err, resp, body) {
		if (err) {
			handleError(err);
		}

		done(JSON.parse(body));
	};

	(0, _xhr2["default"])(options, xhrDone);
};

var getSelectValues = function getSelectValues(name, done) {
	var options = {
		headers: {
			"Content-Type": "application/json",
			"VRE_ID": "WomenWriters"
		},
		url: baseUrl + "/v2/domain/wwkeywords/autocomplete?type=" + name
	};

	var xhrDone = function xhrDone(err, resp, body) {
		if (err) {
			handleError(err);
		}

		done(JSON.parse(body));
	};

	(0, _xhr2["default"])(options, xhrDone);
};

exports["default"] = {
	getAuthor: function getAuthor(id) {
		var options = {
			headers: {
				"Content-Type": "application/json"
			},
			url: baseUrl + "/domain/wwpersons/" + id
		};

		var done = function done(err, resp, body) {
			if (err) {
				handleError(err, resp, body);
			}

			body = (0, _parsersAuthor.parseIncomingAuthor)(JSON.parse(body));

			_actionsServer2["default"].receiveAuthor(body);
		};

		(0, _xhr2["default"])(options, done);
	},

	getPublication: function getPublication(id) {
		var options = {
			headers: {
				"Content-Type": "application/json"
			},
			url: baseUrl + "/domain/wwdocuments/" + id
		};

		var done = function done(err, resp, body) {
			if (err) {
				handleError(err);
			}

			_actionsServer2["default"].receivePublication(JSON.parse(body));
		};

		(0, _xhr2["default"])(options, done);
	},

	getLanguages: function getLanguages(query, done) {
		getAutocompleteValues("languages", query, done);
	},

	getPersons: function getPersons(query, done) {
		getAutocompleteValues("persons", query, done);
	},

	getLocations: function getLocations(query, done) {
		getAutocompleteValues("locations", query, done);
	},

	getMaritalStatus: function getMaritalStatus(done) {
		getSelectValues("maritalStatus", done);
	},

	getFinancialSituation: function getFinancialSituation(done) {
		getSelectValues("financialSituation", done);
	},

	getEducation: function getEducation(done) {
		getSelectValues("education", done);
	},

	getProfession: function getProfession(done) {
		getSelectValues("profession", done);
	},

	getReligion: function getReligion(done) {
		getSelectValues("religion", done);
	},

	getSocialClass: function getSocialClass(done) {
		getSelectValues("socialClass", done);
	},

	getDocSourceType: function getDocSourceType(done) {
		getSelectValues("docSourceType", done);
	},

	getGenre: function getGenre(done) {
		getSelectValues("genre", done);
	}
};
module.exports = exports["default"];

},{"./actions/server":31,"./parsers/author":41,"xhr":22}],33:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _hireFormsForm = _dereq_("hire-forms-form");

var _hireFormsForm2 = _interopRequireDefault(_hireFormsForm);

var _hireFormsMultiForm = _dereq_("hire-forms-multi-form");

var _hireFormsMultiForm2 = _interopRequireDefault(_hireFormsMultiForm);

var _hireFormsSelect = _dereq_("hire-forms-select");

var _hireFormsSelect2 = _interopRequireDefault(_hireFormsSelect);

var _hireFormsInput = _dereq_("hire-forms-input");

var _hireFormsInput2 = _interopRequireDefault(_hireFormsInput);

var _name = _dereq_("./name");

var _name2 = _interopRequireDefault(_name);

var BasicInfoForm = (function () {
	function BasicInfoForm() {
		_classCallCheck(this, BasicInfoForm);
	}

	_createClass(BasicInfoForm, [{
		key: "render",
		value: function render() {
			var model = this.props.value;

			return _react2["default"].createElement(
				"ul",
				null,
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Names"
					),
					_react2["default"].createElement(_hireFormsMultiForm2["default"], {
						attr: "names",
						component: _name2["default"],
						onChange: this.props.onChange,
						onDelete: this.props.onDelete,
						values: model.get("names") })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Pseudonyms"
					),
					_react2["default"].createElement(_hireFormsMultiForm2["default"], {
						attr: "pseudonyms",
						component: _name2["default"],
						onChange: this.props.onChange,
						onDelete: this.props.onDelete,
						values: model.get("pseudonyms") })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Person type"
					),
					_react2["default"].createElement(_hireFormsSelect2["default"], {
						onChange: this.props.onChange.bind(this, "persontype"),
						options: ["Archetype", "Author", "Pseudonym"],
						value: model.get("persontype") })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Gender"
					),
					_react2["default"].createElement(_hireFormsSelect2["default"], {
						onChange: this.props.onChange.bind(this, "gender"),
						options: ["Female", "Male", "Unknown"],
						value: model.get("gender") })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Birth date"
					),
					_react2["default"].createElement(_hireFormsInput2["default"], {
						onChange: this.props.onChange.bind(this, "birthDate"),
						value: model.get("birthDate") })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Birth place"
					),
					_react2["default"].createElement(_hireFormsInput2["default"], {
						onChange: this.props.onChange.bind(this, "birthPlace"),
						value: model.get("birthPlace") })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Death date"
					),
					_react2["default"].createElement(_hireFormsInput2["default"], {
						onChange: this.props.onChange.bind(this, "deathDate"),
						value: model.get("deathDate") })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Death place"
					),
					_react2["default"].createElement(_hireFormsInput2["default"], {
						onChange: this.props.onChange.bind(this, "deathPlace"),
						value: model.get("deathPlace") })
				)
			);
		}
	}]);

	return BasicInfoForm;
})();

exports["default"] = (0, _hireFormsForm2["default"])(BasicInfoForm);
module.exports = exports["default"];

},{"./name":34,"hire-forms-form":2,"hire-forms-input":3,"hire-forms-multi-form":4,"hire-forms-select":17,"react":"react"}],34:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _immutable = _dereq_("immutable");

var _immutable2 = _interopRequireDefault(_immutable);

var _hireFormsForm = _dereq_("hire-forms-form");

var _hireFormsForm2 = _interopRequireDefault(_hireFormsForm);

var _hireFormsInput = _dereq_("hire-forms-input");

var _hireFormsInput2 = _interopRequireDefault(_hireFormsInput);

var name = new _immutable2["default"].Map({
	firstName: "",
	lastName: ""
});

var NameForm = (function () {
	function NameForm() {
		_classCallCheck(this, NameForm);
	}

	_createClass(NameForm, [{
		key: "render",
		value: function render() {
			var model = name.merge(this.props.value);

			return _react2["default"].createElement(
				"ul",
				null,
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(_hireFormsInput2["default"], {
						onChange: this.props.handleChange.bind(this, "firstName"),
						placeholder: "First name",
						value: model.get("firstName") })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(_hireFormsInput2["default"], {
						onChange: this.props.handleChange.bind(this, "lastName"),
						placeholder: "Last name",
						value: model.get("lastName") })
				)
			);
		}
	}]);

	return NameForm;
})();

exports["default"] = (0, _hireFormsForm2["default"])(NameForm, "names-form");
module.exports = exports["default"];

},{"hire-forms-form":2,"hire-forms-input":3,"immutable":"immutable","react":"react"}],35:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _hireTabs = _dereq_("hire-tabs");

var _hireFormsMultiForm = _dereq_("hire-forms-multi-form");

var _hireFormsMultiForm2 = _interopRequireDefault(_hireFormsMultiForm);

var _basicInfo = _dereq_("./basic-info");

var _basicInfo2 = _interopRequireDefault(_basicInfo);

var _personal = _dereq_("./personal");

var _personal2 = _interopRequireDefault(_personal);

var _public = _dereq_("./public");

var _public2 = _interopRequireDefault(_public);

var _link = _dereq_("./link");

var _link2 = _interopRequireDefault(_link);

var _actionsAuthor = _dereq_("../actions/author");

var _actionsAuthor2 = _interopRequireDefault(_actionsAuthor);

var _storesAuthor = _dereq_("../stores/author");

var _storesAuthor2 = _interopRequireDefault(_storesAuthor);

var AuthorController = (function (_React$Component) {
	_inherits(AuthorController, _React$Component);

	function AuthorController(props) {
		_classCallCheck(this, AuthorController);

		_get(Object.getPrototypeOf(AuthorController.prototype), "constructor", this).call(this, props);

		this.state = _extends(_storesAuthor2["default"].getState(), {
			activeTab: "Basic Info"
		});
	}

	_createClass(AuthorController, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			_actionsAuthor2["default"].getAuthor(this.props.id);
			_storesAuthor2["default"].listen(this.onStoreChange.bind(this));
		}
	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			_storesAuthor2["default"].stopListening(this.onStoreChange.bind(this));
		}
	}, {
		key: "onStoreChange",
		value: function onStoreChange() {
			this.setState(_storesAuthor2["default"].getState());
		}
	}, {
		key: "handleTabChange",
		value: function handleTabChange(label) {
			this.setState({
				activeTab: label
			});
		}
	}, {
		key: "handleFormChange",
		value: function handleFormChange(key, value) {
			_actionsAuthor2["default"].setKey(key, value);
		}
	}, {
		key: "handleFormDelete",
		value: function handleFormDelete(key) {
			_actionsAuthor2["default"].deleteKey(key);
		}
	}, {
		key: "render",
		value: function render() {
			return _react2["default"].createElement(
				_hireTabs.Tabs,
				{ onChange: this.handleTabChange.bind(this) },
				_react2["default"].createElement(
					_hireTabs.Tab,
					{
						active: this.state.activeTab === "Basic Info",
						label: "Basic Info" },
					_react2["default"].createElement(_basicInfo2["default"], {
						onChange: this.handleFormChange,
						onDelete: this.handleFormDelete,
						value: this.state.author })
				),
				_react2["default"].createElement(
					_hireTabs.Tab,
					{
						active: this.state.activeTab === "Personal",
						label: "Personal" },
					_react2["default"].createElement(_personal2["default"], {
						onChange: this.handleFormChange,
						onDelete: this.handleFormDelete,
						value: this.state.author })
				),
				_react2["default"].createElement(
					_hireTabs.Tab,
					{
						active: this.state.activeTab === "Public",
						label: "Public" },
					_react2["default"].createElement(_public2["default"], {
						onChange: this.handleFormChange,
						onDelete: this.handleFormDelete,
						value: this.state.author })
				),
				_react2["default"].createElement(
					_hireTabs.Tab,
					{
						active: this.state.activeTab === "Links",
						label: "Links" },
					_react2["default"].createElement(_hireFormsMultiForm2["default"], {
						attr: "links",
						component: _link2["default"],
						onChange: this.handleFormChange,
						onDelete: this.handleFormDelete,
						values: this.state.author.get("links") })
				)
			);
		}
	}]);

	return AuthorController;
})(_react2["default"].Component);

AuthorController.propTypes = {
	id: _react2["default"].PropTypes.string
};

exports["default"] = AuthorController;
module.exports = exports["default"];
/* Works */ /* Links */

},{"../actions/author":29,"../stores/author":44,"./basic-info":33,"./link":36,"./personal":37,"./public":38,"hire-forms-multi-form":4,"hire-tabs":13,"react":"react"}],36:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _hireFormsForm = _dereq_("hire-forms-form");

var _hireFormsForm2 = _interopRequireDefault(_hireFormsForm);

var _hireFormsInput = _dereq_("hire-forms-input");

var _hireFormsInput2 = _interopRequireDefault(_hireFormsInput);

/*
 * URLs are hard to validate, see: http://stackoverflow.com/a/1411800/997941
 * That's why we check simply for:
 * * whitespace
 * * two consecutive dots (..)
 * * double quotes (")
 * * at least one dot (.)
 * * not starting or ending with a dot
 *
 * @param {String} value
 * @returns {Object} A validator object with `isValid` and `message` properties.
 */
var validateURL = function validateURL(value) {
	var re = /\s+|\.\.|"/;
	var oneDot = value.indexOf(".") > 0;
	var noEndDot = value.charAt(value.length - 1) !== ".";
	var isValid = !re.test(value) && oneDot && noEndDot;

	return {
		isValid: isValid,
		message: isValid ? "" : "Please enter a valid email address."
	};
};

var LinkForm = (function () {
	function LinkForm() {
		_classCallCheck(this, LinkForm);
	}

	_createClass(LinkForm, [{
		key: "render",
		value: function render() {
			var model = this.props.value;

			return _react2["default"].createElement(
				"ul",
				null,
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(_hireFormsInput2["default"], {
						onChange: this.props.handleChange.bind(this, "label"),
						placeholder: "Label",
						value: model.get("label") })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(_hireFormsInput2["default"], {
						onChange: this.props.handleChange.bind(this, "url"),
						placeholder: "http://",
						validate: validateURL,
						value: model.get("url") })
				)
			);
		}
	}]);

	return LinkForm;
})();

exports["default"] = (0, _hireFormsForm2["default"])(LinkForm, "hire-forms-link-form");
module.exports = exports["default"];

},{"hire-forms-form":2,"hire-forms-input":3,"react":"react"}],37:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _hireFormsForm = _dereq_("hire-forms-form");

var _hireFormsForm2 = _interopRequireDefault(_hireFormsForm);

var _hireFormsSelect = _dereq_("hire-forms-select");

var _hireFormsSelect2 = _interopRequireDefault(_hireFormsSelect);

var _hireFormsInput = _dereq_("hire-forms-input");

var _hireFormsInput2 = _interopRequireDefault(_hireFormsInput);

var _hireFormsTextarea = _dereq_("hire-forms-textarea");

var _hireFormsTextarea2 = _interopRequireDefault(_hireFormsTextarea);

var _api = _dereq_("../../api");

var _api2 = _interopRequireDefault(_api);

var PersonalForm = (function () {
	function PersonalForm() {
		_classCallCheck(this, PersonalForm);
	}

	_createClass(PersonalForm, [{
		key: "render",
		value: function render() {
			var model = this.props.value;

			return _react2["default"].createElement(
				"ul",
				null,
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Marital status"
					),
					_react2["default"].createElement(_hireFormsSelect2["default"], {
						async: _api2["default"].getMaritalStatus,
						onChange: this.props.onChange.bind(this, "maritalStatus"),
						value: model.get("maritalStatus").toJS() })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Children"
					),
					_react2["default"].createElement(_hireFormsSelect2["default"], {
						onChange: this.props.onChange.bind(this, "children"),
						options: ["yes", "no", "unknown"],
						value: model.get("children") })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Social class"
					),
					_react2["default"].createElement(_hireFormsSelect2["default"], {
						async: _api2["default"].getSocialClass,
						onChange: this.props.onChange.bind(this, "socialClass"),
						value: model.get("socialClass").toJS() })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Education"
					),
					_react2["default"].createElement(_hireFormsSelect2["default"], {
						async: _api2["default"].getEducation,
						onChange: this.props.onChange.bind(this, "education"),
						value: model.get("education").toJS() })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Religion"
					),
					_react2["default"].createElement(_hireFormsSelect2["default"], {
						async: _api2["default"].getReligion,
						onChange: this.props.onChange.bind(this, "religion"),
						value: model.get("religion").toJS() })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Bibliography"
					),
					_react2["default"].createElement(_hireFormsTextarea2["default"], {
						onChange: this.props.onChange.bind(this, "bibliography"),
						value: model.get("bibliography") })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Notes"
					),
					_react2["default"].createElement(_hireFormsTextarea2["default"], {
						onChange: this.props.onChange.bind(this, "notes"),
						value: model.get("notes") })
				)
			);
		}
	}]);

	return PersonalForm;
})();

exports["default"] = (0, _hireFormsForm2["default"])(PersonalForm);
module.exports = exports["default"];
/* isSpouseOf */

},{"../../api":32,"hire-forms-form":2,"hire-forms-input":3,"hire-forms-select":10,"hire-forms-textarea":11,"react":"react"}],38:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _hireFormsForm = _dereq_("hire-forms-form");

var _hireFormsForm2 = _interopRequireDefault(_hireFormsForm);

var _hireFormsSelect = _dereq_("hire-forms-select");

var _hireFormsSelect2 = _interopRequireDefault(_hireFormsSelect);

var _api = _dereq_("../../api");

var _api2 = _interopRequireDefault(_api);

var PublicForm = (function () {
	function PublicForm() {
		_classCallCheck(this, PublicForm);
	}

	_createClass(PublicForm, [{
		key: "render",
		value: function render() {
			var model = this.props.value;

			return _react2["default"].createElement(
				"ul",
				null,
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Profession"
					),
					_react2["default"].createElement(_hireFormsSelect2["default"], {
						async: _api2["default"].getProfession,
						onChange: this.props.onChange.bind(this, "profession"),
						value: model.get("profession").toJS() })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Financials"
					),
					_react2["default"].createElement(_hireFormsSelect2["default"], {
						async: _api2["default"].getFinancialSituation,
						onChange: this.props.onChange.bind(this, "financials"),
						value: model.get("financials").toJS() })
				)
			);
		}
	}]);

	return PublicForm;
})();

exports["default"] = (0, _hireFormsForm2["default"])(PublicForm);
module.exports = exports["default"];
/* Collaborations */ /* Memberschips */ /* TEMP DATA */

},{"../../api":32,"hire-forms-form":2,"hire-forms-select":10,"react":"react"}],39:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _flux = _dereq_("flux");

var AppDispatcher = (function (_Dispatcher) {
	_inherits(AppDispatcher, _Dispatcher);

	function AppDispatcher() {
		_classCallCheck(this, AppDispatcher);

		_get(Object.getPrototypeOf(AppDispatcher.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(AppDispatcher, [{
		key: "handleViewAction",
		value: function handleViewAction(action) {
			return this.dispatch({
				source: "VIEW_ACTION",
				action: action
			});
		}
	}, {
		key: "handleServerAction",
		value: function handleServerAction(action) {
			return this.dispatch({
				source: "SERVER_ACTION",
				action: action
			});
		}
	}]);

	return AppDispatcher;
})(_flux.Dispatcher);

exports["default"] = new AppDispatcher();
module.exports = exports["default"];

},{"flux":14}],40:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _author = _dereq_("./author");

var _author2 = _interopRequireDefault(_author);

var _publication = _dereq_("./publication");

var _publication2 = _interopRequireDefault(_publication);

exports.Author = _author2["default"];
exports.Publication = _publication2["default"];

},{"./author":35,"./publication":43}],41:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var iterateObjectKeys = function iterateObjectKeys(obj, parser) {
	var isObject = function isObject(o) {
		return o !== null && !Array.isArray(o) && typeof o === "object";
	};

	Object.keys(obj).forEach(function (key) {
		var value = obj[key];

		if (Array.isArray(value)) {
			if (value.length && isObject(value[0])) {
				value.forEach(function (nestedObject) {
					return iterateObjectKeys(nestedObject, parser);
				});
			}
		} else if (isObject(value)) {
			iterateObjectKeys(value, parser);
		}

		parser(key, value, obj);
	});
};

var inComingParser = function inComingParser(key, value, obj) {
	if (key === "names") {
		obj[key] = value.map(function (names) {
			return {
				firstName: names.components[0].value,
				lastName: names.components[1].value
			};
		});
	}

	if (key === "gender" || key === "children") {
		obj[key] = value.charAt(0) + value.substr(1).toLowerCase();
	}
};

var outGoingParser = function outGoingParser(key, value, obj) {};

var parseIncomingAuthor = function parseIncomingAuthor(data) {
	iterateObjectKeys(data, inComingParser);

	return data;
};

exports.parseIncomingAuthor = parseIncomingAuthor;
var parseOutgoingAuthor = function parseOutgoingAuthor(data) {
	iterateObjectKeys(data, outGoingParser);

	return data;
};
exports.parseOutgoingAuthor = parseOutgoingAuthor;

},{}],42:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _hireFormsForm = _dereq_("hire-forms-form");

var _hireFormsForm2 = _interopRequireDefault(_hireFormsForm);

var _hireFormsSelect = _dereq_("hire-forms-select");

var _hireFormsSelect2 = _interopRequireDefault(_hireFormsSelect);

var _hireFormsInput = _dereq_("hire-forms-input");

var _hireFormsInput2 = _interopRequireDefault(_hireFormsInput);

var _hireFormsTextarea = _dereq_("hire-forms-textarea");

var _hireFormsTextarea2 = _interopRequireDefault(_hireFormsTextarea);

var _hireFormsAutocomplete = _dereq_("hire-forms-autocomplete");

var _hireFormsAutocomplete2 = _interopRequireDefault(_hireFormsAutocomplete);

var _api = _dereq_("../../api");

var _api2 = _interopRequireDefault(_api);

var BasicInfoForm = (function () {
	function BasicInfoForm() {
		_classCallCheck(this, BasicInfoForm);
	}

	_createClass(BasicInfoForm, [{
		key: "render",
		value: function render() {
			var model = this.props.value;

			return _react2["default"].createElement(
				"ul",
				null,
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Author"
					),
					_react2["default"].createElement(_hireFormsAutocomplete2["default"], {
						async: _api2["default"].getPersons,
						onChange: this.props.onChange.bind(this, "author"),
						value: model.get("author").toJS() })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Title"
					),
					_react2["default"].createElement(_hireFormsInput2["default"], {
						onChange: this.props.onChange.bind(this, "title"),
						value: model.get("title") })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Document type"
					),
					_react2["default"].createElement(_hireFormsSelect2["default"], {
						async: _api2["default"].getDocSourceType,
						onChange: this.props.onChange.bind(this, "documentType"),
						value: model.get("documentType").toJS() })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Genre"
					),
					_react2["default"].createElement(_hireFormsSelect2["default"], {
						async: _api2["default"].getGenre,
						onChange: this.props.onChange.bind(this, "genre"),
						value: model.get("genre").toJS() })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Language"
					),
					_react2["default"].createElement(_hireFormsAutocomplete2["default"], {
						async: _api2["default"].getLanguages,
						onChange: this.props.onChange.bind(this, "language"),
						value: model.get("language").toJS() })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"First editor"
					),
					_react2["default"].createElement(_hireFormsAutocomplete2["default"], {
						async: _api2["default"].getPersons,
						onChange: this.props.onChange.bind(this, "firstEditor"),
						value: model.get("firstEditor").toJS() })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Publish location"
					),
					_react2["default"].createElement(_hireFormsAutocomplete2["default"], {
						async: _api2["default"].getLocations,
						onChange: this.props.onChange.bind(this, "publishLocation"),
						value: model.get("publishLocation").toJS() })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Date"
					),
					_react2["default"].createElement(_hireFormsInput2["default"], {
						onChange: this.props.onChange.bind(this, "date"),
						value: model.get("date") })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Reference"
					),
					_react2["default"].createElement(_hireFormsInput2["default"], {
						onChange: this.props.onChange.bind(this, "reference"),
						value: model.get("reference") })
				),
				_react2["default"].createElement(
					"li",
					null,
					_react2["default"].createElement(
						"label",
						null,
						"Notes"
					),
					_react2["default"].createElement(_hireFormsTextarea2["default"], {
						onChange: this.props.onChange.bind(this, "notes"),
						value: model.get("notes") })
				)
			);
		}
	}]);

	return BasicInfoForm;
})();

exports["default"] = (0, _hireFormsForm2["default"])(BasicInfoForm);
module.exports = exports["default"];
/* source */

},{"../../api":32,"hire-forms-autocomplete":1,"hire-forms-form":2,"hire-forms-input":3,"hire-forms-select":10,"hire-forms-textarea":11,"react":"react"}],43:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _hireTabs = _dereq_("hire-tabs");

var _hireFormsMultiForm = _dereq_("hire-forms-multi-form");

var _hireFormsMultiForm2 = _interopRequireDefault(_hireFormsMultiForm);

var _basicInfo = _dereq_("./basic-info");

var _basicInfo2 = _interopRequireDefault(_basicInfo);

var _authorLink = _dereq_("../author/link");

var _authorLink2 = _interopRequireDefault(_authorLink);

var _actionsPublication = _dereq_("../actions/publication");

var _actionsPublication2 = _interopRequireDefault(_actionsPublication);

var _storesPublication = _dereq_("../stores/publication");

var _storesPublication2 = _interopRequireDefault(_storesPublication);

var PublicationController = (function (_React$Component) {
	_inherits(PublicationController, _React$Component);

	function PublicationController(props) {
		_classCallCheck(this, PublicationController);

		_get(Object.getPrototypeOf(PublicationController.prototype), "constructor", this).call(this, props);

		this.state = _extends(_storesPublication2["default"].getState(), {
			activeTab: "Basic Info"
		});
	}

	_createClass(PublicationController, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			_storesPublication2["default"].listen(this.onStoreChange.bind(this));
		}
	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			_storesPublication2["default"].stopListening(this.onStoreChange.bind(this));
		}
	}, {
		key: "onStoreChange",
		value: function onStoreChange() {
			var state = _extends(_storesPublication2["default"].getState());
			this.setState(state);
		}
	}, {
		key: "handleTabChange",
		value: function handleTabChange(label) {
			this.setState({
				activeTab: label
			});
		}
	}, {
		key: "handleFormChange",
		value: function handleFormChange(key, value) {
			_actionsPublication2["default"].setKey(key, value);
		}
	}, {
		key: "handleFormDelete",
		value: function handleFormDelete(key) {
			_actionsPublication2["default"].deleteKey(key);
		}
	}, {
		key: "render",
		value: function render() {
			return _react2["default"].createElement(
				_hireTabs.Tabs,
				{ onChange: this.handleTabChange.bind(this) },
				_react2["default"].createElement(
					_hireTabs.Tab,
					{
						active: this.state.activeTab === "Basic Info",
						label: "Basic Info" },
					_react2["default"].createElement(_basicInfo2["default"], {
						onChange: this.handleFormChange,
						onDelete: this.handleFormDelete,
						value: this.state.publication })
				),
				_react2["default"].createElement(
					_hireTabs.Tab,
					{
						active: this.state.activeTab === "Links",
						label: "Links" },
					_react2["default"].createElement(_hireFormsMultiForm2["default"], {
						attr: "links",
						component: _authorLink2["default"],
						onChange: this.handleFormChange,
						onDelete: this.handleFormDelete,
						values: this.state.publication.get("links") })
				)
			);
		}
	}]);

	return PublicationController;
})(_react2["default"].Component);

exports["default"] = PublicationController;
module.exports = exports["default"];
/* Receptions */

},{"../actions/publication":30,"../author/link":36,"../stores/publication":48,"./basic-info":42,"hire-forms-multi-form":4,"hire-tabs":13,"react":"react"}],44:[function(_dereq_,module,exports){
// TODO Remove uncamel cased vars
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _immutable = _dereq_("immutable");

var _immutable2 = _interopRequireDefault(_immutable);

var _dispatcher = _dereq_("../dispatcher");

var _dispatcher2 = _interopRequireDefault(_dispatcher);

var _base = _dereq_("./base");

var _base2 = _interopRequireDefault(_base);

var _modelsAuthor = _dereq_("./models/author");

var _modelsAuthor2 = _interopRequireDefault(_modelsAuthor);

var _hireFormsUtils = _dereq_("hire-forms-utils");

var diffData = function diffData(receivedData) {
	var contract = _modelsAuthor2["default"].keySeq().toArray();
	// let serverContract = ["@type", "names", "gender", "birthDate", "deathDate", "types", "links", "floruit", "bibliography", "children", "fsPseudonyms", "health", "livedIn", "nationality", "notes", "personalSituation", "tempOldId", "tempBirthPlace", "tempChildren", "tempCollaborations", "tempDeathPlace", "tempDeath", "tempFinancialSituation", "tempMemberships", "tempMotherTongue", "tempName", "tempPlaceOfBirth", "tempPsChildren", "tempPseudonyms", "tempSpouse", "relatedLocations", "_id", "^rev", "^created", "^modified", "^pid", "^deleted", "@relationCount", "@properties", "@relations", "@variationRefs"];

	var receivedProps = Object.keys(receivedData);

	var addedProps = receivedProps.filter(function (prop) {
		return contract.indexOf(prop) === -1;
	});

	var removedProps = contract.filter(function (prop) {
		return receivedProps.indexOf(prop) === -1;
	});

	return {
		added: addedProps,
		removed: removedProps
	};
};

var CHANGE_EVENT = "change";

var AuthorStore = (function (_BaseStore) {
	_inherits(AuthorStore, _BaseStore);

	function AuthorStore() {
		_classCallCheck(this, AuthorStore);

		_get(Object.getPrototypeOf(AuthorStore.prototype), "constructor", this).call(this);

		this.model = _modelsAuthor2["default"];
	}

	_createClass(AuthorStore, [{
		key: "getState",
		value: function getState() {
			return {
				author: this.model
			};
		}
	}, {
		key: "setKey",
		value: function setKey(key, value) {
			key = (0, _hireFormsUtils.castArray)(key);

			// Turn an array into an Immutable.List
			if (Array.isArray(value)) {
				value = new _immutable2["default"].List(value);
			}

			// Turn a key-value object into an Immutable.Map
			if (value.hasOwnProperty("key")) {
				value = new _immutable2["default"].Map(value);
			}

			this.model = this.model.setIn(key, value);
		}
	}, {
		key: "deleteKey",
		value: function deleteKey(key) {
			this.model = this.model.deleteIn(key);
		}
	}, {
		key: "receive",
		value: function receive(data) {
			var diff = diffData(data);
			if (diff.added.length > 0 || diff.removed.length > 0) {
				console.warn("Contracts mismatch! ", diff);
			}

			this.model = this.model.merge(_immutable2["default"].fromJS(data));
			console.log(data);
		}
	}]);

	return AuthorStore;
})(_base2["default"]);

var authorStore = new AuthorStore();

var dispatcherCallback = function dispatcherCallback(payload) {
	switch (payload.action.actionType) {
		case "AUTHOR_RECEIVE":
			authorStore.receive(payload.action.data);
			break;
		case "AUTHOR_SET_KEY":
			authorStore.setKey(payload.action.key, payload.action.value);
			break;
		case "AUTHOR_DELETE_KEY":
			authorStore.deleteKey(payload.action.key);
			break;
		default:
			return;
	}

	authorStore.emit(CHANGE_EVENT);
};

authorStore.dispatcherIndex = _dispatcher2["default"].register(dispatcherCallback);

exports["default"] = authorStore;
module.exports = exports["default"];

},{"../dispatcher":39,"./base":45,"./models/author":46,"hire-forms-utils":21,"immutable":"immutable"}],45:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _events = _dereq_("events");

var CHANGE_EVENT = "change";

var BaseStore = (function (_EventEmitter) {
	_inherits(BaseStore, _EventEmitter);

	function BaseStore() {
		_classCallCheck(this, BaseStore);

		_get(Object.getPrototypeOf(BaseStore.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(BaseStore, [{
		key: "listen",
		value: function listen(callback) {
			this.addListener(CHANGE_EVENT, callback);
		}
	}, {
		key: "stopListening",
		value: function stopListening(callback) {
			this.removeListener(CHANGE_EVENT, callback);
		}
	}]);

	return BaseStore;
})(_events.EventEmitter);

exports["default"] = BaseStore;
module.exports = exports["default"];

},{"events":20}],46:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _immutable = _dereq_("immutable");

var _immutable2 = _interopRequireDefault(_immutable);

var keyValueMap = new _immutable2["default"].Map({
	key: "",
	value: ""
});

var emptyList = new _immutable2["default"].List();

exports["default"] = new _immutable2["default"].Map({
	birthDate: "",
	birthPlace: "",
	deathDate: "",
	deathPlace: "",
	education: keyValueMap,
	financials: keyValueMap,
	gender: "",
	languages: emptyList,
	maritalStatus: keyValueMap,
	names: emptyList,
	persontype: "",
	profession: keyValueMap,
	pseudonyms: emptyList,
	religion: keyValueMap,
	socialClass: keyValueMap
});
module.exports = exports["default"];

},{"immutable":"immutable"}],47:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _immutable = _dereq_("immutable");

var _immutable2 = _interopRequireDefault(_immutable);

var keyValueMap = new _immutable2["default"].Map({
	key: "",
	value: ""
});

exports["default"] = new _immutable2["default"].Map({
	author: keyValueMap,
	date: "",
	documentType: keyValueMap,
	firstEditor: keyValueMap,
	genre: keyValueMap,
	language: keyValueMap,
	links: new _immutable2["default"].List(),
	notes: "",
	publishLocation: keyValueMap,
	reference: "",
	title: ""
});
module.exports = exports["default"];

},{"immutable":"immutable"}],48:[function(_dereq_,module,exports){
// TODO Remove uncamel cased vars
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _immutable = _dereq_("immutable");

var _immutable2 = _interopRequireDefault(_immutable);

var _dispatcher = _dereq_("../dispatcher");

var _dispatcher2 = _interopRequireDefault(_dispatcher);

var _base = _dereq_("./base");

var _base2 = _interopRequireDefault(_base);

var _modelsPublication = _dereq_("./models/publication");

var _modelsPublication2 = _interopRequireDefault(_modelsPublication);

var _hireFormsUtils = _dereq_("hire-forms-utils");

var CHANGE_EVENT = "change";

var PublicationStore = (function (_BaseStore) {
	_inherits(PublicationStore, _BaseStore);

	function PublicationStore() {
		_classCallCheck(this, PublicationStore);

		_get(Object.getPrototypeOf(PublicationStore.prototype), "constructor", this).call(this);

		this.model = _modelsPublication2["default"];
	}

	_createClass(PublicationStore, [{
		key: "getState",
		value: function getState() {
			return {
				publication: this.model
			};
		}
	}, {
		key: "setKey",
		value: function setKey(key, value) {
			key = (0, _hireFormsUtils.castArray)(key);

			// Turn an array into an Immutable.List
			if (Array.isArray(value)) {
				value = new _immutable2["default"].List(value);
			}

			// Turn a key-value object into an Immutable.Map
			if (value.hasOwnProperty("key")) {
				value = new _immutable2["default"].Map(value);
			}

			this.model = this.model.setIn(key, value);
		}
	}, {
		key: "deleteKey",
		value: function deleteKey(key) {
			this.model = this.model.deleteIn(key);
		}
	}, {
		key: "receive",
		value: function receive(data) {
			this.model = _immutable2["default"].fromJS(data);
		}
	}]);

	return PublicationStore;
})(_base2["default"]);

var publicationStore = new PublicationStore();

var dispatcherCallback = function dispatcherCallback(payload) {
	switch (payload.action.actionType) {
		case "PUBLICATION_RECEIVE":
			publicationStore.receive(payload.action.data);
			break;
		case "PUBLICATION_SET_KEY":
			publicationStore.setKey(payload.action.key, payload.action.value);
			break;
		case "PUBLICATION_DELETE_KEY":
			publicationStore.deleteKey(payload.action.key);
			break;
		default:
			return;
	}

	publicationStore.emit(CHANGE_EVENT);
};

publicationStore.dispatcherIndex = _dispatcher2["default"].register(dispatcherCallback);

exports["default"] = publicationStore;
module.exports = exports["default"];

},{"../dispatcher":39,"./base":45,"./models/publication":47,"hire-forms-utils":21,"immutable":"immutable"}]},{},[40])(40)
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/home/gijs/Projects/women-writers/src/jade/faceted-search/document.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"dynamic_s_creator-placeholder\"></div><div class=\"dynamic_s_date-placeholder\"></div><div class=\"dynamic_s_origin-placeholder\"></div><div class=\"dynamic_s_language-placeholder\"></div><div class=\"dynamic_s_genre-placeholder\"></div>");;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/faceted-search/main.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"overlay\"><div><i class=\"fa fa-spinner fa-spin fa-2x\"></i></div></div><div class=\"faceted-search\"><ul class=\"facets-menu\"><li class=\"reset\"><button><i class=\"fa fa-refresh\"></i><span>Reset search</span></button></li><li class=\"switch\"><button><i class=\"fa fa-angle-double-down\"></i><span>Switch to</span></button></li><li class=\"collapse-expand\"><button><i class=\"fa fa-compress\"></i><span>Collapse facets</span></button></li></ul><div class=\"text-search-placeholder\"></div><div class=\"facets-placeholder\"></div></div>");;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/faceted-search/person.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"dynamic_s_types-placeholder\"></div><div class=\"dynamic_s_gender-placeholder\"></div><div class=\"dynamic_s_residence-placeholder\"></div><div class=\"dynamic_s_language-placeholder\"></div><div class=\"dynamic_s_birthDate-placeholder\"></div><div class=\"dynamic_s_deathDate-placeholder\"></div><div class=\"dynamic_s_birthplace-placeholder\"></div><div class=\"dynamic_s_deathplace-placeholder\"></div><div class=\"dynamic_s_collective-placeholder\"></div><div class=\"dynamic_s_religion-placeholder\"></div>");;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/faceted-search/reception-main.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"overlay\"><div><i class=\"fa fa-spinner fa-spin fa-2x\"></i></div></div><div class=\"faceted-search\"><ul class=\"facets-menu\"><li class=\"reset\"><button><i class=\"fa fa-refresh\"></i><span>Clear selection</span></button></li></ul><div class=\"facets-placeholder\"></div></div>");;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/base-field.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (field) {
buf.push("<div" + (jade.cls(['field',field.classes.join(" ")], [null,true])) + "><label>" + (jade.escape(null == (jade_interp = field.title) ? "" : jade_interp)) + "</label>");
if ( field.type == 'Array')
{
buf.push("<div class=\"value\">");
// iterate field.value
;(function(){
  var $$obj = field.value;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var v = $$obj[$index];

buf.push("<p>" + (null == (jade_interp = v) ? "" : jade_interp) + "</p>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var v = $$obj[$index];

buf.push("<p>" + (null == (jade_interp = v) ? "" : jade_interp) + "</p>");
    }

  }
}).call(this);

buf.push("</div>");
}
else
{
buf.push("<div class=\"value\">" + (null == (jade_interp = field.value) ? "" : jade_interp) + "</div>");
}
buf.push("</div>");}.call(this,"field" in locals_for_with?locals_for_with.field:typeof field!=="undefined"?field:undefined));;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/base-fieldset.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (fieldset) {
buf.push("<div" + (jade.cls(['fieldset','gridHolder',fieldset.empty ? "empty" : ""], [null,null,true])) + ">");
if ( fieldset.title)
{
buf.push("<div class=\"c4_4\"><h4 class=\"title\">" + (jade.escape(null == (jade_interp = fieldset.title) ? "" : jade_interp)) + "</h4></div>");
}
// iterate fieldset.fields
;(function(){
  var $$obj = fieldset.fields;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var field = $$obj[$index];

buf.push(null == (jade_interp = field.html) ? "" : jade_interp);
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var field = $$obj[$index];

buf.push(null == (jade_interp = field.html) ? "" : jade_interp);
    }

  }
}).call(this);

buf.push("<div class=\"clear\"></div></div>");}.call(this,"fieldset" in locals_for_with?locals_for_with.fieldset:typeof fieldset!=="undefined"?fieldset:undefined));;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/base-link.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (link) {
if ( link.external)
{
buf.push("<a" + (jade.attr("href", link.url, true, false)) + " target=\"_self\" class=\"link\">" + (jade.escape(null == (jade_interp = link.label) ? "" : jade_interp)) + "</a>");
}
else
{
buf.push("<a" + (jade.attr("href", link.url, true, false)) + " class=\"link\">" + (jade.escape(null == (jade_interp = link.label) ? "" : jade_interp)) + "</a>");
}}.call(this,"link" in locals_for_with?locals_for_with.link:typeof link!=="undefined"?link:undefined));;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/base.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (config) {
buf.push("<div class=\"container\"><div class=\"header centered\"><a" + (jade.attr("href", config.get('baseUrl'), true, false)) + " class=\"home\"><div class=\"header-logo largest-text\"><span class=\"small-caps\">NEWW</span>Women Writers</div></a><a href=\"http://www.huygens.knaw.nl/\" target=\"_self\" class=\"huygens-ing\"></a></div><div class=\"navigation\"><div class=\"centered\"><div class=\"links\"><a" + (jade.attr("href", config.get('baseUrl') + "/persons/", true, false)) + " class=\"person\">Persons</a><span class=\"add-person\">+</span><a" + (jade.attr("href", config.get('baseUrl') + "/documents/", true, false)) + " class=\"document\">Documents</a><span class=\"add-document\">+</span><a" + (jade.attr("href", config.get('baseUrl') + "/receptions/", true, false)) + " class=\"reception\">Receptions</a><a" + (jade.attr("href", config.get('baseUrl') + "/sources/", true, false)) + " class=\"source\">Sources</a><i class=\"fa fa-adjust\"></i><div class=\"user-status\"></div></div></div></div><div id=\"search\"><div class=\"persons centered\"></div><div class=\"documents centered\"></div><div class=\"receptions\"></div></div><div id=\"view\"></div></div>");}.call(this,"config" in locals_for_with?locals_for_with.config:typeof config!=="undefined"?config:undefined));;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/document/add.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (persons, languages, genres, locations) {
buf.push("<form><ul><li><label>Title</label><input type=\"text\" name=\"title\"/></li><li><label>Creator</label><select name=\"isCreatedBy\"><option></option>");
// iterate persons
;(function(){
  var $$obj = persons;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var person = $$obj[$index];

buf.push("<option" + (jade.attr("value", person.id, true, false)) + ">" + (jade.escape(null == (jade_interp = person.displayName) ? "" : jade_interp)) + "</option>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var person = $$obj[$index];

buf.push("<option" + (jade.attr("value", person.id, true, false)) + ">" + (jade.escape(null == (jade_interp = person.displayName) ? "" : jade_interp)) + "</option>");
    }

  }
}).call(this);

buf.push("</select></li><li><label>Language</label><select name=\"hasWorkLanguage\"><option></option>");
// iterate languages
;(function(){
  var $$obj = languages;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var language = $$obj[$index];

buf.push("<option" + (jade.attr("value", language.value, true, false)) + ">" + (jade.escape(null == (jade_interp = language.label) ? "" : jade_interp)) + "</option>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var language = $$obj[$index];

buf.push("<option" + (jade.attr("value", language.value, true, false)) + ">" + (jade.escape(null == (jade_interp = language.label) ? "" : jade_interp)) + "</option>");
    }

  }
}).call(this);

buf.push("</select></li><li><label>Genre</label><select name=\"hasGenre\"><option></option>");
// iterate genres
;(function(){
  var $$obj = genres;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var genre = $$obj[$index];

buf.push("<option" + (jade.attr("value", genre.value, true, false)) + ">" + (jade.escape(null == (jade_interp = genre.label) ? "" : jade_interp)) + "</option>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var genre = $$obj[$index];

buf.push("<option" + (jade.attr("value", genre.value, true, false)) + ">" + (jade.escape(null == (jade_interp = genre.label) ? "" : jade_interp)) + "</option>");
    }

  }
}).call(this);

buf.push("</select></li><li><label>Publish location</label><select name=\"hasPublishLocation\"><option></option>");
// iterate locations
;(function(){
  var $$obj = locations;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var location = $$obj[$index];

buf.push("<option" + (jade.attr("value", location.id, true, false)) + ">" + (jade.escape(null == (jade_interp = location.displayName) ? "" : jade_interp)) + "</option>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var location = $$obj[$index];

buf.push("<option" + (jade.attr("value", location.id, true, false)) + ">" + (jade.escape(null == (jade_interp = location.displayName) ? "" : jade_interp)) + "</option>");
    }

  }
}).call(this);

buf.push("</select></li><li><label>Date</label><input type=\"text\" name=\"date\"/></li></ul></form>");}.call(this,"persons" in locals_for_with?locals_for_with.persons:typeof persons!=="undefined"?persons:undefined,"languages" in locals_for_with?locals_for_with.languages:typeof languages!=="undefined"?languages:undefined,"genres" in locals_for_with?locals_for_with.genres:typeof genres!=="undefined"?genres:undefined,"locations" in locals_for_with?locals_for_with.locations:typeof locations!=="undefined"?locations:undefined));;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/document/document-search-results.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (response, sortedBy, sortableFieldsMap, config, Math, showCurated) {
buf.push("<h4>" + (jade.escape(null == (jade_interp = response.numFound + (response.numFound != 1 ? ' documents' : ' document') + ' found') ? "" : jade_interp)) + "<div class=\"order-by\"><span>Order by</span>");
if ( response.sortableFields)
{
buf.push("<select>");
if ( sortedBy)
{
buf.push("<option disabled=\"disabled\"></option>");
}
else
{
buf.push("<option disabled=\"disabled\" selected=\"selected\"></option>");
}
// iterate response.sortableFields
;(function(){
  var $$obj = response.sortableFields;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var field = $$obj[$index];

if ( sortedBy == field)
{
buf.push("<option" + (jade.attr("value", field, true, false)) + " selected=\"selected\">" + (jade.escape(null == (jade_interp = sortableFieldsMap[field] ? sortableFieldsMap[field] : field) ? "" : jade_interp)) + "</option>");
}
else
{
buf.push("<option" + (jade.attr("value", field, true, false)) + ">" + (jade.escape(null == (jade_interp = sortableFieldsMap[field] ? sortableFieldsMap[field] : field) ? "" : jade_interp)) + "</option>");
}
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var field = $$obj[$index];

if ( sortedBy == field)
{
buf.push("<option" + (jade.attr("value", field, true, false)) + " selected=\"selected\">" + (jade.escape(null == (jade_interp = sortableFieldsMap[field] ? sortableFieldsMap[field] : field) ? "" : jade_interp)) + "</option>");
}
else
{
buf.push("<option" + (jade.attr("value", field, true, false)) + ">" + (jade.escape(null == (jade_interp = sortableFieldsMap[field] ? sortableFieldsMap[field] : field) ? "" : jade_interp)) + "</option>");
}
    }

  }
}).call(this);

buf.push("</select>");
}
buf.push("</div></h4><div class=\"cursor\"><span class=\"prev\">&laquo; Previous</span><span class=\"position\">Page&nbsp;<span class=\"current\">" + (jade.escape(null == (jade_interp = 1 + (response.start / config.get('resultRows'))) ? "" : jade_interp)) + "</span>&nbsp;of&nbsp;<span class=\"total\">" + (jade.escape(null == (jade_interp = Math.ceil(response.numFound / config.get('resultRows'))) ? "" : jade_interp)) + "</span></span><div class=\"loader\"></div><span class=\"next\">Next &raquo;</span></div><ol" + (jade.attr("start", response.start + 1, true, false)) + ">");
// iterate response.refs
;(function(){
  var $$obj = response.refs;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var document = $$obj[$index];

buf.push("<li" + (jade.cls([showCurated(document) ? 'is-curated' : ''], [true])) + "><a" + (jade.attr("href", config.documentViewUrl(document.id), true, false)) + (jade.attr("title", document.data.title, true, false)) + "><div class=\"secondary-information smallest-text\"><span class=\"created-by\">" + (jade.escape(null == (jade_interp = document.data.createdBy) ? "" : jade_interp)) + "</span><span class=\"date\">" + (jade.escape(null == (jade_interp = document.data.date ? document.data.date : 'unknown') ? "" : jade_interp)) + "</span><span class=\"language\">" + (jade.escape(null == (jade_interp = document.data.language) ? "" : jade_interp)) + "</span><span class=\"publish-location\">" + (jade.escape(null == (jade_interp = document.data.publishLocation) ? "" : jade_interp)) + "</span></div><!-- if the title is too long for a single line, it will be cut off with an ellipsis--><div class=\"title\">" + (jade.escape(null == (jade_interp = document.data.title) ? "" : jade_interp)) + "</div></a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var document = $$obj[$index];

buf.push("<li" + (jade.cls([showCurated(document) ? 'is-curated' : ''], [true])) + "><a" + (jade.attr("href", config.documentViewUrl(document.id), true, false)) + (jade.attr("title", document.data.title, true, false)) + "><div class=\"secondary-information smallest-text\"><span class=\"created-by\">" + (jade.escape(null == (jade_interp = document.data.createdBy) ? "" : jade_interp)) + "</span><span class=\"date\">" + (jade.escape(null == (jade_interp = document.data.date ? document.data.date : 'unknown') ? "" : jade_interp)) + "</span><span class=\"language\">" + (jade.escape(null == (jade_interp = document.data.language) ? "" : jade_interp)) + "</span><span class=\"publish-location\">" + (jade.escape(null == (jade_interp = document.data.publishLocation) ? "" : jade_interp)) + "</span></div><!-- if the title is too long for a single line, it will be cut off with an ellipsis--><div class=\"title\">" + (jade.escape(null == (jade_interp = document.data.title) ? "" : jade_interp)) + "</div></a></li>");
    }

  }
}).call(this);

buf.push("</ol>");}.call(this,"response" in locals_for_with?locals_for_with.response:typeof response!=="undefined"?response:undefined,"sortedBy" in locals_for_with?locals_for_with.sortedBy:typeof sortedBy!=="undefined"?sortedBy:undefined,"sortableFieldsMap" in locals_for_with?locals_for_with.sortableFieldsMap:typeof sortableFieldsMap!=="undefined"?sortableFieldsMap:undefined,"config" in locals_for_with?locals_for_with.config:typeof config!=="undefined"?config:undefined,"Math" in locals_for_with?locals_for_with.Math:typeof Math!=="undefined"?Math:undefined,"showCurated" in locals_for_with?locals_for_with.showCurated:typeof showCurated!=="undefined"?showCurated:undefined));;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/document/edit.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (config, document) {
buf.push("<div class=\"centered\"><div class=\"controls\"><button class=\"btn save\"><i class=\"fa fa-check\"></i>Save</button><a" + (jade.attr("href", config.documentViewUrl(document._id), true, false)) + " class=\"btn gray cancel\"><i class=\"fa fa-times\"></i>Cancel</a></div><h1>" + (jade.escape(null == (jade_interp = document.title) ? "" : jade_interp)) + "</h1><div class=\"form\"></div><div class=\"controls bottom\"><button class=\"btn save\"><i class=\"fa fa-check\"></i>Save</button><a" + (jade.attr("href", config.documentViewUrl(document._id), true, false)) + " class=\"btn gray cancel\"><i class=\"fa fa-times\"></i>Cancel</a></div></div>");}.call(this,"config" in locals_for_with?locals_for_with.config:typeof config!=="undefined"?config:undefined,"document" in locals_for_with?locals_for_with.document:typeof document!=="undefined"?document:undefined));;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/document/view.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (showingRevision, data, isDeleted, canEdit, config, resultIndex, resultTotal, prevId, nextId, receptions, Object, modified, Date) {
buf.push("<div class=\"centered\"><div class=\"controls\">");
if ( showingRevision)
{
buf.push("<p>Showing revision " + (jade.escape(null == (jade_interp = data['^rev']) ? "" : jade_interp)) + "</p>");
}
if ( isDeleted)
{
buf.push("<div class=\"is-deleted\"><i class=\"fa fa-warning\"></i><span>This record has been deleted.</span></div>");
}
else if ( canEdit && !showingRevision)
{
buf.push("<a" + (jade.attr("href", config.editUrl(data._id), true, false)) + " class=\"edit btn green\"><i class=\"fa fa-pencil\"></i>Edit</a><button class=\"delete btn gray right\"><i class=\"fa fa-trash-o\"></i><span class=\"default\">Delete</span><span class=\"confirm\">Confirm deletion</span></button>");
}
else if ( data['^rev'] && !data['^pid'])
{
buf.push("<button class=\"btn disabled\"><i class=\"fa fa-ban\"></i>Edit</button><span class=\"processing\">This record is being processed and can not be edited right now.</span>");
}
else
{
buf.push("<!-- Something weird is going on.-->");
}
buf.push("</div><h2>" + (jade.escape(null == (jade_interp = data.title) ? "" : jade_interp)) + "</h2><div class=\"results-paging\">");
if ( resultIndex > 0)
{
buf.push("<div class=\"paging-controls smaller-text\"><span>" + (jade.escape(null == (jade_interp = resultIndex) ? "" : jade_interp)) + "&nbsp;of&nbsp;" + (jade.escape(null == (jade_interp = resultTotal) ? "" : jade_interp)) + "</span><a" + (jade.attr("href", config.viewUrl(prevId), true, false)) + (jade.attr("style", prevId ? '' : 'visibility:hidden;', true, false)) + " class=\"prev\">Prev</a><a" + (jade.attr("href", config.viewUrl(nextId), true, false)) + (jade.attr("style", nextId ? '' : 'visibility:hidden;', true, false)) + " class=\"next\">Next</a></div>");
}
buf.push("</div><h4 class=\"author\">" + (jade.escape(null == (jade_interp = data.tempCreator) ? "" : jade_interp)) + "</h4><div class=\"fieldsets\"></div><div class=\"c4_4\">");
if ( receptions && Object.keys(receptions).length)
{
buf.push("<h3>Receptions of this" + (jade.escape(null == (jade_interp = data._id.match(/^PERS/) ? ' person' : ' work') ? "" : jade_interp)) + "</h3><ul class=\"receptions\">");
// iterate receptions
;(function(){
  var $$obj = receptions;
  if ('number' == typeof $$obj.length) {

    for (var reception = 0, $$l = $$obj.length; reception < $$l; reception++) {
      var list = $$obj[reception];

buf.push("<li><h4>" + (jade.escape(null == (jade_interp = config.receptionTypeLabel(reception)) ? "" : jade_interp)) + "</h4><ul>");
// iterate list
;(function(){
  var $$obj = list;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var r = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.viewUrl(r.id), true, false)) + ">" + (jade.escape(null == (jade_interp = r.displayName) ? "" : jade_interp)) + "</a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var r = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.viewUrl(r.id), true, false)) + ">" + (jade.escape(null == (jade_interp = r.displayName) ? "" : jade_interp)) + "</a></li>");
    }

  }
}).call(this);

buf.push("</ul></li>");
    }

  } else {
    var $$l = 0;
    for (var reception in $$obj) {
      $$l++;      var list = $$obj[reception];

buf.push("<li><h4>" + (jade.escape(null == (jade_interp = config.receptionTypeLabel(reception)) ? "" : jade_interp)) + "</h4><ul>");
// iterate list
;(function(){
  var $$obj = list;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var r = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.viewUrl(r.id), true, false)) + ">" + (jade.escape(null == (jade_interp = r.displayName) ? "" : jade_interp)) + "</a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var r = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.viewUrl(r.id), true, false)) + ">" + (jade.escape(null == (jade_interp = r.displayName) ? "" : jade_interp)) + "</a></li>");
    }

  }
}).call(this);

buf.push("</ul></li>");
    }

  }
}).call(this);

buf.push("</ul>");
}
buf.push("</div>");
if ( canEdit)
{
buf.push("<div class=\"last-modified\">Last modified by user&nbsp;<span class=\"user-id\">" + (jade.escape(null == (jade_interp = modified.userId.replace(/USER0+/g, '')) ? "" : jade_interp)) + "</span>&nbsp;on&nbsp;<span class=\"time\">" + (jade.escape(null == (jade_interp = new Date(modified.timeStamp).toDateString()) ? "" : jade_interp)) + "</span></div>");
}
buf.push("</div>");}.call(this,"showingRevision" in locals_for_with?locals_for_with.showingRevision:typeof showingRevision!=="undefined"?showingRevision:undefined,"data" in locals_for_with?locals_for_with.data:typeof data!=="undefined"?data:undefined,"isDeleted" in locals_for_with?locals_for_with.isDeleted:typeof isDeleted!=="undefined"?isDeleted:undefined,"canEdit" in locals_for_with?locals_for_with.canEdit:typeof canEdit!=="undefined"?canEdit:undefined,"config" in locals_for_with?locals_for_with.config:typeof config!=="undefined"?config:undefined,"resultIndex" in locals_for_with?locals_for_with.resultIndex:typeof resultIndex!=="undefined"?resultIndex:undefined,"resultTotal" in locals_for_with?locals_for_with.resultTotal:typeof resultTotal!=="undefined"?resultTotal:undefined,"prevId" in locals_for_with?locals_for_with.prevId:typeof prevId!=="undefined"?prevId:undefined,"nextId" in locals_for_with?locals_for_with.nextId:typeof nextId!=="undefined"?nextId:undefined,"receptions" in locals_for_with?locals_for_with.receptions:typeof receptions!=="undefined"?receptions:undefined,"Object" in locals_for_with?locals_for_with.Object:typeof Object!=="undefined"?Object:undefined,"modified" in locals_for_with?locals_for_with.modified:typeof modified!=="undefined"?modified:undefined,"Date" in locals_for_with?locals_for_with.Date:typeof Date!=="undefined"?Date:undefined));;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/person/add.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<form><ul><li><label>First Name</label><input type=\"text\" name=\"first-name\"/></li><li><label>Last Name</label><input type=\"text\" name=\"last-name\"/></li><li><label>Gender</label><select name=\"gender\"><option value=\"FEMALE\">Female</option><option value=\"MALE\">Male</option><option value=\"UNKNOWN\">Unknown</option></select></li><li><label>Types</label><select name=\"types\"><option></option><option value=\"AUTHOR\">Author</option><option value=\"ARCHETYPE\">Archetype</option><option value=\"PSEUDONYM\">Pseudonym</option></select></li><li><label>Birth Date</label><input type=\"text\" name=\"birthDate\"/></li><li><label>Death Date</label><input type=\"text\" name=\"deathDate\"/></li></ul></form>");;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/person/graph.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<h5 class=\"title\">Graph for&nbsp;<span class=\"name\"></span></h5><ul></ul><svg></svg>");;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/person/name-component.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (value) {
buf.push("<span class=\"value\">" + (jade.escape(null == (jade_interp = value) ? "" : jade_interp)) + "</span><!-- span.type= type-->");}.call(this,"value" in locals_for_with?locals_for_with.value:typeof value!=="undefined"?value:undefined));;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/person/name.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (components) {
buf.push("<div class=\"name\">");
// iterate components
;(function(){
  var $$obj = components;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var component = $$obj[$index];

buf.push("<span class=\"component\">" + (null == (jade_interp = component) ? "" : jade_interp) + "</span>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var component = $$obj[$index];

buf.push("<span class=\"component\">" + (null == (jade_interp = component) ? "" : jade_interp) + "</span>");
    }

  }
}).call(this);

buf.push("</div>");}.call(this,"components" in locals_for_with?locals_for_with.components:typeof components!=="undefined"?components:undefined));;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/person/person-search-results.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (response, sortedBy, sortableFieldsMap, config, Math, showCurated) {
buf.push("<h4>" + (jade.escape(null == (jade_interp = response.numFound + (response.numFound != 1 ? ' persons' : ' person') + ' found') ? "" : jade_interp)) + "<div class=\"order-by\"><span>Order by</span>");
if ( response.sortableFields)
{
buf.push("<select>");
if ( sortedBy)
{
buf.push("<option disabled=\"disabled\"></option>");
}
else
{
buf.push("<option disabled=\"disabled\" selected=\"selected\"></option>");
}
// iterate response.sortableFields
;(function(){
  var $$obj = response.sortableFields;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var field = $$obj[$index];

if ( sortedBy == field)
{
buf.push("<option" + (jade.attr("value", field, true, false)) + " selected=\"selected\">" + (jade.escape(null == (jade_interp = sortableFieldsMap[field] ? sortableFieldsMap[field] : field) ? "" : jade_interp)) + "</option>");
}
else
{
buf.push("<option" + (jade.attr("value", field, true, false)) + ">" + (jade.escape(null == (jade_interp = sortableFieldsMap[field] ? sortableFieldsMap[field] : field) ? "" : jade_interp)) + "</option>");
}
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var field = $$obj[$index];

if ( sortedBy == field)
{
buf.push("<option" + (jade.attr("value", field, true, false)) + " selected=\"selected\">" + (jade.escape(null == (jade_interp = sortableFieldsMap[field] ? sortableFieldsMap[field] : field) ? "" : jade_interp)) + "</option>");
}
else
{
buf.push("<option" + (jade.attr("value", field, true, false)) + ">" + (jade.escape(null == (jade_interp = sortableFieldsMap[field] ? sortableFieldsMap[field] : field) ? "" : jade_interp)) + "</option>");
}
    }

  }
}).call(this);

buf.push("</select>");
}
buf.push("</div></h4><div class=\"cursor\"><span class=\"prev\">&laquo; Previous</span><span class=\"position\">Page&nbsp;<span class=\"current\">" + (jade.escape(null == (jade_interp = 1 + (response.start / config.get('resultRows'))) ? "" : jade_interp)) + "</span>&nbsp;of&nbsp;<span class=\"total\">" + (jade.escape(null == (jade_interp = Math.ceil(response.numFound / config.get('resultRows'))) ? "" : jade_interp)) + "</span></span><div class=\"loader\"></div><span class=\"next\">Next &raquo;</span></div><ol class=\"persons\">");
// iterate response.refs
;(function(){
  var $$obj = response.refs;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var person = $$obj[$index];

buf.push("<li" + (jade.cls([showCurated(person) ? 'is-curated' : ''], [true])) + "><a" + (jade.attr("href", config.personViewUrl(person.id), true, false)) + ">");
if ( person.displayName)
{
buf.push("<div class=\"name\">" + (jade.escape(null == (jade_interp = person.displayName) ? "" : jade_interp)) + "</div>");
}
else
{
buf.push("<div class=\"name\"><span class=\"empty-name\">No name provided</span></div>");
}
buf.push("<div class=\"alive\"><span class=\"from\">" + (jade.escape(null == (jade_interp = person.data.birthDate || 'unknown') ? "" : jade_interp)) + "</span>&nbsp;&ndash;&nbsp;<span class=\"to\">" + (jade.escape(null == (jade_interp = person.data.deathDate || 'unknown') ? "" : jade_interp)) + "</span></div><!-- TODO: is this the correct fieldname?-->");
if ( person.data.country)
{
buf.push("<div class=\"country\">" + (jade.escape(null == (jade_interp = person.data.country) ? "" : jade_interp)) + "</div>");
}
buf.push("</a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var person = $$obj[$index];

buf.push("<li" + (jade.cls([showCurated(person) ? 'is-curated' : ''], [true])) + "><a" + (jade.attr("href", config.personViewUrl(person.id), true, false)) + ">");
if ( person.displayName)
{
buf.push("<div class=\"name\">" + (jade.escape(null == (jade_interp = person.displayName) ? "" : jade_interp)) + "</div>");
}
else
{
buf.push("<div class=\"name\"><span class=\"empty-name\">No name provided</span></div>");
}
buf.push("<div class=\"alive\"><span class=\"from\">" + (jade.escape(null == (jade_interp = person.data.birthDate || 'unknown') ? "" : jade_interp)) + "</span>&nbsp;&ndash;&nbsp;<span class=\"to\">" + (jade.escape(null == (jade_interp = person.data.deathDate || 'unknown') ? "" : jade_interp)) + "</span></div><!-- TODO: is this the correct fieldname?-->");
if ( person.data.country)
{
buf.push("<div class=\"country\">" + (jade.escape(null == (jade_interp = person.data.country) ? "" : jade_interp)) + "</div>");
}
buf.push("</a></li>");
    }

  }
}).call(this);

buf.push("</ol>");}.call(this,"response" in locals_for_with?locals_for_with.response:typeof response!=="undefined"?response:undefined,"sortedBy" in locals_for_with?locals_for_with.sortedBy:typeof sortedBy!=="undefined"?sortedBy:undefined,"sortableFieldsMap" in locals_for_with?locals_for_with.sortableFieldsMap:typeof sortableFieldsMap!=="undefined"?sortableFieldsMap:undefined,"config" in locals_for_with?locals_for_with.config:typeof config!=="undefined"?config:undefined,"Math" in locals_for_with?locals_for_with.Math:typeof Math!=="undefined"?Math:undefined,"showCurated" in locals_for_with?locals_for_with.showCurated:typeof showCurated!=="undefined"?showCurated:undefined));;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/person/view.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (showingRevision, data, isDeleted, canEdit, config, componentsToName, Unnamed, resultIndex, resultTotal, prevId, nextId, receptions, Object, modified, Date) {
buf.push("<div class=\"centered\"><div class=\"controls\">");
if ( showingRevision)
{
buf.push("<p>Showing revision " + (jade.escape(null == (jade_interp = data['^rev']) ? "" : jade_interp)) + "</p>");
}
if ( isDeleted)
{
buf.push("<div class=\"is-deleted\"><i class=\"fa fa-warning\"></i><span>This record has been deleted.</span></div>");
}
else if ( canEdit && !showingRevision)
{
buf.push("<a" + (jade.attr("href", config.editUrl(data._id), true, false)) + " class=\"edit btn green\"><i class=\"fa fa-pencil\"></i>Edit</a><button class=\"delete btn gray right\"><i class=\"fa fa-trash-o\"></i><span class=\"default\">Delete</span><span class=\"confirm\">Confirm deletion</span></button>");
}
else if ( data['^rev'] && !data['^pid'])
{
buf.push("<button class=\"btn disabled\"><i class=\"fa fa-ban\"></i>Edit</button><span class=\"processing\">This record is being processed and can not be edited right now.</span>");
}
else
{
buf.push("<!-- Something weird is going on.-->");
}
buf.push("</div><h2>");
if ( data.names.length)
{
buf.push("<span>" + (jade.escape(null == (jade_interp = componentsToName(data.names[0].components)) ? "" : jade_interp)) + "</span>");
}
else
{
buf.push("<span><i>" + (jade.escape(null == (jade_interp = Unnamed) ? "" : jade_interp)) + "</i></span>");
}
buf.push("<a" + (jade.attr("href", config.personGraphPath(data._id), true, false)) + " class=\"network-popup-link smaller-text\"><i class=\"fa fa-share-alt\"></i>Network</a></h2><div class=\"results-paging\">");
if ( resultIndex > 0)
{
buf.push("<div class=\"paging-controls smaller-text\"><span>" + (jade.escape(null == (jade_interp = resultIndex) ? "" : jade_interp)) + "&nbsp;of&nbsp;" + (jade.escape(null == (jade_interp = resultTotal) ? "" : jade_interp)) + "</span><a" + (jade.attr("href", config.viewUrl(prevId), true, false)) + (jade.attr("style", prevId ? '' : 'visibility:hidden;', true, false)) + " class=\"prev\">Prev</a><a" + (jade.attr("href", config.viewUrl(nextId), true, false)) + (jade.attr("style", nextId ? '' : 'visibility:hidden;', true, false)) + " class=\"next\">Next</a></div>");
}
buf.push("</div><div class=\"fieldsets\"></div><div class=\"c4_4\">");
if ( receptions && Object.keys(receptions).length)
{
buf.push("<h3>Receptions of this" + (jade.escape(null == (jade_interp = data._id.match(/^PERS/) ? ' person' : ' work') ? "" : jade_interp)) + "</h3><ul class=\"receptions\">");
// iterate receptions
;(function(){
  var $$obj = receptions;
  if ('number' == typeof $$obj.length) {

    for (var reception = 0, $$l = $$obj.length; reception < $$l; reception++) {
      var list = $$obj[reception];

buf.push("<li><h4>" + (jade.escape(null == (jade_interp = config.receptionTypeLabel(reception)) ? "" : jade_interp)) + "</h4><ul>");
// iterate list
;(function(){
  var $$obj = list;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var r = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.viewUrl(r.id), true, false)) + ">" + (jade.escape(null == (jade_interp = r.displayName) ? "" : jade_interp)) + "</a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var r = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.viewUrl(r.id), true, false)) + ">" + (jade.escape(null == (jade_interp = r.displayName) ? "" : jade_interp)) + "</a></li>");
    }

  }
}).call(this);

buf.push("</ul></li>");
    }

  } else {
    var $$l = 0;
    for (var reception in $$obj) {
      $$l++;      var list = $$obj[reception];

buf.push("<li><h4>" + (jade.escape(null == (jade_interp = config.receptionTypeLabel(reception)) ? "" : jade_interp)) + "</h4><ul>");
// iterate list
;(function(){
  var $$obj = list;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var r = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.viewUrl(r.id), true, false)) + ">" + (jade.escape(null == (jade_interp = r.displayName) ? "" : jade_interp)) + "</a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var r = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.viewUrl(r.id), true, false)) + ">" + (jade.escape(null == (jade_interp = r.displayName) ? "" : jade_interp)) + "</a></li>");
    }

  }
}).call(this);

buf.push("</ul></li>");
    }

  }
}).call(this);

buf.push("</ul>");
}
buf.push("</div>");
if ( canEdit)
{
buf.push("<div class=\"last-modified\">Last modified by user&nbsp;<span class=\"user-id\">" + (jade.escape(null == (jade_interp = modified.userId.replace(/USER0+/g, '')) ? "" : jade_interp)) + "</span>&nbsp;on&nbsp;<span class=\"time\">" + (jade.escape(null == (jade_interp = new Date(modified.timeStamp).toDateString()) ? "" : jade_interp)) + "</span></div>");
}
buf.push("</div>");}.call(this,"showingRevision" in locals_for_with?locals_for_with.showingRevision:typeof showingRevision!=="undefined"?showingRevision:undefined,"data" in locals_for_with?locals_for_with.data:typeof data!=="undefined"?data:undefined,"isDeleted" in locals_for_with?locals_for_with.isDeleted:typeof isDeleted!=="undefined"?isDeleted:undefined,"canEdit" in locals_for_with?locals_for_with.canEdit:typeof canEdit!=="undefined"?canEdit:undefined,"config" in locals_for_with?locals_for_with.config:typeof config!=="undefined"?config:undefined,"componentsToName" in locals_for_with?locals_for_with.componentsToName:typeof componentsToName!=="undefined"?componentsToName:undefined,"Unnamed" in locals_for_with?locals_for_with.Unnamed:typeof Unnamed!=="undefined"?Unnamed:undefined,"resultIndex" in locals_for_with?locals_for_with.resultIndex:typeof resultIndex!=="undefined"?resultIndex:undefined,"resultTotal" in locals_for_with?locals_for_with.resultTotal:typeof resultTotal!=="undefined"?resultTotal:undefined,"prevId" in locals_for_with?locals_for_with.prevId:typeof prevId!=="undefined"?prevId:undefined,"nextId" in locals_for_with?locals_for_with.nextId:typeof nextId!=="undefined"?nextId:undefined,"receptions" in locals_for_with?locals_for_with.receptions:typeof receptions!=="undefined"?receptions:undefined,"Object" in locals_for_with?locals_for_with.Object:typeof Object!=="undefined"?Object:undefined,"modified" in locals_for_with?locals_for_with.modified:typeof modified!=="undefined"?modified:undefined,"Date" in locals_for_with?locals_for_with.Date:typeof Date!=="undefined"?Date:undefined));;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/reception/reception-selector.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<h5 class=\"reception-criteria-header\">Reception criteria</h5><div class=\"search-container\"></div>");;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/reception/search-result.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (response, excelUrl, config, relIds, shortenTitle) {
if ( response)
{
buf.push("<span class=\"found smallest-text\">" + (jade.escape(null == (jade_interp = response.numFound + ' receptions found') ? "" : jade_interp)) + "</span><a" + (jade.attr("href", excelUrl, true, false)) + " target=\"_new\" class=\"link export-to-excel smallest-text\"><i class=\"fa fa-table\"></i>Export to Excel</a><div class=\"num-rows smallest-text\"><span>Show</span><ul>");
// iterate [50, 100, 250, 500]
;(function(){
  var $$obj = [50, 100, 250, 500];
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var num = $$obj[$index];

buf.push("<li" + (jade.attr("data-result-rows", num, true, false)) + " class=\"link\">" + (jade.escape(null == (jade_interp = num) ? "" : jade_interp)) + "</li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var num = $$obj[$index];

buf.push("<li" + (jade.attr("data-result-rows", num, true, false)) + " class=\"link\">" + (jade.escape(null == (jade_interp = num) ? "" : jade_interp)) + "</li>");
    }

  }
}).call(this);

buf.push("</ul><span>results</span></div>");
if ( response['_prev'])
{
buf.push("<p" + (jade.attr("href", response['_prev'], true, false)) + " class=\"prev\">« Previous</p>");
}
if ( response['_next'])
{
buf.push("<p" + (jade.attr("href", response['_next'], true, false)) + " class=\"next\">Next »</p>");
}
if ( response.numFound > 0)
{
buf.push("<table class=\"results-table smallest-text\"><thead class=\"results-head\"><!-- TODO: Fix to no longer use 'results' (relIds), but for that to happen,--><!-- refs needs to include the source and target ids-->");
var isPerson = response.refs[0].sourceData.hasOwnProperty('birthDate');
buf.push("<tr><th class=\"results-title-header\">" + (jade.escape(null == (jade_interp = isPerson ? 'Person' : 'Document') ? "" : jade_interp)) + "</th><th class=\"results-type-header\">Type</th><th class=\"results-reception-header\">Reception</th></tr></thead><tbody" + (jade.attr("style", "counter-reset: reception-counter " + response.start, true, false)) + " class=\"results-body\">");
// iterate response.refs
;(function(){
  var $$obj = response.refs;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var ref = $$obj[$index];

buf.push("<tr><td class=\"source\"><a" + (jade.attr("href", config.viewUrl(relIds[ref.id]['^sourceId']), true, false)) + "><!-- this should be easier to check in future when source and target data have id-->");
if ( isPerson)
{
buf.push(jade.escape(null == (jade_interp = shortenTitle(ref.sourceData.name, 55)) ? "" : jade_interp));
}
else
{
buf.push(jade.escape(null == (jade_interp = shortenTitle(ref.sourceData.title, 55)) ? "" : jade_interp));
}
buf.push("</a><div class=\"secondary-information smallest-text\">");
if ( isPerson)
{
buf.push("<span class=\"lived\">" + (jade.escape(null == (jade_interp = ref.sourceData.birthDate) ? "" : jade_interp)) + "</span><span class=\"death-date\">" + (jade.escape(null == (jade_interp = ref.sourceData.deathDate) ? "" : jade_interp)) + "</span><span class=\"gender\">" + (jade.escape(null == (jade_interp = ref.sourceData.gender) ? "" : jade_interp)) + "</span><span class=\"location\">" + (jade.escape(null == (jade_interp = ref.sourceData.residenceLocation) ? "" : jade_interp)) + "</span>");
}
else
{
buf.push("<div class=\"created-by\">" + (jade.escape(null == (jade_interp = ref.sourceData.createdBy) ? "" : jade_interp)) + "</div><span class=\"publish-location\">" + (jade.escape(null == (jade_interp = ref.sourceData.publishLocation) ? "" : jade_interp)) + "</span><span class=\"language\">" + (jade.escape(null == (jade_interp = ref.sourceData.language) ? "" : jade_interp)) + "</span>");
}
buf.push("</div></td><td>" + (jade.escape(null == (jade_interp = config.receptionTypeLabel(ref.relationName)) ? "" : jade_interp)) + "</td><td class=\"reception\"><a" + (jade.attr("href", config.viewUrl(relIds[ref.id]['^targetId']), true, false)) + (jade.attr("title", ref.targetData.title, true, false)) + " class=\"reception-title\">" + (jade.escape(null == (jade_interp = shortenTitle(ref.targetData.title, 55)) ? "" : jade_interp)) + "</a><div class=\"secondary-information smallest-text\"><!-- on its own line, because often too long--><div" + (jade.attr("title", ref.targetData.createdBy, true, false)) + " class=\"created-by\">" + (jade.escape(null == (jade_interp = ref.targetData.createdBy) ? "" : jade_interp)) + "</div><span class=\"date\">" + (jade.escape(null == (jade_interp = ref.targetData.date) ? "" : jade_interp)) + "</span><span class=\"gender\">" + (jade.escape(null == (jade_interp = ref.targetData.gender) ? "" : jade_interp)) + "</span><span" + (jade.attr("title", ref.targetData.publishLocation, true, false)) + " class=\"published-in\">" + (jade.escape(null == (jade_interp = ref.targetData.publishLocation) ? "" : jade_interp)) + "</span></div></td></tr>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var ref = $$obj[$index];

buf.push("<tr><td class=\"source\"><a" + (jade.attr("href", config.viewUrl(relIds[ref.id]['^sourceId']), true, false)) + "><!-- this should be easier to check in future when source and target data have id-->");
if ( isPerson)
{
buf.push(jade.escape(null == (jade_interp = shortenTitle(ref.sourceData.name, 55)) ? "" : jade_interp));
}
else
{
buf.push(jade.escape(null == (jade_interp = shortenTitle(ref.sourceData.title, 55)) ? "" : jade_interp));
}
buf.push("</a><div class=\"secondary-information smallest-text\">");
if ( isPerson)
{
buf.push("<span class=\"lived\">" + (jade.escape(null == (jade_interp = ref.sourceData.birthDate) ? "" : jade_interp)) + "</span><span class=\"death-date\">" + (jade.escape(null == (jade_interp = ref.sourceData.deathDate) ? "" : jade_interp)) + "</span><span class=\"gender\">" + (jade.escape(null == (jade_interp = ref.sourceData.gender) ? "" : jade_interp)) + "</span><span class=\"location\">" + (jade.escape(null == (jade_interp = ref.sourceData.residenceLocation) ? "" : jade_interp)) + "</span>");
}
else
{
buf.push("<div class=\"created-by\">" + (jade.escape(null == (jade_interp = ref.sourceData.createdBy) ? "" : jade_interp)) + "</div><span class=\"publish-location\">" + (jade.escape(null == (jade_interp = ref.sourceData.publishLocation) ? "" : jade_interp)) + "</span><span class=\"language\">" + (jade.escape(null == (jade_interp = ref.sourceData.language) ? "" : jade_interp)) + "</span>");
}
buf.push("</div></td><td>" + (jade.escape(null == (jade_interp = config.receptionTypeLabel(ref.relationName)) ? "" : jade_interp)) + "</td><td class=\"reception\"><a" + (jade.attr("href", config.viewUrl(relIds[ref.id]['^targetId']), true, false)) + (jade.attr("title", ref.targetData.title, true, false)) + " class=\"reception-title\">" + (jade.escape(null == (jade_interp = shortenTitle(ref.targetData.title, 55)) ? "" : jade_interp)) + "</a><div class=\"secondary-information smallest-text\"><!-- on its own line, because often too long--><div" + (jade.attr("title", ref.targetData.createdBy, true, false)) + " class=\"created-by\">" + (jade.escape(null == (jade_interp = ref.targetData.createdBy) ? "" : jade_interp)) + "</div><span class=\"date\">" + (jade.escape(null == (jade_interp = ref.targetData.date) ? "" : jade_interp)) + "</span><span class=\"gender\">" + (jade.escape(null == (jade_interp = ref.targetData.gender) ? "" : jade_interp)) + "</span><span" + (jade.attr("title", ref.targetData.publishLocation, true, false)) + " class=\"published-in\">" + (jade.escape(null == (jade_interp = ref.targetData.publishLocation) ? "" : jade_interp)) + "</span></div></td></tr>");
    }

  }
}).call(this);

buf.push("</tbody></table>");
}
else
{
buf.push("<p>No results found</p>");
}
}}.call(this,"response" in locals_for_with?locals_for_with.response:typeof response!=="undefined"?response:undefined,"excelUrl" in locals_for_with?locals_for_with.excelUrl:typeof excelUrl!=="undefined"?excelUrl:undefined,"config" in locals_for_with?locals_for_with.config:typeof config!=="undefined"?config:undefined,"relIds" in locals_for_with?locals_for_with.relIds:typeof relIds!=="undefined"?relIds:undefined,"shortenTitle" in locals_for_with?locals_for_with.shortenTitle:typeof shortenTitle!=="undefined"?shortenTitle:undefined));;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/reception/search.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"reception-search\"><div class=\"centered query\"><div class=\"tabs smaller-text\"><div class=\"tab type\"><div class=\"text\">All receptions</div><div class=\"link\">All receptions</div></div><div class=\"tab reception\"><div class=\"text\">(all receptions)</div><div class=\"link\">(all receptions)</div></div><div class=\"tab receptee\"><div class=\"text\">All persons/works</div><div class=\"link\">All persons/works</div></div><div class=\"tab search\"><button disabled=\"disabled\" class=\"btn search-receptions\"><i class=\"fa fa-search\"></i><span class=\"s\">Search</span><span class=\"ing\">ing</span></button></div></div></div></div><div class=\"views\"><div class=\"select-type centered\"></div><div class=\"select-reception centered hidden\"></div><div class=\"select-receptee centered hidden\"></div></div><div class=\"reception-results centered\"></div>");;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/reception/source-query-builder.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<h5 class=\"search-criteria-header\">Search criteria</h5><div class=\"search-container\"></div>");;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/reception/type-selector.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (documentReceptions, config, personReceptions) {
buf.push("<div class=\"help-text smallest-text\">Select the type of reception you wish to search for\nby selecting one or more of the options in the list to right</div><div data-category=\"work\" class=\"category work\"><h5 class=\"reception-type-header reception-type-header-work\">Receptions on works</h5><ul class=\"smallest-text\">");
// iterate documentReceptions
;(function(){
  var $$obj = documentReceptions;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var type = $$obj[$index];

buf.push("<li" + (jade.attr("data-type", type.regularName, true, false)) + (jade.attr("data-type-id", type.typeId, true, false)) + "><span class=\"link\">" + (jade.escape(null == (jade_interp = config.receptionTypeLabel(type.regularName)) ? "" : jade_interp)) + "</span></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var type = $$obj[$index];

buf.push("<li" + (jade.attr("data-type", type.regularName, true, false)) + (jade.attr("data-type-id", type.typeId, true, false)) + "><span class=\"link\">" + (jade.escape(null == (jade_interp = config.receptionTypeLabel(type.regularName)) ? "" : jade_interp)) + "</span></li>");
    }

  }
}).call(this);

buf.push("</ul></div><div data-category=\"person\" class=\"category person\"><h5 class=\"reception-type-header reception-type-header-person\">Receptions on persons</h5><ul class=\"smallest-text\">");
// iterate personReceptions
;(function(){
  var $$obj = personReceptions;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var type = $$obj[$index];

buf.push("<li" + (jade.attr("data-type", type.regularName, true, false)) + (jade.attr("data-type-id", type.typeId, true, false)) + "><span class=\"link\">" + (jade.escape(null == (jade_interp = config.receptionTypeLabel(type.regularName)) ? "" : jade_interp)) + "</span></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var type = $$obj[$index];

buf.push("<li" + (jade.attr("data-type", type.regularName, true, false)) + (jade.attr("data-type-id", type.typeId, true, false)) + "><span class=\"link\">" + (jade.escape(null == (jade_interp = config.receptionTypeLabel(type.regularName)) ? "" : jade_interp)) + "</span></li>");
    }

  }
}).call(this);

buf.push("</ul></div>");}.call(this,"documentReceptions" in locals_for_with?locals_for_with.documentReceptions:typeof documentReceptions!=="undefined"?documentReceptions:undefined,"config" in locals_for_with?locals_for_with.config:typeof config!=="undefined"?config:undefined,"personReceptions" in locals_for_with?locals_for_with.personReceptions:typeof personReceptions!=="undefined"?personReceptions:undefined));;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/search-results.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (response) {
buf.push("<h4>" + (jade.escape(null == (jade_interp = response.numFound + ' results') ? "" : jade_interp)) + "</h4><ul>");
// iterate response.results
;(function(){
  var $$obj = response.results;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var result = $$obj[$index];

buf.push("<li>" + (jade.escape(null == (jade_interp = result.tempName) ? "" : jade_interp)) + "</li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var result = $$obj[$index];

buf.push("<li>" + (jade.escape(null == (jade_interp = result.tempName) ? "" : jade_interp)) + "</li>");
    }

  }
}).call(this);

buf.push("</ul>");}.call(this,"response" in locals_for_with?locals_for_with.response:typeof response!=="undefined"?response:undefined));;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/search.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"search\"></div><div class=\"results\"></div>");;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/sources/list.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (letters, sources, config) {
buf.push("<ul class=\"index\">");
// iterate letters
;(function(){
  var $$obj = letters;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var letter = $$obj[$index];

buf.push("<li" + (jade.attr("data-letter", letter, true, false)) + ">" + (jade.escape(null == (jade_interp = letter) ? "" : jade_interp)) + "</li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var letter = $$obj[$index];

buf.push("<li" + (jade.attr("data-letter", letter, true, false)) + ">" + (jade.escape(null == (jade_interp = letter) ? "" : jade_interp)) + "</li>");
    }

  }
}).call(this);

buf.push("</ul><h1>Source Index</h1>");
// iterate letters
;(function(){
  var $$obj = letters;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var letter = $$obj[$index];

buf.push("<div" + (jade.attr("data-letter", letter, true, false)) + " class=\"letter\"><h2>" + (jade.escape(null == (jade_interp = letter) ? "" : jade_interp)) + "</h2><ul>");
// iterate sources[letter]
;(function(){
  var $$obj = sources[letter];
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var source = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.sourceViewUrl(source.id), true, false)) + ">" + (jade.escape(null == (jade_interp = source.title) ? "" : jade_interp)) + "</a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var source = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.sourceViewUrl(source.id), true, false)) + ">" + (jade.escape(null == (jade_interp = source.title) ? "" : jade_interp)) + "</a></li>");
    }

  }
}).call(this);

buf.push("</ul></div>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var letter = $$obj[$index];

buf.push("<div" + (jade.attr("data-letter", letter, true, false)) + " class=\"letter\"><h2>" + (jade.escape(null == (jade_interp = letter) ? "" : jade_interp)) + "</h2><ul>");
// iterate sources[letter]
;(function(){
  var $$obj = sources[letter];
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var source = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.sourceViewUrl(source.id), true, false)) + ">" + (jade.escape(null == (jade_interp = source.title) ? "" : jade_interp)) + "</a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var source = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.sourceViewUrl(source.id), true, false)) + ">" + (jade.escape(null == (jade_interp = source.title) ? "" : jade_interp)) + "</a></li>");
    }

  }
}).call(this);

buf.push("</ul></div>");
    }

  }
}).call(this);
}.call(this,"letters" in locals_for_with?locals_for_with.letters:typeof letters!=="undefined"?letters:undefined,"sources" in locals_for_with?locals_for_with.sources:typeof sources!=="undefined"?sources:undefined,"config" in locals_for_with?locals_for_with.config:typeof config!=="undefined"?config:undefined));;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/status.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"loading box\"><h1>Please wait...</h1></div><div class=\"error box\"><h1><i class=\"fa fa-warning\"></i><span class=\"title\">Error</span></h1><div class=\"message\">I'm very sorry, but it seems an error has occurred:</div><code class=\"error-message\"></code><button type=\"button\" class=\"btn ok\">OK</button></div><div class=\"success box\"><h1><i class=\"fa fa-check\"></i><span class=\"title\">Success!</span></h1></div>");;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/home/gijs/Projects/women-writers/src/jade/views/user-status.jade":[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (username) {
buf.push("<a href=\"#\" class=\"login\">Login</a><div class=\"loader\">Logging in</div><span><span class=\"label\">Logged in as&nbsp;</span><span class=\"user-name\">" + (jade.escape(null == (jade_interp = username ? username : 'unknown') ? "" : jade_interp)) + "</span></span>");}.call(this,"username" in locals_for_with?locals_for_with.username:typeof username!=="undefined"?username:undefined));;return buf.join("");
};
},{"jade/runtime":"/home/gijs/Projects/women-writers/node_modules/jade/runtime.js"}],"/usr/local/lib/node_modules/funcky.el/dist/index.js":[function(require,module,exports){
(function() {
  module.exports = {
    el: function(el) {
      return {
        closest: function(selector) {
          var getMatcher, isMatch, matcher;
          getMatcher = function(el) {
            return el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
          };
          while (el) {
            matcher = getMatcher(el);
            if (matcher != null) {
              isMatch = matcher.bind(el)(selector);
              if (isMatch) {
                return el;
              }
            }
            el = el.parentNode;
          }
        },

        /*
        		Native alternative to jQuery's $.offset()
        
        		http://www.quirksmode.org/js/findpos.html
         */
        position: function(parent) {
          var left, loopEl, top;
          if (parent == null) {
            parent = document.body;
          }
          left = 0;
          top = 0;
          loopEl = el;
          while ((loopEl != null) && loopEl !== parent) {
            if (this.hasDescendant(parent)) {
              break;
            }
            left += loopEl.offsetLeft;
            top += loopEl.offsetTop;
            loopEl = loopEl.offsetParent;
          }
          return {
            left: left,
            top: top
          };
        },
        boundingBox: function() {
          var box;
          box = this.position();
          box.width = el.clientWidth;
          box.height = el.clientHeight;
          box.right = box.left + box.width;
          box.bottom = box.top + box.height;
          return box;
        },

        /*
        		Is child el a descendant of parent el?
        
        		http://stackoverflow.com/questions/2234979/how-to-check-in-javascript-if-one-element-is-a-child-of-another
         */
        hasDescendant: function(child) {
          var node;
          node = child.parentNode;
          while (node != null) {
            if (node === el) {
              return true;
            }
            node = node.parentNode;
          }
          return false;
        },
        insertAfter: function(referenceElement) {
          return referenceElement.parentNode.insertBefore(el, referenceElement.nextSibling);
        },
        hasScrollBar: function(el) {
          return hasScrollBarX(el) || hasScrollBarY(el);
        },
        hasScrollBarX: function(el) {
          return el.scrollWidth > el.clientWidth;
        },
        hasScrollBarY: function(el) {
          return el.scrollHeight > el.clientHeight;
        },
        inViewport: function(parent) {
          var doc, rect, win;
          win = parent != null ? parent : window;
          doc = parent != null ? parent : document.documentElement;
          rect = el.getBoundingClientRect();
          return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (win.innerHeight || doc.clientHeight) && rect.right <= (win.innerWidth || doc.clientWidth);
        }
      };
    }
  };

}).call(this);

},{}],"/usr/local/lib/node_modules/funcky.req/dist/main.js":[function(require,module,exports){
(function() {
  var __hasProp = {}.hasOwnProperty;

  module.exports = {
    get: function(url, options) {
      if (options == null) {
        options = {};
      }
      return this._sendRequest('GET', url, options);
    },
    post: function(url, options) {
      if (options == null) {
        options = {};
      }
      return this._sendRequest('POST', url, options);
    },
    put: function(url, options) {
      if (options == null) {
        options = {};
      }
      return this._sendRequest('PUT', url, options);
    },
    _promise: function() {
      return {
        done: function(fn) {
          return this.callDone = fn;
        },
        callDone: null,
        fail: function(fn) {
          return this.callFail = fn;
        },
        callFail: null,
        always: function(fn) {
          return this.callAlways = fn;
        },
        callAlways: null
      };
    },
    _sendRequest: function(method, url, options) {
      var header, promise, value, xhr, _ref;
      if (options == null) {
        options = {};
      }
      promise = this._promise();
      if (options.headers == null) {
        options.headers = {};
      }
      xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        var _ref;
        if (xhr.readyState === 4) {
          if (promise.callAlways != null) {
            promise.callAlways(xhr);
          }
          if ((200 <= (_ref = xhr.status) && _ref <= 206) || xhr.status === 1223) {
            if (promise.callDone != null) {
              return promise.callDone(xhr);
            }
          } else {
            if (promise.callFail != null) {
              return promise.callFail(xhr);
            }
          }
        }
      };
      xhr.open(method, url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      _ref = options.headers;
      for (header in _ref) {
        if (!__hasProp.call(_ref, header)) continue;
        value = _ref[header];
        xhr.setRequestHeader(header, value);
      }
      xhr.send(options.data);
      return promise;
    }
  };

}).call(this);

},{}]},{},["./src/coffee/main.coffee"]);
