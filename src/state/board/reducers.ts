import { isEmpty } from './check';
import { denormalizeSquare } from './denormalize';
import { fromPieceCode, toPieceCode } from './piece';
import {
	ColorCode,
	Move,
	MoveBase,
	MoveCaptured,
	MoveRequest,
	MoveRequestBase,
	PieceCode
} from './types/internal';
import { BoardStateInternal } from './types/main';

export function boardSetPosition(state: BoardStateInternal, pieces: Uint8Array): boolean {
	state.pieces = new Uint8Array(pieces);

	// Increment position epoch to prevent false animation across position resets
	state.positionEpoch++;

	return true;
}

/**
 * Set active color turn.
 */
export function boardSetTurn(state: BoardStateInternal, turn: ColorCode): boolean {
	if (state.turn === turn) return false; // no-op
	state.turn = turn;
	return true;
}

function buildMoveBase(state: BoardStateInternal, request: MoveRequestBase): MoveBase {
	const from = request.from;
	const to = request.to;
	if (from === to) {
		throw new RangeError(`Source and destination squares are the same: ${from}`);
	}
	const moved = state.pieces[from];
	if (isEmpty(moved)) {
		throw new RangeError(`Cannot move from empty square: ${from}`);
	}
	return {
		from,
		to,
		moved: moved
	};
}

function buildMove(state: BoardStateInternal, request: MoveRequest): Move {
	const base = buildMoveBase(state, request);
	let captured: MoveCaptured | undefined;
	const captureSq = request.capturedSquare ?? request.to;
	const codeAtCapture = state.pieces[captureSq];
	if (!isEmpty(codeAtCapture)) {
		captured = { piece: codeAtCapture, square: captureSq };
	}

	let promotedTo: PieceCode | undefined;
	if (request.promotedTo) {
		const moved = base.moved;
		const pieceCoded = fromPieceCode(moved);
		const newPieceCode = toPieceCode(request.promotedTo, pieceCoded.color);
		promotedTo = newPieceCode;
	}

	let secondary: MoveBase | undefined;
	if (request.secondary) {
		secondary = buildMoveBase(state, request.secondary);
		if (
			secondary.from === base.to ||
			secondary.to === base.to ||
			secondary.from === base.from ||
			secondary.to === base.from
		) {
			throw new RangeError(
				`Secondary move squares cannot overlap with primary move squares: ${denormalizeSquare(secondary.from)}, ${denormalizeSquare(secondary.to)} vs ${denormalizeSquare(base.from)}, ${denormalizeSquare(base.to)}`
			);
		}
	}

	return {
		...base,
		...(captured && { captured }),
		...(promotedTo && { promotedTo }),
		...(secondary && { secondary })
	};
}

export function boardMove(state: BoardStateInternal, request: MoveRequest): Move {
	const move = buildMove(state, request);
	state.pieces[move.to] = move.promotedTo ?? move.moved;
	state.pieces[move.from] = PieceCode.Empty;

	if (move.captured && move.captured.square !== move.to) {
		state.pieces[move.captured.square] = PieceCode.Empty;
	}

	if (move.secondary) {
		state.pieces[move.secondary.to] = move.secondary.moved;
		state.pieces[move.secondary.from] = PieceCode.Empty;
	}

	// Toggle turn
	state.turn = state.turn === ColorCode.White ? ColorCode.Black : ColorCode.White;

	// Increment position epoch
	state.positionEpoch++;

	return move;
}
