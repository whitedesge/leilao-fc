/**
 * Banco de Dados – Top jogadores por posição (2000–2027)
 * Overalls aproximados com base em FIFA / EA FC históricos e atuais
 */
const PLAYERS_DB = [
  // ========== GOLEIROS (20) ==========
  { id: 1,  name: "Manuel Neuer",          pos: "GK", ovr: 91, club: "Bayern München",     nation: "Alemanha",     era: "2010-2025" },
  { id: 2,  name: "Gianluigi Buffon",      pos: "GK", ovr: 90, club: "Juventus",           nation: "Itália",       era: "2000-2018" },
  { id: 3,  name: "Iker Casillas",         pos: "GK", ovr: 89, club: "Real Madrid",        nation: "Espanha",      era: "2000-2015" },
  { id: 4,  name: "Thibaut Courtois",      pos: "GK", ovr: 90, club: "Real Madrid",        nation: "Bélgica",      era: "2014-2027" },
  { id: 5,  name: "Alisson Becker",        pos: "GK", ovr: 89, club: "Liverpool",          nation: "Brasil",       era: "2018-2027" },
  { id: 6,  name: "Jan Oblak",             pos: "GK", ovr: 88, club: "Atlético Madrid",    nation: "Eslovênia",    era: "2014-2027" },
  { id: 7,  name: "Oliver Kahn",           pos: "GK", ovr: 89, club: "Bayern München",     nation: "Alemanha",     era: "2000-2008" },
  { id: 8,  name: "Petr Čech",             pos: "GK", ovr: 87, club: "Chelsea",            nation: "Tchéquia",     era: "2004-2016" },
  { id: 9,  name: "Gianluigi Donnarumma",  pos: "GK", ovr: 89, club: "Manchester City",    nation: "Itália",       era: "2015-2027" },
  { id: 10, name: "Marc-André ter Stegen", pos: "GK", ovr: 88, club: "Barcelona",          nation: "Alemanha",     era: "2014-2027" },
  { id: 11, name: "Edwin van der Sar",     pos: "GK", ovr: 88, club: "Manchester United",  nation: "Holanda",      era: "2000-2011" },
  { id: 12, name: "Keylor Navas",          pos: "GK", ovr: 87, club: "PSG / Real Madrid",  nation: "Costa Rica",   era: "2014-2023" },
  { id: 13, name: "Hugo Lloris",           pos: "GK", ovr: 86, club: "Tottenham",          nation: "França",       era: "2008-2023" },
  { id: 14, name: "Emiliano Martínez",     pos: "GK", ovr: 88, club: "Aston Villa",        nation: "Argentina",    era: "2020-2027" },
  { id: 15, name: "David Raya",            pos: "GK", ovr: 87, club: "Arsenal",            nation: "Espanha",      era: "2023-2027" },
  { id: 16, name: "Mike Maignan",          pos: "GK", ovr: 87, club: "Milan",              nation: "França",       era: "2021-2027" },
  { id: 17, name: "Dida",                  pos: "GK", ovr: 86, club: "Milan",              nation: "Brasil",       era: "2000-2010" },
  { id: 18, name: "Pepe Reina",            pos: "GK", ovr: 84, club: "Liverpool",          nation: "Espanha",      era: "2005-2013" },
  { id: 19, name: "André Onana",           pos: "GK", ovr: 85, club: "Manchester United",  nation: "Camarões",     era: "2022-2027" },
  { id: 20, name: "Yashin (lenda)",        pos: "GK", ovr: 92, club: "Dynamo Moscow",      nation: "Rússia",       era: "Lenda" },

  // ========== ZAGUEIROS / DEF (20) ==========
  { id: 21, name: "Paolo Maldini",         pos: "DEF", ovr: 92, club: "Milan",              nation: "Itália",       era: "Lenda-2009" },
  { id: 22, name: "Sergio Ramos",          pos: "DEF", ovr: 89, club: "Real Madrid",        nation: "Espanha",      era: "2005-2021" },
  { id: 23, name: "Virgil van Dijk",       pos: "DEF", ovr: 90, club: "Liverpool",          nation: "Holanda",      era: "2018-2027" },
  { id: 24, name: "Fabio Cannavaro",       pos: "DEF", ovr: 89, club: "Real Madrid",        nation: "Itália",       era: "2000-2010" },
  { id: 25, name: "Alessandro Nesta",      pos: "DEF", ovr: 90, club: "Milan",              nation: "Itália",       era: "2000-2012" },
  { id: 26, name: "John Terry",            pos: "DEF", ovr: 88, club: "Chelsea",            nation: "Inglaterra",   era: "2000-2015" },
  { id: 27, name: "Carles Puyol",          pos: "DEF", ovr: 88, club: "Barcelona",          nation: "Espanha",      era: "2000-2014" },
  { id: 28, name: "Nemanja Vidić",         pos: "DEF", ovr: 87, club: "Manchester United",  nation: "Sérvia",       era: "2006-2014" },
  { id: 29, name: "Rio Ferdinand",         pos: "DEF", ovr: 87, club: "Manchester United",  nation: "Inglaterra",   era: "2000-2014" },
  { id: 30, name: "Thiago Silva",          pos: "DEF", ovr: 88, club: "Chelsea / PSG",      nation: "Brasil",       era: "2010-2024" },
  { id: 31, name: "Rúben Dias",            pos: "DEF", ovr: 88, club: "Manchester City",    nation: "Portugal",     era: "2020-2027" },
  { id: 32, name: "William Saliba",        pos: "DEF", ovr: 88, club: "Arsenal",            nation: "França",       era: "2022-2027" },
  { id: 33, name: "Gabriel Magalhães",     pos: "DEF", ovr: 89, club: "Arsenal",            nation: "Brasil",       era: "2020-2027" },
  { id: 34, name: "Antonio Rüdiger",       pos: "DEF", ovr: 87, club: "Real Madrid",        nation: "Alemanha",     era: "2022-2027" },
  { id: 35, name: "Gerard Piqué",          pos: "DEF", ovr: 87, club: "Barcelona",          nation: "Espanha",      era: "2008-2022" },
  { id: 36, name: "Mats Hummels",          pos: "DEF", ovr: 86, club: "Borussia Dortmund",  nation: "Alemanha",     era: "2010-2022" },
  { id: 37, name: "Leonardo Bonucci",      pos: "DEF", ovr: 86, club: "Juventus",           nation: "Itália",       era: "2010-2023" },
  { id: 38, name: "Raphaël Varane",        pos: "DEF", ovr: 86, club: "Manchester United",  nation: "França",       era: "2011-2024" },
  { id: 39, name: "Franz Beckenbauer",     pos: "DEF", ovr: 93, club: "Bayern München",     nation: "Alemanha",     era: "Lenda" },
  { id: 40, name: "Kalidou Koulibaly",     pos: "DEF", ovr: 86, club: "Napoli / Chelsea",   nation: "Senegal",      era: "2014-2024" },

  // ========== LATERAIS (20) ==========
  { id: 41, name: "Roberto Carlos",        pos: "LB",  ovr: 90, club: "Real Madrid",        nation: "Brasil",       era: "2000-2007" },
  { id: 42, name: "Cafu",                  pos: "RB",  ovr: 89, club: "Milan",              nation: "Brasil",       era: "2000-2008" },
  { id: 43, name: "Philipp Lahm",          pos: "RB",  ovr: 88, club: "Bayern München",     nation: "Alemanha",     era: "2003-2017" },
  { id: 44, name: "Dani Alves",            pos: "RB",  ovr: 87, club: "Barcelona",          nation: "Brasil",       era: "2008-2016" },
  { id: 45, name: "Marcelo",               pos: "LB",  ovr: 88, club: "Real Madrid",        nation: "Brasil",       era: "2007-2022" },
  { id: 46, name: "Ashley Cole",           pos: "LB",  ovr: 87, club: "Chelsea",            nation: "Inglaterra",   era: "2000-2014" },
  { id: 47, name: "Jordi Alba",            pos: "LB",  ovr: 86, club: "Barcelona",          nation: "Espanha",      era: "2012-2023" },
  { id: 48, name: "Andrew Robertson",      pos: "LB",  ovr: 86, club: "Liverpool",          nation: "Escócia",      era: "2017-2027" },
  { id: 49, name: "Trent Alexander-Arnold",pos: "RB",  ovr: 87, club: "Liverpool",          nation: "Inglaterra",   era: "2017-2027" },
  { id: 50, name: "Nuno Mendes",           pos: "LB",  ovr: 89, club: "PSG",                nation: "Portugal",     era: "2021-2027" },
  { id: 51, name: "Achraf Hakimi",         pos: "RB",  ovr: 86, club: "PSG",                nation: "Marrocos",     era: "2020-2027" },
  { id: 52, name: "Kyle Walker",           pos: "RB",  ovr: 85, club: "Manchester City",    nation: "Inglaterra",   era: "2017-2025" },
  { id: 53, name: "Theo Hernández",        pos: "LB",  ovr: 86, club: "Milan",              nation: "França",       era: "2019-2027" },
  { id: 54, name: "Alphonso Davies",       pos: "LB",  ovr: 85, club: "Bayern München",     nation: "Canadá",       era: "2019-2027" },
  { id: 55, name: "João Cancelo",          pos: "RB",  ovr: 86, club: "Barcelona",          nation: "Portugal",     era: "2018-2027" },
  { id: 56, name: "Maicon",                pos: "RB",  ovr: 86, club: "Inter",              nation: "Brasil",       era: "2006-2012" },
  { id: 57, name: "David Alaba",           pos: "LB",  ovr: 86, club: "Real Madrid",        nation: "Áustria",      era: "2010-2027" },
  { id: 58, name: "Reece James",           pos: "RB",  ovr: 85, club: "Chelsea",            nation: "Inglaterra",   era: "2019-2027" },
  { id: 59, name: "Ferland Mendy",         pos: "LB",  ovr: 84, club: "Real Madrid",        nation: "França",       era: "2019-2027" },
  { id: 60, name: "Kieran Trippier",       pos: "RB",  ovr: 84, club: "Newcastle",          nation: "Inglaterra",   era: "2019-2025" },

  // ========== MEIO-CAMPO (25) ==========
  { id: 61, name: "Zinedine Zidane",       pos: "CAM", ovr: 94, club: "Real Madrid",        nation: "França",       era: "2000-2006" },
  { id: 62, name: "Ronaldinho",            pos: "CAM", ovr: 94, club: "Barcelona",          nation: "Brasil",       era: "2003-2008" },
  { id: 63, name: "Xavi Hernández",        pos: "CM",  ovr: 92, club: "Barcelona",          nation: "Espanha",      era: "2000-2015" },
  { id: 64, name: "Andrés Iniesta",        pos: "CAM", ovr: 91, club: "Barcelona",          nation: "Espanha",      era: "2002-2018" },
  { id: 65, name: "Luka Modrić",           pos: "CM",  ovr: 91, club: "Real Madrid",        nation: "Croácia",      era: "2012-2024" },
  { id: 66, name: "Andrea Pirlo",          pos: "CM",  ovr: 91, club: "Juventus / Milan",   nation: "Itália",       era: "2000-2015" },
  { id: 67, name: "Kevin De Bruyne",       pos: "CAM", ovr: 91, club: "Manchester City",    nation: "Bélgica",      era: "2015-2025" },
  { id: 68, name: "Kaká",                  pos: "CAM", ovr: 91, club: "Milan",              nation: "Brasil",       era: "2003-2010" },
  { id: 69, name: "Toni Kroos",            pos: "CM",  ovr: 89, club: "Real Madrid",        nation: "Alemanha",     era: "2014-2024" },
  { id: 70, name: "N'Golo Kanté",          pos: "CDM", ovr: 89, club: "Chelsea",            nation: "França",       era: "2016-2022" },
  { id: 71, name: "Sergio Busquets",       pos: "CDM", ovr: 88, club: "Barcelona",          nation: "Espanha",      era: "2008-2023" },
  { id: 72, name: "Rodri",                 pos: "CDM", ovr: 90, club: "Manchester City",    nation: "Espanha",      era: "2019-2027" },
  { id: 73, name: "Jude Bellingham",       pos: "CM",  ovr: 90, club: "Real Madrid",        nation: "Inglaterra",   era: "2023-2027" },
  { id: 74, name: "Pedri",                 pos: "CM",  ovr: 90, club: "Barcelona",          nation: "Espanha",      era: "2020-2027" },
  { id: 75, name: "Bruno Fernandes",       pos: "CAM", ovr: 89, club: "Manchester United",  nation: "Portugal",     era: "2020-2027" },
  { id: 76, name: "Vitinha",               pos: "CM",  ovr: 90, club: "PSG",                nation: "Portugal",     era: "2022-2027" },
  { id: 77, name: "Declan Rice",           pos: "CDM", ovr: 88, club: "Arsenal",            nation: "Inglaterra",   era: "2023-2027" },
  { id: 78, name: "Casemiro",              pos: "CDM", ovr: 88, club: "Manchester United",  nation: "Brasil",       era: "2013-2025" },
  { id: 79, name: "Frank Lampard",         pos: "CM",  ovr: 88, club: "Chelsea",            nation: "Inglaterra",   era: "2001-2014" },
  { id: 80, name: "Steven Gerrard",        pos: "CM",  ovr: 89, club: "Liverpool",          nation: "Inglaterra",   era: "2000-2015" },
  { id: 81, name: "Paul Scholes",          pos: "CM",  ovr: 88, club: "Manchester United",  nation: "Inglaterra",   era: "2000-2011" },
  { id: 82, name: "Claude Makélélé",       pos: "CDM", ovr: 87, club: "Chelsea",            nation: "França",       era: "2000-2008" },
  { id: 83, name: "Yaya Touré",            pos: "CM",  ovr: 87, club: "Manchester City",    nation: "Costa do Marfim", era: "2010-2018" },
  { id: 84, name: "Bernardo Silva",        pos: "CAM", ovr: 88, club: "Manchester City",    nation: "Portugal",     era: "2017-2027" },
  { id: 85, name: "Martin Ødegaard",       pos: "CAM", ovr: 88, club: "Arsenal",            nation: "Noruega",      era: "2021-2027" },

  // ========== ATACANTES (25) ==========
  { id: 91, name: "Lionel Messi",          pos: "RW",  ovr: 94, club: "Inter Miami",        nation: "Argentina",    era: "2004-2027" },
  { id: 92, name: "Cristiano Ronaldo",     pos: "ST",  ovr: 93, club: "Al-Nassr",           nation: "Portugal",     era: "2003-2027" },
  { id: 93, name: "Ronaldo Nazário",       pos: "ST",  ovr: 94, club: "Real Madrid / Inter",nation: "Brasil",       era: "2000-2007" },
  { id: 94, name: "Thierry Henry",         pos: "ST",  ovr: 91, club: "Arsenal",            nation: "França",       era: "2000-2007" },
  { id: 95, name: "Zlatan Ibrahimović",    pos: "ST",  ovr: 89, club: "Milan / PSG",        nation: "Suécia",       era: "2004-2021" },
  { id: 96, name: "Robert Lewandowski",    pos: "ST",  ovr: 91, club: "Barcelona",          nation: "Polônia",      era: "2010-2027" },
  { id: 97, name: "Kylian Mbappé",         pos: "ST",  ovr: 91, club: "Real Madrid",        nation: "França",       era: "2017-2027" },
  { id: 98, name: "Erling Haaland",        pos: "ST",  ovr: 91, club: "Manchester City",    nation: "Noruega",      era: "2020-2027" },
  { id: 99, name: "Neymar Jr.",            pos: "LW",  ovr: 90, club: "Santos / PSG",       nation: "Brasil",       era: "2010-2025" },
  { id:100, name: "Luis Suárez",           pos: "ST",  ovr: 90, club: "Barcelona",          nation: "Uruguai",      era: "2011-2022" },
  { id:101, name: "Karim Benzema",         pos: "ST",  ovr: 91, club: "Real Madrid",        nation: "França",       era: "2009-2023" },
  { id:102, name: "Vinícius Júnior",       pos: "LW",  ovr: 89, club: "Real Madrid",        nation: "Brasil",       era: "2018-2027" },
  { id:103, name: "Mohamed Salah",         pos: "RW",  ovr: 90, club: "Liverpool",          nation: "Egito",        era: "2017-2027" },
  { id:104, name: "Harry Kane",            pos: "ST",  ovr: 90, club: "Bayern München",     nation: "Inglaterra",   era: "2014-2027" },
  { id:105, name: "Lamine Yamal",          pos: "RW",  ovr: 90, club: "Barcelona",          nation: "Espanha",      era: "2023-2027" },
  { id:106, name: "Ousmane Dembélé",       pos: "RW",  ovr: 90, club: "PSG",                nation: "França",       era: "2023-2027" },
  { id:107, name: "Sadio Mané",            pos: "LW",  ovr: 89, club: "Bayern / Al-Nassr",  nation: "Senegal",      era: "2016-2025" },
  { id:108, name: "Son Heung-min",         pos: "LW",  ovr: 88, club: "Tottenham",          nation: "Coreia do Sul",era: "2015-2027" },
  { id:109, name: "Romário",               pos: "ST",  ovr: 91, club: "Barcelona / Flamengo",nation: "Brasil",      era: "Lenda-2000s" },
  { id:110, name: "Rivaldo",               pos: "CAM", ovr: 90, club: "Barcelona",          nation: "Brasil",       era: "2000-2003" },
  { id:111, name: "Didier Drogba",         pos: "ST",  ovr: 88, club: "Chelsea",            nation: "Costa do Marfim", era: "2004-2012" },
  { id:112, name: "Samuel Eto'o",          pos: "ST",  ovr: 88, club: "Barcelona / Inter",  nation: "Camarões",     era: "2004-2011" },
  { id:113, name: "Fernando Torres",       pos: "ST",  ovr: 88, club: "Liverpool / Chelsea",nation: "Espanha",      era: "2007-2014" },
  { id:114, name: "Wayne Rooney",          pos: "ST",  ovr: 88, club: "Manchester United",  nation: "Inglaterra",   era: "2004-2017" },
  { id:115, name: "Khvicha Kvaratskhelia", pos: "LW",  ovr: 89, club: "PSG",                nation: "Geórgia",      era: "2022-2027" },
  { id:116, name: "Michael Olise",         pos: "RW",  ovr: 90, club: "Bayern München",     nation: "França",       era: "2024-2027" },
  { id:117, name: "Bukayo Saka",           pos: "RW",  ovr: 87, club: "Arsenal",            nation: "Inglaterra",   era: "2020-2027" },
  { id:118, name: "Rodrygo",               pos: "RW",  ovr: 87, club: "Real Madrid",        nation: "Brasil",       era: "2019-2027" },
  { id:119, name: "Lautaro Martínez",      pos: "ST",  ovr: 88, club: "Inter",              nation: "Argentina",    era: "2018-2027" },
  { id:120, name: "Victor Osimhen",        pos: "ST",  ovr: 88, club: "Galatasaray",        nation: "Nigéria",      era: "2020-2027" }
];

/** Posições e labels */
const FORMATIONS = {
  futsal: {
    surface: "futsal",
    budget: 50,
    slots: ["GK", "FIX", "PE", "PD", "MC"],
    labels: {
      GK: "Goleiro", FIX: "Fixo", PE: "Ponta Esq.", PD: "Ponta Dir.", MC: "Meio/Ataque"
    }
  },
  campo: {
    surface: "campo",
    budget: 150,
    slots: []
  }
};

const TACTICAL_FORMATIONS = {
  "4-3-3": { defense: 4, midfield: 3, attack: 3 },
  "4-4-2": { defense: 4, midfield: 4, attack: 2 },
  "3-5-2": { defense: 3, midfield: 5, attack: 2 }
};

function getFormation(surface, tacticalFormation = "4-3-3") {
  if (surface === "futsal") return FORMATIONS.futsal;

  const counts = TACTICAL_FORMATIONS[tacticalFormation] || TACTICAL_FORMATIONS["4-3-3"];
  const zones = [
    { id: "attack", label: "Ataque", prefix: "ATT", count: counts.attack },
    { id: "midfield", label: "Meio-campo", prefix: "MID", count: counts.midfield },
    { id: "defense", label: "Defesa", prefix: "DEF", count: counts.defense }
  ].map(zone => ({
    ...zone,
    slots: Array.from({ length: zone.count }, (_, index) => `${zone.prefix}${index + 1}`)
  }));
  const labels = { GK: "Goleiro" };

  zones.forEach(zone => {
    zone.slots.forEach((slot, index) => {
      labels[slot] = `${zone.label} ${index + 1}`;
    });
  });

  return {
    surface: "campo",
    budget: FORMATIONS.campo.budget,
    tacticalFormation,
    goalkeeper: "GK",
    zones,
    slots: ["GK", ...zones.flatMap(zone => zone.slots)],
    labels
  };
}

function findFormationSlot(formation, filled, player) {
  const available = formation.slots.filter(slot => !filled.has(slot));
  if (player.pos === "GK") return available.includes("GK") ? "GK" : null;

  if (formation.surface === "futsal") {
    const futsalSlots = {
      FIX: ["DEF", "CB", "LB", "RB", "CDM"],
      PE: ["LW", "LM"],
      PD: ["RW", "RM"],
      MC: ["CM", "CAM", "CDM", "ST", "CF"]
    };
    return ["FIX", "PE", "PD", "MC"].find(slot =>
      available.includes(slot) && futsalSlots[slot].includes(player.pos)
    ) || null;
  }

  const zoneByPosition = {
    DEF: "defense", CB: "defense", LB: "defense", RB: "defense",
    CDM: "midfield", CM: "midfield", CAM: "midfield",
    LW: "attack", LM: "attack", RW: "attack", RM: "attack", ST: "attack", CF: "attack"
  };
  const zone = formation.zones.find(item => item.id === zoneByPosition[player.pos]);
  return zone?.slots.find(slot => available.includes(slot)) || null;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getInitials(name) {
  return name.split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

function ovrColor(ovr) {
  if (ovr >= 91) return "#ffd700";
  if (ovr >= 87) return "#00e676";
  if (ovr >= 84) return "#448aff";
  return "#90a4ae";
}
