import {
  allTrailers,
  allUpgrades,
  allVehicles,
  allWeapons,
  vehicleKeywords,
} from "./data";
import { el } from "./render";

function referenceVehicles() {
  const referenceTables = document.getElementById("referenceTables");
  const vehiclesTable = el("table", { class: "referenceTable" });

  vehiclesTable.appendChild(
    el("tr", {}, [
      el("th", { text: "Vehicle" }),
      el("th", { text: "Weight" }),
      el("th", { text: "Hull" }),
      el("th", { text: "Handling" }),
      el("th", { text: "Max Gear" }),
      el("th", { text: "Crew" }),
      el("th", { text: "Slots" }),
      el("th", { text: "Keywords" }),
      el("th", { text: "Cost" }),
    ]),
  );

  allVehicles.forEach((v) => {
    vehiclesTable.appendChild(
      el("tr", {}, [
        el("td", { text: v.vtype }),
        el("td", { text: v.weight }),
        el("td", { text: v.hull }),
        el("td", { text: v.handling }),
        el("td", { text: v.maxGear }),
        el("td", { text: v.crew }),
        el("td", { text: v.slots }),
        el("td", { text: v.keywords }),
        el("td", { text: v.cost }),
      ]),
    );
  });

  const vehiclesKeywordTable = el("table", { class: "referenceTable" });

  vehiclesKeywordTable.appendChild(
    el("tr", {}, [
      el("th", { text: "Vehicle Keyword" }),
      el("th", { text: "Rules" }),
    ]),
  );

  vehicleKeywords.forEach((k) => {
    vehiclesKeywordTable.appendChild(
      el("tr", {}, [el("td", { text: k.ktype }), el("td", { text: k.rules })]),
    );
  });

  const trailersTable = el("table", { class: "referenceTable" });

  trailersTable.appendChild(
    el("tr", {}, [
      el("th", { text: "Trailer" }),
      el("th", { text: "Slots" }),
      el("th", { text: "Cost" }),
    ]),
  );

  allTrailers.forEach((t) => {
    trailersTable.appendChild(
      el("tr", {}, [
        el("td", { text: t.ttype }),
        el("td", { text: t.slots }),
        el("td", { text: t.cost }),
      ]),
    );
  });

  referenceTables.replaceChildren(
    vehiclesTable,
    vehiclesKeywordTable,
    trailersTable,
  );
}

function referenceWeapons() {
  const referenceTables = document.getElementById("referenceTables");
  const weaponsTable = el("table", { class: "referenceTable" });

  weaponsTable.appendChild(
    el("tr", {}, [
      el("th", { text: "Weapon" }),
      el("th", { text: "Type" }),
      el("th", { text: "Attack" }),
      el("th", { text: "Range" }),
      el("th", { text: "Ammo" }),
      el("th", { text: "Slots" }),
      el("th", { text: "Crew fired" }),
      el("th", { text: "Special Rules" }),
      el("th", { text: "Cost" }),
      el("th", { text: "Sponsor" }),
    ]),
  );

  allWeapons.forEach((w) => {
    weaponsTable.appendChild(
      el("tr", {}, [
        el("td", { text: w.wtype }),
        el("td", { text: w.attackType }),
        el("td", { text: w.attack }),
        el("td", { text: w.range }),
        el("td", { text: w.ammo }),
        el("td", { text: w.slots }),
        el("td", { text: w.crewFired }),
        el("td", { text: w.specialRules }),
        el("td", { text: w.cost }),
        el("td", { text: w.allowedSponsors }),
      ]),
    );
  });

  referenceTables.replaceChildren(weaponsTable);
}

function referenceUpgrades() {
  const referenceTables = document.getElementById("referenceTables");
  const upgradesTable = el("table", { class: "referenceTable" });

  upgradesTable.appendChild(
    el("tr", {}, [
      el("th", { text: "Upgrade" }),
      el("th", { text: "Slots" }),
      el("th", { text: "Ammo" }),
      el("th", { text: "Rules" }),
      el("th", { text: "Cost" }),
      el("th", { text: "Sponsor" }),
    ]),
  );

  allUpgrades.forEach((u) => {
    upgradesTable.appendChild(
      el("tr", {}, [
        el("td", { text: u.utype }),
        el("td", { text: u.slots }),
        el("td", { text: u.ammo }),
        el("td", { text: u.specialRules }),
        el("td", { text: u.cost }),
        el("td", { text: u.allowedSponsors }),
      ]),
    );
  });

  referenceTables.replaceChildren(upgradesTable);
}

function referenceSponsors() {
  const referenceTables = document.getElementById("referenceTables");
  const sponsorsTable = el("table", { class: "referenceTable" });

  sponsorsTable.appendChild(
    el("tr", {}, [
      el("th", { text: "Upgrade" }),
      el("th", { text: "Slots" }),
      el("th", { text: "Ammo" }),
      el("th", { text: "Rules" }),
      el("th", { text: "Cost" }),
      el("th", { text: "Sponsor" }),
    ]),
  );

  allUpgrades.forEach((u) => {
    sponsorsTable.appendChild(
      el("tr", {}, [
        el("td", { text: u.utype }),
        el("td", { text: u.slots }),
        el("td", { text: u.ammo }),
        el("td", { text: u.specialRules }),
        el("td", { text: u.cost }),
        el("td", { text: u.allowedSponsors }),
      ]),
    );
  });

  referenceTables.replaceChildren(sponsorsTable);
}

function referenceCargos() {}

export function createReference() {
  return el("div", { class: "reference" }, [
    el("h3", {}, ["Reference Tables"]),
    el("div", { class: "referenceButtons" }, [
      el("button", { onclick: () => referenceVehicles() }, ["Vehicles"]),
      el("button", { onclick: () => referenceWeapons() }, ["Weapons"]),
      el("button", { onclick: () => referenceUpgrades() }, ["Upgrades"]),
      el("button", { onclick: () => referenceSponsors() }, ["Sponsors"]),
      el("button", { onclick: () => referenceCargos() }, ["Cargos"]),
    ]),
    el("div", { class: "referenceTables", id: "referenceTables" }),
  ]);
}
