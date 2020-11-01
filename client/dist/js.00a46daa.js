// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"js/Dreams.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dream = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Dream = /*#__PURE__*/function () {
  /* -------------------------- CLASS CONSTRUCTOR -------------------------- */
  function Dream(props) {
    _classCallCheck(this, Dream);

    this.elements = props.getAll ? props.elements : [props.elements[props.index]];
    this.selector = props.selector;
    this.root = props.elements[0] === window || props.elements[0] === document ? true : false;
    this.length = props.length;
    this.length = props.elements.length;
    this.single = props.elements.length === 1;
    this.first = props.elements[0];
  }
  /* -------------------------- CYCLE METHODS -------------------------- */
  // Cycle Back


  _createClass(Dream, [{
    key: "cycle",
    value: function cycle() {
      return new Dream({
        elements: this.elements,
        selector: this.selector,
        getAll: true,
        index: 0
      });
    } // Cycle Back With New Elements And Selectors

  }, {
    key: "newCycle",
    value: function newCycle(elements, selector) {
      return new Dream({
        elements: elements,
        selector: selector ? selector : this.selector,
        getAll: true,
        index: 0
      });
    }
    /* -------------------------- DOM TREE METHOEDS -------------------------- */
    // Return Elements

  }, {
    key: "nodes",
    value: function nodes() {
      return this.single ? this.first : this.elements;
    }
  }, {
    key: "e",
    value: function e() {
      return this.single ? this.first : this.elements;
    } // Remove Elements

  }, {
    key: "remove",
    value: function remove() {
      this.elements.forEach(function (e) {
        return e.parentElement.removeChild(e);
      });
    } // Remove Inner Elements

  }, {
    key: "clear",
    value: function clear() {
      this.elements.forEach(function (e) {
        return e.innerHTML = "";
      });
      return this.cycle();
    } // Get Ancestor Element

  }, {
    key: "ancestor",
    value: function ancestor() {
      var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var ancestors = [];
      this.elements.forEach(function (element) {
        var e = element.parentElement;

        for (var i = 0; i < level; i++) {
          e = e.parentElement;
        }

        ancestors.push(e);
      });
      return this.newCycle(ancestors, "ancestor of \"".concat(this.selector, "\""));
    } // Shortcut To Get Direct Parent From Ancestor Class

  }, {
    key: "parent",
    value: function parent() {
      return this.ancestor(1);
    } // Returns an Array of All other nodes

  }, {
    key: "siblings",
    value: function siblings() {
      var family = [];
      this.elements.map(function (brother) {
        var sister = brother.parentElement.firstChild;

        while (sister) {
          if (sister !== brother && sister.nodeType === Node.ELEMENT_NODE) family.push(sister);
          sister = sister.nextElementSibling || sister.nextSibling;
        }
      });
      return this.newCycle(family, "siblings of \"".concat(this.selector, "\""));
    } // Execute Query Selector On Children Or Return All Children

  }, {
    key: "children",
    value: function children(selector) {
      var nodes = [];

      if (selector) {
        this.elements.forEach(function (element) {
          nodes = nodes.concat(Array.from(element.querySelectorAll(selector)));
        });
      } else {
        this.elements.forEach(function (element) {
          nodes = nodes.concat(Array.from(element.children));
        });
      }

      return this.newCycle(nodes, selector ? selector : "children of \"".concat(this.selector, "\""));
    } // Insert HTML Markup

  }, {
    key: "insert",
    value: function insert(content) {
      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "beforeend";
      this.elements.forEach(function (e) {
        return e.insertAdjacentHTML(position, content);
      });
      return this.cycle();
    } // Append Children To Nodes

  }, {
    key: "append",
    value: function append(nodes) {
      var list = nodes instanceof Dream ? nodes.elements : [nodes]; // Loop Thorugh And Append Children

      this.elements.forEach(function (e, index) {
        list.forEach(function (li) {
          e.appendChild(list.length === 1 && !index ? li : li.cloneNode(true));
        });
      });
      return this.cycle();
    }
  }, {
    key: "pop",
    value: function pop() {
      this.elements.forEach(function (e) {
        return e.removeChild(e.lastChild);
      });
    }
  }, {
    key: "idx",
    value: function idx(_idx) {
      var node = [this.elements[_idx]];
      return this.newCycle(node, this.selector);
    }
    /* -------------------------- ELEMENT PROPERTIES -------------------------- */
    // Convert Shorthand Keys

  }, {
    key: "get",
    // Get Property Value
    value: function get() {
      var _this = this;

      var attr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "value";
      var parse = arguments.length > 1 ? arguments[1] : undefined;
      var key = this.constructor.getElementKey(attr);
      var values = this.elements.map(function (e) {
        return parse ? _this.constructor.parse(parse, e[key]) : e[key];
      });
      return this.single ? values[0] : values;
    } // Set Property Value

  }, {
    key: "set",
    value: function set(attr, value) {
      var key = this.constructor.getElementKey(attr);
      this.elements.forEach(function (e) {
        return e.setAttribute(key, value);
      });
      return this;
    } // Get Value Of Element

  }, {
    key: "val",
    value: function val(parse) {
      return this.get('value', parse); //return value !== undefined || value !== null ? this.set( "value", value ) : this.get( "value", parse );
    }
  }, {
    key: "setVal",
    value: function setVal(value) {
      return this.set('value', value);
    }
  }, {
    key: "has",
    value: function has(attr) {
      var retrieve = function retrieve(e) {
        return e.hasAttribute(attr);
      };

      return this.single ? retrieve(this.first) : this.elements.map(function (e) {
        return retrieve(e);
      });
    } // Set Data Attributes

  }, {
    key: "setData",
    value: function setData(attr, value) {
      this.elements.forEach(function (e) {
        return e.dataset[attr] = value;
      });
      return this.cycle();
    } // Access Dataset Shortcut

  }, {
    key: "data",
    value: function data() {
      var _this2 = this;

      var attr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var parse = arguments.length > 1 ? arguments[1] : undefined;

      var retrieve = function retrieve(e) {
        var data = e.dataset[attr];
        return attr ? parse && data ? _this2.constructor.parse(parse, data) : data : e.dataset;
      };

      return this.single ? retrieve(this.first) : this.elements.map(function (e) {
        return retrieve(e);
      });
    } // Get Height Of Element

  }, {
    key: "height",
    value: function height() {
      var unit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      var heightOf = function heightOf(e) {
        return e.offsetHeight + unit;
      };

      return this.single ? heightOf(this.first) : this.elements.map(function (e) {
        return heightOf(e);
      });
    } // Get The Top Of The Element

  }, {
    key: "top",
    value: function top() {
      var unit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      var topOf = function topOf(e) {
        return e.offsetTop + unit;
      };

      return this.single ? topOf(this.first) : this.elements.map(function (e) {
        return topOf(e);
      });
    } // Get Window Position

  }, {
    key: "position",
    value: function position() {
      return this.single ? this.first.getBoundingClientRect() : this.elements.map(function (e) {
        return e.getBoundingClientRect();
      });
    } // Set HTML Content Shortcut

  }, {
    key: "html",
    value: function html(content, value) {
      if (!content) return this.get("innerHTML");
      if (Array.isArray(content)) this.elements.forEach(function (e, i) {
        e.innerHTML = content[i];
      });else this.elements.forEach(function (e) {
        e.innerHTML = content;
      });
      return this.cycle();
    } // Set TextContent Shortcut

  }, {
    key: "text",
    value: function text(content, value) {
      if (!content) return this.get("textContent");
      if (Array.isArray(content)) this.elements.forEach(function (e, i) {
        e.textContent = content[i];
      });else this.elements.forEach(function (e) {
        e.textContent = content;
      });
      return this.cycle();
    }
    /* -------------------------- ELEMENT STYLE METHODS -------------------------- */
    // Set Timeout Shortcut

  }, {
    key: "clearClassList",
    value: function clearClassList() {
      this.elements.forEach(function (e) {
        return Array.from(e.classList).forEach(function (className) {
          return e.classList.remove(className);
        });
      });
      return this;
    } // Add Classes

  }, {
    key: "addClass",
    value: function addClass(classNames) {
      this.elements.forEach(function (e) {
        return classNames.split(' ').forEach(function (className) {
          return e.classList.add(className);
        });
      });
      return this;
    } // Remove Classes

  }, {
    key: "removeClass",
    value: function removeClass(classNames) {
      this.elements.forEach(function (e) {
        return classNames.split(' ').forEach(function (className) {
          return e.classList.remove(className);
        });
      });
      return this;
    } // Toggle A Class

  }, {
    key: "toggle",
    value: function toggle(name, force) {
      this.elements.forEach(function (e) {
        return e.classList.toggle(name, force);
      });
      return this.cycle();
    } // Set CSS Properties

  }, {
    key: "css",
    value: function css(properties) {
      this.elements.forEach(function (e) {
        return Object.assign(e.style, properties);
      });
      return this.cycle();
    } // Wait For Transitions To End 

  }, {
    key: "transition",
    value: function () {
      var _transition = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(style) {
        var _this3 = this;

        var endEvent, length;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // 1. Get Transitionend Event Name
                endEvent = this.constructor.getTransitionEndEventName(); // 2. Get Length Of Element Lists

                length = this.elements.length; // 3. Await All Transitions To Complete

                _context.next = 4;
                return new Promise(function (resolve) {
                  // Count Number Of Completed Animations
                  var t = 0; // Function That Resolves Promise When Complete

                  var trackEvents = function trackEvents() {
                    t++;
                    if (t === length) resolve();
                  }; // Loop Through Elements And Listen From Transitions


                  _this3.elements.forEach(function (element) {
                    // Convert Transition Duration To Number
                    var duration = parseFloat(window.getComputedStyle(element).getPropertyValue('transition-duration').replace("s", "")); // If No Transition Shorten Length Of Elements

                    if (!duration) return length--; // Devine Event Listener

                    var finished = function finished(e) {
                      element.removeEventListener('transitionend', finished);
                      trackEvents();
                    }; // Attach Event Listener


                    element.addEventListener('transitionend', finished);
                  }); // Apply Desired CSS Properties


                  _this3.css(style); // If No Elements Have Transitions Then Immediately Resolve


                  if (!length) resolve();
                });

              case 4:
                return _context.abrupt("return", this.cycle());

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function transition(_x) {
        return _transition.apply(this, arguments);
      }

      return transition;
    }() // Hide Item Using CSS Property

  }, {
    key: "hide",
    value: function hide() {
      var wait = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (!this.length) return Promise.resolve();
      var style = {
        "opacity": "0"
      };
      return wait ? this.transition(style) : this.css(style);
    } // Show Item Using Css Property

  }, {
    key: "show",
    value: function show() {
      var wait = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (!this.length) return Promise.resolve();
      var style = {
        "opacity": "1"
      };
      return wait ? this.transition(style) : this.css(style);
    }
    /* -------------------------- EVENT LISTENER METHODS -------------------------- */
    // Attach Event Listeners

  }, {
    key: "on",
    value: function on(eventType, eventAction) {
      this.elements.forEach(function (element) {
        eventType.split(" ").forEach(function (event) {
          element.addEventListener(event, eventAction);
        });
      });
      return this.cycle();
    }
  }, {
    key: "kill",
    value: function kill() {
      this.elements = this.elements.map(function (el) {
        var clone = el.cloneNode(true);
        el.parentNode.replaceChild(clone, el);
        return clone;
      });
      return this.cycle();
    } // Remove Event Listeners

  }, {
    key: "off",
    value: function off(shallow) {
      this.elements.forEach(function (element) {
        return element.removeEventListener(eventType, eventAction);
      }); // this.elements.forEach(element => {
      //     let clone;
      //     if (!shallow) {
      //         clone = element.cloneNode(true);
      //     }
      //     else {
      //         clone = element.cloneNode(false);
      //         while (element.hasChildNodes()) clone.appendChild(element.firstChild);
      //     }
      //     element.parentNode.replaceChild(clone, element);
      // });

      return this;
    } // Prevent Default Action

  }, {
    key: "prevent",
    value: function prevent(event, eventAction) {
      var action = eventAction ? function (e) {
        e.preventDefault();
        eventAction(e);
      } : function (e) {
        return e.preventDefault();
      };
      return this.on(event, action);
    } // Click Action Shortcut

  }, {
    key: "click",
    value: function click(action) {
      return this.on("click", action);
    } // Attach Event Listener To Parent

  }, {
    key: "listenFor",
    value: function listenFor(eventTypes, selector, eventAction) {
      // Potential use of closest method. more research is needed
      // Loop Through And Delegate Events
      this.elements.forEach(function (parent) {
        // Filter Event Targets
        var delegate = function delegate(event) {
          // Get Potential Target Nodes
          var nodes = parent.querySelectorAll(selector);
          var target = event.target;
          nodes.forEach(function (node) {
            var current = target;

            while (current && current !== parent) {
              if (current === node) {
                if (event.stopPropogation) event.stopPropogation();
                return eventAction.call(node, event);
              }

              current = current.parentNode;
            }
          });
        };

        eventTypes.split(' ').forEach(function (event) {
          return parent.addEventListener(event, delegate);
        });
      }); // Return Function To Be Chained

      return this.cycle();
    } // Dispath An Event

  }, {
    key: "dispatch",
    value: function dispatch(event) {
      this.elements.forEach(function (element) {
        return element.dispatchEvent(event);
      });
      return this.cycle();
    } // On Resize

  }, {
    key: "onresize",
    value: function onresize(callback, bind) {
      var observer = new ResizeObserver(bind ? callback : function () {
        return callback();
      });
      this.elements.forEach(function (element) {
        observer.observe(element);
      });
      return this;
    }
    /* -------------------------- ELEMENT ARRAY METHODS -------------------------- */
    // Iterate Over Function

  }, {
    key: "forEach",
    value: function forEach(fn) {
      this.elements.forEach(fn);
      return this.cycle();
    } // Map Function Values

  }, {
    key: "map",
    value: function map(fn) {
      return this.elements.map(fn);
    } // Filter Function

  }, {
    key: "filter",
    value: function filter(test) {
      this.elements = Array.from(this.elements).filter(test);
      this.length = this.elements.length;
      return this;
    }
  }, {
    key: "concat",
    value: function concat(otherDream) {
      return this.newCycle(this.elements.concat(otherDream.elements), "".concat(this.selector || '').concat(this.selector ? ', ' : ' ').concat(otherDream.selector || ''));
    }
    /* -------------------------- OTHER METHODS -------------------------- */
    // Delay Events

  }, {
    key: "delay",
    value: function () {
      var _delay = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(time) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.constructor.timeout(time);

              case 2:
                return _context2.abrupt("return", this.cycle());

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function delay(_x2) {
        return _delay.apply(this, arguments);
      }

      return delay;
    }() // Selector Shortcut

  }], [{
    key: "getElementKey",
    value: function getElementKey(value) {
      var key;

      switch (value) {
        case "html":
          key = "innerHTML";
          break;

        case "text":
          key = "textContent";
          break;

        case "top":
          key = "offsetTop";
          break;

        case "height":
          key = "offsetHeight";

        default:
          key = value;
      }

      return key;
    } // Parse Values

  }, {
    key: "parse",
    value: function parse(type, value) {
      switch (type.toLowerCase()) {
        case "int":
        case "i":
          return parseInt(value);
          break;

        case "float":
        case "f":
          return parseFloat(value);
          break;

        case "json":
          return JSON.parse(value);
          break;

        default:
          return value;
      }
    }
  }, {
    key: "timeout",
    value: function timeout(ms) {
      return new Promise(function (resolve) {
        return setTimeout(resolve, ms);
      });
    } // Get Transition Event Name

  }, {
    key: "getTransitionEndEventName",
    value: function getTransitionEndEventName() {
      var transitions = {
        "transition": "transitionend",
        "OTransition": "oTransitionEnd",
        "MozTransition": "transitionend",
        "WebkitTransition": "webkitTransitionEnd"
      };
      var bodyStyle = document.body.style;

      for (var transition in transitions) {
        if (bodyStyle[transition] != undefined) {
          return transitions[transition];
        }
      }
    }
  }, {
    key: "select",
    value: function select(selector) {
      return Array.from(document.querySelectorAll(selector));
    }
  }]);

  return Dream;
}(); // Create Timer class


var Timer = /*#__PURE__*/function () {
  function Timer() {
    var threshold = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2000;

    _classCallCheck(this, Timer);

    this.threshold = threshold;
    this.timeout = null;
  }

  _createClass(Timer, [{
    key: "start",
    value: function start(callback) {
      this.initial = new Date();
      if (!callback) return;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(callback, this.threshold);
    }
  }, {
    key: "stop",
    value: function stop() {
      this.final = new Date();
      this.elapsed = this.final - this.initial;
      this.remaining = this.elapsed >= this.threshold ? 0 : this.threshold - this.elapsed;
    }
  }, {
    key: "hold",
    value: function () {
      var _hold = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.stop();

                if (!this.remaining) {
                  _context3.next = 4;
                  break;
                }

                _context3.next = 4;
                return Dream.timeout(this.remaining);

              case 4:
                return _context3.abrupt("return", true);

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function hold() {
        return _hold.apply(this, arguments);
      }

      return hold;
    }()
  }, {
    key: "reset",
    value: function reset() {
      this.elapsed = 0;
      this.remaining = 0;
    }
  }]);

  return Timer;
}(); // Initialize New Dom Class


var initDream = function initDream(selector, index) {
  var isElement = _typeof(selector) === 'object';
  return new Dream({
    elements: isElement ? selector.length ? selector : [selector] : Dream.select(selector),
    selector: isElement ? null : selector,
    getAll: isElement ? true : index || index === 0 ? false : true,
    index: index
  });
}; // Export Async Delay Function


initDream.delay = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(time) {
    var content,
        _args4 = arguments;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            content = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : true;
            _context4.next = 3;
            return Dream.timeout(time);

          case 3:
            return _context4.abrupt("return", content);

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x3) {
    return _ref.apply(this, arguments);
  };
}(); // Convert HTML String To Dream Class


initDream.html = function (markup) {
  var html = markup.trim();
  var template = document.createElement('template');
  template.innerHTML = html;
  return new Dream({
    elements: Array.from(template.content.children),
    selector: null,
    getAll: true,
    index: null
  });
}; // Link Timer Class To Dreams


initDream.timer = function (threshold) {
  return new Timer(threshold);
}; // Check For Instance Of Dream


initDream.dreaming = function (obj) {
  return obj instanceof Dream;
}; // Loop Through Opject


initDream.each = function (obj, fx) {
  for (var _i = 0, _Object$entries = Object.entries(obj); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];

    fx(key, value);
  }
}; // Export Shortcut Class


var dream = initDream; // // Export Dollar Format
// export const usd = ( x, prefix, suffix ) => {
//     if ( !x ) return `${!prefix ? "" : prefix }0.00${!suffix ? "" : suffix}`;
//     return `${(x < 0) ? "-" : ""}${ !prefix ? "" : prefix }${Array.from( Math.abs(x).toFixed(2).split(".")[0] ).reverse().map( ( int, i, d ) => ( ( ( i + 1 ) % 3 ) === 0 && i !== ( d.length - 1 ) ) ? `,${int}` : int ).reverse().join("")}.${x.toFixed(2).split(".")[1]}${!suffix ? "" : suffix}`;
// };

/* Copyright 2020 Arjun Samir Patel
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

exports.dream = dream;
},{}],"../../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/os-browserify/browser.js":[function(require,module,exports) {
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};

},{}],"../../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../../node_modules/uniqid/index.js":[function(require,module,exports) {
var process = require("process");
/* 
(The MIT License)
Copyright (c) 2014-2019 Halász Ádám <mail@adamhalasz.com>
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//  Unique Hexatridecimal ID Generator
// ================================================

//  Dependencies
// ================================================
var pid = process && process.pid ? process.pid.toString(36) : '' ;
var address = '';
if(typeof __webpack_require__ !== 'function'){
    var mac = '', networkInterfaces = require('os').networkInterfaces();
    for(let interface_key in networkInterfaces){
        const networkInterface = networkInterfaces[interface_key];
        const length = networkInterface.length;
        for(var i = 0; i < length; i++){
            if(networkInterface[i].mac && networkInterface[i].mac != '00:00:00:00:00:00'){
                mac = networkInterface[i].mac; break;
            }
        }
    }
    address = mac ? parseInt(mac.replace(/\:|\D+/gi, '')).toString(36) : '' ;
} 

//  Exports
// ================================================
module.exports = module.exports.default = function(prefix, suffix){ return (prefix ? prefix : '') + address + pid + now().toString(36) + (suffix ? suffix : ''); }
module.exports.process = function(prefix, suffix){ return (prefix ? prefix : '') + pid + now().toString(36) + (suffix ? suffix : ''); }
module.exports.time    = function(prefix, suffix){ return (prefix ? prefix : '') + now().toString(36) + (suffix ? suffix : ''); }

//  Helpers
// ================================================
function now(){
    var time = Date.now();
    var last = now.last || time;
    return now.last = time > last ? time : last + 1;
}

},{"os":"../../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/os-browserify/browser.js","process":"../../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"js/index.js":[function(require,module,exports) {
"use strict";

require("regenerator-runtime/runtime");

var _Dreams = require("./Dreams");

var _uniqid = _interopRequireDefault(require("uniqid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Import Runtime
// Import Dreams
window.$ = _Dreams.dream;
var TESTINGMODE = true;
if (TESTINGMODE) localStorage.clear(); // Define Socket IO

var socket = window.io();
var hide = {
  display: 'none'
};
var show = {
  display: 'block'
};
var id;
var urlParams = new URLSearchParams(window.location.search);
var code = urlParams.get('code');

if (code) {
  $('.player__join-code').css(hide);
  $('.player__join-name').css(show);
}

$('#enter-game').on('click', function () {
  code = $('#game-code').val();
  if (code.length < 6) return alert('Please enter a valid game code');
  $('.player__join-code').css(hide);
  $('.player__join-name').css(show);
});
$('#join-game').on('click', function () {
  var name = $('#player-name').val();
  if (!name) return alert('Please enter a username');
  id = (0, _uniqid.default)('name');
  socket.emit('join-game', {
    code: code,
    name: name,
    id: id,
    tasks: []
  });
});
socket.on('join-success', function (game) {
  console.log(game);
  $('.player__join').css(hide);
  $('.player__waiting').css(show);
});
socket.on('join-fail', function (res) {
  return alert(res);
});
socket.on('tasks-assigned', function (game) {
  console.log(game);
  var comrade = game.comrades.find(function (comrade) {
    return comrade.id === id;
  });
  var imposter = game.imposters.find(function (imposter) {
    return imposter.id === id;
  });
  var tasks;

  if (comrade) {
    tasks = comrade.tasks;
  } else tasks = imposter.tasks;

  console.log(tasks);
  $('.player__tasks-container').html(tasks.map(function (t) {
    return "\n        <div style=\"margin-bottom: 2rem\">\n            <h2>".concat(t.name, "</h2>\n            <p style=\"margin-bottom: 1rem\">").concat(t.description, "</p>\n            <h4>Rules</h4>\n            <p style=\"margin-bottom: 1rem\" style=\"margin-bottom: 1rem\">").concat(t.rules, "</p>\n            <p style=\"font-style: italic\">Hint: ").concat(t.hint ? t.hint : 'No hint for you', "</p>\n        </div> \n    ");
  }).join(''));
  $('.player__waiting').css(hide);
  $('.player__game').css(show);
});
},{"regenerator-runtime/runtime":"../../node_modules/regenerator-runtime/runtime.js","./Dreams":"js/Dreams.js","uniqid":"../../node_modules/uniqid/index.js"}],"../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62158" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/index.js"], null)
//# sourceMappingURL=/js.00a46daa.js.map