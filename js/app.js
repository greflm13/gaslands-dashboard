import { render } from "./render.js";
import { state } from "./state.js";
import {
  allCargos,
  allLocations,
  allPerks,
  allSponsors,
  allTrailers,
  allUpgrades,
  allVehicles,
  allWeapons,
  defaultVehicle,
} from "./data.js";

export function setSponsor(ti, value) {
  const team = state.teams[ti];
  team.sponsor = value;

  render();
}

export function teamCost(team) {
  return team.vehicles.reduce((s, v) => s + vehicleCost(v, team.sponsor), 0);
}

export function changeVehicle(ti, vi, type) {
  const base = structuredClone(allVehicles.find((v) => v.vtype === type));

  const old = state.teams[ti].vehicles[vi];

  base.vehicleName = old.vehicleName;
  base.weapons = old.weapons;
  base.upgrades = old.upgrades;
  base.perks = old.perks;

  state.teams[ti].vehicles[vi] = base;

  render();
}

export function openPrintPreview(i) {
  state.state.printMode = true;
  state.currentTeamIndex = i;
  render();
}

function closePrintPreview() {
  state.state.printMode = false;
  render();
}

function format0(x) {
  return x === 0 ? "-" : x;
}

function getVehicleKeywords(v) {
  let base = v.keywords || [];
  let upgradeKeywords = v.upgrades.flatMap((u) => u.keywords || []);
  return [...new Set([...base, ...upgradeKeywords])];
}

function setWeaponLocation(ti, vi, wi, loc) {
  const v = state.teams[ti].vehicles[vi];
  v.weapons[wi].location = loc;

  render();
}

function canHaveTrailer(v, sponsor) {
  return (
    sponsor === "Rusty's Bootleggers" &&
    !["Helicopter", "Gyrocopter"].includes(v.vtype)
  );
}

function hasTrailer(v) {
  return (v.trailer && v.trailer.ttype !== "None") || v.vtype === "War Rig";
}

function trailerSlots(v) {
  if (!v.trailer) return 0;
  return v.trailer.slots || 0;
}

function allowedCargo(v, sponsor) {
  if (!hasTrailer(v)) return [allCargos[0]];

  if (sponsor !== "Rusty's Bootleggers") {
    return [allCargos[0]];
  }

  return allCargos;
}

function allowedTrailers(v, sponsor) {
  if (sponsor !== "Rusty's Bootleggers") {
    return [allTrailers[0]];
  }

  if (v.vtype === "War Rig") {
    return [v.trailer];
  }

  return allTrailers;
}

export function computeStats(v) {
  let hull = v.hull;
  let handling = v.handling;
  let maxGear = v.maxGear;

  v.upgrades.forEach((u) => {
    if (u.utype === "Armour Plating") hull += 2;
    if (u.utype === "MicroPlate Armour") hull += 2;
    if (u.utype === "Prison Vehicle") hull -= 2;
    if (u.utype === "Tank tracks") {
      handling += 1;
      maxGear -= 1;
    }
    if (u.utype === "Experimental Nuclear Engine") {
      maxGear += 2;
    }
  });

  maxGear = Math.min(maxGear, 6);

  let crewBonus = v.upgrades.filter(
    (u) => u.utype === "Extra Crewmember",
  ).length;

  return {
    hull,
    handling,
    maxGear,
    crew: v.crew + crewBonus,
  };
}

export function addWeapon(ti, vi) {
  let team = state.teams[ti];
  let v = team.vehicles[vi];

  let options = allowedWeaponsFull(v, team.sponsor);

  let base = options.find((w) => w.wtype === "Heavy Machine Gun") || options[0];

  let newW = structuredClone(base);

  v.weapons.push({
    weapon: newW,
    facing: allowedFacings(v, newW)[0],
    location: allowedLocations(v)[0],
  });

  render();
}

export function removeWeapon(ti, vi, wi) {
  state.teams[ti].vehicles[vi].weapons.splice(wi, 1);
  render();
}

export function addUpgrade(ti, vi) {
  const team = state.teams[ti];
  const v = team.vehicles[vi];

  const opts = allowedUpgradesFull(v, team.sponsor);
  if (!opts.length) return;

  const base = structuredClone(opts[0]);

  const current = usedSlots(v);
  const slotVal = base.slots || 0;

  if (current + slotVal > totalSlots(v)) {
    alert("Not enough slots");
    return;
  }

  v.upgrades.push(base);

  render();
}

export function removeUpgrade(ti, vi, ui) {
  const v = state.teams[ti].vehicles[vi];

  v.upgrades.splice(ui, 1);

  render();
}

export function setTrailer(ti, vi, type) {
  const team = state.teams[ti];
  const v = team.vehicles[vi];

  const t = allTrailers.find((x) => x.ttype === type);
  if (!t) return;

  v.trailer = structuredClone(t);
  if (v.trailer.ttype === "None") {
    v.cargo = structuredClone(allCargos[0]);
  }

  render();
}

export function setCargo(ti, vi, type) {
  const team = state.teams[ti];
  const v = team.vehicles[vi];

  const c = allCargos.find((x) => x.ctype === type);
  if (!c) return;

  v.cargo = structuredClone(c);

  render();
}

export function weaponAttack(v, w) {
  if (
    w.wtype === "Mortar" &&
    v.upgrades.some((u) => u.utype === "Cluster Bombs")
  ) {
    return w.attack + "/2D6";
  }
  return w.attack;
}

export function weaponRange(v, w) {
  if (
    w.attackType === "Dropped" &&
    v.upgrades.some((u) => u.utype === "Improvised Sludge Thrower")
  ) {
    return "Medium/" + w.range;
  }
  return w.range;
}

export function weaponSlots(v, w) {
  let slots = w.slots || 0;
  let k = getVehicleKeywords(v);

  if (k.includes("Bombs away") && w.attackType === "Dropped") slots = 0;
  if (w.wtype === "Ram" && k.includes("Spiked Fist")) slots = 0;

  return format0(slots);
}

function weaponAmmo(v, w, sponsor) {
  let a = w.ammo;
  if (a === 3 && sponsor === "Rutherford") a += 1;
  return format0(a);
}

export function weaponRules(v, w) {
  let r = w.specialRules || "";

  if (
    w.wtype === "Mortar" &&
    v.upgrades.some((u) => u.utype === "Cluster Bombs")
  ) {
    r += " + cluster effect";
  }

  if (
    w.crewFired &&
    getVehicleKeywords(v).includes("Battle Taxi") &&
    !r.toLowerCase().includes("blitz")
  ) {
    r += ". Blitz";
  }

  return r;
}

export function allowedFacings(v, w) {
  if (
    w.crewFired ||
    w.wtype === "Thumper" ||
    w.wtype === "Wall Of Amplifiers"
  ) {
    return ["360"];
  }

  if (w.attackType === "Dropped") {
    if (v.upgrades.some((u) => u.utype === "Improvised Sludge Thrower")) {
      return ["360"];
    }
    return ["Rear", "Sides"];
  }

  if (w.wtype === "BFG") return ["Front"];

  if (w.attackType === "Shooting") {
    return ["Front", "Rear", "Sides", "Turret/360"];
  }

  return ["Front", "Rear", "Sides"];
}

export function weaponCost(v, entry) {
  let base = entry.weapon.cost;

  if (entry.facing !== "Turret/360") return base;

  let keywords = getVehicleKeywords(v);
  let hasTurret = keywords.includes("Turret");

  let turrets = v.weapons.filter((x) => x.facing === "Turret/360");

  if (!hasTurret) return base * 3;

  let max = turrets.reduce(
    (m, x) => (x.weapon.cost > (m?.weapon.cost || 0) ? x : m),
    null,
  );

  return entry === max ? base : base * 3;
}

function upgradeCost(v, u, sponsor) {
  let c = u.cost;

  if (u.utype === "Nitro Booster" && sponsor === "Idris") c /= 2;
  if (u.utype === "Extra Crewmember" && sponsor === "Scarlett") c /= 2;

  return c;
}

export function allowedUpgradesFull(v, sponsor) {
  return allUpgrades.filter((u) => {
    if (
      u.allowedSponsors &&
      u.allowedSponsors.length > 0 &&
      !u.allowedSponsors.includes(sponsor)
    ) {
      return false;
    }

    if (u.utype === "Nitro Booster" && v.keywords?.includes("Jet Engine")) {
      return false;
    }

    if (u.utype === "Prison Vehicle" && v.weight !== "Middle") {
      return false;
    }

    if (
      u.utype === "Tank tracks" &&
      ["Helicopter", "Gyrocopter", "Tank"].includes(v.vtype)
    ) {
      return false;
    }

    if (u.utype === "Extra Crewmember") {
      let maxCrew = v.crew * 2;
      let currentCrew = computeStats(v).crew;

      if (currentCrew >= maxCrew) {
        return false;
      }
    }

    if (u.limit != null) {
      let count = v.upgrades.filter((x) => x.utype === u.utype).length;
      if (count >= u.limit) {
        return false;
      }
    }

    return true;
  });
}

export function vehicleCost(v, sponsor) {
  let base = v.cost;

  if (v.upgrades.some((u) => u.utype === "Prison Vehicle")) {
    base += Math.max(5 - (base - 4), 0);
  }

  let wc = v.weapons.reduce((s, w) => s + weaponCost(v, w), 0);
  let uc = v.upgrades.reduce((s, u) => s + upgradeCost(v, u, sponsor), 0);
  let pc = v.perks.reduce((s, p) => s + (p?.cost || 0), 0);
  let tc = v.trailer?.cost || 0;

  return base + wc + uc + pc + tc;
}

export function usedSlots(v) {
  let ws = v.weapons.reduce((s, w) => {
    let val = weaponSlots(v, w.weapon);
    return s + (val === "-" ? 0 : val);
  }, 0);

  let us = v.upgrades.reduce((s, u) => s + (u.slots || 0), 0);

  return ws + us;
}

export function totalSlots(v) {
  return v.slots + trailerSlots(v);
}

export function allowedLocations(v) {
  let locs = ["Cab"];

  if (v.trailer && v.trailer.ttype !== "None") {
    locs.push("Trailer");
  }
  if (v.vtype === "War Rig") {
    locs.push("Trailer");
  }

  return locs;
}

function createTeam() {
  return {
    name: "New Team",
    sponsor: allSponsors[0]?.name || "",
    vehicles: [],
    maxCost: 50,
  };
}

function addTeam() {
  state.teams.push(createTeam());
  state.currentTeamIndex = state.teams.length - 1;
  render();
}

export function removeTeam(i) {
  state.teams.splice(i, 1);
  state.currentTeamIndex = Math.max(0, currentTeamIndex - 1);
  render();
}

export function addVehicle(i) {
  let v = structuredClone(defaultVehicle);
  v.name = "Vehicle";
  v.weapons = [];
  v.upgrades = [];
  v.perks = [];
  v.trailer = allTrailers[0];
  v.cargo = allCargos[0];

  state.teams[i].vehicles.push(v);
  render();
}

export function removeVehicle(ti, vi) {
  const team = state.teams[ti];
  team.vehicles.splice(vi, 1);
  render();
}

export function changeUpgrade(ti, vi, ui, type) {
  const team = state.teams[ti];
  const v = team.vehicles[vi];

  const base = allUpgrades.find((x) => x.utype === type);
  if (!base) return;

  const current = usedSlots(v);

  const oldSlots = v.upgrades[ui].slots || 0;
  const newSlots = base.slots || 0;

  if (current - oldSlots + newSlots > totalSlots(v)) {
    alert("Not enough slots");
    return;
  }

  v.upgrades[ui] = structuredClone(base);

  render();
}

export function changeWeapon(ti, vi, wi, newType) {
  const team = state.teams[ti];
  const v = team.vehicles[vi];

  const baseW = allWeapons.find((w) => w.wtype === newType);
  if (!baseW) return;

  const newWeapon = structuredClone(baseW);

  const currentSlots = usedSlots(v);

  const oldSlots = weaponSlots(v, v.weapons[wi].weapon);
  const newSlots = weaponSlots(v, newWeapon);

  const oldVal = oldSlots === "-" ? 0 : oldSlots;
  const newVal = newSlots === "-" ? 0 : newSlots;

  const adjustedSlots = currentSlots - oldVal + newVal;

  if (adjustedSlots > totalSlots(v)) {
    alert("Not enough slots");
    return;
  }

  v.weapons[wi].weapon = newWeapon;

  const facings = allowedFacings(v, newWeapon);
  if (!facings.includes(v.weapons[wi].facing)) {
    v.weapons[wi].facing = facings[0];
  }

  render();
}

export function setWeaponFacing(ti, vi, wi, facing) {
  const team = state.teams[ti];
  const v = team.vehicles[vi];

  v.weapons[wi].facing = facing;

  render();
}

export function allowedPerks(sponsorName) {
  const sponsor = allSponsors.find((s) => s.name === sponsorName);

  if (!sponsor) return [];

  if (sponsor.name === "None") {
    return [];
  }

  return allPerks.filter((p) => sponsor.perkClasses.includes(p.class));
}

export function addPerk(ti, vi) {
  const team = state.teams[ti];
  const v = team.vehicles[vi];

  const opts = allowedPerks(team.sponsor);
  if (!opts.length) return;

  const base = structuredClone(
    opts.find((p) => p.class === team.perkClass) || opts[0],
  );

  v.perks.push(base);

  render();
}

export function changePerk(ti, vi, pi, type) {
  const team = state.teams[ti];
  const v = team.vehicles[vi];

  const base = allPerks.find((x) => x.ptype === type);
  if (!base) return;

  v.perks[pi] = structuredClone(base);

  render();
}

export function removePerk(ti, vi, pi) {
  const v = state.teams[ti].vehicles[vi];

  v.perks.splice(pi, 1);

  render();
}

export function allowedWeaponsFull(v, sponsor) {
  return allWeapons.filter((w) => {
    if (
      w.allowedSponsors &&
      w.allowedSponsors.length > 0 &&
      !w.allowedSponsors.includes(sponsor)
    ) {
      return false;
    }

    if (w.wtype === "Exploding Ram" && v.weight === "Light") {
      return false;
    }

    if (w.limit != null) {
      let count = v.weapons.reduce((c, entry) => {
        if (!entry || !entry.weapon) return c;
        return entry.weapon.wtype === w.wtype ? c + 1 : c;
      }, 0);

      if (count >= w.limit) {
        return false;
      }
    }

    return true;
  });
}

function serializeAll() {
  return JSON.stringify(
    {
      teams: state.teams.map((t) => ({
        teamName: t.teamName,
        sponsor: t.sponsor,
        maxCost: t.maxCost,

        vehicles: t.vehicles.map((v) => ({
          vehicleName: v.vehicleName,
          vehicleType: v.vtype,

          weapons: v.weapons.map((w) => ({
            weaponType: w.weapon.wtype,
            facing: w.facing,
            location: w.location,
          })),

          upgrades: v.upgrades.map((u) => ({
            upgradeType: u.utype,
          })),

          perks: v.perks.map((p) => ({
            perkType: p.ptype,
          })),

          trailer: v.trailer.ttype || "None",
          cargo: v.cargo.ctype || "None",
        })),
      })),
    },
    null,
    2,
  );
}

function saveToFile() {
  if (window.showSaveFilePicker) {
    saveUsingFilePicker();
  } else {
    saveUsingDownload();
  }
}

async function saveUsingFilePicker() {
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: "gaslands_teams.json",
      types: [
        {
          description: "JSON",
          accept: { "application/json": [".json"] },
        },
      ],
    });

    const writable = await handle.createWritable();

    await writable.write(serializeAll());
    await writable.close();
  } catch (e) {
    console.log("Save cancelled", e);
  }
}

function saveUsingDownload() {
  const data = serializeAll();

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "gaslands_teams.json";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

function loadFromDialog() {
  if (window.showOpenFilePicker) {
    loadUsingFilePicker();
  } else {
    document.getElementById("fallbackLoadInput").click();
  }
}

function loadFromFileInput(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    loadFromText(e.target.result);
  };

  reader.readAsText(file);
}

async function loadUsingFilePicker() {
  try {
    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: "JSON",
          accept: { "application/json": [".json"] },
        },
      ],
    });

    const file = await handle.getFile();
    const text = await file.text();

    loadFromText(text);
  } catch (e) {
    console.log("Load cancelled", e);
  }
}

function loadFromText(text) {
  const data = JSON.parse(text);

  state.teams = (data.teams || []).map((t) => {
    const team = {
      teamName: t.teamName || "Team",
      sponsor: t.sponsor || allSponsors[0]?.name || "",
      maxCost: t.maxCost || 50,
      vehicles: [],
    };

    team.vehicles = (t.vehicles || [])
      .map((tv) => {
        const baseVehicle = allVehicles.find((v) => v.vtype === tv.vehicleType);
        if (!baseVehicle) return null;

        const v = structuredClone(baseVehicle);

        v.vehicleName = tv.vehicleName || "Vehicle";

        v.weapons = (tv.weapons || [])
          .map((w) => {
            const baseW = allWeapons.find((x) => x.wtype === w.weaponType);
            return baseW
              ? {
                  weapon: structuredClone(baseW),
                  facing: w.facing,
                  location: w.location,
                }
              : null;
          })
          .filter(Boolean);

        v.upgrades = (tv.upgrades || [])
          .map((u) =>
            structuredClone(allUpgrades.find((x) => x.utype === u.upgradeType)),
          )
          .filter(Boolean);

        v.perks = (tv.perks || [])
          .map((p) =>
            structuredClone(allPerks.find((x) => x.ptype === p.perkType)),
          )
          .filter(Boolean);

        v.trailer = allTrailers.find((t) => t.ttype === tv.trailer) || "None";
        v.cargo = allCargos.find((c) => c.ctype === tv.cargo) || "None";

        return v;
      })
      .filter(Boolean);

    return team;
  });

  if (state.teams.length === 0) {
    state.teams.push(createTeam());
  }

  state.currentTeamIndex = 0;

  render();
}

function startPrint() {
  window.print();
}

render();

document.getElementById("addTeamButton").addEventListener("click", addTeam);
document.getElementById("saveButton").addEventListener("click", saveToFile);
document.getElementById("loadButton").addEventListener("click", loadFromDialog);
document
  .getElementById("fallbackLoadInput")
  .addEventListener("change", loadFromFileInput);
document
  .getElementById("closePrintButton")
  .addEventListener("click", closePrintPreview);
document.getElementById("printButton").addEventListener("click", startPrint);
