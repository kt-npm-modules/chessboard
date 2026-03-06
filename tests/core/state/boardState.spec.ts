import { describe, expect, it } from 'vitest';
import { createInitialState, DEFAULT_THEME, getSnapshot } from '../../../src/core/state/boardState';
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
		expect(state.selected).toBe(-1);
		expect(state.lastMove).toBeNull();

		// Theme merged with defaults
		expect(state.theme.light).toBe(DEFAULT_THEME.light);
		expect(state.theme.dark).toBe(DEFAULT_THEME.dark);
		expect(state.theme.selection).toBe(DEFAULT_THEME.selection);
		expect(state.theme.lastMove).toBe(DEFAULT_THEME.lastMove);
		expect(state.theme.highlight).toBe(DEFAULT_THEME.highlight);
		expect(state.theme.coords).toBe(DEFAULT_THEME.coords);

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

	it('createInitialState merges theme overrides', () => {
		const state = createInitialState({
			position: 'start',
			theme: { light: '#fff', coords: '#000' }
		});
		expect(state.theme.light).toBe('#fff');
		expect(state.theme.coords).toBe('#000');
		// Unspecified fields keep defaults
		expect(state.theme.dark).toBe(DEFAULT_THEME.dark);
		expect(state.theme.highlight).toBe(DEFAULT_THEME.highlight);
	});
});
