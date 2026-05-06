import { afterEach, describe, expect, it } from 'vitest';
import {
	_resetInstanceCounter,
	createPieceSymbolResolver,
	ensurePieceSymbolsDefined
} from '../../../../src/extensions/first-party/main-renderer/piece-symbols.js';
import { clearDefinitionSlotChildren, SVG_NS } from '../../../../src/render/svg/helpers.js';
import {
	ALL_NON_EMPTY_PIECE_CODES,
	PieceCode
} from '../../../../src/state/board/types/internal.js';
import { createTestPieceUrls } from '../../../test-utils/extensions/first-party/main-renderer/pieces.js';

const pieceUrls = createTestPieceUrls();

function createDefs(): SVGDefsElement {
	const svg = document.createElementNS(SVG_NS, 'svg');
	document.body.appendChild(svg);
	const defs = document.createElementNS(SVG_NS, 'defs');
	svg.appendChild(defs);
	return defs as SVGDefsElement;
}

afterEach(() => {
	document.body.innerHTML = '';
	_resetInstanceCounter();
});

describe('createPieceSymbolResolver', () => {
	it('returns a resolver with a unique prefix', () => {
		const r1 = createPieceSymbolResolver();
		const r2 = createPieceSymbolResolver();
		expect(r1.prefix).not.toBe(r2.prefix);
	});

	it('getHref returns # prefixed symbol id', () => {
		const resolver = createPieceSymbolResolver();
		const href = resolver.getHref(PieceCode.WhiteKing);
		expect(href).toBe(`#${resolver.prefix}-p${PieceCode.WhiteKing}`);
	});

	it('getHref is safe to pass as a bare callback', () => {
		const resolver = createPieceSymbolResolver();
		const fn = resolver.getHref;
		expect(fn(PieceCode.BlackQueen)).toBe(`#${resolver.prefix}-p${PieceCode.BlackQueen}`);
	});
});

describe('ensurePieceSymbolsDefined', () => {
	it('creates 12 symbol elements in defs', () => {
		const defs = createDefs();
		const resolver = createPieceSymbolResolver();
		ensurePieceSymbolsDefined(defs, pieceUrls, resolver);
		expect(defs.children).toHaveLength(12);
	});

	it('symbols are direct children of defs', () => {
		const defs = createDefs();
		const resolver = createPieceSymbolResolver();
		ensurePieceSymbolsDefined(defs, pieceUrls, resolver);
		for (const child of Array.from(defs.children)) {
			expect(child.parentElement).toBe(defs);
			expect(child.tagName).toBe('symbol');
		}
	});

	it('each symbol has data-chessboard-extension-id="renderer"', () => {
		const defs = createDefs();
		const resolver = createPieceSymbolResolver();
		ensurePieceSymbolsDefined(defs, pieceUrls, resolver);
		for (const child of Array.from(defs.children)) {
			expect(child.getAttribute('data-chessboard-extension-id')).toBe('renderer');
		}
	});

	it('each symbol has data-chessboard-id="piece-symbol-{pieceCode}"', () => {
		const defs = createDefs();
		const resolver = createPieceSymbolResolver();
		ensurePieceSymbolsDefined(defs, pieceUrls, resolver);
		for (const pieceCode of ALL_NON_EMPTY_PIECE_CODES) {
			const symbol = defs.querySelector(`[data-chessboard-id="piece-symbol-${pieceCode}"]`);
			expect(symbol).not.toBeNull();
		}
	});

	it('each symbol has viewBox="0 0 1 1"', () => {
		const defs = createDefs();
		const resolver = createPieceSymbolResolver();
		ensurePieceSymbolsDefined(defs, pieceUrls, resolver);
		for (const child of Array.from(defs.children)) {
			expect(child.getAttribute('viewBox')).toBe('0 0 1 1');
		}
	});

	it('each symbol has an id matching the resolver pattern', () => {
		const defs = createDefs();
		const resolver = createPieceSymbolResolver();
		ensurePieceSymbolsDefined(defs, pieceUrls, resolver);
		for (const pieceCode of ALL_NON_EMPTY_PIECE_CODES) {
			const expectedId = `${resolver.prefix}-p${pieceCode}`;
			const symbol = defs.querySelector(`#${expectedId}`);
			expect(symbol).not.toBeNull();
		}
	});

	it('symbol child image uses x=0, y=0, width=1, height=1', () => {
		const defs = createDefs();
		const resolver = createPieceSymbolResolver();
		ensurePieceSymbolsDefined(defs, pieceUrls, resolver);
		for (const child of Array.from(defs.children)) {
			const image = child.querySelector('image');
			expect(image).not.toBeNull();
			expect(image!.getAttribute('x')).toBe('0');
			expect(image!.getAttribute('y')).toBe('0');
			expect(image!.getAttribute('width')).toBe('1');
			expect(image!.getAttribute('height')).toBe('1');
		}
	});

	it('symbol child image has correct href from piece URLs config', () => {
		const defs = createDefs();
		const resolver = createPieceSymbolResolver();
		ensurePieceSymbolsDefined(defs, pieceUrls, resolver);
		for (const pieceCode of ALL_NON_EMPTY_PIECE_CODES) {
			const symbol = defs.querySelector(`[data-chessboard-id="piece-symbol-${pieceCode}"]`);
			const image = symbol!.querySelector('image');
			expect(image!.getAttribute('href')).toBe(pieceUrls[pieceCode]);
		}
	});

	it('repeated calls do not duplicate symbols (idempotent)', () => {
		const defs = createDefs();
		const resolver = createPieceSymbolResolver();
		ensurePieceSymbolsDefined(defs, pieceUrls, resolver);
		ensurePieceSymbolsDefined(defs, pieceUrls, resolver);
		ensurePieceSymbolsDefined(defs, pieceUrls, resolver);
		expect(defs.children).toHaveLength(12);
	});

	it('clearDefinitionSlotChildren removes renderer-owned symbols', () => {
		const defs = createDefs();
		const resolver = createPieceSymbolResolver();
		ensurePieceSymbolsDefined(defs, pieceUrls, resolver);
		expect(defs.children).toHaveLength(12);

		clearDefinitionSlotChildren(defs, 'renderer');
		expect(defs.children).toHaveLength(0);
	});
});
