(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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



},{"./app":37,"./config":40,"./helpers/load-app-data":42,"./helpers/load-edit-data":43,"./helpers/search":45,"./routers/main":50,"backbone":undefined,"hibb-login":3,"jquery":undefined}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
(function(){module.exports={generateID:function(t){var n,r;for(t=null!=t&&t>0?t-1:7,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",r=n.charAt(Math.floor(52*Math.random()));t--;)r+=n.charAt(Math.floor(Math.random()*n.length));return r},setResetTimeout:function(){var t;return t=null,function(n,r,e){return null!=t&&(null!=e&&e(),clearTimeout(t)),t=setTimeout(function(){return t=null,r()},n)}}()}}).call(this);
},{}],6:[function(require,module,exports){
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



},{"../models/facets/list.option.coffee":13,"backbone":undefined,"underscore":undefined}],7:[function(require,module,exports){
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



},{"../models/searchresult":18,"backbone":undefined,"funcky.req":100,"underscore":undefined}],8:[function(require,module,exports){
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



},{"backbone":undefined}],9:[function(require,module,exports){
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



},{"../jade/main.jade":34,"./collections/searchresults":7,"./config":8,"./models/query-options":16,"./views/facets":19,"./views/text-search":26,"backbone":undefined,"funcky.el":99,"jquery":undefined,"underscore":undefined}],10:[function(require,module,exports){
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



},{"./main":14}],11:[function(require,module,exports){




},{}],12:[function(require,module,exports){
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



},{"./main":14}],13:[function(require,module,exports){
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



},{"backbone":undefined}],14:[function(require,module,exports){
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



},{"../../config":8,"backbone":undefined}],15:[function(require,module,exports){
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



},{"./main":14,"underscore":undefined}],16:[function(require,module,exports){
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



},{"../config":8,"backbone":undefined,"underscore":undefined}],17:[function(require,module,exports){
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



},{"backbone":undefined,"underscore":undefined}],18:[function(require,module,exports){
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



},{"../config":8,"backbone":undefined,"underscore":undefined}],19:[function(require,module,exports){
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



},{"./facets/boolean":20,"./facets/date":21,"./facets/list":22,"./facets/range":25,"backbone":undefined,"underscore":undefined}],20:[function(require,module,exports){
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



},{"../../../jade/facets/boolean.body.jade":27,"../../models/facets/boolean":10,"./main":24,"jquery":undefined,"underscore":undefined}],21:[function(require,module,exports){
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



},{"../../../jade/facets/date.jade":28,"../../models/facets/date":11,"./main":24}],22:[function(require,module,exports){
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



},{"../../../jade/facets/list.menu.jade":30,"../../collections/list.options":6,"../../models/facets/list":12,"./list.options":23,"./main":24,"jquery":undefined,"underscore":undefined}],23:[function(require,module,exports){
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



},{"../../../jade/facets/list.body.jade":29,"../../../jade/facets/list.option.jade":31,"../../models/facets/list":12,"backbone":undefined,"funcky.util":5,"jquery":undefined,"underscore":undefined}],24:[function(require,module,exports){
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



},{"../../../jade/facets/main.jade":32,"backbone":undefined,"jquery":undefined,"underscore":undefined}],25:[function(require,module,exports){
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



},{"../../../jade/facets/range.body.jade":33,"../../models/facets/range":15,"./main":24,"jquery":undefined,"underscore":undefined}],26:[function(require,module,exports){
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



},{"../../jade/text-search.jade":35,"../models/search":17,"backbone":undefined,"underscore":undefined}],27:[function(require,module,exports){
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
},{"jade/runtime":36}],28:[function(require,module,exports){
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
},{"jade/runtime":36}],29:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<ul></ul>");;return buf.join("");
};
},{"jade/runtime":36}],30:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<input type=\"checkbox\" name=\"all\"/><input type=\"text\" name=\"filter\" placeholder=\"Filter options...\"/><small class=\"optioncount\"></small>");;return buf.join("");
};
},{"jade/runtime":36}],31:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (option) {
buf.push("<li" + (jade.attr("data-count", option.get('count'), true, false)) + (jade.attr("data-value", option.id, true, false)) + (jade.attr("data-state", option.get('checked') ? 'checked' : 'unchecked', true, false)) + "><i" + (jade.attr("data-value", option.id, true, false)) + (jade.cls(['unchecked','fa','fa-square-o',option.get('checked')?'hidden':'visible'], [null,null,null,true])) + "></i><i" + (jade.attr("data-value", option.id, true, false)) + (jade.cls(['checked','fa','fa-check-square-o',option.get('checked')?'visible':'hidden'], [null,null,null,true])) + "></i><label" + (jade.attr("data-value", option.id, true, false)) + ">" + (null == (jade_interp = option.id === ':empty' ? '<em>(empty)</em>' : option.id) ? "" : jade_interp) + "</label><div class=\"count\">" + (jade.escape(null == (jade_interp = option.get('count') === 0 ? option.get('total') : option.get('count')) ? "" : jade_interp)) + "</div></li>");}.call(this,"option" in locals_for_with?locals_for_with.option:typeof option!=="undefined"?option:undefined));;return buf.join("");
};
},{"jade/runtime":36}],32:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (title) {
buf.push("<header><h3>" + (jade.escape(null == (jade_interp = title) ? "" : jade_interp)) + "</h3><div class=\"menu\"><i title=\"Filter options\" class=\"filter fa fa-filter\"></i><i title=\"Sort alphabetically\" class=\"alpha fa fa-sort-alpha-asc\"></i><i title=\"Sort numerically\" class=\"amount active fa fa-sort-amount-desc\"></i></div><div class=\"options\"></div></header><div class=\"body\"></div>");}.call(this,"title" in locals_for_with?locals_for_with.title:typeof title!=="undefined"?title:undefined));;return buf.join("");
};
},{"jade/runtime":36}],33:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (options) {
buf.push("<div class=\"slider\"><span class=\"dash\">-</span><div class=\"handle-min handle\"><input" + (jade.attr("value", options.lowerLimit, true, false)) + " disabled=\"disabled\" class=\"min\"/></div><div class=\"handle-max handle\"><input" + (jade.attr("value", options.upperLimit, true, false)) + " disabled=\"disabled\" class=\"max\"/></div><div class=\"bar\">&nbsp;</div><button>Search?</button></div>");}.call(this,"options" in locals_for_with?locals_for_with.options:typeof options!=="undefined"?options:undefined));;return buf.join("");
};
},{"jade/runtime":36}],34:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"overlay\"><div><i class=\"fa fa-spinner fa-spin fa-2x\"></i></div></div><div class=\"faceted-search\"><div class=\"text-search-placeholder\"></div><ul class=\"facets-menu\"><li class=\"reset\"><button><i class=\"fa fa-refresh\"></i><span>Reset search</span></button></li><li class=\"switch\"><button><i class=\"fa fa-angle-double-down\"></i><span>Switch to</span></button></li><li class=\"collapse-expand\"><button><i class=\"fa fa-compress\"></i><span>Collapse facets</span></button></li></ul><div class=\"facets-placeholder\"></div></div>");;return buf.join("");
};
},{"jade/runtime":36}],35:[function(require,module,exports){
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
},{"jade/runtime":36}],36:[function(require,module,exports){
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
},{}],37:[function(require,module,exports){
var $, App, Backbone, Document, DocumentForm, DocumentSearchView, DocumentView, Modal, Person, PersonForm, PersonGraphView, PersonSearchView, PersonView, ReceptionSearchView, SourceList, UserStatusView, addDocumentTpl, addPersonTpl, baseTemplate, config, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

Backbone = require('backbone');

$ = require('jquery');

_ = require('underscore');

baseTemplate = require('../jade/views/base.jade');

config = require('./config');

UserStatusView = require('./views/user-status');

Person = require('./models/person');

PersonForm = require('./views/person/edit');

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
        var modal, rhtml;
        rhtml = addDocumentTpl({
          genres: _.sortBy(config.get("genres"), "label"),
          languages: _.sortBy(config.get("languages"), "label"),
          persons: _.sortBy(config.get("persons"), "displayName"),
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
              var field, jqXHRs, relationName, _i, _len, _ref;
              jqXHRs = [];
              _ref = ["isCreatedBy", "hasWorkLanguage", "hasGenre", "hasPublishLocation"];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                relationName = _ref[_i];
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
    var person;
    person = new Person({
      _id: id
    });
    person.fetch().done((function(_this) {
      return function() {
        var view;
        view = new PersonForm({
          model: person
        });
        return _this.switchView(view);
      };
    })(this));
    return this.showView();
  };

  App.prototype.showDocumentForm = function(id) {
    var document;
    document = new Document({
      _id: id
    });
    document.fetch().done((function(_this) {
      return function() {
        var view;
        view = new DocumentForm({
          model: document
        });
        return _this.switchView(view);
      };
    })(this));
    return this.showView();
  };

  App.prototype.showPersonSearch = function() {
    var _ref, _ref1;
    if (this.personSearch == null) {
      this.personSearch = new PersonSearchView({
        el: '#search .persons'
      });
    }
    this.showSearch();
    if ((_ref = this.documentSearch) != null) {
      _ref.$el.fadeOut(75);
    }
    if ((_ref1 = this.receptionSearch) != null) {
      _ref1.$el.fadeOut(75);
    }
    return this.personSearch.$el.fadeIn(75);
  };

  App.prototype.showDocumentSearch = function() {
    var _ref, _ref1;
    if (this.documentSearch == null) {
      this.documentSearch = new DocumentSearchView({
        el: '#search .documents'
      });
    }
    this.showSearch();
    if ((_ref = this.personSearch) != null) {
      _ref.$el.fadeOut(75);
    }
    if ((_ref1 = this.receptionSearch) != null) {
      _ref1.$el.fadeOut(75);
    }
    return this.documentSearch.$el.fadeIn(75);
  };

  App.prototype.showReceptionSearch = function() {
    var _ref, _ref1;
    if (this.receptionSearch == null) {
      this.receptionSearch = new ReceptionSearchView({
        el: '#search .receptions'
      });
    }
    this.showSearch();
    if ((_ref = this.personSearch) != null) {
      _ref.$el.fadeOut(75);
    }
    if ((_ref1 = this.documentSearch) != null) {
      _ref1.$el.fadeOut(75);
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
        var p, pseudonym, pseudonymsLoaded, view, _ref;
        if ('hasPseudonym' in person.get('@relations')) {
          person.set({
            pseudonyms: {}
          });
          pseudonymsLoaded = (function() {
            var _i, _len, _ref, _results;
            _ref = person.get('@relations').hasPseudonym;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              p = _ref[_i];
              pseudonym = new Person({
                _id: p.id
              });
              _results.push(pseudonym.fetch());
            }
            return _results;
          })();
          return (_ref = Backbone.$).when.apply(_ref, pseudonymsLoaded).done(function() {
            var r, results, view, _i, _len, _ref, _ref1;
            results = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            for (_i = 0, _len = results.length; _i < _len; _i++) {
              r = results[_i];
              pseudonym = r[0];
              if (pseudonym != null ? (_ref = pseudonym['@relations']) != null ? (_ref1 = _ref['isCreatorOf']) != null ? _ref1.length : void 0 : void 0 : void 0) {
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
    var _ref;
    if ((_ref = this.currentView) != null) {
      _ref.remove();
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



},{"../jade/views/base.jade":77,"../jade/views/document/add.jade":78,"../jade/views/person/add.jade":82,"./config":40,"./models/document":47,"./models/person":49,"./views/document/edit":53,"./views/document/search":54,"./views/document/view":55,"./views/person/edit":56,"./views/person/graph":57,"./views/person/search":58,"./views/person/view":59,"./views/reception/search":63,"./views/sources/view":65,"./views/user-status":67,"backbone":undefined,"hibb-modal":4,"jquery":undefined,"underscore":undefined}],38:[function(require,module,exports){
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



},{}],39:[function(require,module,exports){
module.exports = {
  "baseUrl": "https://acc.resources.huygens.knaw.nl/womenwriters/api",
  "searchPath": "/v1/search",
  "facetedSearchBaseUrl": "https://acc.resources.huygens.knaw.nl/womenwriters/api",
  "tokenPrefix": "womenwriters",
  "relationSearchPath": "/search/relations",
  "receptionsPath": "/system/vres/",
  "userInfoPath": "/system/users/me"
};



},{}],40:[function(require,module,exports){
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



},{"./base":38,"./env":39,"backbone":undefined,"underscore":undefined}],41:[function(require,module,exports){
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



},{"../../jade/views/base-link.jade":76,"../../jade/views/person/name-component.jade":85,"../../jade/views/person/name.jade":86,"../config":40}],42:[function(require,module,exports){
var $, Backbone, config, loadPromise, loadedReceptions, loadedSourceCategories, loadedSources, searchQuery;

Backbone = require('backbone');

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



},{"../config":40,"./search":45,"backbone":undefined,"jquery":undefined}],43:[function(require,module,exports){
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



},{"../config":40,"./search":45,"backbone":undefined,"jquery":undefined}],44:[function(require,module,exports){
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



},{"../config":40,"backbone":undefined}],45:[function(require,module,exports){
var Backbone, FacetedSearch, config, createFacetedSearch, escapeTerm, facetPlaceholderList, facetedSearchMainTemplate, searchLocation, searchQuery, simpleSearch;

Backbone = require('backbone');

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



},{"../../jade/faceted-search/main.jade":71,"../config":40,"backbone":undefined,"huygens-faceted-search/src/coffee/main":9}],46:[function(require,module,exports){
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



},{"backbone":undefined}],47:[function(require,module,exports){
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



},{"../config":40,"./base":46,"jquery":undefined}],48:[function(require,module,exports){
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



},{"backbone":undefined}],49:[function(require,module,exports){
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



},{"../config":40,"./base":46}],50:[function(require,module,exports){
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



},{"backbone":undefined,"underscore":undefined}],51:[function(require,module,exports){
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



},{"../../jade/views/search-results.jade":94,"../../jade/views/search.jade":95,"../config":40,"../helpers/search.coffee":45,"backbone":undefined,"hibb-login":3,"underscore":undefined}],52:[function(require,module,exports){
var Backbone, BaseView, LoginComponent, niceify, slugify,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

Backbone = require('backbone');

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



},{"../../jade/views/base-field.jade":74,"../../jade/views/base-fieldset.jade":75,"../config":40,"backbone":undefined,"hibb-login":3}],53:[function(require,module,exports){
var Backbone, Document, DynamicInverseRelationTypeHelper, DynamicRelationTypeHelper, Form, LoginComponent, StatusIndicator, config, createTimbuctooSchema, documentDescription, searchLocation, simpleSearch, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

config = require('../../config');

documentDescription = require('../../../data/metadata/wwdocument.json');

Form = require('timbuctoo-edit-forms/src/coffee/views/form.coffee');

StatusIndicator = require('../status');

_ref = require('../../helpers/search'), simpleSearch = _ref.simpleSearch, searchLocation = _ref.searchLocation;

DynamicRelationTypeHelper = require('timbuctoo-edit-forms/src/coffee/helpers/dynamic-relation-type-helper');

DynamicInverseRelationTypeHelper = require('timbuctoo-edit-forms/src/coffee/helpers/dynamic-inverse-relation-type-helper');

createTimbuctooSchema = require('timbuctoo-edit-forms/src/coffee/helpers.coffee').createTimbuctooSchema;

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



},{"../../../data/metadata/wwdocument.json":68,"../../../jade/views/document/edit.jade":80,"../../config":40,"../../helpers/search":45,"../status":66,"backbone":undefined,"hibb-login":3,"timbuctoo-edit-forms/src/coffee/helpers.coffee":108,"timbuctoo-edit-forms/src/coffee/helpers/dynamic-inverse-relation-type-helper":109,"timbuctoo-edit-forms/src/coffee/helpers/dynamic-relation-type-helper":110,"timbuctoo-edit-forms/src/coffee/views/form.coffee":114}],54:[function(require,module,exports){
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



},{"../../../jade/faceted-search/document.jade":70,"../../../jade/views/document/document-search-results.jade":79,"../../config":40,"../base-search.coffee":51,"backbone":undefined}],55:[function(require,module,exports){
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



},{"../../../jade/views/document/view.jade":81,"../../config":40,"../../helpers/base-view-helper":41,"../base-view":52}],56:[function(require,module,exports){
var Backbone, DynamicInverseRelationTypeHelper, DynamicRelationTypeHelper, Form, LoginComponent, Person, StatusIndicator, config, createTimbuctooSchema, onlyRealPeople, personDescription, searchLocation, searchQuery, simpleSearch, _, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

config = require('../../config');

personDescription = require('../../../data/metadata/wwperson.json');

Form = require('timbuctoo-edit-forms/src/coffee/views/form.coffee');

StatusIndicator = require('../status');

createTimbuctooSchema = require('timbuctoo-edit-forms/src/coffee/helpers.coffee').createTimbuctooSchema;

_ref = require('../../helpers/search'), searchQuery = _ref.searchQuery, simpleSearch = _ref.simpleSearch, searchLocation = _ref.searchLocation;

DynamicRelationTypeHelper = require('timbuctoo-edit-forms/src/coffee/helpers/dynamic-relation-type-helper');

DynamicInverseRelationTypeHelper = require('timbuctoo-edit-forms/src/coffee/helpers/dynamic-inverse-relation-type-helper');

onlyRealPeople = ['AUTHOR', 'ARCHETYPE', '(empty)'];

LoginComponent = require('hibb-login');

Person = (function(_super) {
  __extends(Person, _super);

  function Person() {
    return Person.__super__.constructor.apply(this, arguments);
  }

  Person.prototype.className = 'person-edit';

  Person.prototype.template = require('../../../jade/views/person/edit.jade');

  Person.prototype.relationTypes = ['hasBirthPlace', 'hasDeathPlace', 'hasResidenceLocation', 'hasEducation', 'hasFinancialSituation', 'hasMaritalStatus', 'isSpouseOf', 'hasPseudonym', 'hasProfession', 'hasReligion', 'hasSocialClass', 'isCreatorOf', 'isCollaboratorOf', 'isMemberOf', 'isPseudonymOf'];

  Person.prototype.events = {
    'click .save': 'save'
  };

  Person.prototype.initialize = function() {
    if (this.model != null) {
      this.render();
    }
    return this.model.on('sync', (function(_this) {
      return function() {
        return _this.render();
      };
    })(this));
  };

  Person.prototype.save = function() {
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
              return config.router().navigate(config.personViewPath(_this.model.id), {
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

  Person.prototype.render = function() {
    var relationType, schema, type, _i, _len, _ref1;
    this.$el.html(this.template({
      config: config,
      person: this.model.attributes
    }));
    schema = createTimbuctooSchema(personDescription, {
      exclude: [/^[_@^]/, 'DELETED', 'ID', 'PID', 'ROLES', 'VARIATIONS'],
      readonly: [/^temp/]
    });
    _.extend(schema['gender'], {
      options: schema['gender'].options.map(function(o) {
        return {
          val: o,
          label: config.mapGenderOption(o)
        };
      })
    });
    _ref1 = this.relationTypes;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      type = _ref1[_i];
      relationType = config.get('personRelationTypes')[type];
      schema["timbuctoo-relation." + type] = {
        type: 'Relation',
        relationTypeDescription: {
          relationTypeVariation: config.get('relationTypeVariation'),
          typeId: relationType._id,
          baseSourceType: relationType.sourceTypeName,
          baseTargetType: relationType.targetTypeName
        }
      };
    }
    _.extend(schema['timbuctoo-relation.hasBirthPlace'], {
      title: 'Birth place',
      options: config.get('locations'),
      autocomplete: function(value) {
        return searchLocation(value);
      },
      relationTypeHelper: new DynamicRelationTypeHelper(),
      onlyOne: true,
      placeholderString: 'Location'
    });
    _.extend(schema['timbuctoo-relation.hasResidenceLocation'], {
      title: 'Lived in',
      options: config.get('locations'),
      autocomplete: function(value) {
        return searchLocation(value);
      },
      relationTypeHelper: new DynamicRelationTypeHelper(),
      placeholderString: 'Location'
    });
    _.extend(schema['timbuctoo-relation.hasDeathPlace'], {
      title: 'Death place',
      options: config.get('locations'),
      autocomplete: function(value) {
        return searchLocation(value);
      },
      relationTypeHelper: new DynamicRelationTypeHelper(),
      onlyOne: true,
      placeholderString: 'Location'
    });
    _.extend(schema['timbuctoo-relation.hasEducation'], {
      title: 'Education',
      options: config.get('educations'),
      relationTypeHelper: new DynamicRelationTypeHelper()
    });
    _.extend(schema['timbuctoo-relation.hasFinancialSituation'], {
      title: 'Financials',
      options: config.get('financialSituations'),
      relationTypeHelper: new DynamicRelationTypeHelper()
    });
    _.extend(schema['timbuctoo-relation.hasMaritalStatus'], {
      title: 'Marital status',
      options: config.get('maritalStatuses'),
      relationTypeHelper: new DynamicRelationTypeHelper()
    });
    _.extend(schema['timbuctoo-relation.hasProfession'], {
      title: 'Profession',
      options: config.get('professions'),
      relationTypeHelper: new DynamicRelationTypeHelper()
    });
    _.extend(schema['timbuctoo-relation.hasReligion'], {
      title: 'Religion',
      options: config.get('religions'),
      relationTypeHelper: new DynamicRelationTypeHelper()
    });
    _.extend(schema['timbuctoo-relation.hasSocialClass'], {
      title: 'Social class',
      options: config.get('socialClasses'),
      relationTypeHelper: new DynamicRelationTypeHelper()
    });
    _.extend(schema['timbuctoo-relation.isMemberOf'], {
      title: 'Memberships',
      options: config.get('collectives'),
      autocomplete: function(value) {
        return simpleSearch(value, 'wwcollective');
      },
      relationTypeHelper: new DynamicRelationTypeHelper(),
      placeholderString: 'Collective'
    });
    _.extend(schema['timbuctoo-relation.isCollaboratorOf'], {
      title: 'Collaborations',
      autocomplete: function(value) {
        return simpleSearch(value, 'wwperson', 500);
      },
      relationTypeHelper: new DynamicRelationTypeHelper(),
      placeholderString: 'Person'
    });
    _.extend(schema['timbuctoo-relation.isCreatorOf'], {
      title: 'Is creator of',
      options: config.get('documents'),
      autocomplete: function(value) {
        return simpleSearch(value, 'wwdocument');
      },
      relationTypeHelper: new DynamicInverseRelationTypeHelper(),
      placeholderString: 'Work'
    });
    _.extend(schema['timbuctoo-relation.hasPseudonym'], {
      title: 'Has pseudonym',
      autocomplete: function(value) {
        return simpleSearch(value, 'wwperson', 500);
      },
      relationTypeHelper: new DynamicInverseRelationTypeHelper(),
      placeholderString: 'Pseudonym'
    });
    _.extend(schema['timbuctoo-relation.isPseudonymOf'], {
      title: 'Is pseudonym of',
      autocomplete: function(value) {
        return simpleSearch(value, 'wwperson', 500);
      },
      relationTypeHelper: new DynamicRelationTypeHelper(),
      placeholderString: 'Person'
    });
    _.extend(schema['timbuctoo-relation.isSpouseOf'], {
      title: 'Is spouse of',
      autocomplete: function(value) {
        return simpleSearch(value, 'wwperson', 500);
      },
      relationTypeHelper: new DynamicRelationTypeHelper(),
      placeholderString: 'Person'
    });
    schema.notes.type = 'TextArea';
    schema.personalSituation.type = 'TextArea';
    schema['birthDate'].validators = ['datable'];
    schema['deathDate'].validators = ['datable'];
    this.form = new Form({
      className: 'timbuctoo-form',
      authToken: LoginComponent.getUser().getToken(),
      VRE_ID: config.get('VRE_ID'),
      relationsUrl: config.relationsUrl(),
      model: this.model,
      schema: schema,
      fieldsets: [
        {
          fields: ['tempOldId', 'tempName', 'tempSpouse', 'names', 'gender', 'types', 'tempPseudonyms', 'timbuctoo-relation.hasPseudonym', 'timbuctoo-relation.isPseudonymOf']
        }, {
          legend: 'Notes',
          collapsed: false,
          fields: ['notes']
        }, {
          legend: 'Personal situation',
          collapsed: false,
          fields: ['personalSituation']
        }, {
          legend: 'Dates and Places',
          collapsed: true,
          fields: ['birthDate', 'deathDate', 'tempBirthPlace', 'tempPlaceOfBirth', 'timbuctoo-relation.hasBirthPlace', 'timbuctoo-relation.hasResidenceLocation', 'tempDeathPlace', 'timbuctoo-relation.hasDeathPlace', 'nationality']
        }, {
          legend: 'Personal',
          collapsed: true,
          fields: ['timbuctoo-relation.hasMaritalStatus', 'tempSpouse', 'timbuctoo-relation.isSpouseOf', 'tempChildren', 'tempPsChildren', 'children', 'timbuctoo-relation.hasSocialClass', 'timbuctoo-relation.hasEducation', 'timbuctoo-relation.hasReligion', 'health']
        }, {
          legend: 'Public',
          collapsed: true,
          fields: ['tempFinancialSituation', 'timbuctoo-relation.hasProfession', 'tempCollaborations', 'timbuctoo-relation.isCollaboratorOf', 'timbuctoo-relation.hasFinancialSituation', 'tempMemberships', 'timbuctoo-relation.isMemberOf']
        }, {
          legend: 'Other',
          collapsed: true,
          fields: ['bibliography', 'links']
        }, {
          legend: 'Works',
          collapsed: true,
          fields: ['timbuctoo-relation.isCreatorOf']
        }
      ]
    });
    return this.$('.form').html(this.form.el);
  };

  return Person;

})(Backbone.View);

module.exports = Person;



},{"../../../data/metadata/wwperson.json":69,"../../../jade/views/person/edit.jade":83,"../../config":40,"../../helpers/search":45,"../status":66,"backbone":undefined,"hibb-login":3,"timbuctoo-edit-forms/src/coffee/helpers.coffee":108,"timbuctoo-edit-forms/src/coffee/helpers/dynamic-inverse-relation-type-helper":109,"timbuctoo-edit-forms/src/coffee/helpers/dynamic-relation-type-helper":110,"timbuctoo-edit-forms/src/coffee/views/form.coffee":114,"underscore":undefined}],57:[function(require,module,exports){
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



},{"../../../jade/views/person/graph.jade":84,"../../config":40,"../../models/graph":48,"backbone":undefined,"d3":undefined}],58:[function(require,module,exports){
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



},{"../../../jade/faceted-search/person.jade":72,"../../../jade/views/person/person-search-results.jade":87,"../../config":40,"../base-search.coffee":51,"backbone":undefined}],59:[function(require,module,exports){
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



},{"../../../jade/views/base-link.jade":76,"../../../jade/views/person/view.jade":88,"../../config":40,"../../helpers/base-view-helper":41,"../base-view":52}],60:[function(require,module,exports){
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



},{"../../../jade/faceted-search/document.jade":70,"../../../jade/faceted-search/person.jade":72,"../../../jade/faceted-search/reception-main.jade":73,"../../../jade/views/reception/source-query-builder.jade":92,"../../config":40,"../../helpers/search":45,"backbone":undefined}],61:[function(require,module,exports){
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



},{"../../../jade/faceted-search/document.jade":70,"../../../jade/faceted-search/reception-main.jade":73,"../../../jade/views/reception/reception-selector.jade":89,"../../config":40,"../../helpers/search":45,"backbone":undefined}],62:[function(require,module,exports){
var $, Backbone, ReceptionSearchResult, config,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

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



},{"../../../jade/views/reception/search-result.jade":90,"../../config":40,"backbone":undefined,"jquery":undefined}],63:[function(require,module,exports){
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



},{"../../../jade/views/reception/search.jade":91,"../../config":40,"../../helpers/reception-service":44,"./receptee-selector":60,"./reception-selector":61,"./results":62,"./type-selector":64,"backbone":undefined,"huygens-faceted-search/src/coffee/collections/searchresults":7,"underscore":undefined}],64:[function(require,module,exports){
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



},{"../../../jade/views/reception/type-selector.jade":93,"../../config":40,"backbone":undefined,"underscore":undefined}],65:[function(require,module,exports){
var Backbone, SourceList, config, loadSources,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

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



},{"../../../jade/views/sources/list.jade":96,"../../config":40,"../../helpers/load-app-data":42,"backbone":undefined}],66:[function(require,module,exports){
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



},{"../../jade/views/status.jade":97,"backbone":undefined,"underscore":undefined}],67:[function(require,module,exports){
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



},{"../../jade/views/user-status.jade":98,"backbone":undefined,"hibb-login":3,"jquery":undefined}],68:[function(require,module,exports){
module.exports={
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
},{}],69:[function(require,module,exports){
module.exports={
  "tempPsChildren" : {
    "type" : "String"
  },
  "PID" : {
    "value" : "^pid",
    "type" : "String"
  },
  "^deleted" : {
    "type" : "boolean"
  },
  "tempName" : {
    "type" : "String"
  },
  "livedIn" : {
    "type" : "String"
  },
  "^created" : {
    "type" : "Change"
  },
  "children" : {
    "value" : [ "UNKNOWN", "NO", "YES" ],
    "type" : "String"
  },
  "deathDate" : {
    "type" : "Datable"
  },
  "bibliography" : {
    "type" : "String"
  },
  "^modified" : {
    "type" : "Change"
  },
  "tempSpouse" : {
    "type" : "String"
  },
  "_id" : {
    "type" : "String"
  },
  "tempMemberships" : {
    "type" : "String"
  },
  "ID" : {
    "value" : "_id",
    "type" : "String"
  },
  "@relations" : {
    "type" : "Map of (String, List of (EntityRef))"
  },
  "gender" : {
    "value" : [ "UNKNOWN", "MALE", "FEMALE", "NOT_APPLICABLE" ],
    "type" : "String"
  },
  "birthDate" : {
    "type" : "Datable"
  },
  "types" : {
    "value" : [ "ARCHETYPE", "AUTHOR", "PSEUDONYM" ],
    "type" : "List of (String)"
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
  "tempPseudonyms" : {
    "type" : "String"
  },
  "tempCollaborations" : {
    "type" : "String"
  },
  "tempFinancialSituation" : {
    "type" : "String"
  },
  "links" : {
    "type" : "List of (Link)"
  },
  "tempChildren" : {
    "type" : "String"
  },
  "health" : {
    "type" : "String"
  },
  "fsPseudonyms" : {
    "type" : "List of (String)"
  },
  "tempDeath" : {
    "type" : "String"
  },
  "tempBirthPlace" : {
    "type" : "String"
  },
  "tempMotherTongue" : {
    "type" : "String"
  },
  "nationality" : {
    "type" : "String"
  },
  "^rev" : {
    "type" : "int"
  },
  "names" : {
    "value" : [ ],
    "type" : "WWPerson.Names"
  },
  "^variations" : {
    "type" : "List of (String)"
  },
  "tempDeathPlace" : {
    "type" : "String"
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
  "tempPlaceOfBirth" : {
    "type" : "String"
  },
  "^roles" : {
    "type" : "List of (Role)"
  },
  "personalSituation" : {
    "type" : "String"
  }
}
},{}],70:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"dynamic_s_creator-placeholder\"></div><div class=\"dynamic_s_date-placeholder\"></div><div class=\"dynamic_s_origin-placeholder\"></div><div class=\"dynamic_s_language-placeholder\"></div><div class=\"dynamic_s_genre-placeholder\"></div>");;return buf.join("");
};
},{"jade/runtime":36}],71:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"overlay\"><div><i class=\"fa fa-spinner fa-spin fa-2x\"></i></div></div><div class=\"faceted-search\"><ul class=\"facets-menu\"><li class=\"reset\"><button><i class=\"fa fa-refresh\"></i><span>Reset search</span></button></li><li class=\"switch\"><button><i class=\"fa fa-angle-double-down\"></i><span>Switch to</span></button></li><li class=\"collapse-expand\"><button><i class=\"fa fa-compress\"></i><span>Collapse facets</span></button></li></ul><div class=\"text-search-placeholder\"></div><div class=\"facets-placeholder\"></div></div>");;return buf.join("");
};
},{"jade/runtime":36}],72:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"dynamic_s_types-placeholder\"></div><div class=\"dynamic_s_gender-placeholder\"></div><div class=\"dynamic_s_residence-placeholder\"></div><div class=\"dynamic_s_language-placeholder\"></div><div class=\"dynamic_s_birthDate-placeholder\"></div><div class=\"dynamic_s_deathDate-placeholder\"></div><div class=\"dynamic_s_birthplace-placeholder\"></div><div class=\"dynamic_s_deathplace-placeholder\"></div><div class=\"dynamic_s_collective-placeholder\"></div><div class=\"dynamic_s_religion-placeholder\"></div>");;return buf.join("");
};
},{"jade/runtime":36}],73:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"overlay\"><div><i class=\"fa fa-spinner fa-spin fa-2x\"></i></div></div><div class=\"faceted-search\"><ul class=\"facets-menu\"><li class=\"reset\"><button><i class=\"fa fa-refresh\"></i><span>Clear selection</span></button></li></ul><div class=\"facets-placeholder\"></div></div>");;return buf.join("");
};
},{"jade/runtime":36}],74:[function(require,module,exports){
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
},{"jade/runtime":36}],75:[function(require,module,exports){
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
},{"jade/runtime":36}],76:[function(require,module,exports){
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
},{"jade/runtime":36}],77:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (config) {
buf.push("<div class=\"container\"><div class=\"header centered\"><a" + (jade.attr("href", config.get('baseUrl'), true, false)) + " class=\"home\"><div class=\"header-logo largest-text\"><span class=\"small-caps\">NEWW</span>Women Writers</div></a><a href=\"http://www.huygens.knaw.nl/\" target=\"_self\" class=\"huygens-ing\"></a></div><div class=\"navigation\"><div class=\"centered\"><div class=\"links\"><a" + (jade.attr("href", config.get('baseUrl') + "/persons/", true, false)) + " class=\"person\">Persons</a><span class=\"add-person\">+</span><a" + (jade.attr("href", config.get('baseUrl') + "/documents/", true, false)) + " class=\"document\">Documents</a><span class=\"add-document\">+</span><a" + (jade.attr("href", config.get('baseUrl') + "/receptions/", true, false)) + " class=\"reception\">Receptions</a><a" + (jade.attr("href", config.get('baseUrl') + "/sources/", true, false)) + " class=\"source\">Sources</a><i class=\"fa fa-adjust\"></i><div class=\"user-status\"></div></div></div></div><div id=\"search\"><div class=\"persons centered\"></div><div class=\"documents centered\"></div><div class=\"receptions\"></div></div><div id=\"view\"></div></div>");}.call(this,"config" in locals_for_with?locals_for_with.config:typeof config!=="undefined"?config:undefined));;return buf.join("");
};
},{"jade/runtime":36}],78:[function(require,module,exports){
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
},{"jade/runtime":36}],79:[function(require,module,exports){
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
},{"jade/runtime":36}],80:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (config, document) {
buf.push("<div class=\"centered\"><div class=\"controls\"><button class=\"btn save\"><i class=\"fa fa-check\"></i>Save</button><a" + (jade.attr("href", config.documentViewUrl(document._id), true, false)) + " class=\"btn gray cancel\"><i class=\"fa fa-times\"></i>Cancel</a></div><h1>" + (jade.escape(null == (jade_interp = document.title) ? "" : jade_interp)) + "</h1><div class=\"form\"></div><div class=\"controls bottom\"><button class=\"btn save\"><i class=\"fa fa-check\"></i>Save</button><a" + (jade.attr("href", config.documentViewUrl(document._id), true, false)) + " class=\"btn gray cancel\"><i class=\"fa fa-times\"></i>Cancel</a></div></div>");}.call(this,"config" in locals_for_with?locals_for_with.config:typeof config!=="undefined"?config:undefined,"document" in locals_for_with?locals_for_with.document:typeof document!=="undefined"?document:undefined));;return buf.join("");
};
},{"jade/runtime":36}],81:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (showingRevision, data, isDeleted, canEdit, config, resultIndex, resultTotal, prevId, nextId, receptions, _, modified, Date) {
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
if ( receptions && _.keys(receptions).length)
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
buf.push("</div>");}.call(this,"showingRevision" in locals_for_with?locals_for_with.showingRevision:typeof showingRevision!=="undefined"?showingRevision:undefined,"data" in locals_for_with?locals_for_with.data:typeof data!=="undefined"?data:undefined,"isDeleted" in locals_for_with?locals_for_with.isDeleted:typeof isDeleted!=="undefined"?isDeleted:undefined,"canEdit" in locals_for_with?locals_for_with.canEdit:typeof canEdit!=="undefined"?canEdit:undefined,"config" in locals_for_with?locals_for_with.config:typeof config!=="undefined"?config:undefined,"resultIndex" in locals_for_with?locals_for_with.resultIndex:typeof resultIndex!=="undefined"?resultIndex:undefined,"resultTotal" in locals_for_with?locals_for_with.resultTotal:typeof resultTotal!=="undefined"?resultTotal:undefined,"prevId" in locals_for_with?locals_for_with.prevId:typeof prevId!=="undefined"?prevId:undefined,"nextId" in locals_for_with?locals_for_with.nextId:typeof nextId!=="undefined"?nextId:undefined,"receptions" in locals_for_with?locals_for_with.receptions:typeof receptions!=="undefined"?receptions:undefined,"_" in locals_for_with?locals_for_with._:typeof _!=="undefined"?_:undefined,"modified" in locals_for_with?locals_for_with.modified:typeof modified!=="undefined"?modified:undefined,"Date" in locals_for_with?locals_for_with.Date:typeof Date!=="undefined"?Date:undefined));;return buf.join("");
};
},{"jade/runtime":36}],82:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<form><ul><li><label>First Name</label><input type=\"text\" name=\"first-name\"/></li><li><label>Last Name</label><input type=\"text\" name=\"last-name\"/></li><li><label>Gender</label><select name=\"gender\"><option value=\"FEMALE\">Female</option><option value=\"MALE\">Male</option><option value=\"UNKNOWN\">Unknown</option></select></li><li><label>Types</label><select name=\"types\"><option></option><option value=\"AUTHOR\">Author</option><option value=\"ARCHETYPE\">Archetype</option><option value=\"PSEUDONYM\">Pseudonym</option></select></li><li><label>Birth Date</label><input type=\"text\" name=\"birthDate\"/></li><li><label>Death Date</label><input type=\"text\" name=\"deathDate\"/></li></ul></form>");;return buf.join("");
};
},{"jade/runtime":36}],83:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (config, person) {
buf.push("<div class=\"centered\"><div class=\"controls\"><button class=\"btn save\"><i class=\"fa fa-check\"></i>Save</button><a" + (jade.attr("href", config.personViewUrl(person._id), true, false)) + " class=\"btn gray cancel\"><i class=\"fa fa-times\"></i>Cancel</a></div><h1>" + (jade.escape(null == (jade_interp = person.tempName) ? "" : jade_interp)) + "</h1><div class=\"form\"></div><div class=\"controls bottom\"><button class=\"btn save\"><i class=\"fa fa-check\"></i>Save</button><a" + (jade.attr("href", config.personViewUrl(person._id), true, false)) + " class=\"btn gray cancel\"><i class=\"fa fa-times\"></i>Cancel</a></div></div>");}.call(this,"config" in locals_for_with?locals_for_with.config:typeof config!=="undefined"?config:undefined,"person" in locals_for_with?locals_for_with.person:typeof person!=="undefined"?person:undefined));;return buf.join("");
};
},{"jade/runtime":36}],84:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<h5 class=\"title\">Graph for&nbsp;<span class=\"name\"></span></h5><ul></ul><svg></svg>");;return buf.join("");
};
},{"jade/runtime":36}],85:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (value) {
buf.push("<span class=\"value\">" + (jade.escape(null == (jade_interp = value) ? "" : jade_interp)) + "</span><!-- span.type= type-->");}.call(this,"value" in locals_for_with?locals_for_with.value:typeof value!=="undefined"?value:undefined));;return buf.join("");
};
},{"jade/runtime":36}],86:[function(require,module,exports){
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
},{"jade/runtime":36}],87:[function(require,module,exports){
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
},{"jade/runtime":36}],88:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (showingRevision, data, isDeleted, canEdit, config, componentsToName, Unnamed, resultIndex, resultTotal, prevId, nextId, receptions, _, modified, Date) {
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
if ( receptions && _.keys(receptions).length)
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
buf.push("</div>");}.call(this,"showingRevision" in locals_for_with?locals_for_with.showingRevision:typeof showingRevision!=="undefined"?showingRevision:undefined,"data" in locals_for_with?locals_for_with.data:typeof data!=="undefined"?data:undefined,"isDeleted" in locals_for_with?locals_for_with.isDeleted:typeof isDeleted!=="undefined"?isDeleted:undefined,"canEdit" in locals_for_with?locals_for_with.canEdit:typeof canEdit!=="undefined"?canEdit:undefined,"config" in locals_for_with?locals_for_with.config:typeof config!=="undefined"?config:undefined,"componentsToName" in locals_for_with?locals_for_with.componentsToName:typeof componentsToName!=="undefined"?componentsToName:undefined,"Unnamed" in locals_for_with?locals_for_with.Unnamed:typeof Unnamed!=="undefined"?Unnamed:undefined,"resultIndex" in locals_for_with?locals_for_with.resultIndex:typeof resultIndex!=="undefined"?resultIndex:undefined,"resultTotal" in locals_for_with?locals_for_with.resultTotal:typeof resultTotal!=="undefined"?resultTotal:undefined,"prevId" in locals_for_with?locals_for_with.prevId:typeof prevId!=="undefined"?prevId:undefined,"nextId" in locals_for_with?locals_for_with.nextId:typeof nextId!=="undefined"?nextId:undefined,"receptions" in locals_for_with?locals_for_with.receptions:typeof receptions!=="undefined"?receptions:undefined,"_" in locals_for_with?locals_for_with._:typeof _!=="undefined"?_:undefined,"modified" in locals_for_with?locals_for_with.modified:typeof modified!=="undefined"?modified:undefined,"Date" in locals_for_with?locals_for_with.Date:typeof Date!=="undefined"?Date:undefined));;return buf.join("");
};
},{"jade/runtime":36}],89:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<h5 class=\"reception-criteria-header\">Reception criteria</h5><div class=\"search-container\"></div>");;return buf.join("");
};
},{"jade/runtime":36}],90:[function(require,module,exports){
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
},{"jade/runtime":36}],91:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"reception-search\"><div class=\"centered query\"><div class=\"tabs smaller-text\"><div class=\"tab type\"><div class=\"text\">All receptions</div><div class=\"link\">All receptions</div></div><div class=\"tab reception\"><div class=\"text\">(all receptions)</div><div class=\"link\">(all receptions)</div></div><div class=\"tab receptee\"><div class=\"text\">All persons/works</div><div class=\"link\">All persons/works</div></div><div class=\"tab search\"><button disabled=\"disabled\" class=\"btn search-receptions\"><i class=\"fa fa-search\"></i><span class=\"s\">Search</span><span class=\"ing\">ing</span></button></div></div></div></div><div class=\"views\"><div class=\"select-type centered\"></div><div class=\"select-reception centered hidden\"></div><div class=\"select-receptee centered hidden\"></div></div><div class=\"reception-results centered\"></div>");;return buf.join("");
};
},{"jade/runtime":36}],92:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<h5 class=\"search-criteria-header\">Search criteria</h5><div class=\"search-container\"></div>");;return buf.join("");
};
},{"jade/runtime":36}],93:[function(require,module,exports){
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
},{"jade/runtime":36}],94:[function(require,module,exports){
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
},{"jade/runtime":36}],95:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"search\"></div><div class=\"results\"></div>");;return buf.join("");
};
},{"jade/runtime":36}],96:[function(require,module,exports){
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
},{"jade/runtime":36}],97:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"loading box\"><h1>Please wait...</h1></div><div class=\"error box\"><h1><i class=\"fa fa-warning\"></i><span class=\"title\">Error</span></h1><div class=\"message\">I'm very sorry, but it seems an error has occurred:</div><code class=\"error-message\"></code><button type=\"button\" class=\"btn ok\">OK</button></div><div class=\"success box\"><h1><i class=\"fa fa-check\"></i><span class=\"title\">Success!</span></h1></div>");;return buf.join("");
};
},{"jade/runtime":36}],98:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (username) {
buf.push("<a href=\"#\" class=\"login\">Login</a><div class=\"loader\">Logging in</div><span><span class=\"label\">Logged in as&nbsp;</span><span class=\"user-name\">" + (jade.escape(null == (jade_interp = username ? username : 'unknown') ? "" : jade_interp)) + "</span></span>");}.call(this,"username" in locals_for_with?locals_for_with.username:typeof username!=="undefined"?username:undefined));;return buf.join("");
};
},{"jade/runtime":36}],99:[function(require,module,exports){
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

},{}],100:[function(require,module,exports){
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

},{}],101:[function(require,module,exports){
/**
 * Bootstrap Modal wrapper for use with Backbone.
 * 
 * Takes care of instantiation, manages multiple modals,
 * adds several options and removes the element from the DOM when closed
 *
 * @author Charles Davison <charlie@powmedia.co.uk>
 *
 * Events:
 * shown: Fired when the modal has finished animating in
 * hidden: Fired when the modal has finished animating out
 * cancel: The user dismissed the modal
 * ok: The user clicked OK
 */
(function($, _, Backbone) {

  //Set custom template settings
  var _interpolateBackup = _.templateSettings;
  _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g,
    evaluate: /<%([\s\S]+?)%>/g
  }

  var template = _.template('\
    <% if (title) { %>\
      <div class="modal-header">\
        <% if (allowCancel) { %>\
          <a class="close">×</a>\
        <% } %>\
        <h3>{{title}}</h3>\
      </div>\
    <% } %>\
    <div class="modal-body">{{content}}</div>\
    <div class="modal-footer">\
      <% if (allowCancel) { %>\
        <% if (cancelText) { %>\
          <a href="#" class="btn cancel">{{cancelText}}</a>\
        <% } %>\
      <% } %>\
      <a href="#" class="btn ok btn-primary">{{okText}}</a>\
    </div>\
  ');

  //Reset to users' template settings
  _.templateSettings = _interpolateBackup;
  

  var Modal = Backbone.View.extend({

    className: 'modal',

    events: {
      'click .close': function(event) {
        event.preventDefault();

        this.trigger('cancel');
      },
      'click .cancel': function(event) {
        event.preventDefault();

        this.trigger('cancel');
      },
      'click .ok': function(event) {
        event.preventDefault();

        this.trigger('ok');
        this.close();
      }
    },

    /**
     * Creates an instance of a Bootstrap Modal
     *
     * @see http://twitter.github.com/bootstrap/javascript.html#modals
     *
     * @param {Object} options
     * @param {String|View} [options.content] Modal content. Default: none
     * @param {String} [options.title]        Title. Default: none
     * @param {String} [options.okText]       Text for the OK button. Default: 'OK'
     * @param {String} [options.cancelText]   Text for the cancel button. Default: 'Cancel'. If passed a falsey value, the button will be removed
     * @param {Boolean} [options.allowCancel  Whether the modal can be closed, other than by pressing OK. Default: true
     * @param {Boolean} [options.escape]      Whether the 'esc' key can dismiss the modal. Default: true, but false if options.cancellable is true
     * @param {Boolean} [options.animate]     Whether to animate in/out. Default: false
     * @param {Function} [options.template]   Compiled underscore template to override the default one
     */
    initialize: function(options) {
      this.options = _.extend({
        title: null,
        okText: 'OK',
        cancelText: 'Cancel',
        allowCancel: true,
        escape: true,
        animate: false,
        template: template
      }, options);
    },

    /**
     * Creates the DOM element
     * 
     * @api private
     */
    render: function() {
      var $el = this.$el,
          options = this.options,
          content = options.content;

      //Create the modal container
      $el.html(options.template(options));

      var $content = this.$content = $el.find('.modal-body')

      //Insert the main content if it's a view
      if (content.$el) {
        $el.find('.modal-body').html(content.render().$el);
      }

      if (options.animate) $el.addClass('fade');

      this.isRendered = true;

      return this;
    },

    /**
     * Renders and shows the modal
     *
     * @param {Function} [cb]     Optional callback that runs only when OK is pressed.
     */
    open: function(cb) {
      if (!this.isRendered) this.render();

      var self = this,
          $el = this.$el;

      //Create it
      $el.modal({
        keyboard: this.options.allowCancel,
        backdrop: this.options.allowCancel ? true : 'static'
      });

      //Focus OK button
      $el.one('shown', function() {
        $el.find('.btn.ok').focus();

        self.trigger('shown');
      });

      //Adjust the modal and backdrop z-index; for dealing with multiple modals
      var numModals = Modal.count,
          $backdrop = $('.modal-backdrop:eq('+numModals+')'),
          backdropIndex = $backdrop.css('z-index'),
          elIndex = $backdrop.css('z-index');

      $backdrop.css('z-index', backdropIndex + numModals);
      this.$el.css('z-index', elIndex + numModals);

      if (this.options.allowCancel) {
        $backdrop.one('click', function() {
          self.trigger('cancel');
        });
        
        $(document).one('keyup.dismiss.modal', function (e) {
          e.which == 27 && self.trigger('cancel');
        });
      }

      this.on('cancel', function() {
        self.close();
      });

      Modal.count++;

      //Run callback on OK if provided
      if (cb) {
        self.on('ok', cb);
      }
      
      return this;
    },

    /**
     * Closes the modal
     */
    close: function() {
      var self = this,
          $el = this.$el;

      //Check if the modal should stay open
      if (this._preventClose) {
        this._preventClose = false;
        return;
      }

      $el.modal('hide');

      $el.one('hidden', function() {
        self.remove();

        self.trigger('hidden');
      });

      Modal.count--;
    },

    /**
     * Stop the modal from closing.
     * Can be called from within a 'close' or 'ok' event listener.
     */
    preventClose: function() {
      this._preventClose = true;
    }
  }, {
    //STATICS

    //The number of modals on display
    count: 0
  });


  //EXPORTS
  //CommonJS
  if (typeof require == 'function' && typeof module !== 'undefined' && exports) {
    module.exports = Modal;
  }

  //AMD / RequireJS
  if (typeof define === 'function' && define.amd) {
    return define(function() {
      Backbone.BootstrapModal = Modal;
    })
  }

  //Regular; add to Backbone.Bootstrap.Modal
  else {
    Backbone.BootstrapModal = Modal;
  }

})(jQuery, _, Backbone);

},{}],102:[function(require,module,exports){
(function (global){
/**
 * Backbone Forms v0.14.0
 *
 * Copyright (c) 2013 Charles Davison, Pow Media Ltd
 *
 * License and more information at:
 * http://github.com/powmedia/backbone-forms
 */
;(function(root) {

  //DEPENDENCIES
  //CommonJS
  if (typeof exports !== 'undefined' && typeof require !== 'undefined') {
    var $ = root.jQuery || root.Zepto || root.ender || require('jquery'),
        _ = root._ || require('underscore'),
        Backbone = root.Backbone || require('backbone');
        Backbone.$ = $;
  }

  //Browser
  else {
    var $ = root.jQuery,
        _ = root._,
        Backbone = root.Backbone;
  }


  //SOURCE
  //==================================================================================================
//FORM
//==================================================================================================

var Form = Backbone.View.extend({

  events: {
    'submit': function(event) {
      this.trigger('submit', event);
    }
  },

  /**
   * Constructor
   * 
   * @param {Object} [options.schema]
   * @param {Backbone.Model} [options.model]
   * @param {Object} [options.data]
   * @param {String[]|Object[]} [options.fieldsets]
   * @param {String[]} [options.fields]
   * @param {String} [options.idPrefix]
   * @param {Form.Field} [options.Field]
   * @param {Form.Fieldset} [options.Fieldset]
   * @param {Function} [options.template]
   */
  initialize: function(options) {
    var self = this;

    options = options || {};

    //Find the schema to use
    var schema = this.schema = (function() {
      //Prefer schema from options
      if (options.schema) return _.result(options, 'schema');

      //Then schema on model
      var model = options.model;
      if (model && model.schema) return _.result(model, 'schema');

      //Then built-in schema
      if (self.schema) return _.result(self, 'schema');

      //Fallback to empty schema
      return {};
    })();

    //Store important data
    _.extend(this, _.pick(options, 'model', 'data', 'idPrefix', 'templateData'));

    //Override defaults
    var constructor = this.constructor;
    this.template = options.template || this.template || constructor.template;
    this.Fieldset = options.Fieldset || this.Fieldset || constructor.Fieldset;
    this.Field = options.Field || this.Field || constructor.Field;
    this.NestedField = options.NestedField || this.NestedField || constructor.NestedField;

    //Check which fields will be included (defaults to all)
    var selectedFields = this.selectedFields = options.fields || _.keys(schema);

    //Create fields
    var fields = this.fields = {};

    _.each(selectedFields, function(key) {
      var fieldSchema = schema[key];
      fields[key] = this.createField(key, fieldSchema);
    }, this);

    //Create fieldsets
    var fieldsetSchema = options.fieldsets || _.result(this, 'fieldsets') || [selectedFields],
        fieldsets = this.fieldsets = [];

    _.each(fieldsetSchema, function(itemSchema) {
      this.fieldsets.push(this.createFieldset(itemSchema));
    }, this);
  },

  /**
   * Creates a Fieldset instance
   *
   * @param {String[]|Object[]} schema       Fieldset schema
   *
   * @return {Form.Fieldset}
   */
  createFieldset: function(schema) {
    var options = {
      schema: schema,
      fields: this.fields
    };

    return new this.Fieldset(options);
  },

  /**
   * Creates a Field instance
   *
   * @param {String} key
   * @param {Object} schema       Field schema
   *
   * @return {Form.Field}
   */
  createField: function(key, schema) {
    var options = {
      form: this,
      key: key,
      schema: schema,
      idPrefix: this.idPrefix
    };

    if (this.model) {
      options.model = this.model;
    } else if (this.data) {
      options.value = this.data[key];
    } else {
      options.value = null;
    }

    var field = new this.Field(options);

    this.listenTo(field.editor, 'all', this.handleEditorEvent);

    return field;
  },

  /**
   * Callback for when an editor event is fired.
   * Re-triggers events on the form as key:event and triggers additional form-level events
   *
   * @param {String} event
   * @param {Editor} editor
   */
  handleEditorEvent: function(event, editor) {
    //Re-trigger editor events on the form
    var formEvent = editor.key+':'+event;

    this.trigger.call(this, formEvent, this, editor, Array.prototype.slice.call(arguments, 2));

    //Trigger additional events
    switch (event) {
      case 'change':
        this.trigger('change', this);
        break;

      case 'focus':
        if (!this.hasFocus) this.trigger('focus', this);
        break;

      case 'blur':
        if (this.hasFocus) {
          //TODO: Is the timeout etc needed?
          var self = this;
          setTimeout(function() {
            var focusedField = _.find(self.fields, function(field) {
              return field.editor.hasFocus;
            });

            if (!focusedField) self.trigger('blur', self);
          }, 0);
        }
        break;
    }
  },

  render: function() {
    var self = this,
        fields = this.fields;

    //Render form
    var $form = $($.trim(this.template(_.result(this, 'templateData'))));

    //Render standalone editors
    $form.find('[data-editors]').add($form).each(function(i, el) {
      var $container = $(el),
          selection = $container.attr('data-editors');

      if (_.isUndefined(selection)) return;

      //Work out which fields to include
      var keys = (selection == '*')
        ? self.selectedFields || _.keys(fields)
        : selection.split(',');

      //Add them
      _.each(keys, function(key) {
        var field = fields[key];

        $container.append(field.editor.render().el);
      });
    });

    //Render standalone fields
    $form.find('[data-fields]').add($form).each(function(i, el) {
      var $container = $(el),
          selection = $container.attr('data-fields');

      if (_.isUndefined(selection)) return;

      //Work out which fields to include
      var keys = (selection == '*')
        ? self.selectedFields || _.keys(fields)
        : selection.split(',');

      //Add them
      _.each(keys, function(key) {
        var field = fields[key];

        $container.append(field.render().el);
      });
    });

    //Render fieldsets
    $form.find('[data-fieldsets]').add($form).each(function(i, el) {
      var $container = $(el),
          selection = $container.attr('data-fieldsets');

      if (_.isUndefined(selection)) return;

      _.each(self.fieldsets, function(fieldset) {
        $container.append(fieldset.render().el);
      });
    });

    //Set the main element
    this.setElement($form);
    
    //Set class
    $form.addClass(this.className);

    return this;
  },

  /**
   * Validate the data
   *
   * @return {Object}       Validation errors
   */
  validate: function(options) {
    var self = this,
        fields = this.fields,
        model = this.model,
        errors = {};

    options = options || {};

    //Collect errors from schema validation
    _.each(fields, function(field) {
      var error = field.validate();
      if (error) {
        errors[field.key] = error;
      }
    });

    //Get errors from default Backbone model validator
    if (!options.skipModelValidate && model && model.validate) {
      var modelErrors = model.validate(this.getValue());

      if (modelErrors) {
        var isDictionary = _.isObject(modelErrors) && !_.isArray(modelErrors);

        //If errors are not in object form then just store on the error object
        if (!isDictionary) {
          errors._others = errors._others || [];
          errors._others.push(modelErrors);
        }

        //Merge programmatic errors (requires model.validate() to return an object e.g. { fieldKey: 'error' })
        if (isDictionary) {
          _.each(modelErrors, function(val, key) {
            //Set error on field if there isn't one already
            if (fields[key] && !errors[key]) {
              fields[key].setError(val);
              errors[key] = val;
            }

            else {
              //Otherwise add to '_others' key
              errors._others = errors._others || [];
              var tmpErr = {};
              tmpErr[key] = val;
              errors._others.push(tmpErr);
            }
          });
        }
      }
    }

    return _.isEmpty(errors) ? null : errors;
  },

  /**
   * Update the model with all latest values.
   *
   * @param {Object} [options]  Options to pass to Model#set (e.g. { silent: true })
   *
   * @return {Object}  Validation errors
   */
  commit: function(options) {
    //Validate
    options = options || {};

    var validateOptions = {
        skipModelValidate: !options.validate
    };

    var errors = this.validate(validateOptions);
    if (errors) return errors;

    //Commit
    var modelError;

    var setOptions = _.extend({
      error: function(model, e) {
        modelError = e;
      }
    }, options);

    this.model.set(this.getValue(), setOptions);
    
    if (modelError) return modelError;
  },

  /**
   * Get all the field values as an object.
   * Use this method when passing data instead of objects
   *
   * @param {String} [key]    Specific field value to get
   */
  getValue: function(key) {
    //Return only given key if specified
    if (key) return this.fields[key].getValue();

    //Otherwise return entire form
    var values = {};
    _.each(this.fields, function(field) {
      values[field.key] = field.getValue();
    });

    return values;
  },

  /**
   * Update field values, referenced by key
   *
   * @param {Object|String} key     New values to set, or property to set
   * @param val                     Value to set
   */
  setValue: function(prop, val) {
    var data = {};
    if (typeof prop === 'string') {
      data[prop] = val;
    } else {
      data = prop;
    }

    var key;
    for (key in this.schema) {
      if (data[key] !== undefined) {
        this.fields[key].setValue(data[key]);
      }
    }
  },

  /**
   * Returns the editor for a given field key
   *
   * @param {String} key
   *
   * @return {Editor}
   */
  getEditor: function(key) {
    var field = this.fields[key];
    if (!field) throw new Error('Field not found: '+key);

    return field.editor;
  },

  /**
   * Gives the first editor in the form focus
   */
  focus: function() {
    if (this.hasFocus) return;

    //Get the first field
    var fieldset = this.fieldsets[0],
        field = fieldset.getFieldAt(0);

    if (!field) return;

    //Set focus
    field.editor.focus();
  },

  /**
   * Removes focus from the currently focused editor
   */
  blur: function() {
    if (!this.hasFocus) return;

    var focusedField = _.find(this.fields, function(field) {
      return field.editor.hasFocus;
    });

    if (focusedField) focusedField.editor.blur();
  },

  /**
   * Manages the hasFocus property
   *
   * @param {String} event
   */
  trigger: function(event) {
    if (event === 'focus') {
      this.hasFocus = true;
    }
    else if (event === 'blur') {
      this.hasFocus = false;
    }

    return Backbone.View.prototype.trigger.apply(this, arguments);
  },

  /**
   * Override default remove function in order to remove embedded views
   *
   * TODO: If editors are included directly with data-editors="x", they need to be removed
   * May be best to use XView to manage adding/removing views
   */
  remove: function() {
    _.each(this.fieldsets, function(fieldset) {
      fieldset.remove();
    });

    _.each(this.fields, function(field) {
      field.remove();
    });

    return Backbone.View.prototype.remove.apply(this, arguments);
  }

}, {

  //STATICS
  template: _.template('\
    <form data-fieldsets></form>\
  ', null, this.templateSettings),

  templateSettings: {
    evaluate: /<%([\s\S]+?)%>/g, 
    interpolate: /<%=([\s\S]+?)%>/g, 
    escape: /<%-([\s\S]+?)%>/g
  },

  editors: {}

});

  
//==================================================================================================
//VALIDATORS
//==================================================================================================

Form.validators = (function() {

  var validators = {};

  validators.errMessages = {
    required: 'Required',
    regexp: 'Invalid',
    number: 'Must be a number',
    email: 'Invalid email address',
    url: 'Invalid URL',
    match: _.template('Must match field "<%= field %>"', null, Form.templateSettings)
  };
  
  validators.required = function(options) {
    options = _.extend({
      type: 'required',
      message: this.errMessages.required
    }, options);
     
    return function required(value) {
      options.value = value;
      
      var err = {
        type: options.type,
        message: _.isFunction(options.message) ? options.message(options) : options.message
      };
      
      if (value === null || value === undefined || value === false || value === '') return err;
    };
  };
  
  validators.regexp = function(options) {
    if (!options.regexp) throw new Error('Missing required "regexp" option for "regexp" validator');
  
    options = _.extend({
      type: 'regexp',
      match: true,
      message: this.errMessages.regexp
    }, options);
    
    return function regexp(value) {
      options.value = value;
      
      var err = {
        type: options.type,
        message: _.isFunction(options.message) ? options.message(options) : options.message
      };
      
      //Don't check empty values (add a 'required' validator for this)
      if (value === null || value === undefined || value === '') return;

      //Create RegExp from string if it's valid
      if ('string' === typeof options.regexp) options.regexp = new RegExp(options.regexp, options.flags);

      if ((options.match) ? !options.regexp.test(value) : options.regexp.test(value)) return err;
    };
  };

  validators.number = function(options) {
    options = _.extend({
      type: 'number',
      message: this.errMessages.number,
      regexp: /^[0-9]*\.?[0-9]*?$/
    }, options);
    
    return validators.regexp(options);
  };
  
  validators.email = function(options) {
    options = _.extend({
      type: 'email',
      message: this.errMessages.email,
      regexp: /^[\w\-]{1,}([\w\-\+.]{1,1}[\w\-]{1,}){0,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/
    }, options);
    
    return validators.regexp(options);
  };
  
  validators.url = function(options) {
    options = _.extend({
      type: 'url',
      message: this.errMessages.url,
      regexp: /^(http|https):\/\/(([A-Z0-9][A-Z0-9_\-]*)(\.[A-Z0-9][A-Z0-9_\-]*)+)(:(\d+))?\/?/i
    }, options);
    
    return validators.regexp(options);
  };
  
  validators.match = function(options) {
    if (!options.field) throw new Error('Missing required "field" options for "match" validator');
    
    options = _.extend({
      type: 'match',
      message: this.errMessages.match
    }, options);
    
    return function match(value, attrs) {
      options.value = value;
      
      var err = {
        type: options.type,
        message: _.isFunction(options.message) ? options.message(options) : options.message
      };
      
      //Don't check empty values (add a 'required' validator for this)
      if (value === null || value === undefined || value === '') return;
      
      if (value !== attrs[options.field]) return err;
    };
  };


  return validators;

})();


//==================================================================================================
//FIELDSET
//==================================================================================================

Form.Fieldset = Backbone.View.extend({

  /**
   * Constructor
   *
   * Valid fieldset schemas:
   *   ['field1', 'field2']
   *   { legend: 'Some Fieldset', fields: ['field1', 'field2'] }
   *
   * @param {String[]|Object[]} options.schema      Fieldset schema
   * @param {Object} options.fields           Form fields
   */
  initialize: function(options) {
    options = options || {};

    //Create the full fieldset schema, merging defaults etc.
    var schema = this.schema = this.createSchema(options.schema);

    //Store the fields for this fieldset
    this.fields = _.pick(options.fields, schema.fields);
    
    //Override defaults
    this.template = options.template || schema.template || this.template || this.constructor.template;
  },

  /**
   * Creates the full fieldset schema, normalising, merging defaults etc.
   *
   * @param {String[]|Object[]} schema
   *
   * @return {Object}
   */
  createSchema: function(schema) {
    //Normalise to object
    if (_.isArray(schema)) {
      schema = { fields: schema };
    }

    //Add null legend to prevent template error
    schema.legend = schema.legend || null;

    return schema;
  },

  /**
   * Returns the field for a given index
   *
   * @param {Number} index
   *
   * @return {Field}
   */
  getFieldAt: function(index) {
    var key = this.schema.fields[index];

    return this.fields[key];
  },

  /**
   * Returns data to pass to template
   *
   * @return {Object}
   */
  templateData: function() {
    return this.schema;
  },

  /**
   * Renders the fieldset and fields
   *
   * @return {Fieldset} this
   */
  render: function() {
    var schema = this.schema,
        fields = this.fields;

    //Render fieldset
    var $fieldset = $($.trim(this.template(_.result(this, 'templateData'))));

    //Render fields
    $fieldset.find('[data-fields]').add($fieldset).each(function(i, el) {
      var $container = $(el),
          selection = $container.attr('data-fields');

      if (_.isUndefined(selection)) return;

      _.each(fields, function(field) {
        $container.append(field.render().el);
      });
    });

    this.setElement($fieldset);

    return this;
  },

  /**
   * Remove embedded views then self
   */
  remove: function() {
    _.each(this.fields, function(field) {
      field.remove();
    });

    Backbone.View.prototype.remove.call(this);
  }
  
}, {
  //STATICS

  template: _.template('\
    <fieldset data-fields>\
      <% if (legend) { %>\
        <legend><%= legend %></legend>\
      <% } %>\
    </fieldset>\
  ', null, Form.templateSettings)

});


//==================================================================================================
//FIELD
//==================================================================================================

Form.Field = Backbone.View.extend({

  /**
   * Constructor
   * 
   * @param {Object} options.key
   * @param {Object} options.form
   * @param {Object} [options.schema]
   * @param {Function} [options.schema.template]
   * @param {Backbone.Model} [options.model]
   * @param {Object} [options.value]
   * @param {String} [options.idPrefix]
   * @param {Function} [options.template]
   * @param {Function} [options.errorClassName]
   */
  initialize: function(options) {
    options = options || {};

    //Store important data
    _.extend(this, _.pick(options, 'form', 'key', 'model', 'value', 'idPrefix'));

    //Create the full field schema, merging defaults etc.
    var schema = this.schema = this.createSchema(options.schema);

    //Override defaults
    this.template = options.template || schema.template || this.template || this.constructor.template;
    this.errorClassName = options.errorClassName || this.errorClassName || this.constructor.errorClassName;

    //Create editor
    this.editor = this.createEditor();
  },

  /**
   * Creates the full field schema, merging defaults etc.
   *
   * @param {Object|String} schema
   *
   * @return {Object}
   */
  createSchema: function(schema) {
    if (_.isString(schema)) schema = { type: schema };

    //Set defaults
    schema = _.extend({
      type: 'Text',
      title: this.createTitle()
    }, schema);

    //Get the real constructor function i.e. if type is a string such as 'Text'
    schema.type = (_.isString(schema.type)) ? Form.editors[schema.type] : schema.type;

    return schema;
  },

  /**
   * Creates the editor specified in the schema; either an editor string name or
   * a constructor function
   *
   * @return {View}
   */
  createEditor: function() {
    var options = _.extend(
      _.pick(this, 'schema', 'form', 'key', 'model', 'value'),
      { id: this.createEditorId() }
    );

    var constructorFn = this.schema.type;

    return new constructorFn(options);
  },

  /**
   * Creates the ID that will be assigned to the editor
   *
   * @return {String}
   */
  createEditorId: function() {
    var prefix = this.idPrefix,
        id = this.key;

    //Replace periods with underscores (e.g. for when using paths)
    id = id.replace(/\./g, '_');

    //If a specific ID prefix is set, use it
    if (_.isString(prefix) || _.isNumber(prefix)) return prefix + id;
    if (_.isNull(prefix)) return id;

    //Otherwise, if there is a model use it's CID to avoid conflicts when multiple forms are on the page
    if (this.model) return this.model.cid + '_' + id;

    return id;
  },

  /**
   * Create the default field title (label text) from the key name.
   * (Converts 'camelCase' to 'Camel Case')
   *
   * @return {String}
   */
  createTitle: function() {
    var str = this.key;

    //Add spaces
    str = str.replace(/([A-Z])/g, ' $1');

    //Uppercase first character
    str = str.replace(/^./, function(str) { return str.toUpperCase(); });

    return str;
  },

  /**
   * Returns the data to be passed to the template
   *
   * @return {Object}
   */
  templateData: function() {
    var schema = this.schema;

    return {
      help: schema.help || '',
      title: schema.title,
      fieldAttrs: schema.fieldAttrs,
      editorAttrs: schema.editorAttrs,
      key: this.key,
      editorId: this.editor.id
    };
  },

  /**
   * Render the field and editor
   *
   * @return {Field} self
   */
  render: function() {
    var schema = this.schema,
        editor = this.editor;

    //Only render the editor if Hidden
    if (schema.type == Form.editors.Hidden) {
      return this.setElement(editor.render().el);
    }

    //Render field
    var $field = $($.trim(this.template(_.result(this, 'templateData'))));

    if (schema.fieldClass) $field.addClass(schema.fieldClass);
    if (schema.fieldAttrs) $field.attr(schema.fieldAttrs);

    //Render editor
    $field.find('[data-editor]').add($field).each(function(i, el) {
      var $container = $(el),
          selection = $container.attr('data-editor');

      if (_.isUndefined(selection)) return;

      $container.append(editor.render().el);
    });

    this.setElement($field);

    return this;
  },

  /**
   * Check the validity of the field
   *
   * @return {String}
   */
  validate: function() {
    var error = this.editor.validate();

    if (error) {
      this.setError(error.message);
    } else {
      this.clearError();
    }

    return error;
  },

  /**
   * Set the field into an error state, adding the error class and setting the error message
   *
   * @param {String} msg     Error message
   */
  setError: function(msg) {
    //Nested form editors (e.g. Object) set their errors internally
    if (this.editor.hasNestedForm) return;

    //Add error CSS class
    this.$el.addClass(this.errorClassName);

    //Set error message
    this.$('[data-error]').html(msg);
  },

  /**
   * Clear the error state and reset the help message
   */
  clearError: function() {
    //Remove error CSS class
    this.$el.removeClass(this.errorClassName);

    //Clear error message
    this.$('[data-error]').empty();
  },

  /**
   * Update the model with the new value from the editor
   *
   * @return {Mixed}
   */
  commit: function() {
    return this.editor.commit();
  },

  /**
   * Get the value from the editor
   *
   * @return {Mixed}
   */
  getValue: function() {
    return this.editor.getValue();
  },

  /**
   * Set/change the value of the editor
   *
   * @param {Mixed} value
   */
  setValue: function(value) {
    this.editor.setValue(value);
  },

  /**
   * Give the editor focus
   */
  focus: function() {
    this.editor.focus();
  },

  /**
   * Remove focus from the editor
   */
  blur: function() {
    this.editor.blur();
  },

  /**
   * Remove the field and editor views
   */
  remove: function() {
    this.editor.remove();

    Backbone.View.prototype.remove.call(this);
  }

}, {
  //STATICS

  template: _.template('\
    <div>\
      <label for="<%= editorId %>"><%= title %></label>\
      <div>\
        <span data-editor></span>\
        <div data-error></div>\
        <div><%= help %></div>\
      </div>\
    </div>\
  ', null, Form.templateSettings),

  /**
   * CSS class name added to the field when there is a validation error
   */
  errorClassName: 'error'

});


//==================================================================================================
//NESTEDFIELD
//==================================================================================================

Form.NestedField = Form.Field.extend({

  template: _.template($.trim('\
    <div>\
      <span data-editor></span>\
      <% if (help) { %>\
        <div><%= help %></div>\
      <% } %>\
      <div data-error></div>\
    </div>\
  '), null, Form.templateSettings)

});

/**
 * Base editor (interface). To be extended, not used directly
 *
 * @param {Object} options
 * @param {String} [options.id]         Editor ID
 * @param {Model} [options.model]       Use instead of value, and use commit()
 * @param {String} [options.key]        The model attribute key. Required when using 'model'
 * @param {Mixed} [options.value]       When not using a model. If neither provided, defaultValue will be used
 * @param {Object} [options.schema]     Field schema; may be required by some editors
 * @param {Object} [options.validators] Validators; falls back to those stored on schema
 * @param {Object} [options.form]       The form
 */
Form.Editor = Form.editors.Base = Backbone.View.extend({

  defaultValue: null,

  hasFocus: false,

  initialize: function(options) {
    var options = options || {};

    //Set initial value
    if (options.model) {
      if (!options.key) throw new Error("Missing option: 'key'");

      this.model = options.model;

      this.value = this.model.get(options.key);
    }
    else if (options.value !== undefined) {
      this.value = options.value;
    }

    if (this.value === undefined) this.value = this.defaultValue;

    //Store important data
    _.extend(this, _.pick(options, 'key', 'form'));

    var schema = this.schema = options.schema || {};

    this.validators = options.validators || schema.validators;

    //Main attributes
    this.$el.attr('id', this.id);
    this.$el.attr('name', this.getName());
    if (schema.editorClass) this.$el.addClass(schema.editorClass);
    if (schema.editorAttrs) this.$el.attr(schema.editorAttrs);
  },

  /**
   * Get the value for the form input 'name' attribute
   *
   * @return {String}
   *
   * @api private
   */
  getName: function() {
    var key = this.key || '';

    //Replace periods with underscores (e.g. for when using paths)
    return key.replace(/\./g, '_');
  },

  /**
   * Get editor value
   * Extend and override this method to reflect changes in the DOM
   *
   * @return {Mixed}
   */
  getValue: function() {
    return this.value;
  },

  /**
   * Set editor value
   * Extend and override this method to reflect changes in the DOM
   *
   * @param {Mixed} value
   */
  setValue: function(value) {
    this.value = value;
  },

  /**
   * Give the editor focus
   * Extend and override this method
   */
  focus: function() {
    throw new Error('Not implemented');
  },
  
  /**
   * Remove focus from the editor
   * Extend and override this method
   */
  blur: function() {
    throw new Error('Not implemented');
  },

  /**
   * Update the model with the current value
   *
   * @param {Object} [options]              Options to pass to model.set()
   * @param {Boolean} [options.validate]    Set to true to trigger built-in model validation
   *
   * @return {Mixed} error
   */
  commit: function(options) {
    var error = this.validate();
    if (error) return error;

    this.listenTo(this.model, 'invalid', function(model, e) {
      error = e;
    });
    this.model.set(this.key, this.getValue(), options);

    if (error) return error;
  },

  /**
   * Check validity
   *
   * @return {Object|Undefined}
   */
  validate: function() {
    var $el = this.$el,
        error = null,
        value = this.getValue(),
        formValues = this.form ? this.form.getValue() : {},
        validators = this.validators,
        getValidator = this.getValidator;

    if (validators) {
      //Run through validators until an error is found
      _.every(validators, function(validator) {
        error = getValidator(validator)(value, formValues);

        return error ? false : true;
      });
    }

    return error;
  },

  /**
   * Set this.hasFocus, or call parent trigger()
   *
   * @param {String} event
   */
  trigger: function(event) {
    if (event === 'focus') {
      this.hasFocus = true;
    }
    else if (event === 'blur') {
      this.hasFocus = false;
    }

    return Backbone.View.prototype.trigger.apply(this, arguments);
  },

  /**
   * Returns a validation function based on the type defined in the schema
   *
   * @param {RegExp|String|Function} validator
   * @return {Function}
   */
  getValidator: function(validator) {
    var validators = Form.validators;

    //Convert regular expressions to validators
    if (_.isRegExp(validator)) {
      return validators.regexp({ regexp: validator });
    }
    
    //Use a built-in validator if given a string
    if (_.isString(validator)) {
      if (!validators[validator]) throw new Error('Validator "'+validator+'" not found');
      
      return validators[validator]();
    }

    //Functions can be used directly
    if (_.isFunction(validator)) return validator;

    //Use a customised built-in validator if given an object
    if (_.isObject(validator) && validator.type) {
      var config = validator;
      
      return validators[config.type](config);
    }
    
    //Unkown validator type
    throw new Error('Invalid validator: ' + validator);
  }
});

/**
 * Text
 * 
 * Text input with focus, blur and change events
 */
Form.editors.Text = Form.Editor.extend({

  tagName: 'input',

  defaultValue: '',

  previousValue: '',

  events: {
    'keyup':    'determineChange',
    'keypress': function(event) {
      var self = this;
      setTimeout(function() {
        self.determineChange();
      }, 0);
    },
    'select':   function(event) {
      this.trigger('select', this);
    },
    'focus':    function(event) {
      this.trigger('focus', this);
    },
    'blur':     function(event) {
      this.trigger('blur', this);
    }
  },

  initialize: function(options) {
    Form.editors.Base.prototype.initialize.call(this, options);

    var schema = this.schema;

    //Allow customising text type (email, phone etc.) for HTML5 browsers
    var type = 'text';

    if (schema && schema.editorAttrs && schema.editorAttrs.type) type = schema.editorAttrs.type;
    if (schema && schema.dataType) type = schema.dataType;

    this.$el.attr('type', type);
  },

  /**
   * Adds the editor to the DOM
   */
  render: function() {
    this.setValue(this.value);

    return this;
  },

  determineChange: function(event) {
    var currentValue = this.$el.val();
    var changed = (currentValue !== this.previousValue);

    if (changed) {
      this.previousValue = currentValue;

      this.trigger('change', this);
    }
  },

  /**
   * Returns the current editor value
   * @return {String}
   */
  getValue: function() {
    return this.$el.val();
  },

  /**
   * Sets the value of the form element
   * @param {String}
   */
  setValue: function(value) {
    this.$el.val(value);
  },

  focus: function() {
    if (this.hasFocus) return;

    this.$el.focus();
  },

  blur: function() {
    if (!this.hasFocus) return;

    this.$el.blur();
  },

  select: function() {
    this.$el.select();
  }

});

/**
 * TextArea editor
 */
Form.editors.TextArea = Form.editors.Text.extend({

  tagName: 'textarea',

  /**
   * Override Text constructor so type property isn't set (issue #261)
   */
  initialize: function(options) {
    Form.editors.Base.prototype.initialize.call(this, options);
  }

});

/**
 * Password editor
 */
Form.editors.Password = Form.editors.Text.extend({

  initialize: function(options) {
    Form.editors.Text.prototype.initialize.call(this, options);

    this.$el.attr('type', 'password');
  }

});

/**
 * NUMBER
 * 
 * Normal text input that only allows a number. Letters etc. are not entered.
 */
Form.editors.Number = Form.editors.Text.extend({

  defaultValue: 0,

  events: _.extend({}, Form.editors.Text.prototype.events, {
    'keypress': 'onKeyPress',
    'change': 'onKeyPress'
  }),

  initialize: function(options) {
    Form.editors.Text.prototype.initialize.call(this, options);

    var schema = this.schema;

    this.$el.attr('type', 'number');

    if (!schema || !schema.editorAttrs || !schema.editorAttrs.step) {
      // provide a default for `step` attr,
      // but don't overwrite if already specified
      this.$el.attr('step', 'any');
    }
  },

  /**
   * Check value is numeric
   */
  onKeyPress: function(event) {
    var self = this,
        delayedDetermineChange = function() {
          setTimeout(function() {
            self.determineChange();
          }, 0);
        };

    //Allow backspace
    if (event.charCode === 0) {
      delayedDetermineChange();
      return;
    }

    //Get the whole new value so that we can prevent things like double decimals points etc.
    var newVal = this.$el.val()
    if( event.charCode != undefined ) {
      newVal = newVal + String.fromCharCode(event.charCode);
    }

    var numeric = /^[0-9]*\.?[0-9]*?$/.test(newVal);

    if (numeric) {
      delayedDetermineChange();
    }
    else {
      event.preventDefault();
    }
  },

  getValue: function() {
    var value = this.$el.val();

    return value === "" ? null : parseFloat(value, 10);
  },

  setValue: function(value) {
    value = (function() {
      if (_.isNumber(value)) return value;

      if (_.isString(value) && value !== '') return parseFloat(value, 10);

      return null;
    })();

    if (_.isNaN(value)) value = null;

    Form.editors.Text.prototype.setValue.call(this, value);
  }

});

/**
 * Hidden editor
 */
Form.editors.Hidden = Form.editors.Text.extend({

  defaultValue: '',

  initialize: function(options) {
    Form.editors.Text.prototype.initialize.call(this, options);

    this.$el.attr('type', 'hidden');
  },

  focus: function() {

  },

  blur: function() {

  }

});

/**
 * Checkbox editor
 *
 * Creates a single checkbox, i.e. boolean value
 */
Form.editors.Checkbox = Form.editors.Base.extend({

  defaultValue: false,

  tagName: 'input',

  events: {
    'click':  function(event) {
      this.trigger('change', this);
    },
    'focus':  function(event) {
      this.trigger('focus', this);
    },
    'blur':   function(event) {
      this.trigger('blur', this);
    }
  },

  initialize: function(options) {
    Form.editors.Base.prototype.initialize.call(this, options);

    this.$el.attr('type', 'checkbox');
  },

  /**
   * Adds the editor to the DOM
   */
  render: function() {
    this.setValue(this.value);

    return this;
  },

  getValue: function() {
    return this.$el.prop('checked');
  },

  setValue: function(value) {
    if (value) {
      this.$el.prop('checked', true);
    }else{
      this.$el.prop('checked', false);
    }
  },

  focus: function() {
    if (this.hasFocus) return;

    this.$el.focus();
  },

  blur: function() {
    if (!this.hasFocus) return;

    this.$el.blur();
  }

});

/**
 * Select editor
 *
 * Renders a <select> with given options
 *
 * Requires an 'options' value on the schema.
 *  Can be an array of options, a function that calls back with the array of options, a string of HTML
 *  or a Backbone collection. If a collection, the models must implement a toString() method
 */
Form.editors.Select = Form.editors.Base.extend({

  tagName: 'select',

  events: {
    'change': function(event) {
      this.trigger('change', this);
    },
    'focus':  function(event) {
      this.trigger('focus', this);
    },
    'blur':   function(event) {
      this.trigger('blur', this);
    }
  },

  initialize: function(options) {
    Form.editors.Base.prototype.initialize.call(this, options);

    if (!this.schema || !this.schema.options) throw new Error("Missing required 'schema.options'");
  },

  render: function() {
    this.setOptions(this.schema.options);

    return this;
  },

  /**
   * Sets the options that populate the <select>
   *
   * @param {Mixed} options
   */
  setOptions: function(options) {
    var self = this;

    //If a collection was passed, check if it needs fetching
    if (options instanceof Backbone.Collection) {
      var collection = options;

      //Don't do the fetch if it's already populated
      if (collection.length > 0) {
        this.renderOptions(options);
      } else {
        collection.fetch({
          success: function(collection) {
            self.renderOptions(options);
          }
        });
      }
    }

    //If a function was passed, run it to get the options
    else if (_.isFunction(options)) {
      options(function(result) {
        self.renderOptions(result);
      }, self);
    }

    //Otherwise, ready to go straight to renderOptions
    else {
      this.renderOptions(options);
    }
  },

  /**
   * Adds the <option> html to the DOM
   * @param {Mixed}   Options as a simple array e.g. ['option1', 'option2']
   *                      or as an array of objects e.g. [{val: 543, label: 'Title for object 543'}]
   *                      or as a string of <option> HTML to insert into the <select>
   *                      or any object
   */
  renderOptions: function(options) {
    var $select = this.$el,
        html;

    html = this._getOptionsHtml(options);

    //Insert options
    $select.html(html);

    //Select correct option
    this.setValue(this.value);
  },

  _getOptionsHtml: function(options) {
    var html;
    //Accept string of HTML
    if (_.isString(options)) {
      html = options;
    }

    //Or array
    else if (_.isArray(options)) {
      html = this._arrayToHtml(options);
    }

    //Or Backbone collection
    else if (options instanceof Backbone.Collection) {
      html = this._collectionToHtml(options);
    }

    else if (_.isFunction(options)) {
      var newOptions;

      options(function(opts) {
        newOptions = opts;
      }, this);

      html = this._getOptionsHtml(newOptions);
    //Or any object
    }else{
      html=this._objectToHtml(options);
    }

    return html;
  },


  getValue: function() {
    return this.$el.val();
  },

  setValue: function(value) {
    this.$el.val(value);
  },

  focus: function() {
    if (this.hasFocus) return;

    this.$el.focus();
  },

  blur: function() {
    if (!this.hasFocus) return;

    this.$el.blur();
  },

  /**
   * Transforms a collection into HTML ready to use in the renderOptions method
   * @param {Backbone.Collection}
   * @return {String}
   */
  _collectionToHtml: function(collection) {
    //Convert collection to array first
    var array = [];
    collection.each(function(model) {
      array.push({ val: model.id, label: model.toString() });
    });

    //Now convert to HTML
    var html = this._arrayToHtml(array);

    return html;
  },
  /**
   * Transforms an object into HTML ready to use in the renderOptions method
   * @param {Object}
   * @return {String}
   */
  _objectToHtml: function(obj) {
    //Convert object to array first
    var array = [];
    for(var key in obj){
      if( obj.hasOwnProperty( key ) ) {
        array.push({ val: key, label: obj[key] });
      }
    }

    //Now convert to HTML
    var html = this._arrayToHtml(array);

    return html;
  },



  /**
   * Create the <option> HTML
   * @param {Array}   Options as a simple array e.g. ['option1', 'option2']
   *                      or as an array of objects e.g. [{val: 543, label: 'Title for object 543'}]
   * @return {String} HTML
   */
  _arrayToHtml: function(array) {
    var html = [];

    //Generate HTML
    _.each(array, function(option) {
      if (_.isObject(option)) {
        if (option.group) {
          html.push('<optgroup label="'+option.group+'">');
          html.push(this._getOptionsHtml(option.options))
          html.push('</optgroup>');
        } else {
          var val = (option.val || option.val === 0) ? option.val : '';
          html.push('<option value="'+val+'">'+option.label+'</option>');
        }
      }
      else {
        html.push('<option>'+option+'</option>');
      }
    }, this);

    return html.join('');
  }

});

/**
 * Radio editor
 *
 * Renders a <ul> with given options represented as <li> objects containing radio buttons
 *
 * Requires an 'options' value on the schema.
 *  Can be an array of options, a function that calls back with the array of options, a string of HTML
 *  or a Backbone collection. If a collection, the models must implement a toString() method
 */
Form.editors.Radio = Form.editors.Select.extend({

  tagName: 'ul',

  events: {
    'change input[type=radio]': function() {
      this.trigger('change', this);
    },
    'focus input[type=radio]': function() {
      if (this.hasFocus) return;
      this.trigger('focus', this);
    },
    'blur input[type=radio]': function() {
      if (!this.hasFocus) return;
      var self = this;
      setTimeout(function() {
        if (self.$('input[type=radio]:focus')[0]) return;
        self.trigger('blur', self);
      }, 0);
    }
  },

  /**
   * Returns the template. Override for custom templates
   *
   * @return {Function}       Compiled template
   */
  getTemplate: function() {
    return this.schema.template || this.constructor.template;
  },

  getValue: function() {
    return this.$('input[type=radio]:checked').val();
  },

  setValue: function(value) {
    this.$('input[type=radio]').val([value]);
  },

  focus: function() {
    if (this.hasFocus) return;

    var checked = this.$('input[type=radio]:checked');
    if (checked[0]) {
      checked.focus();
      return;
    }

    this.$('input[type=radio]').first().focus();
  },

  blur: function() {
    if (!this.hasFocus) return;

    this.$('input[type=radio]:focus').blur();
  },

  /**
   * Create the radio list HTML
   * @param {Array}   Options as a simple array e.g. ['option1', 'option2']
   *                      or as an array of objects e.g. [{val: 543, label: 'Title for object 543'}]
   * @return {String} HTML
   */
  _arrayToHtml: function (array) {
    var self = this;

    var template = this.getTemplate(),
        name = self.getName(),
        id = self.id;

    var items = _.map(array, function(option, index) {
      var item = {
        name: name,
        id: id + '-' + index
      }

      if (_.isObject(option)) {
        item.value = (option.val || option.val === 0) ? option.val : '';
        item.label = option.label;
      } else {
        item.value = option;
        item.label = option;
      }

      return item;
    });

    return template({ items: items });
  }

}, {

  //STATICS
  template: _.template('\
    <ul>\
      <% _.each(items, function(item) { %>\
        <li>\
          <input type="radio" name="<%= item.name %>" value="<%= item.value %>" id="<%= item.id %>" />\
          <label for="<%= item.id %>"><%= item.label %></label>\
        </li>\
      <% }); %>\
    </ul>\
  ', null, Form.templateSettings)

});

/**
 * Checkboxes editor
 *
 * Renders a <ul> with given options represented as <li> objects containing checkboxes
 *
 * Requires an 'options' value on the schema.
 *  Can be an array of options, a function that calls back with the array of options, a string of HTML
 *  or a Backbone collection. If a collection, the models must implement a toString() method
 */
Form.editors.Checkboxes = Form.editors.Select.extend({

  tagName: 'ul',

  groupNumber: 0,

  events: {
    'click input[type=checkbox]': function() {
      this.trigger('change', this);
    },
    'focus input[type=checkbox]': function() {
      if (this.hasFocus) return;
      this.trigger('focus', this);
    },
    'blur input[type=checkbox]':  function() {
      if (!this.hasFocus) return;
      var self = this;
      setTimeout(function() {
        if (self.$('input[type=checkbox]:focus')[0]) return;
        self.trigger('blur', self);
      }, 0);
    }
  },

  getValue: function() {
    var values = [];
    this.$('input[type=checkbox]:checked').each(function() {
      values.push($(this).val());
    });
    return values;
  },

  setValue: function(values) {
    if (!_.isArray(values)) values = [values];
    this.$('input[type=checkbox]').val(values);
  },

  focus: function() {
    if (this.hasFocus) return;

    this.$('input[type=checkbox]').first().focus();
  },

  blur: function() {
    if (!this.hasFocus) return;

    this.$('input[type=checkbox]:focus').blur();
  },

  /**
   * Create the checkbox list HTML
   * @param {Array}   Options as a simple array e.g. ['option1', 'option2']
   *                      or as an array of objects e.g. [{val: 543, label: 'Title for object 543'}]
   * @return {String} HTML
   */
  _arrayToHtml: function (array) {
    var html = [];
    var self = this;

    _.each(array, function(option, index) {
      var itemHtml = '<li>';
			var close = true;
      if (_.isObject(option)) {
        if (option.group) {
          var originalId = self.id;
          self.id += "-" + self.groupNumber++; 
          itemHtml = ('<fieldset class="group"> <legend>'+option.group+'</legend>');
          itemHtml += (self._arrayToHtml(option.options));
          itemHtml += ('</fieldset>');
          self.id = originalId;
					close = false;
        }else{
          var val = (option.val || option.val === 0) ? option.val : '';
          itemHtml += ('<input type="checkbox" name="'+self.getName()+'" value="'+val+'" id="'+self.id+'-'+index+'" />');
          itemHtml += ('<label for="'+self.id+'-'+index+'">'+option.label+'</label>');
        }
      }
      else {
        itemHtml += ('<input type="checkbox" name="'+self.getName()+'" value="'+option+'" id="'+self.id+'-'+index+'" />');
        itemHtml += ('<label for="'+self.id+'-'+index+'">'+option+'</label>');
      }
			if(close){
				itemHtml += '</li>';
			}
      html.push(itemHtml);
    });

    return html.join('');
  }

});

/**
 * Object editor
 *
 * Creates a child form. For editing Javascript objects
 *
 * @param {Object} options
 * @param {Form} options.form                 The form this editor belongs to; used to determine the constructor for the nested form
 * @param {Object} options.schema             The schema for the object
 * @param {Object} options.schema.subSchema   The schema for the nested form
 */
Form.editors.Object = Form.editors.Base.extend({
  //Prevent error classes being set on the main control; they are internally on the individual fields
  hasNestedForm: true,

  initialize: function(options) {
    //Set default value for the instance so it's not a shared object
    this.value = {};

    //Init
    Form.editors.Base.prototype.initialize.call(this, options);

    //Check required options
    if (!this.form) throw new Error('Missing required option "form"');
    if (!this.schema.subSchema) throw new Error("Missing required 'schema.subSchema' option for Object editor");
  },

  render: function() {
    //Get the constructor for creating the nested form; i.e. the same constructor as used by the parent form
    var NestedForm = this.form.constructor;

    //Create the nested form
    this.nestedForm = new NestedForm({
      schema: this.schema.subSchema,
      data: this.value,
      idPrefix: this.id + '_',
      Field: NestedForm.NestedField
    });

    this._observeFormEvents();

    this.$el.html(this.nestedForm.render().el);

    if (this.hasFocus) this.trigger('blur', this);

    return this;
  },

  getValue: function() {
    if (this.nestedForm) return this.nestedForm.getValue();

    return this.value;
  },

  setValue: function(value) {
    this.value = value;

    this.render();
  },

  focus: function() {
    if (this.hasFocus) return;

    this.nestedForm.focus();
  },

  blur: function() {
    if (!this.hasFocus) return;

    this.nestedForm.blur();
  },

  remove: function() {
    this.nestedForm.remove();

    Backbone.View.prototype.remove.call(this);
  },

  validate: function() {
    return this.nestedForm.validate();
  },

  _observeFormEvents: function() {
    if (!this.nestedForm) return;
    
    this.nestedForm.on('all', function() {
      // args = ["key:change", form, fieldEditor]
      var args = _.toArray(arguments);
      args[1] = this;
      // args = ["key:change", this=objectEditor, fieldEditor]

      this.trigger.apply(this, args);
    }, this);
  }

});

/**
 * NestedModel editor
 *
 * Creates a child form. For editing nested Backbone models
 *
 * Special options:
 *   schema.model:   Embedded model constructor
 */
Form.editors.NestedModel = Form.editors.Object.extend({
  initialize: function(options) {
    Form.editors.Base.prototype.initialize.call(this, options);

    if (!this.form) throw new Error('Missing required option "form"');
    if (!options.schema.model) throw new Error('Missing required "schema.model" option for NestedModel editor');
  },

  render: function() {
    //Get the constructor for creating the nested form; i.e. the same constructor as used by the parent form
    var NestedForm = this.form.constructor;

    var data = this.value || {},
        key = this.key,
        nestedModel = this.schema.model;

    //Wrap the data in a model if it isn't already a model instance
    var modelInstance = (data.constructor === nestedModel) ? data : new nestedModel(data);

    this.nestedForm = new NestedForm({
      model: modelInstance,
      idPrefix: this.id + '_',
      fieldTemplate: 'nestedField'
    });

    this._observeFormEvents();

    //Render form
    this.$el.html(this.nestedForm.render().el);

    if (this.hasFocus) this.trigger('blur', this);

    return this;
  },

  /**
   * Update the embedded model, checking for nested validation errors and pass them up
   * Then update the main model if all OK
   *
   * @return {Error|null} Validation error or null
   */
  commit: function() {
    var error = this.nestedForm.commit();
    if (error) {
      this.$el.addClass('error');
      return error;
    }

    return Form.editors.Object.prototype.commit.call(this);
  }

});

/**
 * Date editor
 *
 * Schema options
 * @param {Number|String} [options.schema.yearStart]  First year in list. Default: 100 years ago
 * @param {Number|String} [options.schema.yearEnd]    Last year in list. Default: current year
 *
 * Config options (if not set, defaults to options stored on the main Date class)
 * @param {Boolean} [options.showMonthNames]  Use month names instead of numbers. Default: true
 * @param {String[]} [options.monthNames]     Month names. Default: Full English names
 */
Form.editors.Date = Form.editors.Base.extend({

  events: {
    'change select':  function() {
      this.updateHidden();
      this.trigger('change', this);
    },
    'focus select':   function() {
      if (this.hasFocus) return;
      this.trigger('focus', this);
    },
    'blur select':    function() {
      if (!this.hasFocus) return;
      var self = this;
      setTimeout(function() {
        if (self.$('select:focus')[0]) return;
        self.trigger('blur', self);
      }, 0);
    }
  },

  initialize: function(options) {
    options = options || {};

    Form.editors.Base.prototype.initialize.call(this, options);

    var Self = Form.editors.Date,
        today = new Date();

    //Option defaults
    this.options = _.extend({
      monthNames: Self.monthNames,
      showMonthNames: Self.showMonthNames
    }, options);

    //Schema defaults
    this.schema = _.extend({
      yearStart: today.getFullYear() - 100,
      yearEnd: today.getFullYear()
    }, options.schema || {});

    //Cast to Date
    if (this.value && !_.isDate(this.value)) {
      this.value = new Date(this.value);
    }

    //Set default date
    if (!this.value) {
      var date = new Date();
      date.setSeconds(0);
      date.setMilliseconds(0);

      this.value = date;
    }

    //Template
    this.template = options.template || this.constructor.template;
  },

  render: function() {
    var options = this.options,
        schema = this.schema;

    var datesOptions = _.map(_.range(1, 32), function(date) {
      return '<option value="'+date+'">' + date + '</option>';
    });

    var monthsOptions = _.map(_.range(0, 12), function(month) {
      var value = (options.showMonthNames)
          ? options.monthNames[month]
          : (month + 1);

      return '<option value="'+month+'">' + value + '</option>';
    });

    var yearRange = (schema.yearStart < schema.yearEnd)
      ? _.range(schema.yearStart, schema.yearEnd + 1)
      : _.range(schema.yearStart, schema.yearEnd - 1, -1);

    var yearsOptions = _.map(yearRange, function(year) {
      return '<option value="'+year+'">' + year + '</option>';
    });

    //Render the selects
    var $el = $($.trim(this.template({
      dates: datesOptions.join(''),
      months: monthsOptions.join(''),
      years: yearsOptions.join('')
    })));

    //Store references to selects
    this.$date = $el.find('[data-type="date"]');
    this.$month = $el.find('[data-type="month"]');
    this.$year = $el.find('[data-type="year"]');

    //Create the hidden field to store values in case POSTed to server
    this.$hidden = $('<input type="hidden" name="'+this.key+'" />');
    $el.append(this.$hidden);

    //Set value on this and hidden field
    this.setValue(this.value);

    //Remove the wrapper tag
    this.setElement($el);
    this.$el.attr('id', this.id);
    this.$el.attr('name', this.getName());

    if (this.hasFocus) this.trigger('blur', this);

    return this;
  },

  /**
   * @return {Date}   Selected date
   */
  getValue: function() {
    var year = this.$year.val(),
        month = this.$month.val(),
        date = this.$date.val();

    if (!year || !month || !date) return null;

    return new Date(year, month, date);
  },

  /**
   * @param {Date} date
   */
  setValue: function(date) {
    this.$date.val(date.getDate());
    this.$month.val(date.getMonth());
    this.$year.val(date.getFullYear());

    this.updateHidden();
  },

  focus: function() {
    if (this.hasFocus) return;

    this.$('select').first().focus();
  },

  blur: function() {
    if (!this.hasFocus) return;

    this.$('select:focus').blur();
  },

  /**
   * Update the hidden input which is maintained for when submitting a form
   * via a normal browser POST
   */
  updateHidden: function() {
    var val = this.getValue();

    if (_.isDate(val)) val = val.toISOString();

    this.$hidden.val(val);
  }

}, {
  //STATICS
  template: _.template('\
    <div>\
      <select data-type="date"><%= dates %></select>\
      <select data-type="month"><%= months %></select>\
      <select data-type="year"><%= years %></select>\
    </div>\
  ', null, Form.templateSettings),

  //Whether to show month names instead of numbers
  showMonthNames: true,

  //Month names to use if showMonthNames is true
  //Replace for localisation, e.g. Form.editors.Date.monthNames = ['Janvier', 'Fevrier'...]
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
});

/**
 * DateTime editor
 *
 * @param {Editor} [options.DateEditor]           Date editor view to use (not definition)
 * @param {Number} [options.schema.minsInterval]  Interval between minutes. Default: 15
 */
Form.editors.DateTime = Form.editors.Base.extend({

  events: {
    'change select':  function() {
      this.updateHidden();
      this.trigger('change', this);
    },
    'focus select':   function() {
      if (this.hasFocus) return;
      this.trigger('focus', this);
    },
    'blur select':    function() {
      if (!this.hasFocus) return;
      var self = this;
      setTimeout(function() {
        if (self.$('select:focus')[0]) return;
        self.trigger('blur', self);
      }, 0);
    }
  },

  initialize: function(options) {
    options = options || {};

    Form.editors.Base.prototype.initialize.call(this, options);

    //Option defaults
    this.options = _.extend({
      DateEditor: Form.editors.DateTime.DateEditor
    }, options);

    //Schema defaults
    this.schema = _.extend({
      minsInterval: 15
    }, options.schema || {});

    //Create embedded date editor
    this.dateEditor = new this.options.DateEditor(options);

    this.value = this.dateEditor.value;

    //Template
    this.template = options.template || this.constructor.template;
  },

  render: function() {
    function pad(n) {
      return n < 10 ? '0' + n : n;
    }

    var schema = this.schema;

    //Create options
    var hoursOptions = _.map(_.range(0, 24), function(hour) {
      return '<option value="'+hour+'">' + pad(hour) + '</option>';
    });

    var minsOptions = _.map(_.range(0, 60, schema.minsInterval), function(min) {
      return '<option value="'+min+'">' + pad(min) + '</option>';
    });

    //Render time selects
    var $el = $($.trim(this.template({
      hours: hoursOptions.join(),
      mins: minsOptions.join()
    })));

    //Include the date editor
    $el.find('[data-date]').append(this.dateEditor.render().el);

    //Store references to selects
    this.$hour = $el.find('select[data-type="hour"]');
    this.$min = $el.find('select[data-type="min"]');

    //Get the hidden date field to store values in case POSTed to server
    this.$hidden = $el.find('input[type="hidden"]');

    //Set time
    this.setValue(this.value);

    this.setElement($el);
    this.$el.attr('id', this.id);
    this.$el.attr('name', this.getName());

    if (this.hasFocus) this.trigger('blur', this);

    return this;
  },

  /**
   * @return {Date}   Selected datetime
   */
  getValue: function() {
    var date = this.dateEditor.getValue();

    var hour = this.$hour.val(),
        min = this.$min.val();

    if (!date || !hour || !min) return null;

    date.setHours(hour);
    date.setMinutes(min);

    return date;
  },

  /**
   * @param {Date}
   */
  setValue: function(date) {
    if (!_.isDate(date)) date = new Date(date);

    this.dateEditor.setValue(date);

    this.$hour.val(date.getHours());
    this.$min.val(date.getMinutes());

    this.updateHidden();
  },

  focus: function() {
    if (this.hasFocus) return;

    this.$('select').first().focus();
  },

  blur: function() {
    if (!this.hasFocus) return;

    this.$('select:focus').blur();
  },

  /**
   * Update the hidden input which is maintained for when submitting a form
   * via a normal browser POST
   */
  updateHidden: function() {
    var val = this.getValue();
    if (_.isDate(val)) val = val.toISOString();

    this.$hidden.val(val);
  },

  /**
   * Remove the Date editor before removing self
   */
  remove: function() {
    this.dateEditor.remove();

    Form.editors.Base.prototype.remove.call(this);
  }

}, {
  //STATICS
  template: _.template('\
    <div class="bbf-datetime">\
      <div class="bbf-date-container" data-date></div>\
      <select data-type="hour"><%= hours %></select>\
      :\
      <select data-type="min"><%= mins %></select>\
    </div>\
  ', null, Form.templateSettings),

  //The date editor to use (constructor function, not instance)
  DateEditor: Form.editors.Date
});



  //Metadata
  Form.VERSION = '0.14.0';


  //Exports
  Backbone.Form = Form;
  if (typeof module !== 'undefined') module.exports = Form;

})(window || global || this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"backbone":undefined,"jquery":undefined,"underscore":undefined}],103:[function(require,module,exports){
;

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

;(function(Form) {

  /**
   * List editor
   * 
   * An array editor. Creates a list of other editor items.
   *
   * Special options:
   * @param {String} [options.schema.itemType]          The editor type for each item in the list. Default: 'Text'
   * @param {String} [options.schema.confirmDelete]     Text to display in a delete confirmation dialog. If falsey, will not ask for confirmation.
   */
  Form.editors.List = Form.editors.Base.extend({

    events: {
      'click [data-action="add"]': function(event) {
        event.preventDefault();
        this.addItem(null, true);
      }
    },

    initialize: function(options) {
      options = options || {};

      var editors = Form.editors;

      editors.Base.prototype.initialize.call(this, options);

      var schema = this.schema;
      if (!schema) throw new Error("Missing required option 'schema'");

      this.template = options.template || this.constructor.template;

      //Determine the editor to use
      this.Editor = (function() {
        var type = schema.itemType;

        //Default to Text
        if (!type) return editors.Text;

        //Use List-specific version if available
        if (editors.List[type]) return editors.List[type];

        //Or whichever was passed
        return editors[type];
      })();

      this.items = [];
    },

    render: function() {
      var self = this,
          value = this.value || [];

      //Create main element
      var $el = $($.trim(this.template()));

      //Store a reference to the list (item container)
      this.$list = $el.is('[data-items]') ? $el : $el.find('[data-items]');

      //Add existing items
      if (value.length) {
        _.each(value, function(itemValue) {
          self.addItem(itemValue);
        });
      }

      //If no existing items create an empty one, unless the editor specifies otherwise
      else {
        if (!this.Editor.isAsync) this.addItem();
      }

      this.setElement($el);
      this.$el.attr('id', this.id);
      this.$el.attr('name', this.key);
            
      if (this.hasFocus) this.trigger('blur', this);
      
      return this;
    },

    /**
     * Add a new item to the list
     * @param {Mixed} [value]           Value for the new item editor
     * @param {Boolean} [userInitiated] If the item was added by the user clicking 'add'
     */
    addItem: function(value, userInitiated) {
      var self = this,
          editors = Form.editors;

      //Create the item
      var item = new editors.List.Item({
        list: this,
        form: this.form,
        schema: this.schema,
        value: value,
        Editor: this.Editor,
        key: this.key
      }).render();
      
      var _addItem = function() {
        self.items.push(item);
        self.$list.append(item.el);
        
        item.editor.on('all', function(event) {
          if (event === 'change') return;

          // args = ["key:change", itemEditor, fieldEditor]
          var args = _.toArray(arguments);
          args[0] = 'item:' + event;
          args.splice(1, 0, self);
          // args = ["item:key:change", this=listEditor, itemEditor, fieldEditor]

          editors.List.prototype.trigger.apply(this, args);
        }, self);

        item.editor.on('change', function() {
          if (!item.addEventTriggered) {
            item.addEventTriggered = true;
            this.trigger('add', this, item.editor);
          }
          this.trigger('item:change', this, item.editor);
          this.trigger('change', this);
        }, self);

        item.editor.on('focus', function() {
          if (this.hasFocus) return;
          this.trigger('focus', this);
        }, self);
        item.editor.on('blur', function() {
          if (!this.hasFocus) return;
          var self = this;
          setTimeout(function() {
            if (_.find(self.items, function(item) { return item.editor.hasFocus; })) return;
            self.trigger('blur', self);
          }, 0);
        }, self);
        
        if (userInitiated || value) {
          item.addEventTriggered = true;
        }
        
        if (userInitiated) {
          self.trigger('add', self, item.editor);
          self.trigger('change', self);
        }
      };

      //Check if we need to wait for the item to complete before adding to the list
      if (this.Editor.isAsync) {
        item.editor.on('readyToAdd', _addItem, this);
      }

      //Most editors can be added automatically
      else {
        _addItem();
        item.editor.focus();
      }
      
      return item;
    },

    /**
     * Remove an item from the list
     * @param {List.Item} item
     */
    removeItem: function(item) {
      //Confirm delete
      var confirmMsg = this.schema.confirmDelete;
      if (confirmMsg && !confirm(confirmMsg)) return;

      var index = _.indexOf(this.items, item);

      this.items[index].remove();
      this.items.splice(index, 1);
      
      if (item.addEventTriggered) {
        this.trigger('remove', this, item.editor);
        this.trigger('change', this);
      }

      if (!this.items.length && !this.Editor.isAsync) this.addItem();
    },

    getValue: function() {
      var values = _.map(this.items, function(item) {
        return item.getValue();
      });

      //Filter empty items
      return _.without(values, undefined, '');
    },

    setValue: function(value) {
      this.value = value;
      this.render();
    },
    
    focus: function() {
      if (this.hasFocus) return;

      if (this.items[0]) this.items[0].editor.focus();
    },
    
    blur: function() {
      if (!this.hasFocus) return;

      var focusedItem = _.find(this.items, function(item) { return item.editor.hasFocus; });
      
      if (focusedItem) focusedItem.editor.blur();
    },

    /**
     * Override default remove function in order to remove item views
     */
    remove: function() {
      _.invoke(this.items, 'remove');

      Form.editors.Base.prototype.remove.call(this);
    },
    
    /**
     * Run validation
     * 
     * @return {Object|Null}
     */
    validate: function() {
      if (!this.validators) return null;

      //Collect errors
      var errors = _.map(this.items, function(item) {
        return item.validate();
      });

      //Check if any item has errors
      var hasErrors = _.compact(errors).length ? true : false;
      if (!hasErrors) return null;

      //If so create a shared error
      var fieldError = {
        type: 'list',
        message: 'Some of the items in the list failed validation',
        errors: errors
      };

      return fieldError;
    }
  }, {

    //STATICS
    template: _.template('\
      <div>\
        <div data-items></div>\
        <button type="button" data-action="add">Add</button>\
      </div>\
    ', null, Form.templateSettings)

  });


  /**
   * A single item in the list
   *
   * @param {editors.List} options.list The List editor instance this item belongs to
   * @param {Function} options.Editor   Editor constructor function
   * @param {String} options.key        Model key
   * @param {Mixed} options.value       Value
   * @param {Object} options.schema     Field schema
   */
  Form.editors.List.Item = Form.editors.Base.extend({

    events: {
      'click [data-action="remove"]': function(event) {
        event.preventDefault();
        this.list.removeItem(this);
      },
      'keydown input[type=text]': function(event) {
        if(event.keyCode !== 13) return;
        event.preventDefault();
        this.list.addItem();
        this.list.$list.find("> li:last input").focus();
      }
    },

    initialize: function(options) {
      this.list = options.list;
      this.schema = options.schema || this.list.schema;
      this.value = options.value;
      this.Editor = options.Editor || Form.editors.Text;
      this.key = options.key;
      this.template = options.template || this.schema.itemTemplate || this.constructor.template;
      this.errorClassName = options.errorClassName || this.constructor.errorClassName;
      this.form = options.form;
    },

    render: function() {
      //Create editor
      this.editor = new this.Editor({
        key: this.key,
        schema: this.schema,
        value: this.value,
        list: this.list,
        item: this,
        form: this.form
      }).render();

      //Create main element
      var $el = $($.trim(this.template()));

      $el.find('[data-editor]').append(this.editor.el);

      //Replace the entire element so there isn't a wrapper tag
      this.setElement($el);
        
      return this;
    },

    getValue: function() {
      return this.editor.getValue();
    },

    setValue: function(value) {
      this.editor.setValue(value);
    },
    
    focus: function() {
      this.editor.focus();
    },
    
    blur: function() {
      this.editor.blur();
    },

    remove: function() {
      this.editor.remove();

      Backbone.View.prototype.remove.call(this);
    },

    validate: function() {
      var value = this.getValue(),
          formValues = this.list.form ? this.list.form.getValue() : {},
          validators = this.schema.validators,
          getValidator = this.getValidator;

      if (!validators) return null;

      //Run through validators until an error is found
      var error = null;
      _.every(validators, function(validator) {
        error = getValidator(validator)(value, formValues);

        return error ? false : true;
      });

      //Show/hide error
      if (error){
        this.setError(error);
      } else {
        this.clearError();
      }

      //Return error to be aggregated by list
      return error ? error : null;
    },

    /**
     * Show a validation error
     */
    setError: function(err) {
      this.$el.addClass(this.errorClassName);
      this.$el.attr('title', err.message);
    },

    /**
     * Hide validation errors
     */
    clearError: function() {
      this.$el.removeClass(this.errorClassName);
      this.$el.attr('title', null);
    }
  }, {

    //STATICS
    template: _.template('\
      <div>\
        <span data-editor></span>\
        <button type="button" data-action="remove">&times;</button>\
      </div>\
    ', null, Form.templateSettings),

    errorClassName: 'error'

  });


  /**
   * Base modal object editor for use with the List editor; used by Object 
   * and NestedModal list types
   */
  Form.editors.List.Modal = Form.editors.Base.extend({

    events: {
      'click': 'openEditor'
    },

    /**
     * @param {Object} options
     * @param {Form} options.form                       The main form
     * @param {Function} [options.schema.itemToString]  Function to transform the value for display in the list.
     * @param {String} [options.schema.itemType]        Editor type e.g. 'Text', 'Object'.
     * @param {Object} [options.schema.subSchema]       Schema for nested form,. Required when itemType is 'Object'
     * @param {Function} [options.schema.model]         Model constructor function. Required when itemType is 'NestedModel'
     */
    initialize: function(options) {
      options = options || {};
      
      Form.editors.Base.prototype.initialize.call(this, options);
      
      //Dependencies
      if (!Form.editors.List.Modal.ModalAdapter) throw new Error('A ModalAdapter is required');

      this.form = options.form;
      if (!options.form) throw new Error('Missing required option: "form"');

      //Template
      this.template = options.template || this.constructor.template;
    },

    /**
     * Render the list item representation
     */
    render: function() {
      var self = this;

      //New items in the list are only rendered when the editor has been OK'd
      if (_.isEmpty(this.value)) {
        this.openEditor();
      }

      //But items with values are added automatically
      else {
        this.renderSummary();

        setTimeout(function() {
          self.trigger('readyToAdd');
        }, 0);
      }

      if (this.hasFocus) this.trigger('blur', this);

      return this;
    },

    /**
     * Renders the list item representation
     */
    renderSummary: function() {
      this.$el.html($.trim(this.template({
        summary: this.getStringValue()
      })));
    },

    /**
     * Function which returns a generic string representation of an object
     *
     * @param {Object} value
     * 
     * @return {String}
     */
    itemToString: function(value) {
      var createTitle = function(key) {
        var context = { key: key };

        return Form.Field.prototype.createTitle.call(context);
      };

      value = value || {};

      //Pretty print the object keys and values
      var parts = [];
      _.each(this.nestedSchema, function(schema, key) {
        var desc = schema.title ? schema.title : createTitle(key),
            val = value[key];

        if (_.isUndefined(val) || _.isNull(val)) val = '';

        parts.push(desc + ': ' + val);
      });

      return parts.join('<br />');
    },

    /**
     * Returns the string representation of the object value
     */
    getStringValue: function() {
      var schema = this.schema,
          value = this.getValue();

      if (_.isEmpty(value)) return '[Empty]';

      //If there's a specified toString use that
      if (schema.itemToString) return schema.itemToString(value);
      
      //Otherwise use the generic method or custom overridden method
      return this.itemToString(value);
    },

    openEditor: function() {
      var self = this,
          ModalForm = this.form.constructor;

      var form = this.modalForm = new ModalForm({
        schema: this.nestedSchema,
        data: this.value
      });

      var modal = this.modal = new Form.editors.List.Modal.ModalAdapter({
        content: form,
        animate: true
      });

      modal.open();

      this.trigger('open', this);
      this.trigger('focus', this);

      modal.on('cancel', this.onModalClosed, this);
      
      modal.on('ok', _.bind(this.onModalSubmitted, this));
    },

    /**
     * Called when the user clicks 'OK'.
     * Runs validation and tells the list when ready to add the item
     */
    onModalSubmitted: function() {
      var modal = this.modal,
          form = this.modalForm,
          isNew = !this.value;

      //Stop if there are validation errors
      var error = form.validate();
      if (error) return modal.preventClose();

      //Store form value
      this.value = form.getValue();

      //Render item
      this.renderSummary();

      if (isNew) this.trigger('readyToAdd');
      
      this.trigger('change', this);

      this.onModalClosed();
    },

    /**
     * Cleans up references, triggers events. To be called whenever the modal closes
     */
    onModalClosed: function() {
      this.modal = null;
      this.modalForm = null;

      this.trigger('close', this);
      this.trigger('blur', this);
    },

    getValue: function() {
      return this.value;
    },

    setValue: function(value) {
      this.value = value;
    },
    
    focus: function() {
      if (this.hasFocus) return;

      this.openEditor();
    },
    
    blur: function() {
      if (!this.hasFocus) return;
      
      if (this.modal) {
        this.modal.trigger('cancel');
      }
    }
  }, {
    //STATICS
    template: _.template('\
      <div><%= summary %></div>\
    ', null, Form.templateSettings),

    //The modal adapter that creates and manages the modal dialog.
    //Defaults to BootstrapModal (http://github.com/powmedia/backbone.bootstrap-modal)
    //Can be replaced with another adapter that implements the same interface.
    ModalAdapter: Backbone.BootstrapModal,
    
    //Make the wait list for the 'ready' event before adding the item to the list
    isAsync: true
  });


  Form.editors.List.Object = Form.editors.List.Modal.extend({
    initialize: function () {
      Form.editors.List.Modal.prototype.initialize.apply(this, arguments);

      var schema = this.schema;

      if (!schema.subSchema) throw new Error('Missing required option "schema.subSchema"');

      this.nestedSchema = schema.subSchema;
    }
  });


  Form.editors.List.NestedModel = Form.editors.List.Modal.extend({
    initialize: function() {
      Form.editors.List.Modal.prototype.initialize.apply(this, arguments);

      var schema = this.schema;

      if (!schema.model) throw new Error('Missing required option "schema.model"');

      var nestedSchema = schema.model.prototype.schema;

      this.nestedSchema = (_.isFunction(nestedSchema)) ? nestedSchema() : nestedSchema;
    },

    /**
     * Returns the string representation of the object value
     */
    getStringValue: function() {
      var schema = this.schema,
          value = this.getValue();

      if (_.isEmpty(value)) return null;

      //If there's a specified toString use that
      if (schema.itemToString) return schema.itemToString(value);
      
      //Otherwise use the model
      return new (schema.model)(value).toString();
    }
  });

})(Backbone.Form);


module.exports = Backbone.Form.editors.List
},{"backbone":undefined,"jquery":undefined,"underscore":undefined}],104:[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.jade=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    str =  str || require('fs').readFileSync(filename, 'utf8')
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

},{"fs":2}],2:[function(require,module,exports){

},{}]},{},[1])
(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"fs":2}],105:[function(require,module,exports){

require('../select2/select2.js');
module.exports = window.Select2;

},{"../select2/select2.js":106}],106:[function(require,module,exports){
/*
Copyright 2012 Igor Vaynberg

Version: 3.4.5 Timestamp: Mon Nov  4 08:22:42 PST 2013

This software is licensed under the Apache License, Version 2.0 (the "Apache License") or the GNU
General Public License version 2 (the "GPL License"). You may choose either license to govern your
use of this software only upon the condition that you accept all of the terms of either the Apache
License or the GPL License.

You may obtain a copy of the Apache License and the GPL License at:

    http://www.apache.org/licenses/LICENSE-2.0
    http://www.gnu.org/licenses/gpl-2.0.html

Unless required by applicable law or agreed to in writing, software distributed under the
Apache License or the GPL Licesnse is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the Apache License and the GPL License for
the specific language governing permissions and limitations under the Apache License and the GPL License.
*/
(function ($) {
    if(typeof $.fn.each2 == "undefined") {
        $.extend($.fn, {
            /*
            * 4-10 times faster .each replacement
            * use it carefully, as it overrides jQuery context of element on each iteration
            */
            each2 : function (c) {
                var j = $([0]), i = -1, l = this.length;
                while (
                    ++i < l
                    && (j.context = j[0] = this[i])
                    && c.call(j[0], i, j) !== false //"this"=DOM, i=index, j=jQuery object
                );
                return this;
            }
        });
    }
})(jQuery);

(function ($, undefined) {
    "use strict";
    /*global document, window, jQuery, console */

    if (window.Select2 !== undefined) {
        return;
    }

    var KEY, AbstractSelect2, SingleSelect2, MultiSelect2, nextUid, sizer,
        lastMousePosition={x:0,y:0}, $document, scrollBarDimensions,

    KEY = {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        HOME: 36,
        END: 35,
        BACKSPACE: 8,
        DELETE: 46,
        isArrow: function (k) {
            k = k.which ? k.which : k;
            switch (k) {
            case KEY.LEFT:
            case KEY.RIGHT:
            case KEY.UP:
            case KEY.DOWN:
                return true;
            }
            return false;
        },
        isControl: function (e) {
            var k = e.which;
            switch (k) {
            case KEY.SHIFT:
            case KEY.CTRL:
            case KEY.ALT:
                return true;
            }

            if (e.metaKey) return true;

            return false;
        },
        isFunctionKey: function (k) {
            k = k.which ? k.which : k;
            return k >= 112 && k <= 123;
        }
    },
    MEASURE_SCROLLBAR_TEMPLATE = "<div class='select2-measure-scrollbar'></div>",

    DIACRITICS = {"\u24B6":"A","\uFF21":"A","\u00C0":"A","\u00C1":"A","\u00C2":"A","\u1EA6":"A","\u1EA4":"A","\u1EAA":"A","\u1EA8":"A","\u00C3":"A","\u0100":"A","\u0102":"A","\u1EB0":"A","\u1EAE":"A","\u1EB4":"A","\u1EB2":"A","\u0226":"A","\u01E0":"A","\u00C4":"A","\u01DE":"A","\u1EA2":"A","\u00C5":"A","\u01FA":"A","\u01CD":"A","\u0200":"A","\u0202":"A","\u1EA0":"A","\u1EAC":"A","\u1EB6":"A","\u1E00":"A","\u0104":"A","\u023A":"A","\u2C6F":"A","\uA732":"AA","\u00C6":"AE","\u01FC":"AE","\u01E2":"AE","\uA734":"AO","\uA736":"AU","\uA738":"AV","\uA73A":"AV","\uA73C":"AY","\u24B7":"B","\uFF22":"B","\u1E02":"B","\u1E04":"B","\u1E06":"B","\u0243":"B","\u0182":"B","\u0181":"B","\u24B8":"C","\uFF23":"C","\u0106":"C","\u0108":"C","\u010A":"C","\u010C":"C","\u00C7":"C","\u1E08":"C","\u0187":"C","\u023B":"C","\uA73E":"C","\u24B9":"D","\uFF24":"D","\u1E0A":"D","\u010E":"D","\u1E0C":"D","\u1E10":"D","\u1E12":"D","\u1E0E":"D","\u0110":"D","\u018B":"D","\u018A":"D","\u0189":"D","\uA779":"D","\u01F1":"DZ","\u01C4":"DZ","\u01F2":"Dz","\u01C5":"Dz","\u24BA":"E","\uFF25":"E","\u00C8":"E","\u00C9":"E","\u00CA":"E","\u1EC0":"E","\u1EBE":"E","\u1EC4":"E","\u1EC2":"E","\u1EBC":"E","\u0112":"E","\u1E14":"E","\u1E16":"E","\u0114":"E","\u0116":"E","\u00CB":"E","\u1EBA":"E","\u011A":"E","\u0204":"E","\u0206":"E","\u1EB8":"E","\u1EC6":"E","\u0228":"E","\u1E1C":"E","\u0118":"E","\u1E18":"E","\u1E1A":"E","\u0190":"E","\u018E":"E","\u24BB":"F","\uFF26":"F","\u1E1E":"F","\u0191":"F","\uA77B":"F","\u24BC":"G","\uFF27":"G","\u01F4":"G","\u011C":"G","\u1E20":"G","\u011E":"G","\u0120":"G","\u01E6":"G","\u0122":"G","\u01E4":"G","\u0193":"G","\uA7A0":"G","\uA77D":"G","\uA77E":"G","\u24BD":"H","\uFF28":"H","\u0124":"H","\u1E22":"H","\u1E26":"H","\u021E":"H","\u1E24":"H","\u1E28":"H","\u1E2A":"H","\u0126":"H","\u2C67":"H","\u2C75":"H","\uA78D":"H","\u24BE":"I","\uFF29":"I","\u00CC":"I","\u00CD":"I","\u00CE":"I","\u0128":"I","\u012A":"I","\u012C":"I","\u0130":"I","\u00CF":"I","\u1E2E":"I","\u1EC8":"I","\u01CF":"I","\u0208":"I","\u020A":"I","\u1ECA":"I","\u012E":"I","\u1E2C":"I","\u0197":"I","\u24BF":"J","\uFF2A":"J","\u0134":"J","\u0248":"J","\u24C0":"K","\uFF2B":"K","\u1E30":"K","\u01E8":"K","\u1E32":"K","\u0136":"K","\u1E34":"K","\u0198":"K","\u2C69":"K","\uA740":"K","\uA742":"K","\uA744":"K","\uA7A2":"K","\u24C1":"L","\uFF2C":"L","\u013F":"L","\u0139":"L","\u013D":"L","\u1E36":"L","\u1E38":"L","\u013B":"L","\u1E3C":"L","\u1E3A":"L","\u0141":"L","\u023D":"L","\u2C62":"L","\u2C60":"L","\uA748":"L","\uA746":"L","\uA780":"L","\u01C7":"LJ","\u01C8":"Lj","\u24C2":"M","\uFF2D":"M","\u1E3E":"M","\u1E40":"M","\u1E42":"M","\u2C6E":"M","\u019C":"M","\u24C3":"N","\uFF2E":"N","\u01F8":"N","\u0143":"N","\u00D1":"N","\u1E44":"N","\u0147":"N","\u1E46":"N","\u0145":"N","\u1E4A":"N","\u1E48":"N","\u0220":"N","\u019D":"N","\uA790":"N","\uA7A4":"N","\u01CA":"NJ","\u01CB":"Nj","\u24C4":"O","\uFF2F":"O","\u00D2":"O","\u00D3":"O","\u00D4":"O","\u1ED2":"O","\u1ED0":"O","\u1ED6":"O","\u1ED4":"O","\u00D5":"O","\u1E4C":"O","\u022C":"O","\u1E4E":"O","\u014C":"O","\u1E50":"O","\u1E52":"O","\u014E":"O","\u022E":"O","\u0230":"O","\u00D6":"O","\u022A":"O","\u1ECE":"O","\u0150":"O","\u01D1":"O","\u020C":"O","\u020E":"O","\u01A0":"O","\u1EDC":"O","\u1EDA":"O","\u1EE0":"O","\u1EDE":"O","\u1EE2":"O","\u1ECC":"O","\u1ED8":"O","\u01EA":"O","\u01EC":"O","\u00D8":"O","\u01FE":"O","\u0186":"O","\u019F":"O","\uA74A":"O","\uA74C":"O","\u01A2":"OI","\uA74E":"OO","\u0222":"OU","\u24C5":"P","\uFF30":"P","\u1E54":"P","\u1E56":"P","\u01A4":"P","\u2C63":"P","\uA750":"P","\uA752":"P","\uA754":"P","\u24C6":"Q","\uFF31":"Q","\uA756":"Q","\uA758":"Q","\u024A":"Q","\u24C7":"R","\uFF32":"R","\u0154":"R","\u1E58":"R","\u0158":"R","\u0210":"R","\u0212":"R","\u1E5A":"R","\u1E5C":"R","\u0156":"R","\u1E5E":"R","\u024C":"R","\u2C64":"R","\uA75A":"R","\uA7A6":"R","\uA782":"R","\u24C8":"S","\uFF33":"S","\u1E9E":"S","\u015A":"S","\u1E64":"S","\u015C":"S","\u1E60":"S","\u0160":"S","\u1E66":"S","\u1E62":"S","\u1E68":"S","\u0218":"S","\u015E":"S","\u2C7E":"S","\uA7A8":"S","\uA784":"S","\u24C9":"T","\uFF34":"T","\u1E6A":"T","\u0164":"T","\u1E6C":"T","\u021A":"T","\u0162":"T","\u1E70":"T","\u1E6E":"T","\u0166":"T","\u01AC":"T","\u01AE":"T","\u023E":"T","\uA786":"T","\uA728":"TZ","\u24CA":"U","\uFF35":"U","\u00D9":"U","\u00DA":"U","\u00DB":"U","\u0168":"U","\u1E78":"U","\u016A":"U","\u1E7A":"U","\u016C":"U","\u00DC":"U","\u01DB":"U","\u01D7":"U","\u01D5":"U","\u01D9":"U","\u1EE6":"U","\u016E":"U","\u0170":"U","\u01D3":"U","\u0214":"U","\u0216":"U","\u01AF":"U","\u1EEA":"U","\u1EE8":"U","\u1EEE":"U","\u1EEC":"U","\u1EF0":"U","\u1EE4":"U","\u1E72":"U","\u0172":"U","\u1E76":"U","\u1E74":"U","\u0244":"U","\u24CB":"V","\uFF36":"V","\u1E7C":"V","\u1E7E":"V","\u01B2":"V","\uA75E":"V","\u0245":"V","\uA760":"VY","\u24CC":"W","\uFF37":"W","\u1E80":"W","\u1E82":"W","\u0174":"W","\u1E86":"W","\u1E84":"W","\u1E88":"W","\u2C72":"W","\u24CD":"X","\uFF38":"X","\u1E8A":"X","\u1E8C":"X","\u24CE":"Y","\uFF39":"Y","\u1EF2":"Y","\u00DD":"Y","\u0176":"Y","\u1EF8":"Y","\u0232":"Y","\u1E8E":"Y","\u0178":"Y","\u1EF6":"Y","\u1EF4":"Y","\u01B3":"Y","\u024E":"Y","\u1EFE":"Y","\u24CF":"Z","\uFF3A":"Z","\u0179":"Z","\u1E90":"Z","\u017B":"Z","\u017D":"Z","\u1E92":"Z","\u1E94":"Z","\u01B5":"Z","\u0224":"Z","\u2C7F":"Z","\u2C6B":"Z","\uA762":"Z","\u24D0":"a","\uFF41":"a","\u1E9A":"a","\u00E0":"a","\u00E1":"a","\u00E2":"a","\u1EA7":"a","\u1EA5":"a","\u1EAB":"a","\u1EA9":"a","\u00E3":"a","\u0101":"a","\u0103":"a","\u1EB1":"a","\u1EAF":"a","\u1EB5":"a","\u1EB3":"a","\u0227":"a","\u01E1":"a","\u00E4":"a","\u01DF":"a","\u1EA3":"a","\u00E5":"a","\u01FB":"a","\u01CE":"a","\u0201":"a","\u0203":"a","\u1EA1":"a","\u1EAD":"a","\u1EB7":"a","\u1E01":"a","\u0105":"a","\u2C65":"a","\u0250":"a","\uA733":"aa","\u00E6":"ae","\u01FD":"ae","\u01E3":"ae","\uA735":"ao","\uA737":"au","\uA739":"av","\uA73B":"av","\uA73D":"ay","\u24D1":"b","\uFF42":"b","\u1E03":"b","\u1E05":"b","\u1E07":"b","\u0180":"b","\u0183":"b","\u0253":"b","\u24D2":"c","\uFF43":"c","\u0107":"c","\u0109":"c","\u010B":"c","\u010D":"c","\u00E7":"c","\u1E09":"c","\u0188":"c","\u023C":"c","\uA73F":"c","\u2184":"c","\u24D3":"d","\uFF44":"d","\u1E0B":"d","\u010F":"d","\u1E0D":"d","\u1E11":"d","\u1E13":"d","\u1E0F":"d","\u0111":"d","\u018C":"d","\u0256":"d","\u0257":"d","\uA77A":"d","\u01F3":"dz","\u01C6":"dz","\u24D4":"e","\uFF45":"e","\u00E8":"e","\u00E9":"e","\u00EA":"e","\u1EC1":"e","\u1EBF":"e","\u1EC5":"e","\u1EC3":"e","\u1EBD":"e","\u0113":"e","\u1E15":"e","\u1E17":"e","\u0115":"e","\u0117":"e","\u00EB":"e","\u1EBB":"e","\u011B":"e","\u0205":"e","\u0207":"e","\u1EB9":"e","\u1EC7":"e","\u0229":"e","\u1E1D":"e","\u0119":"e","\u1E19":"e","\u1E1B":"e","\u0247":"e","\u025B":"e","\u01DD":"e","\u24D5":"f","\uFF46":"f","\u1E1F":"f","\u0192":"f","\uA77C":"f","\u24D6":"g","\uFF47":"g","\u01F5":"g","\u011D":"g","\u1E21":"g","\u011F":"g","\u0121":"g","\u01E7":"g","\u0123":"g","\u01E5":"g","\u0260":"g","\uA7A1":"g","\u1D79":"g","\uA77F":"g","\u24D7":"h","\uFF48":"h","\u0125":"h","\u1E23":"h","\u1E27":"h","\u021F":"h","\u1E25":"h","\u1E29":"h","\u1E2B":"h","\u1E96":"h","\u0127":"h","\u2C68":"h","\u2C76":"h","\u0265":"h","\u0195":"hv","\u24D8":"i","\uFF49":"i","\u00EC":"i","\u00ED":"i","\u00EE":"i","\u0129":"i","\u012B":"i","\u012D":"i","\u00EF":"i","\u1E2F":"i","\u1EC9":"i","\u01D0":"i","\u0209":"i","\u020B":"i","\u1ECB":"i","\u012F":"i","\u1E2D":"i","\u0268":"i","\u0131":"i","\u24D9":"j","\uFF4A":"j","\u0135":"j","\u01F0":"j","\u0249":"j","\u24DA":"k","\uFF4B":"k","\u1E31":"k","\u01E9":"k","\u1E33":"k","\u0137":"k","\u1E35":"k","\u0199":"k","\u2C6A":"k","\uA741":"k","\uA743":"k","\uA745":"k","\uA7A3":"k","\u24DB":"l","\uFF4C":"l","\u0140":"l","\u013A":"l","\u013E":"l","\u1E37":"l","\u1E39":"l","\u013C":"l","\u1E3D":"l","\u1E3B":"l","\u017F":"l","\u0142":"l","\u019A":"l","\u026B":"l","\u2C61":"l","\uA749":"l","\uA781":"l","\uA747":"l","\u01C9":"lj","\u24DC":"m","\uFF4D":"m","\u1E3F":"m","\u1E41":"m","\u1E43":"m","\u0271":"m","\u026F":"m","\u24DD":"n","\uFF4E":"n","\u01F9":"n","\u0144":"n","\u00F1":"n","\u1E45":"n","\u0148":"n","\u1E47":"n","\u0146":"n","\u1E4B":"n","\u1E49":"n","\u019E":"n","\u0272":"n","\u0149":"n","\uA791":"n","\uA7A5":"n","\u01CC":"nj","\u24DE":"o","\uFF4F":"o","\u00F2":"o","\u00F3":"o","\u00F4":"o","\u1ED3":"o","\u1ED1":"o","\u1ED7":"o","\u1ED5":"o","\u00F5":"o","\u1E4D":"o","\u022D":"o","\u1E4F":"o","\u014D":"o","\u1E51":"o","\u1E53":"o","\u014F":"o","\u022F":"o","\u0231":"o","\u00F6":"o","\u022B":"o","\u1ECF":"o","\u0151":"o","\u01D2":"o","\u020D":"o","\u020F":"o","\u01A1":"o","\u1EDD":"o","\u1EDB":"o","\u1EE1":"o","\u1EDF":"o","\u1EE3":"o","\u1ECD":"o","\u1ED9":"o","\u01EB":"o","\u01ED":"o","\u00F8":"o","\u01FF":"o","\u0254":"o","\uA74B":"o","\uA74D":"o","\u0275":"o","\u01A3":"oi","\u0223":"ou","\uA74F":"oo","\u24DF":"p","\uFF50":"p","\u1E55":"p","\u1E57":"p","\u01A5":"p","\u1D7D":"p","\uA751":"p","\uA753":"p","\uA755":"p","\u24E0":"q","\uFF51":"q","\u024B":"q","\uA757":"q","\uA759":"q","\u24E1":"r","\uFF52":"r","\u0155":"r","\u1E59":"r","\u0159":"r","\u0211":"r","\u0213":"r","\u1E5B":"r","\u1E5D":"r","\u0157":"r","\u1E5F":"r","\u024D":"r","\u027D":"r","\uA75B":"r","\uA7A7":"r","\uA783":"r","\u24E2":"s","\uFF53":"s","\u00DF":"s","\u015B":"s","\u1E65":"s","\u015D":"s","\u1E61":"s","\u0161":"s","\u1E67":"s","\u1E63":"s","\u1E69":"s","\u0219":"s","\u015F":"s","\u023F":"s","\uA7A9":"s","\uA785":"s","\u1E9B":"s","\u24E3":"t","\uFF54":"t","\u1E6B":"t","\u1E97":"t","\u0165":"t","\u1E6D":"t","\u021B":"t","\u0163":"t","\u1E71":"t","\u1E6F":"t","\u0167":"t","\u01AD":"t","\u0288":"t","\u2C66":"t","\uA787":"t","\uA729":"tz","\u24E4":"u","\uFF55":"u","\u00F9":"u","\u00FA":"u","\u00FB":"u","\u0169":"u","\u1E79":"u","\u016B":"u","\u1E7B":"u","\u016D":"u","\u00FC":"u","\u01DC":"u","\u01D8":"u","\u01D6":"u","\u01DA":"u","\u1EE7":"u","\u016F":"u","\u0171":"u","\u01D4":"u","\u0215":"u","\u0217":"u","\u01B0":"u","\u1EEB":"u","\u1EE9":"u","\u1EEF":"u","\u1EED":"u","\u1EF1":"u","\u1EE5":"u","\u1E73":"u","\u0173":"u","\u1E77":"u","\u1E75":"u","\u0289":"u","\u24E5":"v","\uFF56":"v","\u1E7D":"v","\u1E7F":"v","\u028B":"v","\uA75F":"v","\u028C":"v","\uA761":"vy","\u24E6":"w","\uFF57":"w","\u1E81":"w","\u1E83":"w","\u0175":"w","\u1E87":"w","\u1E85":"w","\u1E98":"w","\u1E89":"w","\u2C73":"w","\u24E7":"x","\uFF58":"x","\u1E8B":"x","\u1E8D":"x","\u24E8":"y","\uFF59":"y","\u1EF3":"y","\u00FD":"y","\u0177":"y","\u1EF9":"y","\u0233":"y","\u1E8F":"y","\u00FF":"y","\u1EF7":"y","\u1E99":"y","\u1EF5":"y","\u01B4":"y","\u024F":"y","\u1EFF":"y","\u24E9":"z","\uFF5A":"z","\u017A":"z","\u1E91":"z","\u017C":"z","\u017E":"z","\u1E93":"z","\u1E95":"z","\u01B6":"z","\u0225":"z","\u0240":"z","\u2C6C":"z","\uA763":"z"};

    $document = $(document);

    nextUid=(function() { var counter=1; return function() { return counter++; }; }());


    function stripDiacritics(str) {
        var ret, i, l, c;

        if (!str || str.length < 1) return str;

        ret = "";
        for (i = 0, l = str.length; i < l; i++) {
            c = str.charAt(i);
            ret += DIACRITICS[c] || c;
        }
        return ret;
    }

    function indexOf(value, array) {
        var i = 0, l = array.length;
        for (; i < l; i = i + 1) {
            if (equal(value, array[i])) return i;
        }
        return -1;
    }

    function measureScrollbar () {
        var $template = $( MEASURE_SCROLLBAR_TEMPLATE );
        $template.appendTo('body');

        var dim = {
            width: $template.width() - $template[0].clientWidth,
            height: $template.height() - $template[0].clientHeight
        };
        $template.remove();

        return dim;
    }

    /**
     * Compares equality of a and b
     * @param a
     * @param b
     */
    function equal(a, b) {
        if (a === b) return true;
        if (a === undefined || b === undefined) return false;
        if (a === null || b === null) return false;
        // Check whether 'a' or 'b' is a string (primitive or object).
        // The concatenation of an empty string (+'') converts its argument to a string's primitive.
        if (a.constructor === String) return a+'' === b+''; // a+'' - in case 'a' is a String object
        if (b.constructor === String) return b+'' === a+''; // b+'' - in case 'b' is a String object
        return false;
    }

    /**
     * Splits the string into an array of values, trimming each value. An empty array is returned for nulls or empty
     * strings
     * @param string
     * @param separator
     */
    function splitVal(string, separator) {
        var val, i, l;
        if (string === null || string.length < 1) return [];
        val = string.split(separator);
        for (i = 0, l = val.length; i < l; i = i + 1) val[i] = $.trim(val[i]);
        return val;
    }

    function getSideBorderPadding(element) {
        return element.outerWidth(false) - element.width();
    }

    function installKeyUpChangeEvent(element) {
        var key="keyup-change-value";
        element.on("keydown", function () {
            if ($.data(element, key) === undefined) {
                $.data(element, key, element.val());
            }
        });
        element.on("keyup", function () {
            var val= $.data(element, key);
            if (val !== undefined && element.val() !== val) {
                $.removeData(element, key);
                element.trigger("keyup-change");
            }
        });
    }

    $document.on("mousemove", function (e) {
        lastMousePosition.x = e.pageX;
        lastMousePosition.y = e.pageY;
    });

    /**
     * filters mouse events so an event is fired only if the mouse moved.
     *
     * filters out mouse events that occur when mouse is stationary but
     * the elements under the pointer are scrolled.
     */
    function installFilteredMouseMove(element) {
        element.on("mousemove", function (e) {
            var lastpos = lastMousePosition;
            if (lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY) {
                $(e.target).trigger("mousemove-filtered", e);
            }
        });
    }

    /**
     * Debounces a function. Returns a function that calls the original fn function only if no invocations have been made
     * within the last quietMillis milliseconds.
     *
     * @param quietMillis number of milliseconds to wait before invoking fn
     * @param fn function to be debounced
     * @param ctx object to be used as this reference within fn
     * @return debounced version of fn
     */
    function debounce(quietMillis, fn, ctx) {
        ctx = ctx || undefined;
        var timeout;
        return function () {
            var args = arguments;
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function() {
                fn.apply(ctx, args);
            }, quietMillis);
        };
    }

    /**
     * A simple implementation of a thunk
     * @param formula function used to lazily initialize the thunk
     * @return {Function}
     */
    function thunk(formula) {
        var evaluated = false,
            value;
        return function() {
            if (evaluated === false) { value = formula(); evaluated = true; }
            return value;
        };
    };

    function installDebouncedScroll(threshold, element) {
        var notify = debounce(threshold, function (e) { element.trigger("scroll-debounced", e);});
        element.on("scroll", function (e) {
            if (indexOf(e.target, element.get()) >= 0) notify(e);
        });
    }

    function focus($el) {
        if ($el[0] === document.activeElement) return;

        /* set the focus in a 0 timeout - that way the focus is set after the processing
            of the current event has finished - which seems like the only reliable way
            to set focus */
        window.setTimeout(function() {
            var el=$el[0], pos=$el.val().length, range;

            $el.focus();

            /* make sure el received focus so we do not error out when trying to manipulate the caret.
                sometimes modals or others listeners may steal it after its set */
            if ($el.is(":visible") && el === document.activeElement) {

                /* after the focus is set move the caret to the end, necessary when we val()
                    just before setting focus */
                if(el.setSelectionRange)
                {
                    el.setSelectionRange(pos, pos);
                }
                else if (el.createTextRange) {
                    range = el.createTextRange();
                    range.collapse(false);
                    range.select();
                }
            }
        }, 0);
    }

    function getCursorInfo(el) {
        el = $(el)[0];
        var offset = 0;
        var length = 0;
        if ('selectionStart' in el) {
            offset = el.selectionStart;
            length = el.selectionEnd - offset;
        } else if ('selection' in document) {
            el.focus();
            var sel = document.selection.createRange();
            length = document.selection.createRange().text.length;
            sel.moveStart('character', -el.value.length);
            offset = sel.text.length - length;
        }
        return { offset: offset, length: length };
    }

    function killEvent(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    function killEventImmediately(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }

    function measureTextWidth(e) {
        if (!sizer){
            var style = e[0].currentStyle || window.getComputedStyle(e[0], null);
            sizer = $(document.createElement("div")).css({
                position: "absolute",
                left: "-10000px",
                top: "-10000px",
                display: "none",
                fontSize: style.fontSize,
                fontFamily: style.fontFamily,
                fontStyle: style.fontStyle,
                fontWeight: style.fontWeight,
                letterSpacing: style.letterSpacing,
                textTransform: style.textTransform,
                whiteSpace: "nowrap"
            });
            sizer.attr("class","select2-sizer");
            $("body").append(sizer);
        }
        sizer.text(e.val());
        return sizer.width();
    }

    function syncCssClasses(dest, src, adapter) {
        var classes, replacements = [], adapted;

        classes = dest.attr("class");
        if (classes) {
            classes = '' + classes; // for IE which returns object
            $(classes.split(" ")).each2(function() {
                if (this.indexOf("select2-") === 0) {
                    replacements.push(this);
                }
            });
        }
        classes = src.attr("class");
        if (classes) {
            classes = '' + classes; // for IE which returns object
            $(classes.split(" ")).each2(function() {
                if (this.indexOf("select2-") !== 0) {
                    adapted = adapter(this);
                    if (adapted) {
                        replacements.push(adapted);
                    }
                }
            });
        }
        dest.attr("class", replacements.join(" "));
    }


    function markMatch(text, term, markup, escapeMarkup) {
        var match=stripDiacritics(text.toUpperCase()).indexOf(stripDiacritics(term.toUpperCase())),
            tl=term.length;

        if (match<0) {
            markup.push(escapeMarkup(text));
            return;
        }

        markup.push(escapeMarkup(text.substring(0, match)));
        markup.push("<span class='select2-match'>");
        markup.push(escapeMarkup(text.substring(match, match + tl)));
        markup.push("</span>");
        markup.push(escapeMarkup(text.substring(match + tl, text.length)));
    }

    function defaultEscapeMarkup(markup) {
        var replace_map = {
            '\\': '&#92;',
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#47;'
        };

        return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
            return replace_map[match];
        });
    }

    /**
     * Produces an ajax-based query function
     *
     * @param options object containing configuration paramters
     * @param options.params parameter map for the transport ajax call, can contain such options as cache, jsonpCallback, etc. see $.ajax
     * @param options.transport function that will be used to execute the ajax request. must be compatible with parameters supported by $.ajax
     * @param options.url url for the data
     * @param options.data a function(searchTerm, pageNumber, context) that should return an object containing query string parameters for the above url.
     * @param options.dataType request data type: ajax, jsonp, other datatatypes supported by jQuery's $.ajax function or the transport function if specified
     * @param options.quietMillis (optional) milliseconds to wait before making the ajaxRequest, helps debounce the ajax function if invoked too often
     * @param options.results a function(remoteData, pageNumber) that converts data returned form the remote request to the format expected by Select2.
     *      The expected format is an object containing the following keys:
     *      results array of objects that will be used as choices
     *      more (optional) boolean indicating whether there are more results available
     *      Example: {results:[{id:1, text:'Red'},{id:2, text:'Blue'}], more:true}
     */
    function ajax(options) {
        var timeout, // current scheduled but not yet executed request
            handler = null,
            quietMillis = options.quietMillis || 100,
            ajaxUrl = options.url,
            self = this;

        return function (query) {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function () {
                var data = options.data, // ajax data function
                    url = ajaxUrl, // ajax url string or function
                    transport = options.transport || $.fn.select2.ajaxDefaults.transport,
                    // deprecated - to be removed in 4.0  - use params instead
                    deprecated = {
                        type: options.type || 'GET', // set type of request (GET or POST)
                        cache: options.cache || false,
                        jsonpCallback: options.jsonpCallback||undefined,
                        dataType: options.dataType||"json"
                    },
                    params = $.extend({}, $.fn.select2.ajaxDefaults.params, deprecated);

                data = data ? data.call(self, query.term, query.page, query.context) : null;
                url = (typeof url === 'function') ? url.call(self, query.term, query.page, query.context) : url;

                if (handler) { handler.abort(); }

                if (options.params) {
                    if ($.isFunction(options.params)) {
                        $.extend(params, options.params.call(self));
                    } else {
                        $.extend(params, options.params);
                    }
                }

                $.extend(params, {
                    url: url,
                    dataType: options.dataType,
                    data: data,
                    success: function (data) {
                        // TODO - replace query.page with query so users have access to term, page, etc.
                        var results = options.results(data, query.page);
                        query.callback(results);
                    }
                });
                handler = transport.call(self, params);
            }, quietMillis);
        };
    }

    /**
     * Produces a query function that works with a local array
     *
     * @param options object containing configuration parameters. The options parameter can either be an array or an
     * object.
     *
     * If the array form is used it is assumed that it contains objects with 'id' and 'text' keys.
     *
     * If the object form is used ti is assumed that it contains 'data' and 'text' keys. The 'data' key should contain
     * an array of objects that will be used as choices. These objects must contain at least an 'id' key. The 'text'
     * key can either be a String in which case it is expected that each element in the 'data' array has a key with the
     * value of 'text' which will be used to match choices. Alternatively, text can be a function(item) that can extract
     * the text.
     */
    function local(options) {
        var data = options, // data elements
            dataText,
            tmp,
            text = function (item) { return ""+item.text; }; // function used to retrieve the text portion of a data item that is matched against the search

         if ($.isArray(data)) {
            tmp = data;
            data = { results: tmp };
        }

         if ($.isFunction(data) === false) {
            tmp = data;
            data = function() { return tmp; };
        }

        var dataItem = data();
        if (dataItem.text) {
            text = dataItem.text;
            // if text is not a function we assume it to be a key name
            if (!$.isFunction(text)) {
                dataText = dataItem.text; // we need to store this in a separate variable because in the next step data gets reset and data.text is no longer available
                text = function (item) { return item[dataText]; };
            }
        }

        return function (query) {
            var t = query.term, filtered = { results: [] }, process;
            if (t === "") {
                query.callback(data());
                return;
            }

            process = function(datum, collection) {
                var group, attr;
                datum = datum[0];
                if (datum.children) {
                    group = {};
                    for (attr in datum) {
                        if (datum.hasOwnProperty(attr)) group[attr]=datum[attr];
                    }
                    group.children=[];
                    $(datum.children).each2(function(i, childDatum) { process(childDatum, group.children); });
                    if (group.children.length || query.matcher(t, text(group), datum)) {
                        collection.push(group);
                    }
                } else {
                    if (query.matcher(t, text(datum), datum)) {
                        collection.push(datum);
                    }
                }
            };

            $(data().results).each2(function(i, datum) { process(datum, filtered.results); });
            query.callback(filtered);
        };
    }

    // TODO javadoc
    function tags(data) {
        var isFunc = $.isFunction(data);
        return function (query) {
            var t = query.term, filtered = {results: []};
            $(isFunc ? data() : data).each(function () {
                var isObject = this.text !== undefined,
                    text = isObject ? this.text : this;
                if (t === "" || query.matcher(t, text)) {
                    filtered.results.push(isObject ? this : {id: this, text: this});
                }
            });
            query.callback(filtered);
        };
    }

    /**
     * Checks if the formatter function should be used.
     *
     * Throws an error if it is not a function. Returns true if it should be used,
     * false if no formatting should be performed.
     *
     * @param formatter
     */
    function checkFormatter(formatter, formatterName) {
        if ($.isFunction(formatter)) return true;
        if (!formatter) return false;
        throw new Error(formatterName +" must be a function or a falsy value");
    }

    function evaluate(val) {
        return $.isFunction(val) ? val() : val;
    }

    function countResults(results) {
        var count = 0;
        $.each(results, function(i, item) {
            if (item.children) {
                count += countResults(item.children);
            } else {
                count++;
            }
        });
        return count;
    }

    /**
     * Default tokenizer. This function uses breaks the input on substring match of any string from the
     * opts.tokenSeparators array and uses opts.createSearchChoice to create the choice object. Both of those
     * two options have to be defined in order for the tokenizer to work.
     *
     * @param input text user has typed so far or pasted into the search field
     * @param selection currently selected choices
     * @param selectCallback function(choice) callback tho add the choice to selection
     * @param opts select2's opts
     * @return undefined/null to leave the current input unchanged, or a string to change the input to the returned value
     */
    function defaultTokenizer(input, selection, selectCallback, opts) {
        var original = input, // store the original so we can compare and know if we need to tell the search to update its text
            dupe = false, // check for whether a token we extracted represents a duplicate selected choice
            token, // token
            index, // position at which the separator was found
            i, l, // looping variables
            separator; // the matched separator

        if (!opts.createSearchChoice || !opts.tokenSeparators || opts.tokenSeparators.length < 1) return undefined;

        while (true) {
            index = -1;

            for (i = 0, l = opts.tokenSeparators.length; i < l; i++) {
                separator = opts.tokenSeparators[i];
                index = input.indexOf(separator);
                if (index >= 0) break;
            }

            if (index < 0) break; // did not find any token separator in the input string, bail

            token = input.substring(0, index);
            input = input.substring(index + separator.length);

            if (token.length > 0) {
                token = opts.createSearchChoice.call(this, token, selection);
                if (token !== undefined && token !== null && opts.id(token) !== undefined && opts.id(token) !== null) {
                    dupe = false;
                    for (i = 0, l = selection.length; i < l; i++) {
                        if (equal(opts.id(token), opts.id(selection[i]))) {
                            dupe = true; break;
                        }
                    }

                    if (!dupe) selectCallback(token);
                }
            }
        }

        if (original!==input) return input;
    }

    /**
     * Creates a new class
     *
     * @param superClass
     * @param methods
     */
    function clazz(SuperClass, methods) {
        var constructor = function () {};
        constructor.prototype = new SuperClass;
        constructor.prototype.constructor = constructor;
        constructor.prototype.parent = SuperClass.prototype;
        constructor.prototype = $.extend(constructor.prototype, methods);
        return constructor;
    }

    AbstractSelect2 = clazz(Object, {

        // abstract
        bind: function (func) {
            var self = this;
            return function () {
                func.apply(self, arguments);
            };
        },

        // abstract
        init: function (opts) {
            var results, search, resultsSelector = ".select2-results";

            // prepare options
            this.opts = opts = this.prepareOpts(opts);

            this.id=opts.id;

            // destroy if called on an existing component
            if (opts.element.data("select2") !== undefined &&
                opts.element.data("select2") !== null) {
                opts.element.data("select2").destroy();
            }

            this.container = this.createContainer();

            this.containerId="s2id_"+(opts.element.attr("id") || "autogen"+nextUid());
            this.containerSelector="#"+this.containerId.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
            this.container.attr("id", this.containerId);

            // cache the body so future lookups are cheap
            this.body = thunk(function() { return opts.element.closest("body"); });

            syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);

            this.container.attr("style", opts.element.attr("style"));
            this.container.css(evaluate(opts.containerCss));
            this.container.addClass(evaluate(opts.containerCssClass));

            this.elementTabIndex = this.opts.element.attr("tabindex");

            // swap container for the element
            this.opts.element
                .data("select2", this)
                .attr("tabindex", "-1")
                .before(this.container)
                .on("click.select2", killEvent); // do not leak click events

            this.container.data("select2", this);

            this.dropdown = this.container.find(".select2-drop");

            syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);

            this.dropdown.addClass(evaluate(opts.dropdownCssClass));
            this.dropdown.data("select2", this);
            this.dropdown.on("click", killEvent);

            this.results = results = this.container.find(resultsSelector);
            this.search = search = this.container.find("input.select2-input");

            this.queryCount = 0;
            this.resultsPage = 0;
            this.context = null;

            // initialize the container
            this.initContainer();

            this.container.on("click", killEvent);

            installFilteredMouseMove(this.results);
            this.dropdown.on("mousemove-filtered touchstart touchmove touchend", resultsSelector, this.bind(this.highlightUnderEvent));

            installDebouncedScroll(80, this.results);
            this.dropdown.on("scroll-debounced", resultsSelector, this.bind(this.loadMoreIfNeeded));

            // do not propagate change event from the search field out of the component
            $(this.container).on("change", ".select2-input", function(e) {e.stopPropagation();});
            $(this.dropdown).on("change", ".select2-input", function(e) {e.stopPropagation();});

            // if jquery.mousewheel plugin is installed we can prevent out-of-bounds scrolling of results via mousewheel
            if ($.fn.mousewheel) {
                results.mousewheel(function (e, delta, deltaX, deltaY) {
                    var top = results.scrollTop();
                    if (deltaY > 0 && top - deltaY <= 0) {
                        results.scrollTop(0);
                        killEvent(e);
                    } else if (deltaY < 0 && results.get(0).scrollHeight - results.scrollTop() + deltaY <= results.height()) {
                        results.scrollTop(results.get(0).scrollHeight - results.height());
                        killEvent(e);
                    }
                });
            }

            installKeyUpChangeEvent(search);
            search.on("keyup-change input paste", this.bind(this.updateResults));
            search.on("focus", function () { search.addClass("select2-focused"); });
            search.on("blur", function () { search.removeClass("select2-focused");});

            this.dropdown.on("mouseup", resultsSelector, this.bind(function (e) {
                if ($(e.target).closest(".select2-result-selectable").length > 0) {
                    this.highlightUnderEvent(e);
                    this.selectHighlighted(e);
                }
            }));

            // trap all mouse events from leaving the dropdown. sometimes there may be a modal that is listening
            // for mouse events outside of itself so it can close itself. since the dropdown is now outside the select2's
            // dom it will trigger the popup close, which is not what we want
            this.dropdown.on("click mouseup mousedown", function (e) { e.stopPropagation(); });

            if ($.isFunction(this.opts.initSelection)) {
                // initialize selection based on the current value of the source element
                this.initSelection();

                // if the user has provided a function that can set selection based on the value of the source element
                // we monitor the change event on the element and trigger it, allowing for two way synchronization
                this.monitorSource();
            }

            if (opts.maximumInputLength !== null) {
                this.search.attr("maxlength", opts.maximumInputLength);
            }

            var disabled = opts.element.prop("disabled");
            if (disabled === undefined) disabled = false;
            this.enable(!disabled);

            var readonly = opts.element.prop("readonly");
            if (readonly === undefined) readonly = false;
            this.readonly(readonly);

            // Calculate size of scrollbar
            scrollBarDimensions = scrollBarDimensions || measureScrollbar();

            this.autofocus = opts.element.prop("autofocus");
            opts.element.prop("autofocus", false);
            if (this.autofocus) this.focus();

            this.nextSearchTerm = undefined;
        },

        // abstract
        destroy: function () {
            var element=this.opts.element, select2 = element.data("select2");

            this.close();

            if (this.propertyObserver) { delete this.propertyObserver; this.propertyObserver = null; }

            if (select2 !== undefined) {
                select2.container.remove();
                select2.dropdown.remove();
                element
                    .removeClass("select2-offscreen")
                    .removeData("select2")
                    .off(".select2")
                    .prop("autofocus", this.autofocus || false);
                if (this.elementTabIndex) {
                    element.attr({tabindex: this.elementTabIndex});
                } else {
                    element.removeAttr("tabindex");
                }
                element.show();
            }
        },

        // abstract
        optionToData: function(element) {
            if (element.is("option")) {
                return {
                    id:element.prop("value"),
                    text:element.text(),
                    element: element.get(),
                    css: element.attr("class"),
                    disabled: element.prop("disabled"),
                    locked: equal(element.attr("locked"), "locked") || equal(element.data("locked"), true)
                };
            } else if (element.is("optgroup")) {
                return {
                    text:element.attr("label"),
                    children:[],
                    element: element.get(),
                    css: element.attr("class")
                };
            }
        },

        // abstract
        prepareOpts: function (opts) {
            var element, select, idKey, ajaxUrl, self = this;

            element = opts.element;

            if (element.get(0).tagName.toLowerCase() === "select") {
                this.select = select = opts.element;
            }

            if (select) {
                // these options are not allowed when attached to a select because they are picked up off the element itself
                $.each(["id", "multiple", "ajax", "query", "createSearchChoice", "initSelection", "data", "tags"], function () {
                    if (this in opts) {
                        throw new Error("Option '" + this + "' is not allowed for Select2 when attached to a <select> element.");
                    }
                });
            }

            opts = $.extend({}, {
                populateResults: function(container, results, query) {
                    var populate, id=this.opts.id;

                    populate=function(results, container, depth) {

                        var i, l, result, selectable, disabled, compound, node, label, innerContainer, formatted;

                        results = opts.sortResults(results, container, query);

                        for (i = 0, l = results.length; i < l; i = i + 1) {

                            result=results[i];

                            disabled = (result.disabled === true);
                            selectable = (!disabled) && (id(result) !== undefined);

                            compound=result.children && result.children.length > 0;

                            node=$("<li></li>");
                            node.addClass("select2-results-dept-"+depth);
                            node.addClass("select2-result");
                            node.addClass(selectable ? "select2-result-selectable" : "select2-result-unselectable");
                            if (disabled) { node.addClass("select2-disabled"); }
                            if (compound) { node.addClass("select2-result-with-children"); }
                            node.addClass(self.opts.formatResultCssClass(result));

                            label=$(document.createElement("div"));
                            label.addClass("select2-result-label");

                            formatted=opts.formatResult(result, label, query, self.opts.escapeMarkup);
                            if (formatted!==undefined) {
                                label.html(formatted);
                            }

                            node.append(label);

                            if (compound) {

                                innerContainer=$("<ul></ul>");
                                innerContainer.addClass("select2-result-sub");
                                populate(result.children, innerContainer, depth+1);
                                node.append(innerContainer);
                            }

                            node.data("select2-data", result);
                            container.append(node);
                        }
                    };

                    populate(results, container, 0);
                }
            }, $.fn.select2.defaults, opts);

            if (typeof(opts.id) !== "function") {
                idKey = opts.id;
                opts.id = function (e) { return e[idKey]; };
            }

            if ($.isArray(opts.element.data("select2Tags"))) {
                if ("tags" in opts) {
                    throw "tags specified as both an attribute 'data-select2-tags' and in options of Select2 " + opts.element.attr("id");
                }
                opts.tags=opts.element.data("select2Tags");
            }

            if (select) {
                opts.query = this.bind(function (query) {
                    var data = { results: [], more: false },
                        term = query.term,
                        children, placeholderOption, process;

                    process=function(element, collection) {
                        var group;
                        if (element.is("option")) {
                            if (query.matcher(term, element.text(), element)) {
                                collection.push(self.optionToData(element));
                            }
                        } else if (element.is("optgroup")) {
                            group=self.optionToData(element);
                            element.children().each2(function(i, elm) { process(elm, group.children); });
                            if (group.children.length>0) {
                                collection.push(group);
                            }
                        }
                    };

                    children=element.children();

                    // ignore the placeholder option if there is one
                    if (this.getPlaceholder() !== undefined && children.length > 0) {
                        placeholderOption = this.getPlaceholderOption();
                        if (placeholderOption) {
                            children=children.not(placeholderOption);
                        }
                    }

                    children.each2(function(i, elm) { process(elm, data.results); });

                    query.callback(data);
                });
                // this is needed because inside val() we construct choices from options and there id is hardcoded
                opts.id=function(e) { return e.id; };
                opts.formatResultCssClass = function(data) { return data.css; };
            } else {
                if (!("query" in opts)) {

                    if ("ajax" in opts) {
                        ajaxUrl = opts.element.data("ajax-url");
                        if (ajaxUrl && ajaxUrl.length > 0) {
                            opts.ajax.url = ajaxUrl;
                        }
                        opts.query = ajax.call(opts.element, opts.ajax);
                    } else if ("data" in opts) {
                        opts.query = local(opts.data);
                    } else if ("tags" in opts) {
                        opts.query = tags(opts.tags);
                        if (opts.createSearchChoice === undefined) {
                            opts.createSearchChoice = function (term) { return {id: $.trim(term), text: $.trim(term)}; };
                        }
                        if (opts.initSelection === undefined) {
                            opts.initSelection = function (element, callback) {
                                var data = [];
                                $(splitVal(element.val(), opts.separator)).each(function () {
                                    var obj = { id: this, text: this },
                                        tags = opts.tags;
                                    if ($.isFunction(tags)) tags=tags();
                                    $(tags).each(function() { if (equal(this.id, obj.id)) { obj = this; return false; } });
                                    data.push(obj);
                                });

                                callback(data);
                            };
                        }
                    }
                }
            }
            if (typeof(opts.query) !== "function") {
                throw "query function not defined for Select2 " + opts.element.attr("id");
            }

            return opts;
        },

        /**
         * Monitor the original element for changes and update select2 accordingly
         */
        // abstract
        monitorSource: function () {
            var el = this.opts.element, sync, observer;

            el.on("change.select2", this.bind(function (e) {
                if (this.opts.element.data("select2-change-triggered") !== true) {
                    this.initSelection();
                }
            }));

            sync = this.bind(function () {

                // sync enabled state
                var disabled = el.prop("disabled");
                if (disabled === undefined) disabled = false;
                this.enable(!disabled);

                var readonly = el.prop("readonly");
                if (readonly === undefined) readonly = false;
                this.readonly(readonly);

                syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);
                this.container.addClass(evaluate(this.opts.containerCssClass));

                syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);
                this.dropdown.addClass(evaluate(this.opts.dropdownCssClass));

            });

            // IE8-10
            el.on("propertychange.select2", sync);

            // hold onto a reference of the callback to work around a chromium bug
            if (this.mutationCallback === undefined) {
                this.mutationCallback = function (mutations) {
                    mutations.forEach(sync);
                }
            }

            // safari, chrome, firefox, IE11
            observer = window.MutationObserver || window.WebKitMutationObserver|| window.MozMutationObserver;
            if (observer !== undefined) {
                if (this.propertyObserver) { delete this.propertyObserver; this.propertyObserver = null; }
                this.propertyObserver = new observer(this.mutationCallback);
                this.propertyObserver.observe(el.get(0), { attributes:true, subtree:false });
            }
        },

        // abstract
        triggerSelect: function(data) {
            var evt = $.Event("select2-selecting", { val: this.id(data), object: data });
            this.opts.element.trigger(evt);
            return !evt.isDefaultPrevented();
        },

        /**
         * Triggers the change event on the source element
         */
        // abstract
        triggerChange: function (details) {

            details = details || {};
            details= $.extend({}, details, { type: "change", val: this.val() });
            // prevents recursive triggering
            this.opts.element.data("select2-change-triggered", true);
            this.opts.element.trigger(details);
            this.opts.element.data("select2-change-triggered", false);

            // some validation frameworks ignore the change event and listen instead to keyup, click for selects
            // so here we trigger the click event manually
            this.opts.element.click();

            // ValidationEngine ignorea the change event and listens instead to blur
            // so here we trigger the blur event manually if so desired
            if (this.opts.blurOnChange)
                this.opts.element.blur();
        },

        //abstract
        isInterfaceEnabled: function()
        {
            return this.enabledInterface === true;
        },

        // abstract
        enableInterface: function() {
            var enabled = this._enabled && !this._readonly,
                disabled = !enabled;

            if (enabled === this.enabledInterface) return false;

            this.container.toggleClass("select2-container-disabled", disabled);
            this.close();
            this.enabledInterface = enabled;

            return true;
        },

        // abstract
        enable: function(enabled) {
            if (enabled === undefined) enabled = true;
            if (this._enabled === enabled) return;
            this._enabled = enabled;

            this.opts.element.prop("disabled", !enabled);
            this.enableInterface();
        },

        // abstract
        disable: function() {
            this.enable(false);
        },

        // abstract
        readonly: function(enabled) {
            if (enabled === undefined) enabled = false;
            if (this._readonly === enabled) return false;
            this._readonly = enabled;

            this.opts.element.prop("readonly", enabled);
            this.enableInterface();
            return true;
        },

        // abstract
        opened: function () {
            return this.container.hasClass("select2-dropdown-open");
        },

        // abstract
        positionDropdown: function() {
            var $dropdown = this.dropdown,
                offset = this.container.offset(),
                height = this.container.outerHeight(false),
                width = this.container.outerWidth(false),
                dropHeight = $dropdown.outerHeight(false),
                $window = $(window),
                windowWidth = $window.width(),
                windowHeight = $window.height(),
                viewPortRight = $window.scrollLeft() + windowWidth,
                viewportBottom = $window.scrollTop() + windowHeight,
                dropTop = offset.top + height,
                dropLeft = offset.left,
                enoughRoomBelow = dropTop + dropHeight <= viewportBottom,
                enoughRoomAbove = (offset.top - dropHeight) >= this.body().scrollTop(),
                dropWidth = $dropdown.outerWidth(false),
                enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight,
                aboveNow = $dropdown.hasClass("select2-drop-above"),
                bodyOffset,
                above,
                changeDirection,
                css,
                resultsListNode;

            // always prefer the current above/below alignment, unless there is not enough room
            if (aboveNow) {
                above = true;
                if (!enoughRoomAbove && enoughRoomBelow) {
                    changeDirection = true;
                    above = false;
                }
            } else {
                above = false;
                if (!enoughRoomBelow && enoughRoomAbove) {
                    changeDirection = true;
                    above = true;
                }
            }

            //if we are changing direction we need to get positions when dropdown is hidden;
            if (changeDirection) {
                $dropdown.hide();
                offset = this.container.offset();
                height = this.container.outerHeight(false);
                width = this.container.outerWidth(false);
                dropHeight = $dropdown.outerHeight(false);
                viewPortRight = $window.scrollLeft() + windowWidth;
                viewportBottom = $window.scrollTop() + windowHeight;
                dropTop = offset.top + height;
                dropLeft = offset.left;
                dropWidth = $dropdown.outerWidth(false);
                enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight;
                $dropdown.show();
            }

            if (this.opts.dropdownAutoWidth) {
                resultsListNode = $('.select2-results', $dropdown)[0];
                $dropdown.addClass('select2-drop-auto-width');
                $dropdown.css('width', '');
                // Add scrollbar width to dropdown if vertical scrollbar is present
                dropWidth = $dropdown.outerWidth(false) + (resultsListNode.scrollHeight === resultsListNode.clientHeight ? 0 : scrollBarDimensions.width);
                dropWidth > width ? width = dropWidth : dropWidth = width;
                enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight;
            }
            else {
                this.container.removeClass('select2-drop-auto-width');
            }

            //console.log("below/ droptop:", dropTop, "dropHeight", dropHeight, "sum", (dropTop+dropHeight)+" viewport bottom", viewportBottom, "enough?", enoughRoomBelow);
            //console.log("above/ offset.top", offset.top, "dropHeight", dropHeight, "top", (offset.top-dropHeight), "scrollTop", this.body().scrollTop(), "enough?", enoughRoomAbove);

            // fix positioning when body has an offset and is not position: static
            if (this.body().css('position') !== 'static') {
                bodyOffset = this.body().offset();
                dropTop -= bodyOffset.top;
                dropLeft -= bodyOffset.left;
            }

            if (!enoughRoomOnRight) {
               dropLeft = offset.left + width - dropWidth;
            }

            css =  {
                left: dropLeft,
                width: width
            };

            if (above) {
                css.bottom = windowHeight - offset.top;
                css.top = 'auto';
                this.container.addClass("select2-drop-above");
                $dropdown.addClass("select2-drop-above");
            }
            else {
                css.top = dropTop;
                css.bottom = 'auto';
                this.container.removeClass("select2-drop-above");
                $dropdown.removeClass("select2-drop-above");
            }
            css = $.extend(css, evaluate(this.opts.dropdownCss));

            $dropdown.css(css);
        },

        // abstract
        shouldOpen: function() {
            var event;

            if (this.opened()) return false;

            if (this._enabled === false || this._readonly === true) return false;

            event = $.Event("select2-opening");
            this.opts.element.trigger(event);
            return !event.isDefaultPrevented();
        },

        // abstract
        clearDropdownAlignmentPreference: function() {
            // clear the classes used to figure out the preference of where the dropdown should be opened
            this.container.removeClass("select2-drop-above");
            this.dropdown.removeClass("select2-drop-above");
        },

        /**
         * Opens the dropdown
         *
         * @return {Boolean} whether or not dropdown was opened. This method will return false if, for example,
         * the dropdown is already open, or if the 'open' event listener on the element called preventDefault().
         */
        // abstract
        open: function () {

            if (!this.shouldOpen()) return false;

            this.opening();

            return true;
        },

        /**
         * Performs the opening of the dropdown
         */
        // abstract
        opening: function() {
            var cid = this.containerId,
                scroll = "scroll." + cid,
                resize = "resize."+cid,
                orient = "orientationchange."+cid,
                mask;

            this.container.addClass("select2-dropdown-open").addClass("select2-container-active");

            this.clearDropdownAlignmentPreference();

            if(this.dropdown[0] !== this.body().children().last()[0]) {
                this.dropdown.detach().appendTo(this.body());
            }

            // create the dropdown mask if doesnt already exist
            mask = $("#select2-drop-mask");
            if (mask.length == 0) {
                mask = $(document.createElement("div"));
                mask.attr("id","select2-drop-mask").attr("class","select2-drop-mask");
                mask.hide();
                mask.appendTo(this.body());
                mask.on("mousedown touchstart click", function (e) {
                    var dropdown = $("#select2-drop"), self;
                    if (dropdown.length > 0) {
                        self=dropdown.data("select2");
                        if (self.opts.selectOnBlur) {
                            self.selectHighlighted({noFocus: true});
                        }
                        self.close({focus:true});
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
            }

            // ensure the mask is always right before the dropdown
            if (this.dropdown.prev()[0] !== mask[0]) {
                this.dropdown.before(mask);
            }

            // move the global id to the correct dropdown
            $("#select2-drop").removeAttr("id");
            this.dropdown.attr("id", "select2-drop");

            // show the elements
            mask.show();

            this.positionDropdown();
            this.dropdown.show();
            this.positionDropdown();

            this.dropdown.addClass("select2-drop-active");

            // attach listeners to events that can change the position of the container and thus require
            // the position of the dropdown to be updated as well so it does not come unglued from the container
            var that = this;
            this.container.parents().add(window).each(function () {
                $(this).on(resize+" "+scroll+" "+orient, function (e) {
                    that.positionDropdown();
                });
            });


        },

        // abstract
        close: function () {
            if (!this.opened()) return;

            var cid = this.containerId,
                scroll = "scroll." + cid,
                resize = "resize."+cid,
                orient = "orientationchange."+cid;

            // unbind event listeners
            this.container.parents().add(window).each(function () { $(this).off(scroll).off(resize).off(orient); });

            this.clearDropdownAlignmentPreference();

            $("#select2-drop-mask").hide();
            this.dropdown.removeAttr("id"); // only the active dropdown has the select2-drop id
            this.dropdown.hide();
            this.container.removeClass("select2-dropdown-open").removeClass("select2-container-active");
            this.results.empty();


            this.clearSearch();
            this.search.removeClass("select2-active");
            this.opts.element.trigger($.Event("select2-close"));
        },

        /**
         * Opens control, sets input value, and updates results.
         */
        // abstract
        externalSearch: function (term) {
            this.open();
            this.search.val(term);
            this.updateResults(false);
        },

        // abstract
        clearSearch: function () {

        },

        //abstract
        getMaximumSelectionSize: function() {
            return evaluate(this.opts.maximumSelectionSize);
        },

        // abstract
        ensureHighlightVisible: function () {
            var results = this.results, children, index, child, hb, rb, y, more;

            index = this.highlight();

            if (index < 0) return;

            if (index == 0) {

                // if the first element is highlighted scroll all the way to the top,
                // that way any unselectable headers above it will also be scrolled
                // into view

                results.scrollTop(0);
                return;
            }

            children = this.findHighlightableChoices().find('.select2-result-label');

            child = $(children[index]);

            hb = child.offset().top + child.outerHeight(true);

            // if this is the last child lets also make sure select2-more-results is visible
            if (index === children.length - 1) {
                more = results.find("li.select2-more-results");
                if (more.length > 0) {
                    hb = more.offset().top + more.outerHeight(true);
                }
            }

            rb = results.offset().top + results.outerHeight(true);
            if (hb > rb) {
                results.scrollTop(results.scrollTop() + (hb - rb));
            }
            y = child.offset().top - results.offset().top;

            // make sure the top of the element is visible
            if (y < 0 && child.css('display') != 'none' ) {
                results.scrollTop(results.scrollTop() + y); // y is negative
            }
        },

        // abstract
        findHighlightableChoices: function() {
            return this.results.find(".select2-result-selectable:not(.select2-disabled, .select2-selected)");
        },

        // abstract
        moveHighlight: function (delta) {
            var choices = this.findHighlightableChoices(),
                index = this.highlight();

            while (index > -1 && index < choices.length) {
                index += delta;
                var choice = $(choices[index]);
                if (choice.hasClass("select2-result-selectable") && !choice.hasClass("select2-disabled") && !choice.hasClass("select2-selected")) {
                    this.highlight(index);
                    break;
                }
            }
        },

        // abstract
        highlight: function (index) {
            var choices = this.findHighlightableChoices(),
                choice,
                data;

            if (arguments.length === 0) {
                return indexOf(choices.filter(".select2-highlighted")[0], choices.get());
            }

            if (index >= choices.length) index = choices.length - 1;
            if (index < 0) index = 0;

            this.removeHighlight();

            choice = $(choices[index]);
            choice.addClass("select2-highlighted");

            this.ensureHighlightVisible();

            data = choice.data("select2-data");
            if (data) {
                this.opts.element.trigger({ type: "select2-highlight", val: this.id(data), choice: data });
            }
        },

        removeHighlight: function() {
            this.results.find(".select2-highlighted").removeClass("select2-highlighted");
        },

        // abstract
        countSelectableResults: function() {
            return this.findHighlightableChoices().length;
        },

        // abstract
        highlightUnderEvent: function (event) {
            var el = $(event.target).closest(".select2-result-selectable");
            if (el.length > 0 && !el.is(".select2-highlighted")) {
                var choices = this.findHighlightableChoices();
                this.highlight(choices.index(el));
            } else if (el.length == 0) {
                // if we are over an unselectable item remove all highlights
                this.removeHighlight();
            }
        },

        // abstract
        loadMoreIfNeeded: function () {
            var results = this.results,
                more = results.find("li.select2-more-results"),
                below, // pixels the element is below the scroll fold, below==0 is when the element is starting to be visible
                page = this.resultsPage + 1,
                self=this,
                term=this.search.val(),
                context=this.context;

            if (more.length === 0) return;
            below = more.offset().top - results.offset().top - results.height();

            if (below <= this.opts.loadMorePadding) {
                more.addClass("select2-active");
                this.opts.query({
                        element: this.opts.element,
                        term: term,
                        page: page,
                        context: context,
                        matcher: this.opts.matcher,
                        callback: this.bind(function (data) {

                    // ignore a response if the select2 has been closed before it was received
                    if (!self.opened()) return;


                    self.opts.populateResults.call(this, results, data.results, {term: term, page: page, context:context});
                    self.postprocessResults(data, false, false);

                    if (data.more===true) {
                        more.detach().appendTo(results).text(self.opts.formatLoadMore(page+1));
                        window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                    } else {
                        more.remove();
                    }
                    self.positionDropdown();
                    self.resultsPage = page;
                    self.context = data.context;
                    this.opts.element.trigger({ type: "select2-loaded", items: data });
                })});
            }
        },

        /**
         * Default tokenizer function which does nothing
         */
        tokenize: function() {

        },

        /**
         * @param initial whether or not this is the call to this method right after the dropdown has been opened
         */
        // abstract
        updateResults: function (initial) {
            var search = this.search,
                results = this.results,
                opts = this.opts,
                data,
                self = this,
                input,
                term = search.val(),
                lastTerm = $.data(this.container, "select2-last-term"),
                // sequence number used to drop out-of-order responses
                queryNumber;

            // prevent duplicate queries against the same term
            if (initial !== true && lastTerm && equal(term, lastTerm)) return;

            $.data(this.container, "select2-last-term", term);

            // if the search is currently hidden we do not alter the results
            if (initial !== true && (this.showSearchInput === false || !this.opened())) {
                return;
            }

            function postRender() {
                search.removeClass("select2-active");
                self.positionDropdown();
            }

            function render(html) {
                results.html(html);
                postRender();
            }

            queryNumber = ++this.queryCount;

            var maxSelSize = this.getMaximumSelectionSize();
            if (maxSelSize >=1) {
                data = this.data();
                if ($.isArray(data) && data.length >= maxSelSize && checkFormatter(opts.formatSelectionTooBig, "formatSelectionTooBig")) {
                    render("<li class='select2-selection-limit'>" + opts.formatSelectionTooBig(maxSelSize) + "</li>");
                    return;
                }
            }

            if (search.val().length < opts.minimumInputLength) {
                if (checkFormatter(opts.formatInputTooShort, "formatInputTooShort")) {
                    render("<li class='select2-no-results'>" + opts.formatInputTooShort(search.val(), opts.minimumInputLength) + "</li>");
                } else {
                    render("");
                }
                if (initial && this.showSearch) this.showSearch(true);
                return;
            }

            if (opts.maximumInputLength && search.val().length > opts.maximumInputLength) {
                if (checkFormatter(opts.formatInputTooLong, "formatInputTooLong")) {
                    render("<li class='select2-no-results'>" + opts.formatInputTooLong(search.val(), opts.maximumInputLength) + "</li>");
                } else {
                    render("");
                }
                return;
            }

            if (opts.formatSearching && this.findHighlightableChoices().length === 0) {
                render("<li class='select2-searching'>" + opts.formatSearching() + "</li>");
            }

            search.addClass("select2-active");

            this.removeHighlight();

            // give the tokenizer a chance to pre-process the input
            input = this.tokenize();
            if (input != undefined && input != null) {
                search.val(input);
            }

            this.resultsPage = 1;

            opts.query({
                element: opts.element,
                    term: search.val(),
                    page: this.resultsPage,
                    context: null,
                    matcher: opts.matcher,
                    callback: this.bind(function (data) {
                var def; // default choice

                // ignore old responses
                if (queryNumber != this.queryCount) {
                  return;
                }

                // ignore a response if the select2 has been closed before it was received
                if (!this.opened()) {
                    this.search.removeClass("select2-active");
                    return;
                }

                // save context, if any
                this.context = (data.context===undefined) ? null : data.context;
                // create a default choice and prepend it to the list
                if (this.opts.createSearchChoice && search.val() !== "") {
                    def = this.opts.createSearchChoice.call(self, search.val(), data.results);
                    if (def !== undefined && def !== null && self.id(def) !== undefined && self.id(def) !== null) {
                        if ($(data.results).filter(
                            function () {
                                return equal(self.id(this), self.id(def));
                            }).length === 0) {
                            data.results.unshift(def);
                        }
                    }
                }

                if (data.results.length === 0 && checkFormatter(opts.formatNoMatches, "formatNoMatches")) {
                    render("<li class='select2-no-results'>" + opts.formatNoMatches(search.val()) + "</li>");
                    return;
                }

                results.empty();
                self.opts.populateResults.call(this, results, data.results, {term: search.val(), page: this.resultsPage, context:null});

                if (data.more === true && checkFormatter(opts.formatLoadMore, "formatLoadMore")) {
                    results.append("<li class='select2-more-results'>" + self.opts.escapeMarkup(opts.formatLoadMore(this.resultsPage)) + "</li>");
                    window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                }

                this.postprocessResults(data, initial);

                postRender();

                this.opts.element.trigger({ type: "select2-loaded", items: data });
            })});
        },

        // abstract
        cancel: function () {
            this.close();
        },

        // abstract
        blur: function () {
            // if selectOnBlur == true, select the currently highlighted option
            if (this.opts.selectOnBlur)
                this.selectHighlighted({noFocus: true});

            this.close();
            this.container.removeClass("select2-container-active");
            // synonymous to .is(':focus'), which is available in jquery >= 1.6
            if (this.search[0] === document.activeElement) { this.search.blur(); }
            this.clearSearch();
            this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
        },

        // abstract
        focusSearch: function () {
            focus(this.search);
        },

        // abstract
        selectHighlighted: function (options) {
            var index=this.highlight(),
                highlighted=this.results.find(".select2-highlighted"),
                data = highlighted.closest('.select2-result').data("select2-data");

            if (data) {
                this.highlight(index);
                this.onSelect(data, options);
            } else if (options && options.noFocus) {
                this.close();
            }
        },

        // abstract
        getPlaceholder: function () {
            var placeholderOption;
            return this.opts.element.attr("placeholder") ||
                this.opts.element.attr("data-placeholder") || // jquery 1.4 compat
                this.opts.element.data("placeholder") ||
                this.opts.placeholder ||
                ((placeholderOption = this.getPlaceholderOption()) !== undefined ? placeholderOption.text() : undefined);
        },

        // abstract
        getPlaceholderOption: function() {
            if (this.select) {
                var firstOption = this.select.children('option').first();
                if (this.opts.placeholderOption !== undefined ) {
                    //Determine the placeholder option based on the specified placeholderOption setting
                    return (this.opts.placeholderOption === "first" && firstOption) ||
                           (typeof this.opts.placeholderOption === "function" && this.opts.placeholderOption(this.select));
                } else if (firstOption.text() === "" && firstOption.val() === "") {
                    //No explicit placeholder option specified, use the first if it's blank
                    return firstOption;
                }
            }
        },

        /**
         * Get the desired width for the container element.  This is
         * derived first from option `width` passed to select2, then
         * the inline 'style' on the original element, and finally
         * falls back to the jQuery calculated element width.
         */
        // abstract
        initContainerWidth: function () {
            function resolveContainerWidth() {
                var style, attrs, matches, i, l, attr;

                if (this.opts.width === "off") {
                    return null;
                } else if (this.opts.width === "element"){
                    return this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px';
                } else if (this.opts.width === "copy" || this.opts.width === "resolve") {
                    // check if there is inline style on the element that contains width
                    style = this.opts.element.attr('style');
                    if (style !== undefined) {
                        attrs = style.split(';');
                        for (i = 0, l = attrs.length; i < l; i = i + 1) {
                            attr = attrs[i].replace(/\s/g, '');
                            matches = attr.match(/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i);
                            if (matches !== null && matches.length >= 1)
                                return matches[1];
                        }
                    }

                    if (this.opts.width === "resolve") {
                        // next check if css('width') can resolve a width that is percent based, this is sometimes possible
                        // when attached to input type=hidden or elements hidden via css
                        style = this.opts.element.css('width');
                        if (style.indexOf("%") > 0) return style;

                        // finally, fallback on the calculated width of the element
                        return (this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px');
                    }

                    return null;
                } else if ($.isFunction(this.opts.width)) {
                    return this.opts.width();
                } else {
                    return this.opts.width;
               }
            };

            var width = resolveContainerWidth.call(this);
            if (width !== null) {
                this.container.css("width", width);
            }
        }
    });

    SingleSelect2 = clazz(AbstractSelect2, {

        // single

        createContainer: function () {
            var container = $(document.createElement("div")).attr({
                "class": "select2-container"
            }).html([
                "<a href='javascript:void(0)' onclick='return false;' class='select2-choice' tabindex='-1'>",
                "   <span class='select2-chosen'>&nbsp;</span><abbr class='select2-search-choice-close'></abbr>",
                "   <span class='select2-arrow'><b></b></span>",
                "</a>",
                "<input class='select2-focusser select2-offscreen' type='text'/>",
                "<div class='select2-drop select2-display-none'>",
                "   <div class='select2-search'>",
                "       <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input'/>",
                "   </div>",
                "   <ul class='select2-results'>",
                "   </ul>",
                "</div>"].join(""));
            return container;
        },

        // single
        enableInterface: function() {
            if (this.parent.enableInterface.apply(this, arguments)) {
                this.focusser.prop("disabled", !this.isInterfaceEnabled());
            }
        },

        // single
        opening: function () {
            var el, range, len;

            if (this.opts.minimumResultsForSearch >= 0) {
                this.showSearch(true);
            }

            this.parent.opening.apply(this, arguments);

            if (this.showSearchInput !== false) {
                // IE appends focusser.val() at the end of field :/ so we manually insert it at the beginning using a range
                // all other browsers handle this just fine

                this.search.val(this.focusser.val());
            }
            this.search.focus();
            // move the cursor to the end after focussing, otherwise it will be at the beginning and
            // new text will appear *before* focusser.val()
            el = this.search.get(0);
            if (el.createTextRange) {
                range = el.createTextRange();
                range.collapse(false);
                range.select();
            } else if (el.setSelectionRange) {
                len = this.search.val().length;
                el.setSelectionRange(len, len);
            }

            // initializes search's value with nextSearchTerm (if defined by user)
            // ignore nextSearchTerm if the dropdown is opened by the user pressing a letter
            if(this.search.val() === "") {
                if(this.nextSearchTerm != undefined){
                    this.search.val(this.nextSearchTerm);
                    this.search.select();
                }
            }

            this.focusser.prop("disabled", true).val("");
            this.updateResults(true);
            this.opts.element.trigger($.Event("select2-open"));
        },

        // single
        close: function (params) {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);

            params = params || {focus: true};
            this.focusser.removeAttr("disabled");

            if (params.focus) {
                this.focusser.focus();
            }
        },

        // single
        focus: function () {
            if (this.opened()) {
                this.close();
            } else {
                this.focusser.removeAttr("disabled");
                this.focusser.focus();
            }
        },

        // single
        isFocused: function () {
            return this.container.hasClass("select2-container-active");
        },

        // single
        cancel: function () {
            this.parent.cancel.apply(this, arguments);
            this.focusser.removeAttr("disabled");
            this.focusser.focus();
        },

        // single
        destroy: function() {
            $("label[for='" + this.focusser.attr('id') + "']")
                .attr('for', this.opts.element.attr("id"));
            this.parent.destroy.apply(this, arguments);
        },

        // single
        initContainer: function () {

            var selection,
                container = this.container,
                dropdown = this.dropdown;

            if (this.opts.minimumResultsForSearch < 0) {
                this.showSearch(false);
            } else {
                this.showSearch(true);
            }

            this.selection = selection = container.find(".select2-choice");

            this.focusser = container.find(".select2-focusser");

            // rewrite labels from original element to focusser
            this.focusser.attr("id", "s2id_autogen"+nextUid());

            $("label[for='" + this.opts.element.attr("id") + "']")
                .attr('for', this.focusser.attr('id'));

            this.focusser.attr("tabindex", this.elementTabIndex);

            this.search.on("keydown", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                    return;
                }

                switch (e.which) {
                    case KEY.UP:
                    case KEY.DOWN:
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                        killEvent(e);
                        return;
                    case KEY.ENTER:
                        this.selectHighlighted();
                        killEvent(e);
                        return;
                    case KEY.TAB:
                        this.selectHighlighted({noFocus: true});
                        return;
                    case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                }
            }));

            this.search.on("blur", this.bind(function(e) {
                // a workaround for chrome to keep the search field focussed when the scroll bar is used to scroll the dropdown.
                // without this the search field loses focus which is annoying
                if (document.activeElement === this.body().get(0)) {
                    window.setTimeout(this.bind(function() {
                        this.search.focus();
                    }), 0);
                }
            }));

            this.focusser.on("keydown", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;

                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
                    return;
                }

                if (this.opts.openOnEnter === false && e.which === KEY.ENTER) {
                    killEvent(e);
                    return;
                }

                if (e.which == KEY.DOWN || e.which == KEY.UP
                    || (e.which == KEY.ENTER && this.opts.openOnEnter)) {

                    if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;

                    this.open();
                    killEvent(e);
                    return;
                }

                if (e.which == KEY.DELETE || e.which == KEY.BACKSPACE) {
                    if (this.opts.allowClear) {
                        this.clear();
                    }
                    killEvent(e);
                    return;
                }
            }));


            installKeyUpChangeEvent(this.focusser);
            this.focusser.on("keyup-change input", this.bind(function(e) {
                if (this.opts.minimumResultsForSearch >= 0) {
                    e.stopPropagation();
                    if (this.opened()) return;
                    this.open();
                }
            }));

            selection.on("mousedown", "abbr", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;
                this.clear();
                killEventImmediately(e);
                this.close();
                this.selection.focus();
            }));

            selection.on("mousedown", this.bind(function (e) {

                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }

                if (this.opened()) {
                    this.close();
                } else if (this.isInterfaceEnabled()) {
                    this.open();
                }

                killEvent(e);
            }));

            dropdown.on("mousedown", this.bind(function() { this.search.focus(); }));

            selection.on("focus", this.bind(function(e) {
                killEvent(e);
            }));

            this.focusser.on("focus", this.bind(function(){
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.container.addClass("select2-container-active");
            })).on("blur", this.bind(function() {
                if (!this.opened()) {
                    this.container.removeClass("select2-container-active");
                    this.opts.element.trigger($.Event("select2-blur"));
                }
            }));
            this.search.on("focus", this.bind(function(){
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.container.addClass("select2-container-active");
            }));

            this.initContainerWidth();
            this.opts.element.addClass("select2-offscreen");
            this.setPlaceholder();

        },

        // single
        clear: function(triggerChange) {
            var data=this.selection.data("select2-data");
            if (data) { // guard against queued quick consecutive clicks
                var evt = $.Event("select2-clearing");
                this.opts.element.trigger(evt);
                if (evt.isDefaultPrevented()) {
                    return;
                }
                var placeholderOption = this.getPlaceholderOption();
                this.opts.element.val(placeholderOption ? placeholderOption.val() : "");
                this.selection.find(".select2-chosen").empty();
                this.selection.removeData("select2-data");
                this.setPlaceholder();

                if (triggerChange !== false){
                    this.opts.element.trigger({ type: "select2-removed", val: this.id(data), choice: data });
                    this.triggerChange({removed:data});
                }
            }
        },

        /**
         * Sets selection based on source element's value
         */
        // single
        initSelection: function () {
            var selected;
            if (this.isPlaceholderOptionSelected()) {
                this.updateSelection(null);
                this.close();
                this.setPlaceholder();
            } else {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function(selected){
                    if (selected !== undefined && selected !== null) {
                        self.updateSelection(selected);
                        self.close();
                        self.setPlaceholder();
                    }
                });
            }
        },

        isPlaceholderOptionSelected: function() {
            var placeholderOption;
            if (!this.getPlaceholder()) return false; // no placeholder specified so no option should be considered
            return ((placeholderOption = this.getPlaceholderOption()) !== undefined && placeholderOption.prop("selected"))
                || (this.opts.element.val() === "")
                || (this.opts.element.val() === undefined)
                || (this.opts.element.val() === null);
        },

        // single
        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments),
                self=this;

            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install the selection initializer
                opts.initSelection = function (element, callback) {
                    var selected = element.find("option").filter(function() { return this.selected });
                    // a single select box always has a value, no need to null check 'selected'
                    callback(self.optionToData(selected));
                };
            } else if ("data" in opts) {
                // install default initSelection when applied to hidden input and data is local
                opts.initSelection = opts.initSelection || function (element, callback) {
                    var id = element.val();
                    //search in data by id, storing the actual matching item
                    var match = null;
                    opts.query({
                        matcher: function(term, text, el){
                            var is_match = equal(id, opts.id(el));
                            if (is_match) {
                                match = el;
                            }
                            return is_match;
                        },
                        callback: !$.isFunction(callback) ? $.noop : function() {
                            callback(match);
                        }
                    });
                };
            }

            return opts;
        },

        // single
        getPlaceholder: function() {
            // if a placeholder is specified on a single select without a valid placeholder option ignore it
            if (this.select) {
                if (this.getPlaceholderOption() === undefined) {
                    return undefined;
                }
            }

            return this.parent.getPlaceholder.apply(this, arguments);
        },

        // single
        setPlaceholder: function () {
            var placeholder = this.getPlaceholder();

            if (this.isPlaceholderOptionSelected() && placeholder !== undefined) {

                // check for a placeholder option if attached to a select
                if (this.select && this.getPlaceholderOption() === undefined) return;

                this.selection.find(".select2-chosen").html(this.opts.escapeMarkup(placeholder));

                this.selection.addClass("select2-default");

                this.container.removeClass("select2-allowclear");
            }
        },

        // single
        postprocessResults: function (data, initial, noHighlightUpdate) {
            var selected = 0, self = this, showSearchInput = true;

            // find the selected element in the result list

            this.findHighlightableChoices().each2(function (i, elm) {
                if (equal(self.id(elm.data("select2-data")), self.opts.element.val())) {
                    selected = i;
                    return false;
                }
            });

            // and highlight it
            if (noHighlightUpdate !== false) {
                if (initial === true && selected >= 0) {
                    this.highlight(selected);
                } else {
                    this.highlight(0);
                }
            }

            // hide the search box if this is the first we got the results and there are enough of them for search

            if (initial === true) {
                var min = this.opts.minimumResultsForSearch;
                if (min >= 0) {
                    this.showSearch(countResults(data.results) >= min);
                }
            }
        },

        // single
        showSearch: function(showSearchInput) {
            if (this.showSearchInput === showSearchInput) return;

            this.showSearchInput = showSearchInput;

            this.dropdown.find(".select2-search").toggleClass("select2-search-hidden", !showSearchInput);
            this.dropdown.find(".select2-search").toggleClass("select2-offscreen", !showSearchInput);
            //add "select2-with-searchbox" to the container if search box is shown
            $(this.dropdown, this.container).toggleClass("select2-with-searchbox", showSearchInput);
        },

        // single
        onSelect: function (data, options) {

            if (!this.triggerSelect(data)) { return; }

            var old = this.opts.element.val(),
                oldData = this.data();

            this.opts.element.val(this.id(data));
            this.updateSelection(data);

            this.opts.element.trigger({ type: "select2-selected", val: this.id(data), choice: data });

            this.nextSearchTerm = this.opts.nextSearchTerm(data, this.search.val());
            this.close();

            if (!options || !options.noFocus)
                this.focusser.focus();

            if (!equal(old, this.id(data))) { this.triggerChange({added:data,removed:oldData}); }
        },

        // single
        updateSelection: function (data) {

            var container=this.selection.find(".select2-chosen"), formatted, cssClass;

            this.selection.data("select2-data", data);

            container.empty();
            if (data !== null) {
                formatted=this.opts.formatSelection(data, container, this.opts.escapeMarkup);
            }
            if (formatted !== undefined) {
                container.append(formatted);
            }
            cssClass=this.opts.formatSelectionCssClass(data, container);
            if (cssClass !== undefined) {
                container.addClass(cssClass);
            }

            this.selection.removeClass("select2-default");

            if (this.opts.allowClear && this.getPlaceholder() !== undefined) {
                this.container.addClass("select2-allowclear");
            }
        },

        // single
        val: function () {
            var val,
                triggerChange = false,
                data = null,
                self = this,
                oldData = this.data();

            if (arguments.length === 0) {
                return this.opts.element.val();
            }

            val = arguments[0];

            if (arguments.length > 1) {
                triggerChange = arguments[1];
            }

            if (this.select) {
                this.select
                    .val(val)
                    .find("option").filter(function() { return this.selected }).each2(function (i, elm) {
                        data = self.optionToData(elm);
                        return false;
                    });
                this.updateSelection(data);
                this.setPlaceholder();
                if (triggerChange) {
                    this.triggerChange({added: data, removed:oldData});
                }
            } else {
                // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
                if (!val && val !== 0) {
                    this.clear(triggerChange);
                    return;
                }
                if (this.opts.initSelection === undefined) {
                    throw new Error("cannot call val() if initSelection() is not defined");
                }
                this.opts.element.val(val);
                this.opts.initSelection(this.opts.element, function(data){
                    self.opts.element.val(!data ? "" : self.id(data));
                    self.updateSelection(data);
                    self.setPlaceholder();
                    if (triggerChange) {
                        self.triggerChange({added: data, removed:oldData});
                    }
                });
            }
        },

        // single
        clearSearch: function () {
            this.search.val("");
            this.focusser.val("");
        },

        // single
        data: function(value) {
            var data,
                triggerChange = false;

            if (arguments.length === 0) {
                data = this.selection.data("select2-data");
                if (data == undefined) data = null;
                return data;
            } else {
                if (arguments.length > 1) {
                    triggerChange = arguments[1];
                }
                if (!value) {
                    this.clear(triggerChange);
                } else {
                    data = this.data();
                    this.opts.element.val(!value ? "" : this.id(value));
                    this.updateSelection(value);
                    if (triggerChange) {
                        this.triggerChange({added: value, removed:data});
                    }
                }
            }
        }
    });

    MultiSelect2 = clazz(AbstractSelect2, {

        // multi
        createContainer: function () {
            var container = $(document.createElement("div")).attr({
                "class": "select2-container select2-container-multi"
            }).html([
                "<ul class='select2-choices'>",
                "  <li class='select2-search-field'>",
                "    <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input'>",
                "  </li>",
                "</ul>",
                "<div class='select2-drop select2-drop-multi select2-display-none'>",
                "   <ul class='select2-results'>",
                "   </ul>",
                "</div>"].join(""));
            return container;
        },

        // multi
        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments),
                self=this;

            // TODO validate placeholder is a string if specified

            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install sthe selection initializer
                opts.initSelection = function (element, callback) {

                    var data = [];

                    element.find("option").filter(function() { return this.selected }).each2(function (i, elm) {
                        data.push(self.optionToData(elm));
                    });
                    callback(data);
                };
            } else if ("data" in opts) {
                // install default initSelection when applied to hidden input and data is local
                opts.initSelection = opts.initSelection || function (element, callback) {
                    var ids = splitVal(element.val(), opts.separator);
                    //search in data by array of ids, storing matching items in a list
                    var matches = [];
                    opts.query({
                        matcher: function(term, text, el){
                            var is_match = $.grep(ids, function(id) {
                                return equal(id, opts.id(el));
                            }).length;
                            if (is_match) {
                                matches.push(el);
                            }
                            return is_match;
                        },
                        callback: !$.isFunction(callback) ? $.noop : function() {
                            // reorder matches based on the order they appear in the ids array because right now
                            // they are in the order in which they appear in data array
                            var ordered = [];
                            for (var i = 0; i < ids.length; i++) {
                                var id = ids[i];
                                for (var j = 0; j < matches.length; j++) {
                                    var match = matches[j];
                                    if (equal(id, opts.id(match))) {
                                        ordered.push(match);
                                        matches.splice(j, 1);
                                        break;
                                    }
                                }
                            }
                            callback(ordered);
                        }
                    });
                };
            }

            return opts;
        },

        // multi
        selectChoice: function (choice) {

            var selected = this.container.find(".select2-search-choice-focus");
            if (selected.length && choice && choice[0] == selected[0]) {

            } else {
                if (selected.length) {
                    this.opts.element.trigger("choice-deselected", selected);
                }
                selected.removeClass("select2-search-choice-focus");
                if (choice && choice.length) {
                    this.close();
                    choice.addClass("select2-search-choice-focus");
                    this.opts.element.trigger("choice-selected", choice);
                }
            }
        },

        // multi
        destroy: function() {
            $("label[for='" + this.search.attr('id') + "']")
                .attr('for', this.opts.element.attr("id"));
            this.parent.destroy.apply(this, arguments);
        },

        // multi
        initContainer: function () {

            var selector = ".select2-choices", selection;

            this.searchContainer = this.container.find(".select2-search-field");
            this.selection = selection = this.container.find(selector);

            var _this = this;
            this.selection.on("click", ".select2-search-choice:not(.select2-locked)", function (e) {
                //killEvent(e);
                _this.search[0].focus();
                _this.selectChoice($(this));
            });

            // rewrite labels from original element to focusser
            this.search.attr("id", "s2id_autogen"+nextUid());
            $("label[for='" + this.opts.element.attr("id") + "']")
                .attr('for', this.search.attr('id'));

            this.search.on("input paste", this.bind(function() {
                if (!this.isInterfaceEnabled()) return;
                if (!this.opened()) {
                    this.open();
                }
            }));

            this.search.attr("tabindex", this.elementTabIndex);

            this.keydowns = 0;
            this.search.on("keydown", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;

                ++this.keydowns;
                var selected = selection.find(".select2-search-choice-focus");
                var prev = selected.prev(".select2-search-choice:not(.select2-locked)");
                var next = selected.next(".select2-search-choice:not(.select2-locked)");
                var pos = getCursorInfo(this.search);

                if (selected.length &&
                    (e.which == KEY.LEFT || e.which == KEY.RIGHT || e.which == KEY.BACKSPACE || e.which == KEY.DELETE || e.which == KEY.ENTER)) {
                    var selectedChoice = selected;
                    if (e.which == KEY.LEFT && prev.length) {
                        selectedChoice = prev;
                    }
                    else if (e.which == KEY.RIGHT) {
                        selectedChoice = next.length ? next : null;
                    }
                    else if (e.which === KEY.BACKSPACE) {
                        this.unselect(selected.first());
                        this.search.width(10);
                        selectedChoice = prev.length ? prev : next;
                    } else if (e.which == KEY.DELETE) {
                        this.unselect(selected.first());
                        this.search.width(10);
                        selectedChoice = next.length ? next : null;
                    } else if (e.which == KEY.ENTER) {
                        selectedChoice = null;
                    }

                    this.selectChoice(selectedChoice);
                    killEvent(e);
                    if (!selectedChoice || !selectedChoice.length) {
                        this.open();
                    }
                    return;
                } else if (((e.which === KEY.BACKSPACE && this.keydowns == 1)
                    || e.which == KEY.LEFT) && (pos.offset == 0 && !pos.length)) {

                    this.selectChoice(selection.find(".select2-search-choice:not(.select2-locked)").last());
                    killEvent(e);
                    return;
                } else {
                    this.selectChoice(null);
                }

                if (this.opened()) {
                    switch (e.which) {
                    case KEY.UP:
                    case KEY.DOWN:
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                        killEvent(e);
                        return;
                    case KEY.ENTER:
                        this.selectHighlighted();
                        killEvent(e);
                        return;
                    case KEY.TAB:
                        this.selectHighlighted({noFocus:true});
                        this.close();
                        return;
                    case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                    }
                }

                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e)
                 || e.which === KEY.BACKSPACE || e.which === KEY.ESC) {
                    return;
                }

                if (e.which === KEY.ENTER) {
                    if (this.opts.openOnEnter === false) {
                        return;
                    } else if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {
                        return;
                    }
                }

                this.open();

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                }

                if (e.which === KEY.ENTER) {
                    // prevent form from being submitted
                    killEvent(e);
                }

            }));

            this.search.on("keyup", this.bind(function (e) {
                this.keydowns = 0;
                this.resizeSearch();
            })
            );

            this.search.on("blur", this.bind(function(e) {
                this.container.removeClass("select2-container-active");
                this.search.removeClass("select2-focused");
                this.selectChoice(null);
                if (!this.opened()) this.clearSearch();
                e.stopImmediatePropagation();
                this.opts.element.trigger($.Event("select2-blur"));
            }));

            this.container.on("click", selector, this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;
                if ($(e.target).closest(".select2-search-choice").length > 0) {
                    // clicked inside a select2 search choice, do not open
                    return;
                }
                this.selectChoice(null);
                this.clearPlaceholder();
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.open();
                this.focusSearch();
                e.preventDefault();
            }));

            this.container.on("focus", selector, this.bind(function () {
                if (!this.isInterfaceEnabled()) return;
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.container.addClass("select2-container-active");
                this.dropdown.addClass("select2-drop-active");
                this.clearPlaceholder();
            }));

            this.initContainerWidth();
            this.opts.element.addClass("select2-offscreen");

            // set the placeholder if necessary
            this.clearSearch();
        },

        // multi
        enableInterface: function() {
            if (this.parent.enableInterface.apply(this, arguments)) {
                this.search.prop("disabled", !this.isInterfaceEnabled());
            }
        },

        // multi
        initSelection: function () {
            var data;
            if (this.opts.element.val() === "" && this.opts.element.text() === "") {
                this.updateSelection([]);
                this.close();
                // set the placeholder if necessary
                this.clearSearch();
            }
            if (this.select || this.opts.element.val() !== "") {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function(data){
                    if (data !== undefined && data !== null) {
                        self.updateSelection(data);
                        self.close();
                        // set the placeholder if necessary
                        self.clearSearch();
                    }
                });
            }
        },

        // multi
        clearSearch: function () {
            var placeholder = this.getPlaceholder(),
                maxWidth = this.getMaxSearchWidth();

            if (placeholder !== undefined  && this.getVal().length === 0 && this.search.hasClass("select2-focused") === false) {
                this.search.val(placeholder).addClass("select2-default");
                // stretch the search box to full width of the container so as much of the placeholder is visible as possible
                // we could call this.resizeSearch(), but we do not because that requires a sizer and we do not want to create one so early because of a firefox bug, see #944
                this.search.width(maxWidth > 0 ? maxWidth : this.container.css("width"));
            } else {
                this.search.val("").width(10);
            }
        },

        // multi
        clearPlaceholder: function () {
            if (this.search.hasClass("select2-default")) {
                this.search.val("").removeClass("select2-default");
            }
        },

        // multi
        opening: function () {
            this.clearPlaceholder(); // should be done before super so placeholder is not used to search
            this.resizeSearch();

            this.parent.opening.apply(this, arguments);

            this.focusSearch();

            this.updateResults(true);
            this.search.focus();
            this.opts.element.trigger($.Event("select2-open"));
        },

        // multi
        close: function () {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);
        },

        // multi
        focus: function () {
            this.close();
            this.search.focus();
        },

        // multi
        isFocused: function () {
            return this.search.hasClass("select2-focused");
        },

        // multi
        updateSelection: function (data) {
            var ids = [], filtered = [], self = this;

            // filter out duplicates
            $(data).each(function () {
                if (indexOf(self.id(this), ids) < 0) {
                    ids.push(self.id(this));
                    filtered.push(this);
                }
            });
            data = filtered;

            this.selection.find(".select2-search-choice").remove();
            $(data).each(function () {
                self.addSelectedChoice(this);
            });
            self.postprocessResults();
        },

        // multi
        tokenize: function() {
            var input = this.search.val();
            input = this.opts.tokenizer.call(this, input, this.data(), this.bind(this.onSelect), this.opts);
            if (input != null && input != undefined) {
                this.search.val(input);
                if (input.length > 0) {
                    this.open();
                }
            }

        },

        // multi
        onSelect: function (data, options) {

            if (!this.triggerSelect(data)) { return; }

            this.addSelectedChoice(data);

            this.opts.element.trigger({ type: "selected", val: this.id(data), choice: data });

            if (this.select || !this.opts.closeOnSelect) this.postprocessResults(data, false, this.opts.closeOnSelect===true);

            if (this.opts.closeOnSelect) {
                this.close();
                this.search.width(10);
            } else {
                if (this.countSelectableResults()>0) {
                    this.search.width(10);
                    this.resizeSearch();
                    if (this.getMaximumSelectionSize() > 0 && this.val().length >= this.getMaximumSelectionSize()) {
                        // if we reached max selection size repaint the results so choices
                        // are replaced with the max selection reached message
                        this.updateResults(true);
                    }
                    this.positionDropdown();
                } else {
                    // if nothing left to select close
                    this.close();
                    this.search.width(10);
                }
            }

            // since its not possible to select an element that has already been
            // added we do not need to check if this is a new element before firing change
            this.triggerChange({ added: data });

            if (!options || !options.noFocus)
                this.focusSearch();
        },

        // multi
        cancel: function () {
            this.close();
            this.focusSearch();
        },

        addSelectedChoice: function (data) {
            var enableChoice = !data.locked,
                enabledItem = $(
                    "<li class='select2-search-choice'>" +
                    "    <div></div>" +
                    "    <a href='#' onclick='return false;' class='select2-search-choice-close' tabindex='-1'></a>" +
                    "</li>"),
                disabledItem = $(
                    "<li class='select2-search-choice select2-locked'>" +
                    "<div></div>" +
                    "</li>");
            var choice = enableChoice ? enabledItem : disabledItem,
                id = this.id(data),
                val = this.getVal(),
                formatted,
                cssClass;

            formatted=this.opts.formatSelection(data, choice.find("div"), this.opts.escapeMarkup);
            if (formatted != undefined) {
                choice.find("div").replaceWith("<div>"+formatted+"</div>");
            }
            cssClass=this.opts.formatSelectionCssClass(data, choice.find("div"));
            if (cssClass != undefined) {
                choice.addClass(cssClass);
            }

            if(enableChoice){
              choice.find(".select2-search-choice-close")
                  .on("mousedown", killEvent)
                  .on("click dblclick", this.bind(function (e) {
                  if (!this.isInterfaceEnabled()) return;

                  $(e.target).closest(".select2-search-choice").fadeOut('fast', this.bind(function(){
                      this.unselect($(e.target));
                      this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                      this.close();
                      this.focusSearch();
                  })).dequeue();
                  killEvent(e);
              })).on("focus", this.bind(function () {
                  if (!this.isInterfaceEnabled()) return;
                  this.container.addClass("select2-container-active");
                  this.dropdown.addClass("select2-drop-active");
              }));
            }

            choice.data("select2-data", data);
            choice.insertBefore(this.searchContainer);

            val.push(id);
            this.setVal(val);
        },

        // multi
        unselect: function (selected) {
            var val = this.getVal(),
                data,
                index;
            selected = selected.closest(".select2-search-choice");

            if (selected.length === 0) {
                throw "Invalid argument: " + selected + ". Must be .select2-search-choice";
            }

            data = selected.data("select2-data");

            if (!data) {
                // prevent a race condition when the 'x' is clicked really fast repeatedly the event can be queued
                // and invoked on an element already removed
                return;
            }

            while((index = indexOf(this.id(data), val)) >= 0) {
                val.splice(index, 1);
                this.setVal(val);
                if (this.select) this.postprocessResults();
            }

            var evt = $.Event("select2-removing");
            evt.val = this.id(data);
            evt.choice = data;
            this.opts.element.trigger(evt);

            if (evt.isDefaultPrevented()) {
                return;
            }

            selected.remove();

            this.opts.element.trigger({ type: "select2-removed", val: this.id(data), choice: data });
            this.triggerChange({ removed: data });
        },

        // multi
        postprocessResults: function (data, initial, noHighlightUpdate) {
            var val = this.getVal(),
                choices = this.results.find(".select2-result"),
                compound = this.results.find(".select2-result-with-children"),
                self = this;

            choices.each2(function (i, choice) {
                var id = self.id(choice.data("select2-data"));
                if (indexOf(id, val) >= 0) {
                    choice.addClass("select2-selected");
                    // mark all children of the selected parent as selected
                    choice.find(".select2-result-selectable").addClass("select2-selected");
                }
            });

            compound.each2(function(i, choice) {
                // hide an optgroup if it doesnt have any selectable children
                if (!choice.is('.select2-result-selectable')
                    && choice.find(".select2-result-selectable:not(.select2-selected)").length === 0) {
                    choice.addClass("select2-selected");
                }
            });

            if (this.highlight() == -1 && noHighlightUpdate !== false){
                self.highlight(0);
            }

            //If all results are chosen render formatNoMAtches
            if(!this.opts.createSearchChoice && !choices.filter('.select2-result:not(.select2-selected)').length > 0){
                if(!data || data && !data.more && this.results.find(".select2-no-results").length === 0) {
                    if (checkFormatter(self.opts.formatNoMatches, "formatNoMatches")) {
                        this.results.append("<li class='select2-no-results'>" + self.opts.formatNoMatches(self.search.val()) + "</li>");
                    }
                }
            }

        },

        // multi
        getMaxSearchWidth: function() {
            return this.selection.width() - getSideBorderPadding(this.search);
        },

        // multi
        resizeSearch: function () {
            var minimumWidth, left, maxWidth, containerLeft, searchWidth,
                sideBorderPadding = getSideBorderPadding(this.search);

            minimumWidth = measureTextWidth(this.search) + 10;

            left = this.search.offset().left;

            maxWidth = this.selection.width();
            containerLeft = this.selection.offset().left;

            searchWidth = maxWidth - (left - containerLeft) - sideBorderPadding;

            if (searchWidth < minimumWidth) {
                searchWidth = maxWidth - sideBorderPadding;
            }

            if (searchWidth < 40) {
                searchWidth = maxWidth - sideBorderPadding;
            }

            if (searchWidth <= 0) {
              searchWidth = minimumWidth;
            }

            this.search.width(Math.floor(searchWidth));
        },

        // multi
        getVal: function () {
            var val;
            if (this.select) {
                val = this.select.val();
                return val === null ? [] : val;
            } else {
                val = this.opts.element.val();
                return splitVal(val, this.opts.separator);
            }
        },

        // multi
        setVal: function (val) {
            var unique;
            if (this.select) {
                this.select.val(val);
            } else {
                unique = [];
                // filter out duplicates
                $(val).each(function () {
                    if (indexOf(this, unique) < 0) unique.push(this);
                });
                this.opts.element.val(unique.length === 0 ? "" : unique.join(this.opts.separator));
            }
        },

        // multi
        buildChangeDetails: function (old, current) {
            var current = current.slice(0),
                old = old.slice(0);

            // remove intersection from each array
            for (var i = 0; i < current.length; i++) {
                for (var j = 0; j < old.length; j++) {
                    if (equal(this.opts.id(current[i]), this.opts.id(old[j]))) {
                        current.splice(i, 1);
                        if(i>0){
                        	i--;
                        }
                        old.splice(j, 1);
                        j--;
                    }
                }
            }

            return {added: current, removed: old};
        },


        // multi
        val: function (val, triggerChange) {
            var oldData, self=this;

            if (arguments.length === 0) {
                return this.getVal();
            }

            oldData=this.data();
            if (!oldData.length) oldData=[];

            // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
            if (!val && val !== 0) {
                this.opts.element.val("");
                this.updateSelection([]);
                this.clearSearch();
                if (triggerChange) {
                    this.triggerChange({added: this.data(), removed: oldData});
                }
                return;
            }

            // val is a list of ids
            this.setVal(val);

            if (this.select) {
                this.opts.initSelection(this.select, this.bind(this.updateSelection));
                if (triggerChange) {
                    this.triggerChange(this.buildChangeDetails(oldData, this.data()));
                }
            } else {
                if (this.opts.initSelection === undefined) {
                    throw new Error("val() cannot be called if initSelection() is not defined");
                }

                this.opts.initSelection(this.opts.element, function(data){
                    var ids=$.map(data, self.id);
                    self.setVal(ids);
                    self.updateSelection(data);
                    self.clearSearch();
                    if (triggerChange) {
                        self.triggerChange(self.buildChangeDetails(oldData, self.data()));
                    }
                });
            }
            this.clearSearch();
        },

        // multi
        onSortStart: function() {
            if (this.select) {
                throw new Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");
            }

            // collapse search field into 0 width so its container can be collapsed as well
            this.search.width(0);
            // hide the container
            this.searchContainer.hide();
        },

        // multi
        onSortEnd:function() {

            var val=[], self=this;

            // show search and move it to the end of the list
            this.searchContainer.show();
            // make sure the search container is the last item in the list
            this.searchContainer.appendTo(this.searchContainer.parent());
            // since we collapsed the width in dragStarted, we resize it here
            this.resizeSearch();

            // update selection
            this.selection.find(".select2-search-choice").each(function() {
                val.push(self.opts.id($(this).data("select2-data")));
            });
            this.setVal(val);
            this.triggerChange();
        },

        // multi
        data: function(values, triggerChange) {
            var self=this, ids, old;
            if (arguments.length === 0) {
                 return this.selection
                     .find(".select2-search-choice")
                     .map(function() { return $(this).data("select2-data"); })
                     .get();
            } else {
                old = this.data();
                if (!values) { values = []; }
                ids = $.map(values, function(e) { return self.opts.id(e); });
                this.setVal(ids);
                this.updateSelection(values);
                this.clearSearch();
                if (triggerChange) {
                    this.triggerChange(this.buildChangeDetails(old, this.data()));
                }
            }
        }
    });

    $.fn.select2 = function () {

        var args = Array.prototype.slice.call(arguments, 0),
            opts,
            select2,
            method, value, multiple,
            allowedMethods = ["val", "destroy", "opened", "open", "close", "focus", "isFocused", "container", "dropdown", "onSortStart", "onSortEnd", "enable", "disable", "readonly", "positionDropdown", "data", "search"],
            valueMethods = ["opened", "isFocused", "container", "dropdown"],
            propertyMethods = ["val", "data"],
            methodsMap = { search: "externalSearch" };

        this.each(function () {
            if (args.length === 0 || typeof(args[0]) === "object") {
                opts = args.length === 0 ? {} : $.extend({}, args[0]);
                opts.element = $(this);

                if (opts.element.get(0).tagName.toLowerCase() === "select") {
                    multiple = opts.element.prop("multiple");
                } else {
                    multiple = opts.multiple || false;
                    if ("tags" in opts) {opts.multiple = multiple = true;}
                }

                select2 = multiple ? new MultiSelect2() : new SingleSelect2();
                select2.init(opts);
            } else if (typeof(args[0]) === "string") {

                if (indexOf(args[0], allowedMethods) < 0) {
                    throw "Unknown method: " + args[0];
                }

                value = undefined;
                select2 = $(this).data("select2");
                if (select2 === undefined) return;

                method=args[0];

                if (method === "container") {
                    value = select2.container;
                } else if (method === "dropdown") {
                    value = select2.dropdown;
                } else {
                    if (methodsMap[method]) method = methodsMap[method];

                    value = select2[method].apply(select2, args.slice(1));
                }
                if (indexOf(args[0], valueMethods) >= 0
                    || (indexOf(args[0], propertyMethods) && args.length == 1)) {
                    return false; // abort the iteration, ready to return first matched value
                }
            } else {
                throw "Invalid arguments to select2 plugin: " + args;
            }
        });
        return (value === undefined) ? this : value;
    };

    // plugin defaults, accessible to users
    $.fn.select2.defaults = {
        width: "copy",
        loadMorePadding: 0,
        closeOnSelect: true,
        openOnEnter: true,
        containerCss: {},
        dropdownCss: {},
        containerCssClass: "",
        dropdownCssClass: "",
        formatResult: function(result, container, query, escapeMarkup) {
            var markup=[];
            markMatch(result.text, query.term, markup, escapeMarkup);
            return markup.join("");
        },
        formatSelection: function (data, container, escapeMarkup) {
            return data ? escapeMarkup(data.text) : undefined;
        },
        sortResults: function (results, container, query) {
            return results;
        },
        formatResultCssClass: function(data) {return undefined;},
        formatSelectionCssClass: function(data, container) {return undefined;},
        formatNoMatches: function () { return "No matches found"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return "Please enter " + n + " more character" + (n == 1? "" : "s"); },
        formatInputTooLong: function (input, max) { var n = input.length - max; return "Please delete " + n + " character" + (n == 1? "" : "s"); },
        formatSelectionTooBig: function (limit) { return "You can only select " + limit + " item" + (limit == 1 ? "" : "s"); },
        formatLoadMore: function (pageNumber) { return "Loading more results..."; },
        formatSearching: function () { return "Searching..."; },
        minimumResultsForSearch: 0,
        minimumInputLength: 0,
        maximumInputLength: null,
        maximumSelectionSize: 0,
        id: function (e) { return e.id; },
        matcher: function(term, text) {
            return stripDiacritics(''+text).toUpperCase().indexOf(stripDiacritics(''+term).toUpperCase()) >= 0;
        },
        separator: ",",
        tokenSeparators: [],
        tokenizer: defaultTokenizer,
        escapeMarkup: defaultEscapeMarkup,
        blurOnChange: false,
        selectOnBlur: false,
        adaptContainerCssClass: function(c) { return c; },
        adaptDropdownCssClass: function(c) { return null; },
        nextSearchTerm: function(selectedObject, currentSearchTerm) { return undefined; }
    };

    $.fn.select2.ajaxDefaults = {
        transport: $.ajax,
        params: {
            type: "GET",
            cache: false,
            dataType: "json"
        }
    };

    // exports
    window.Select2 = {
        query: {
            ajax: ajax,
            local: local,
            tags: tags
        }, util: {
            debounce: debounce,
            markMatch: markMatch,
            escapeMarkup: defaultEscapeMarkup,
            stripDiacritics: stripDiacritics
        }, "class": {
            "abstract": AbstractSelect2,
            "single": SingleSelect2,
            "multi": MultiSelect2
        }
    };

}(jQuery));

},{}],107:[function(require,module,exports){
var Backbone, Relation, Relations, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

Relation = require('../models/relation');

module.exports = Relations = (function(_super) {
  __extends(Relations, _super);

  function Relations() {
    return Relations.__super__.constructor.apply(this, arguments);
  }

  Relations.prototype.model = Relation;

  Relations.prototype.showable = function() {
    return this.where({
      accepted: true
    });
  };

  Relations.prototype.removeRelation = function(index) {
    var relationToRemove;
    relationToRemove = this.at(index);
    if (relationToRemove.isNew()) {
      relationToRemove.destroy();
    }
    return relationToRemove.markDeleted();
  };

  Relations.prototype.toJSON = function() {
    var all, relation, _i, _len, _ref;
    all = [];
    _ref = this.models;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      relation = _ref[_i];
      if (relation.getTarget() !== null) {
        if (relation.needsDeletion()) {
          all.push(relation.deletedVersion().toJSON());
        } else if (relation.isNew() || relation.hasChanged()) {
          all.push(relation.toJSON());
        }
      }
    }
    return all;
  };

  return Relations;

})(Backbone.Collection);


},{"../models/relation":112,"backbone":undefined,"underscore":undefined}],108:[function(require,module,exports){
var Backbone, LinkModel, getFieldType, getType, isList, isNames, keyMatches, simpleTypeMap, _;

Backbone = require('backbone');

_ = require('underscore');

LinkModel = Backbone.Model;

LinkModel.schema = {
  url: 'Text',
  label: 'Text'
};

simpleTypeMap = {
  String: 'Text',
  boolean: 'Radio',
  Link: 'Link'
};

isList = function(typeStr) {
  return typeStr.indexOf('List') === 0;
};

isNames = function(typeStr) {
  return typeStr.indexOf('Person.Names') !== -1;
};

getType = function(typeStr) {
  if (typeStr in simpleTypeMap) {
    return simpleTypeMap[typeStr];
  } else if (isList(typeStr)) {
    return 'List';
  } else {
    return 'Text';
  }
};

getFieldType = function(typeDescription) {
  var all, fieldType, genericType, itemType, schema, typeStr, _ref;
  typeStr = typeDescription.type;
  fieldType = {
    type: getType(typeStr)
  };
  if (isNames(typeStr)) {
    fieldType.type = 'Names';
  } else if (!(isList(typeStr)) && (typeDescription.value != null)) {
    fieldType.type = 'Select';
    fieldType.options = typeDescription.value;
  } else if (typeStr === 'boolean') {
    fieldType.options = [
      {
        label: 'Yes',
        val: true
      }, {
        label: 'No',
        val: false
      }
    ];
  } else if (isList(typeStr)) {
    _ref = typeStr.match(/\((\w+)\)/), all = _ref[0], genericType = _ref[1];
    itemType = getType(genericType);
    if (typeDescription.value != null) {
      itemType = 'Select';
      fieldType.options = typeDescription.value;
    }
    fieldType.itemType = itemType;
  } else if (typeDescription === 'Link') {
    schema = {
      schema: {
        label: {
          type: 'Text'
        },
        url: {
          type: 'Text'
        }
      }
    };
    fieldType.model = schema;
  }
  return fieldType;
};

keyMatches = function(key, values) {
  var filter, _i, _len, _ref;
  if (values == null) {
    values = [];
  }
  _ref = values != null ? values : [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    filter = _ref[_i];
    if (_.isRegExp(filter) && key.match(filter)) {
      return true;
    } else if (key === filter) {
      return true;
    }
  }
  return false;
};

module.exports = {
  createTimbuctooSchema: function(metadata, options) {
    var isReadOnly, key, schema, shouldIgnore, _i, _len, _ref;
    if (options == null) {
      options = {};
    }
    shouldIgnore = function(key) {
      return keyMatches(key, options.exclude);
    };
    isReadOnly = function(key) {
      return keyMatches(key, options.readonly);
    };
    schema = {};
    _ref = _.keys(metadata);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      if (shouldIgnore(key)) {
        continue;
      }
      if (isReadOnly(key)) {
        schema[key] = {
          type: 'ReadOnly'
        };
        continue;
      }
      schema[key] = getFieldType(metadata[key]);
    }
    return schema;
  }
};


},{"backbone":undefined,"underscore":undefined}],109:[function(require,module,exports){
var DynamicInverseRelationTypeHelper, DynamicRelationTypeHelper,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DynamicRelationTypeHelper = require('./dynamic-relation-type-helper');

DynamicInverseRelationTypeHelper = (function(_super) {
  __extends(DynamicInverseRelationTypeHelper, _super);

  function DynamicInverseRelationTypeHelper() {
    return DynamicInverseRelationTypeHelper.__super__.constructor.apply(this, arguments);
  }

  DynamicInverseRelationTypeHelper.prototype.getName = function(relationType) {
    return relationType.inverseName;
  };

  DynamicInverseRelationTypeHelper.prototype.getRelatedType = function(relationType) {
    return relationType.derivedSourceType;
  };

  DynamicInverseRelationTypeHelper.prototype.createRelation = function(relationType, currentModelId, relatedModelId, rev, variationType, relationId) {
    var relation;
    relation = this.createBaseRelation(relationType, rev, variationType, relationId);
    relation['^sourceId'] = relatedModelId;
    relation['^targetId'] = currentModelId;
    return relation;
  };

  DynamicInverseRelationTypeHelper.prototype.setRelatedModel = function(model, relatedModelId) {
    return model.setSource(relatedModelId);
  };

  return DynamicInverseRelationTypeHelper;

})(DynamicRelationTypeHelper);

module.exports = DynamicInverseRelationTypeHelper;


},{"./dynamic-relation-type-helper":110}],110:[function(require,module,exports){
var DynamicRelationTypeHelper;

DynamicRelationTypeHelper = (function() {
  function DynamicRelationTypeHelper(queryCreatorFunction, template) {
    this.template = template;
    this.createSearchFunction = function(relatedType) {
      return queryCreatorFunction(relatedType);
    };
  }

  DynamicRelationTypeHelper.prototype.createAutoComplete = function(relationType) {
    return this.createSearchFunction(this.getRelatedType(relationType));
  };

  DynamicRelationTypeHelper.prototype.getName = function(relationType) {
    return relationType.regularName;
  };

  DynamicRelationTypeHelper.prototype.getRelatedType = function(relationType) {
    return relationType.derivedTargetType;
  };

  DynamicRelationTypeHelper.prototype.getTemplate = function() {
    return this.template;
  };

  DynamicRelationTypeHelper.prototype.createRelation = function(relationType, sourceId, targetId, rev, variationType, relationId) {
    var relation;
    relation = this.createBaseRelation(relationType, rev, variationType, relationId);
    relation['^sourceId'] = sourceId;
    relation['^targetId'] = targetId;
    return relation;
  };

  DynamicRelationTypeHelper.prototype.createBaseRelation = function(relationType, rev, variationType, relationId) {
    var relation;
    relation = {
      '^sourceType': relationType.baseSourceType,
      '^targetType': relationType.baseTargetType,
      '^typeId': relationType.typeId,
      '^typeType': 'relationType',
      '@type': variationType,
      accepted: true
    };
    if ((rev != null) && rev > 0) {
      relation['^rev'] = rev;
    }
    if (relationId != null) {
      relation['_id'] = relationId;
    }
    return relation;
  };

  DynamicRelationTypeHelper.prototype.setRelatedModel = function(model, relatedModelId) {
    return model.setTarget(relatedModelId);
  };

  return DynamicRelationTypeHelper;

})();

module.exports = DynamicRelationTypeHelper;


},{}],111:[function(require,module,exports){
module.exports = {
  datable: function(options) {
    return function(value, formValues) {
      var error, v;
      v = String(value);
      error = {
        type: 'datable'
      };
      if (v.match(/^\d\d-\d\d-\d\d\d\d/)) {
        error.message = 'Proper dates are not supported yet. Please only specify a year';
      } else if (v.length && !v.match(/^\d+$/)) {
        error.message = 'Not a year: should contain only numbers';
      }
      if (error.message) {
        return error;
      }
    };
  }
};


},{}],112:[function(require,module,exports){
var Backbone, Relation, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

module.exports = Relation = (function(_super) {
  __extends(Relation, _super);

  function Relation() {
    return Relation.__super__.constructor.apply(this, arguments);
  }

  Relation.prototype.idAttribute = '_id';

  Relation.prototype.defaults = function() {
    return {
      accepted: true,
      '^typeType': 'relationtype'
    };
  };

  Relation.prototype.initialize = function() {
    this.originalRelationId = this.get(this.idAttribute);
    return this.originalTargetId = this.get('^targetId');
  };

  Relation.prototype.needsDeletion = function() {
    return (this.getTarget() !== this.originalTargetId) && this.originalRelationId;
  };

  Relation.prototype.markDeleted = function() {
    return this.set({
      accepted: false
    });
  };

  Relation.prototype.setTarget = function(id) {
    if (!this.isNew() && this.get(this.idAttribute)) {
      this.unset(this.idAttribute);
    }
    return this.set('^targetId', id);
  };

  Relation.prototype.getTarget = function() {
    return this.get('^targetId');
  };

  Relation.prototype.setSource = function(id) {
    if (!this.isNew() && this.get(this.idAttribute)) {
      this.unset(this.idAttribute);
    }
    return this.set('^sourceId', id);
  };

  Relation.prototype.deletedVersion = function() {
    var original;
    original = this.clone();
    original.setTarget(this.originalTargetId);
    original.markDeleted();
    original.set(this.idAttribute, this.originalRelationId);
    return original;
  };

  Relation.prototype.setDisplayName = function(name) {
    return this.displayName = name;
  };

  Relation.prototype.getDisplayName = function() {
    return this.displayName;
  };

  return Relation;

})(Backbone.Model);


},{"backbone":undefined,"underscore":undefined}],113:[function(require,module,exports){
var $, Backbone, DynamicRelationsEditor, Form, Relation, RelationAutocompleteView, RelationsCollection, dynamicRelationsTemplate, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

$ = Backbone.$;

Form = require('backbone-forms/distribution/backbone-forms');

Relation = require('../models/relation');

RelationsCollection = require('../collections/relations.coffee');

RelationAutocompleteView = require('./relation-autocomplete-item');

dynamicRelationsTemplate = require('../../templates/dynamic-relations.jade');

DynamicRelationsEditor = (function(_super) {
  __extends(DynamicRelationsEditor, _super);

  function DynamicRelationsEditor() {
    return DynamicRelationsEditor.__super__.constructor.apply(this, arguments);
  }

  DynamicRelationsEditor.prototype.tagName = 'span';

  DynamicRelationsEditor.prototype.template = dynamicRelationsTemplate;

  DynamicRelationsEditor.prototype.className = 'dynamic-relations-editor';

  DynamicRelationsEditor.prototype.events = {
    'click .add-new button': 'toggleAddButton',
    'click .add-new li': 'selectRelationType',
    'click button[data-action="remove"]': 'clickRemoveRelation',
    'updateRelationEvent': 'updateRelation'
  };

  DynamicRelationsEditor.prototype.initialize = function(options) {
    var t, _i, _len, _ref, _ref1;
    DynamicRelationsEditor.__super__.initialize.apply(this, arguments);
    this.schema = options.schema;
    _ref = this.schema, this.relationTypes = _ref.relationTypes, this.relationName = _ref.relationName;
    this.relationTypeVariation = this.schema.relationTypeVariation;
    this.relationTypeHelper = this.schema.relationTypeHelper;
    this.typeMap = {};
    _ref1 = this.relationTypes;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      t = _ref1[_i];
      this.typeMap[this.relationTypeHelper.getName(t)] = t;
    }
    this.relationViews = [];
    return this.initRelations();
  };

  DynamicRelationsEditor.prototype.toggleAddButton = function(e) {
    if (this.$('.add-new').hasClass('selection-box')) {
      this.hideSelectionBox();
    } else {
      this.showSelectionBox();
    }
    return e.preventDefault();
  };

  DynamicRelationsEditor.prototype.initRelations = function() {
    var rel, relations, type, _ref, _results;
    this.relations = new RelationsCollection;
    if (this.model.has('@relations')) {
      _ref = this.model.get('@relations');
      _results = [];
      for (type in _ref) {
        relations = _ref[type];
        _results.push((function() {
          var _i, _len, _results1;
          _results1 = [];
          for (_i = 0, _len = relations.length; _i < _len; _i++) {
            rel = relations[_i];
            if (type in this.typeMap) {
              if (rel.accepted) {
                _results1.push(this.addRelation(this.typeMap[type], rel.relationId, rel.id, rel.displayName, rel.rev));
              } else {
                _results1.push(void 0);
              }
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    }
  };

  DynamicRelationsEditor.prototype.selectRelationType = function(e) {
    var type, typeName;
    typeName = this.$(e.currentTarget).attr('data-type');
    type = this.typeMap[typeName];
    this.hideSelectionBox();
    this.addRelation(type);
    return e.preventDefault();
  };

  DynamicRelationsEditor.prototype.addRelation = function(relationType, relationId, targetId, displayName, rev) {
    var relation;
    relation = new Relation(this.relationTypeHelper.createRelation(relationType, this.model.id, targetId, rev, this.relationTypeVariation));
    if (relationId != null) {
      relation.set({
        _id: relationId
      });
    }
    if (displayName != null) {
      relation.setDisplayName(displayName);
    }
    this.relations.add(relation);
    return this.addRelationView(relation, relationType);
  };

  DynamicRelationsEditor.prototype.addRelationView = function(relation, relationType) {
    var autocomplete, view;
    autocomplete = this.relationTypeHelper.createAutoComplete(relationType);
    view = new RelationAutocompleteView({
      label: this.relationTypeHelper.getName(relationType),
      type: this.relationTypeHelper.getRelatedType(relationType),
      autocomplete: autocomplete,
      model: relation,
      relationTypeHelper: this.relationTypeHelper
    });
    view.render();
    this.relationViews.push(view);
    return this.$('.relations').append(view.el);
  };

  DynamicRelationsEditor.prototype.clickRemoveRelation = function(e) {
    var target;
    target = this.$(e.currentTarget);
    return this.removeRelation(target.closest('.timbuctoo-list-item').parent().index());
  };

  DynamicRelationsEditor.prototype.removeRelation = function(idx) {
    this.relations.removeRelation(idx);
    this.removeRelationView(this.relationViews[idx]);
    return this.relationViews.splice(idx, 1);
  };

  DynamicRelationsEditor.prototype.removeRelationView = function(rv) {
    rv.$el.fadeOut(150, (function(_this) {
      return function() {
        return rv.remove();
      };
    })(this));
    return this.render();
  };

  DynamicRelationsEditor.prototype.showSelectionBox = function() {
    var box;
    this.$('.add-new').addClass('selection-box');
    box = this.$('.add-new');
    return $(document).on('click.outsideBox', (function(_this) {
      return function(e) {
        if ((box.has(e.target).length === 0) && (!box.is(e.target))) {
          return _this.hideSelectionBox();
        }
      };
    })(this));
  };

  DynamicRelationsEditor.prototype.hideSelectionBox = function() {
    this.$('.add-new').removeClass('selection-box');
    return $(document).off('click.outsideBox');
  };

  DynamicRelationsEditor.prototype.renderRelations = function() {
    var r, t, typeMapById, _i, _j, _len, _len1, _ref, _ref1, _results;
    typeMapById = {};
    _ref = this.relationTypes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      t = _ref[_i];
      typeMapById[t.typeId] = t;
    }
    _ref1 = this.relations.showable();
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      r = _ref1[_j];
      _results.push(this.addRelationView(r, typeMapById[r.get('^typeId')]));
    }
    return _results;
  };

  DynamicRelationsEditor.prototype.render = function() {
    this.$el.html(this.template({
      relationTypeHelper: this.relationTypeHelper,
      relationTypes: this.relationTypes,
      relationName: this.relationName,
      humanizeRelationName: function(name) {
        return name.replace(/([a-z](?=[A-Z]))/g, '$1 ').toLowerCase();
      }
    }));
    this.renderRelations();
    return this;
  };

  DynamicRelationsEditor.prototype.getValue = function() {
    var value;
    value = this.relations.toJSON();
    return value;
  };

  DynamicRelationsEditor.prototype.updateRelation = function(e, triggeredByEvent) {
    var index, key, newItem, relation, target, test, typeId, value;
    target = this.$(triggeredByEvent.currentTarget);
    index = target.closest('.timbuctoo-list-item').parent().index();
    newItem = triggeredByEvent.added;
    relation = this.relations.at(index);
    typeId = relation.get('^typeId');
    test = (function() {
      var _ref, _results;
      _ref = this.typeMap;
      _results = [];
      for (key in _ref) {
        value = _ref[key];
        if (value.typeId === typeId) {
          _results.push(value);
        }
      }
      return _results;
    }).call(this);
    this.removeRelation(index);
    return this.addRelation(test[0], null, newItem.id, newItem.text, null);
  };

  return DynamicRelationsEditor;

})(Form.Editor);

module.exports = DynamicRelationsEditor;


},{"../../templates/dynamic-relations.jade":125,"../collections/relations.coffee":107,"../models/relation":112,"./relation-autocomplete-item":120,"backbone":undefined,"backbone-forms/distribution/backbone-forms":102,"underscore":undefined}],114:[function(require,module,exports){
(function (global){
var Backbone, EditForm, FilteredBackboneForm, Relation, customSerializer, fieldsToSave, timbuctooRelationRegex, _,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

global.jQuery = require('jquery');

global._ = _;

global.Backbone = Backbone;

Backbone.Form = require('backbone-forms/distribution/backbone-forms');

Backbone.Form.editors.Link = require('./link-editor');

Backbone.Form.editors.Names = require('./person-names-editor');

Backbone.Form.editors.ReadOnly = require('./read-only-editor');

Backbone.Form.editors.Relation = require('./relation-editor');

Backbone.Form.editors.DynamicRelations = require('./dynamic-relations-editor');

Backbone.Form.editors.List = require('backbone-forms/distribution/editors/list');

Backbone.BootstrapModal = require('backbone-forms/distribution/adapters/backbone.bootstrap-modal');

Backbone.Form.editors.List.Modal.ModalAdapter = Backbone.BootstrapModal;

Backbone.Form.Field.template = require('../../templates/field.jade');

Backbone.Form.Fieldset.template = require('../../templates/fieldset.jade');

Backbone.Form.editors.List.template = require('../../templates/list.jade');

Backbone.Form.editors.List.Item.template = require('../../templates/list-item.jade');

_.extend(Backbone.Form.validators, require('../helpers/validators'));

timbuctooRelationRegex = /^timbuctoo-relation\./;

Relation = require('../models/relation');

fieldsToSave = function(fields) {
  var field, shouldIgnore, _i, _len, _results;
  shouldIgnore = function(field) {
    return field !== '@type' && field !== '_id' && field !== '^rev' && field.match(/^[@_^]/);
  };
  _results = [];
  for (_i = 0, _len = fields.length; _i < _len; _i++) {
    field = fields[_i];
    if (!shouldIgnore(field)) {
      _results.push(field);
    }
  }
  return _results;
};

customSerializer = function() {
  var field, fields, json, v;
  json = Backbone.Model.prototype.toJSON.call(this, arguments);
  fields = fieldsToSave(_.keys(json));
  for (field in json) {
    v = json[field];
    if (__indexOf.call(fields, field) < 0) {
      delete json[field];
    }
  }
  return json;
};

FilteredBackboneForm = (function(_super) {
  __extends(FilteredBackboneForm, _super);

  function FilteredBackboneForm() {
    return FilteredBackboneForm.__super__.constructor.apply(this, arguments);
  }

  FilteredBackboneForm.prototype.relationPrefix = timbuctooRelationRegex;

  FilteredBackboneForm.prototype.getAllValues = function(key) {
    return FilteredBackboneForm.__super__.getValue.call(this, key);
  };

  FilteredBackboneForm.prototype.getRelations = function() {
    var k, relations, v, values;
    values = this.getAllValues();
    relations = {};
    for (k in values) {
      v = values[k];
      if (k.match(this.relationPrefix)) {
        relations[k] = v;
      }
    }
    return relations;
  };

  FilteredBackboneForm.prototype.getValue = function(key) {
    var filteredValues, k, v, values;
    values = FilteredBackboneForm.__super__.getValue.call(this, key);
    filteredValues = {};
    for (k in values) {
      v = values[k];
      if (!k.match(this.relationPrefix)) {
        filteredValues[k] = v;
      }
    }
    return filteredValues;
  };

  return FilteredBackboneForm;

})(Backbone.Form);

module.exports = EditForm = (function(_super) {
  __extends(EditForm, _super);

  function EditForm() {
    return EditForm.__super__.constructor.apply(this, arguments);
  }

  EditForm.prototype.initialize = function(options) {
    var _ref;
    this.options = options != null ? options : {};
    this.listenTo(this.model, 'sync', (function(_this) {
      return function() {
        return _this.render();
      };
    })(this));
    _ref = this.options, this.authToken = _ref.authToken, this.VRE_ID = _ref.VRE_ID, this.relationsUrl = _ref.relationsUrl;
    this.model.VRE_ID = this.VRE_ID;
    this.form = new FilteredBackboneForm(options);
    return this.render();
  };

  EditForm.prototype.saveRelation = function(data) {
    var relation;
    relation = new Relation(data);
    return relation.save(null, {
      url: relation.id ? "" + this.relationsUrl + "/" + relation.id : this.relationsUrl,
      dataType: 'text',
      contentType: 'application/json; charset=utf-8',
      headers: {
        Authorization: this.authToken,
        VRE_ID: this.VRE_ID
      }
    });
  };

  EditForm.prototype.resolveRelations = function(relationSets) {
    var relation, set, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = relationSets.length; _i < _len; _i++) {
      set = relationSets[_i];
      _results.push((function() {
        var _j, _len1, _results1;
        _results1 = [];
        for (_j = 0, _len1 = set.length; _j < _len1; _j++) {
          relation = set[_j];
          _results1.push(this.saveRelation(relation));
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  EditForm.prototype.save = function() {
    var errors, k, relationSets, result, toJSON, v;
    relationSets = (function() {
      var _ref, _results;
      _ref = this.form.getRelations();
      _results = [];
      for (k in _ref) {
        v = _ref[k];
        _results.push(v);
      }
      return _results;
    }).call(this);
    this.resolveRelations(relationSets);
    errors = this.form.commit();
    if (!errors) {
      toJSON = function() {
        return customSerializer.call(this, arguments);
      };
      this.model.toJSON = _.bind(toJSON, this.model);
      result = this.model.save(null, {
        dataType: 'text',
        beforeSend: (function(_this) {
          return function(xhr) {
            xhr.setRequestHeader('Authorization', _this.authToken);
            return xhr.setRequestHeader('VRE_ID', _this.VRE_ID);
          };
        })(this)
      }).always((function(_this) {
        return function() {
          toJSON = function() {
            return Backbone.Model.prototype.toJSON.call(this, arguments);
          };
          return _this.model.toJSON = _.bind(toJSON, _this.model);
        };
      })(this));
      return {
        errors: null,
        result: result
      };
    } else {
      return {
        errors: errors,
        result: null
      };
    }
  };

  EditForm.prototype.renderForm = function() {
    var el;
    el = this.form.render().el;
    this.$el.html(el);
    this.$('fieldset.collapsed .fields').hide();
    return this.$('fieldset legend').click(function(e) {
      var fs;
      fs = jQuery(e.currentTarget).parent();
      fs.toggleClass('collapsed');
      if (fs.hasClass('collapsed')) {
        return fs.find('.fields').slideUp(150);
      } else {
        return fs.find('.fields').slideDown(150);
      }
    });
  };

  EditForm.prototype.render = function() {
    this.$el.empty();
    return this.renderForm();
  };

  return EditForm;

})(Backbone.View);


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../templates/field.jade":126,"../../templates/fieldset.jade":127,"../../templates/list-item.jade":129,"../../templates/list.jade":130,"../helpers/validators":111,"../models/relation":112,"./dynamic-relations-editor":113,"./link-editor":115,"./person-names-editor":118,"./read-only-editor":119,"./relation-editor":121,"backbone":undefined,"backbone-forms/distribution/adapters/backbone.bootstrap-modal":101,"backbone-forms/distribution/backbone-forms":102,"backbone-forms/distribution/editors/list":103,"jquery":undefined,"underscore":undefined}],115:[function(require,module,exports){
var Backbone, Form, LinkEditor, linkTemplate, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

Form = require('backbone-forms/distribution/backbone-forms');

linkTemplate = require('../../templates/link.jade');

LinkEditor = (function(_super) {
  __extends(LinkEditor, _super);

  function LinkEditor() {
    return LinkEditor.__super__.constructor.apply(this, arguments);
  }

  LinkEditor.prototype.tagName = 'div';

  LinkEditor.prototype.className = 'link-editor';

  LinkEditor.prototype.template = linkTemplate;

  LinkEditor.prototype.events = {
    'change .label-field input': 'changeLabel',
    'change .url-field   input': 'changeUrl'
  };

  LinkEditor.prototype.changeLabel = function(e) {
    return this.value.label = e.currentTarget.value;
  };

  LinkEditor.prototype.changeUrl = function(e) {
    return this.value.url = e.currentTarget.value;
  };

  LinkEditor.prototype.initialize = function(options) {
    if (options == null) {
      options = {};
    }
    LinkEditor.__super__.initialize.apply(this, arguments);
    this.setValue(options.value);
    return this.render;
  };

  LinkEditor.prototype.getValue = function() {
    return this.value;
  };

  LinkEditor.prototype.setValue = function(value) {
    if (value == null) {
      value = {};
    }
    return this.value = value;
  };

  LinkEditor.prototype.render = function() {
    this.$el.html(this.template());
    this.$('.label-field input').val(this.value.label);
    this.$('.url-field input').val(this.value.url);
    return this;
  };

  LinkEditor.prototype.focus = function() {};

  LinkEditor.prototype.blur = function() {};

  return LinkEditor;

})(Form.Editor);

module.exports = LinkEditor;


},{"../../templates/link.jade":128,"backbone":undefined,"backbone-forms/distribution/backbone-forms":102,"underscore":undefined}],116:[function(require,module,exports){
var Backbone, Form, NameComponentEditor, nameComponentMetadata, nameComponentTemplate, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

Form = require('backbone-forms/distribution/backbone-forms');

nameComponentTemplate = require('../../templates/person-name-component.jade');

nameComponentMetadata = require('../../data/personnamecomponent.json');

NameComponentEditor = (function(_super) {
  __extends(NameComponentEditor, _super);

  function NameComponentEditor() {
    return NameComponentEditor.__super__.constructor.apply(this, arguments);
  }

  NameComponentEditor.prototype.tagName = 'span';

  NameComponentEditor.prototype.className = 'person-name-component-editor';

  NameComponentEditor.prototype.template = nameComponentTemplate;

  NameComponentEditor.prototype.events = {
    'change select': 'changeType',
    'change input[type=text]': 'changeValue'
  };

  NameComponentEditor.prototype.changeType = function(e) {
    this.value.type = e.currentTarget.value;
    return this.$('.remove-name-component span').text(this.value.type);
  };

  NameComponentEditor.prototype.changeValue = function(e) {
    return this.value.value = e.currentTarget.value;
  };

  NameComponentEditor.prototype.initialize = function(nameComponent) {
    if (nameComponent == null) {
      nameComponent = {};
    }
    return this.setValue(nameComponent);
  };

  NameComponentEditor.prototype.getValue = function() {
    return this.value;
  };

  NameComponentEditor.prototype.setValue = function(value) {
    if (value == null) {
      value = {};
    }
    return this.value = value;
  };

  NameComponentEditor.prototype.focus = function() {
    return this.$('input').focus();
  };

  NameComponentEditor.prototype.remove = function() {
    var removeMe;
    removeMe = (function(_this) {
      return function() {
        return NameComponentEditor.__super__.remove.apply(_this, arguments);
      };
    })(this);
    this.$el.addClass('removing');
    return _.delay(removeMe, 250);
  };

  NameComponentEditor.prototype.render = function() {
    var selectEl, _ref;
    this.$el.html(this.template({
      type: (_ref = this.value) != null ? _ref.type : void 0
    }));
    selectEl = this.$el.find('select');
    this.setUpSelect(selectEl);
    selectEl.val(this.value.type);
    this.$el.find('input').val(this.value.value);
    return this;
  };

  NameComponentEditor.prototype.setUpSelect = function(selectEl) {};

  return NameComponentEditor;

})(Form.Editor);

module.exports = NameComponentEditor;


},{"../../data/personnamecomponent.json":123,"../../templates/person-name-component.jade":131,"backbone":undefined,"backbone-forms/distribution/backbone-forms":102,"underscore":undefined}],117:[function(require,module,exports){
var Backbone, Form, NameComponentEditor, NameEditor, nameComponentMetadata, personNameEditorTemplate, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

Form = require('backbone-forms/distribution/backbone-forms');

NameComponentEditor = require('./person-name-component-editor');

personNameEditorTemplate = require('../../templates/person-name-editor.jade');

nameComponentMetadata = require('../../data/personnamecomponent.json');

NameEditor = (function(_super) {
  __extends(NameEditor, _super);

  function NameEditor() {
    return NameEditor.__super__.constructor.apply(this, arguments);
  }

  NameEditor.prototype.tagName = 'span';

  NameEditor.prototype.className = 'person-name-editor';

  NameEditor.prototype.template = personNameEditorTemplate;

  NameEditor.prototype.events = {
    'change .add-name-component-editor': 'addComponentEditor',
    'click .remove-name-component': 'removeComponentEditor',
    'click span.name': 'toggleNameEditor'
  };

  NameEditor.prototype.removeComponentEditor = function(e) {
    var component, componentToRemove, target;
    target = this.$(e.currentTarget);
    componentToRemove = target.closest('.timbuctoo-list-item').parent();
    component = this.nameComponentEditors.splice(componentToRemove.index(), 1)[0];
    return component.remove();
  };

  NameEditor.prototype.addComponentEditor = function(e) {
    var nameComponentEditor, selectedType;
    selectedType = e.currentTarget.value;
    nameComponentEditor = new NameComponentEditor({
      type: selectedType
    });
    this.nameComponentEditors.push(nameComponentEditor);
    this.renderComponentEditor(nameComponentEditor);
    nameComponentEditor.focus();
    return this.$('.add-name-component-editor')[0].selectedIndex = 0;
  };

  NameEditor.prototype.toggleRemovable = function(e) {
    return Backbone.$(e.currentTarget).prev().toggleClass('removable');
  };

  NameEditor.prototype.toggleNameEditor = function() {
    return this.$el.toggleClass('editing');
  };

  NameEditor.prototype.initialize = function(name) {
    var nameComponent, _i, _len, _ref, _results;
    this.name = name != null ? name : {};
    NameEditor.__super__.initialize.apply(this, arguments);
    this.nameComponentEditors = [];
    _ref = this.name.components || [];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      nameComponent = _ref[_i];
      _results.push(this.nameComponentEditors.push(new NameComponentEditor(nameComponent)));
    }
    return _results;
  };

  NameEditor.prototype.render = function() {
    var nameComponentEditor, _i, _len, _ref;
    console.log(nameComponentMetadata);
    this.$el.html(this.template({
      name: this.name,
      componentTypes: nameComponentMetadata.type.value
    }));
    this.renderName();
    _ref = this.nameComponentEditors;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      nameComponentEditor = _ref[_i];
      this.renderComponentEditor(nameComponentEditor);
    }
    return this;
  };

  NameEditor.prototype.renderName = function() {
    var c, components, names, _ref;
    components = ((_ref = this.name) != null ? _ref.components : void 0) || [];
    names = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = components.length; _i < _len; _i++) {
        c = components[_i];
        _results.push(c.value);
      }
      return _results;
    })();
    if (names.length) {
      return this.$('.name').text(names.join(" "));
    } else {
      return this.$('.name').html('<i>New name</i>');
    }
  };

  NameEditor.prototype.renderComponentEditor = function(nameComponentEditor) {
    nameComponentEditor.render();
    return this.$('.name-component-editors .add-name-component-editor').before(nameComponentEditor.$el);
  };

  NameEditor.prototype.getValue = function() {
    var componentEditor, components, name, _i, _len, _ref;
    components = [];
    _ref = this.nameComponentEditors;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      componentEditor = _ref[_i];
      components.push(componentEditor.getValue());
    }
    name = {
      components: components
    };
    return name;
  };

  NameEditor.prototype.focus = function() {};

  NameEditor.prototype.blur = function() {};

  return NameEditor;

})(Form.Editor);

module.exports = NameEditor;


},{"../../data/personnamecomponent.json":123,"../../templates/person-name-editor.jade":132,"./person-name-component-editor":116,"backbone":undefined,"backbone-forms/distribution/backbone-forms":102,"underscore":undefined}],118:[function(require,module,exports){
var Backbone, Form, NameEditor, NamesEditor, listTemplate, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

Form = require('backbone-forms/distribution/backbone-forms');

NameEditor = require('./person-name-editor');

listTemplate = require('../../templates/person-names-editor.jade');

NamesEditor = (function(_super) {
  __extends(NamesEditor, _super);

  function NamesEditor() {
    return NamesEditor.__super__.constructor.apply(this, arguments);
  }

  NamesEditor.prototype.tagName = 'span';

  NamesEditor.prototype.className = 'person-names-editor';

  NamesEditor.prototype.template = listTemplate;

  NamesEditor.prototype.events = {
    'click button.add-name-editor': 'addNameEditor',
    'click button.remove-name': 'removeNameEditor',
    'mouseenter button.remove-name': 'toggleRemovable',
    'mouseleave button.remove-name': 'toggleRemovable'
  };

  NamesEditor.prototype.addNameEditor = function(e) {
    var nameEditor;
    nameEditor = new NameEditor;
    this.nameEditors.push(nameEditor);
    return this.renderNameEditor(nameEditor);
  };

  NamesEditor.prototype.removeNameEditor = function(e) {
    var componentToRemove, target;
    target = this.$(e.currentTarget);
    componentToRemove = target.closest('.timbuctoo-list-item').parent();
    this.nameEditors.splice(componentToRemove.index(), 1);
    componentToRemove.remove();
    if (this.nameEditors.length === 0) {
      return this.addNameEditor(e);
    }
  };

  NamesEditor.prototype.toggleRemovable = function(e) {
    return Backbone.$(e.currentTarget).prev().toggleClass('removable');
  };

  NamesEditor.prototype.initialize = function(options) {
    var name, names, _i, _len, _results;
    if (options == null) {
      options = {};
    }
    names = options.model.attributes[options.key];
    NamesEditor.__super__.initialize.call(this, names);
    this.nameEditors = [];
    if (names.length === 0) {
      return this.nameEditors.push(new NameEditor);
    } else {
      _results = [];
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        name = names[_i];
        _results.push(this.nameEditors.push(new NameEditor(name)));
      }
      return _results;
    }
  };

  NamesEditor.prototype.render = function() {
    var nameEditor, _i, _len, _ref;
    this.$el.html(this.template());
    _ref = this.nameEditors;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      nameEditor = _ref[_i];
      this.renderNameEditor(nameEditor);
    }
    return this;
  };

  NamesEditor.prototype.renderNameEditor = function(nameEditor) {
    nameEditor.render();
    return this.$el.find('div.person-name-editors').append(nameEditor.$el);
  };

  NamesEditor.prototype.getValue = function() {
    var nameEditor, names, _i, _len, _ref;
    names = [];
    _ref = this.nameEditors;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      nameEditor = _ref[_i];
      names.push(nameEditor.getValue());
    }
    return names;
  };

  NamesEditor.prototype.focus = function() {};

  NamesEditor.prototype.blur = function() {};

  return NamesEditor;

})(Form.Editor);

module.exports = NamesEditor;


},{"../../templates/person-names-editor.jade":133,"./person-name-editor":117,"backbone":undefined,"backbone-forms/distribution/backbone-forms":102,"underscore":undefined}],119:[function(require,module,exports){
var Form, ReadOnlyEditor,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Form = require('backbone-forms/distribution/backbone-forms');

ReadOnlyEditor = (function(_super) {
  __extends(ReadOnlyEditor, _super);

  function ReadOnlyEditor() {
    return ReadOnlyEditor.__super__.constructor.apply(this, arguments);
  }

  ReadOnlyEditor.prototype.tagName = 'span';

  ReadOnlyEditor.prototype.className = 'readonly-editor';

  ReadOnlyEditor.prototype.initialize = function(options) {
    return ReadOnlyEditor.__super__.initialize.apply(this, arguments);
  };

  ReadOnlyEditor.prototype.render = function() {
    this.setValue(this.value);
    return this;
  };

  ReadOnlyEditor.prototype.getValue = function() {
    return this.value;
  };

  ReadOnlyEditor.prototype.setValue = function(value) {
    this.value = value;
    return this.$el.text(this.value);
  };

  ReadOnlyEditor.prototype.focus = function() {};

  ReadOnlyEditor.prototype.blur = function() {};

  return ReadOnlyEditor;

})(Form.Editor);

module.exports = ReadOnlyEditor;


},{"backbone-forms/distribution/backbone-forms":102}],120:[function(require,module,exports){
var Backbone, RelationAutocompleteItem, RelationItemView, select2, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

select2 = require('select2-browserify');

RelationItemView = require('./relation-item');

RelationAutocompleteItem = (function(_super) {
  __extends(RelationAutocompleteItem, _super);

  function RelationAutocompleteItem() {
    return RelationAutocompleteItem.__super__.constructor.apply(this, arguments);
  }

  RelationAutocompleteItem.prototype.minimumInputLength = 3;

  RelationAutocompleteItem.prototype.events = {
    'change input': 'setValue'
  };

  RelationAutocompleteItem.prototype.initialize = function(options) {
    var _ref, _ref1;
    this.options = options != null ? options : {};
    RelationAutocompleteItem.__super__.initialize.apply(this, arguments);
    _ref = this.options, this.autocomplete = _ref.autocomplete, this.label = _ref.label, this.type = _ref.type;
    _ref1 = this.options, this.relationTypeHelper = _ref1.relationTypeHelper, this.placeholderString = _ref1.placeholderString;
    return this.type != null ? this.type : this.type = 'object';
  };

  RelationAutocompleteItem.prototype.setValue = function(e) {
    var target;
    target = this.$(e.currentTarget);
    if (this.model.isNew()) {
      this.value = target.val();
      this.updateModel(this.model, this.value);
      return this.trigger('change:value', this.value);
    } else {
      return target.trigger('updateRelationEvent', e);
    }
  };

  RelationAutocompleteItem.prototype.updateModel = function(model, value) {
    if (this.relationTypeHelper !== null && this.relationTypeHelper !== void 0) {
      return this.relationTypeHelper.setRelatedModel(this.model, value);
    } else {
      return this.model.setTarget(value);
    }
  };

  RelationAutocompleteItem.prototype.transformResults = function(data) {
    var i, items, _i, _len, _ref;
    items = {
      results: []
    };
    _ref = data.refs;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      items.results.push({
        id: i.id,
        text: i.displayName
      });
    }
    return items;
  };

  RelationAutocompleteItem.prototype.render = function() {
    var $editor, input, label, options, text, _ref;
    this.$el.html(this.template());
    input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    $editor = this.$('span[data-editor]');
    if (this.label) {
      text = this.label.replace(/([a-z](?=[A-Z]))/g, '$1 ').toLowerCase();
      label = Backbone.$('<label>').addClass('timbuctoo-relation-type').text(text);
      $editor.append(label);
    }
    $editor.append(input);
    options = {
      allowClear: true,
      dropdownAutoWidth: true,
      placeholder: (_ref = this.placeholderString) != null ? _ref : "Find " + this.type + "...",
      minimumInputLength: this.minimumInputLength,
      query: (function(_this) {
        return function(query) {
          return _this.autocomplete(query.term).done(function(data) {
            var items;
            items = _this.transformResults(data);
            return query.callback(items);
          });
        };
      })(this)
    };
    this.$('input').select2(options);
    if (this.model.getDisplayName() != null) {
      return this.$('input').select2('data', {
        id: this.model.getTarget(),
        text: this.model.getDisplayName()
      });
    }
  };

  return RelationAutocompleteItem;

})(RelationItemView);

module.exports = RelationAutocompleteItem;


},{"./relation-item":122,"backbone":undefined,"select2-browserify":105,"underscore":undefined}],121:[function(require,module,exports){
var Backbone, Form, RelationAutocompleteView, RelationEditor, RelationView, RelationsCollection, listTemplate, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

RelationsCollection = require('../collections/relations.coffee');

Form = require('backbone-forms/distribution/backbone-forms');

listTemplate = require('../../templates/list.jade');

RelationView = require('./relation-item');

RelationAutocompleteView = require('./relation-autocomplete-item');

RelationEditor = (function(_super) {
  __extends(RelationEditor, _super);

  function RelationEditor() {
    return RelationEditor.__super__.constructor.apply(this, arguments);
  }

  RelationEditor.prototype.tagName = 'div';

  RelationEditor.prototype.className = 'relation-editor';

  RelationEditor.prototype.template = listTemplate;

  RelationEditor.prototype.relationViewClass = RelationView;

  RelationEditor.prototype.events = {
    'click button[data-action="add"]': 'clickAddRelation',
    'click button[data-action="remove"]': 'clickRemoveRelation',
    'updateRelationEvent': 'updateRelation'
  };

  RelationEditor.prototype.initialize = function(options) {
    var r, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _results;
    if (options == null) {
      options = {};
    }
    RelationEditor.__super__.initialize.apply(this, arguments);
    _.extend(this, Backbone.Events);
    this.relationName = this.key.replace(/^timbuctoo-relation\./, '');
    this.schema = options.schema;
    this.listOptions = (_ref = this.schema.options) != null ? _ref : [];
    this.relationTypeDescription = this.schema.relationTypeDescription;
    _ref1 = this.relationTypeDescription, this.relationTypeId = _ref1.relationTypeId, this.relationTypeVariation = _ref1.relationTypeVariation;
    this.relationTypeHelper = this.schema.relationTypeHelper;
    this.placeholderString = this.schema.placeholderString;
    _ref2 = this.relationTypeDescription, this.sourceType = _ref2.sourceType, this.targetType = _ref2.targetType;
    if (this.sourceType == null) {
      this.sourceType = this.model.get('@type');
    }
    if (this.schema.autocomplete != null) {
      this.relationViewClass = RelationAutocompleteView;
    }
    this.relationViews = [];
    this.relations = new RelationsCollection;
    _ref5 = (_ref3 = (_ref4 = this.model.get('@relations')) != null ? _ref4[this.relationName] : void 0) != null ? _ref3 : [];
    _results = [];
    for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
      r = _ref5[_i];
      if (r.accepted) {
        _results.push(this.addRelation(r.id, r.relationId, r.displayName, r.rev, r.accepted));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  RelationEditor.prototype.clickAddRelation = function(e) {
    return this.addRelation();
  };

  RelationEditor.prototype.clickRemoveRelation = function(e) {
    var target;
    target = this.$(e.currentTarget);
    return this.removeRelation(target.closest('.timbuctoo-list-item').parent().index());
  };

  RelationEditor.prototype.addRelation = function(relatedId, relId, displayName, rev, accepted) {
    var rel;
    if (relatedId == null) {
      relatedId = null;
    }
    if (relId == null) {
      relId = null;
    }
    if (displayName == null) {
      displayName = null;
    }
    if (rev == null) {
      rev = null;
    }
    if (accepted == null) {
      accepted = true;
    }
    rel = this.relations.add(this.relationTypeHelper.createRelation(this.relationTypeDescription, this.model.id, relatedId, rev, this.relationTypeVariation, relId));
    if (displayName != null) {
      rel.setDisplayName(displayName);
    }
    return this.addRelationView(rel);
  };

  RelationEditor.prototype.addRelationView = function(r) {
    var view;
    view = new this.relationViewClass({
      model: r,
      options: this.listOptions,
      relationTypeHelper: this.relationTypeHelper,
      placeholderString: this.placeholderString
    });
    if (this.schema.autocomplete != null) {
      view.autocomplete = this.schema.autocomplete;
    }
    view.render();
    this.relationViews.push(view);
    return this.$('div[data-items]').append(view.el);
  };

  RelationEditor.prototype.removeRelationView = function(rv) {
    return rv.$el.fadeOut(150, (function(_this) {
      return function() {
        return rv.remove();
      };
    })(this));
  };

  RelationEditor.prototype.removeRelation = function(idx) {
    this.relations.removeRelation(idx);
    this.removeRelationView(this.relationViews[idx]);
    return this.relationViews.splice(idx, 1);
  };

  RelationEditor.prototype.renderRelations = function() {
    var r, rv, _i, _j, _len, _len1, _ref, _ref1;
    this.$('div[data-items]').empty();
    _ref = this.relationViews;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      rv = _ref[_i];
      rv.remove();
    }
    this.relationViews = [];
    if (this.schema.onlyOne && this.relations.length === 0) {
      this.relations.add(this.relationTypeHelper.createRelation(this.relationTypeDescription, this.model.id, null, null, this.relationTypeVariation));
    }
    _ref1 = this.relations.showable();
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      r = _ref1[_j];
      this.addRelationView(r);
    }
    if (this.schema.onlyOne) {
      return this.$('button[data-action=remove]').hide();
    }
  };

  RelationEditor.prototype.render = function() {
    this.$el.html(this.template());
    if (this.schema.onlyOne) {
      this.$el.addClass('only-one-relation');
      this.$('button[data-action=add]').hide();
    }
    this.$list = this.$('div[data-items]');
    this.renderRelations();
    return this;
  };

  RelationEditor.prototype.relationData = function(target, relId, rev, accepted) {
    var data;
    if (relId == null) {
      relId = null;
    }
    if (rev == null) {
      rev = null;
    }
    if (accepted == null) {
      accepted = true;
    }
    data = {
      '@type': this.relationTypeVariation,
      'accepted': accepted,
      '^sourceType': this.sourceType,
      '^sourceId': this.model.id,
      '^typeType': 'relationtype',
      '^typeId': this.relationTypeId,
      '^targetType': this.targetType,
      '^targetId': target
    };
    if (relId != null) {
      data['_id'] = relId;
    }
    if (rev != null) {
      data['^rev'] = rev;
    }
    return data;
  };

  RelationEditor.prototype.getValue = function() {
    var value;
    value = this.relations.toJSON();
    return value;
  };

  RelationEditor.prototype.setValue = function(relationIds) {
    var id;
    return this.relations.reset((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = relationIds.length; _i < _len; _i++) {
        id = relationIds[_i];
        _results.push(this.relationData(id));
      }
      return _results;
    }).call(this));
  };

  RelationEditor.prototype.updateRelation = function(e, triggeredByEvent) {
    var index, newItem, target;
    target = this.$(triggeredByEvent.currentTarget);
    index = this.getIndexOf(target);
    this.removeRelation(index);
    newItem = triggeredByEvent.added;
    return this.addRelation(newItem.id, null, newItem.text, null, true);
  };

  RelationEditor.prototype.getIndexOf = function(target) {
    var index;
    index = target.closest('.timbuctoo-list-item').parent().index();
    return index;
  };

  RelationEditor.prototype.focus = function() {};

  RelationEditor.prototype.blur = function() {};

  return RelationEditor;

})(Form.Editor);

module.exports = RelationEditor;


},{"../../templates/list.jade":130,"../collections/relations.coffee":107,"./relation-autocomplete-item":120,"./relation-item":122,"backbone":undefined,"backbone-forms/distribution/backbone-forms":102,"underscore":undefined}],122:[function(require,module,exports){
var Backbone, RelationItem, dropdownTemplate, listItemTemplate, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

listItemTemplate = require('../../templates/list-item.jade');

dropdownTemplate = require('../../templates/dropdown.jade');

RelationItem = (function(_super) {
  __extends(RelationItem, _super);

  function RelationItem() {
    return RelationItem.__super__.constructor.apply(this, arguments);
  }

  RelationItem.prototype.template = listItemTemplate;

  RelationItem.prototype.editorTemplate = dropdownTemplate;

  RelationItem.prototype.tagName = 'div';

  RelationItem.prototype.events = {
    'change select': 'setValue'
  };

  RelationItem.prototype.initialize = function(options) {
    this.options = options != null ? options : {};
    _.extend(this, Backbone.Events);
    this.value = this.model.getTarget();
    return this.listOptions = this.options.options;
  };

  RelationItem.prototype.getValue = function() {
    return this.value;
  };

  RelationItem.prototype.setValue = function(e) {
    this.value = this.$(e.currentTarget).val();
    this.model.setTarget(this.value);
    return this.trigger('change:value', this.value);
  };

  RelationItem.prototype.render = function() {
    this.$el.html(this.template());
    this.$('span[data-editor]').html(this.editorTemplate({
      options: this.listOptions,
      defaultValue: this.value
    }));
    return this;
  };

  return RelationItem;

})(Backbone.View);

module.exports = RelationItem;


},{"../../templates/dropdown.jade":124,"../../templates/list-item.jade":129,"backbone":undefined,"underscore":undefined}],123:[function(require,module,exports){
module.exports={
  "value" : {
    "type" : "String"
  },
  "type" : {
    "value" : [ "SURNAME", "FORENAME", "ROLE_NAME", "ADD_NAME", "NAME_LINK", "GEN_NAME" ],
    "type" : "String"
  }
}
},{}],124:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),options = locals_.options,defaultValue = locals_.defaultValue;
buf.push("<span class=\"loading\"></span><select><option disabled=\"disabled\" selected=\"selected\"></option>");
// iterate options
;(function(){
  var $$obj = options;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var option = $$obj[$index];

buf.push("<option" + (jade.attr("value", option.value, true, false)) + (jade.attr("selected", (defaultValue == option.value), true, false)) + ">" + (jade.escape(null == (jade.interp = option.label !== null ? option.label : option.value) ? "" : jade.interp)) + "</option>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var option = $$obj[$index];

buf.push("<option" + (jade.attr("value", option.value, true, false)) + (jade.attr("selected", (defaultValue == option.value), true, false)) + ">" + (jade.escape(null == (jade.interp = option.label !== null ? option.label : option.value) ? "" : jade.interp)) + "</option>");
    }

  }
}).call(this);

buf.push("</select>");;return buf.join("");
};
},{"jade/runtime":104}],125:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),relationTypes = locals_.relationTypes,relationTypeHelper = locals_.relationTypeHelper,humanizeRelationName = locals_.humanizeRelationName,relationName = locals_.relationName;
buf.push("<div class=\"relations\"></div><div class=\"add-new\"><h5>Select type</h5><ul data-items=\"data-items\">");
// iterate relationTypes
;(function(){
  var $$obj = relationTypes;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var type = $$obj[$index];

buf.push("<li" + (jade.attr("data-type", relationTypeHelper.getName(type), true, false)) + ">" + (jade.escape(null == (jade.interp = humanizeRelationName(relationTypeHelper.getName(type))) ? "" : jade.interp)) + "</li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var type = $$obj[$index];

buf.push("<li" + (jade.attr("data-type", relationTypeHelper.getName(type), true, false)) + ">" + (jade.escape(null == (jade.interp = humanizeRelationName(relationTypeHelper.getName(type))) ? "" : jade.interp)) + "</li>");
    }

  }
}).call(this);

buf.push("</ul><button class=\"btn\">" + (jade.escape(null == (jade.interp = 'Add ' + relationName) ? "" : jade.interp)) + "</button></div>");;return buf.join("");
};
},{"jade/runtime":104}],126:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),key = locals_.key,editorId = locals_.editorId,title = locals_.title,help = locals_.help;
buf.push("<div" + (jade.cls(["field field-" + (key) + ""], [true])) + "><div" + (jade.attr("for", editorId, true, false)) + " class=\"field-label\">" + (jade.escape(null == (jade.interp = title) ? "" : jade.interp)) + "</div><span data-editor=\"data-editor\"></span><div class=\"error\"><i class=\"fa fa-times\"></i><span data-error=\"data-error\"></span></div><div class=\"help\">" + (jade.escape(null == (jade.interp = help) ? "" : jade.interp)) + "</div></div>");;return buf.join("");
};
},{"jade/runtime":104}],127:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),collapsed = locals_.collapsed,legend = locals_.legend;
buf.push("<fieldset" + (jade.cls([collapsed ? 'collapsed' : ''], [true])) + ">");
if ( legend)
{
buf.push("<legend>" + (jade.escape(null == (jade.interp = legend) ? "" : jade.interp)) + "</legend>");
}
buf.push("<div data-fields=\"data-fields\" class=\"fields\"></div></fieldset>");;return buf.join("");
};
},{"jade/runtime":104}],128:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<span class=\"loading\"></span><div class=\"timbuctoo-link-editor\"><div class=\"label-field\"><span>label</span><input type=\"text\" name=\"label\"/></div><div class=\"url-field\"><span>URL</span><input type=\"text\" name=\"url\"/></div></div>");;return buf.join("");
};
},{"jade/runtime":104}],129:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div class=\"timbuctoo-list-item\"><span data-editor=\"data-editor\"></span><button type=\"button\" data-action=\"remove\" title=\"Remove this item\"><i class=\"fa fa-minus\"></i><span>Remove</span></button></div>");;return buf.join("");
};
},{"jade/runtime":104}],130:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div class=\"timbuctoo-list-editor\"><div data-items=\"data-items\"></div><button type=\"button\" data-action=\"add\" title=\"Add another item\"><i class=\"fa fa-plus\"></i><span>Add</span></button></div>");;return buf.join("");
};
},{"jade/runtime":104}],131:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),type = locals_.type;
buf.push("<div class=\"timbuctoo-list-item\"><div class=\"name-component-editor\"><div class=\"component-header\"><label class=\"type\"><span>" + (jade.escape(null == (jade.interp = type) ? "" : jade.interp)) + "</span></label><span" + (jade.attr("title", type ? 'Remove this ' + type : 'Remove this component', true, false)) + " class=\"remove-name-component link\">Remove</span></div><input type=\"text\" name=\"value\"/></div></div>");;return buf.join("");
};
},{"jade/runtime":104}],132:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),componentTypes = locals_.componentTypes;
buf.push("<div class=\"timbuctoo-list-item\"><span class=\"name input-field\"></span><button type=\"button\" data-action=\"remove\" title=\"Remove this name\" class=\"remove-name\"><i class=\"fa fa-minus\"></i><span>Name</span></button><div class=\"timbuctoo-list-editor\"><div data-items=\"data-items\" class=\"name-component-editors\"><select class=\"add-name-component-editor\"><option disabled=\"disabled\" selected=\"selected\">Add component</option>");
// iterate componentTypes
;(function(){
  var $$obj = componentTypes;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var type = $$obj[$index];

buf.push("<option" + (jade.attr("value", type, true, false)) + ">" + (jade.escape(null == (jade.interp = type) ? "" : jade.interp)) + "</option>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var type = $$obj[$index];

buf.push("<option" + (jade.attr("value", type, true, false)) + ">" + (jade.escape(null == (jade.interp = type) ? "" : jade.interp)) + "</option>");
    }

  }
}).call(this);

buf.push("</select></div></div></div>");;return buf.join("");
};
},{"jade/runtime":104}],133:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div class=\"timbuctoo-list-editor\"><div data-items=\"data-items\" class=\"person-name-editors\"></div><button type=\"button\" data-action=\"add\" title=\"Add another name\" class=\"add-name-editor\"><i class=\"fa fa-plus\"></i><span>Name</span></button></div>");;return buf.join("");
};
},{"jade/runtime":104}]},{},[1]);
