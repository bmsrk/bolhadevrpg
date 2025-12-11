// dice utility functions

export interface RollResult {
  successes: number;
  rolls: number[];
  isSuccess: boolean;
  message: string;
}

export const rollDice = (pool: number): RollResult => {
  const rolls: number[] = [];
  let successes = 0;

  for (let i = 0; i < pool; i++) {
    const die = Math.ceil(Math.random() * 6);
    rolls.push(die);
    if (die >= 5) successes += 1;
    if (die === 6) successes += 1; // 6 counts as 2 successes per prompts
  }

  return {
    successes,
    rolls,
    isSuccess: successes > 0,
    message: `[${rolls.join(', ')}] -> ${successes} Sucessos`
  };
};

export const resolveCombatRound = (
  attackerAttr: number,
  defenderAttr: number
): { damage: number, narration: string } => {
  const attackRoll = rollDice(attackerAttr);
  const defenseRoll = rollDice(defenderAttr);

  const netSuccesses = Math.max(0, attackRoll.successes - defenseRoll.successes);
  
  return {
    damage: netSuccesses,
    narration: `Atk: ${attackRoll.message} vs Def: ${defenseRoll.message}. Dano: ${netSuccesses}`
  };
};
