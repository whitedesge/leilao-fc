/**
 * IA estratégica – prioriza posições vazias, controla orçamento e é levemente favorável ao humano
 */
class AuctionAI {
  constructor(budget, formationKey, tacticalFormation) {
    this.formation = getFormation(formationKey, tacticalFormation);
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
    return findFormationSlot(this.formation, this.filled, player);
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

    const increments = [1, 5, 10].filter(increment =>
      currentBid + increment <= maxWilling && currentBid + increment <= this.budget
    );
    if (!increments.length) return { action: "pass" };

    const increment = increments[Math.floor(Math.random() * increments.length)];
    const amount = currentBid + increment;
    return { action: "bid", amount, slot };
  }

  buy(player, amount, slot) {
    this.budget -= amount;
    this.squad[slot] = { ...player, price: amount };
    this.filled.add(slot);
  }
}
