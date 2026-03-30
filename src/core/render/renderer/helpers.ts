import { fileOf, rankOf } from '../../state/board/coords';
import { Square } from '../../state/board/types';

/**
 * Helper to compute light/dark square parity.
 * Returns true for light squares, false for dark.
 * Convention: a1 is dark in many sets; here we follow theming from state (renderer decides).
 * If you need the classic pattern where a1 is dark, use: (file + rank) % 2 === 1
 */
export function isLightSquare(sq: Square): boolean {
	const f = fileOf(sq);
	const r = rankOf(sq);
	return ((f + r) & 1) === 1;
}
