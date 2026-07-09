import { state } from "./state.js";
import { allSponsors, allVehicles, allTrailers, allCargos } from "./data.js";
import {
  addImage,
  addPerk,
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
  saveState,
  setCargo,
  setSponsor,
  setTrailer,
  setWeaponFacing,
  setWeaponLocation,
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
} from "./app.js";

let isRendering = false;

async function loadReference() {
  const { createReference } = await import("./reference.js");
  return createReference();
}

async function setReference() {
  const {
    referenceVehicles,
    referenceWeapons,
    referenceUpgrades,
    referenceSponsors,
    referenceCargos,
  } = await import("./reference.js");
  switch (state.reference) {
    case "vehicles":
      referenceVehicles();
      break;
    case "weapons":
      referenceWeapons();
      break;
    case "upgrades":
      referenceUpgrades();
      break;
    case "sponsors":
      referenceSponsors();
      break;
    case "cargos":
      referenceCargos();
      break;
  }
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

function select(options, value, onChange, onClick) {
  return el(
    "select",
    { onchange: onChange, onclick: onClick },
    options.map((opt) => {
      const option = el("option", { value: opt }, [opt]);
      if (opt === value) option.selected = true;
      return option;
    }),
  );
}

function weaponSelect(v, team, index, selected, onChange) {
  const weapons = allowedWeaponsFull(v, team.sponsor, index);

  const groups = {};
  weapons.forEach((w) => {
    if (!groups[w.group]) groups[w.group] = [];
    groups[w.group].push(w);
  });

  return el(
    "select",
    { onchange: onChange },
    Object.entries(groups).map(([type, ws]) =>
      el(
        "optgroup",
        { label: type },
        ws.map((w) => {
          const option = el("option", { value: w.wtype }, [w.wtype]);
          if (w.wtype === selected) option.selected = true;
          return option;
        }),
      ),
    ),
  );
}

function upgradeSelect(v, team, index, selected, onChange) {
  const upgrades = allowedUpgradesFull(v, team.sponsor, index);

  const groups = {};
  upgrades.forEach((w) => {
    if (!groups[w.allowedSponsors[0] || "All"])
      groups[w.allowedSponsors[0] || "All"] = [];
    groups[w.allowedSponsors[0] || "All"].push(w);
  });

  return el(
    "select",
    { onchange: onChange },
    Object.entries(groups).map(([type, us]) =>
      el(
        "optgroup",
        { label: type },
        us.map((u) => {
          const option = el("option", { value: u.utype }, [u.utype]);
          if (u.utype === selected) option.selected = true;
          return option;
        }),
      ),
    ),
  );
}

function perkSelect(team, v, index, selected, onChange) {
  const perks = allowedPerks(v, team.sponsor, index);

  const groups = {};
  perks.forEach((p) => {
    if (!groups[p.class]) groups[p.class] = [];
    groups[p.class].push(p);
  });

  return el(
    "select",
    { onchange: onChange },
    Object.entries(groups).map(([type, ps]) =>
      el(
        "optgroup",
        { label: type },
        ps.map((p) => {
          const option = el("option", { value: p.ptype }, [p.ptype]);
          if (p.ptype === selected) option.selected = true;
          return option;
        }),
      ),
    ),
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
  const container = el("div", { class: "teamCard", id: `team-${ti}` }, [
    el("div", { class: "teamHeader", onclick: () => toggleFold(ti) }, [
      el("div", { class: "teamHeadFold" }, [
        el("img", {
          class: team.folded ? "folded" : "unfolded",
          id: `folder-${ti}`,
          onclick: (e) => {
            toggleFold(ti);
            e.stopPropagation();
          },
        }),
      ]),
      el("div", { class: "teamHeadName" }, [
        el("input", {
          value: team.teamName,
          type: "text",
          onchange: (e) => (team.teamName = e.target.value),
          onclick: (e) => e.stopPropagation(),
        }),
      ]),

      el("div", { class: "teamHeadSponsor" }, [
        select(
          allSponsors.map((s) => s.name),
          team.sponsor,
          (e) => setSponsor(ti, e.target.value),
          (e) => e.stopPropagation(),
        ),
      ]),
      el("div", { class: "teamHeadCostContainer" }, [
        el("div", {}, [
          el("div", {
            text: teamCost(team),
            id: `team-cost-${ti}`,
            class:
              "teamHeadCost " +
              `${teamCost(team) <= team.maxCost ? "cheap" : "expensive"}`,
            onclick: (e) => e.stopPropagation(),
          }),

          el("div", { class: "teamHeadMaxCost" }, [
            el("input", {
              value: team.maxCost,
              type: "text",
              onchange: (e) => {
                team.maxCost = e.target.value;
                document.getElementById(`team-cost-${ti}`).classList =
                  teamCost(team) <= team.maxCost
                    ? "teamHeadCost cheap"
                    : "teamHeadCost expensive";
              },
              onclick: (e) => e.stopPropagation(),
            }),
          ]),
          el("div", { class: "teamHeadCans", text: "cans" }),
        ]),
      ]),
      el("div", { class: "teamHeadPrintPlay" }, [
        el(
          "button",
          {
            onclick: (e) => {
              e.stopPropagation();
              openPrintPreview(ti);
            },
          },
          ["Print/Play"],
        ),
      ]),

      el("div", { class: "teamHeadRemove" }, [
        el("img", {
          onclick: (e) => {
            e.stopPropagation();
            removeTeam(ti);
          },
          class: "removeButton",
          class: "removeButton",
        }),
      ]),
    ]),
  ]);

  const cards = await Promise.all(
    team.vehicles.map((v, vi) => createVehicleCard(team, ti, v, vi)),
  );

  cards.forEach((card) => container.appendChild(card));

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

  return container;
}

function createDefaultWeaponRow(v) {
  const locs = allowedLocations(v);
  return el(
    "div",
    { class: `weaponsRow ${locs.length > 1 ? "yesLocation" : "noLocation"}` },
    [
      el("div", { class: "weaponType", text: "Handgun" }),
      el("div", { class: "weaponFacing", text: "360" }),
      ...(locs.length > 1 ? [el("div", { class: "weaponLocation" })] : []),
      el("div", { class: "weaponAttackType", text: "Shooting" }),
      el("div", { class: "weaponAttack", text: "1D6" }),
      el("div", { class: "weaponRange", text: "Medium" }),
      el("div", { class: "weaponRules", text: "Blitz" }),
      el("div", { class: "weaponAmmo", text: "-" }),
      el("div", { class: "weaponSlots", text: "-" }),
      el("div", { class: "weaponCost", text: "-" }),
      el("div", { class: "weaponAdd" }),
    ],
  );
}

function createWeaponsTable(team, ti, v, vi) {
  const table = el("div", { class: "weaponsTable" });
  const locs = allowedLocations(v);

  table.appendChild(
    el(
      "div",
      {
        class: `weaponsHeader ${locs.length > 1 ? "yesLocation" : "noLocation"}`,
      },
      [
        el("div", { class: "weaponsHeadType", text: "Weapon" }),
        el("div", { class: "weaponsHeadFacing", text: "Facing" }),
        ...(locs.length > 1
          ? [el("div", { class: "weaponsHeadLocation", text: "Location" })]
          : []),
        el("div", { class: "weaponsHeadAttackType", text: "Type" }),
        el("div", { class: "weaponsHeadAttack", text: "Attack" }),
        el("div", { class: "weaponsHeadRange", text: "Range" }),
        el("div", { class: "weaponsHeadRules", text: "Special Rules" }),
        el("div", { class: "weaponsHeadAmmo", text: "Ammo" }),
        el("div", { class: "weaponsHeadSlots", text: "Slots" }),
        el("div", { class: "weaponsHeadCost", text: "Cost" }),
        el("div", { class: "weaponsHeadAdd" }, [
          el("img", {
            onclick: () => addWeapon(ti, vi),
            class: "addButton",
          }),
        ]),
      ],
    ),
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

  return el(
    "div",
    { class: `weaponsRow ${locs.length > 1 ? "yesLocation" : "noLocation"}` },
    [
      el("div", { class: "weaponType" }, [
        weaponSelect(v, team, wi, w.weapon.wtype, (e) =>
          changeWeapon(ti, vi, wi, e.target.value),
        ),
      ]),

      el("div", { class: "weaponFacing" }, [
        facings.length === 1
          ? document.createTextNode(facings[0])
          : select(facings, w.facing, (e) =>
              setWeaponFacing(ti, vi, wi, e.target.value),
            ),
      ]),

      ...(locs.length > 1
        ? [
            el("div", { class: "weaponLocation" }, [
              select(locs, w.location, (e) =>
                setWeaponLocation(ti, vi, wi, e.target.value),
              ),
            ]),
          ]
        : []),

      el("div", { class: "weaponAttackType", text: w.weapon.attackType }),
      el("div", { class: "weaponAttack", text: weaponAttack(v, w.weapon) }),
      el("div", { class: "weaponRange", text: weaponRange(v, w.weapon) }),
      el("div", { class: "weaponRules", text: weaponRules(v, w.weapon) }),
      el("div", { class: "weaponAmmo", text: weaponAmmo(v, w.weapon) }),
      el("div", { class: "weaponSlots", text: weaponSlots(v, w.weapon) }),
      el("div", { class: "weaponCost", text: weaponCost(v, w) }),

      el("div", { class: "weaponRemove" }, [
        el("img", {
          onclick: () => removeWeapon(ti, vi, wi),
          class: "removeButton",
        }),
      ]),
    ],
  );
}

function createUpgradesTable(team, ti, v, vi) {
  const table = el("div", { class: "upgradesTable" });

  table.appendChild(
    el("div", { class: "upgradesHeader" }, [
      el("div", { class: "upgradesHeadType", text: "Upgrade" }),
      el("div", { class: "upgradesHeadRules", text: "Special Rules" }),
      el("div", { class: "upgradesHeadAmmo", text: "Ammo" }),
      el("div", { class: "upgradesHeadSlots", text: "Slots" }),
      el("div", { class: "upgradesHeadCost", text: "Cost" }),
      el("div", { class: "upgradesHeadAdd" }, [
        el("img", {
          onclick: () => addUpgrade(ti, vi),
          class: "addButton",
        }),
      ]),
    ]),
  );

  v.upgrades.forEach((u, ui) => {
    table.appendChild(
      el("div", { class: "upgradesRow" }, [
        el("div", { class: "upgradeType" }, [
          upgradeSelect(v, team, ui, u.utype, (e) =>
            changeUpgrade(ti, vi, ui, e.target.value),
          ),
        ]),
        el("div", { class: "upgradeRules", text: u.specialRules || "" }),
        el("div", { class: "upgradeAmmo", text: u.ammo || "-" }),
        el("div", { class: "upgradeSlots", text: u.slots || "-" }),
        el("div", { class: "upgradeCost", text: u.cost || 0 }),
        el("div", { class: "upgradeRemove" }, [
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
  const table = el("div", { class: "perksTable" });

  table.appendChild(
    el("div", { class: "perksHeader" }, [
      el("div", { class: "perksHeadType", text: "Perk" }),
      el("div", { class: "perksHeadRules", text: "Special Rules" }),
      el("div", { class: "perksHeadCost", text: "Cost" }),
      el("div", { class: "perksHeadAdd" }, [
        el("img", {
          onclick: () => addPerk(ti, vi),
          class: "addButton",
        }),
      ]),
    ]),
  );

  v.perks.forEach((p, pi) => {
    table.appendChild(
      el("div", { class: "perksRow" }, [
        el("div", { class: "perkType" }, [
          perkSelect(team, v, pi, p.ptype, (e) =>
            changePerk(ti, vi, pi, e.target.value),
          ),
        ]),
        el("div", { class: "perkRules", text: p.rules || "" }),
        el("div", { class: "perkCost", text: p.cost || 0 }),
        el("div", { class: "perkRemove" }, [
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
  if (team.sponsor !== "Rusty's Bootleggers" || v.vtype === "War Rig")
    return null;

  return el("div", { class: "trailerTable" }, [
    el("div", { class: "trailerTrailer", text: "Trailer:" }),
    el("div", { class: "trailerType" }, [
      select(
        allTrailers.map((t) => t.ttype),
        v.trailer?.ttype || "None",
        (e) => setTrailer(ti, vi, e.target.value),
      ),
    ]),

    el("div", { class: "trailerCargo", text: "Cargo:" }),
    el("div", { class: "trailerCargoType" }, [
      (v.trailer?.ttype || "None") !== "None"
        ? select(
            allCargos.map((c) => c.ctype),
            v.cargo?.ctype || "None",
            (e) => setCargo(ti, vi, e.target.value),
          )
        : el("select", {}, [el("option", { selected: "selected" }, ["None"])]),
    ]),
  ]);
}

async function showHoverImage(ti, v, vi, e) {
  const imageSrc = (await loadImageFromDB(v.imageID)) || "/img/placeholder.svg";
  const hover = el(
    "div",
    { class: "vehicleImgHover", id: `imgh-${ti}-${vi}` },
    [
      el("img", {
        src: imageSrc,
        width: "250px",
        height: "250px",
        top: e.clientY + "px",
        left: e.clientX + "px",
        onmouseleave: (e) => removeHoverImage(ti, vi, e),
      }),
    ],
  );
  if (document.getElementById(`imgh-${ti}-${vi}`) === null) {
    document.getElementById(`img-${ti}-${vi}`).appendChild(hover);
  }
  e.stopPropagation();
}

function removeHoverImage(ti, vi, e) {
  const par = document.getElementById(`img-${ti}-${vi}`);
  const chi = document.getElementById(`imgh-${ti}-${vi}`);
  console.log(e);
  if (chi != null) {
    par.removeChild(chi);
  }
}

async function createVehicleCard(team, ti, v, vi) {
  const container = el("div", { class: "vehicleCard" });

  const stats = computeStats(v);
  const free = totalSlots(v) - usedSlots(v);

  const imageSrc = (await loadImageFromDB(v.imageID)) || "/img/placeholder.svg";

  container.appendChild(
    el("div", { class: "vehicleHeader" }, [
      el("div", { class: "vehicleHeadName" }, [
        el("input", {
          value: v.vehicleName,
          type: "text",
          onchange: (e) => (v.vehicleName = e.target.value),
          maxlength: 24,
        }),
      ]),

      el("div", { class: "vehicleHeadType" }, [
        select(
          allVehicles.map((x) => x.vtype),
          v.vtype,
          (e) => changeVehicle(ti, vi, e.target.value),
        ),
      ]),
      el("div", { class: "vehicleHeadImg", id: `img-${ti}-${vi}` }, [
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

      el("div", {
        class: "vehicleHeadCost",
        text: `${vehicleCost(v, team.sponsor)} cans`,
      }),

      el("div", { class: "vehicleHeadRemove" }, [
        el("img", {
          onclick: () => removeVehicle(ti, vi),
          class: "removeButton",
        }),
      ]),
    ]),
  );

  container.appendChild(
    el("div", { class: "vehicleStats" }, [
      el("div", { text: `Weight: ${v.weight}` }),
      el("div", { text: `Hull: ${stats.hull}` }),
      el("div", { text: `Handling: ${stats.handling}` }),
      el("div", { text: `Max gear: ${stats.maxGear}` }),
      el("div", { text: `Crew: ${stats.crew}` }),
      el("div", { text: `Free slots: ${free}` }),
    ]),
  );

  const trailer = createTrailerSection(team, ti, v, vi);
  if (trailer) container.appendChild(trailer);

  container.appendChild(createWeaponsTable(team, ti, v, vi));

  container.appendChild(createUpgradesTable(team, ti, v, vi));

  if (allowedPerks(v, team.sponsor).length) {
    container.appendChild(createPerksTable(team, ti, v, vi));
  }

  return container;
}

export async function renderFull() {
  if (isRendering) return;
  isRendering = true;
  try {
    const edit = el("div", { class: "editLayout" });
    const cards = await Promise.all(
      (state.teams || []).map((team, ti) => createTeamCard(team, ti)),
    );

    edit.replaceChildren(...cards);
    const editPage = [edit, await loadReference()];
    editDiv.replaceChildren(...editPage);
    setFold();
    setReference();
  } finally {
    isRendering = false;
  }
}
