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

function createPrintWeaponRow(team, ti, v, vi, w, wi) {
  const locs = allowedLocations(v);

  return el("div", {
    text: `${w.weapon.wtype} - ${w.facing}${locs.length > 1 ? " - " + w.location : ""} - ${weaponAttack(v, w.weapon)} - ${weaponRange(v, w.weapon)} - ${weaponRules(v, w.weapon)}`,
  });
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
  if (v.trailer.ttype == "None" || team.sponsor !== "Rusty's Bootleggers") {
    return null;
  }

  return el("div", {
    text: `Trailer: ${v.trailer.ttype} - Cargo: ${v.cargo?.ctype || "None"}`,
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

  const trailer = createPrintTrailerSection(team, ti, v, vi);
  if (trailer) armory.appendChild(trailer);

  v.weapons.forEach((w, wi) => {
    armory.appendChild(createPrintWeaponRow(team, ti, v, vi, w, wi));
  });

  armory.appendChild(createPrintUpgradesTable(team, ti, v, vi));

  if (allowedPerks(team.sponsor).length) {
    armory.appendChild(createPrintPerksTable(team, ti, v, vi));
  }

  armoryContainer.appendChild(armory);
  container.appendChild(armoryContainer);

  return container;
}
