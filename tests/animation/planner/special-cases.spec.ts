import { describe, expect, it } from 'vitest';
import { calculateAnimationPlan } from '../../../src/animation/planner.js';
import type { AnimationPlanningInput, AnimationTrack } from '../../../src/animation/types.js';
import { normalizeSquare } from '../../../src/state/board/normalize.js';
import { PieceCode, RoleCode, type Square } from '../../../src/state/board/types/internal.js';
import {
	makeBoardSnapshot,
	makeChangeSnapshot,
	makeInteractionSnapshot,
	makeSnapshot
} from '../../test-utils/animation/fixtures.js';

const e2 = normalizeSquare('e2');
const e4 = normalizeSquare('e4');
const d7 = normalizeSquare('d7');
const d8 = normalizeSquare('d8');
const e8 = normalizeSquare('e8');
const f7 = normalizeSquare('f7');
const f8 = normalizeSquare('f8');

function findMoveTrack(
	tracks: readonly AnimationTrack[],
	from: Square,
	to: Square,
	piece?: PieceCode
) {
	return tracks.find(
		(t) =>
			t.effect === 'move' &&
			t.fromSq === from &&
			t.toSq === to &&
			(piece === undefined || t.pieceCode === piece)
	);
}

function findFadeTrack(
	tracks: readonly AnimationTrack[],
	effect: 'fade-in' | 'fade-out',
	sq: Square,
	piece?: PieceCode
) {
	return tracks.find(
		(t) => t.effect === effect && t.sq === sq && (piece === undefined || t.pieceCode === piece)
	);
}

describe('calculateAnimationPlan — special cases', () => {
	describe('lifted-piece-drop suppression', () => {
		it('suppresses move track but includes endpoints in suppressedSquares', () => {
			const input: AnimationPlanningInput = {
				previous: makeSnapshot({
					board: makeBoardSnapshot([[e2, PieceCode.WhitePawn]]),
					interaction: makeInteractionSnapshot({
						dragSession: {
							owner: 'core' as const,
							type: 'lifted-piece-drag' as const,
							sourceSquare: e2,
							sourcePieceCode: PieceCode.WhitePawn,
							targetSquare: e4
						}
					})
				}),
				current: makeSnapshot({
					board: makeBoardSnapshot([[e4, PieceCode.WhitePawn]]),
					change: makeChangeSnapshot({
						lastMove: { from: e2, to: e4, piece: PieceCode.WhitePawn }
					}),
					interaction: makeInteractionSnapshot({ dragSession: null })
				})
			};
			const plan = calculateAnimationPlan(input);
			expect(findMoveTrack(plan.tracks, e2, e4)).toBeUndefined();
			expect(plan.tracks).toHaveLength(0);
			expect(plan.suppressedSquares.has(e2)).toBe(true);
			expect(plan.suppressedSquares.has(e4)).toBe(true);
		});

		it('does not suppress when drag type is release-targeting', () => {
			const input: AnimationPlanningInput = {
				previous: makeSnapshot({
					board: makeBoardSnapshot([[e2, PieceCode.WhitePawn]]),
					interaction: makeInteractionSnapshot({
						dragSession: {
							owner: 'core' as const,
							type: 'release-targeting' as const,
							sourceSquare: e2,
							sourcePieceCode: PieceCode.WhitePawn,
							targetSquare: e4
						}
					})
				}),
				current: makeSnapshot({
					board: makeBoardSnapshot([[e4, PieceCode.WhitePawn]]),
					change: makeChangeSnapshot({
						lastMove: { from: e2, to: e4, piece: PieceCode.WhitePawn }
					}),
					interaction: makeInteractionSnapshot({ dragSession: null })
				})
			};
			const plan = calculateAnimationPlan(input);
			expect(findMoveTrack(plan.tracks, e2, e4)).toBeDefined();
		});

		it('does not suppress when current still has a drag session', () => {
			const input: AnimationPlanningInput = {
				previous: makeSnapshot({
					board: makeBoardSnapshot([[e2, PieceCode.WhitePawn]]),
					interaction: makeInteractionSnapshot({
						dragSession: {
							owner: 'core' as const,
							type: 'lifted-piece-drag' as const,
							sourceSquare: e2,
							sourcePieceCode: PieceCode.WhitePawn,
							targetSquare: null
						}
					})
				}),
				current: makeSnapshot({
					board: makeBoardSnapshot([[e4, PieceCode.WhitePawn]]),
					change: makeChangeSnapshot({
						lastMove: { from: e2, to: e4, piece: PieceCode.WhitePawn }
					}),
					interaction: makeInteractionSnapshot({
						dragSession: {
							owner: 'core' as const,
							type: 'lifted-piece-drag' as const,
							sourceSquare: e4,
							sourcePieceCode: PieceCode.WhitePawn,
							targetSquare: null
						}
					})
				})
			};
			const plan = calculateAnimationPlan(input);
			expect(findMoveTrack(plan.tracks, e2, e4)).toBeDefined();
		});
	});

	describe('deferred UI move normalization', () => {
		it('incorporates deferred pawn move into effective board for planning', () => {
			const input: AnimationPlanningInput = {
				previous: makeSnapshot({ board: makeBoardSnapshot([[d7, PieceCode.BlackPawn]]) }),
				current: makeSnapshot({
					board: makeBoardSnapshot([[d7, PieceCode.BlackPawn]]),
					change: makeChangeSnapshot({
						deferredUIMoveRequest: {
							status: 'unresolved',
							sourceSquare: d7,
							destination: { to: d8 },
							canBeAutoResolved: false,
							resolvedMoveRequest: null
						}
					})
				})
			};
			const plan = calculateAnimationPlan(input);
			expect(findMoveTrack(plan.tracks, d7, d8)).toBeDefined();
		});
	});

	describe('auto-resolved promotion', () => {
		it('produces move track using original piece when promotedTo is set', () => {
			const input: AnimationPlanningInput = {
				previous: makeSnapshot({ board: makeBoardSnapshot([[d7, PieceCode.BlackPawn]]) }),
				current: makeSnapshot({
					board: makeBoardSnapshot([[d8, PieceCode.BlackQueen]]),
					change: makeChangeSnapshot({
						lastMove: { from: d7, to: d8, piece: PieceCode.BlackPawn, promotedTo: RoleCode.Queen }
					})
				})
			};
			const plan = calculateAnimationPlan(input);
			const mt = findMoveTrack(plan.tracks, d7, d8);
			expect(mt).toBeDefined();
			expect(mt!.pieceCode).toBe(PieceCode.BlackPawn);
		});
	});

	describe('deferred promotion resolve normalization', () => {
		it('normalizes correctly when deferred promotion is resolved (pawn already projected)', () => {
			// Previous: pawn on d7, deferred d7->d8 (effectively pawn already at d8)
			// Current: queen on d8, lastMove d7->d8 promoted
			// Since previous already projected pawn to d8, and current normalizes queen back to pawn,
			// the boards are identical => no tracks (piece already visually in place)
			const input: AnimationPlanningInput = {
				previous: makeSnapshot({
					board: makeBoardSnapshot([[d7, PieceCode.WhitePawn]]),
					change: makeChangeSnapshot({
						deferredUIMoveRequest: {
							status: 'unresolved',
							sourceSquare: d7,
							destination: { to: d8 },
							canBeAutoResolved: false,
							resolvedMoveRequest: null
						}
					})
				}),
				current: makeSnapshot({
					board: makeBoardSnapshot([[d8, PieceCode.WhiteQueen]]),
					change: makeChangeSnapshot({
						lastMove: { from: d7, to: d8, piece: PieceCode.WhitePawn, promotedTo: RoleCode.Queen }
					})
				})
			};
			const plan = calculateAnimationPlan(input);
			// No movement track needed: pawn was already projected to d8 in previous
			expect(plan.tracks).toHaveLength(0);
			// No fade-out/fade-in degradation
			expect(findFadeTrack(plan.tracks, 'fade-out', d7)).toBeUndefined();
			expect(findFadeTrack(plan.tracks, 'fade-in', d8)).toBeUndefined();
		});

		it('normalizes correctly when promotion arrives without prior deferred projection', () => {
			// Previous: pawn on d7, NO deferred move
			// Current: queen on d8, lastMove d7->d8 promoted
			// Normalization replaces queen with pawn on d8 => move track d7->d8
			const input: AnimationPlanningInput = {
				previous: makeSnapshot({
					board: makeBoardSnapshot([[d7, PieceCode.WhitePawn]])
				}),
				current: makeSnapshot({
					board: makeBoardSnapshot([[d8, PieceCode.WhiteQueen]]),
					change: makeChangeSnapshot({
						lastMove: { from: d7, to: d8, piece: PieceCode.WhitePawn, promotedTo: RoleCode.Queen }
					})
				})
			};
			const plan = calculateAnimationPlan(input);
			const mt = findMoveTrack(plan.tracks, d7, d8, PieceCode.WhitePawn);
			expect(mt).toBeDefined();
			expect(findFadeTrack(plan.tracks, 'fade-out', d7)).toBeUndefined();
			expect(findFadeTrack(plan.tracks, 'fade-in', d8)).toBeUndefined();
		});
	});

	describe('regression: cancelling deferred promotion after earlier promotion', () => {
		const regressionBoard = () =>
			makeBoardSnapshot([
				[f8, PieceCode.WhiteQueen],
				[e2, PieceCode.WhitePawn]
			]);
		const staleLastMove = {
			from: f7,
			to: f8,
			piece: PieceCode.WhitePawn as const,
			promotedTo: RoleCode.Queen as const
		};

		it('must not animate pawn toward old promoted square when deferred move is cancelled', () => {
			const prevBoard = regressionBoard();
			const currBoard = regressionBoard();
			const input: AnimationPlanningInput = {
				previous: makeSnapshot({
					board: prevBoard,
					change: makeChangeSnapshot({
						lastMove: staleLastMove,
						deferredUIMoveRequest: {
							status: 'unresolved',
							sourceSquare: e2,
							destination: { to: e8 },
							canBeAutoResolved: false,
							resolvedMoveRequest: null
						}
					})
				}),
				current: makeSnapshot({
					board: currBoard,
					change: makeChangeSnapshot({ lastMove: staleLastMove })
				})
			};
			const plan = calculateAnimationPlan(input);
			// No pawn move toward old promoted square
			expect(findMoveTrack(plan.tracks, e8, f8, PieceCode.WhitePawn)).toBeUndefined();
			// Pawn returns from projected target back to source
			const returnTrack = findMoveTrack(plan.tracks, e8, e2, PieceCode.WhitePawn);
			expect(returnTrack).toBeDefined();
			// f8 not incorrectly suppressed by stale promotion normalization
			expect(plan.suppressedSquares.has(f8)).toBe(false);
		});

		it('must not animate pawn toward old promoted square with capture-style deferred move', () => {
			const prevBoard = regressionBoard();
			const currBoard = regressionBoard();
			const input: AnimationPlanningInput = {
				previous: makeSnapshot({
					board: prevBoard,
					change: makeChangeSnapshot({
						lastMove: staleLastMove,
						deferredUIMoveRequest: {
							status: 'unresolved',
							sourceSquare: e2,
							destination: { to: d8 },
							canBeAutoResolved: false,
							resolvedMoveRequest: null
						}
					})
				}),
				current: makeSnapshot({
					board: currBoard,
					change: makeChangeSnapshot({ lastMove: staleLastMove })
				})
			};
			const plan = calculateAnimationPlan(input);
			// No pawn move toward old promoted square
			expect(findMoveTrack(plan.tracks, d8, f8, PieceCode.WhitePawn)).toBeUndefined();
			// Pawn returns from projected target back to source
			const returnTrack = findMoveTrack(plan.tracks, d8, e2, PieceCode.WhitePawn);
			expect(returnTrack).toBeDefined();
			// f8 not incorrectly suppressed by stale promotion normalization
			expect(plan.suppressedSquares.has(f8)).toBe(false);
		});

		it('same-target edge-case: deferred pawn targets same square as old promotion', () => {
			// The deferred move projects the pawn onto f8 itself (replacing the queen
			// in effective-previous). On cancel the pawn must return f8->e2; the old
			// promoted lastMove must NOT be treated as a resolution of that projection.
			const prevBoard = regressionBoard();
			const currBoard = regressionBoard();
			const input: AnimationPlanningInput = {
				previous: makeSnapshot({
					board: prevBoard,
					change: makeChangeSnapshot({
						lastMove: staleLastMove,
						deferredUIMoveRequest: {
							status: 'unresolved',
							sourceSquare: e2,
							destination: { to: f8 },
							canBeAutoResolved: false,
							resolvedMoveRequest: null
						}
					})
				}),
				current: makeSnapshot({
					board: currBoard,
					change: makeChangeSnapshot({ lastMove: staleLastMove })
				})
			};
			const plan = calculateAnimationPlan(input);
			// Cancelled pawn returns from f8 to e2
			const returnTrack = findMoveTrack(plan.tracks, f8, e2, PieceCode.WhitePawn);
			expect(returnTrack).toBeDefined();
			// No pawn fade-in at e2 (handled by move track)
			expect(findFadeTrack(plan.tracks, 'fade-in', e2, PieceCode.WhitePawn)).toBeUndefined();
		});
	});
});
