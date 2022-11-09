# Enqueu

> NOTE: The project documentation still in development and the package is not published yet

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

```js
import Enqueu from "enqueu";

const queu = new Enqueu();

queu.add(() => fetch("/home"));
queu.add(() => fetch("/about"));
queu.add(() => fetch("/enqueu"));
```

With event listener

```js
const queu = new Enqueu(3); //the maximum size of the queu is 3 (other will be throwed off)

document.querySelector("button").addEventListener(
  "click",
  queu.createFn(function () {
    return fetch("/add-article").then(() => console.log("added"));
  })
);

//if we click 5 times we will get added, added, added (each function we will wait the other one finished)
```
