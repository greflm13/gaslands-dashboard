import {
  allowedLocations,
  allowedPerks,
  computeStats,
  teamCost,
  totalSlots,
  usedSlots,
  vehicleCost,
  weaponAttack,
  weaponCost,
  weaponRange,
  weaponRules,
  weaponSlots,
} from "./app";
import { el } from "./render";

export function createPrintTeamCard(team, ti) {
  const container = el("div", { class: "teamCard" });

  container.appendChild(
    el("div", { class: "teamHeader" }, [
      el("div", { text: team.teamName, class: "teamName" }),
      el("div", { text: team.sponsor, class: "teamSponsor" }),
      el("div", { text: teamCost(team) + " cans", class: "teamCost" }),
    ]),
  );

  const vehicles = el("div", { class: "teamVehicles" });

  team.vehicles.forEach((v, vi) => {
    vehicles.appendChild(createPrintVehicleCard(team, ti, v, vi));
  });
  container.appendChild(vehicles);

  return container;
}

function createDefaultWeaponRow() {
  return el("div", {
    text: "Handgun - 360 - 1D6 - Medium - Blitz",
  });
}

function createPrintWeaponRow(team, ti, v, vi, w, wi) {
  const locs = allowedLocations(v);

  return el("div", {
    text: `${w.weapon.wtype} - ${w.facing}${locs.length > 1 ? " - " + w.location : ""} - ${weaponAttack(v, w.weapon)} - ${weaponRange(v, w.weapon)}${weaponRules(v, w.weapon) != "" ? " - " + weaponRules(v, w.weapon) : ""}`,
  });
}

function createPrintUpgradesRow(team, ti, v, vi, u, ui) {
  return el("div", { text: `${u.utype} - ${u.specialRules}` });
}

function createPrintPerksRow(team, ti, v, vi, p, pi) {
  return el("div", { text: `${p.ptype} - ${p.rules}` });
}

function createPrintTrailerRow(team, ti, v, vi) {
  if (
    v.trailer?.ttype ||
    "None" == "None" ||
    team.sponsor !== "Rusty's Bootleggers"
  ) {
    return null;
  }

  return el("div", {
    text: `Trailer - ${v.trailer.ttype} - ${v.cargo?.ctype || "None"}`,
  });
}

function createPrintVehicleCard(team, ti, v, vi) {
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
          ...Array.from({ length: stats.hull }, () =>
            el("div", { class: "hullPoint" }),
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

  return container;
}
