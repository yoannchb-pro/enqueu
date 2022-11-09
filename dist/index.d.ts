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
declare class Enqueu {
    private _queu;
    private _paused;
    private _emptyFunction;
    private _executedFunction;
    private _executionFinishFunction;
    private options;
    constructor(options?: OptionsConstructor);
    get isPaused(): boolean;
    get pending(): number;
    get queu(): Queu[];
    /**
     * Return important elements of queu element
     * @param queuElement
     * @returns
     */
    /**
     * Return important elements of queu element
     * @param queuElement
     * @returns
     */
    private computeQueuElement;
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
    add(fn: Function, options?: Options): Promise<unknown>;
    /**
     * Create a function that register other function in the queu
     */
    /**
     * Create a function that register other function in the queu
     */
    createFn(fn: Function, options?: Options): () => Promise<unknown>;
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
