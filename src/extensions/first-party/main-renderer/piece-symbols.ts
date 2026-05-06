import { SVG_NS } from '../../../render/svg/helpers.js';
import {
	ALL_NON_EMPTY_PIECE_CODES,
	NonEmptyPieceCode
} from '../../../state/board/types/internal.js';
import type { PieceUrls } from './types/internal.js';

// ─── Symbol ID generation ─────────────────────────────────────────────────────

let nextInstanceId = 0;

/**
 * Generates a unique instance prefix for symbol ids.
 * Deterministic per call order within a JS runtime session.
 */
function generateInstancePrefix(): string {
	return `cb${nextInstanceId++}`;
}

// ─── PieceSymbolResolver ──────────────────────────────────────────────────────

export interface PieceSymbolResolver {
	/** Returns the href suitable for <use href="..."> (e.g., "#cb0-p6") */
	getHref(pieceCode: NonEmptyPieceCode): string;
	/** The unique prefix for this renderer instance */
	readonly prefix: string;
}

/**
 * Creates a PieceSymbolResolver with a unique prefix.
 * getHref is a closure and safe to pass as a bare callback.
 */
export function createPieceSymbolResolver(): PieceSymbolResolver {
	const prefix = generateInstancePrefix();

	const getHref = (pieceCode: NonEmptyPieceCode): string => {
		return `#${prefix}-p${pieceCode}`;
	};

	return { getHref, prefix };
}

// ─── Symbol DOM creation ──────────────────────────────────────────────────────

function getSymbolId(prefix: string, pieceCode: NonEmptyPieceCode): string {
	return `${prefix}-p${pieceCode}`;
}

function getSymbolDataId(pieceCode: NonEmptyPieceCode): string {
	return `piece-symbol-${pieceCode}`;
}

/**
 * Ensures all 12 piece symbols exist in the defs element.
 * Idempotent: checks the actual DOM for each symbol id before creating.
 */
export function ensurePieceSymbolsDefined(
	defs: SVGDefsElement,
	config: PieceUrls,
	resolver: PieceSymbolResolver
): void {
	const doc = defs.ownerDocument;

	for (const pieceCode of ALL_NON_EMPTY_PIECE_CODES) {
		const symbolId = getSymbolId(resolver.prefix, pieceCode);

		// Idempotency: check if this symbol already exists in the DOM
		if (defs.querySelector(`#${symbolId}`)) {
			continue;
		}

		const symbol = doc.createElementNS(SVG_NS, 'symbol');
		symbol.setAttribute('id', symbolId);
		symbol.setAttribute('data-chessboard-extension-id', 'renderer');
		symbol.setAttribute('data-chessboard-id', getSymbolDataId(pieceCode));
		symbol.setAttribute('viewBox', '0 0 1 1');

		const image = doc.createElementNS(SVG_NS, 'image');
		image.setAttribute('href', config[pieceCode]);
		image.setAttribute('x', '0');
		image.setAttribute('y', '0');
		image.setAttribute('width', '1');
		image.setAttribute('height', '1');

		symbol.appendChild(image);
		defs.appendChild(symbol);
	}
}

/**
 * Resets the instance counter. Only for testing purposes.
 * @internal
 */
export function _resetInstanceCounter(): void {
	nextInstanceId = 0;
}
