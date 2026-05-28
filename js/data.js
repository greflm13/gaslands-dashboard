export const allVehicles = [
  {
    vtype: "Buggy",
    weight: "Light",
    hull: 6,
    handling: 4,
    maxGear: 6,
    slots: 2,
    crew: 2,
    cost: 6,
    keywords: ["Roll cage"],
    ruleset: "BASE",
  },
  {
    vtype: "Car",
    weight: "Middle",
    hull: 10,
    handling: 3,
    maxGear: 5,
    slots: 2,
    crew: 2,
    cost: 12,
    keywords: [],
    ruleset: "BASE",
  },
  {
    vtype: "Performance Car",
    weight: "Middle",
    hull: 8,
    handling: 4,
    maxGear: 6,
    slots: 2,
    crew: 1,
    cost: 15,
    keywords: ["Slip away"],
    ruleset: "BASE",
  },
  {
    vtype: "Truck",
    weight: "Middle",
    hull: 12,
    handling: 2,
    maxGear: 4,
    slots: 3,
    crew: 3,
    cost: 15,
    keywords: [],
    ruleset: "BASE",
  },
  {
    vtype: "Heavy Truck",
    weight: "Heavy",
    hull: 14,
    handling: 2,
    maxGear: 3,
    slots: 5,
    crew: 4,
    cost: 25,
    keywords: [],
    ruleset: "BASE",
  },
  {
    vtype: "Bus",
    weight: "Heavy",
    hull: 16,
    handling: 2,
    maxGear: 3,
    slots: 3,
    crew: 8,
    cost: 30,
    keywords: [],
    ruleset: "BASE",
  },

  {
    vtype: "Drag Racer",
    weight: "Light",
    hull: 4,
    handling: 4,
    maxGear: 6,
    slots: 2,
    crew: 1,
    cost: 5,
    keywords: ["Jet Engine"],
    ruleset: "BASE",
  },
  {
    vtype: "Bike",
    weight: "Light",
    hull: 4,
    handling: 5,
    maxGear: 6,
    slots: 1,
    crew: 1,
    cost: 5,
    keywords: ["Full throttle", "Pivot"],
    ruleset: "BASE",
  },
  {
    vtype: "Bike with Sidecar",
    weight: "Light",
    hull: 4,
    handling: 5,
    maxGear: 6,
    slots: 2,
    crew: 2,
    cost: 8,
    keywords: ["Full throttle", "Pivot"],
    ruleset: "BASE",
  },
  {
    vtype: "Ice Cream Truck",
    weight: "Middle",
    hull: 10,
    handling: 2,
    maxGear: 4,
    slots: 2,
    crew: 2,
    cost: 8,
    keywords: ["Infuriating Jingle"],
    ruleset: "BASE",
  },
  {
    vtype: "Gyrocopter",
    weight: "Middle",
    hull: 4,
    handling: 4,
    maxGear: 6,
    slots: 0,
    crew: 1,
    cost: 10,
    keywords: ["Airwolf", "Airborne", "Bombs away"],
    ruleset: "BASE",
  },
  {
    vtype: "Ambulance",
    weight: "Middle",
    hull: 12,
    handling: 2,
    maxGear: 5,
    slots: 3,
    crew: 3,
    cost: 20,
    keywords: ["Uppers", "Downers"],
    ruleset: "BASE",
  },
  {
    vtype: "Monster Truck",
    weight: "Heavy",
    hull: 10,
    handling: 3,
    maxGear: 4,
    slots: 2,
    crew: 2,
    cost: 25,
    keywords: ["All terrain", "Up and Over"],
    ruleset: "BASE",
  },
  {
    vtype: "Helicopter",
    weight: "Heavy",
    hull: 8,
    handling: 3,
    maxGear: 4,
    slots: 4,
    crew: 3,
    cost: 30,
    keywords: ["Airwolf", "Airborne", "Bombs away"],
    ruleset: "BASE",
  },
  {
    vtype: "Tank",
    weight: "Heavy",
    hull: 20,
    handling: 4,
    maxGear: 3,
    slots: 4,
    crew: 3,
    cost: 40,
    keywords: ["All terrain", "Up and Over", "Pivot", "Turret"],
    ruleset: "BASE",
  },
  {
    vtype: "War Rig",
    weight: "Heavy",
    hull: 26,
    handling: 2,
    maxGear: 4,
    slots: 5,
    crew: 5,
    cost: 40,
    keywords: ["Articulated", "Ponderous", "Piledriver"],
    ruleset: "BASE",
  },
];
allVehicles.forEach(
  (v) =>
    (v.optionText =
      v.vtype + (v.ruleset != "BASE" ? " (" + v.ruleset + ")" : "")),
);
export const defaultVehicle = allVehicles.filter((v) => v.vtype == "Car")[0];

export const allTrailers = [
  { ttype: "None", slots: 0, cost: 0 },
  { ttype: "Lightweight", slots: 0, cost: 4 },
  { ttype: "Middleweight", slots: 1, cost: 8 },
  { ttype: "Heavyweight", slots: 3, cost: 12 },
];

export const vehicleKeywords = [
  {
    ktype: "Airborne",
    phase: "Play",
    rules:
      "This Vehicle ignores obstructions, dropped weapons and terrain at all times; except that this vehicle may target other vehicles in its attack step. Other vehicles ignore this vehicle at all times, except that other vehicles may target this vehicle during their attack steps. This vehicle cannot be involved in collisions.",
    ruleset: "BASE",
  },
  {
    ktype: "Airwolf",
    phase: "Play",
    rules:
      "At the start of this vehicle's activation, this vehicle may make a single pivot about its centre point, up to 90 degrees",
    ruleset: "BASE",
  },
  {
    ktype: "All terrain",
    phase: "Play",
    rules:
      "This vehicle may ignore the penalties for rough and treacherous surfaces.",
    ruleset: "BASE",
  },
  {
    ktype: "Articulated",
    phase: "Play",
    rules: "* see War Rig rules.",
    ruleset: "BASE",
  },
  {
    ktype: "Bombs away",
    phase: "Build",
    rules:
      "When purchasing weapons, this vehicle may count dropped weapons as requiring 0 build slots.",
    ruleset: "BASE",
  },
  {
    ktype: "Downers",
    phase: "Play",
    rules:
      "When this vehicle declares a SMASH ATTACK during its activation remove 2 hazard tokens from the target vehicle, and then reduce the target vehicle's crew value by 1 until the end of the phase.",
    ruleset: "BASE",
  },
  {
    ktype: "Full throttle",
    phase: "Play",
    rules:
      "This vehicle considers the long straight maneuver template to be permitted in any gear. The long straight is not considered either hazardous or trivial in any gear",
    ruleset: "BASE",
  },
  {
    ktype: "Infuriating Jingle",
    phase: "Play",
    rules:
      "Vehicles that target this vehicle with a SMASH ATTACK during a collision receive no hazard tokens during step 6 of the collision resolution.",
    ruleset: "BASE",
  },
  {
    ktype: "Jet Engine",
    phase: "Play",
    rules:
      "A vehicle with a jet engine counts as having a Nitro Booster with infinite ammo tokens. This vehicle automatically explodes when it is wrecked. A vehicle with a jet engine must use the Nitro Booster every time it activates.",
    ruleset: "BASE",
  },
  {
    ktype: "Piledriver",
    phase: "Play",
    rules: "* see War Rig rules",
    ruleset: "BASE",
  },
  {
    ktype: "Pivot",
    phase: "Play",
    rules:
      "At the start of this vehicle's activation, if this vehicle's current gear is 1, this vehicle may make a pivot about its centre to face any direction This pivot cannot cause a collision, and cannot leave this vehicle touching an obstruction.",
    ruleset: "BASE",
  },
  {
    ktype: "Ponderous",
    phase: "Play",
    rules: "* see War Rig rules.",
    ruleset: "BASE",
  },
  {
    ktype: "Roll cage",
    phase: "Play",
    rules:
      "When this vehicle suffers a flip, this vehicle may choose to ignore the 2 hits received from the Flip.",
    ruleset: "BASE",
  },
  {
    ktype: "Slip away",
    phase: "Play",
    rules:
      "If this vehicle is targeted with a tailgate, T-bone or sideswipe smash attack, and this vehicle declares evade as its reaction, this vehicle may perform a free activation immediately after the active vehicle completes its activation. This free activation does not count as the vehicle's activation this gear phase.",
    ruleset: "BASE",
  },
  {
    ktype: "Turret",
    phase: "Play",
    rules:
      "This vehicle may count one weapon as turret-mounted without paying for the upgrade.",
    ruleset: "BASE",
  },
  {
    ktype: "Up and Over",
    phase: "Play",
    rules:
      "After resolving a collision with an obstruction of a lower weight class during movement step 1.7, this vehicle may declare a Up and Over to ignore the obstruction for the remainder of its movement step, as it drives right over the top of it. This vehicle cannot declare a Up and Over against another vehicle with the Up and Over special rule.",
    ruleset: "BASE",
  },
  {
    ktype: "Uppers",
    phase: "Play",
    rules:
      "If this vehicle is involved in a collision in which both vehicles declare an evade, both vehicles must declare a single stick-shift up immediately after the collision is resolved (gaining a hazard token as per the normal stick-shift rules). If either vehicle is already at its max gear, the stick-shift does not affect that vehicle's current gear, but that vehicle does gain a hazard token.",
    ruleset: "BASE",
  },
];

export const handgun = {
  wtype: "Handgun",
  attackType: "Shooting",
  attack: "1D6",
  range: "Medium",
  slots: "-",
  ammo: "-",
  specialRules: "Blitz",
  crewFired: "Yes",
  cost: "-",
  allowedSponsors: [],
  ruleset: "BASE",
  limit: null,
}; // always picked and available
export const allWeapons = [
  // basic weapons
  {
    wtype: "Machine Gun",
    attackType: "Shooting",
    attack: "2D6",
    range: "Double",
    slots: 1,
    ammo: 0,
    specialRules: "",
    crewFired: false,
    cost: 2,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Heavy Machine Gun",
    attackType: "Shooting",
    attack: "3D6",
    range: "Double",
    slots: 1,
    ammo: 0,
    specialRules: "",
    crewFired: false,
    cost: 3,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Mini-Gun",
    attackType: "Shooting",
    attack: "4D6",
    range: "Double",
    slots: 1,
    ammo: 0,
    specialRules: "",
    crewFired: false,
    cost: 5,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  // advanced
  {
    wtype: "125mm Cannon",
    attackType: "Shooting",
    attack: "8D6",
    range: "Double",
    slots: 3,
    ammo: 3,
    specialRules: "Blast, +2 hazard if not Tank",
    crewFired: false,
    cost: 6,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Arc Lightning Projector",
    attackType: "Shooting",
    attack: "6D6",
    range: "Double",
    slots: 2,
    ammo: 1,
    specialRules: "Arc chain in short range",
    crewFired: false,
    cost: 6,
    allowedSponsors: ["Mishkin"],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Bazooka",
    attackType: "Shooting",
    attack: "3D6",
    range: "Double",
    slots: 2,
    ammo: 3,
    specialRules: "Blast",
    crewFired: false,
    cost: 4,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "BFG",
    attackType: "Shooting",
    attack: "10D6",
    range: "Double",
    slots: 3,
    ammo: 1,
    specialRules: "Medium straight backwards, gear=1, haazards +3 ",
    crewFired: false,
    cost: 1,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Combat Laser",
    attackType: "Shooting",
    attack: "3D6",
    range: "Double",
    slots: 1,
    ammo: 0,
    specialRules: "Splash",
    crewFired: false,
    cost: 5,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Death Ray",
    attackType: "Shooting",
    attack: "3D6",
    range: "Double",
    slots: 1,
    ammo: 1,
    specialRules: "5+ un-cancelled hits removes target from play",
    crewFired: false,
    cost: 3,
    allowedSponsors: ["Mishkin"],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Flamethrower",
    attackType: "Shooting",
    attack: "6D6",
    range: "Large Burst",
    slots: 2,
    ammo: 3,
    specialRules: "Splash, Fire. Indirect",
    crewFired: false,
    cost: 4,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Grabber Arm",
    attackType: "Shooting",
    attack: "3D6",
    range: "Short",
    slots: 1,
    ammo: 0,
    specialRules: "Toss",
    crewFired: false,
    cost: 6,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Grav Gun",
    attackType: "Shooting",
    attack: "3D6*",
    range: "Double",
    slots: 1,
    ammo: 1,
    specialRules: "Electrical. Gravity Manipulation",
    crewFired: false,
    cost: 2,
    allowedSponsors: ["Mishkin"],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Harpoon",
    attackType: "Shooting",
    attack: "5D6*",
    range: "Double",
    slots: 1,
    ammo: 0,
    specialRules: "Harpoon",
    crewFired: false,
    cost: 2,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Kinetic Super Booster",
    attackType: "Shooting",
    attack: "(6D6)",
    range: "Double",
    slots: 2,
    ammo: 1,
    specialRules: "Gear +1 instead of damage",
    crewFired: false,
    cost: 6,
    allowedSponsors: ["Mishkin"],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Magnetic Jammer",
    attackType: "Shooting",
    attack: "-",
    range: "Double",
    slots: 0,
    ammo: 0,
    specialRules: "Target can't use ammo next activation",
    crewFired: false,
    cost: 2,
    allowedSponsors: ["Mishkin"],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Mortar",
    attackType: "Shooting",
    attack: "4D6",
    range: "Double",
    slots: 1,
    ammo: 3,
    specialRules: "Indirect",
    crewFired: false,
    cost: 4,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Rockets",
    attackType: "Shooting",
    attack: "6D6",
    range: "Double",
    slots: 2,
    ammo: 3,
    specialRules: "",
    crewFired: false,
    cost: 5,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Thumper",
    attackType: "Shooting",
    attack: "-",
    range: "Medium",
    slots: 2,
    ammo: 1,
    specialRules: "Indirect. Targets make gear+2 (max 6) flip check",
    crewFired: false,
    cost: 4,
    allowedSponsors: ["Mishkin"],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Wall Of Amplifiers",
    attackType: "Shooting",
    attack: "-",
    range: "Medium",
    slots: 3,
    ammo: 0,
    specialRules: "*See rules",
    crewFired: false,
    cost: 4,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Wreck Lobber",
    attackType: "Shooting",
    attack: "-",
    range: "Double/Dropped",
    slots: 4,
    ammo: 3,
    specialRules: "*See rules, Low-loader, Dumper",
    crewFired: false,
    cost: 4,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Wrecking Ball",
    attackType: "Shooting",
    attack: "*",
    range: "Short",
    slots: 3,
    ammo: 0,
    specialRules: "Steel Ball",
    crewFired: false,
    cost: 2,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  // crew fired
  {
    wtype: "Blunderbuss",
    attackType: "Shooting",
    attack: "2D6",
    range: "Small Burst",
    slots: 0,
    ammo: 0,
    specialRules: "Splash",
    crewFired: true,
    cost: 2,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Gas Grenades",
    attackType: "Shooting",
    attack: "(1D6)",
    range: "Medium",
    slots: 0,
    ammo: 5,
    specialRules: "Blitz, Choking Gas, Indirect",
    crewFired: true,
    cost: 1,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Grenades",
    attackType: "Shooting",
    attack: "1D6",
    range: "Medium",
    slots: 0,
    ammo: 5,
    specialRules: "Blast, Indirect, Blitz",
    crewFired: true,
    cost: 1,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Magnum",
    attackType: "Shooting",
    attack: "1D6",
    range: "Double",
    slots: 0,
    ammo: 0,
    specialRules: "Blast",
    crewFired: true,
    cost: 3,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Molotov Cocktails",
    attackType: "Shooting",
    attack: "1D6",
    range: "Medium",
    slots: 0,
    ammo: 5,
    specialRules: "Fire, Indirect, Blitz",
    crewFired: true,
    cost: 1,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Shotgun",
    attackType: "Shooting",
    attack: "3/2/1D6",
    range: "Short/Medium/Long",
    slots: 0,
    ammo: 0,
    specialRules: "",
    crewFired: true,
    cost: 4,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Steel Nets",
    attackType: "Shooting",
    attack: "(3D6)",
    range: "Short",
    slots: 0,
    ammo: 0,
    specialRules: "Blast",
    crewFired: true,
    cost: 2,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Submachine Gun",
    attackType: "Shooting",
    attack: "3D6",
    range: "Medium",
    slots: 0,
    ammo: 0,
    specialRules: "",
    crewFired: true,
    cost: 5,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  // Dropped
  {
    wtype: "Caltrop Dropper",
    attackType: "Dropped",
    attack: "2D6",
    range: "Small Burst",
    slots: 1,
    ammo: 3,
    specialRules: "Treacherous, remains until damage is caused",
    crewFired: false,
    cost: 1,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Glue Dropper",
    attackType: "Dropped",
    attack: "-",
    range: "Large Burst",
    slots: 1,
    ammo: 1,
    specialRules: "Treacherous, gear -2",
    crewFired: false,
    cost: 1,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Mine Dropper",
    attackType: "Dropped",
    attack: "4D6",
    range: "Small Burst",
    slots: 1,
    ammo: 3,
    specialRules: "Blast",
    crewFired: false,
    cost: 1,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Napalm Dropper",
    attackType: "Dropped",
    attack: "4D6",
    range: "Small Burst",
    slots: 1,
    ammo: 3,
    specialRules: "Fire",
    crewFired: false,
    cost: 1,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Oil Slick Dropper",
    attackType: "Dropped",
    attack: "-",
    range: "Large Burst",
    slots: 0,
    ammo: 3,
    specialRules: "Treacherous",
    crewFired: false,
    cost: 2,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "RC Car Bombs",
    attackType: "Dropped",
    attack: "4D6",
    range: "Short",
    slots: 0,
    ammo: 3,
    specialRules: "Remote-Controlled Car",
    crewFired: false,
    cost: 3,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Sentry Gun",
    attackType: "Dropped",
    attack: "2D6",
    range: "Short/Medium",
    slots: 0,
    ammo: 3,
    specialRules: "Sentry Gun",
    crewFired: false,
    cost: 3,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Smoke Dropper",
    attackType: "Dropped",
    attack: "-",
    range: "Large Burst",
    slots: 0,
    ammo: 3,
    specialRules: "Provides cover",
    crewFired: false,
    cost: 1,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  // Smash Weapons
  {
    wtype: "Ram",
    attackType: "Smash",
    attack: "+2D6",
    range: "Smash",
    slots: 1,
    ammo: 0,
    specialRules: "No hazards gained during collisions on declared facing",
    crewFired: false,
    cost: 4,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: null,
  },
  {
    wtype: "Exploding Ram",
    attackType: "Smash",
    attack: "+6D6",
    range: "Smash",
    slots: 0,
    ammo: 1,
    specialRules: "Highly Explosive. Limit of 1",
    crewFired: false,
    cost: 3,
    allowedSponsors: [],
    ruleset: "BASE",
    limit: 1,
  },
];
allWeapons.forEach(
  (w) =>
    (w.optionText =
      w.wtype + (w.ruleset != "BASE" ? " (" + w.ruleset + ")" : "")),
);

export const thumperCargo = allWeapons.filter((w) => w.wtype == "Thumper")[0];

export const allLocations = ["Cab", "Trailer"]; // first element in array is the default

export const weaponKeywords = [];

export const allUpgrades = [
  {
    utype: "Armour Plating",
    slots: 1,
    ammo: 0,
    specialRules: "+2 Hull",
    cost: 4,
    keywords: [],
    limit: null,
    allowedSponsors: [],
    ruleset: "BASE",
  },
  {
    utype: "Experimental Nuclear Engine",
    slots: 0,
    ammo: 0,
    specialRules: "See rulebook",
    cost: 5,
    keywords: [],
    limit: 1,
    allowedSponsors: ["Mishkin"],
    ruleset: "BASE",
  },
  {
    utype: "Experimental Teleporter",
    slots: 0,
    ammo: 0,
    specialRules: "See rulebook",
    cost: 7,
    keywords: [],
    limit: 1,
    allowedSponsors: ["Mishkin"],
    ruleset: "BASE",
  },
  {
    utype: "Extra Crewmember",
    slots: 0,
    ammo: 0,
    specialRules: "+1 Crew, up to double starting crew",
    cost: 4,
    keywords: [],
    allowedSponsors: [],
    limit: null,
    ruleset: "BASE",
  },
  {
    utype: "Improvised Sludge Thrower",
    slots: 1,
    ammo: 0,
    specialRules:
      "This vehicle may place the burst templates for its dropped weapons anywhere within a 360 arc of fire that is at least partially within medium range of this vehicle.",
    cost: 2,
    keywords: [],
    limit: 1,
    allowedSponsors: [],
    ruleset: "BASE",
  },
  {
    utype: "Nitro Booster",
    slots: 0,
    ammo: 1,
    specialRules: "See rulebook",
    cost: 6,
    keywords: [],
    limit: null,
    allowedSponsors: [],
    ruleset: "BASE",
  },
  {
    utype: "Roll Cage",
    slots: 1,
    ammo: 0,
    specialRules: "May ignore hits received from Flips.",
    cost: 4,
    keywords: [],
    limit: 1,
    allowedSponsors: [],
    ruleset: "BASE",
  },
  {
    utype: "Tank tracks",
    slots: 1,
    ammo: 0,
    specialRules: "+1 Handing, -1 Max Gear, All terrain",
    cost: 4,
    keywords: ["All terrain"],
    limit: 1,
    allowedSponsors: [],
    ruleset: "BASE",
  },
  // sposor specific
  {
    utype: "Prison Vehicle",
    slots: 0,
    ammo: 0,
    specialRules: "See rulebook",
    cost: -4,
    keywords: [],
    limit: 1,
    allowedSponsors: ["The Warden"],
    ruleset: "BASE",
  },
  {
    utype: "Louder Siren",
    slots: 0,
    ammo: 0,
    specialRules:
      "Replace 'Bogey' with 'any enemy vehicle' for the purposes of the Siren special rules.",
    cost: 2,
    keywords: [],
    limit: 1,
    allowedSponsors: ["Highway Patrol"],
    ruleset: "BASE",
  },
  {
    utype: "MicroPlate Armour",
    slots: 0,
    ammo: 0,
    specialRules: "+2 hull",
    cost: 6,
    keywords: [],
    limit: null,
    allowedSponsors: ["Verney"],
    ruleset: "BASE",
  },
];
allUpgrades.forEach(
  (u) =>
    (u.optionText =
      u.utype + (u.ruleset != "BASE" ? " (" + u.ruleset + ")" : "")),
);

export const allCargos = [
  { ctype: "None", specialRules: null, keywords: [], ruleset: "BASE" },
  {
    ctype: "Peach Moonshine",
    specialRules:
      "This vehicle's molotov cocktail count as having an infinite number of ammo tokens",
    keywords: [],
    ruleset: "BASE",
  },
  {
    ctype: "Sourmash Jet Booster",
    specialRules:
      "At the end of this vehicle's movement step, if this vehicle has 5 or more hazard tokens, it must immediately make a long straight maneuver forward.",
    keywords: [],
    ruleset: "BASE",
  },
  {
    ctype: "Siphon Pump",
    specialRules:
      "At the start of this vehicle's attack step, regardless of whether it is distracted, this vehicle may take up to one hazard token from each car within short range of it and place it on this vehicle.",
    keywords: [],
    ruleset: "BASE",
  },
  {
    ctype: "Old Fashioned Corn Liquor",
    specialRules:
      "Whenever a vehicle within medium range of this vehicle gains one or more hazard tokens, it gains one additional hazard token.",
    keywords: [],
    ruleset: "BASE",
  },
  {
    ctype: "Cattle-Hammer",
    specialRules:
      "This vehicle may consider its current gear to be any value, up to this vehicle's max gear, during the wipe-out step, including during any collisions resolved during the wipe-out step",
    keywords: [],
    ruleset: "BASE",
  },
];
allCargos.forEach(
  (c) =>
    (c.optionText =
      c.ctype + (c.ruleset != "BASE" ? " (" + c.ruleset + ")" : "")),
);

export const allSponsors = [
  { name: "None", keywords: [], perkClasses: [], ruleset: "BASE" },
  {
    name: "Rutherford",
    keywords: [
      "Military hardware",
      "Well stocked",
      "Might is right",
      "Televised carnage",
    ],
    perkClasses: ["Badass", "Military"],
    ruleset: "BASE",
  },
  {
    name: "Miyazaki",
    keywords: ["Virtuoso", "Elegance", "Showing off"],
    perkClasses: ["Daring", "Precision"],
    ruleset: "BASE",
  },
  {
    name: "Mishkin",
    keywords: ["Thumpermonkey", "Dynamo", "All the toys"],
    perkClasses: ["Military", "Technology"],
    ruleset: "BASE",
  },
  {
    name: "Idris",
    keywords: ["N2O addict", "Speed demon", "Cult of speed", "Kiss my asphalt"],
    perkClasses: ["Precision", "Speed"],
    ruleset: "BASE",
  },
  {
    name: "Slime",
    keywords: ["Live fast", "Pinball", "Spiked Fist"],
    perkClasses: ["Tuning", "Reckless"],
    ruleset: "BASE",
  },
  {
    name: "The Warden",
    keywords: ["Prison cars", "Fireworks"],
    perkClasses: ["Aggression", "Badass"],
    ruleset: "BASE",
  },
  {
    name: "Scarlett",
    keywords: ["Crew Quarters", "Raiders", "Raise the Sails", "Press Gang"],
    perkClasses: ["Aggression", "Tuning"],
    ruleset: "BASE",
  },
  {
    name: "Highway Patrol",
    keywords: ["Hot Pursuit", "Bogey at 12 O'Clock", "Siren", "Steel Justice"],
    perkClasses: ["Speed", "Pursuit"],
    ruleset: "BASE",
  },

  {
    name: "Verney",
    keywords: [
      "MicroPlate Armour",
      "Trunk of Junk",
      "Tombstone",
      "That's Entertainment",
    ],
    perkClasses: ["Technology", "Built"],
    ruleset: "BASE",
  },
  {
    name: "Maxxine",
    keywords: ["Dizzy", "Maxximum Drift", "Meshuggah"],
    perkClasses: ["Tuning", "Pursuit"],
    ruleset: "BASE",
  },
  {
    name: "The Order of the Inferno",
    keywords: ["Fire Walk With Me", "Burning Man", "Cult Of Flame"],
    perkClasses: ["Horror", "Speed"],
    ruleset: "BASE",
  },
  {
    name: "Beverly",
    keywords: [
      "Graveyard Shift",
      "Ghost Rider",
      "Soul Anchor",
      "At The Crossroads",
      "Inexorable",
      "Soul Harvest",
    ],
    perkClasses: ["Horror", "Built"],
    ruleset: "BASE",
  },
  {
    name: "Rusty's Bootleggers",
    keywords: [
      "Party Hard",
      "Dutch courage",
      "As Straight As I'm Able",
      "Over The Limit",
      "Trailer Trash",
      "Haulage",
    ],
    perkClasses: ["Reckless", "Built"],
    ruleset: "BASE",
  },
];
allSponsors.forEach(
  (s) =>
    (s.optionText =
      s.name + (s.ruleset != "BASE" ? " (" + s.ruleset + ")" : "")),
);

export const sponsorKeywords = [
  {
    ktype: "Military hardware",
    phase: "Build",
    rules:
      "This team may purchase a single Tank. This team may purchase a single Helicopter.",
    ruleset: "BASE",
  },
  {
    ktype: "Well stocked",
    phase: "Build",
    rules:
      "This team considers any weapon with the ammo 3 special rule to instead have the ammo 4 special rule when purchased.",
    ruleset: "BASE",
  },
  {
    ktype: "Might is right",
    phase: "Build",
    rules: "This team may not purchase lightweight vehicles.",
    ruleset: "BASE",
  },
  {
    ktype: "Televised carnage",
    phase: "Play",
    rules:
      "If a vehicle in this team causes 6 or more hits in a single attack step, before evades, this team gains +1 audience vote.",
    ruleset: "BASE",
  },
  {
    ktype: "Virtuoso",
    phase: "Play",
    rules:
      "The first time each vehicle in this team uses push it in an activation they may push it without gaining a hazard token.",
    ruleset: "BASE",
  },
  //{ktype: "Evasive maneuvers", phase: "Play", rules: "Before making an evade roll, vehicles in this team may gain any number of hazard tokens to add +1 to each of their evade dice for each hazard token gained. A roll of a 1 on an evade dice always counts as a failure.", ruleset: "BASE"},
  {
    ktype: "Elegance",
    phase: "Build",
    rules:
      "Teams sponsored by Miyazaki may not purchase vehicle types with a base Handling value of 2 or lower",
    ruleset: "BASE",
  },
  {
    ktype: "Showing off",
    phase: "Play",
    rules:
      "At the end of this vehicle's activation, if it resolved at least one spin result, and resolved at least one slide result, and changed gear at least once, and did not wipeout, then this vehicle gains a 'Showing Off' token. If a vehicle with a 'Showing Off' token wipes out, that vehicle must discard its 'Showing Off' token. At the end of this vehicle's activation, if every in‐play vehicle on this team has a 'Showing Off' token, this player discards all 'Showing Off' tokens and gains 1 audience vote for each 'Showing Off' token discarded in this way. Discard all 'Showing Off' tokens at the end of the gear phase. ",
    ruleset: "BASE",
  },
  {
    ktype: "Thumpermonkey",
    phase: "Build",
    rules: "This team may purchase electrical weapons and upgrades",
    ruleset: "BASE",
  },
  {
    ktype: "Dynamo",
    phase: "Play",
    rules:
      "After activating in gear Phase 4, 5 or 6, this vehicle may add +1 ammo token to a single electrical weapon or upgrade on that vehicle.",
    ruleset: "BASE",
  },
  {
    ktype: "All the toys",
    phase: "Play",
    rules:
      "Whenever a vehicle in this team attacks with a named weapon that has not been attacked with by any vehicle during this game yet this team gains +1 audience vote,",
    ruleset: "BASE",
  },
  {
    ktype: "N2O addict",
    phase: "Build",
    rules: "This team may purchase the Nitro upgrade at half the listed cost",
    ruleset: "BASE",
  },
  {
    ktype: "Speed demon",
    phase: "Play",
    rules:
      "When this vehicle gains hazards as a result of the Nitro Booster, this vehicle only gains hazard tokens until it has 3 hazard tokens, rather than 5 hazard tokens.",
    ruleset: "BASE",
  },
  {
    ktype: "Cult of speed",
    phase: "Play",
    rules:
      "If this vehicle selects the long straight movement template (including when using the Nitro Booster upgrade) during gear phase 1, 2, or 3, this vehicle's controller gains 1 audience vote.",
    ruleset: "BASE",
  },
  {
    ktype: "Kiss my asphalt",
    phase: "Build",
    rules: "This team may not purchase Gyrocopters",
    ruleset: "BASE",
  },
  {
    ktype: "Live fast",
    phase: "Play",
    rules:
      "If a vehicle in this team begins the wipeout step with more hazard tokens than hull points during its own activation this team gains +1 audience vote",
    ruleset: "BASE",
  },
  {
    ktype: "Pinball",
    phase: "Play",
    rules:
      "If a vehicle in this team is involved in a collision during its movement step in which the point of contact on both vehicles is along their side edges and this vehicle declares a smash attack, then this vehicle may immediately resolve another movement step after the current movement step.",
    ruleset: "BASE",
  },
  {
    ktype: "Spiked Fist",
    phase: "Build",
    rules: "This vehicle counts the Ram upgrade as requiring zero build slots.",
    ruleset: "BASE",
  },
  {
    ktype: "Prison cars",
    phase: "Build",
    rules:
      "Reduce the cost of this vehicle by 4 Cans to a minimum of 5 Cans. Reduce the hull value of this vehicle by 2. May only be purchased by middleweight vehicles. May only be purchased once for each vehicle.",
    ruleset: "BASE",
  },
  {
    ktype: "Fireworks",
    phase: "Play",
    rules:
      "If a vehicle belonging to this team explodes, gain +1 audience vote if it was middleweight or +2 audience votes if it was heavyweight in addition to any votes gained for being wrecked, and then discard all ammo tokens from the wreck.",
    ruleset: "BASE",
  },
  {
    ktype: "Crew Quarters",
    phase: "Build",
    rules:
      "This team may purchase the Extra Crewmember upgrade at half the listed cost.",
    ruleset: "BASE",
  },
  {
    ktype: "Raiders",
    phase: "Play",
    rules:
      "At the end of the attack step, this vehicle may permanently reduce its crew value by any number, to a minimum of 0 crew: remove 1 hull point from any vehicle in base contact for each crew removed in this way.",
    ruleset: "BASE",
  },
  {
    ktype: "Raise the Sails",
    phase: "Play",
    rules:
      "After rolling skid dice, this vehicle may permanently reduce its crew value by 1, to a minimum of 0 crew to add 1 free shift result to the skid dice result.",
    ruleset: "BASE",
  },
  {
    ktype: "Press Gang",
    phase: "Play",
    rules:
      "When another vehicle in contact with this vehicle is wrecked, this vehicle may gain either 1 crew or 2 audience votes",
    ruleset: "BASE",
  },
  {
    ktype: "Hot Pursuit",
    phase: "Play",
    rules:
      "Before the first gear phase of the game, after deployment, this team must nominate one enemy vehicle as the 'Bogey'.",
    ruleset: "BASE",
  },
  {
    ktype: "Bogey at 12 O'Clock",
    phase: "Play",
    rules:
      "At the end of this vehicle's movement step, if the Bogey is in this vehicle's front arc of fire, in line of sight, and further than double range away, this vehicle may immediately resolve another movement step.",
    ruleset: "BASE",
  },
  {
    ktype: "Siren",
    phase: "Play",
    rules:
      "At the end of this vehicle's activation, if this vehicle in the Bogey's rear arc of fire (regardless of range), the Bogey must either reduce its gear by 1 or gain 2 hazards.",
    ruleset: "BASE",
  },
  {
    ktype: "Steel Justice",
    phase: "Play",
    rules:
      "If the Bogey wipes out this team as a whole gains 2 audience votes. If the Bogey is wrecked this team as a whole gains 4 audience votes.",
    ruleset: "BASE",
  },

  // Verney
  {
    ktype: "MicroPlate Armour",
    phase: "Build",
    rules:
      "Vehicles in this team may purchase the MicroPlate Armour upgrade, which costs 6 cans, grants +2 hull points, and requires 0 build slots",
    ruleset: "BASE",
  },
  {
    ktype: "Trunk of Junk",
    phase: "Play",
    rules:
      "You may attack with any number of dropped weapons in a single activation",
    ruleset: "BASE",
  },
  {
    ktype: "Tombstone",
    phase: "Play",
    rules:
      "If the shooting template of a shooting attack touches the rear edge of this vehicle, this vehicle gains +1 to its evade rolls. During this vehicle's  attack step, this vehicle may gain 2 hazards. If it does, all collisions involving this vehicle are considered to be head-on until the start of its next activation.",
    ruleset: "BASE",
  },
  {
    ktype: "That's Entertainment",
    phase: "Play",
    rules:
      "Whenever a dropped weapon template that was placed by this team is removed from play, this team gains 1 Audience Vote",
    ruleset: "BASE",
  },

  // Maxxine
  {
    ktype: "Dizzy",
    phase: "Play",
    rules:
      "This vehicle may resolve any number of spin results separately during its movement step, one after another. This can allow this vehicle to spin more than 90 degrees during its movement step.",
    ruleset: "BASE",
  },
  {
    ktype: "Maxximum Drift",
    phase: "Play",
    rules:
      "If this vehicle resolves two slide results in a single skid check, it may use the medium straight in place of the slide template. If this vehicle resolves three or more slide results in a single skid check, it may use the long straight in place of the slide template.",
    ruleset: "BASE",
  },
  {
    ktype: "Meshuggah",
    phase: "Play",
    rules:
      "When this vehicle resolve a slide or spin that ends within medium of a friendly vehicle without causing a collision: this team gains +1 Audience Vote.",
    ruleset: "BASE",
  },

  // The Flame Cult
  {
    ktype: "Fire Walk With Me",
    phase: "Play",
    rules:
      "When this vehicle receives damage from any weapon or effect with the Fire rule , this vehicle may reduce that damage by up to 3, to a minimum of 1",
    ruleset: "BASE",
  },
  {
    ktype: "Burning Man",
    phase: "Play",
    rules: "If this vehicle is On Fire it gains +1 to all evade dice.",
    ruleset: "BASE",
  },
  {
    ktype: "Cult Of Flame",
    phase: "Play",
    rules:
      "At the end of the gear phase, if there are more enemy vehicles on fire than there are friendly vehicles on fire, or all enemy vehicles are on fire, this team gains 1 audience vote for each friendly vehicle that is on fire.",
    ruleset: "BASE",
  },

  // Beverly
  {
    ktype: "Graveyard Shift",
    phase: "Play",
    rules:
      "At the start of the game, after deployment, all vehicle in this team except one must gain the 'Ghost Rider' special rule",
    ruleset: "BASE",
  },
  {
    ktype: "Ghost Rider",
    phase: "Play",
    rules:
      "This vehicle ignores and is ignored by other vehicles at all times. This vehicle cannot be involved in collisions. This vehicle may not make shooting attacks or be attacked with shooting weapons . This vehicle may never count towards the victory conditions of a scenario.",
    ruleset: "BASE",
  },
  {
    ktype: "Soul Anchor",
    phase: "Play",
    rules:
      "If all in play vehicles from this team have the Ghost Rider special rule immediately remove all vehicles on this team from play.",
    ruleset: "BASE",
  },
  {
    ktype: "At The Crossroads",
    phase: "Play",
    rules:
      "This team may choose to pay only 1 vote to respawn a vehicle. If they do, the respawned car must gain the 'Ghost Rider' special rule",
    ruleset: "BASE",
  },
  {
    ktype: "Inexorable",
    phase: "Play",
    rules:
      "If a vehicle from this team is a wreck or out of play, the vehicle may be respawned, even if other rules would ordinarily prevent that.",
    ruleset: "BASE",
  },
  {
    ktype: "Soul Harvest",
    phase: "Play",
    rules:
      "If this vehicle's movement template comes into contact with an enemy vehicle: this vehicle gains 1 Soul token, even if the enemy vehicle is being ignored. If this vehicle's movement template comes into contact with a friendly vehicle without the 'Ghost Rider' rule that it did not start in contact with, choose one: either gain 1 vote for each Soul token; or repair two Hull Points on the vehicle without the 'Ghost Rider' rule for each Soul token. Then discard all Soul tokens.",
    ruleset: "BASE",
  },

  // Rusty's Bootleggers
  {
    ktype: "Party Hard",
    phase: "Play",
    rules:
      "At the end of this vehicle's attack step, if this vehicle has more hazard tokens than the sum of the hazards tokens on all other enemy vehicles within medium range combined, this vehicle's controller gains +1 audience vote for each enemy vehicle with 1+ hazard tokens within medium range of this vehicle.",
    ruleset: "BASE",
  },
  {
    ktype: "Dutch courage",
    phase: "Play",
    rules: "Vehicles in this team only wipe out when they have 8 hazards.",
    ruleset: "BASE",
  },
  {
    ktype: "As Straight As I'm Able",
    phase: "Play",
    rules:
      "This vehicle does not gain a hazard from the articulated rule if it selects a template that is not a straight.",
    ruleset: "BASE",
  },
  {
    ktype: "Over The Limit",
    phase: "Play",
    rules:
      "This vehicle never considers any of the straight movement templates to be permitted. This vehicle considers veer to be permitted and trivial in any gear.",
    ruleset: "BASE",
  },
  {
    ktype: "Trailer Trash",
    phase: "Build",
    rules:
      "These team must contain at least one medium or heavyweight vehicle equipped with a trailer upgrade, or a War Rig.",
    ruleset: "BASE",
  },
  {
    ktype: "Haulage",
    phase: "Build",
    rules:
      "Each vehicle on this team equipped with a trailer upgrade, and each War Rig, may equip a single trailer cargo upgrade for free.",
    ruleset: "BASE",
  },
];

// combine all keywords into single, name indexed array
var tmpKeywords = vehicleKeywords.concat(sponsorKeywords);
var allKeywords = {};

for (var idx in tmpKeywords) {
  var kw = tmpKeywords[idx];
  allKeywords[kw.ktype] = kw;
}

export const allPerks = [
  {
    class: "Aggression",
    ptype: "Double-Barrelled",
    cost: 2,
    rules:
      "During the attack step, up to 3 crewmembers in this vehicle may gain a +1 bonus to hit when shooting with a handgun",
    shortRules: "Up to 3 handguns +1 to hit",
    ruleset: "BASE",
  },
  {
    class: "Aggression",
    ptype: "Boarding Party",
    cost: 2,
    rules:
      "This vehicle ignores the distracted rule. Crewmembers in this vehicle may attack during the attack step even if the vehicle is distracted.",
    shortRules: "Ignore distracted",
    ruleset: "BASE",
  },
  {
    class: "Aggression",
    ptype: "Battlehammer",
    cost: 4,
    rules:
      "When making a smash attack, this vehicle gains +1 attack dice for each hazard token it currently has.",
    shortRules: "+1 attack dice per hazard during smash attack",
    ruleset: "BASE",
  },
  {
    class: "Aggression",
    ptype: "Terrifying Lunatic",
    cost: 5,
    rules:
      "Whenever a vehicle controlled by another player ends its movement step within short range of this vehicle, the active vehicle gains a hazard token.",
    shortRules:
      "Other players vehicles gain +1 hazard if movement stops within short range",
    ruleset: "BASE",
  },
  {
    class: "Aggression",
    ptype: "Grinderman",
    cost: 5,
    rules:
      "Before this Vehicle rolls its attack dice in a smash attack, it may choose to add hazard tokens to the target vehicle for each damage it inflicts, instead of removing hull points.",
    shortRules:
      "Before smash attack may choose to add hazard tokens rather than hull damage",
    ruleset: "BASE",
  },
  {
    class: "Aggression",
    ptype: "Murder Tractor",
    cost: 5,
    rules: "This vehicle may make piledriver attacks, like a War Rig.",
    shortRules: "May use piledriver attack",
    ruleset: "BASE",
  },

  {
    class: "Badass",
    ptype: "Powder Keg",
    cost: 1,
    rules:
      "This vehicle may add +1 to its explosion check. Treat this vehicle as one weight-class heavier when it explodes. Note: this bonus does apply during resolution ot the FIREWORKS perk.",
    shortRules:
      "May add +1 to explosion check. Explosions are +1 weight class (does not affect FIREWORKS perk)",
    ruleset: "BASE",
  },
  {
    class: "Badass",
    ptype: "Crowd Pleaser",
    cost: 1,
    rules: "If this vehicle wipes out, gain +1 audience vote.",
    ruleset: "BASE",
  },
  {
    class: "Badass",
    ptype: "Road Warrior",
    cost: 2,
    rules:
      "Once per activation, if this vehicle has successfully causes one or more hits on an enemy vehicle at any point during this activation, this vehicle may remove a single hazard token at the end of its attack step. ",
    shortRules:
      "Once during activation, if at least 1 hit successful on enemy, -1 hazard tokens",
    ruleset: "BASE",
  },
  {
    class: "Badass",
    ptype: "Cover Me",
    cost: 2,
    rules:
      "Once during its activation this vehicle may remove a hazard token and place it on another friendly vehicle within double range",
    shortRules:
      "During activation, move hazard token to friendly vehicle with double range",
    ruleset: "BASE",
  },
  {
    class: "Badass",
    ptype: "Madman",
    cost: 3,
    rules:
      "At the end of this vehicle's Movement Step, if it has 4 or more hazard tokens, it may remove a hazard token and place it on another vehicle within medium range.",
    shortRules:
      "After activation. may move hazard token to vehicle in medium range if hazards 4+",
    ruleset: "BASE",
  },
  {
    class: "Badass",
    ptype: "Bullet-Time",
    cost: 3,
    rules:
      "If this vehicle resolves a slide result during its movement step, this may select one of its weapons to count as turret-mounted for the rest of the activation.",
    shortRules: "",
    ruleset: "BASE",
  },

  {
    class: "Built",
    ptype: "Dead Weight",
    cost: 2,
    rules:
      "During this vehicle's attack step, this vehicle may gain 2 hazards to count as one weight‐class heavier (unless already heavyweight) until the start of it's next activation. ",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Built",
    ptype: "Barrel Roll",
    cost: 2,
    rules:
      "When this vehicle suffers a flip, it may choose to place the flip template touching the centre of either side edge or the rear edge of this vehicle, and perpendicular to that edge, instead of touching the front edge as normal.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Built",
    ptype: "Bruiser",
    cost: 4,
    rules:
      "In a collision involving this vehicle, if this vehicle declares a reaction other than evade against an enemy vehicle, the enemy vehicle immediately gains one hazard token.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Built",
    ptype: "Splashback",
    cost: 5,
    rules:
      "Once per step, when this vehicle loses one or more hull points, make a 1D6 attack against each vehicle within medium range at end of that step.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Built",
    ptype: "Crusher",
    cost: 7,
    rules:
      "This vehicle gains the Up and Over special rule (see the Monster Truck rules).",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Built",
    ptype: "Feel No Pain",
    cost: 8,
    rules:
      "During an enemy vehicle's attack step, after an attacker has rolled all of their attack dice against this vehicle, if the attacks causes a total of 2 or fewer uncancelled hits, cancel all remaining hits.",
    shortRules: "",
    ruleset: "BASE",
  },

  {
    class: "Daring",
    ptype: "Chrome-Whisperer",
    cost: 2,
    rules:
      "This vehicle may push it any number of times during a single skid check, gaining 1 hazard token each time.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Daring",
    ptype: "Slippery",
    cost: 3,
    rules:
      "Vehicles making a smash attack targeting this vehicle suffer a penalty of -2 attack dice",
    shortRules: "Enemies suffer -2 attack dice during samsh attack",
    ruleset: "BASE",
  },
  {
    class: "Daring",
    ptype: "Handbreak Artist",
    cost: 3,
    rules:
      "When applying a spin result, this vehicle may choose to face any direction",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Daring",
    ptype: "Evasive",
    cost: 5,
    rules:
      "Before making an evade roll, this vehicle may gain any number of hazard tokens to add +1 to each of their evade dice for each hazard token gained. A roll of a '1' on an evade dice always counts as a failure.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Daring",
    ptype: "Powerslide",
    cost: 5,
    rules:
      "This vehicle may use any template except the long straight template instead of the slide template when applying a slide result. As with the movement step 1.1, you must use the first maneuver template you touch. Treat the selected maneuver template as a slide template for purposes of finding the vehicle's final position.",
    shortRules:
      "May use any template, except long straight, to resolve slide results",
    ruleset: "BASE",
  },
  {
    class: "Daring",
    ptype: "Stunt Driver",
    cost: 7,
    rules:
      "This perk may only be taken on a lightweight or middleweight vehicle type with a base handling value of 3 or more. This vehicle may choose to ignore any number of obstructions during its movement step. After any movement step in which this vehicle chooses to ignore any obstruction using this ability, this vehicle immediately gains 3 hazard tokens.",
    shortRules: "",
    ruleset: "BASE",
  },

  {
    class: "Horror",
    ptype: "Purifying Flames",
    cost: 1,
    rules:
      "Once per activation, at the start of this vehicle's activation, this vehicle may suffer up to 3 damage to repair one hull point on a friendly vehicle for each hull point removed by this effect. This damage counts as having the 'Fire' rule . This effect may not be used to raise a vehicle above its hull value. ",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Horror",
    ptype: "Ecstatic Visions",
    cost: 1,
    rules:
      "Once per activation, at the start of this vehicle's activation, this vehicle may elect to to gain up to 3 hazard tokens to discard one hazard token from a friendly vehicle for each hazard token gained.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Horror",
    ptype: "Sympathy For The Devil",
    cost: 1,
    rules:
      "When this vehicle makes an evade check, it's controller may select a friendly vehicle within medium range. Add the current gear of the selected vehicle to this vehicle's current gear for the purposes of this evade check. Both the selected vehicle and this vehicle suffer any unsaved damage from this attack, including any additional effects.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Horror",
    ptype: "Highway To Hell",
    cost: 2,
    rules:
      "At the end of its movement step, if this vehicle selected a straight template, this vehicle may suffer 2 damage. This damage counts as having the 'Fire' rule. If any hull points are removed by this effect, this vehicle may leave its movement template (ignoring any slide template) in play as a Napalm dropped weapon template. Remove this template at the start of this vehicle's next activation.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Horror",
    ptype: "Violent Manifestation",
    cost: 3,
    rules:
      "When this vehicle is respawned: make an immediate attack (with attack dice based on the weight of the respawned vehicle) against every other vehicle within medium range. This explosion counts as having both the 'Blast' and 'Fire' rules.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Horror",
    ptype: "Angel of Death",
    cost: 4,
    rules:
      "Before making an attack, this vehicle may elect to suffer up to three damage to add that many attack dice to a single weapon used in this attack.",
    shortRules: "",
    ruleset: "BASE",
  },

  {
    class: "Military",
    ptype: "Dead-Eye",
    cost: 2,
    rules:
      "During this vehicle's attack step this vehicle may gain a +1 bonus to hit if making a shooting attack at a target within double range and not within medium range. Critical hits still occur only on the natural roll of a 6.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Military",
    ptype: "Loader",
    cost: 2,
    rules:
      "At the start of its attack step, this vehicle may temporarily reduce its crew value by one, once, until the end of the attack step, to gain +1 bonus to hit with a single weapon. Critical hits still occur only on the natural roll of a 6. ",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Military",
    ptype: "Fully Loaded",
    cost: 2,
    rules:
      "If a shooting weapon on this vehicle has 3 or more ammo tokens remaining before discarding an ammo token to attack, that weapon gains +1 attack dice.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Military",
    ptype: "Rapid Fire",
    cost: 2,
    rules:
      "Once per round, after attacking with a weapon, this vehicle may resolve an additional attack step in which it may only attack with that weapon. ",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Military",
    ptype: "Headshot",
    cost: 4,
    rules:
      "When making a shooting attack, this vehicle's critical hits inflict 3 hits instead of the normal 2 hits.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Military",
    ptype: "Return Fire",
    cost: 5,
    rules:
      "Once per gear phase, if this vehicle is the target of a shooting attack, this vehicle may take 2 hazard tokens to immediately attack, as if it was this vehicle's attack step.",
    shortRules: "",
    ruleset: "BASE",
  },

  {
    class: "Precision",
    ptype: "Mister Fahrenheit",
    cost: 2,
    rules:
      "This vehicle cannot gain more than 2 hazards tokens from collisions during a single activation.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Precision",
    ptype: "Moment of Glory",
    cost: 2,
    rules:
      "Once per game, after rolling the skid dice, but before resolving the results, this vehicle may immediately change any number of skid dice to any results they choose.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Precision",
    ptype: "Restraint",
    cost: 2,
    rules:
      "When this vehicle would gain a hazard token for shifting down a gear, this vehicle may remove a hazard token insead.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Precision",
    ptype: "Expertise",
    cost: 3,
    rules: "This vehicle adds +1 to its handling value.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Precision",
    ptype: "Trick Driving",
    cost: 3,
    rules:
      "This vehicle may select a movement template as if its current gear was one higher or one lower.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Precision",
    ptype: "Easy Rider",
    cost: 5,
    rules:
      "Once per turn, this vehicle may discard one rolled skid die result before applying the results.",
    shortRules: "",
    ruleset: "BASE",
  },

  {
    class: "Pursuit",
    ptype: "On Your Tail",
    cost: 2,
    rules:
      "When an enemy vehicle resolves a spin or slide move that ends within short range of this vehicle, that vehicle gains +1 hazard token.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Pursuit",
    ptype: "Schadenfreude",
    cost: 2,
    rules:
      "If another vehicle within short range of this vehicle resolves a wipe out, (either before or after any flip), remove all hazard tokens from this vehicle.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Pursuit",
    ptype: "Taunt",
    cost: 2,
    rules:
      "At the start of this vehicle's attack step, roll a skid die. If you roll something other than a SHIFT result, you may place that skid die result onto the dashboard of a target vehicle within short range. This skid die result must be resolved during that vehicle's next skid check, and may not be re-rolled.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Pursuit",
    ptype: "Out Run",
    cost: 2,
    rules:
      "At the start of this vehicle's attack step, all vehicles within short range of this vehicle and in a current, lower gear than this vehicle gain +1 hazard token.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Pursuit",
    ptype: "PIT",
    cost: 4,
    rules:
      "During this vehicle's activation, if this vehicle is involved in a non‐head‐on collision with an enemy vehicle, it may declare a 'Pursuit Intervention Technique' (PIT) as its reaction, targeting the enemy vehicle, instead of declaring a smash attack or an evade. If this vehicle declares a PIT, it may select any movement template the target vehicle considers hazardous in its current gear. Immediately after the resolution of this collision, the target vehicle must make a forced move directly forward using the selected movement template.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Pursuit",
    ptype: "Unnerving Eye Contact",
    cost: 5,
    rules:
      "Enemy vehicles within short range of this vehicle may not use shift results to remove hazard tokens from their dashboard.",
    shortRules: "",
    ruleset: "BASE",
  },

  {
    class: "Reckless",
    ptype: "Drive Angry",
    cost: 1,
    rules: "Gain 1 hazard token at the start of each activation.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Reckless",
    ptype: "Hog Wild",
    cost: 2,
    rules:
      "This vehicle gains +2 smash attack dice during any collision resolved during a wipe out step.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Reckless",
    ptype: "In For A Penny",
    cost: 2,
    rules:
      "If this vehicle has gained six or more hazard tokens during this activation, it may double the attack dice of any smash attack for this activation only.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Reckless",
    ptype: "Don't Come Knocking",
    cost: 4,
    rules:
      "At the start of this vehicle's activation, it may gain 4 hazard tokens. If it does, this vehicle cannot gain or lose any hazard tokens by any means until the start of its next activation.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Reckless",
    ptype: "Bigger'n You",
    cost: 4,
    rules:
      "Double any smash attack bonuses or penalties resulting from weight differences in collisions involving this vehicle.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Reckless",
    ptype: "Beerserker",
    cost: 5,
    rules:
      "When this vehicle would suffer damage outside of it's activation, reduce that damage by 1, to a minimum of 1.",
    shortRules: "",
    ruleset: "BASE",
  },

  {
    class: "Speed",
    ptype: "Hot Start",
    cost: 1,
    rules:
      "Roll a D6 at the start of the game This vehicle starts the game in that gear. Re-roll if this is above the vehicles amx gear",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Speed",
    ptype: "Slipstream",
    cost: 2,
    rules:
      "If this vehicle is involved in a tailgate collision during its activation, this vehicle may declare a slipstream reaction. If they do, they other vehicle may not declare a reaction. If this vehicle declares a slipstream reaction: this vehicle may change up or down one gear and gains a hazard token. Neither vehicle gains hazard tokens as a result of this collision.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Speed",
    ptype: "Overload",
    cost: 2,
    rules:
      "When making a skid check, this vehicle may roll one additional skid die. If it does, it must change up at least one gear or gain a hazard token.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Speed",
    ptype: "Downshift",
    cost: 3,
    rules:
      "At the end of a movement step in which this vehicle changed down one or more gears, this vehicle may immediately make a forced short straight movement forward.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Speed",
    ptype: "Time Extended!",
    cost: 3,
    rules:
      "At the end of an activation in which this vehicle passes a gate, before checking for wipeouts, this vehicle may immediately remove any number of hazard tokens.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Speed",
    ptype: "Hell For Leather",
    cost: 5,
    rules:
      "This vehicle considers long straight to he permitted in any gear. The long straight is not considered either hazardous or trivial in any gear.",
    shortRules: "",
    ruleset: "BASE",
  },

  {
    class: "Technology",
    ptype: "Rocket Thrusters",
    cost: 1,
    rules:
      "When this vehicle is moved as part of a flip, it may choose to use the long straight, veer or gentle templates instead of the medium straight template.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Technology",
    ptype: "Whizbang",
    cost: 1,
    rules:
      "At the start of each game, this vehicle gains a random SPEED PERK. This perk is lost at the end of the game.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Technology",
    ptype: "Gyroscope",
    cost: 1,
    rules:
      "At the start of each game, this vehicle gains a random DARING PERK. This perk is lost at the end of the game.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Technology",
    ptype: "Satellite Navigation",
    cost: 2,
    rules:
      "When this vehicle resolves its skid dice, this vehicle's controller may set aside one shift result. This vehicle may have any number of shift results set aside. Any vehicle in this team may use these set aside shift results during a later movement step, as if they had rolled them in that movement step. ",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Technology",
    ptype: "Mobile Mechanic",
    cost: 3,
    rules:
      "Once per activation, at the start of its attack step, this vehicle may temporarily reduce its crew value by one, once, until the end of the attack step, to perform a field repair. If it does, this vehicle gains 1 hull point, which may not take its hull points above the vehicle's hull value.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Technology",
    ptype: "Eureka!",
    cost: 4,
    rules:
      "Once per game, at the start of its attack step, this vehicle's controller may declare any weapon that this vehicle has not attacked with yet this game. This vehicle counts as being armed with the declared weapon, on a facing of their choice, for the next attack only.",
    shortRules: "",
    ruleset: "BASE",
  },

  {
    class: "Tuning",
    ptype: "Fenderkiss",
    cost: 2,
    rules:
      "When this vehicle makes a smash attack, this vehicle suffers a penalty of -2 attack dice. Vehicles making a smash attack targeting this vehicle suffer a penalty of -2 attack dice. ",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Tuning",
    ptype: "Rear Drive",
    cost: 2,
    rules:
      "This vehicle may pivot about the centre of its front edge, rather than the centre of the vehicle, when resolving Spin results.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Tuning",
    ptype: "Delicate Touch",
    cost: 3,
    rules: "This vehicle ignores the hazard icons on maneuver templates.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Tuning",
    ptype: "Momentum",
    cost: 3,
    rules:
      "When resolving skid dice, this vehicle may set aside a Slide or Spin result to re-roll a skid dice. The effect may be used multiple times.  Set aside results must be resolved.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Tuning",
    ptype: "Purring",
    cost: 6,
    rules:
      "This vehicle does not receive more than 1 hazard token from Spin results each turn. This vehicle does not receive more than 1 hazard token from Slide results each turn. This vehicle does not receive more than 1 hazard token from Hazard results each turn.",
    shortRules: "",
    ruleset: "BASE",
  },
  {
    class: "Tuning",
    ptype: "Skiing",
    cost: 6,
    rules:
      "If this vehicle has handling 3 or higher, this vehicle may take 3 hazard tokens at the end of its activation to be ignored by other vehicles during their movement steps until the start of this vehicle's next activation. If, by ignoring this vehicle in this way, a vehicle's final position would overlap it, move that vehicle backwards along their maneuver template by the minimum amount to avoid overlapping any obstruction.",
    shortRules: "",
    ruleset: "BASE",
  },
];

export const allPerkClasses = Array.from(new Set(allPerks.map((p) => p.class)));

export const aggressionPerks = allPerks.filter((x) => x.class == "Aggression");
export const badassPerks = allPerks.filter((x) => x.class == "Badass");

export const allInjuries = [
  {
    itype: "Deathwish",
    cost: 1,
    rules: "This vehicle cannot choose to shift down",
    shortRules: "This vehicle cannot choose to shift down",
    ruleset: "BASE",
  },
  {
    itype: "Bad Television",
    cost: 1,
    rules: "This vehicle must pay 1 additional Audience Vote to re-spawn",
    shortRules: "Respawn needs +1 votes",
    ruleset: "BASE",
  },
  {
    itype: "Crazed",
    cost: 2,
    rules:
      "This vehicle may not use shift results to cancel out spin or slide results",
    shortRules: "bob",
    ruleset: "BASE",
  },
  {
    itype: "Cowardly",
    cost: 2,
    rules:
      "This vehicle must always declare an evade during a collision, they may not declare a smash attack",
    shortRules: "bob",
    ruleset: "BASE",
  },
  {
    itype: "Old War Wound",
    cost: 3,
    rules:
      "At the start of every game, roll a D6. On a 1, this vehicle cannot take part in this game",
    shortRules: "bob",
    ruleset: "BASE",
  },
  {
    itype: "Shakes",
    cost: 3,
    rules: "This vehicle wipes out at 5 hazard tokens instead of 6",
    shortRules: "bob",
    ruleset: "BASE",
  },
  {
    itype: "Twitch",
    cost: 4,
    rules:
      "At the start of the game, you must inform your opponents which of your drivers have the Twitch injury. Once per game, when this driver is attempting a skid check, any opponent may declare: 'Twitch'. That opponent may roll the skid dice, instead of you, and choose how to resolve them. The twitching vehicle may not Push It. A driver may only be affected by Twitch once per game",
    shortRules: "bob",
    ruleset: "BASE",
  },
  {
    itype: "Held Together By Rust",
    cost: 5,
    rules:
      "During the Post-Game Sequence, when rolling on the Vehicle Wrecked table: apply the first result then roll again apply the second result also.",
    shortRules: "bob",
    ruleset: "BASE",
  },
  {
    itype: "Badass",
    cost: 6,
    rules:
      "This vehicle may immediately select and gain any one Badass perk, without paying its cost, even if this driver could not normally select Badass perks.",
    shortRules: "bob",
    ruleset: "BASE",
  },
  {
    itype: "Living Legend",
    cost: 11,
    rules:
      "During the Post-Game Sequence, when rolling on the Vehicle Wrecked table, count your result as 1 and remove any injury perks you wish.",
    shortRules: "bob",
    ruleset: "BASE",
  },
];

export const allSavageHighwaysUpgrades = [
    {
      utype: "Hangers On",
      slots: 0,
      ammo: 0,
      specialRules:
        "this vehicle gains +4 crew. If this vehicle is involved in two or more collisions in a single activation, discard this upgrade as they are flung wildly from the vehicle.",
      cost: 0,
      keywords: [],
      limit: 1,
    },
    {
      utype: "Selvaggio",
      slots: 0,
      ammo: 0,
      specialRules:
        "Once per turn, this vehicle may remove 1 hull point in order to discard all hazard tokens. If this vehicle is targeted by two shooting attacks in a single gear phase that do not suffer from cover, discard this upgrade as the snipers find their mark.",
      cost: 0,
      keywords: [],
      limit: 1,
    },
    {
      utype: "Fuel Pod",
      slots: 0,
      ammo: 0,
      specialRules:
        "Once per gear phase, during a skid check, this vehicle may discard or re-roll one skid dice. If an enemy vehicle ever declares a tailgate smash attack that rolls no attack dice, discard this upgrade as the raiders cut the fuel lines and siphon them off.",
      cost: 0,
      keywords: [],
      limit: 1,
    },
    {
      utype: "Grease Monkey",
      slots: 0,
      ammo: 0,
      specialRules:
        "Once per gear phase, if this vehicle successfully evades a hit, gain 1 previously lost hull point. If this vehicle ever gains a hazard token via the Blast effect discard this upgrade as the mechanic is thrown from the rig.",
      cost: 0,
      keywords: [],
      limit: 1,
    },
    {
      utype: "Cow Catcher",
      slots: 0,
      ammo: 0,
      specialRules:
        "Once per turn, this vehicle may consider a single piece of terrain to be destructible during its activation. If this vehicle is targeted with a head-on collision discard this upgrade.",
      cost: 0,
      keywords: [],
      limit: 1,
    },
  ],
  savageHighwayWarRigs = {
    Idris: {
      vehicleName: "Idris War Rig",
      vehicleType: "War Rig",
      weapons: [
        { weaponType: "Mini-Gun", facing: "Turret/360", location: "Trailer" },
        { weaponType: "Ram", facing: "Front", location: "Cab" },
      ],
      upgrades: [],
      perks: [
        { perkType: "Overload" },
        { perkType: "Expertise" },
        { perkType: "Easy Rider" },
        { perkType: "Handbrake Artist" },
      ],
    },
    Rutherford: {
      vehicleName: "Rutherford War Rig",
      vehicleType: "War Rig",
      weapons: [
        {
          weaponType: "125mm Cannon",
          facing: "Turret/360",
          location: "Trailer",
        },
        { weaponType: "Rockets", facing: "Turret/360", location: "Trailer" },
      ],
      upgrades: [{ upgradeType: "Tank tracks" }],
      perks: [{ perkType: "Loader" }],
    },
    Mishkin: {
      vehicleName: "Mishkin War Rig",
      vehicleType: "War Rig",
      weapons: [
        {
          weaponType: "Arc Lightning Projector",
          facing: "Turret/360",
          location: "Trailer",
        },
        {
          weaponType: "Heavy Machine Gun",
          facing: "Turret/360",
          location: "Trailer",
        },
        { weaponType: "Mortar", facing: "Rear", location: "Trailer" },
        { weaponType: "Mines", facing: "Rear", location: "Trailer" },
        {
          weaponType: "Oil Slick Dropper",
          facing: "Rear",
          location: "Trailer",
        },
      ],
      upgrades: [],
      perks: [{ perkType: "Gyroscope" }],
    },
    Slime: {
      vehicleName: "Slime War Rig",
      vehicleType: "War Rig",
      weapons: [
        { weaponType: "Mini-Gun", facing: "Turret/360", location: "Trailer" },
        { weaponType: "Ram", facing: "Front", location: "Cab" },
        { weaponType: "Ram", facing: "Sides", location: "Trailer" },
        { weaponType: "Ram", facing: "Rear", location: "Trailer" },
        { weaponType: "Smoke", facing: "Sides", location: "Trailer" },
        { weaponType: "Smoke", facing: "Rear", location: "Trailer" },
      ],
      upgrades: [],
      perks: [{ perkType: "Overload" }],
    },
    Warden: {
      vehicleName: "Warden War Rig",
      vehicleType: "War Rig",
      weapons: [
        { weaponType: "Mini-Gun", facing: "Turret/360", location: "Trailer" },
        { weaponType: "Caltrop Dropper", facing: "Rear", location: "Trailer" },
      ],
      upgrades: [{ upgradeType: "Extra crew" }],
      perks: [
        { perkType: "Terrifying Lunatic" },
        { perkType: "Battlehammer" },
        { perkType: "Madman" },
        { perkType: "Cover Me" },
      ],
    },
  },
  savageHighwaysRiggerTeams = {
    Idris: {
      teamType: "SavageHighwaysRiggerTeam",
      teamName: "Riggers",
      sponsor: "Idris",
      specialty: "None",
      vehicles: [],
      maxCost: 60,
    },
    Rutherford: {
      teamType: "SavageHighwaysRiggerTeam",
      teamName: "Riggers",
      sponsor: "Rutherford",
      specialty: "None",
      vehicles: [],
      maxCost: 60,
    },
    Mishkin: {
      teamType: "SavageHighwaysRiggerTeam",
      teamName: "Riggers",
      sponsor: "Mishkin",
      specialty: "None",
      vehicles: [],
      maxCost: 60,
    },
    Slime: {
      teamType: "SavageHighwaysRiggerTeam",
      teamName: "Riggers",
      sponsor: "Slime",
      specialty: "None",
      vehicles: [],
      maxCost: 60,
    },
    Warden: {
      teamType: "SavageHighwaysRiggerTeam",
      teamName: "Riggers",
      sponsor: "Warden",
      specialty: "None",
      vehicles: [],
      maxCost: 60,
    },
  },
  savageHighwaysRiggerTeamNames = Object.keys(savageHighwaysRiggerTeams);
var nextVehicleNum = 1;
var teamFile = null;
var referenceHighlightColour = "#fffacd";
