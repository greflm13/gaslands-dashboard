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
    el("div", { class: "vehicleHeader" }, [
      el("div", { text: v.vehicleName, class: "vehicleName" }),
      el("div", { text: v.vtype, class: "vehicleType" }),
      el("div", { text: `${v.weight}wheight`, class: "vehicleWeight" }),
    ]),
  );

  container.appendChild(
    el("div", { class: "vehicleStats" }, [
      el("div", { class: "hullPoints" }, [
        ...Array.from({ length: stats.hull }, () =>
          el("div", { class: "hullPoint" }),
        ),
      ]),
      el("div", { text: `Handling: ${stats.handling}` }),
      el("div", { text: `Max gear: ${stats.maxGear}` }),
      el("div", { text: `Crew: ${stats.crew}` }),
      el("div", { text: `Free slots: ${free}` }),
      el("div", {
        text: `${vehicleCost(v, team.sponsor)} cans`,
        class: "vehicleCost",
      }),
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
