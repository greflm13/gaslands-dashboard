import { state } from "./state.js";
import { allSponsors, allVehicles, allTrailers, allCargos } from "./data.js";
import {
  addPerk,
  addImage,
  addUpgrade,
  addVehicle,
  addWeapon,
  allowedFacings,
  allowedLocations,
  allowedPerks,
  allowedUpgradesFull,
  allowedWeaponsFull,
  changePerk,
  changeUpgrade,
  changeVehicle,
  changeWeapon,
  computeStats,
  loadImageFromDB,
  openPrintPreview,
  removePerk,
  removeTeam,
  removeUpgrade,
  removeVehicle,
  removeWeapon,
  setCargo,
  setSponsor,
  setTrailer,
  setWeaponFacing,
  teamCost,
  totalSlots,
  usedSlots,
  vehicleCost,
  weaponAttack,
  weaponCost,
  weaponRange,
  weaponRules,
  weaponSlots,
  saveState,
  weaponAmmo,
} from "./app.js";

let isRendering = false;

async function loadPrint() {
  const { renderPrint } = await import("./print.js");
  renderPrint();
}

async function loadReference() {
  const { createReference } = await import("./reference.js");
  return createReference();
}

export function el(tag, props = {}, children = []) {
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

function toggleFold(ti) {
  const folder = document.getElementById(`folder-${ti}`);
  const foldState = folder.className;
  const team = document.getElementById(`team-${ti}`);
  const vehicles = Array.from(team.getElementsByClassName("vehicleCard"));
  const button = document.getElementById(`vehicle-adder-${ti}`);
  if (foldState == "unfolded") {
    folder.className = "folded";
    vehicles.forEach((i) => {
      i.className = "vehicleCard hidden";
    });
    button.className = "addVehicle hidden";
    state.teams[ti].folded = true;
  } else {
    folder.className = "unfolded";
    vehicles.forEach((i) => {
      i.className = "vehicleCard";
    });
    button.className = "addVehicle";
    state.teams[ti].folded = false;
  }
  saveState();
}

function setFold() {
  state.teams.forEach((t, ti) => {
    const folder = document.getElementById(`folder-${ti}`);
    const foldState = folder.className;
    const team = document.getElementById(`team-${ti}`);
    const vehicles = Array.from(team.getElementsByClassName("vehicleCard"));
    const button = document.getElementById(`vehicle-adder-${ti}`);
    if (foldState == "unfolded") {
      folder.className = "unfolded";
      vehicles.forEach((i) => {
        i.className = "vehicleCard";
      });
      button.className = "addVehicle";
    } else {
      folder.className = "folded";
      vehicles.forEach((i) => {
        i.className = "vehicleCard hidden";
      });
      button.className = "addVehicle hidden";
    }
    saveState();
  });
}

async function createTeamCard(team, ti) {
  const container = el("div", { class: "teamCard", id: `team-${ti}` });

  const headerRow = el("tr", {}, [
    el("td", {}, [
      el("img", {
        class: team.folded ? "folded" : "unfolded",
        id: `folder-${ti}`,
        onclick: () => toggleFold(ti),
      }),
    ]),
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

    el("td", {
      text: teamCost(team),
      class: teamCost(team) <= team.maxCost ? "cheap" : "expensive",
    }),

    el("td", {}, [
      el("input", {
        value: team.maxCost,
        onchange: (e) => (team.maxCost = e.target.value),
      }),
    ]),

    el("td", { text: "cans" }),

    el("td", {}, [
      el("button", { onclick: () => openPrintPreview(ti) }, ["Print/Play"]),
    ]),

    el("td", {}, [
      el("img", {
        onclick: () => removeTeam(ti),
        class: "removeButton",
        class: "removeButton",
      }),
    ]),
  ]);

  container.appendChild(el("table", { class: "teamHeader" }, [headerRow]));

  container.appendChild(
    el(
      "button",
      {
        class: "addVehicle",
        onclick: () => addVehicle(ti),
        id: `vehicle-adder-${ti}`,
      },
      ["add Vehicle"],
    ),
  );

  const cards = await Promise.all(
    team.vehicles.map((v, vi) => createVehicleCard(team, ti, v, vi)),
  );

  cards.forEach((card) => container.appendChild(card));

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
      el("th", { text: "Ammo" }),
      el("th", { text: "Slots" }),
      el("th", { text: "Cost" }),
      el("th", {}, [
        el("img", {
          onclick: () => addWeapon(ti, vi),
          class: "addButton",
        }),
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
    el("td", { text: weaponAmmo(v, w.weapon) }),
    el("td", { text: weaponSlots(v, w.weapon) }),
    el("td", { text: weaponCost(v, w) }),

    el("td", {}, [
      el("img", {
        onclick: () => removeWeapon(ti, vi, wi),
        class: "removeButton",
      }),
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
        el("img", {
          onclick: () => addUpgrade(ti, vi),
          class: "addButton",
        }),
      ]),
    ]),
  );

  v.upgrades.forEach((u, ui) => {
    table.appendChild(
      el("tr", {}, [
        el("td", {}, [
          select(
            allowedUpgradesFull(v, team.sponsor, ui).map((o) => o.utype),
            u.utype,
            (e) => changeUpgrade(ti, vi, ui, e.target.value),
          ),
        ]),
        el("td", { text: u.ammo || "-" }),
        el("td", { text: u.slots || "-" }),
        el("td", { text: u.specialRules || "" }),
        el("td", { text: u.cost || 0 }),
        el("td", {}, [
          el("img", {
            onclick: () => removeUpgrade(ti, vi, ui),
            class: "removeButton",
          }),
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
        el("img", {
          onclick: () => addPerk(ti, vi),
          class: "addButton",
        }),
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
          el("img", {
            onclick: () => removePerk(ti, vi, pi),
            class: "removeButton",
          }),
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

async function showHoverImage(ti, v, vi, e) {
  const imageSrc = (await loadImageFromDB(v.imageID)) || "/img/placeholder.png";
  const hover = el("div", { class: "vehicleImgHover" }, [
    el("img", {
      src: imageSrc,
      width: "250px",
      height: "250px",
      top: e.clientY + "px",
      left: e.clentX + "px",
    }),
  ]);
  document.getElementById(`img-${ti}-${vi}`).appendChild(hover);
}

function removeHoverImage(ti, vi, e) {
  parent = document.getElementById(`img-${ti}-${vi}`);
  parent.removeChild(parent.lastElementChild);
}

async function createVehicleCard(team, ti, v, vi) {
  const container = el("div", { class: "vehicleCard" });

  const stats = computeStats(v);
  const free = totalSlots(v) - usedSlots(v);

  const imageSrc = (await loadImageFromDB(v.imageID)) || "/img/placeholder.png";

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
        el("td", { id: `img-${ti}-${vi}` }, [
          el("label", { text: "Image: ", for: `imgi-${ti}-${vi}` }),
          el("img", {
            src: imageSrc,
            class: "vehicleImg",
            width: "25px",
            height: "25px",
            onmouseenter: (e) => showHoverImage(ti, v, vi, e),
            onmouseleave: (e) => removeHoverImage(ti, vi, e),
          }),
          el("input", {
            type: "File",
            accept: "image/*",
            id: `imgi-${ti}-${vi}`,
            class: "imagePicker",
            onchange: (e) => addImage(ti, vi, e),
          }),
        ]),

        el("td", { text: `${vehicleCost(v, team.sponsor)} cans` }),

        el("td", {}, [
          el("img", {
            onclick: () => removeVehicle(ti, vi),
            class: "removeButton",
          }),
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

export async function render() {
  if (isRendering) return;
  isRendering = true;
  try {
    const editDiv = document.getElementById("editDiv");
    const printDiv = document.getElementById("printDiv");
    const headerDiv = document.getElementById("headerDiv");

    if (state.printMode) {
      editDiv.style.display = "none";
      printDiv.style.display = "block";
      headerDiv.style.display = "none";
      diceDiv.style.display = "none";
    } else {
      editDiv.style.display = "grid";
      printDiv.style.display = "none";
      headerDiv.style.display = "block";
      diceDiv.style.display = "none";
    }

    if (!state.printMode) {
      const edit = el("div", { class: "editLayout" });
      const cards = await Promise.all(
        (state.teams || []).map((team, ti) => createTeamCard(team, ti)),
      );

      edit.replaceChildren(...cards);
      const editPage = [edit, await loadReference()];
      editDiv.replaceChildren(...editPage);
      setFold();
    } else {
      await loadPrint();
    }
  } finally {
    isRendering = false;
  }
}
