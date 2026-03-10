import { describe, expect, it } from 'vitest';
import { createInitialState, getSnapshot } from '../../../src/core/state/boardState';
import { fromAlgebraic } from '../../../src/core/state/coords';

describe('state/boardState', () => {
	it('createInitialState with start position initializes core fields', () => {
		const state = createInitialState({ position: 'start' });
		expect(state.pieces).toBeInstanceOf(Uint8Array);
		expect(state.pieces.length).toBe(64);

		// START_FEN active color is white
		expect(state.turn).toBe('white');

		// Defaults
		expect(state.orientation).toBe('white');
		expect(state.selected).toBeNull();

		// ids assigned for all non-empty squares, -1 for empty
		const a1 = fromAlgebraic('a1');
		const a2 = fromAlgebraic('a2');
		expect(state.ids.length).toBe(64);
		expect(state.ids[a1]).not.toBe(-1);
		expect(state.ids[a2]).not.toBe(-1);
	});

	it('createInitialState respects ColorInput overrides for orientation and turn', () => {
		const state = createInitialState({ position: 'start', orientation: 'b', turn: 'b' });
		expect(state.orientation).toBe('black');
		expect(state.turn).toBe('black');
	});

	it('getSnapshot returns a cloned pieces array and read-only view', () => {
		const state = createInitialState({ position: 'start' });
		const snap = getSnapshot(state);

		// Pieces are cloned (different reference) but equal content
		expect(snap.pieces).not.toBe(state.pieces);
		for (let i = 0; i < 64; i++) {
			expect(snap.pieces[i]).toBe(state.pieces[i]);
		}

		// Attempt to mutate snapshot pieces should not affect internal state
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(snap as any).pieces[0] = 99;
		expect(state.pieces[0]).not.toBe(99);
	});
});
