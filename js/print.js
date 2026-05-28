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

  const headerRow = el("tr", {}, [
    el("td", { text: team.teamName }),

    el("td", { text: team.sponsor }),

    el("td", { text: teamCost(team) + " cans" }),
  ]);

  container.appendChild(el("table", { class: "teamHeader" }, [headerRow]));

  team.vehicles.forEach((v, vi) => {
    container.appendChild(createPrintVehicleCard(team, ti, v, vi));
  });

  return container;
}

function createDefaultWeaponRow(v) {
  return el("tr", {}, [
    el("td", { text: "Handgun" }),
    el("td", { text: "360" }),
    ...(allowedLocations(v).length > 1 ? [el("td")] : []),
    el("td", { text: "Shooting" }),
    el("td", { text: "1D6" }),
    el("td", { text: "Medium" }),
    el("td", { text: "Blitz" }),
    el("td", { text: "-" }),
    el("td", { text: "-" }),
    el("td"),
  ]);
}

function createPrintWeaponsTable(team, ti, v, vi) {
  const table = el("table", { class: "weaponsTable" });

  table.appendChild(
    el("tr", {}, [
      el("th", { text: "Weapon" }),
      el("th", { text: "Facing" }),
      ...(allowedLocations(v).length > 1
        ? [el("th", { text: "Location" })]
        : []),
      el("th", { text: "Type" }),
      el("th", { text: "Attack" }),
      el("th", { text: "Range" }),
      el("th", { text: "Special Rules" }),
      el("th", { text: "Slots" }),
      el("th", { text: "Cost" }),
    ]),
  );

  table.appendChild(createDefaultWeaponRow(v));

  v.weapons.forEach((w, wi) => {
    table.appendChild(createPrintWeaponRow(team, ti, v, vi, w, wi));
  });

  return table;
}

function createPrintWeaponRow(team, ti, v, vi, w, wi) {
  const locs = allowedLocations(v);

  return el("tr", {}, [
    el("td", { text: w.weapon.wtype }),
    el("td", { text: w.facing }),
    ...(locs.length > 1 ? [el("td", { text: w.location })] : []),
    el("td", { text: w.weapon.attackType }),
    el("td", { text: weaponAttack(v, w.weapon) }),
    el("td", { text: weaponRange(v, w.weapon) }),
    el("td", { text: weaponRules(v, w.weapon) }),
    el("td", { text: weaponSlots(v, w.weapon) }),
    el("td", { text: weaponCost(v, w) }),
  ]);
}

function createPrintUpgradesTable(team, ti, v, vi) {
  const table = el("table", { class: "upgradesTable" });

  table.appendChild(
    el("tr", {}, [
      el("th", { text: "Upgrade" }),
      el("th", { text: "Ammo" }),
      el("th", { text: "Slots" }),
      el("th", { text: "Special Rules" }),
      el("th", { text: "Cost" }),
    ]),
  );

  v.upgrades.forEach((u, ui) => {
    table.appendChild(
      el("tr", {}, [
        el("td", { text: u.utype }),
        el("td", { text: u.ammo || "-" }),
        el("td", { text: u.slots || "-" }),
        el("td", { text: u.specialRules || "" }),
        el("td", { text: u.cost || 0 }),
      ]),
    );
  });

  return table;
}

function createPrintPerksTable(team, ti, v, vi) {
  const table = el("table", { class: "perksTable" });

  table.appendChild(
    el("tr", {}, [
      el("th", { text: "Perk" }),
      el("th", { text: "Special Rules" }),
      el("th", { text: "Cost" }),
    ]),
  );

  v.perks.forEach((p, pi) => {
    table.appendChild(
      el("tr", {}, [
        el("td", { text: p.ptype }),
        el("td", { text: p.rules || "" }),
        el("td", { text: p.cost || 0 }),
      ]),
    );
  });

  return table;
}

function createPrintTrailerSection(team, ti, v, vi) {
  if (team.sponsor !== "Rusty's Bootleggers") return null;

  return el("table", { class: "trailerTable" }, [
    el("tr", {}, [
      el("td", { text: "Trailer:" }),
      el("td", { text: v.trailer?.ttype || "None" }),
      el("td", { text: "Cargo:" }),
      el("td", { text: v.cargo?.ctype || "None" }),
    ]),
  ]);
}

function createPrintVehicleCard(team, ti, v, vi) {
  const container = el("div", { class: "vehicleCard" });

  const stats = computeStats(v);
  const free = totalSlots(v) - usedSlots(v);

  container.appendChild(
    el("table", { class: "vehicleHeader" }, [
      el("tr", {}, [
        el("td", { text: v.vehicleName }),
        el("td", { text: v.vtype }),
        el("td", { text: `${vehicleCost(v, team.sponsor)} cans` }),
      ]),
    ]),
  );

  container.appendChild(
    el("table", { class: "vehicleStats" }, [
      el("tr", {}, [
        el("td", { text: `Weight: ${v.weight}` }),
        el("td", { text: `Hull: ${stats.hull}` }),
        el("td", { text: `Handling: ${stats.handling}` }),
        el("td", { text: `Max gear: ${stats.maxGear}` }),
        el("td", { text: `Crew: ${stats.crew}` }),
        el("td", { text: `Free slots: ${free}` }),
      ]),
    ]),
  );

  const trailer = createPrintTrailerSection(team, ti, v, vi);
  if (trailer) container.appendChild(trailer);

  container.appendChild(createPrintWeaponsTable(team, ti, v, vi));

  container.appendChild(createPrintUpgradesTable(team, ti, v, vi));

  if (allowedPerks(team.sponsor).length) {
    container.appendChild(createPrintPerksTable(team, ti, v, vi));
  }

  return container;
}
