import { state } from "./state.js";
import { allSponsors, allVehicles, allTrailers, allCargos } from "./data.js";
import {
  teamCost,
  removeTeam,
  addVehicle,
  vehicleCost,
  computeStats,
  totalSlots,
  usedSlots,
  allowedLocations,
  allowedPerks,
  addWeapon,
  allowedFacings,
  allowedWeaponsFull,
  weaponAttack,
  weaponRange,
  weaponRules,
  weaponSlots,
  weaponCost,
  changeWeapon,
  changeVehicle,
  setSponsor,
  removeWeapon,
  addUpgrade,
  allowedUpgradesFull,
  changeUpgrade,
  removeUpgrade,
  removeVehicle,
  setTrailer,
  setCargo,
  addPerk,changePerk,removePerk,setWeaponFacing,openPrintPreview
} from "./app.js";

function el(tag, props = {}, children = []) {
  const e = document.createElement(tag);

  Object.entries(props).forEach(([k, v]) => {
    if (k === "class") e.className = v;
    else if (k.startsWith("on")) e.addEventListener(k.substring(2), v);
    else if (k === "text") e.textContent = v;
    else e.setAttribute(k, v);
  });

  children.forEach((c) => {
    if (typeof c === "string") e.appendChild(document.createTextNode(c));
    else if (c) e.appendChild(c);
  });

  return e;
}
function select(options, value, onChange) {
  return el(
    "select",
    { onchange: onChange },
    options.map((opt) => {
      const option = el("option", { value: opt }, [opt]);
      if (opt === value) option.selected = true;
      return option;
    }),
  );
}

function createTeamCard(team, ti) {
  const container = el("div", { class: "teamCard" });

  const headerRow = el("tr", {}, [
    el("td", {}, [
      el("input", {
        value: team.teamName,
        onchange: (e) => (team.teamName = e.target.value),
      }),
    ]),

    el("td", {}, [
      select(
        allSponsors.map((s) => s.name),
        team.sponsor,
        (e) => setSponsor(ti, e.target.value),
      ),
    ]),

    el("td", { text: teamCost(team) + " /" }),

    el("td", {}, [el("input", { value: team.maxCost })]),

    el("td", { text: "cans" }),

    el("td", {}, [
      el("button", { onclick: () => openPrintPreview(ti) }, ["Print"]),
    ]),

    el("td", {}, [el("button", { onclick: () => removeTeam(ti) }, ["X"])]),
  ]);

  container.appendChild(el("table", { class: "teamHeader" }, [headerRow]));

  container.appendChild(
    el(
      "button",
      {
        class: "addVehicle addButton",
        onclick: () => addVehicle(ti),
      },
      ["+ Vehicle"],
    ),
  );

  team.vehicles.forEach((v, vi) => {
    container.appendChild(createVehicleCard(team, ti, v, vi));
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

function createWeaponsTable(team, ti, v, vi) {
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
      el("th", {}, [
        el("button", { onclick: () => addWeapon(ti, vi), class: "addButton" }, [
          "+",
        ]),
      ]),
    ]),
  );

  table.appendChild(createDefaultWeaponRow(v));

  v.weapons.forEach((w, wi) => {
    table.appendChild(createWeaponRow(team, ti, v, vi, w, wi));
  });

  return table;
}

function createWeaponRow(team, ti, v, vi, w, wi) {
  const facings = allowedFacings(v, w.weapon);
  const locs = allowedLocations(v);

  return el("tr", {}, [
    el("td", {}, [
      select(
        allowedWeaponsFull(v, team.sponsor).map((o) => o.wtype),
        w.weapon.wtype,
        (e) => changeWeapon(ti, vi, wi, e.target.value),
      ),
    ]),

    el("td", {}, [
      facings.length === 1
        ? document.createTextNode(facings[0])
        : select(facings, w.facing, (e) =>
            setWeaponFacing(ti, vi, wi, e.target.value),
          ),
    ]),

    ...(locs.length > 1
      ? [
          el("td", {}, [
            select(locs, w.location, (e) =>
              setWeaponLocation(ti, vi, wi, e.target.value),
            ),
          ]),
        ]
      : []),

    el("td", { text: w.weapon.attackType }),
    el("td", { text: weaponAttack(v, w.weapon) }),
    el("td", { text: weaponRange(v, w.weapon) }),
    el("td", { text: weaponRules(v, w.weapon) }),
    el("td", { text: weaponSlots(v, w.weapon) }),
    el("td", { text: weaponCost(v, w) }),

    el("td", {}, [
      el(
        "button",
        { onclick: () => removeWeapon(ti, vi, wi), class: "removeButton" },
        ["X"],
      ),
    ]),
  ]);
}

function createUpgradesTable(team, ti, v, vi) {
  const table = el("table", { class: "upgradesTable" });

  table.appendChild(
    el("tr", {}, [
      el("th", { text: "Upgrade" }),
      el("th", { text: "Ammo" }),
      el("th", { text: "Slots" }),
      el("th", { text: "Special Rules" }),
      el("th", { text: "Cost" }),
      el("th", {}, [
        el(
          "button",
          { onclick: () => addUpgrade(ti, vi), class: "addButton" },
          ["+"],
        ),
      ]),
    ]),
  );

  v.upgrades.forEach((u, ui) => {
    table.appendChild(
      el("tr", {}, [
        el("td", {}, [
          select(
            allowedUpgradesFull(v, team.sponsor).map((o) => o.utype),
            u.utype,
            (e) => changeUpgrade(ti, vi, ui, e.target.value),
          ),
        ]),
        el("td", { text: u.ammo || "-" }),
        el("td", { text: u.slots || "-" }),
        el("td", { text: u.specialRules || "" }),
        el("td", { text: u.cost || 0 }),
        el("td", {}, [
          el(
            "button",
            { onclick: () => removeUpgrade(ti, vi, ui), class: "removeButton" },
            ["X"],
          ),
        ]),
      ]),
    );
  });

  return table;
}

function createPerksTable(team, ti, v, vi) {
  const table = el("table", { class: "perksTable" });

  table.appendChild(
    el("tr", {}, [
      el("th", { text: "Perk" }),
      el("th", { text: "Special Rules" }),
      el("th", { text: "Cost" }),
      el("th", {}, [
        el("button", { onclick: () => addPerk(ti, vi), class: "addButton" }, [
          "+",
        ]),
      ]),
    ]),
  );

  v.perks.forEach((p, pi) => {
    table.appendChild(
      el("tr", {}, [
        el("td", {}, [
          select(
            allowedPerks(team.sponsor).map((o) => o.ptype),
            p.ptype,
            (e) => changePerk(ti, vi, pi, e.target.value),
          ),
        ]),
        el("td", { text: p.rules || "" }),
        el("td", { text: p.cost || 0 }),
        el("td", {}, [
          el(
            "button",
            { onclick: () => removePerk(ti, vi, pi), class: "removeButton" },
            ["X"],
          ),
        ]),
      ]),
    );
  });

  return table;
}

function createTrailerSection(team, ti, v, vi) {
  if (team.sponsor !== "Rusty's Bootleggers") return null;

  return el("table", { class: "trailerTable" }, [
    el("tr", {}, [
      el("td", { text: "Trailer:" }),
      el("td", {}, [
        select(
          allTrailers.map((t) => t.ttype),
          v.trailer?.ttype || "None",
          (e) => setTrailer(ti, vi, e.target.value),
        ),
      ]),

      el("td", { text: "Cargo:" }),
      el("td", {}, [
        (v.trailer?.ttype || "None") !== "None"
          ? select(
              allCargos.map((c) => c.ctype),
              v.cargo?.ctype || "None",
              (e) => setCargo(ti, vi, e.target.value),
            )
          : el("select", {}, [
              el("option", { selected: "selected" }, ["None"]),
            ]),
      ]),
    ]),
  ]);
}

function createVehicleCard(team, ti, v, vi) {
  const container = el("div", { class: "vehicleCard" });

  const stats = computeStats(v);
  const free = totalSlots(v) - usedSlots(v);

  container.appendChild(
    el("table", { class: "vehicleHeader" }, [
      el("tr", {}, [
        el("td", {}, [
          el("input", {
            value: v.vehicleName,
            onchange: (e) => (v.vehicleName = e.target.value),
          }),
        ]),

        el("td", {}, [
          select(
            allVehicles.map((x) => x.vtype),
            v.vtype,
            (e) => changeVehicle(ti, vi, e.target.value),
          ),
        ]),

        el("td", { text: `${vehicleCost(v, team.sponsor)} cans` }),

        el("td", {}, [
          el(
            "button",
            { onclick: () => removeVehicle(ti, vi), class: "removeButton" },
            ["X"],
          ),
        ]),
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

  const trailer = createTrailerSection(team, ti, v, vi);
  if (trailer) container.appendChild(trailer);

  container.appendChild(createWeaponsTable(team, ti, v, vi));

  container.appendChild(createUpgradesTable(team, ti, v, vi));

  if (allowedPerks(team.sponsor).length) {
    container.appendChild(createPerksTable(team, ti, v, vi));
  }

  return container;
}

export function render() {
  const editDiv = document.getElementById("editDiv");
  const printDiv = document.getElementById("printDiv");
  const headerDiv = document.getElementById("headerDiv");
  const printContent = document.getElementById("printContent");

  if (state.printMode) {
    editDiv.style.display = "none";
    printDiv.style.display = "block";
    headerDiv.style.display = "none";
  } else {
    editDiv.style.display = "block";
    printDiv.style.display = "none";
    headerDiv.style.display = "block";
  }

  if (!state.printMode) {
    editDiv.innerHTML = "";

    state.teams.forEach((team, ti) => {
      editDiv.appendChild(createTeamCard(team, ti));
    });
  } else {
    printContent.innerHTML = "";
    let team = state.teams[state.currentTeamIndex];
    let cost = teamCost(team);
    const perkOptions = allowedPerks(team.sponsor);

    let teamHTML = `
      <div class="teamCard">
        <table class="teamHeader">
          <tr>
            <td>${team.teamName}</td>
            <td>${team.sponsor}</td>
            <td>${cost} cans</td>
          </tr>
        </table>
      `;
    team.vehicles.forEach((v, vi) => {
      let stats = computeStats(v);
      let free = totalSlots(v) - usedSlots(v);

      let weaponRows = v.weapons
        .map((w, wi) => {
          let facings = allowedFacings(v, w.weapon);
          let locs = allowedLocations(v);

          return `
          <tr>
            <td>${w.weapon.wtype}</td>
            <td>${w.facing}</td>
            ${locs.length === 1 ? "" : `<td>${w.location}</td>`}
            <td>${w.weapon.attackType}</td>
            <td>${weaponAttack(v, w.weapon)}</td>
            <td>${weaponRange(v, w.weapon)}</td>
            <td>${weaponRules(v, w.weapon)}</td>
            <td>${weaponSlots(v, w.weapon)}</td>
            <td>${weaponCost(v, w)}</td>
          </tr>
          `;
        })
        .join("");

      let upgradeRows = v.upgrades
        .map(
          (u, ui) => `
          <tr>
            <td>${u.utype}</td>
            <td>${u.ammo || "-"}</td>
            <td>${u.slots || "-"}</td>
            <td>${u.specialRules || ""}</td>
            <td>${u.cost || 0}</td>
          </tr>
        `,
        )
        .join("");

      teamHTML += `
        <div class="vehicleCard">
          <table class="vehicleHeader">
            <tr>
              <td>${v.vehicleName}</td>
              <td>${v.vtype}</td>
              <td>${vehicleCost(v, team.sponsor)} cans</td>
            </tr>
          </table>

          <table class="vehicleStats">
            <tr>
              <td>Weight: ${v.weight}</td>
              <td>Hull: ${stats.hull}</td>
              <td>Handling: ${stats.handling}</td>
              <td>Max gear: ${stats.maxGear}</td>
              <td>Crew: ${stats.crew}</td>
              <td>Free slots: ${free}</td>
            </tr>
          </table>

          <!-- Trailer / Cargo -->
          ${
            team.sponsor === "Rusty's Bootleggers"
              ? `<table class="trailerTable">
                <tr>
                  <td>Trailer:</td>
                  <td>${v.trailer.ttype}</td>
                  <td>Cargo:</td>
                  <td>${v.cargo.ctype}</td>
                </tr>
              </table>`
              : ""
          }

          <!-- WEAPONS -->
          <table class="weaponsTable">
            <tr>
              <th>Weapon</th>
              <th>Facing</th>
              ${allowedLocations(v).length === 1 ? "" : `<th>Location</th>`}
              <th>Type</th>
              <th>Attack</th>
              <th>Range</th>
              <th>Special Rules</th>
              <th>Slots</th>
              <th>Cost</th>
            </tr>

            <tr>
              <td>Handgun</td>
              <td>360</td>
              ${allowedLocations(v).length === 1 ? "" : `<td></td>`}
              <td>Shooting</td>
              <td>1D6</td>
              <td>Medium</td>
              <td>Blitz</td>
              <td>-</td>
              <td>-</td>
            </tr>

            ${weaponRows}
          </table>

          <!-- UPGRADES -->
          <table class="upgradesTable">
            <tr>
              <th>Upgrade</th>
              <th>Ammo</th>
              <th>Slots</th>
              <th>Special Rules</th>
              <th>Cost</th>
            </tr>

            ${upgradeRows}
          </table>

          ${
            perkOptions.length
              ? `<!-- ===== PERKS ===== -->
          <table class="perksTable">
            <tr>
              <th>Perk</th>
              <th>Special Rules</th>
              <th>Cost</th>
            </tr>

            ${v.perks
              .map(
                (p, pi) => `
                <tr>
                  <td>${p.ptype}</td>
                  <td>${p.rules || ""}</td>
                  <td>${p.cost || 0}</td>
                      
                </tr>
              `,
              )
              .join("")}`
              : ``
          }
        </div>
        `;
    });

    teamHTML += `</div>`;
    printContent.innerHTML += teamHTML;
  }
}
