type Queu = {
  fn: Function;
  arguments: any;
  priority: number;
  resolve: Function;
  reject: Function;
  started?: boolean;
};

type Options = Partial<{
  priority: number;
}>;

type OptionsConstructor = Partial<{
  maxSize: number;
  maxConcurrency: number;
}>;

class Enqueu {
  private _queu: Queu[] = [];
  private _paused = false;

  private _emptyFunction: Function;
  private _executedFunction: Function;
  private _executionFinishFunction: Function;

  private options: OptionsConstructor = {};

  constructor(options: OptionsConstructor = {}) {
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
  private computeQueuElement(queuElement: Queu) {
    return {
      fn: queuElement.fn,
      arguments: queuElement.arguments,
      priority: queuElement.priority,
    };
  }

  /**
   * Start the next element from the queu
   */
  private startNextQueuElement() {
    const actual = this._queu.find((e) => !e.started);

    if (!actual) return;

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

        if (this._queu.length > 0) this.startNextQueuElement();
        else if (this._emptyFunction) this._emptyFunction();
      });
  }

  /**
   * Same as createFn but directly add the function to the queu
   * @param fn
   * @param Options
   */
  public async add(fn: Function, options: Options = {}) {
    const queuFn = this.createFn(fn, options);
    return await queuFn();
  }

  /**
   * Create a function that register other function in the queu
   */
  public createFn(fn: Function, options: Options = {}) {
    const obj = this; //no function arrow because we need access to "arguments"

    return function () {
      return new Promise((resolve, reject) => {
        if (obj._queu.length === obj.options.maxSize) return; //if max size

        // adding to the queu
        const queuElement = {
          fn,
          arguments,
          priority: options.priority ?? Infinity,
          resolve,
          reject,
        };
        obj._queu.push(queuElement);

        //sorting by priority
        if (options.priority) obj._queu.sort((a, b) => a.priority - b.priority);

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
  public remove(fn: Function) {
    const index = this._queu.findIndex((e) => e.fn === fn);
    if (index === -1) return false;
    this.removeFromIndex(index);
    return true;
  }

  /**
   * Remove element from queu with the index
   * @param index
   */
  public removeFromIndex(index: number) {
    this._queu.splice(index, 1);
  }

  /**
   * Clear the actual queu
   */
  public clear() {
    this._queu = [];
  }

  /**
   * Pause the queu
   */
  public pause() {
    this._paused = true;
  }

  /**
   * Start after pause
   */
  public start() {
    this._paused = false;
    if (this._queu.length > 0) this.startNextQueuElement();
  }

  /**
   * When the queu is empty
   * @param fn
   */
  public onEmpty(fn: Function) {
    this._emptyFunction = fn;
  }

  /**
   * When a function is executed
   * @param fn
   */
  public onQueuElementExecuted(fn: Function) {
    this._executedFunction = fn;
  }

  /**
   * When a function have finish to be executed
   * @param fn
   */
  public onQueuElementFinishExecution(fn: Function) {
    this._executionFinishFunction = fn;
  }
}

export default Enqueu;
