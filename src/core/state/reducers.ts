import { START_FEN, parseFenPlacement, parseFenTurn } from '../notation/fen';
import type { InternalState } from './boardState';
import { assertValidSquare, fromAlgebraic } from './coords';
import { decodePiece, encodePiece, isEmpty } from './encode';
import { normalizeColor, normalizeRole } from './normalize';
import type {
	Color,
	ColorInput,
	MoveInput,
	PieceShort,
	PositionInput,
	PositionMap,
	PositionMapShort,
	RolePromotion,
	RolePromotionInput,
	Square,
	SquareString,
	Theme
} from './types';
import { DirtyLayer, Piece } from './types';

/**
 * Replace the entire board position from one of the accepted inputs.
 *
 * Semantics
 * - Clears the board first, then applies the provided position.
 * - Regenerates piece IDs for all occupied squares (ids[i] >= 1); empties get -1.
 * - Resets selection and last move:
 *   - selected = -1
 *   - lastMove = null
 * - Marks dirty layers for a full redraw:
 *   - DirtyLayer.Board | DirtyLayer.Coords | DirtyLayer.Pieces
 * - Turn handling:
 *   - If input is 'start' or a FEN string, state.turn is set from the FEN active color.
 *   - If input is a PositionMap/PositionMapShort (sparse map), state.turn is NOT changed.
 *
 * Inputs
 * - 'start'                Standard initial position (START_FEN).
 * - FEN                    Full FEN string; field 1 (placement) and field 2 (active color) are used.
 * - PositionMap            Sparse map of occupied squares using canonical Piece (: 'white'|'black', role: 'pawn'|'knight'|'bishop'|'rook'|'queen'|'king').
 * - PositionMapShort       Sparse map using short aliases (color: 'w'|'b', role: 'p'|'N'|'B'|'R'|'Q'|'K').
 *
 * Errors
 * - Invalid FEN strings throw with descriptive messages.
 * - Invalid algebraic square keys throw a RangeError.
 * - Invalid role/color short aliases throw a RangeError.
 *
 * @param state Internal mutable state
 * @param input 'start' | FEN | PositionMap | PositionMapShort
 * @returns void
 * @example
 * setPosition(state, 'start');                      // standard start, white to move
 * setPosition(state, '8/8/8/8/8/8/8/8 w - - 0 1');  // empty board, white to move
 * setPosition(state, { e2: { color: 'w', role: 'p' }, e7: { color: 'b', role: 'p' } });
 */
export function setPosition(state: InternalState, input: PositionInput): void {
	let pieces: Uint8Array;
	let turnFromPosition: Color | undefined;

	if (input === 'start') {
		pieces = parseFenPlacement(START_FEN);
		turnFromPosition = parseFenTurn(START_FEN);
	} else if (typeof input === 'string') {
		// FEN
		pieces = parseFenPlacement(input);
		turnFromPosition = parseFenTurn(input);
	} else {
		// Position map (long or short)
		pieces = buildPiecesFromPositionMap(input);
	}

	state.pieces = pieces;

	// Assign fresh ids for each occupied square
	state.ids = new Int16Array(64);
	state.nextId = 1;
	for (let i = 0; i < 64; i++) {
		if (state.pieces[i] !== 0) {
			state.ids[i] = state.nextId++;
		} else {
			state.ids[i] = -1;
		}
	}

	state.selected = -1;
	state.lastMove = null;

	// Update turn from position if provided (do not override explicitly-set turn elsewhere)
	if (turnFromPosition) {
		state.turn = turnFromPosition;
	}

	clearDirty(state);
	markDirtyLayer(state, DirtyLayer.Board | DirtyLayer.Coords | DirtyLayer.Pieces);
}

/**
 * Set active color turn.
 */
export function setTurn(state: InternalState, c: ColorInput): void {
	state.turn = normalizeColor(c);
	// Consumers might show turn-based highlights
	markDirtyLayer(state, DirtyLayer.Highlights);
}

/**
 * Set board orientation (view).
 */
export function setOrientation(state: InternalState, c: ColorInput): void {
	state.orientation = normalizeColor(c);
	markDirtyLayer(state, DirtyLayer.Board | DirtyLayer.Coords | DirtyLayer.Highlights);
}

/**
 * Select a square or clear selection with -1.
 * Accepts numeric or algebraic square.
 */
export function select(state: InternalState, sq: Square | SquareString | -1): void {
	const newSel = sq === -1 ? -1 : typeof sq === 'number' ? sq : fromAlgebraic(sq);
	if (newSel !== -1) assertValidSquare(newSel);
	if (state.selected === newSel) return;
	state.selected = newSel;
	markDirtyLayer(state, DirtyLayer.Highlights);
}

type CastleOptionsSquare = {
	rookFrom: Square;
	rookTo: Square;
};
type CastleOptionsString = {
	rookFrom: SquareString;
	rookTo: SquareString;
};
export type CastleOptions = CastleOptionsSquare | CastleOptionsString;

export interface MoveOptions {
	promotion?: RolePromotionInput;
	capturedSquare?: Square; // Optional: the square of the captured piece, useful for en passant
	castle?: CastleOptions; // Optional: if this move is a castling move, provide details
}
/**
 * Apply a UI-level move from one square to another. No legality is enforced here.
 *
 * Semantics
 * - Accepts MoveInput: numeric squares (0..63) or algebraic strings (e.g., 'e4').
 * - Preserves the moving piece ID (ID from source transferred to destination).
 * - Capture is handled by overwriting the destination square.
 * - Promotion:
 *   - If opts.promotion is provided, the moving piece role is replaced by the promoted role.
 *   - RolePromotionInput accepts both long and short forms (e.g., 'queen' or 'Q').
 * - Updates turn and last move:
 *   - lastMove = { from, to }
 *   - turn toggles between 'white' and 'black'
 * - Dirty tracking:
 *   - Dirty squares: from, to
 *   - Dirty layers: DirtyLayer.Pieces | DirtyLayer.LastMove | DirtyLayer.Highlights
 *
 * Limitations (by design)
 * - No rules/legality checks (e.g., legal moves, check, en passant, castling) — handled by higher-level policy/integration.
 * - En passant/castling/halfmove/fullmove counters are not maintained here.
 *
 * Errors
 * - Moving from an empty square throws RangeError.
 * - Invalid squares (out of [0..63] or bad algebraic) throw a RangeError.
 *
 * @param state Internal mutable state
 * @param move MoveInput
 * @param opts Optional MoveOptions { promotion?: RolePromotionInput }
 * @returns void
 * @example
 * move(state, { from: 'e2', to: 'e4' });
 * move(state, { from: 12, to:  }); // numeric squares
 * move(state, { from: 'a7', to: 'a8' }, { promotion: 'Q' });       // short
 * move(state, { from: 'a7', to: 'a8' }, { promotion: 'queen' });   // long
 */
export function move(state: InternalState, move: MoveInput, opts?: MoveOptions): void {
	const from = typeof move.from === 'number' ? move.from : fromAlgebraic(move.from);
	const to = typeof move.to === 'number' ? move.to : fromAlgebraic(move.to);
	assertValidSquare(from);
	assertValidSquare(to);

	if (from === to) return;

	const movingCode = state.pieces[from];
	if (isEmpty(movingCode)) {
		throw new RangeError(`Cannot move from empty square: ${from}`);
	}

	// Decode moving piece to determine color and current role
	const movingPiece = decodePiece(movingCode);
	if (!movingPiece) throw new RangeError(`Invalid piece code at from=${from}`);

	// Preserve id of moving piece
	const movingId = state.ids[from];

	// Destination before overwrite to detect capture
	const destCode = state.pieces[to];
	const capturedPiece = isEmpty(destCode) ? undefined : decodePiece(destCode)!;

	// Write destination: with promotion or same role
	const newRole = opts?.promotion ? normalizeRole(opts.promotion) : movingPiece.role;
	const newPieceCode = encodePiece({ color: movingPiece.color, role: newRole });

	state.pieces[to] = newPieceCode;
	state.ids[to] = movingId;

	// Clear source square
	state.pieces[from] = 0;
	state.ids[from] = -1;

	// Update last move and toggle turn
	const promotion = opts?.promotion ? (normalizeRole(opts.promotion) as RolePromotion) : undefined;
	state.lastMove = {
		from,
		to,
		moved: movingPiece,
		...(capturedPiece && { captured: capturedPiece }),
		...(promotion && { promotion })
	};
	state.turn = state.turn === 'white' ? 'black' : 'white';

	// Dirty tracking
	markDirtySquare(state, from);
	markDirtySquare(state, to);
	markDirtyLayer(state, DirtyLayer.Pieces | DirtyLayer.LastMove | DirtyLayer.Highlights);
}

/**
 * Merge theme overrides.
 */
export function setTheme(state: InternalState, partial: Partial<Theme>): void {
	state.theme = { ...state.theme, ...partial };
	markDirtyLayer(state, DirtyLayer.Board | DirtyLayer.Coords | DirtyLayer.Highlights);
}

/**
 * Mark a specific square as dirty (for region-specific invalidation).
 */
export function markDirtySquare(state: InternalState, sq: Square): void {
	assertValidSquare(sq);
	state.dirtySquares.add(sq);
}

/**
 * Mark one or more layers dirty (bitmask).
 */
export function markDirtyLayer(state: InternalState, layerMask: number): void {
	state.dirtyLayers |= layerMask;
}

/**
 * Clear all dirty flags.
 */
export function clearDirty(state: InternalState): void {
	state.dirtySquares.clear();
	state.dirtyLayers = 0;
}

/**
 * Helpers local to reducers
 */

function buildPiecesFromPositionMap(map: PositionMap | PositionMapShort): Uint8Array {
	const out = new Uint8Array(64);
	for (const [sqStr, piece] of Object.entries<Piece | PieceShort>(map)) {
		const sq = fromAlgebraic(sqStr as SquareString);
		const color = normalizeColor(piece.color);
		const role = normalizeRole(piece.role);
		out[sq] = encodePiece({ color, role });
	}
	return out;
}
