# Enqueu

Promise queue for concurrency control

## Installation

```
$ npm i enqueu
```

or

```html
<script src="https://unpkg.com/enqueu@1.0.0/dist/index.js"></script>
```

## Example

In this case you will get "hey, my name is yoann, how are you ?, bye" and without Enqueu "my name is yoann, bye, how are you ?, hey".

```js
import Enqueu from "enqueu";

const queu = new Enqueu();

queu
  .add(() => new Promise((r) => setTimeout(r, 3000)))
  .then((_) => console.log("hey"));

queu
  .add(() => new Promise((r) => setTimeout(r, 2000)))
  .then((_) => console.log("how are you ?"));

queu
  .add(() => new Promise((r) => setTimeout(r, 1000)))
  .then((_) => console.log("bye"));

queu
  .add(() => new Promise((r) => setTimeout(r, 500)), { priority: 1 }) //from 1 to Infinity
  .then((_) => console.log("my name is Yoann"));
```

### With event listener

For example in this case if you click 4 times at once on the button you will get "10, 5, 2.5".
But without Enqueu you will get "1.25, 1.25, 1.25, 1.25".

```js
const queu = new Enqueu({ maxSize: 3 }); //the maximum size of the queu is 3 (other will be throwed off)

let count = 20;

document.querySelector("button").addEventListener(
  "click",
  queu.createFn(function () {
    count = count / 2;
    return new Promise((r) =>
      setTimeout(function () {
        r(count);
      }, count * 1000)
    );
  })
);
```

## Enqueu

### Constructor

- `maxSize` Max size of the queu
- `maxConcurrency` Max promise as the same time

### Attibutes

- `isPaused` Return a boolean to see if the queu is paused or not
- `pending` Return the number of pending functions
- `queu` Return the queu

### Methods

- `add(fn: Function, options: Options = {}): Function` Add the function to the queu
- `createFn(fn: Function, options: Options = {}): Function` Create a function that will add "fn" to the queu on call (useful for addEventListener for example)
- `pause()` Pause the queu
- `start()` Start the queu after a pause
- `onEmpty(fn: Function)` Call the function passed as argument when the queu is empty
- `onQueuElementExecuted(fn: Function)` Call the function passed as argument when the a new queu function is started
- `onQueuElementFinishExecution(fn: Function)` Call the function passed as argument when the a new queu function which started is finished
- `clear()` Clear the queu
- `remove(fn: Function)` Remove a function from the queu
- `removeFromIndex(index: number)` Remove a specified indexed element in the queu
