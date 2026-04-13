import type { Color, Piece, Role } from './types';

/**
 * Compact piece encoding
 * - 0 = empty
 * - 1..6 = white: pawn=1, knight=2, bishop=3, rook=4, queen=5, king=6
 * - 9..14 = black: same as white + 8
 */

export const enum PieceCodeBase {
	Empty = 0,
	Pawn = 1,
	Knight = 2,
	Bishop = 3,
	Rook = 4,
	Queen = 5,
	King = 6
}

const BLACK_SHIFT = 8;

export type PieceCode = number;

export function encodePiece(piece: Piece): PieceCode {
	const base = roleToBase(piece.role);
	return piece.color === 'white' ? base : base + BLACK_SHIFT;
}

export function decodePiece(code: PieceCode): Piece | null {
	if (code <= PieceCodeBase.Empty) return null;
	const color: Color = code >= BLACK_SHIFT ? 'black' : 'white';
	const base = color === 'black' ? code - BLACK_SHIFT : code;
	return { color, role: baseToRole(base) };
}

export function isEmpty(code: PieceCode): boolean {
	return code === PieceCodeBase.Empty;
}

export function isWhiteCode(code: PieceCode): boolean {
	return code > PieceCodeBase.Empty && code < BLACK_SHIFT;
}

export function isBlackCode(code: PieceCode): boolean {
	return code >= BLACK_SHIFT;
}

function roleToBase(role: Role): PieceCodeBase {
	switch (role) {
		case 'pawn':
			return PieceCodeBase.Pawn;
		case 'knight':
			return PieceCodeBase.Knight;
		case 'bishop':
			return PieceCodeBase.Bishop;
		case 'rook':
			return PieceCodeBase.Rook;
		case 'queen':
			return PieceCodeBase.Queen;
		case 'king':
			return PieceCodeBase.King;
		default:
			// Exhaustiveness guard
			return PieceCodeBase.Empty;
	}
}

function baseToRole(base: PieceCodeBase): Role {
	switch (base) {
		case PieceCodeBase.Pawn:
			return 'pawn';
		case PieceCodeBase.Knight:
			return 'knight';
		case PieceCodeBase.Bishop:
			return 'bishop';
		case PieceCodeBase.Rook:
			return 'rook';
		case PieceCodeBase.Queen:
			return 'queen';
		case PieceCodeBase.King:
			return 'king';
		default:
			throw new RangeError(`Invalid base role code: ${base}`);
	}
}
