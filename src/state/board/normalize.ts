import { assertNever } from '../../utils/assert-never';
import { toValidSquare } from './coords';
import type { Color, MoveInput, NormalizedMoveInput, Role, RolePromotion } from './types/types';

/**
 * Normalize color inputs to canonical long names.
 * Accepts: 'white' | 'black' | 'w' | 'b'
 * Returns: 'white' | 'black'
 */
export function normalizeColor(input: string): Color {
	switch (input) {
		case 'white':
		case 'black':
			return input;
		case 'w':
			return 'white';
		case 'b':
			return 'black';
		default:
			assertNever(RangeError, `Invalid color input`, input);
	}
}

/**
 * Normalize role inputs to canonical long names.
 * Accepts:
 *  - Long: 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king'
 *  - Short (single-case policy aligned with PGN letters): 'p' | 'N' | 'B' | 'R' | 'Q' | 'K'
 * Returns: long canonical role
 */
export function normalizeRole(input: string): Role {
	if (isRole(input)) return input;

	switch (input) {
		case 'p':
			return 'pawn';
		case 'N':
			return 'knight';
		case 'B':
			return 'bishop';
		case 'R':
			return 'rook';
		case 'Q':
			return 'queen';
		case 'K':
			return 'king';
		default:
			assertNever(RangeError, `Invalid role input`, input);
	}
}

export function normalizeRolePromotion(input: string): RolePromotion {
	const role = normalizeRole(input);
	if (role === 'king' || role === 'pawn') {
		throw new RangeError(`Invalid role promotion input: ${input}`);
	}
	return role as RolePromotion;
}

function isRole(r: unknown): r is Role {
	return (
		r === 'pawn' ||
		r === 'knight' ||
		r === 'bishop' ||
		r === 'rook' ||
		r === 'queen' ||
		r === 'king'
	);
}

export function normalizeMoveInput(move: MoveInput): NormalizedMoveInput {
	return {
		from: toValidSquare(move.from),
		to: toValidSquare(move.to),
		...(move.capturedSquare && { capturedSquare: toValidSquare(move.capturedSquare) }),
		...(move.promotedTo && { promotedTo: normalizeRolePromotion(move.promotedTo) }),
		...(move.secondary && {
			secondary: {
				from: toValidSquare(move.secondary.from),
				to: toValidSquare(move.secondary.to)
			}
		})
	};
}
