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
        constructor(options = {}) {
            this._queu = [];
            this._paused = false;
            this.options = {};
            Object.assign(this.options, { maxConcurrency: 1 }, options);
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
         * Return important elements of queu element
         * @param queuElement
         * @returns
         */
        computeQueuElement(queuElement) {
            return {
                fn: queuElement.fn,
                arguments: queuElement.arguments,
                priority: queuElement.priority,
            };
        }
        /**
         * Start the next element from the queu
         */
        startNextQueuElement() {
            const actual = this._queu.find((e) => !e.started);
            if (!actual)
                return;
            actual.started = true;
            if (this._executedFunction)
                this._executedFunction(this.computeQueuElement(actual));
            actual
                .fn(...actual.arguments)
                .then(actual.resolve)
                .catch(actual.reject)
                .finally(() => {
                //after execution we remove it
                const index = this._queu.findIndex((e) => e === actual);
                this._queu.splice(index, 1);
                if (this._executionFinishFunction)
                    this._executionFinishFunction(this.computeQueuElement(actual));
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
            return __awaiter(this, void 0, void 0, function* () {
                const queuFn = this.createFn(fn, options);
                return yield queuFn();
            });
        }
        /**
         * Create a function that register other function in the queu
         */
        createFn(fn, options = {}) {
            const obj = this; //no function arrow because we need access to "arguments"
            return function () {
                return new Promise((resolve, reject) => {
                    var _a;
                    if (obj._queu.length === obj.options.maxSize)
                        return; //if max size
                    // adding to the queu
                    const queuElement = {
                        fn,
                        arguments,
                        priority: (_a = options.priority) !== null && _a !== void 0 ? _a : Infinity,
                        resolve,
                        reject,
                    };
                    obj._queu.push(queuElement);
                    //sorting by priority
                    if (options.priority)
                        obj._queu.sort((a, b) => a.priority - b.priority);
                    //starting the function
                    if (obj._queu.length <= obj.options.maxConcurrency && !obj._paused) {
                        obj.startNextQueuElement();
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
