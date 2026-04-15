import { isValidSquare } from './check';
import { fileOf, rankOf } from './coords';
import { Color, FileChar, Piece, RankChar, Role, SquareString } from './types/input';
import { ColorCode, FILE_START, PieceCode, RANK_START, RoleCode, Square } from './types/internal';

export function denormalizeSquare(sq: Square): SquareString {
	if (!isValidSquare(sq)) {
		throw new RangeError(`Invalid square index: ${sq}`);
	}
	const file = fileOf(sq) as number;
	const rank = rankOf(sq) as number;
	const f = String.fromCharCode(FILE_START + file) as FileChar;
	const r = String.fromCharCode(RANK_START + rank) as RankChar;
	return `${f}${r}`;
}

export function denormalizeRole(role: RoleCode): Role {
	switch (role) {
		case RoleCode.Pawn:
			return 'pawn';
		case RoleCode.King:
			return 'king';
		case RoleCode.Knight:
			return 'knight';
		case RoleCode.Bishop:
			return 'bishop';
		case RoleCode.Rook:
			return 'rook';
		case RoleCode.Queen:
			return 'queen';
		default:
			throw new RangeError(`Invalid role code: ${role}`);
	}
}

export function denormalizePiece(code: PieceCode): Piece | null {
	if (code <= PieceCode.Empty) return null;
	const color: Color = code >= ColorCode.Black ? 'black' : 'white';
	const roleCode: RoleCode = color === 'black' ? code - ColorCode.Black : code;
	return { color, role: denormalizeRole(roleCode) };
}
