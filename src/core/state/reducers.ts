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
	RolePromotionInput,
	Square,
	SquareString,
	Theme
} from './types';
import { DirtyLayer, Piece } from './types';

/**
 * Replace the entire position from one of the accepted inputs.
 * - 'start' uses START_FEN
 * - FEN string parses placement and turn
 * - PositionMap/PositionMapShort encodes directly (short is normalized)
 * After replacement:
 * - selected = -1
 * - lastMove = null
 * - fresh ids assigned for all pieces
 * - dirty layers: Board | Coords | Pieces
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

export interface MoveOptions {
	promotion?: RolePromotionInput;
}
/**
 * Move a piece from->to. No legality checks here (policy handled above the state layer).
 * - Accepts Move or MoveString
 * - Preserves moving piece id
 * - Handles capture by overwriting target
 * - Optional promotion role (not 'pawn')
 * - Updates lastMove and toggles turn
 * - Marks dirty: from, to and layers Pieces | LastMove | Highlights
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

	// Write destination: with promotion or same role
	const newRole = opts?.promotion ? normalizeRole(opts.promotion) : movingPiece.role;
	const newPieceCode = encodePiece({ color: movingPiece.color, role: newRole });

	state.pieces[to] = newPieceCode;
	state.ids[to] = movingId;

	// Clear source square
	state.pieces[from] = 0;
	state.ids[from] = -1;

	// Update last move and toggle turn
	state.lastMove = { from, to };
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
