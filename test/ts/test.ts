import Enqueu from "../../index";

function wait(t: number) {
  return new Promise((_) => setTimeout(_, t));
}

const queu = new Enqueu({ maxSize: 3 });
let id = 0;

queu.pause();

queu.add(function () {
  console.log(++id);
  return wait(2000);
});

queu.add(function () {
  console.log(++id);
  return wait(2000);
});

queu.add(function () {
  console.log(++id);
  return wait(2000);
});

queu.add(function () {
  console.log(++id);
  return wait(2000);
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
