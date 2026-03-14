/**
 * Phase 3.2 — InteractionController tests.
 *
 * Tests the pointer lifecycle orchestrator.
 * Uses a mock runtime surface — no real board state needed.
 *
 * Two interaction modes:
 *   Lifted-piece mode    (dragSession !== null)
 *   Release-targeting mode (selectedSquare !== null, dragSession === null)
 */

import { describe, expect, it, vi } from 'vitest';
import {
	createInteractionController,
	type InteractionRuntimeSurface
} from '../../../src/core/input/interactionController';
import type { BoardPoint } from '../../../src/core/renderer/types';
import type { InteractionSnapshot } from '../../../src/core/runtime/boardRuntime';
import type { Move, Square } from '../../../src/core/state/boardTypes';

// ── Helpers ────────────────────────────────────────────────────────────────────

function sq(n: number): Square {
	return n as Square;
}

function makeMockMove(from: number, to: number): Move {
	return { from: sq(from), to: sq(to), moved: { color: 'white', role: 'pawn' } };
}

function makeSnapshot(
	selectedSquare: Square | null = null,
	dragSession: { fromSquare: Square } | null = null
): InteractionSnapshot {
	return {
		board: {},
		view: {},
		interaction: { selectedSquare, destinations: null, currentTarget: null, dragSession }
	};
}

/**
 * Create a mock runtime surface.
 * `snapshotFn` is called each time getInteractionSnapshot() is invoked,
 * allowing tests to control what the controller sees.
 */
function createMockRuntime(
	snapshotFn: () => InteractionSnapshot = () => makeSnapshot(),
	overrides: Partial<Omit<InteractionRuntimeSurface, 'getInteractionSnapshot'>> = {}
): InteractionRuntimeSurface {
	return {
		getInteractionSnapshot: vi.fn().mockImplementation(snapshotFn),
		// Default: every square is drag-capable. Override per-test to gate lifted-piece entry.
		canStartMoveFrom: vi.fn().mockReturnValue(true),
		select: vi.fn().mockReturnValue(true),
		dragStart: vi.fn().mockReturnValue(true),
		setCurrentTarget: vi.fn().mockReturnValue(true),
		dropTo: vi.fn().mockReturnValue(null),
		cancelInteraction: vi.fn().mockReturnValue(false),
		notifyDragMove: vi.fn(),
		...overrides
	};
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('InteractionController', () => {
	// ── onPointerDown — Path A (no active interaction) ─────────────────────────

	describe('onPointerDown() — Path A: no active interaction', () => {
		it('drag-capable square: select(sq) and dragStart(sq) both called — enters lifted-piece mode', () => {
			// canStartMoveFrom returns true → lifted-piece mode entered.
			const runtime = createMockRuntime(() => makeSnapshot(), {
				canStartMoveFrom: vi.fn().mockReturnValue(true)
			});
			const controller = createInteractionController(runtime);

			controller.onPointerDown(sq(12), { x: 450, y: 650 });

			expect(runtime.select).toHaveBeenCalledWith(sq(12));
			expect(runtime.dragStart).toHaveBeenCalledWith(sq(12), { x: 450, y: 650 });
		});

		it('non-drag-capable square: select(sq) called, dragStart NOT called', () => {
			// canStartMoveFrom returns false → selection only, no lifted piece.
			const runtime = createMockRuntime(() => makeSnapshot(), {
				canStartMoveFrom: vi.fn().mockReturnValue(false)
			});
			const controller = createInteractionController(runtime);

			controller.onPointerDown(sq(12), { x: 450, y: 650 });

			expect(runtime.select).toHaveBeenCalledWith(sq(12));
			expect(runtime.dragStart).not.toHaveBeenCalled();
		});

		it('calls select(sq) then dragStart(sq) in order — enters lifted-piece mode', () => {
			const callOrder: string[] = [];
			const runtime = createMockRuntime(() => makeSnapshot(), {
				select: vi.fn().mockImplementation(() => {
					callOrder.push('select');
					return true;
				}),
				dragStart: vi.fn().mockImplementation(() => {
					callOrder.push('dragStart');
					return true;
				})
			});
			const controller = createInteractionController(runtime);

			controller.onPointerDown(sq(12), { x: 450, y: 650 });

			expect(callOrder).toEqual(['select', 'dragStart']);
			expect(runtime.select).toHaveBeenCalledWith(sq(12));
			expect(runtime.dragStart).toHaveBeenCalledWith(sq(12), { x: 450, y: 650 });
		});

		it('off-board (null) is a no-op', () => {
			const runtime = createMockRuntime();
			const controller = createInteractionController(runtime);

			controller.onPointerDown(null, { x: 450, y: 650 });

			expect(runtime.select).not.toHaveBeenCalled();
			expect(runtime.dragStart).not.toHaveBeenCalled();
		});
	});

	// ── onPointerDown — Path B (release-targeting mode) ───────────────────────

	describe('onPointerDown() — Path B: release-targeting mode', () => {
		it('calls setCurrentTarget(sq) — no select, no dragStart', () => {
			// selectedSquare set, no dragSession → release-targeting mode
			const runtime = createMockRuntime(() => makeSnapshot(sq(12), null));
			const controller = createInteractionController(runtime);

			controller.onPointerDown(sq(28), { x: 450, y: 650 });

			expect(runtime.setCurrentTarget).toHaveBeenCalledWith(sq(28));
			expect(runtime.select).not.toHaveBeenCalled();
			expect(runtime.dragStart).not.toHaveBeenCalled();
		});

		it('pointer-down on the selected square still calls setCurrentTarget (deselect deferred to up)', () => {
			// Deselect is NOT eager — it happens on pointer-up, not pointer-down.
			const runtime = createMockRuntime(() => makeSnapshot(sq(12), null));
			const controller = createInteractionController(runtime);

			controller.onPointerDown(sq(12), { x: 450, y: 650 }); // same as selectedSquare

			expect(runtime.setCurrentTarget).toHaveBeenCalledWith(sq(12));
			expect(runtime.select).not.toHaveBeenCalled();
		});
	});

	// ── onPointerDown — Path C (defensive: drag already active) ───────────────

	describe('onPointerDown() — Path C: defensive re-lift', () => {
		it('cancels current drag then re-lifts from new square', () => {
			const callOrder: string[] = [];
			const runtime = createMockRuntime(() => makeSnapshot(sq(12), { fromSquare: sq(12) }), {
				cancelInteraction: vi.fn().mockImplementation(() => {
					callOrder.push('cancel');
					return true;
				}),
				select: vi.fn().mockImplementation(() => {
					callOrder.push('select');
					return true;
				}),
				dragStart: vi.fn().mockImplementation(() => {
					callOrder.push('dragStart');
					return true;
				})
			});
			const controller = createInteractionController(runtime);

			controller.onPointerDown(sq(20), { x: 450, y: 650 });

			expect(callOrder).toEqual(['cancel', 'select', 'dragStart']);
			expect(runtime.cancelInteraction).toHaveBeenCalledTimes(1);
			expect(runtime.select).toHaveBeenCalledWith(sq(20));
			expect(runtime.dragStart).toHaveBeenCalledWith(sq(20), { x: 450, y: 650 });
		});
	});

	// ── onPointerMove ──────────────────────────────────────────────────────────

	describe('onPointerMove()', () => {
		it('updates currentTarget while targeting is active (after pointer-down)', () => {
			const runtime = createMockRuntime();
			const controller = createInteractionController(runtime);

			controller.onPointerDown(sq(12), { x: 450, y: 650 }); // sets targeting = true
			const point: BoardPoint = { x: 100, y: 200 };
			controller.onPointerMove(sq(28), point);

			expect(runtime.setCurrentTarget).toHaveBeenLastCalledWith(sq(28));
		});

		it('is a no-op before any pointer-down (targeting not active)', () => {
			const runtime = createMockRuntime();
			const controller = createInteractionController(runtime);

			const point: BoardPoint = { x: 100, y: 200 };
			controller.onPointerMove(sq(28), point); // no prior pointer-down

			// setCurrentTarget should NOT have been called (no targeting active)
			expect(runtime.setCurrentTarget).not.toHaveBeenCalled();
		});

		it('is a no-op after pointer-up (targeting cleared)', () => {
			const runtime = createMockRuntime();
			const controller = createInteractionController(runtime);

			controller.onPointerDown(sq(12), { x: 450, y: 650 });
			controller.onPointerUp(sq(28)); // clears targeting
			(runtime.setCurrentTarget as ReturnType<typeof vi.fn>).mockClear();

			const point: BoardPoint = { x: 100, y: 200 };
			controller.onPointerMove(sq(20), point); // should be no-op

			expect(runtime.setCurrentTarget).not.toHaveBeenCalled();
		});

		it('passes null (off-board) to setCurrentTarget while targeting', () => {
			const runtime = createMockRuntime();
			const controller = createInteractionController(runtime);

			controller.onPointerDown(sq(12), { x: 450, y: 650 });
			controller.onPointerMove(null, null);

			expect(runtime.setCurrentTarget).toHaveBeenLastCalledWith(null);
		});

		it('calls notifyDragMove when drag session is active', () => {
			const runtime = createMockRuntime(() => makeSnapshot(sq(12), { fromSquare: sq(12) }));
			const controller = createInteractionController(runtime);

			controller.onPointerDown(sq(12), { x: 450, y: 650 }); // start drag
			const point: BoardPoint = { x: 150, y: 250 };
			controller.onPointerMove(sq(28), point);

			expect(runtime.notifyDragMove).toHaveBeenCalledWith(point);
		});

		it('does not call notifyDragMove when no drag session is active', () => {
			const runtime = createMockRuntime(() => makeSnapshot(sq(12), null));
			const controller = createInteractionController(runtime);

			controller.onPointerDown(sq(28), { x: 450, y: 650 }); // Path B: release-targeting mode
			const point: BoardPoint = { x: 150, y: 250 };
			controller.onPointerMove(sq(28), point);

			expect(runtime.notifyDragMove).not.toHaveBeenCalled();
		});

		it('calls notifyDragMove on same-square movement during drag', () => {
			const runtime = createMockRuntime(() => makeSnapshot(sq(12), { fromSquare: sq(12) }));
			const controller = createInteractionController(runtime);

			controller.onPointerDown(sq(12), { x: 450, y: 650 }); // start drag
			const point1: BoardPoint = { x: 150, y: 250 };
			controller.onPointerMove(sq(12), point1); // same square, different point

			expect(runtime.notifyDragMove).toHaveBeenCalledWith(point1);

			const point2: BoardPoint = { x: 160, y: 260 };
			controller.onPointerMove(sq(12), point2); // still same square

			expect(runtime.notifyDragMove).toHaveBeenCalledWith(point2);
			expect(runtime.notifyDragMove).toHaveBeenCalledTimes(2);
		});
	});

	// ── onPointerUp — lifted-piece mode ───────────────────────────────────────

	describe('onPointerUp() — lifted-piece mode', () => {
		it('calls dropTo(sq) and returns the move on legal completion', () => {
			const move = makeMockMove(12, 28);
			const runtime = createMockRuntime(() => makeSnapshot(sq(12), { fromSquare: sq(12) }), {
				dropTo: vi.fn().mockReturnValue(move)
			});
			const controller = createInteractionController(runtime);

			controller.onPointerDown(sq(12), { x: 450, y: 650 });
			const result = controller.onPointerUp(sq(28));

			expect(runtime.dropTo).toHaveBeenCalledWith(sq(28));
			expect(result).toBe(move);
		});

		it('calls dropTo(sq) and returns null on illegal completion (selection kept by runtime)', () => {
			const runtime = createMockRuntime(() => makeSnapshot(sq(12), { fromSquare: sq(12) }), {
				dropTo: vi.fn().mockReturnValue(null)
			});
			const controller = createInteractionController(runtime);

			controller.onPointerDown(sq(12), { x: 450, y: 650 });
			const result = controller.onPointerUp(sq(36));

			expect(runtime.dropTo).toHaveBeenCalledWith(sq(36));
			expect(result).toBeNull();
		});

		it('calls dropTo(null) when released off-board', () => {
			const runtime = createMockRuntime(() => makeSnapshot(sq(12), { fromSquare: sq(12) }), {
				dropTo: vi.fn().mockReturnValue(null)
			});
			const controller = createInteractionController(runtime);

			controller.onPointerDown(sq(12), { x: 450, y: 650 });
			controller.onPointerUp(null);

			expect(runtime.dropTo).toHaveBeenCalledWith(null);
		});
	});

	// ── onPointerUp — release-targeting mode ──────────────────────────────────

	describe('onPointerUp() — release-targeting mode', () => {
		it('calls dropTo(sq) on a different square and returns the move', () => {
			const move = makeMockMove(12, 28);
			const runtime = createMockRuntime(() => makeSnapshot(sq(12), null), {
				dropTo: vi.fn().mockReturnValue(move)
			});
			const controller = createInteractionController(runtime);

			controller.onPointerDown(sq(28), { x: 450, y: 650 }); // Path B: setCurrentTarget
			const result = controller.onPointerUp(sq(28));

			expect(runtime.dropTo).toHaveBeenCalledWith(sq(28));
			expect(result).toBe(move);
		});

		it('calls select(null) when released on the selected square (deselect on release)', () => {
			// Deselect rule: pointer-up on selectedSquare → select(null), not dropTo.
			const runtime = createMockRuntime(() => makeSnapshot(sq(12), null));
			const controller = createInteractionController(runtime);

			controller.onPointerDown(sq(12), { x: 450, y: 650 }); // Path B
			const result = controller.onPointerUp(sq(12)); // release on same square

			expect(runtime.select).toHaveBeenCalledWith(null);
			expect(runtime.dropTo).not.toHaveBeenCalled();
			expect(result).toBeNull();
		});

		it('pointer-down on selectedSquare then move elsewhere then release: no eager deselect', () => {
			// Verifies: pointer-down on selectedSquare does NOT eagerly deselect.
			// Release on a different square routes to dropTo, not deselect.
			const move = makeMockMove(12, 28);
			const runtime = createMockRuntime(() => makeSnapshot(sq(12), null), {
				dropTo: vi.fn().mockReturnValue(move)
			});
			const controller = createInteractionController(runtime);

			controller.onPointerDown(sq(12), { x: 450, y: 650 }); // Path B — setCurrentTarget(12), no select(null)
			const point: BoardPoint = { x: 150, y: 250 };
			controller.onPointerMove(sq(28), point);
			const result = controller.onPointerUp(sq(28)); // release on different square

			// select(null) must NOT have been called during pointer-down
			expect(runtime.select).not.toHaveBeenCalledWith(null);
			// dropTo must have been called on pointer-up
			expect(runtime.dropTo).toHaveBeenCalledWith(sq(28));
			expect(result).toBe(move);
		});

		it('illegal completion in release-targeting mode: runtime clears all interaction', () => {
			// The controller just calls dropTo; runtime owns the illegal-completion outcome.
			const runtime = createMockRuntime(() => makeSnapshot(sq(12), null), {
				dropTo: vi.fn().mockReturnValue(null)
			});
			const controller = createInteractionController(runtime);

			controller.onPointerDown(sq(36), { x: 450, y: 650 });
			const result = controller.onPointerUp(sq(36));

			expect(runtime.dropTo).toHaveBeenCalledWith(sq(36));
			expect(result).toBeNull();
		});
	});

	// ── onPointerUp — no active interaction ───────────────────────────────────

	describe('onPointerUp() — no active interaction', () => {
		it('returns null without calling dropTo', () => {
			const runtime = createMockRuntime(() => makeSnapshot(null, null));
			const controller = createInteractionController(runtime);

			const result = controller.onPointerUp(sq(28));

			expect(runtime.dropTo).not.toHaveBeenCalled();
			expect(result).toBeNull();
		});
	});

	// ── onPointerCancel ────────────────────────────────────────────────────────

	describe('onPointerCancel()', () => {
		it('calls cancelInteraction()', () => {
			const runtime = createMockRuntime();
			const controller = createInteractionController(runtime);

			controller.onPointerCancel();

			expect(runtime.cancelInteraction).toHaveBeenCalledTimes(1);
		});

		it('clears targeting so onPointerMove becomes a no-op', () => {
			const runtime = createMockRuntime();
			const controller = createInteractionController(runtime);

			controller.onPointerDown(sq(12), { x: 450, y: 650 });
			controller.onPointerCancel();
			(runtime.setCurrentTarget as ReturnType<typeof vi.fn>).mockClear();

			const point: BoardPoint = { x: 100, y: 200 };
			controller.onPointerMove(sq(20), point); // should be no-op

			expect(runtime.setCurrentTarget).not.toHaveBeenCalled();
		});
	});

	// ── Full lifecycle flows ───────────────────────────────────────────────────

	describe('full lifecycle flows', () => {
		it('lifted-piece flow: pointer-down → pointer-move → pointer-up (legal)', () => {
			const move = makeMockMove(12, 28);
			// Snapshot evolves: after pointer-down, dragSession is set
			let callCount = 0;
			const runtime = createMockRuntime(
				() => {
					// First call (in onPointerDown): no interaction yet
					// Subsequent calls (in onPointerMove/onPointerUp): drag active
					callCount++;
					return callCount === 1
						? makeSnapshot(null, null)
						: makeSnapshot(sq(12), { fromSquare: sq(12) });
				},
				{ dropTo: vi.fn().mockReturnValue(move) }
			);
			const controller = createInteractionController(runtime);

			controller.onPointerDown(sq(12), { x: 450, y: 650 }); // Path A: select + dragStart
			const point1: BoardPoint = { x: 100, y: 200 };
			controller.onPointerMove(sq(20), point1); // update target + drag visual
			const point2: BoardPoint = { x: 150, y: 250 };
			controller.onPointerMove(sq(28), point2); // update target + drag visual
			const result = controller.onPointerUp(sq(28)); // dropTo

			expect(runtime.select).toHaveBeenCalledWith(sq(12));
			expect(runtime.dragStart).toHaveBeenCalledWith(sq(12), { x: 450, y: 650 });
			expect(runtime.notifyDragMove).toHaveBeenCalledWith(point1);
			expect(runtime.notifyDragMove).toHaveBeenCalledWith(point2);
			expect(runtime.dropTo).toHaveBeenCalledWith(sq(28));
			expect(result).toBe(move);
		});

		it('release-targeting flow: pointer-down → pointer-move → pointer-up (legal)', () => {
			const move = makeMockMove(12, 28);
			const runtime = createMockRuntime(() => makeSnapshot(sq(12), null), {
				dropTo: vi.fn().mockReturnValue(move)
			});
			const controller = createInteractionController(runtime);

			controller.onPointerDown(sq(28), { x: 450, y: 650 }); // Path B: setCurrentTarget
			const point: BoardPoint = { x: 150, y: 250 };
			controller.onPointerMove(sq(28), point); // update target (no drag visual)
			const result = controller.onPointerUp(sq(28)); // dropTo

			expect(runtime.setCurrentTarget).toHaveBeenCalledWith(sq(28));
			expect(runtime.notifyDragMove).not.toHaveBeenCalled(); // no drag session
			expect(runtime.dropTo).toHaveBeenCalledWith(sq(28));
			expect(result).toBe(move);
		});

		it('lifted-piece illegal → retry in release-targeting: pointer-up on legal target', () => {
			// After illegal lifted-piece drop, runtime keeps selection (dragSession cleared).
			// Next pointer-down enters release-targeting mode (Path B).
			// Pointer-up on legal target completes the move.
			const move = makeMockMove(12, 28);
			let phase = 0;
			const runtime = createMockRuntime(
				() => {
					// phase 0: no interaction (first pointer-down)
					// phase 1: lifted-piece (pointer-up #1)
					// phase 2: release-targeting (second pointer-down + pointer-up #2)
					if (phase === 0) return makeSnapshot(null, null);
					if (phase === 1) return makeSnapshot(sq(12), { fromSquare: sq(12) });
					return makeSnapshot(sq(12), null); // selection kept after illegal drop
				},
				{
					dropTo: vi.fn().mockReturnValue(null).mockReturnValueOnce(null).mockReturnValueOnce(move)
				}
			);
			const controller = createInteractionController(runtime);

			// First interaction: lifted-piece, illegal drop
			phase = 0;
			controller.onPointerDown(sq(12), { x: 450, y: 650 });
			phase = 1;
			controller.onPointerUp(sq(36)); // illegal — runtime keeps selection

			// Second interaction: release-targeting, legal drop
			phase = 2;
			controller.onPointerDown(sq(28), { x: 450, y: 650 }); // Path B
			const result = controller.onPointerUp(sq(28));

			expect(result).toBe(move);
		});

		it('cancel flow: pointer-down → pointer-cancel → pointer-move is no-op', () => {
			const runtime = createMockRuntime();
			const controller = createInteractionController(runtime);

			controller.onPointerDown(sq(12), { x: 450, y: 650 });
			controller.onPointerCancel();
			(runtime.setCurrentTarget as ReturnType<typeof vi.fn>).mockClear();

			const point: BoardPoint = { x: 100, y: 200 };
			controller.onPointerMove(sq(28), point); // should be no-op

			expect(runtime.cancelInteraction).toHaveBeenCalledTimes(1);
			expect(runtime.setCurrentTarget).not.toHaveBeenCalled();
		});
	});
});
