import { describe, expect, it, vi } from 'vitest';
import { makeRenderGeometry } from '../../../src/core/renderer/geometry';
import { SvgRenderer } from '../../../src/core/renderer/SvgRenderer';
import { DirtyLayer } from '../../../src/core/scheduler/types';
import type { BoardStateSnapshot, Square } from '../../../src/core/state/boardTypes';

function sq(n: number): Square {
	return n as Square;
}

/** Minimal board snapshot helper */
function makeBoardSnapshot(
	overrides?: Partial<{ pieces: Uint8Array; ids: Int16Array; positionEpoch: number }>
): BoardStateSnapshot {
	const pieces = overrides?.pieces ?? new Uint8Array(64);
	const ids = overrides?.ids ?? new Int16Array(64).fill(-1);
	const positionEpoch = overrides?.positionEpoch ?? 0;
	return { pieces, ids, turn: 'white', positionEpoch };
}

describe('SvgRenderer committed move animation (Phase 3.9)', () => {
	it('initial render: no animation (ids seeded, no movers)', () => {
		const renderer = new SvgRenderer();
		const container = document.createElement('div');
		renderer.mount(container);

		// Single white pawn at e2 (square 12) with id=1
		const pieces = new Uint8Array(64);
		const ids = new Int16Array(64).fill(-1);
		pieces[sq(12)] = 1;
		ids[sq(12)] = 1;

		const board = makeBoardSnapshot({ pieces, ids });
		const geometry = makeRenderGeometry(800, 'white');

		renderer.render({
			board,
			invalidation: { layers: DirtyLayer.Pieces },
			geometry,
			interaction: {
				selectedSquare: null,
				destinations: null,
				currentTarget: null,
				dragSession: null
			},
			transientVisuals: { dragPointer: null }
		});

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const animationRoot = (renderer as any).animationRoot as SVGGElement;
		expect(animationRoot.children.length).toBe(0);

		// Second render with identical ids: still no animation
		renderer.render({
			board,
			invalidation: { layers: DirtyLayer.Pieces },
			geometry,
			interaction: {
				selectedSquare: null,
				destinations: null,
				currentTarget: null,
				dragSession: null
			},
			transientVisuals: { dragPointer: null }
		});
		expect(animationRoot.children.length).toBe(0);

		renderer.unmount();
	});

	it('static node restoration: piece visible after animation completes without external render', () => {
		const renderer = new SvgRenderer();
		const container = document.createElement('div');
		renderer.mount(container);

		// Seed: piece at e2 (12) with id=1
		const pieces1 = new Uint8Array(64);
		const ids1 = new Int16Array(64).fill(-1);
		pieces1[sq(12)] = 1;
		ids1[sq(12)] = 1;

		const board1 = makeBoardSnapshot({ pieces: pieces1, ids: ids1 });
		const geometry = makeRenderGeometry(800, 'white');

		// Initial render (no animation) — seeds previousCommittedIds
		renderer.render({
			board: board1,
			invalidation: { layers: DirtyLayer.Pieces },
			geometry,
			interaction: {
				selectedSquare: null,
				destinations: null,
				currentTarget: null,
				dragSession: null
			},
			transientVisuals: { dragPointer: null }
		});

		// Next: same id=1 moves from e2 (12) to e4 (28)
		const pieces2 = new Uint8Array(64);
		const ids2 = new Int16Array(64).fill(-1);
		pieces2[sq(28)] = 1; // white pawn asset code remains pawn
		ids2[sq(28)] = 1; // moved piece keeps same ID

		const board2 = makeBoardSnapshot({ pieces: pieces2, ids: ids2 });

		// Stub performance.now and requestAnimationFrame to control async completion
		const nowSpy = vi.spyOn(performance, 'now').mockReturnValue(0);
		const originalRAF = globalThis.requestAnimationFrame;
		let storedCallback: FrameRequestCallback | null = null;
		globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
			// Store the callback instead of invoking it immediately
			storedCallback = cb;
			return 1 as unknown as number;
		}) as unknown as typeof requestAnimationFrame;

		// Drive the committed move render
		renderer.render({
			board: board2,
			invalidation: { layers: DirtyLayer.Pieces },
			geometry,
			interaction: {
				selectedSquare: null,
				destinations: null,
				currentTarget: null,
				dragSession: null
			},
			transientVisuals: { dragPointer: null }
		});

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const animationRoot = (renderer as any).animationRoot as SVGGElement;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const piecesRoot = (renderer as any).piecesRoot as SVGGElement;

		// After render() but before rAF flush: animation is in progress
		// - transient node exists in animationRoot
		// - static piece still suppressed from piecesRoot
		expect(animationRoot.children.length).toBe(1);
		expect(piecesRoot.children.length).toBe(0);

		// Manually flush the stored rAF callback to complete animation
		expect(storedCallback).not.toBeNull();
		storedCallback!(1000); // timestamp well past duration

		// After rAF completion (no second render() call):
		// - transient node removed from animationRoot
		// - static piece restored to piecesRoot
		expect(animationRoot.children.length).toBe(0);
		expect(piecesRoot.children.length).toBe(1);

		// Verify the restored static piece is positioned at destination rect
		const node = piecesRoot.children[0] as SVGImageElement;
		const destRect = geometry.squareRect(sq(28));
		expect(node.getAttribute('x')).toBe(String(destRect.x));
		expect(node.getAttribute('y')).toBe(String(destRect.y));
		expect(node.getAttribute('width')).toBe(String(destRect.size));
		expect(node.getAttribute('height')).toBe(String(destRect.size));

		// Cleanup stubs
		nowSpy.mockRestore();
		globalThis.requestAnimationFrame = originalRAF;

		renderer.unmount();
	});
});
