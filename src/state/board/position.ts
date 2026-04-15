import { normalizePiece, normalizeSquare } from './normalize';
import { PieceInput, PositionInput, PositionMapString, SquareString } from './types/input';
import { SQUARE_COUNT } from './types/internal';
import { BoardStateInternal } from './types/main';

export const START_POSITION: PositionMapString = {
	a1: 'wR',
	b1: 'wN',
	c1: 'wB',
	d1: 'wQ',
	e1: 'wK',
	f1: 'wB',
	g1: 'wN',
	h1: 'wR',
	a2: 'wp',
	b2: 'wp',
	c2: 'wp',
	d2: 'wp',
	e2: 'wp',
	f2: 'wp',
	g2: 'wp',
	h2: 'wp',
	a8: 'bR',
	b8: 'bN',
	c8: 'bB',
	d8: 'bQ',
	e8: 'bK',
	f8: 'bB',
	g8: 'bN',
	h8: 'bR',
	a7: 'bp',
	b7: 'bp',
	c7: 'bp',
	d7: 'bp',
	e7: 'bp',
	f7: 'bp',
	g7: 'bp',
	h7: 'bp'
	// All other squares are implicitly empty (undefined)
};

export function parsePositionInput(input: PositionInput): BoardStateInternal['pieces'] {
	const out = new Uint8Array(SQUARE_COUNT);
	const start = input === 'start' ? START_POSITION : input;
	for (const [sq, piece] of Object.entries(start) as [SquareString, PieceInput][]) {
		const square = normalizeSquare(sq);
		const pieceCode = normalizePiece(piece);
		out[square] = pieceCode;
	}
	return out;
}
