import {
  allCargos,
  allPerks,
  allSponsors,
  allTrailers,
  allUpgrades,
  allVehicles,
  allWeapons,
  sponsorKeywords,
  vehicleKeywords,
} from "./data";
import { el } from "./render";

function clearHighlights() {
  document.querySelectorAll(".tableHighlight").forEach((el) => {
    el.classList.remove("tableHighlight");
  });
}

function highlightRow(row) {
  row.classList.add("tableHighlight");
}

function getKeywordsFromCell(cell) {
  if (!cell) return [];
  return cell.textContent
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

function highlightInTable(table, columnIndex, keywords) {
  const rows = table.querySelectorAll("tbody tr");

  let currentGroupHeader = null;

  rows.forEach((row) => {
    const isGroup = row.dataset.group === "true";

    if (isGroup) {
      currentGroupHeader = row;

      const headerText = row.textContent.trim();

      const headerMatch = keywords.some((k) => headerText.includes(k));

      if (headerMatch) {
        row.classList.add("tableHighlight");

        let next = row.nextElementSibling;
        while (next && next.dataset.group !== "true") {
          next.classList.add("tableHighlight");
          next = next.nextElementSibling;
        }
      }

      return;
    }

    const cell = row.children[columnIndex];
    if (!cell) return;

    const text = cell.textContent;

    const match = keywords.some((k) => text.includes(k));

    if (match) {
      row.classList.add("tableHighlight");

      // ✅ ALSO highlight its group header
      if (currentGroupHeader) {
        currentGroupHeader.classList.add("tableHighlight");
      }
    }
  });
}

function enableRowLinking(table, keywordColumns, targets) {
  const rows = table.querySelectorAll("tbody tr");

  rows.forEach((row) => {
    if (row.dataset.group === "true") return;

    row.style.cursor = "pointer";

    row.addEventListener("click", () => {
      clearHighlights();

      row.classList.add("tableHighlight");

      const keywords = keywordColumns.flatMap((colIndex) =>
        getKeywordsFromCell(row.children[colIndex]),
      );

      targets.forEach((t) => {
        highlightInTable(t.table, t.column, keywords);
      });
    });
  });
}

function enableTableSorting(table) {
  const tbody = table.tBodies[0];
  table.tHead.style.cursor = "pointer";

  if (!tbody._originalRows) {
    tbody._originalRows = Array.from(tbody.rows);
  }

  table.addEventListener("click", (e) => {
    const th = e.target.closest("th");
    if (!th) return;

    const headers = Array.from(th.parentNode.children);
    const colIndex = headers.indexOf(th);

    const prevState = th._sortState || 0;

    headers.forEach((h) => {
      h._sortState = 0;
      h.dataset.sort = "";
    });

    const state = (prevState + 1) % 3;
    th._sortState = state;

    if (state === 0) {
      tbody.replaceChildren(...tbody._originalRows);
      return;
    }

    th.dataset.sort = state === 1 ? "asc" : "desc";

    const rows = Array.from(tbody.querySelectorAll("tr"));

    const hasGroups = rows.some((r) => r.dataset.group === "true");

    if (!hasGroups) {
      const isNumeric = rows.every((r) => {
        const v = r.children[colIndex]?.textContent.trim();
        return v === "" || !isNaN(v);
      });

      rows.sort((a, b) => {
        let x = a.children[colIndex].textContent.trim();
        let y = b.children[colIndex].textContent.trim();

        if (isNumeric) {
          return state === 1 ? x - y : y - x;
        }

        return state === 1 ? x.localeCompare(y) : y.localeCompare(x);
      });

      tbody.replaceChildren(...rows);
    } else {
      let groups = [];
      let currentGroup = null;

      rows.forEach((r) => {
        if (r.dataset.group === "true") {
          currentGroup = { header: r, rows: [] };
          groups.push(currentGroup);
        } else if (currentGroup) {
          currentGroup.rows.push(r);
        }
      });

      groups.forEach((group) => {
        const isNumeric = group.rows.every((r) => {
          const v = r.children[colIndex]?.textContent.trim();
          return v === "" || !isNaN(v);
        });

        group.rows.sort((a, b) => {
          let x = a.children[colIndex].textContent.trim();
          let y = b.children[colIndex].textContent.trim();

          if (isNumeric) {
            return state === 1 ? x - y : y - x;
          }

          return state === 1 ? x.localeCompare(y) : y.localeCompare(x);
        });
      });

      const newRows = [];
      groups.forEach((g) => newRows.push(g.header, ...g.rows));

      tbody.replaceChildren(...newRows);
    }
  });
}

function referenceVehicles() {
  const referenceTables = document.getElementById("referenceTables");
  const vehiclesTable = el("table", { class: "referenceTable" }, [
    el("thead", {}, [
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
    ]),
    el(
      "tbody",
      {},
      allVehicles.map((v) =>
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
      ),
    ),
  ]);

  enableTableSorting(vehiclesTable);

  const vehiclesKeywordTable = el("table", { class: "referenceTable" }, [
    el("thead", {}, [
      el("tr", {}, [
        el("th", { text: "Vehicle Keyword" }),
        el("th", { text: "Rules" }),
      ]),
    ]),
    el(
      "tbody",
      {},
      vehicleKeywords.map((k) =>
        el("tr", {}, [
          el("td", { text: k.ktype }),
          el("td", { text: k.rules }),
        ]),
      ),
    ),
  ]);

  enableTableSorting(vehiclesKeywordTable);

  const trailersTable = el("table", { class: "referenceTable" }, [
    el("thead", {}, [
      el("tr", {}, [
        el("th", { text: "Trailer" }),
        el("th", { text: "Slots" }),
        el("th", { text: "Cost" }),
      ]),
    ]),
    el(
      "tbody",
      {},

      allTrailers
        .filter((t) => t.ttype !== "None")
        .map((t) =>
          el("tr", {}, [
            el("td", { text: t.ttype }),
            el("td", { text: t.slots }),
            el("td", { text: t.cost }),
          ]),
        ),
    ),
  ]);

  enableRowLinking(
    vehiclesTable,
    [7],
    [{ table: vehiclesKeywordTable, column: 0 }],
  );

  referenceTables.replaceChildren(
    vehiclesTable,
    vehiclesKeywordTable,
    trailersTable,
  );
}

function referenceWeapons() {
  const referenceTables = document.getElementById("referenceTables");
  const weaponsTable = el("table", { class: "referenceTable" }, [
    el("thead", {}, [
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
    ]),
    el(
      "tbody",
      {},
      allWeapons.map((w) =>
        el("tr", {}, [
          el("td", { text: w.wtype }),
          el("td", { text: w.attackType }),
          el("td", { text: w.attack }),
          el("td", { text: w.range }),
          el("td", { text: w.ammo }),
          el("td", { text: w.slots }),
          el("td", { text: w.crewFired ? "Yes" : "No" }),
          el("td", { text: w.specialRules }),
          el("td", { text: w.cost }),
          el("td", { text: w.allowedSponsors }),
        ]),
      ),
    ),
  ]);

  enableTableSorting(weaponsTable);

  referenceTables.replaceChildren(weaponsTable);
}

function referenceUpgrades() {
  const referenceTables = document.getElementById("referenceTables");
  const upgradesTable = el("table", { class: "referenceTable" }, [
    el("thead", {}, [
      el("tr", {}, [
        el("th", { text: "Upgrade" }),
        el("th", { text: "Slots" }),
        el("th", { text: "Ammo" }),
        el("th", { text: "Rules" }),
        el("th", { text: "Cost" }),
        el("th", { text: "Sponsor" }),
      ]),
    ]),
    el(
      "tbody",
      {},

      allUpgrades.map((u) =>
        el("tr", {}, [
          el("td", { text: u.utype }),
          el("td", { text: u.slots }),
          el("td", { text: u.ammo }),
          el("td", { text: u.specialRules }),
          el("td", { text: u.cost }),
          el("td", { text: u.allowedSponsors }),
        ]),
      ),
    ),
  ]);

  enableTableSorting(upgradesTable);

  referenceTables.replaceChildren(upgradesTable);
}

function referenceSponsors() {
  const referenceTables = document.getElementById("referenceTables");
  const sponsorsTable = el("table", { class: "referenceTable" }, [
    el("thead", {}, [
      el("tr", {}, [
        el("th", { text: "Sponsor" }),
        el("th", { text: "Perk Classes" }),
        el("th", { text: "Keywords" }),
      ]),
    ]),
    el(
      "tbody",
      {},
      allSponsors
        .filter((s) => s.name !== "None")
        .map((s) =>
          el("tr", {}, [
            el("td", { text: s.name }),
            el("td", { text: s.perkClasses }),
            el("td", { text: s.keywords }),
          ]),
        ),
    ),
  ]);

  enableTableSorting(sponsorsTable);

  const sponsorsKeywordsTable = el("table", { class: "referenceTable" }, [
    el("thead", {}, [
      el("tr", {}, [
        el("th", { text: "Sponsor Keyword" }),
        el("th", { text: "Rules" }),
      ]),
    ]),
    el(
      "tbody",
      {},
      sponsorKeywords.map((k) =>
        el("tr", {}, [
          el("td", { text: k.ktype }),
          el("td", { text: k.rules }),
        ]),
      ),
    ),
  ]);

  enableTableSorting(sponsorsKeywordsTable);

  const perksTable = el("table", { class: "referenceTable" }, [
    el("thead", {}, [
      el("tr", {}, [
        el("th", { text: "Perk" }),
        el("th", { text: "Rules" }),
        el("th", { text: "Cost" }),
      ]),
    ]),
  ]);

  const perksByClass = {};
  allPerks.forEach((p) => {
    if (!perksByClass[p.class]) {
      perksByClass[p.class] = [];
    }
    perksByClass[p.class].push(p);
  });

  const tbody = el("tbody");
  perksTable.appendChild(tbody);

  Object.keys(perksByClass).forEach((cls) => {
    tbody.appendChild(
      el("tr", { "data-group": "true" }, [
        el("td", {
          text: cls,
          colSpan: 3,
        }),
      ]),
    );

    perksByClass[cls].forEach((p) => {
      tbody.appendChild(
        el("tr", {}, [
          el("td", { text: p.ptype }),
          el("td", { text: p.rules }),
          el("td", { text: p.cost.toString() }),
        ]),
      );
    });
  });

  enableTableSorting(perksTable);

  enableRowLinking(
    sponsorsTable,
    [1, 2],
    [
      { table: sponsorsKeywordsTable, column: 0 },
      { table: perksTable, column: 0 },
    ],
  );

  referenceTables.replaceChildren(
    sponsorsTable,
    sponsorsKeywordsTable,
    perksTable,
  );
}

function referenceCargos() {
  const referenceTables = document.getElementById("referenceTables");
  const cargosTable = el("table", { class: "referenceTable" }, [
    el("thead", {}, [
      el("tr", {}, [el("th", { text: "Cargo" }), el("th", { text: "Rules" })]),
    ]),
    el(
      "tbody",
      {},
      allCargos
        .filter((c) => c.ctype !== "None")
        .map((c) =>
          el("tr", {}, [
            el("td", { text: c.ctype }),
            el("td", { text: c.specialRules }),
          ]),
        ),
    ),
  ]);

  enableTableSorting(cargosTable);

  referenceTables.replaceChildren(cargosTable);
}

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
