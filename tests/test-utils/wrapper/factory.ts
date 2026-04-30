import type { Chessboard, ChessboardInitOptions } from '../../../src/index.js';
import { createBoard } from '../../../src/index.js';

// Stub ResizeObserver for jsdom (runtime.mount uses it)
if (typeof globalThis.ResizeObserver === 'undefined') {
	globalThis.ResizeObserver = class ResizeObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
	} as unknown as typeof globalThis.ResizeObserver;
}

/**
 * Creates a test board with minimal defaults.
 * Uses document option (no auto-mount) with a minimal extension set.
 */
export function createTestBoard(
	opts?: Partial<ChessboardInitOptions>
): Chessboard<readonly ['renderer']> {
	const defaults: ChessboardInitOptions<readonly ['renderer']> = {
		document,
		extensions: ['renderer'] as const
	};
	return createBoard({ ...defaults, ...opts } as never);
}

/**
 * Creates an HTMLElement to serve as a mount container.
 */
export function createTestContainer(): HTMLElement {
	return document.createElement('div');
}
