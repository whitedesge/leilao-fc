/**
 * IA estratégica – prioriza posições vazias, controla orçamento e é levemente favorável ao humano
 */
class AuctionAI {
  constructor(budget, formationKey) {
    this.formation = FORMATIONS[formationKey];
    this.budget = Math.floor(budget * 0.95); // leve desvantagem
    this.initial = this.budget;
    this.squad = {};
    this.filled = new Set();
  }

  get missing() {
    return this.formation.slots.filter(s => !this.filled.has(s));
  }

  isComplete() {
    return this.filled.size >= this.formation.slots.length;
  }

  /** Mapeia posição do jogador para o melhor slot ainda livre */
  bestSlot(player) {
    const miss = this.missing;
    if (!miss.length) return null;
    const p = player.pos;

    if (p === "GK") return miss.includes("GK") ? "GK" : null;
    if (["DEF", "CB"].includes(p)) {
      if (miss.includes("FIX")) return "FIX";
      if (miss.includes("CB1")) return "CB1";
      if (miss.includes("CB2")) return "CB2";
    }
    if (p === "LB" && miss.includes("LB")) return "LB";
    if (p === "RB" && miss.includes("RB")) return "RB";
    if (p === "CDM" && miss.includes("CDM")) return "CDM";
    if (["CM", "CAM"].includes(p)) {
      if (miss.includes("CM1")) return "CM1";
      if (miss.includes("CM2")) return "CM2";
      if (miss.includes("MC")) return "MC";
    }
    if (["LW", "LM"].includes(p)) {
      if (miss.includes("PE")) return "PE";
      if (miss.includes("LW")) return "LW";
    }
    if (["RW", "RM"].includes(p)) {
      if (miss.includes("PD")) return "PD";
      if (miss.includes("RW")) return "RW";
    }
    if (["ST", "CF"].includes(p)) {
      if (miss.includes("ST")) return "ST";
      if (miss.includes("MC")) return "MC";
    }
    // fallback
    if (miss.includes("MC")) return "MC";
    if (miss.includes("ST")) return "ST";
    return miss.find(slot => slot !== "GK") || null;
  }

  /**
   * Decide se oferta e quanto.
   * Retorna { action: 'bid'|'pass', amount?: number, slot?: string }
   */
  decide(player, currentBid) {
    const slot = this.bestSlot(player);
    if (!slot) return { action: "pass" };

    const remainingSlots = this.missing.length;
    let fair = player.ovr * 0.40;

    // Prioridade extra para goleiro e quando faltam poucos
    if (slot === "GK") fair *= 1.22;
    if (remainingSlots <= 2) fair *= 1.12;

    // Hesitação (vantagem humana)
    const hesitation = 0.82 + Math.random() * 0.12; // 0.82–0.94
    let maxWilling = Math.floor(fair * hesitation);

    // Não estourar mais de 32% do orçamento restante (exceto últimos)
    if (remainingSlots > 1) {
      maxWilling = Math.min(maxWilling, Math.floor(this.budget * 0.32));
    }
    maxWilling = Math.min(maxWilling, this.budget);

    if (currentBid >= maxWilling) return { action: "pass" };

    // Chance de passar mesmo podendo (imprevisibilidade + favor humano)
    if (Math.random() < 0.22 && remainingSlots > 2) return { action: "pass" };

    const increment = Math.max(1, Math.floor(1 + Math.random() * 3 + player.ovr * 0.02));
    const amount = Math.min(currentBid + increment, maxWilling);

    if (amount <= currentBid) return { action: "pass" };
    return { action: "bid", amount, slot };
  }

  buy(player, amount, slot) {
    this.budget -= amount;
    this.squad[slot] = { ...player, price: amount };
    this.filled.add(slot);
  }
}
