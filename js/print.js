import {
  allowedLocations,
  allowedPerks,
  computeStats,
  loadImageFromDB,
  teamCost,
  totalSlots,
  usedSlots,
  vehicleCost,
  weaponAmmo,
  weaponAttack,
  weaponCost,
  weaponRange,
  weaponRules,
  weaponSlots,
} from "./app";
import { vehicleKeywords } from "./data";
import { createDiceSet } from "./dice";
import { el } from "./render";
import { state } from "./state";

async function createPrintTeamCard(team, ti) {
  const container = el("div", { class: "teamCard" });

  container.appendChild(
    el("div", { class: "teamHeader" }, [
      el("div", { text: team.teamName, class: "teamName" }),
      ...(team.sponsor != "None"
        ? [el("div", { text: team.sponsor, class: "teamSponsor" })]
        : []),
      el("div", { text: teamCost(team) + " cans", class: "teamCost" }),
    ]),
  );

  const vehicles = el("div", { class: "teamVehicles" });

  const cards = await Promise.all(
    team.vehicles.map((v, vi) => createPrintVehicleCard(team, ti, v, vi)),
  );

  cards.forEach((card) => {
    card.forEach((car) => vehicles.appendChild(car));
  });

  container.appendChild(vehicles);

  return container;
}

function createDefaultWeaponRow() {
  return el("div", {
    text: "Handgun - 360 - 1D6 - Medium - Blitz",
    class: "armoryRow",
  });
}

function createPrintWeaponRow(team, ti, v, vi, w, wi) {
  const locs = allowedLocations(v);
  let text = w.weapon.wtype;
  text += " - " + w.facing;
  if (locs.length > 1) {
    text += " - " + w.location;
  }
  const attack = weaponAttack(v, w.weapon);
  if (attack != "-") {
    text += " - " + attack;
  }
  text += " - " + weaponRange(v, w.weapon);
  const ammo = weaponAmmo(v, w.weapon);
  if (ammo > 0) {
    text += " - " + ammo;
  }
  const rules = weaponRules(v, w.weapon);
  if (rules != "") {
    text += " - " + rules;
  }

  return el("div", {
    text: text,
    class: "armoryRow",
  });
}

function createPrintUpgradesRow(team, ti, v, vi, u, ui) {
  return el("div", {
    text: `${u.utype} - ${u.specialRules}`,
    class: "armoryRow",
  });
}

function createPrintPerksRow(team, ti, v, vi, p, pi) {
  return el("div", { text: `${p.ptype} - ${p.rules}`, class: "armoryRow" });
}

function createPrintTrailerRow(team, ti, v, vi) {
  if (v.trailer?.ttype == "None" || team.sponsor !== "Rusty's Bootleggers") {
    return null;
  }
  let text = `Trailer - ${v.trailer.ttype}`;
  const cargo = v.cargo;
  if (cargo.ctype !== "None") {
    text += " - " + cargo.ctype + " - " + cargo.specialRules;
  }

  return el("div", {
    text: text,
    class: "armoryRow",
  });
}

async function createPrintImage(team, ti, v, vi) {
  if (!v.imageID) return null;

  const base64 = await loadImageFromDB(v.imageID);
  if (!base64) return null;

  return el("div", { class: "vehicleImg" }, [
    el("img", { src: base64, class: "theVehicleImg" }),
    el("img", { src: "/img/vehicle-image-frame.png", class: "theFrame" }),
  ]);
}

function createPrintKeywordRow(k) {
  const keyword = vehicleKeywords.find((vk) => vk.ktype === k);
  return el("div", {
    text: keyword.ktype + " - " + keyword.rules,
    class: "armoryRow",
  });
}

function toogleHullPoint(ti, vi, hi) {
  const id = `hp_${ti}_${vi}_${hi}`;
  const hullPoint = document.getElementById(id);
  if (getHullPoint(ti, vi, hi)) {
    hullPoint.classList = "hullPoint dead";
    state.teams[ti].vehicles[vi].hullpoints[hi] = false;
  } else {
    hullPoint.classList = "hullPoint alive";
    state.teams[ti].vehicles[vi].hullpoints[hi] = true;
  }
}

function getHullPoint(ti, vi, hi) {
  return state.teams[ti].vehicles[vi].hullpoints[hi];
}

function createPlayState(ti, vi, hp) {
  if (state.teams[ti].vehicles[vi].hullpoints === undefined) {
    state.teams[ti].vehicles[vi].hullpoints = [
      ...Array.from({ length: hp }, () => {
        return true;
      }),
    ];
  }
  if (state.teams[ti].vehicles[vi].currGear === undefined) {
    state.teams[ti].vehicles[vi].currGear = 1;
  }
  if (state.teams[ti].vehicles[vi].currHazard === undefined) {
    state.teams[ti].vehicles[vi].currHazard = 0;
  }
  if (state.teams[ti].vehicles[vi].onFire === undefined) {
    state.teams[ti].vehicles[vi].onFire = false;
  }
  state.teams[ti].vehicles[vi].weapons.forEach((w, wi) => {
    if (
      state.teams[ti].vehicles[vi].weapons[wi].weapon.currAmmo === undefined
    ) {
      state.teams[ti].vehicles[vi].weapons[wi].weapon.currAmmo =
        state.teams[ti].vehicles[vi].weapons[wi].weapon.ammo;
    }
  });
}

function getMeasurementRoot() {
  let root = document.getElementById("measure-root");

  if (!root) {
    const printDiv = document.getElementById("printDiv");
    root = document.createElement("div");
    root.id = "measure-root";

    root.style.position = "absolute";
    root.style.left = "-99999px";
    root.style.top = "0";
    root.style.visibility = "hidden";
    root.style.pointerEvents = "none";

    printDiv.appendChild(root);
  }

  return root;
}

function createTempArmory(img) {
  const armoryContainer = el(
    "div",
    { class: img ? "armoryContainer smallerArmory" : "armoryContainer" },
    [el("div", { class: "armoryLabel", text: "Armory/Perks" })],
  );

  const armory = el("div", { class: "vehicleArmory" });

  armoryContainer.appendChild(armory);

  return { armoryContainer, armory };
}

function createPrintVehicleCardContinued(chunk) {
  const container = el("div", { class: "vehicleCardContinued" });
  const armoryContainer2 = el("div", { class: "armoryContainerContinued" }, [
    el("div", {
      class: "armoryLabelContinued",
      text: "Armory/Perks (cont.)",
    }),
  ]);

  const armory2 = el("div", { class: "vehicleArmoryContinued" });
  chunk.forEach((row) => armory2.appendChild(row));

  armoryContainer2.appendChild(armory2);
  container.appendChild(armoryContainer2);
  return container;
}

function addGear(ti, vi) {
  const display = document.getElementById(`gear_${ti}_${vi}`);
  const vehicle = state.teams[ti].vehicles[vi];
  if (vehicle.currGear < vehicle.maxGear) {
    vehicle.currGear++;
    display.innerHTML = vehicle.currGear;
  }
}

function remGear(ti, vi) {
  const display = document.getElementById(`gear_${ti}_${vi}`);
  const vehicle = state.teams[ti].vehicles[vi];
  if (vehicle.currGear > 1) {
    vehicle.currGear--;
    display.innerHTML = vehicle.currGear;
  }
}

function addHazard(ti, vi) {
  const display = document.getElementById(`haz_${ti}_${vi}`);
  const vehicle = state.teams[ti].vehicles[vi];
  vehicle.currHazard++;
  display.innerHTML = vehicle.currHazard;
  if (vehicle.currHazard >= 6) {
    display.classList = "vehicleGear expensive";
  }
}

function remHazard(ti, vi) {
  const display = document.getElementById(`haz_${ti}_${vi}`);
  const vehicle = state.teams[ti].vehicles[vi];
  if (vehicle.currHazard > 0) {
    vehicle.currHazard--;
    display.innerHTML = vehicle.currHazard;
  }

  if (vehicle.currHazard < 6) {
    display.classList = "vehicleGear";
  }

  if (vehicle.onFire && vehicle.currHazard == 0) {
    toggleOnFire(ti, vi);
  }
}

function toggleOnFire(ti, vi) {
  const checkBox = document.getElementById(`${ti}-${vi}-onfire`);
  state.teams[ti].vehicles[vi].onFire = !state.teams[ti].vehicles[vi].onFire;
  checkBox.checked = state.teams[ti].vehicles[vi].onFire;
}

function reduceAmmo(ti, vi, wi) {
  if (state.teams[ti].vehicles[vi].weapons[wi].weapon.currAmmo > 0) {
    state.teams[ti].vehicles[vi].weapons[wi].weapon.currAmmo--;
  }
  document.getElementById(`ammo_${ti}_${vi}_${wi}`).innerHTML =
    state.teams[ti].vehicles[vi].weapons[wi].weapon.currAmmo;
}

function addAmmo(ti, vi, wi) {
  if (
    state.teams[ti].vehicles[vi].weapons[wi].weapon.currAmmo <
    state.teams[ti].vehicles[vi].weapons[wi].weapon.ammo
  ) {
    state.teams[ti].vehicles[vi].weapons[wi].weapon.currAmmo++;
  }
  document.getElementById(`ammo_${ti}_${vi}_${wi}`).innerHTML =
    state.teams[ti].vehicles[vi].weapons[wi].weapon.currAmmo;
}

function createPrintPlayState(ti, vi) {
  let weaponsWithAmmo = [];
  state.teams[ti].vehicles[vi].weapons.forEach((w, wi) => {
    if (w.weapon.ammo > 0) {
      weaponsWithAmmo.push(wi);
    }
  });
  return el("div", { class: "playState" }, [
    el("div", { class: "currentGear noprint" }, [
      el("div", { class: "vehicleMaxGear" }, ["Gear"]),
      el("button", {
        class: "addRemBut",
        text: "+",
        onclick: () => addGear(ti, vi),
      }),
      el("div", {
        id: `gear_${ti}_${vi}`,
        class: "vehicleGear",
        text: state.teams[ti].vehicles[vi].currGear,
      }),
      el("button", {
        class: "addRemBut",
        text: "-",
        onclick: () => remGear(ti, vi),
      }),
    ]),
    el("div", { class: "currentHazard noprint" }, [
      el("div", { class: "vehicleMaxGear" }, ["Hazard"]),
      el("button", {
        class: "addRemBut",
        text: "+",
        onclick: () => addHazard(ti, vi),
      }),
      el("div", {
        id: `haz_${ti}_${vi}`,
        class: `vehicleGear ${state.teams[ti].vehicles[vi].currHazard >= 6 ? "expensive" : ""}`,
        text: state.teams[ti].vehicles[vi].currHazard,
      }),
      el("button", {
        class: "addRemBut",
        text: "-",
        onclick: () => remHazard(ti, vi),
      }),
    ]),
    el("div", { class: "ammoState noprint" }, [
      ...weaponsWithAmmo.map((wi) =>
        el("div", { class: "weaponAmmoState" }, [
          el("div", {
            class: "weaponAmmoName",
            text: state.teams[ti].vehicles[vi].weapons[wi].weapon.wtype,
          }),
          el("button", {
            class: "ammoAddRemBut",
            text: "-",
            onclick: () => {
              reduceAmmo(ti, vi, wi);
            },
          }),
          el("div", {
            class: "ammoLeft",
            id: `ammo_${ti}_${vi}_${wi}`,
            text: state.teams[ti].vehicles[vi].weapons[wi].weapon.currAmmo,
          }),
          el("button", {
            class: "ammoAddRemBut",
            text: "+",
            onclick: () => {
              addAmmo(ti, vi, wi);
            },
          }),
        ]),
      ),
    ]),
    el("div", { class: "vehicleEffects noprint" }, [
      el("input", {
        type: "checkbox",
        id: `${ti}-${vi}-onfire`,
        checked: state.teams[ti].vehicles[vi].onFire,
        onchange: () => toggleOnFire(ti, vi),
      }),
      el("label", { for: `${ti}-${vi}-onfire`, text: "On Fire" }),
    ]),
  ]);
}

async function createPrintVehicleCard(team, ti, v, vi) {
  const container = el("div", { class: "vehicleCard" });

  const stats = computeStats(v);
  const free = totalSlots(v) - usedSlots(v);

  state.teams[ti].vehicles[vi].maxGear = stats.maxGear;

  createPlayState(ti, vi, stats.hull);

  container.appendChild(
    el("div", { class: "vehicleHeader" }, [
      el("div", {
        text: v.vehicleName,
        class: "vehicleName",
      }),
      el("div", { text: v.vtype, class: "vehicleType" }),
      el("div", {
        text: `${v.weight}wheight`,
        class: "vehicleWeight",
      }),
      el("div", { text: "Max gear", class: "vehicleMaxGear" }),
      el("div", { text: `${stats.maxGear}`, class: "vehicleGear" }),
    ]),
  );

  container.appendChild(
    el("div", { class: "vehicleStats" }, [
      el("div", {
        text: `Handling: ${stats.handling}`,
        class: "vehicleHandling",
      }),
      el("div", { text: `Crew: ${stats.crew}`, class: "vehicleCrew" }),
      el("div", {
        text: `Cans: ${vehicleCost(v, team.sponsor)}`,
        class: "vehicleCost",
      }),
      el("div", { class: "hullContainer" }, [
        el("div", { text: "Hull", class: "hullLabel" }),
        el("div", { class: "visually-hidden", text: stats.hull }),
        el("div", { class: "hullPoints" }, [
          ...Array.from({ length: stats.hull }, (h, hi) =>
            el("div", {
              class: `hullPoint ${getHullPoint(ti, vi, hi) ? "alive" : "dead"}`,
              id: `hp_${ti}_${vi}_${hi}`,
              onclick: (e) => {
                toogleHullPoint(ti, vi, hi);
              },
            }),
          ),
        ]),
      ]),
    ]),
  );

  const armoryRows = [];
  const img = await createPrintImage(team, ti, v, vi);

  const trailer = createPrintTrailerRow(team, ti, v, vi);
  if (trailer) armoryRows.push(trailer);

  armoryRows.push(createDefaultWeaponRow());

  v.weapons.forEach((w, wi) => {
    armoryRows.push(createPrintWeaponRow(team, ti, v, vi, w, wi));
  });

  v.upgrades.forEach((u, ui) => {
    armoryRows.push(createPrintUpgradesRow(team, ti, v, vi, u, ui));
  });

  v.keywords.forEach((k) => {
    armoryRows.push(createPrintKeywordRow(k));
  });

  v.perks.forEach((p, pi) => {
    armoryRows.push(createPrintPerksRow(team, ti, v, vi, p, pi));
  });

  const measureRoot = getMeasurementRoot();
  const { armoryContainer, armory } = createTempArmory(img);

  measureRoot.appendChild(armoryContainer);

  const MAX_HEIGHT = armory.clientHeight;

  const firstChunk = [];
  let splitIndex = armoryRows.length;

  for (let i = 0; i < armoryRows.length; i++) {
    const row = armoryRows[i];

    armory.appendChild(row);

    if (armory.scrollHeight > MAX_HEIGHT) {
      armory.removeChild(row);

      splitIndex = i;
      break;
    }

    firstChunk.push(row);
  }

  const secondChunk = armoryRows.slice(splitIndex);
  measureRoot.removeChild(armoryContainer);

  const armoryContainer1 = el("div", { class: "armoryContainer" }, [
    el("div", { class: "armoryLabel", text: "Armory/Perks" }),
  ]);

  const armory1 = el("div", { class: "vehicleArmory" });
  firstChunk.forEach((row) => armory1.appendChild(row));

  armoryContainer1.appendChild(armory1);
  container.appendChild(armoryContainer1);

  if (img) {
    container.appendChild(img);
    armoryContainer1.className = "armoryContainer smallerArmory";
  }

  let container2;

  if (secondChunk.length > 0) {
    container2 = createPrintVehicleCardContinued(secondChunk);
  }

  const playState = createPrintPlayState(ti, vi);
  container.appendChild(playState);

  if (container2) {
    return [container, container2];
  }
  return [container];
}

function renderDice() {
  const diceGrid = el("div", { class: "diceGrid noprint" });

  const normalDice = createDiceSet("D6 Dice Roller", "normal");
  const skidDice = createDiceSet("Skid Dice Roller", "skid");

  diceGrid.appendChild(normalDice);
  diceGrid.appendChild(skidDice);
  return diceGrid;
}

export async function renderPrint() {
  const printContent = document.getElementById("printContent");

  printContent.innerHTML = "";
  let team = state.teams[state.currentTeamIndex];
  printContent.appendChild(
    await createPrintTeamCard(team, state.currentTeamIndex),
  );
  printContent.appendChild(renderDice());
}
