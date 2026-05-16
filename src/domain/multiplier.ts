import type { PokemonType, TypeSet } from '../types/pokemon';
import type { Multiplier } from '../types/quiz';
import { TYPE_CHART } from '../constants/typeChart';

const VALID_MULTIPLIERS = new Set<Multiplier>([0, 0.25, 0.5, 1, 2, 4]);

export function calcMultiplier(attacker: PokemonType, defender: TypeSet): Multiplier {
  const primary = TYPE_CHART[attacker][defender.primary];
  const secondary = defender.secondary ? TYPE_CHART[attacker][defender.secondary] : 1;
  const result = primary * secondary;
  if (!VALID_MULTIPLIERS.has(result as Multiplier)) {
    throw new Error(`Unexpected multiplier ${result} for ${attacker} vs ${defender.primary}/${defender.secondary ?? '-'}`);
  }
  return result as Multiplier;
}
