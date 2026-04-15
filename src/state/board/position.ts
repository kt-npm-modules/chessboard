import { parse } from '@echecs/fen';
import { normalizeColor, normalizePiece, normalizeSquare } from './normalize';
import {
	FenString,
	PieceInput,
	PiecePositionInput,
	PiecePositionInputRecord,
	PiecePositionRecord,
	PiecePositionRecordString,
	PositionInput,
	PositionInputObject,
	SquareString
} from './types/input';
import { ColorCode, ParsedPosition, SQUARE_COUNT } from './types/internal';

const START_POSITION_RECORD_STRING: PiecePositionRecordString = {
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

function boardParsePositionInputRecord(input: PiecePositionInputRecord): Uint8Array {
	const out = new Uint8Array(SQUARE_COUNT);
	for (const [sq, piece] of Object.entries(input) as [SquareString, PieceInput][]) {
		const square = normalizeSquare(sq);
		const pieceCode = normalizePiece(piece);
		out[square] = pieceCode;
	}
	return out;
}

const START_POSITION_ARRAY = boardParsePositionInputRecord(START_POSITION_RECORD_STRING);

export function boardParsePiecePositionInput(input: PiecePositionInput): Uint8Array {
	const out = new Uint8Array(SQUARE_COUNT);
	if (input === 'start') {
		out.set(START_POSITION_ARRAY);
		return out;
	}
	for (const [sq, piece] of Object.entries(input) as [SquareString, PieceInput][]) {
		const square = normalizeSquare(sq);
		const pieceCode = normalizePiece(piece);
		out[square] = pieceCode;
	}
	return out;
}

function isPositionInputObject(input: PositionInput): input is PositionInputObject {
	return typeof input === 'object' && input !== null && !Array.isArray(input);
}

function boardParsePositionInputFen(input: FenString): ParsedPosition {
	const position = parse(input);
	if (!position) {
		throw new Error('Failed to parse FEN string');
	}
	const piecePositionRecord: PiecePositionRecord = {};
	for (const [square, piece] of position.board) {
		piecePositionRecord[square] = { role: piece.type, color: piece.color };
	}
	return {
		pieces: boardParsePositionInputRecord(piecePositionRecord),
		turn: normalizeColor(position.turn)
	};
}

export function boardParsePosition(input: PositionInput): ParsedPosition {
	if (input === 'start') {
		return {
			pieces: START_POSITION_ARRAY,
			turn: ColorCode.White
		};
	}
	if (isPositionInputObject(input)) {
		return {
			pieces: boardParsePiecePositionInput(input.pieces ?? 'start'),
			turn: normalizeColor(input.turn ?? 'white')
		};
	}
	// So this one is FEN string left
	return boardParsePositionInputFen(input);
}
