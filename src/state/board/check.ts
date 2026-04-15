import {
	Color,
	ColorShort,
	Piece,
	PiecePositionInput,
	PiecePositionRecord,
	PiecePositionRecordShort,
	PiecePositionRecordString,
	PieceShort,
	PieceString,
	Role,
	RoleShort,
	SquareString
} from './types/input';
import {
	ColorCode,
	PieceCode,
	RolePromotionCode,
	Square,
	SquareFile,
	SquareRank
} from './types/internal';
import { BoardStateSnapshot } from './types/main';

export function isWhiteCode(code: PieceCode): boolean {
	return code > PieceCode.Empty && code < ColorCode.Black;
}

export function isBlackCode(code: PieceCode): boolean {
	return code >= ColorCode.Black;
}

export function isOccupied(board: BoardStateSnapshot, sq: Square): boolean {
	return board.pieces[sq] > PieceCode.Empty;
}

export function isEmpty(code: PieceCode): boolean {
	return code === PieceCode.Empty;
}

export function positionsEqual(pos1: BoardStateSnapshot, pos2: BoardStateSnapshot): boolean {
	if (pos1.positionEpoch !== pos2.positionEpoch) return false;
	for (let i = 0; i < pos1.pieces.length; i++) {
		if (pos1.pieces[i] !== pos2.pieces[i]) return false;
	}
	return true;
}

export function isRank(n: number): n is SquareRank {
	return Number.isInteger(n) && n >= 0 && n < 8;
}

export function isFile(n: number): n is SquareFile {
	return Number.isInteger(n) && n >= 0 && n < 8;
}

export function isValidSquare(n: number): n is Square {
	return Number.isInteger(n) && n >= 0 && n < 64;
}

export function assertValidSquare(n: number): asserts n is Square {
	if (!isValidSquare(n)) {
		throw new RangeError(`Invalid square index: ${n}`);
	}
}

export function isRolePromotionCode(role: number): role is RolePromotionCode {
	return (
		role === RolePromotionCode.Knight ||
		role === RolePromotionCode.Bishop ||
		role === RolePromotionCode.Rook ||
		role === RolePromotionCode.Queen
	);
}

const PIECE_STRING_REGEX = /^[bw][KQRBNp]$/;

export function isPieceString(value: unknown): value is PieceString {
	return typeof value === 'string' && PIECE_STRING_REGEX.test(value);
}

export function isSquareString(value: unknown): value is SquareString {
	return (
		typeof value === 'string' &&
		value.length === 2 &&
		value[0] >= 'a' &&
		value[0] <= 'h' &&
		value[1] >= '1' &&
		value[1] <= '8'
	);
}

export function isPositionMapString(pos: PiecePositionInput): pos is PiecePositionRecordString {
	for (const [sq, piece] of Object.entries(pos)) {
		if (!isSquareString(sq)) {
			return false;
		}
		if (!isPieceString(piece)) {
			return false;
		}
	}
	return true;
}

export function isColorShort(value: unknown): value is ColorShort {
	return value === 'w' || value === 'b';
}

export function isRoleShort(value: unknown): value is RoleShort {
	return (
		value === 'K' ||
		value === 'Q' ||
		value === 'R' ||
		value === 'B' ||
		value === 'N' ||
		value === 'p'
	);
}

export function isPieceShort(value: unknown): value is PieceShort {
	return (
		typeof value === 'object' &&
		value !== null &&
		'color' in value &&
		'role' in value &&
		isColorShort(value.color) &&
		isRoleShort(value.role)
	);
}

export function isPositionMapShort(pos: PiecePositionInput): pos is PiecePositionRecordShort {
	for (const [sq, piece] of Object.entries(pos)) {
		if (!isSquareString(sq)) {
			return false;
		}
		if (!isPieceShort(piece)) {
			return false;
		}
	}
	return true;
}

export function isColor(value: unknown): value is Color {
	return value === 'white' || value === 'black';
}

export function isRole(value: unknown): value is Role {
	return (
		value === 'king' ||
		value === 'queen' ||
		value === 'rook' ||
		value === 'bishop' ||
		value === 'knight' ||
		value === 'pawn'
	);
}

export function isPiece(value: unknown): value is Piece {
	return (
		typeof value === 'object' &&
		value !== null &&
		'color' in value &&
		'role' in value &&
		isColor(value.color) &&
		isRole(value.role)
	);
}

export function isPositionMap(pos: PiecePositionInput): pos is PiecePositionRecord {
	for (const [sq, piece] of Object.entries(pos)) {
		if (!isSquareString(sq)) {
			return false;
		}
		if (!isPiece(piece)) {
			return false;
		}
	}
	return true;
}

export function assertValidRoleCode(n: number): asserts n is RolePromotionCode {
	if (!isRolePromotionCode(n)) {
		throw new RangeError(`Invalid role promotion code: ${n}`);
	}
}
