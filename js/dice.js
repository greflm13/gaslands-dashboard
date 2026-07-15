import { el } from "./render";

let diceCount = 1;
let diceCubes = [];
let selectedDice = [];

const normalFaces = [
  { cls: "back", val: "/img/1.svg" },
  { cls: "front", val: "/img/6.svg" },
  { cls: "left", val: "/img/3.svg" },
  { cls: "right", val: "/img/4.svg" },
  { cls: "bottom", val: "/img/5.svg" },
  { cls: "top", val: "/img/2.svg" },
];

const skidFaces = [
  { cls: "back", val: "/img/hazard.svg" },
  { cls: "front", val: "/img/shift.svg" },
  { cls: "left", val: "/img/spin.svg" },
  { cls: "right", val: "/img/shift.svg" },
  { cls: "bottom", val: "/img/shift.svg" },
  { cls: "top", val: "/img/slide.svg" },
];

const diceTypes = {
  normal: normalFaces,
  skid: skidFaces,
};

function getFaceMap(type) {
  const faces = diceTypes[type];

  return {
    1: faces.find((f) => f.cls === "front"),
    2: faces.find((f) => f.cls === "bottom"),
    3: faces.find((f) => f.cls === "right"),
    4: faces.find((f) => f.cls === "left"),
    5: faces.find((f) => f.cls === "top"),
    6: faces.find((f) => f.cls === "back"),
  };
}

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

  const normalDice = createDiceSet("D6 Dice Roller", "normal");
  const skidDice = createDiceSet("Skid Dice Roller", "skid");

  diceGrid.appendChild(normalDice);
  diceGrid.appendChild(skidDice);
  diceDiv.replaceChildren(diceHeader, diceGrid);
}

export function createDiceSet(title, type) {
  let diceCount = 1;
  let diceCubes = [];
  const resultsDiv = el("div", { class: "diceResults" });

  function renderDiceStatic() {
    resultsDiv.innerHTML = "";
    diceCubes = [];

    for (let i = 0; i < diceCount; i++) {
      const id = `dice_${type}_${i}`;
      const { wrapper, cube } = createDice(type, id);
      diceCubes.push({ cube, wrapper });
      resultsDiv.appendChild(wrapper);
    }
    resultsDiv.appendChild(
      el("div", { class: "resultNumbers", id: `dice_results_${type}` }),
    );
  }

  function rollDice() {
    let counts;

    if (type === "skid") {
      counts = { hazard: 0, slide: 0, spin: 0, shift: 0 };
    } else {
      counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    }

    let finished = 0;
    const total = diceCubes.length;

    const handleDone = () => {
      finished++;
      if (finished === total) {
        renderResults(counts);
      }
    };

    diceCubes.forEach(({ cube, wrapper }) => {
      const value = Math.floor(Math.random() * 6) + 1;

      if (type === "skid") {
        const result = getSkidResult(value);
        counts[result]++;
      } else {
        counts[value]++;
      }

      const onEnd = () => {
        cube.removeEventListener("transitionend", onEnd);
        handleDone();
      };

      cube.addEventListener("transitionend", onEnd);

      animateDice(cube, value, wrapper, type);
    });

    document.getElementById(`dice_results_${type}`).textContent = "";
  }

  function renderResults(counts) {
    const resultDiv = document.getElementById(`dice_results_${type}`);

    resultDiv.innerHTML = "";

    if (type === "skid") {
      const order = ["shift", "spin", "slide", "hazard"];

      order.forEach((key) => {
        resultDiv.appendChild(
          el("div", { class: "resultItem" }, [
            el("img", { src: `/img/${key}.svg` }),
            `${counts[key]}`,
          ]),
        );
      });
    } else {
      for (let i = 6; i >= 1; i--) {
        resultDiv.appendChild(
          el("div", { class: "resultItem" }, [
            el("img", { src: `/img/${i}.svg` }),
            `${counts[i]}`,
          ]),
        );
      }
    }
  }

  renderDiceStatic();

  return el("div", { class: "diceContainer" }, [
    el("h2", { text: title }),
    el("label", { text: "Number of Dice: " }),
    el(
      "button",
      {
        onclick: () => {
          if (diceCount > 1) {
            diceCount--;
            document.getElementById(`ds_${type}`).value = diceCount;
            renderDiceStatic();
          }
        },
      },
      ["-"],
    ),
    el("input", {
      type: "number",
      min: "1",
      value: "1",
      class: "diceSelect",
      id: `ds_${type}`,
      oninput: (e) => {
        diceCount = Math.max(1, parseInt(e.target.value) || 1);
        renderDiceStatic();
      },
    }),
    el(
      "button",
      {
        onclick: () => {
          diceCount++;
          document.getElementById(`ds_${type}`).value = diceCount;
          renderDiceStatic();
        },
      },
      ["+"],
    ),
    el("button", { onclick: rollDice, text: "Roll Dice" }),
    resultsDiv,
  ]);
}

function getRotationAngles(v) {
  switch (v) {
    case 6:
      return { x: 0, y: 0 }; // front
    case 1:
      return { x: 0, y: 180 }; // back

    case 4:
      return { x: 0, y: -90 }; // right
    case 3:
      return { x: 0, y: 90 }; // left

    case 2:
      return { x: -90, y: 0 }; // top
    case 5:
      return { x: 90, y: 0 }; // bottom
  }
}

function getSkidResult(value) {
  switch (value) {
    case 1:
      return "hazard";
    case 2:
      return "slide";
    case 3:
      return "spin";
    case 4:
      return "shift";
    case 5:
      return "shift";
    case 6:
      return "shift";
  }
}

function clickDice(wrapper) {
  const type = wrapper.dataset.type;
  const value = parseInt(wrapper.dataset.value);

  if (!value) return;

  if (type !== "skid") return;

  const result = getSkidResult(value);

  wrapper.classList.toggle("selected");

  if (wrapper.classList.contains("selected")) {
    selectedDice.push({ wrapper, result });
  } else {
    selectedDice = selectedDice.filter((d) => d.wrapper !== wrapper);
    wrapper.classList.remove("cancelled");
  }

  handleCancellation();
}

function handleCancellation() {
  const shifts = selectedDice.filter((d) => d.result === "shift");
  const cancelables = selectedDice.filter(
    (d) => d.result === "hazard" || d.result === "spin" || d.result === "slide",
  );

  const pairs = Math.min(shifts.length, cancelables.length);

  selectedDice.forEach((d) => d.wrapper.classList.remove("cancelled"));

  for (let i = 0; i < pairs; i++) {
    shifts[i].wrapper.classList.add("cancelled");
    cancelables[i].wrapper.classList.add("cancelled");
  }
}

function createDice(type, id) {
  const cube = el("div", { class: "cube" });

  const faces = diceTypes[type];

  faces.forEach((f) => {
    cube.appendChild(
      el("div", { class: `face ${f.cls}` }, [el("img", { src: f.val })]),
    );
  });

  const wrapper = el(
    "div",
    {
      class: "dice3d",
      id: id,
      onclick: () => clickDice(wrapper),
    },
    [cube],
  );

  return { wrapper, cube };
}

function animateDice(cube, value, wrapper, type) {
  wrapper.classList.remove("highlight");
  wrapper.classList.remove("cancelled");
  wrapper.classList.remove("selected");

  wrapper.dataset.value = value;
  wrapper.dataset.type = type;

  selectedDice = [];

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

  if (type === "normal" && value === 6) {
    const handler = () => {
      wrapper.classList.add("highlight");
      cube.removeEventListener("transitionend", handler);
    };
    cube.addEventListener("transitionend", handler);
  }
}
