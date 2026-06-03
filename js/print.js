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

  cards.forEach((card) => vehicles.appendChild(card));

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

  return el("div", {
    text: `Trailer - ${v.trailer.ttype} - ${v.cargo?.ctype || "None"}`,
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

function toogleHullPoint(id) {
  const hullPoint = document.getElementById(id);
  if (hullPoint.style.backgroundColor == "rgb(17, 17, 17)") {
    hullPoint.style.backgroundColor = "#fff";
  } else {
    hullPoint.style.backgroundColor = "#111";
  }
}

async function createPrintVehicleCard(team, ti, v, vi) {
  const container = el("div", { class: "vehicleCard" });

  const stats = computeStats(v);
  const free = totalSlots(v) - usedSlots(v);

  container.appendChild(
    el("div", { class: "vehicleHeader" }, [
      el("div", {
        text: v.vehicleName,
        class: "vehicleName",
      }),
      el("div", { text: "Max gear", class: "vehicleMaxGear" }),
      el("div", { text: v.vtype, class: "vehicleType" }),
      el("div", {
        text: `${v.weight}wheight`,
        class: "vehicleWeight",
      }),
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
        el("div", { class: "hullPoints" }, [
          ...Array.from({ length: stats.hull }, (h, hi) =>
            el("div", {
              class: "hullPoint",
              id: `hp_${vi}_${hi}`,
              onclick: (e) => {
                toogleHullPoint(`hp_${vi}_${hi}`);
              },
            }),
          ),
        ]),
      ]),
    ]),
  );

  const armoryContainer = el("div", { class: "armoryContainer" }, [
    el("div", { class: "armoryLabel", text: "Armory/Perks" }),
  ]);

  const armory = el("div", { class: "vehicleArmory" });

  const trailer = createPrintTrailerRow(team, ti, v, vi);
  if (trailer) armory.appendChild(trailer);

  armory.appendChild(createDefaultWeaponRow());

  v.weapons.forEach((w, wi) => {
    armory.appendChild(createPrintWeaponRow(team, ti, v, vi, w, wi));
  });

  v.upgrades.forEach((u, ui) => {
    armory.appendChild(createPrintUpgradesRow(team, ti, v, vi, u, ui));
  });

  v.perks.forEach((p, pi) => {
    armory.appendChild(createPrintPerksRow(team, ti, v, vi, p, pi));
  });

  armoryContainer.appendChild(armory);
  container.appendChild(armoryContainer);

  const img = await createPrintImage(team, ti, v, vi);
  if (img) {
    container.appendChild(img);
    armoryContainer.className = "armoryContainer smallerArmory";
  }

  return container;
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
  printContent.appendChild(await createPrintTeamCard(team));
  printContent.appendChild(renderDice());
}
