type Queu = {
  fn: Function;
  arguments: any;
  priority: number;
};

type Options = Partial<{
  priority: number;
  execute: boolean;
}>;

class Enqueu {
  private _queu: Queu[] = [];
  private _paused = false;

  private _emptyFunction: Function;
  private _executedFunction: Function;
  private _executionFinishFunction: Function;

  constructor(public maxSize: number = Infinity) {}

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
  private async startNextQueuElement() {
    const actual = this._queu[0];

    if (this._executedFunction) this._executedFunction(actual);

    await actual.fn(...actual.arguments);

    this._queu.shift(); //after execution we remove it

    if (this._executionFinishFunction) this._executionFinishFunction(actual);

    if (this._queu.length > 0) this.startNextQueuElement();
    else if (this._emptyFunction) this._emptyFunction();
  }

  /**
   * Same as createFn but directly add the function to the queu
   * @param fn
   * @param Options
   */
  public add(fn: Function, options: Options = {}) {
    const queuFn = this.createFn(fn, options);
    queuFn();
  }

  /**
   * Create a function that register other function in the queu
   */
  public createFn(fn: Function, options: Options = {}) {
    const obj = this; //no function arrow because we need access to "arguments"

    return async function () {
      if (obj._queu.length === obj.maxSize) return; //if max size

      obj._queu.push({ fn, arguments, priority: options.priority ?? 0 }); // adding to the queu
      if (options.priority) obj._queu.sort((a, b) => a.priority - b.priority); //sorting by priority

      //starting the function
      if ((obj._queu.length === 1 && !obj._paused) || options.execute) {
        await obj.startNextQueuElement();
      }
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
