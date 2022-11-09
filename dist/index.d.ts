type Queu = {
    fn: Function;
    arguments: any;
    started?: boolean;
    priority: number;
};
type Options = Partial<{
    priority: number;
    execute: boolean;
}>;
declare class Enqueu {
    maxSize: number;
    private _queu;
    private _paused;
    private _emptyFunction;
    private _executedFunction;
    private _executionFinishFunction;
    constructor(maxSize?: number);
    get isPaused(): boolean;
    get pending(): number;
    get queu(): Queu[];
    /**
     * Start the next element from the queu
     */
    /**
     * Start the next element from the queu
     */
    private startNextQueuElement;
    /**
     * Same as createFn but directly add the function to the queu
     * @param fn
     * @param Options
     */
    /**
     * Same as createFn but directly add the function to the queu
     * @param fn
     * @param Options
     */
    add(fn: Function, options?: Options): void;
    /**
     * Create a function that register other function in the queu
     */
    /**
     * Create a function that register other function in the queu
     */
    createFn(fn: Function, options?: Options): () => Promise<void>;
    /**
     * Remove element from the queu
     * @param fn
     * @returns
     */
    /**
     * Remove element from the queu
     * @param fn
     * @returns
     */
    remove(fn: Function): boolean;
    /**
     * Remove element from queu with the index
     * @param index
     */
    /**
     * Remove element from queu with the index
     * @param index
     */
    removeFromIndex(index: number): void;
    /**
     * Clear the actual queu
     */
    /**
     * Clear the actual queu
     */
    clear(): void;
    /**
     * Pause the queu
     */
    /**
     * Pause the queu
     */
    pause(): void;
    /**
     * Start after pause
     */
    /**
     * Start after pause
     */
    start(): void;
    /**
     * When the queu is empty
     * @param fn
     */
    /**
     * When the queu is empty
     * @param fn
     */
    onEmpty(fn: Function): void;
    /**
     * When a function is executed
     * @param fn
     */
    /**
     * When a function is executed
     * @param fn
     */
    onQueuElementExecuted(fn: Function): void;
    /**
     * When a function have finish to be executed
     * @param fn
     */
    /**
     * When a function have finish to be executed
     * @param fn
     */
    onQueuElementFinishExecution(fn: Function): void;
}
export { Enqueu as default };
