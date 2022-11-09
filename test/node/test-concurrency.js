const Enqueu = require("../../dist/index");

const queu = new Enqueu({ maxConcurrency: 2 });

queu
  .add(() => new Promise((r) => setTimeout(r, 6000)))
  .then((_) => console.log("hey"));
queu
  .add(() => new Promise((r) => setTimeout(r, 3000)))
  .then((_) => console.log("how are you ?"));
queu
  .add(() => new Promise((r) => setTimeout(r, 2000)))
  .then((_) => console.log("bye"));
