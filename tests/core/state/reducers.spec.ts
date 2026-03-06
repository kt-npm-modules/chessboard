import { describe, expect, it } from 'vitest';
import {
	createInitialState,
	DEFAULT_THEME,
	type InternalState
} from '../../../src/core/state/boardState';
import { fromAlgebraic } from '../../../src/core/state/coords';
import { decodePiece } from '../../../src/core/state/encode';
import {
	clearDirty,
	markDirtyLayer,
	markDirtySquare,
	move,
	select,
	setOrientation,
	setPosition,
	setTheme,
	setTurn
} from '../../../src/core/state/reducers';
import type { PieceShort, PositionMapShort } from '../../../src/core/state/types';
import { DirtyLayer } from '../../../src/core/state/types';

describe('state/reducers', () => {
	it('setPosition with "start" initializes pieces, ids, selection, lastMove, and sets turn from FEN', () => {
		const state = createInitialState(); // default start
		// Flip state to non-default values, then setPosition should reset them
		state.selected = fromAlgebraic('e4');
		state.lastMove = {
			from: fromAlgebraic('a2'),
			to: fromAlgebraic('a4'),
			moved: { color: 'white', role: 'pawn' }
		};

		setPosition(state, 'start');

		expect(state.pieces).toBeInstanceOf(Uint8Array);
		expect(state.pieces.length).toBe(64);
		expect(state.ids.length).toBe(64);

		// START_FEN has white to move
		expect(state.turn).toBe('white');
		expect(state.selected).toBe(-1);
		expect(state.lastMove).toBeNull();

		// Dirty flags set for full redraw
		expect((state.dirtyLayers & DirtyLayer.Board) !== 0).toBe(true);
		expect((state.dirtyLayers & DirtyLayer.Coords) !== 0).toBe(true);
		expect((state.dirtyLayers & DirtyLayer.Pieces) !== 0).toBe(true);
	});

	it('setPosition with PositionMapShort encodes pieces and preserves current state.turn', () => {
		const state = createInitialState({ position: 'start', turn: 'black' }); // ensure non-default
		const m: PositionMapShort = {
			a1: { color: 'w', role: 'K' },
			a2: { color: 'w', role: 'p' },
			a7: { color: 'b', role: 'p' },
			a8: { color: 'b', role: 'K' }
		} satisfies Record<string, PieceShort>;

		setPosition(state, m);

		// Occupied squares encoded
		const a1 = fromAlgebraic('a1');
		const a2 = fromAlgebraic('a2');
		const a7 = fromAlgebraic('a7');
		const a8 = fromAlgebraic('a8');
		expect(state.pieces[a1]).not.toBe(0);
		expect(state.pieces[a2]).not.toBe(0);
		expect(state.pieces[a7]).not.toBe(0);
		expect(state.pieces[a8]).not.toBe(0);

		// Turn remains as previously set because maps don't carry turn
		expect(state.turn).toBe('black');
	});

	it('select updates selected and marks Highlights dirty', () => {
		const state = createInitialState({ position: 'start' });
		clearDirty(state);
		select(state, 'e4');
		expect(state.selected).toBe(fromAlgebraic('e4'));
		expect((state.dirtyLayers & DirtyLayer.Highlights) !== 0).toBe(true);
	});

	it('move updates board, preserves id, toggles turn, sets lastMove and marks dirty', () => {
		const state = createInitialState({
			// start from minimal map so we control the board
			position: {
				e2: { color: 'w', role: 'p' }
			} satisfies PositionMapShort,
			turn: 'white'
		});
		clearDirty(state);

		const from = fromAlgebraic('e2');
		const to = fromAlgebraic('e4');

		const idFrom = state.ids[from];
		expect(idFrom).not.toBe(-1);

		move(state, { from, to });

		// from is cleared, to is occupied
		expect(state.pieces[from]).toBe(0);
		expect(state.ids[from]).toBe(-1);
		expect(state.pieces[to]).not.toBe(0);
		expect(state.ids[to]).toBe(idFrom);

		// turn toggled and lastMove updated
		expect(state.turn).toBe('black');
		expect(state.lastMove).not.toBeNull();
		expect(state.lastMove).toMatchObject({ from, to });
		// lastMove metadata for a quiet move
		expect(state.lastMove!.moved.role).toBe('pawn');
		expect(state.lastMove!.moved.color).toBe('white');
		expect(state.lastMove!.captured).toBeUndefined();
		expect(state.lastMove!.promotion).toBeUndefined();

		// dirty markers
		expect(state.dirtySquares.has(from)).toBe(true);
		expect(state.dirtySquares.has(to)).toBe(true);
		expect((state.dirtyLayers & DirtyLayer.Pieces) !== 0).toBe(true);
		expect((state.dirtyLayers & DirtyLayer.LastMove) !== 0).toBe(true);
		expect((state.dirtyLayers & DirtyLayer.Highlights) !== 0).toBe(true);
	});

	it('move applies promotion when provided (RolePromotionInput short or long)', () => {
		const setup = () =>
			createInitialState({
				position: {
					a7: { color: 'w', role: 'p' }
				} satisfies PositionMapShort,
				turn: 'white'
			});

		// Short form promotion
		{
			const state = setup();
			move(state, { from: 'a7', to: 'a8' }, { promotion: 'Q' });
			const code = state.pieces[fromAlgebraic('a8')];
			const piece = decodePiece(code);
			expect(piece).not.toBeNull();
			expect(piece!.role).toBe('queen');
			expect(piece!.color).toBe('white');

			// lastMove metadata includes promotion and moved piece (pre-promotion)
			expect(state.lastMove).not.toBeNull();
			expect(state.lastMove!.promotion).toBe('queen');
			expect(state.lastMove!.moved.role).toBe('pawn');
			expect(state.lastMove!.moved.color).toBe('white');
		}

		// Long form promotion
		{
			const state = setup();
			move(state, { from: 'a7', to: 'a8' }, { promotion: 'queen' });
			const code = state.pieces[fromAlgebraic('a8')];
			const piece = decodePiece(code);
			expect(piece).not.toBeNull();
			expect(piece!.role).toBe('queen');
			expect(piece!.color).toBe('white');

			// lastMove metadata includes promotion and moved piece (pre-promotion)
			expect(state.lastMove).not.toBeNull();
			expect(state.lastMove!.promotion).toBe('queen');
			expect(state.lastMove!.moved.role).toBe('pawn');
			expect(state.lastMove!.moved.color).toBe('white');
		}
	});

	it('move capture sets lastMove.captured with destination piece before overwrite', () => {
		const state = createInitialState({
			position: {
				e4: { color: 'w', role: 'p' },
				e5: { color: 'b', role: 'p' }
			} satisfies PositionMapShort,
			turn: 'white'
		});
		clearDirty(state);

		move(state, { from: 'e4', to: 'e5' });

		expect(state.lastMove).not.toBeNull();
		expect(state.lastMove!.moved.role).toBe('pawn');
		expect(state.lastMove!.moved.color).toBe('white');
		expect(state.lastMove!.captured).toBeDefined();
		expect(state.lastMove!.captured!.role).toBe('pawn');
		expect(state.lastMove!.captured!.color).toBe('black');
	});

	it('setTurn and setOrientation accept short color inputs', () => {
		const state = createInitialState({ position: 'start', turn: 'white', orientation: 'white' });
		setTurn(state, 'b');
		setOrientation(state, 'b');
		expect(state.turn).toBe('black');
		expect(state.orientation).toBe('black');
	});

	it('setTheme merges partial overrides and marks relevant layers dirty', () => {
		const state = createInitialState({ position: 'start' });
		clearDirty(state);
		setTheme(state, { light: '#fff', coords: '#000' });
		expect(state.theme.light).toBe('#fff');
		expect(state.theme.coords).toBe('#000');
		// Unspecified keep defaults
		expect(state.theme.dark).toBe(DEFAULT_THEME.dark);
		expect((state.dirtyLayers & DirtyLayer.Board) !== 0).toBe(true);
		expect((state.dirtyLayers & DirtyLayer.Coords) !== 0).toBe(true);
		expect((state.dirtyLayers & DirtyLayer.Highlights) !== 0).toBe(true);
	});

	it('dirty helpers: markDirtySquare/markDirtyLayer/clearDirty behavior', () => {
		const state: InternalState = createInitialState({ position: 'start' });
		clearDirty(state);
		const e4 = fromAlgebraic('e4');
		markDirtySquare(state, e4);
		expect(state.dirtySquares.has(e4)).toBe(true);

		const mask = DirtyLayer.Board | DirtyLayer.Pieces;
		markDirtyLayer(state, mask);
		expect((state.dirtyLayers & DirtyLayer.Board) !== 0).toBe(true);
		expect((state.dirtyLayers & DirtyLayer.Pieces) !== 0).toBe(true);

		clearDirty(state);
		expect(state.dirtySquares.size).toBe(0);
		expect(state.dirtyLayers).toBe(0);
	});
});
