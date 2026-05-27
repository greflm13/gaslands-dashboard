/* ===============================
   ENGINE + UI (FULL INTEGRATION)
================================ */
let printMode = false;
let team = [];

const sponsorSelect = document.getElementById("sponsorSelect");

allSponsors.forEach((s) => {
  let o = document.createElement("option");
  o.value = s.name;
  o.textContent = s.name;
  sponsorSelect.appendChild(o);
});

function getSponsor() {
  return sponsorSelect.value;
}

/* ===============================
   HELPERS
================================ */

function openPrintPreview() {
  printMode = true;
  render();
}

function closePrintPreview() {
  printMode = false;
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

/* ===============================
   VEHICLE STATS
================================ */

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
    return [v.trailer]; // fixed
  }

  return allTrailers;
}

function computeStats(v) {
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

/* ===============================
   WEAPON LOGIC
================================ */

function weaponAttack(v, w) {
  if (
    w.wtype === "Mortar" &&
    v.upgrades.some((u) => u.utype === "Cluster Bombs")
  ) {
    return w.attack + "/2D6";
  }
  return w.attack;
}

function weaponRange(v, w) {
  if (
    w.attackType === "Dropped" &&
    v.upgrades.some((u) => u.utype === "Improvised Sludge Thrower")
  ) {
    return "Medium/" + w.range;
  }
  return w.range;
}

function weaponSlots(v, w) {
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

function weaponRules(v, w) {
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

/* ===============================
   FACINGS
================================ */

function allowedFacings(v, w) {
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

/* ===============================
   TURRET COST (IDENTICAL LOGIC)
================================ */

function weaponCost(v, entry) {
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

/* ===============================
   UPGRADE COST
================================ */

function upgradeCost(v, u, sponsor) {
  let c = u.cost;

  if (u.utype === "Nitro Booster" && sponsor === "Idris") c /= 2;
  if (u.utype === "Extra Crewmember" && sponsor === "Scarlett") c /= 2;

  return c;
}

function allowedUpgradesFull(v, sponsor) {
  return allUpgrades.filter((u) => {
    // sponsor restriction
    if (
      u.allowedSponsors &&
      u.allowedSponsors.length > 0 &&
      !u.allowedSponsors.includes(sponsor)
    ) {
      return false;
    }

    // ===== ORIGINAL VEHICLE RESTRICTIONS =====

    // Nitro not allowed if Jet Engine
    if (u.utype === "Nitro Booster" && v.keywords?.includes("Jet Engine")) {
      return false;
    }

    // Prison Vehicle only Middle weight
    if (u.utype === "Prison Vehicle" && v.weight !== "Middle") {
      return false;
    }

    // Tank tracks restrictions
    if (
      u.utype === "Tank tracks" &&
      ["Helicopter", "Gyrocopter", "Tank"].includes(v.vtype)
    ) {
      return false;
    }

    // Extra crew limit
    if (u.utype === "Extra Crewmember") {
      let maxCrew = v.crew * 2;
      let currentCrew = computeStats(v).crew;

      if (currentCrew >= maxCrew) {
        return false;
      }
    }

    // limit property
    if (u.limit != null) {
      let count = v.upgrades.filter((x) => x.utype === u.utype).length;
      if (count >= u.limit) {
        return false;
      }
    }

    return true;
  });
}

/* ===============================
   PERKS
================================ */

function allowedPerks(v, sponsor) {
  let s = allSponsors.find((x) => x.name === sponsor);

  return allPerks.filter((p) => {
    if (!s.perkClasses.includes(p.class)) return false;

    if (p.ptype === "Stunt Driver") {
      return ["Light", "Middle"].includes(v.weight) && v.handling >= 3;
    }

    if (p.ptype === "Skiing") {
      return v.handling >= 3;
    }

    if (p.ptype === "Experimental Nuclear Engine") {
      return v.weight !== "Light";
    }

    return true;
  });
}

/* ===============================
   COST
================================ */

function vehicleCost(v, sponsor) {
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

/* ===============================
   SLOTS
================================ */

function usedSlots(v) {
  let ws = v.weapons.reduce((s, w) => {
    let val = weaponSlots(v, w.weapon);
    return s + (val === "-" ? 0 : val);
  }, 0);

  let us = v.upgrades.reduce((s, u) => s + (u.slots || 0), 0);

  return ws + us;
}

function totalSlots(v) {
  return v.slots + trailerSlots(v);
}

/* ===============================
   ACTIONS
================================ */

function addVehicle() {
  let v = structuredClone(defaultVehicle);
  v.name = "Vehicle";
  v.weapons = [];
  v.upgrades = [];
  v.perks = [];
  v.trailer = allTrailers[0];
  v.cargo = allCargos[0];

  team.push(v);
  render();
}

function removeVehicle(i) {
  team.splice(i, 1);
  render();
}

function changeVehicle(i, type) {
  let base = structuredClone(allVehicles.find((v) => v.vtype === type));
  base.name = team[i].name;
  base.weapons = team[i].weapons;
  base.upgrades = team[i].upgrades;
  base.perks = team[i].perks;
  team[i] = base;
  render();
}

function addWeapon(i) {
  let v = team[i];
  let sponsor = getSponsor();

  let sel = document.getElementById(`weaponSel_${i}`);
  let w = structuredClone(allWeapons.find((x) => x.wtype === sel.value));

  // ✅ calculate current slots
  let currentSlots = usedSlots(v);

  let newSlots = weaponSlots(v, w);

  let slotValue = newSlots === "-" ? 0 : newSlots;

  if (currentSlots + slotValue > totalSlots(v)) {
    alert("Not enough slots");
    return;
  }

  v.weapons.push({
    weapon: w,
    facing: allowedFacings(v, w)[0],
  });

  render();
}
function addUpgrade(i) {
  let v = team[i];
  let sponsor = getSponsor();

  let sel = document.getElementById(`upgradeSel_${i}`);
  let u = structuredClone(allUpgrades.find((x) => x.utype === sel.value));

  // ✅ calculate weapon slot usage
  let weaponSlotTotal = v.weapons.reduce((sum, w) => {
    let val = weaponSlots(v, w.weapon);
    return sum + (val === "-" ? 0 : val);
  }, 0);

  // ✅ calculate upgrade slot usage
  let upgradeSlotTotal = v.upgrades.reduce((sum, upg) => {
    return sum + (upg.slots || 0);
  }, 0);

  let totalUsed = weaponSlotTotal + upgradeSlotTotal;

  if (totalUsed + (u.slots || 0) > totalSlots(v)) {
    alert("Not enough slots");
    return;
  }

  v.upgrades.push(u);
  render();
}

function addPerk(i) {
  let v = team[i];
  let sponsor = getSponsor();

  let options = allowedPerks(v, sponsor);

  // ✅ no perks available → do nothing
  if (!options || options.length === 0) {
    return;
  }

  let sel = document.getElementById(`perkSel_${i}`);

  let p = allPerks.find((x) => x.ptype === sel.value);

  // ✅ guard invalid selection
  if (!p) {
    return;
  }

  // ✅ enforce duplicate restriction
  if (v.perks.some((pp) => pp.ptype === p.ptype)) {
    return;
  }

  v.perks.push(p);

  render();
}

function allowedWeaponsFull(v, sponsor) {
  return allWeapons.filter((w) => {
    // ✅ Sponsor restriction
    if (
      w.allowedSponsors &&
      w.allowedSponsors.length > 0 &&
      !w.allowedSponsors.includes(sponsor)
    ) {
      return false;
    }

    // ✅ Exploding Ram restriction
    if (w.wtype === "Exploding Ram" && v.weight === "Light") {
      return false;
    }

    // ✅ Limit enforcement (safe!)
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

/* ===============================
   RENDER
================================ */

function render() {
  let editDiv = document.getElementById("editDiv");
  let printDiv = document.getElementById("printDiv");
  let headerDiv = document.getElementById("headerDiv");

  if (printMode) {
    editDiv.style.display = "none";
    printDiv.style.display = "block";
    headerDiv.style.display = "none";
  } else {
    editDiv.style.display = "block";
    printDiv.style.display = "none";
    headerDiv.style.display = "block";
  }

  editDiv.innerHTML = "";

  let sponsor = getSponsor();
  let total = 0;

  team.forEach((v, i) => {
    let stats = computeStats(v);

    let trailerOptions = allowedTrailers(v, sponsor)
      .map(
        (t) =>
          `<option ${t.ttype === v.trailer?.ttype ? "selected" : ""}>${t.ttype}</option>`,
      )
      .join("");

    let cargoOptions = allowedCargo(v, sponsor)
      .map(
        (c) =>
          `<option ${c.ctype === v.cargo?.ctype ? "selected" : ""}>${c.ctype}</option>`,
      )
      .join("");

    // fix illegal facings automatically
    v.weapons.forEach((w) => {
      let allowed = allowedFacings(v, w.weapon);
      if (!allowed.includes(w.facing)) w.facing = allowed[0];
    });

    let cost = vehicleCost(v, sponsor);
    total += cost;

    let div = document.createElement("div");

    let wRows = v.weapons
      .map(
        (w, wi) => `
      <tr>
        <td>${w.weapon.wtype}</td>
        <td>
          <select onchange="team[${i}].weapons[${wi}].facing=this.value;render();">
            ${allowedFacings(v, w.weapon)
              .map(
                (f) =>
                  `<option ${f === w.facing ? "selected" : ""}>${f}</option>`,
              )
              .join("")}
          </select>
        </td>
        <td>${w.weapon.attackType}</td>
        <td>${weaponAttack(v, w.weapon)}</td>
        <td>${weaponRange(v, w.weapon)}</td>
        <td>${weaponRules(v, w.weapon)}</td>
        <td>${weaponAmmo(v, w.weapon, sponsor)}</td>
        <td>${weaponSlots(v, w.weapon)}</td>
        <td>${format0(weaponCost(v, w))}</td>
        <td><button onclick="team[${i}].weapons.splice(${wi},1);render()">X</button></td>
      </tr>
    `,
      )
      .join("");

    let uRows = v.upgrades
      .map(
        (u, ui) => `
      <tr>
        <td>${u.utype}</td>
        <td>${format0(u.ammo)}</td>
        <td>${format0(u.slots)}</td>
        <td>${u.specialRules || ""}</td>
        <td>${format0(upgradeCost(v, u, sponsor))}</td>
        <td><button onclick="team[${i}].upgrades.splice(${ui},1);render()">X</button></td>
      </tr>
    `,
      )
      .join("");

    let pRows = v.perks
      .map(
        (p, pi) => `
      <tr>
        <td>${p.ptype}</td>
        <td>${p.rules}</td>
        <td>${format0(p.cost)}</td>
        <td><button onclick="team[${i}].perks.splice(${pi},1);render()">X</button></td>
      </tr>
    `,
      )
      .join("");

    div.innerHTML = `
      <div>
        <input value="${v.name}" onchange="team[${i}].name=this.value"/>
        <select onchange="changeVehicle(${i},this.value)">
          ${allVehicles.map((x) => `<option ${x.vtype === v.vtype ? "selected" : ""}>${x.vtype}</option>`).join("")}
        </select>
        ${cost} cans
        <button onclick="removeVehicle(${i})">X</button>
      </div>

      <div>
        Weight: ${v.weight}weight |
        Hull: ${stats.hull} |
        Handling: ${stats.handling} |
        Max gear: ${stats.maxGear} |
        Crew: ${stats.crew} |
        Free slots: ${totalSlots(v) - usedSlots(v)}
      </div>

      <div>Keywords: ${getVehicleKeywords(v).join(", ")}</div>
      <div>
        Trailer:
        <select onchange="
          let t = allTrailers.find(x=>x.ttype===this.value);
          team[${i}].trailer = t;
          render();
        ">
          ${trailerOptions}
        </select>

        Cargo:
        <select onchange="
          let c = allCargos.find(x=>x.ctype===this.value);
          team[${i}].cargo = c;
          render();
        ">
          ${cargoOptions}
        </select>
      </div>
      <table>
        <tr>
          <th>Weapon</th><th>Facing</th><th>Type</th><th>Attack</th>
          <th>Range</th><th>Rules</th><th>Ammo</th><th>Slots</th><th>Cost</th><th></th>
        </tr>

        <tr>
          <td>Handgun</td><td>360</td><td>Shooting</td>
          <td>1D6</td><td>Medium</td><td>Blitz</td>
          <td>-</td><td>-</td><td>-</td><td></td>
        </tr>

        ${wRows}
      </table>

      <select id="weaponSel_${i}">
        ${allowedWeaponsFull(v, sponsor)
          .map((w) => `<option>${w.wtype}</option>`)
          .join("")}
      </select>
      <button onclick="addWeapon(${i})">+</button>

      <table>
        <tr><th>Upgrade</th><th>Ammo</th><th>Slots</th><th>Rules</th><th>Cost</th><th></th></tr>
        ${uRows}
      </table>

      <select id="upgradeSel_${i}">
        ${allowedUpgradesFull(v, sponsor)
          .map((u) => `<option>${u.utype}</option>`)
          .join("")}
      </select>

      <button onclick="addUpgrade(${i})">+</button>

      <table>
        <tr><th>Perk</th><th>Rules</th><th>Cost</th><th></th></tr>
        ${pRows}
      </table>
      
      ${
        allowedPerks(v, sponsor).length > 0
          ? `
          <select id="perkSel_${i}">
            ${allowedPerks(v, sponsor)
              .map((p) => `<option>${p.ptype}</option>`)
              .join("")}
          </select>
          <button onclick="addPerk(${i})">+</button>
          `
          : `<div class="small">No perks available</div>`
      }`;

    editDiv.appendChild(div);
  });

  document.getElementById("totalCost").textContent = total;

  printDiv.innerHTML = `
    <button class="noprint" onclick="closePrintPreview()">Close</button>
    <button class="noprint" onclick="window.print()">Print</button>
  `;

  team.forEach((v) => {
    let stats = computeStats(v);
    let cost = vehicleCost(v, sponsor);

    let wRows = v.weapons
      .map(
        (w) => `
      <tr>
        <td>${w.weapon.wtype}</td>
        <td>${w.facing}</td>
        <td>${weaponRange(v, w.weapon)}</td>
        <td>${weaponAttack(v, w.weapon)}</td>
        <td>${weaponAmmo(v, w.weapon, getSponsor())}</td>
        <td>${weaponRules(v, w.weapon)}</td>
      </tr>
    `,
      )
      .join("");

    let uList = v.upgrades.map((u) => u.utype).join(", ");
    let pList = v.perks.map((p) => p.ptype).join(", ");

    let block = document.createElement("div");

    block.className = "printCard";

    block.innerHTML = `
      <h2>${v.name}</h2>

      <div>
        ${v.weight}weight | Hull ${stats.hull} |
        Handling ${stats.handling} |
        Gear ${stats.maxGear} |
        Crew ${stats.crew} |
        Cost ${cost} cans
      </div>

      <table>
        <tr>
          <th>Weapon</th>
          <th>Facing</th>
          <th>Range</th>
          <th>Attack</th>
          <th>Ammo</th>
          <th>Rules</th>
        </tr>

        <tr>
          <td>Handgun</td>
          <td>360</td>
          <td>Medium</td>
          <td>1D6</td>
          <td>-</td>
          <td>Blitz</td>
        </tr>

        ${wRows}
      </table>

      <div><b>Upgrades:</b> ${uList || "-"}</div>
      <div><b>Perks:</b> ${pList || "-"}</div>
    `;

    printDiv.appendChild(block);
  });
}

function serializeTeam() {
  return JSON.stringify(
    {
      team: team.map((v) => ({
        name: v.name,
        vtype: v.vtype,
        weapons: v.weapons.map((w) => ({
          wtype: w.weapon.wtype,
          facing: w.facing,
        })),
        upgrades: v.upgrades.map((u) => ({
          utype: u.utype,
        })),
        perks: v.perks.map((p) => ({
          ptype: p.ptype,
        })),
        trailer: v.trailer?.ttype || "None",
        cargo: v.cargo?.ctype || "None",
      })),
      sponsor: getSponsor(),
    },
    null,
    2,
  );
}

function saveToFile() {
  let data = serializeTeam();

  let blob = new Blob([data], { type: "application/json" });
  let url = URL.createObjectURL(blob);

  let a = document.createElement("a");
  a.href = url;
  a.download = "gaslands_team.json";

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
}

function loadFromFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    const data = JSON.parse(e.target.result);

    // restore sponsor
    if (data.sponsor) {
      sponsorSelect.value = data.sponsor;
    }

    // rebuild team
    team = (data.team || [])
      .map((tv) => {
        const baseVehicle = allVehicles.find((v) => v.vtype === tv.vtype);
        if (!baseVehicle) return null;

        const v = structuredClone(baseVehicle);

        v.name = tv.name || "Vehicle";

        v.weapons = (tv.weapons || [])
          .map((w) => {
            const baseW = allWeapons.find((x) => x.wtype === w.wtype);
            if (!baseW) return null;

            return {
              weapon: structuredClone(baseW),
              facing: w.facing || "Front",
            };
          })
          .filter(Boolean);

        v.upgrades = (tv.upgrades || [])
          .map((u) => {
            const baseU = allUpgrades.find((x) => x.utype === u.utype);
            return baseU ? structuredClone(baseU) : null;
          })
          .filter(Boolean);

        v.perks = (tv.perks || [])
          .map((p) => {
            const baseP = allPerks.find((x) => x.ptype === p.ptype);
            return baseP ? structuredClone(baseP) : null;
          })
          .filter(Boolean);

        v.trailer =
          allTrailers.find((t) => t.ttype === tv.trailer) || allTrailers[0];
        v.cargo = allCargos.find((c) => c.ctype === tv.cargo) || allCargos[0];

        return v;
      })
      .filter(Boolean);

    render();
  };

  reader.readAsText(file);
}

render();
