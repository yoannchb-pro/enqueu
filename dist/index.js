(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Enqueu = factory());
})(this, (function () { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    class Enqueu {
        constructor(maxSize = Infinity) {
            this.maxSize = maxSize;
            this._queu = [];
            this._paused = false;
        }
        get isPaused() {
            return this._paused;
        }
        get pending() {
            return this._queu.length;
        }
        get queu() {
            return this._queu;
        }
        /**
         * Start the next element from the queu
         */
        startNextQueuElement() {
            return __awaiter(this, void 0, void 0, function* () {
                const actual = this._queu[0];
                if (this._executedFunction)
                    this._executedFunction(actual);
                yield actual.fn(...actual.arguments);
                this._queu.shift(); //after execution we remove it
                if (this._executionFinishFunction)
                    this._executionFinishFunction(actual);
                if (this._queu.length > 0)
                    this.startNextQueuElement();
                else if (this._emptyFunction)
                    this._emptyFunction();
            });
        }
        /**
         * Same as createFn but directly add the function to the queu
         * @param fn
         * @param Options
         */
        add(fn, options = {}) {
            const queuFn = this.createFn(fn, options);
            queuFn();
        }
        /**
         * Create a function that register other function in the queu
         */
        createFn(fn, options = {}) {
            const obj = this; //no function arrow because we need access to "arguments"
            return function () {
                var _a;
                return __awaiter(this, arguments, void 0, function* () {
                    if (obj._queu.length === obj.maxSize)
                        return; //if max size
                    obj._queu.push({ fn, arguments, priority: (_a = options.priority) !== null && _a !== void 0 ? _a : 0 }); // adding to the queu
                    if (options.priority)
                        obj._queu.sort((a, b) => a.priority - b.priority); //sorting by priority
                    //starting the function
                    if ((obj._queu.length === 1 && !obj._paused) || options.execute) {
                        yield obj.startNextQueuElement();
                    }
                });
            };
        }
        /**
         * Remove element from the queu
         * @param fn
         * @returns
         */
        remove(fn) {
            const index = this._queu.findIndex((e) => e.fn === fn);
            if (index === -1)
                return false;
            this.removeFromIndex(index);
            return true;
        }
        /**
         * Remove element from queu with the index
         * @param index
         */
        removeFromIndex(index) {
            this._queu.splice(index, 1);
        }
        /**
         * Clear the actual queu
         */
        clear() {
            this._queu = [];
        }
        /**
         * Pause the queu
         */
        pause() {
            this._paused = true;
        }
        /**
         * Start after pause
         */
        start() {
            this._paused = false;
            if (this._queu.length > 0)
                this.startNextQueuElement();
        }
        /**
         * When the queu is empty
         * @param fn
         */
        onEmpty(fn) {
            this._emptyFunction = fn;
        }
        /**
         * When a function is executed
         * @param fn
         */
        onQueuElementExecuted(fn) {
            this._executedFunction = fn;
        }
        /**
         * When a function have finish to be executed
         * @param fn
         */
        onQueuElementFinishExecution(fn) {
            this._executionFinishFunction = fn;
        }
    }

    return Enqueu;

}));
//# sourceMappingURL=index.js.map
