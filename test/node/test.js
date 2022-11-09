const Enqueu = require("../../dist/index");

function wait(t) {
  return new Promise((_) => setTimeout(_, t));
}

const queu = new Enqueu({ maxSize: 3 });

queu.pause();

queu.add(function () {
  console.log(1);
  return wait(3000);
});

queu.add(function () {
  console.log(2);
  return wait(2000);
});

queu.add(function () {
  console.log(3);
  return wait(1000);
});

queu.add(function () {
  console.log(4);
  return wait(1);
});

queu.onQueuElementExecuted(function () {
  console.log("Pending:", queu.pending);
});

queu.onQueuElementFinishExecution(function () {
  console.log("Pending execution:", queu.pending);
});

if (queu.isPaused) {
  console.log("Queu paused", queu.isPaused);
  queu.start();
}

queu.onEmpty(function () {
  queu.pause();
  queu.add(function () {
    console.log(++id);
    return wait(2000);
  });
  console.log("Length:", queu.queu.length);
  queu.clear();
  console.log("Length:", queu.queu.length);
});
