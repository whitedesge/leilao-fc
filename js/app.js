/**
 * Leilão FC – Lógica principal
 * Modos: Online (PeerJS), Local 2P, vs IA
 */

const State = {
  mode: null,          // 'online' | 'local2p' | 'ai'
  formation: null,     // 'futsal' | 'campo'
  tacticalFormation: "4-3-3",
  phase: "menu",       // menu | lobby | auction | end
  players: [           // index 0 = P1 (humano principal), 1 = P2 ou IA
    { name: "Jogador 1", budget: 0, squad: {}, filled: new Set() },
    { name: "Jogador 2", budget: 0, squad: {}, filled: new Set() }
  ],
  ai: null,
  queue: [],
  current: null,
  currentBid: 0,
  lastBidder: null,    // 0 | 1 | null
  noBidPasses: 0,
  turn: 0,             // 0 ou 1
  history: [],
  peer: null,
  conn: null,
  isHost: false,
  myPeerId: null,
  roomCode: null,
  gameStarted: false
};

/* ========== UI ========== */
function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
}

function toast(msg, ms = 2600) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), ms);
}

function setBadge(text) {
  const b = document.getElementById("mode-badge");
  if (b) b.textContent = text;
}

/* ========== MENU ========== */
document.addEventListener("DOMContentLoaded", () => {
  show("screen-menu");
  bindMenu();
  bindGameButtons();
});

function bindMenu() {
  document.getElementById("btn-home").onclick = () => {
    if (State.peer) {
      try { State.peer.destroy(); } catch (error) {}
    }
    State.peer = null;
    State.conn = null;
    State.mode = null;
    State.phase = "menu";
    State.gameStarted = false;
    show("screen-menu");
    setBadge("Menu");
  };

  document.getElementById("btn-mode-ai").onclick = () => chooseMode("ai");
  document.getElementById("btn-mode-local").onclick = () => chooseMode("local2p");
  document.getElementById("btn-mode-online").onclick = () => chooseMode("online");

  document.getElementById("btn-form-futsal").onclick = () => chooseFormation("futsal");
  document.getElementById("btn-form-campo").onclick = () => chooseFormation("campo");
  document.getElementById("btn-back-form").onclick = () => show("screen-menu");
  document.getElementById("tactical-formation").onchange = event => {
    State.tacticalFormation = event.target.value;
    updateTacticalSummary();
    if (State.mode === "ai" && State.formation === "campo") {
      State.ai = new AuctionAI(FORMATIONS.campo.budget, "campo", State.tacticalFormation);
    }
  };
  document.getElementById("btn-start-game").onclick = startAuction;

  const btnBackLobby = document.getElementById("btn-back-lobby");
  if (btnBackLobby) {
    btnBackLobby.onclick = () => {
      if (State.peer) try { State.peer.destroy(); } catch(e){}
      show("screen-menu");
    };
  }

  // Removido btn-create-room (não existe no HTML)
  const btnJoin = document.getElementById("btn-join-room");
  if (btnJoin) btnJoin.onclick = joinOnlineRoom;

  const btnRestart = document.getElementById("btn-restart");
  if (btnRestart) btnRestart.onclick = () => location.reload();

  document.querySelectorAll('.card[role="button"]').forEach(card => {
    card.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      if (!event.repeat) card.click();
    });
  });
}

function chooseMode(mode) {
  State.mode = mode;
  if (mode === "online") {
    show("screen-online");
    initPeer();
  } else {
    show("screen-formation");
  }
}

function chooseFormation(key) {
  State.formation = key;
  State.tacticalFormation = "4-3-3";
  document.getElementById("tactical-formation").value = State.tacticalFormation;
  document.getElementById("tactical-choice").style.display = key === "campo" ? "block" : "none";
  const f = getFormation(key, State.tacticalFormation);
  State.players[0].budget = f.budget;
  State.players[0].name = State.mode === "local2p" ? "Jogador 1" : "Você";
  State.players[1].budget = f.budget;
  State.players[1].name = State.mode === "ai" ? "IA" :
    State.mode === "online" ? "Oponente" : "Jogador 2";
  State.players[0].squad = {};
  State.players[0].filled = new Set();
  State.players[1].squad = {};
  State.players[1].filled = new Set();
  State.history = [];
  State.gameStarted = false;
  State.phase = "lobby";

  if (State.mode === "ai") {
    State.ai = new AuctionAI(f.budget, key, State.tacticalFormation);
  }

  setBadge(key === "futsal" ? "Futsal · R$50" : `Campo ${State.tacticalFormation} · R$150`);
  document.getElementById("lobby-mode-label").textContent =
    State.mode === "ai" ? "Contra a Máquina" :
    State.mode === "local2p" ? "Local 2 Jogadores (mesmo dispositivo)" : "Online 1v1";

  document.getElementById("lobby-budget").textContent = `R$ ${f.budget}`;
  document.getElementById("lobby-slots").textContent = f.slots.length + " jogadores";
  updateTacticalSummary();
  show("screen-lobby");
  renderFormationPreview();
}

function getCurrentFormation() {
  return getFormation(State.formation, State.tacticalFormation);
}

function updateTacticalSummary() {
  const summary = document.getElementById("formation-distribution");
  if (!summary || State.formation !== "campo") return;
  const counts = TACTICAL_FORMATIONS[State.tacticalFormation];
  summary.textContent = `${counts.defense} na defesa · ${counts.midfield} no meio · ${counts.attack} no ataque · 1 goleiro`;
  document.getElementById("lobby-slots").textContent =
    `${counts.defense + counts.midfield + counts.attack + 1} jogadores`;
  setBadge(`Campo ${State.tacticalFormation} · R$150`);
}

/* ========== ONLINE (PeerJS) ========== */
function initPeer() {
  const status = document.getElementById("online-status");
  status.textContent = "Conectando ao PeerJS...";
  State.peer = new Peer({ debug: 0 });

  State.peer.on("open", id => {
    State.myPeerId = id;
    // Gera código amigável curto a partir do ID
    State.roomCode = "FUT-" + id.slice(-4).toUpperCase();
    document.getElementById("my-room-code").textContent = State.roomCode;
    document.getElementById("my-peer-id").textContent = id;
    status.textContent = "Pronto! Compartilhe o código ou o ID completo.";
    document.getElementById("create-section").style.display = "block";
  });

  State.peer.on("connection", conn => {
    State.conn = conn;
    State.isHost = true;
    setupConn(conn);
    toast("Oponente conectado!");
    // Host escolhe formação depois
    show("screen-formation");
  });

  State.peer.on("error", err => {
    status.textContent = "Erro: " + (err.type || err);
  });
}

function createOnlineRoom() {
  // Já estamos com peer aberto; só espera conexão
  toast("Aguardando oponente entrar com seu código/ID...");
}

function joinOnlineRoom() {
  const input = document.getElementById("join-input").value.trim();
  if (!input) return toast("Digite o código ou ID da sala");
  // Se for FUT-XXXX, não temos mapeamento real sem backend → usa o ID completo
  // Usuário deve colar o Peer ID completo mostrado
  const targetId = input.startsWith("FUT-") ? null : input;
  if (!targetId) {
    toast("Cole o ID completo do Peer (não só o código FUT-). O código é só visual.");
    return;
  }
  const conn = State.peer.connect(targetId);
  State.conn = conn;
  State.isHost = false;
  setupConn(conn);
}

function setupConn(conn) {
  conn.on("open", () => {
    toast("Conexão estabelecida!");
    if (!State.isHost) {
      document.getElementById("online-status").textContent = "Conectado! Aguardando host escolher formato...";
    }
  });
  conn.on("data", handlePeerMsg);
  conn.on("close", () => {
    toast("Oponente desconectou");
    show("screen-menu");
  });
}

function handlePeerMsg(data) {
  if (data.type === "start") {
    State.formation = data.formation;
    State.tacticalFormation = data.tacticalFormation || "4-3-3";
    State.queue = data.queue.map(id => PLAYERS_DB.find(p => p.id === id)).filter(Boolean);
    State.players[0].budget = FORMATIONS[data.formation].budget;
    State.players[1].budget = FORMATIONS[data.formation].budget;
    State.players[0].name = "Você";
    State.players[1].name = "Oponente";
    State.turn = data.hostStarts ? 1 : 0; // se host começa, eu (guest) sou turn 1
    if (!State.isHost) State.turn = data.hostStarts ? 1 : 0;
    else State.turn = data.hostStarts ? 0 : 1;
    State.gameStarted = true;
    State.phase = "auction";
    setBadge(data.formation === "futsal"
      ? "Online 1v1 · Futsal"
      : `Online 1v1 · ${State.tacticalFormation}`);
    show("screen-game");
    nextPlayer();
    updateAllUI();
  } else if (data.type === "bid") {
    State.currentBid = data.amount;
    State.lastBidder = "opp";
    State.noBidPasses = 0;
    State.history.unshift({ name: State.current?.name, amount: data.amount, by: "Oponente" });
    State.turn = State.isHost ? 0 : 1; // minha vez
    updateAuctionUI();
    updateAllUI();
    toast(`Oponente ofertou R$ ${data.amount}`);
  } else if (data.type === "pass") {
    if (State.lastBidder === 0 || State.lastBidder === "me") {
      awardTo(State.isHost ? 0 : 1);
    } else {
      State.noBidPasses += 1;
      if (State.noBidPasses >= 2) {
        toast("Ninguém quis o jogador. Próximo...");
        nextPlayer();
        return;
      }
      State.turn = State.isHost ? 1 : 0;
      updateAuctionUI();
    }
  } else if (data.type === "award") {
    const winner = State.isHost ? data.winner : 1 - data.winner;
    awardTo(winner, false);
  }
}

/* ========== LOBBY → START ========== */
function startAuction() {
  if (State.mode === "online" && State.isHost && State.conn) {
    const f = State.formation;
    State.queue = shuffle(PLAYERS_DB).slice(0, f === "futsal" ? 30 : 45);
    State.conn.send({
      type: "start",
      formation: f,
      tacticalFormation: State.tacticalFormation,
      queue: State.queue.map(p => p.id),
      hostStarts: true
    });
    State.turn = 0;
    State.gameStarted = true;
    State.phase = "auction";
    setBadge(State.formation === "futsal"
      ? "Online 1v1 · Futsal"
      : `Online 1v1 · ${State.tacticalFormation}`);
    show("screen-game");
    nextPlayer();
    updateAllUI();
    return;
  }

  // Local / AI
  const f = getCurrentFormation();
  if (State.mode === "ai") {
    State.ai = new AuctionAI(f.budget, State.formation, State.tacticalFormation);
  }
  State.queue = shuffle(PLAYERS_DB).slice(0, State.formation === "futsal" ? 30 : 45);
  State.turn = 0;
  State.gameStarted = true;
  State.phase = "auction";
  State.lastBidder = null;
  show("screen-game");
  nextPlayer();
  updateAllUI();
}

/* ========== AUCTION CORE ========== */
function nextPlayer() {
  if (checkEnd()) return;

  if (State.queue.length === 0) {
    State.queue = shuffle(PLAYERS_DB).slice(0, 15);
  }

  State.current = State.queue.shift();
  State.currentBid = 0;
  State.lastBidder = null;
  State.noBidPasses = 0;

  // Alterna quem começa o turno (exceto se online já definido)
  if (State.mode !== "online") {
    // No local 2P e AI, começa sempre pelo jogador 0 na primeira, depois alterna naturalmente
  }

  updateAuctionUI();
  updateAllUI();

  // Se for vez da IA
  if (State.mode === "ai" && State.turn === 1) {
    setTimeout(aiAct, 900 + Math.random() * 700);
  }
}

function updateAuctionUI() {
  const p = State.current;
  if (!p) return;

  const av = document.getElementById("p-avatar");
  av.textContent = getInitials(p.name);
  av.style.borderColor = ovrColor(p.ovr);
  av.style.color = ovrColor(p.ovr);

  document.getElementById("p-name").textContent = p.name;
  document.getElementById("p-pos").textContent = p.pos;
  document.getElementById("p-club").textContent = p.club;
  document.getElementById("p-nation").textContent = p.nation;
  document.getElementById("p-ovr").textContent = p.ovr;
  document.getElementById("p-era").textContent = p.era || "";
  document.getElementById("bid-value").textContent = "R$ " + State.currentBid;

  const turnEl = document.getElementById("turn-ind");
  const isMyTurn = (State.mode === "ai" && State.turn === 0) ||
                   (State.mode === "local2p") ||
                   (State.mode === "online" && ((State.isHost && State.turn === 0) || (!State.isHost && State.turn === 1)));

  if (State.mode === "local2p") {
    turnEl.className = "turn-indicator " + (State.turn === 0 ? "yours" : "opponent");
    turnEl.textContent = State.turn === 0
      ? "🎯 Vez do Jogador 1 – Ofertar ou Passar"
      : "🎯 Vez do Jogador 2 – Ofertar ou Passar (passe o dispositivo)";
  } else if (State.mode === "ai") {
    if (State.turn === 0) {
      turnEl.className = "turn-indicator yours";
      turnEl.textContent = "🎯 Seu turno – Ofertar ou Passar";
    } else {
      turnEl.className = "turn-indicator opponent";
      turnEl.textContent = "🤖 IA está decidindo...";
    }
  } else {
    // online
    if (isMyTurn) {
      turnEl.className = "turn-indicator yours";
      turnEl.textContent = "🎯 Seu turno – Ofertar ou Passar";
    } else {
      turnEl.className = "turn-indicator opponent";
      turnEl.textContent = "⏳ Aguardando oponente...";
    }
  }

  const controls = document.getElementById("bid-controls");
  const canAct = (State.mode === "local2p") ||
                 (State.mode === "ai" && State.turn === 0) ||
                 (State.mode === "online" && isMyTurn);
  controls.style.display = canAct ? "flex" : "none";
  const myBudget = State.mode === "local2p"
    ? State.players[State.turn].budget
    : State.players[0].budget;
  const actor = State.mode === "local2p" ? State.turn : 0;
  const hasSlot = Boolean(findSlot(State.players[actor], p));
  controls.querySelectorAll("[data-increment]").forEach(button => {
    const increment = Number(button.dataset.increment);
    button.disabled = !hasSlot || State.currentBid + increment > myBudget;
  });
}

function doBid(increment) {
  const amount = State.currentBid + increment;
  const actor = State.mode === "local2p" ? State.turn : 0;
  const budget = State.players[actor].budget;

  if (![1, 5, 10].includes(increment)) {
    return;
  }
  if (!findSlot(State.players[actor], State.current)) {
    toast("Não há vaga compatível no seu elenco para este jogador.");
    return;
  }
  if (amount > budget) {
    toast("Orçamento insuficiente!");
    return;
  }

  State.currentBid = amount;
  State.lastBidder = actor;
  State.noBidPasses = 0;
  State.history.unshift({
    name: State.current.name,
    amount,
    by: State.players[actor].name
  });

  if (State.mode === "online" && State.conn) {
    State.conn.send({ type: "bid", amount, by: State.isHost ? 0 : 1 });
  }

  // Passa a vez
  if (State.mode === "local2p") {
    State.turn = 1 - State.turn;
  } else if (State.mode === "ai") {
    State.turn = 1;
    updateAuctionUI();
    updateAllUI();
    setTimeout(aiAct, 800 + Math.random() * 600);
    return;
  } else {
    State.turn = State.isHost ? 1 : 0;
  }
  updateAuctionUI();
  updateAllUI();
}

function doPass() {
  const actor = State.mode === "local2p" ? State.turn : 0;

  if (State.mode === "online" && State.conn) {
    State.conn.send({ type: "pass" });
    if (State.lastBidder === "opp") return;
  }

  // Lógica de quem leva
  if (State.lastBidder !== null && State.lastBidder !== actor) {
    // O outro tinha ofertado → ele leva
    awardTo(State.lastBidder);
    return;
  }
  if (State.lastBidder === actor) {
    // Eu ofertei e agora passo? Não faz sentido no fluxo normal; trata como desistência
    // Se só eu ofertei e passo, o lance volta
  }

  // Se ninguém ofertou ainda, ou ambos passam
  if (State.lastBidder === null) {
    // Primeiro a passar → só muda o turno
    if (State.mode === "local2p") {
      State.noBidPasses += 1;
      if (State.noBidPasses >= 2) {
        toast("Ninguém quis o jogador. Próximo...");
        nextPlayer();
        return;
      }
      State.turn = 1 - State.turn;
      updateAuctionUI();
      updateAllUI();
      return;
    }
    if (State.mode === "ai") {
      State.turn = 1;
      updateAuctionUI();
      setTimeout(aiAct, 600);
      return;
    }
    // online
    State.turn = State.isHost ? 1 : 0;
    updateAuctionUI();
    return;
  }

  // Ambos passaram (lastBidder existe e o atual também passou)
  toast("Ninguém quis o jogador. Próximo...");
  setTimeout(nextPlayer, 900);
}

function aiAct() {
  if (State.turn !== 1 || State.mode !== "ai") return;
  const decision = State.ai.decide(State.current, State.currentBid);

  if (decision.action === "bid") {
    State.currentBid = decision.amount;
    State.lastBidder = 1;
    State.history.unshift({
      name: State.current.name,
      amount: decision.amount,
      by: "IA"
    });
    toast(`IA ofertou R$ ${decision.amount}`);
    State.turn = 0;
    updateAuctionUI();
    updateAllUI();
  } else {
    // IA passa
    if (State.lastBidder === 0) {
      awardTo(0);
    } else {
      State.turn = 0;
      toast("IA passou. Próximo jogador...");
      setTimeout(nextPlayer, 900);
    }
  }
}

function awardTo(playerIndex, notifyOpponent = true) {
  const p = State.current;
  const price = State.currentBid;
  const pl = State.players[playerIndex];

  let slot = null;
  if (playerIndex === 1 && State.mode === "ai") {
    slot = State.ai.bestSlot(p);
    if (slot) State.ai.buy(p, price, slot);
  } else {
    slot = findSlot(pl, p);
    if (slot) {
      pl.budget -= price;
      pl.squad[slot] = { ...p, price };
      pl.filled.add(slot);
    }
  }

  if (!slot) {
    toast("Não há vaga compatível para este jogador.");
    return;
  }

  const who = pl.name;
  toast(`✅ ${who} contratou ${p.name} por R$ ${price}`);
  State.history.unshift({ name: p.name, amount: price, by: who + " (venceu)" });

  if (State.mode === "online" && State.conn && notifyOpponent) {
    State.conn.send({ type: "award", winner: playerIndex });
  }

  updateAllUI();
  setTimeout(nextPlayer, 1100);
}

function findSlot(playerObj, playerCard) {
  return findFormationSlot(getCurrentFormation(), playerObj.filled, playerCard);
}

function checkEnd() {
  const f = getCurrentFormation();
  const need = f.slots.length;
  const p0done = State.players[0].filled.size >= need;
  const p1done = State.mode === "ai"
    ? State.ai.isComplete()
    : State.players[1].filled.size >= need;

  if (p0done && p1done) {
    endGame();
    return true;
  }
  return false;
}

function endGame() {
  const f = getCurrentFormation();
  State.phase = "end";
  show("screen-end");

  const ovr0 = Object.values(State.players[0].squad).reduce((s, x) => s + x.ovr, 0);
  let ovr1 = 0;
  if (State.mode === "ai") {
    ovr1 = Object.values(State.ai.squad).reduce((s, x) => s + x.ovr, 0);
  } else {
    ovr1 = Object.values(State.players[1].squad).reduce((s, x) => s + x.ovr, 0);
  }

  document.getElementById("end-ovr0").textContent = ovr0;
  document.getElementById("end-ovr1").textContent = ovr1;
  document.getElementById("end-name0").textContent = State.players[0].name;
  document.getElementById("end-name1").textContent = State.players[1].name;

  const box0 = document.getElementById("end-box0");
  const box1 = document.getElementById("end-box1");
  box0.classList.remove("winner");
  box1.classList.remove("winner");

  if (ovr0 > ovr1) {
    document.getElementById("end-title").textContent = "🏆 Vitória de " + State.players[0].name + "!";
    box0.classList.add("winner");
  } else if (ovr1 > ovr0) {
    document.getElementById("end-title").textContent = "🏆 Vitória de " + State.players[1].name + "!";
    box1.classList.add("winner");
  } else {
    document.getElementById("end-title").textContent = "🤝 Empate técnico!";
  }

  // listas
  const l0 = document.getElementById("end-list0");
  l0.innerHTML = "";
  Object.entries(State.players[0].squad).forEach(([slot, p]) => {
    const li = document.createElement("li");
    li.textContent = `${f.labels[slot] || slot}: ${p.name} (${p.ovr}) – R$${p.price}`;
    l0.appendChild(li);
  });

  const l1 = document.getElementById("end-list1");
  l1.innerHTML = "";
  const src = State.mode === "ai" ? State.ai.squad : State.players[1].squad;
  Object.entries(src).forEach(([slot, p]) => {
    const li = document.createElement("li");
    li.textContent = `${f.labels[slot] || slot}: ${p.name} (${p.ovr}) – R$${p.price}`;
    l1.appendChild(li);
  });
}

/* ========== RENDER UI ========== */
function updateAllUI() {
  const f = getCurrentFormation();
  if (!f) return;

  // Orçamentos
  document.getElementById("budget0").textContent = "R$ " + State.players[0].budget;
  document.getElementById("budget0").className = "budget" + (State.players[0].budget < 12 ? " low" : "");

  let b1 = State.mode === "ai" ? State.ai.budget : State.players[1].budget;
  document.getElementById("budget1").textContent = "R$ " + b1;

  // Progresso
  const need = f.slots.length;
  const filled0 = State.players[0].filled.size;
  document.getElementById("prog0").style.width = (filled0 / need * 100) + "%";
  document.getElementById("count0").textContent = filled0 + "/" + need;

  // Formação visual
  renderPitch("pitch0", State.players[0], f);
  if (State.mode === "ai") {
    renderPitch("pitch1", { squad: State.ai.squad, filled: State.ai.filled }, f);
  } else {
    renderPitch("pitch1", State.players[1], f);
  }

  // Histórico
  const hist = document.getElementById("hist-list");
  hist.innerHTML = "";
  State.history.slice(0, 10).forEach(h => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${h.name}</strong> — R$ ${h.amount} <em>(${h.by})</em>`;
    hist.appendChild(li);
  });
}

function renderPitch(containerId, playerObj, formation) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = "";
  el.className = "pitch " + State.formation;

  if (formation.zones) {
    const zones = document.createElement("div");
    zones.className = "pitch-zones";
    formation.zones.forEach(zone => {
      const zoneEl = document.createElement("div");
      zoneEl.className = "pitch-zone";
      zoneEl.dataset.zone = zone.id;
      const label = document.createElement("span");
      label.className = "pitch-zone-label";
      label.textContent = zone.label;
      const slots = document.createElement("div");
      slots.className = "pitch-zone-slots";
      zone.slots.forEach(slot => slots.appendChild(createPitchSlot(slot, playerObj, formation)));
      zoneEl.append(label, slots);
      zones.appendChild(zoneEl);
    });
    el.appendChild(zones);
    const goalkeeper = document.createElement("div");
    goalkeeper.className = "pitch-goalkeeper";
    goalkeeper.appendChild(createPitchSlot(formation.goalkeeper, playerObj, formation));
    el.appendChild(goalkeeper);
    return;
  }

  formation.slots.forEach(slot => {
    el.appendChild(createPitchSlot(slot, playerObj, formation));
  });
}

function createPitchSlot(slot, playerObj, formation) {
  const div = document.createElement("div");
  div.className = "slot " + slot;
  if (playerObj.squad[slot]) {
    const player = playerObj.squad[slot];
    div.innerHTML = `<span class="s-name">${player.name.split(" ").pop()}</span><span class="s-ovr">${player.ovr}</span>`;
    div.classList.add("filled");
    div.style.borderColor = ovrColor(player.ovr);
  } else {
    div.innerHTML = `<span class="s-empty">${formation.labels[slot] || slot}</span>`;
  }
  return div;
}

function renderFormationPreview() {
  // no lobby
}

function bindGameButtons() {
  document.querySelectorAll("[data-increment]").forEach(button => {
    button.onclick = () => doBid(Number(button.dataset.increment));
  });
  document.getElementById("btn-pass").onclick = doPass;
}
