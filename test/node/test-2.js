const Enqueu = require("../../dist/index");

const queu = new Enqueu();

queu
  .add(() => new Promise((r) => setTimeout(r, 6000)))
  .then((_) => console.log("hey"));
queu
  .add(() => new Promise((r) => setTimeout(r, 5000)))
  .then((_) => console.log("how are you ?"));
queu
  .add(() => new Promise((r) => setTimeout(r, 3000)))
  .then((_) => console.log("bye"));
queu
  .add(() => new Promise((r) => setTimeout(r, 500)), { priority: 1 }) //from 1 to Infinity
  .then((_) => console.log("my name is Yoann"));
