import { fileOf, rankOf } from '../../state/board/coords';
import { Square } from '../../state/board/types';

export const SVG_NS = 'http://www.w3.org/2000/svg';

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

export function createSvgGroup(doc: Document, attrs: { [key: string]: string }): SVGGElement {
	const el = doc.createElementNS(SVG_NS, 'g');
	for (const [key, value] of Object.entries(attrs)) {
		el.setAttribute(key, value);
	}
	return el;
}
