import { describe, expect, it } from 'vitest';
import { createTestBoard, createTestContainer } from '../test-utils/wrapper/factory.js';

describe('wrapper factory – mount behavior', () => {
	it('mount creates SVG structure in the provided container', () => {
		const board = createTestBoard();
		const container = createTestContainer();

		board.mount(container);

		expect(container.children.length).toBeGreaterThan(0);
		// SVG root should be present
		const svg = container.querySelector('svg');
		expect(svg).not.toBeNull();
	});

	it('mount creates SVG with expected layer structure', () => {
		const board = createTestBoard();
		const container = createTestContainer();

		board.mount(container);

		// SVG should contain layer groups for the renderer slots
		const svg = container.querySelector('svg');
		expect(svg).not.toBeNull();
		expect(svg!.querySelectorAll('g').length).toBeGreaterThan(0);
	});
});

describe('wrapper factory – unmount behavior', () => {
	it('unmount removes SVG structure from the container', () => {
		const board = createTestBoard();
		const container = createTestContainer();

		board.mount(container);
		expect(container.children.length).toBeGreaterThan(0);

		board.unmount();

		expect(container.children.length).toBe(0);
	});
});

describe('wrapper factory – destroy behavior', () => {
	it('destroy cleans up and prevents subsequent mount', () => {
		const board = createTestBoard();
		const container = createTestContainer();

		board.mount(container);
		board.destroy();

		const container2 = createTestContainer();
		expect(() => board.mount(container2)).toThrow();
	});

	it('destroy without mount does not throw', () => {
		const board = createTestBoard();

		expect(() => board.destroy()).not.toThrow();
	});

	it('mount after destroy throws', () => {
		const board = createTestBoard();
		board.destroy();

		const container = createTestContainer();
		expect(() => board.mount(container)).toThrow();
	});
});

describe('wrapper factory – getSnapshot', () => {
	it('returns a valid state snapshot after creation', () => {
		const board = createTestBoard();

		const snapshot = board.getSnapshot();

		expect(snapshot).toBeDefined();
		expect(snapshot.state).toBeDefined();
		expect(snapshot.state.board).toBeDefined();
		expect(snapshot.state.board.pieces).toBeDefined();
		expect(snapshot.state.board.turn).toBeDefined();
		expect(snapshot.state.interaction).toBeDefined();
		expect(snapshot.state.change).toBeDefined();
		expect(snapshot.state.view).toBeDefined();
	});

	it('returns a snapshot with expected initial board state', () => {
		const board = createTestBoard();

		const snapshot = board.getSnapshot();

		expect(snapshot.state.board.pieces).toBeInstanceOf(Uint8Array);
		expect(snapshot.state.board.pieces.length).toBe(64);
	});

	it('returns layout information in snapshot', () => {
		const board = createTestBoard();

		const snapshot = board.getSnapshot();

		expect(snapshot.layout).toBeDefined();
	});
});
