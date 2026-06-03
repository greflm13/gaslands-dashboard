import { el } from "./render";

let diceCount = 1;
let diceCubes = [];
const resultsDiv = el("div", { class: "diceResults" });

const normalFaces = [
  { cls: "front", val: "/img/1.svg" },
  { cls: "back", val: "/img/6.svg" },
  { cls: "right", val: "/img/3.svg" },
  { cls: "left", val: "/img/4.svg" },
  { cls: "top", val: "/img/5.svg" },
  { cls: "bottom", val: "/img/2.svg" },
];

const skidFaces = [
  { cls: "front", val: "/img/hazard.svg" },
  { cls: "back", val: "/img/shift.svg" },
  { cls: "right", val: "/img/spin.svg" },
  { cls: "left", val: "/img/shift.svg" },
  { cls: "top", val: "/img/shift.svg" },
  { cls: "bottom", val: "/img/slide.svg" },
];

function closeDicePage() {
  const diceDiv = document.getElementById("diceDiv");
  const editDiv = document.getElementById("editDiv");
  const printDiv = document.getElementById("printDiv");
  const headerDiv = document.getElementById("headerDiv");

  editDiv.style.display = "grid";
  printDiv.style.display = "none";
  headerDiv.style.display = "block";
  diceDiv.style.display = "none";
}

export function renderDicePage() {
  const diceDiv = document.getElementById("diceDiv");
  const editDiv = document.getElementById("editDiv");
  const printDiv = document.getElementById("printDiv");
  const headerDiv = document.getElementById("headerDiv");

  editDiv.style.display = "none";
  printDiv.style.display = "none";
  headerDiv.style.display = "none";
  diceDiv.style.display = "block";

  const diceHeader = el("div", { class: "header" }, [
    el("button", {
      onclick: (e) => {
        closeDicePage();
      },
      text: "Close",
    }),
  ]);

  const diceGrid = el("div", { class: "diceGrid" });

  const normalDice = createDiceSet("D6 Dice Roller", normalFaces);
  const skidDice = createDiceSet("Skid Dice Roller", skidFaces);

  diceGrid.appendChild(normalDice);
  diceGrid.appendChild(skidDice);
  diceDiv.replaceChildren(diceHeader, diceGrid);
}

function createDiceSet(title, faces) {
  let diceCount = 1;
  let diceCubes = [];
  const resultsDiv = el("div", { class: "diceResults" });

  function renderDiceStatic() {
    resultsDiv.innerHTML = "";
    diceCubes = [];

    for (let i = 0; i < diceCount; i++) {
      const { wrapper, cube } = createDice(6, false, faces);
      diceCubes.push({ cube, wrapper });
      resultsDiv.appendChild(wrapper);
    }
  }

  function rollDice() {
    diceCubes.forEach(({ cube, wrapper }) => {
      const value = Math.floor(Math.random() * 6) + 1;
      animateDice(cube, value, wrapper);
    });
  }

  renderDiceStatic();

  return el("div", { class: "diceContainer" }, [
    el("h2", { text: title }),
    el("label", { text: "Number of Dice: " }),
    el("input", {
      type: "number",
      min: "1",
      value: "1",
      oninput: (e) => {
        diceCount = Math.max(1, parseInt(e.target.value) || 1);
        renderDiceStatic();
      },
    }),
    el("button", { onclick: rollDice, text: "Roll Dice" }),
    resultsDiv,
  ]);
}

function getRotationAngles(v) {
  switch (v) {
    case 1:
      return { x: 0, y: 0 };
    case 2:
      return { x: -90, y: 0 };
    case 3:
      return { x: 0, y: 90 };
    case 4:
      return { x: 0, y: -90 };
    case 5:
      return { x: 90, y: 0 };
    case 6:
      return { x: 180, y: 0 };
  }
}

function createDice(value, animate = true, faces) {
  const cube = el("div", { class: "cube" });

  faces.forEach((f) => {
    cube.appendChild(
      el("div", { class: `face ${f.cls}` }, [el("img", { src: f.val })]),
    );
  });

  const wrapper = el("div", { class: "dice3d" }, [cube]);

  cube.style.transform = "rotateX(180deg)";

  if (animate) {
    animateDice(cube, value, wrapper);
  }

  return { wrapper, cube };
}

function animateDice(cube, value, wrapper) {
  const extraX = 360 * (2 + Math.floor(Math.random() * 4));
  const extraY = 360 * (1 + Math.floor(Math.random() * 4));
  const extraZ = 360 * Math.floor(Math.random() * 2);

  const duration = 800 + Math.random() * 600;

  const base = getRotationAngles(value);

  const finalX = base.x + extraX;
  const finalY = base.y + extraY;
  const finalZ = extraZ;

  cube.style.transition = `transform ${duration}ms cubic-bezier(0.2, 0.8, 0.3, 1)`;

  cube.style.transform = `rotateX(${finalX}deg) rotateY(${finalY}deg) rotateZ(${finalZ}deg)`;
}
