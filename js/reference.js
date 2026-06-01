import { allTrailers, allVehicles, vehicleKeywords } from "./data";
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

  allTrailers.forEach((k) => {
    trailersTable.appendChild(
      el("tr", {}, [
        el("td", { text: k.ttype }),
        el("td", { text: k.slots }),
        el("td", { text: k.cost }),
      ]),
    );
  });

  referenceTables.replaceChildren(
    vehiclesTable,
    vehiclesKeywordTable,
    trailersTable,
  );
}

function referenceWeapons() {}

function referenceUpgrades() {}

function referenceSponsors() {}

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
