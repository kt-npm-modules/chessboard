import { describe, expect, it } from 'vitest';
import { createBoard } from '../../src/index.js';
import { createTestBoard, createTestContainer } from '../test-utils/wrapper/factory.js';

describe('wrapper factory – public surface shape', () => {
	it('returns lifecycle methods', () => {
		const board = createTestBoard();

		expect(typeof board.mount).toBe('function');
		expect(typeof board.unmount).toBe('function');
		expect(typeof board.destroy).toBe('function');
	});

	it('returns command methods', () => {
		const board = createTestBoard();

		expect(typeof board.setPosition).toBe('function');
		expect(typeof board.setPiecePosition).toBe('function');
		expect(typeof board.setTurn).toBe('function');
		expect(typeof board.move).toBe('function');
		expect(typeof board.setOrientation).toBe('function');
		expect(typeof board.setMovability).toBe('function');
		expect(typeof board.select).toBe('function');
		expect(typeof board.getSnapshot).toBe('function');
	});

	it('returns extensions property as an object', () => {
		const board = createTestBoard();

		expect(typeof board.extensions).toBe('object');
		expect(board.extensions).not.toBeNull();
	});
});

describe('wrapper factory – auto-mount behavior', () => {
	it('auto-mounts when element option is provided', () => {
		const container = createTestContainer();

		createBoard({ element: container, extensions: ['renderer'] as const });

		// Auto-mount creates SVG structure in the container
		expect(container.children.length).toBeGreaterThan(0);
	});

	it('does not auto-mount when document option is provided without element', () => {
		const board = createTestBoard();
		const container = createTestContainer();

		// No DOM children until explicit mount
		expect(container.children.length).toBe(0);

		board.mount(container);
		expect(container.children.length).toBeGreaterThan(0);
	});
});

describe('wrapper factory – default extensions', () => {
	it('works with no extensions option (uses all built-in defaults)', () => {
		const container = createTestContainer();

		// Use real default extensions by not passing extensions option
		const board = createBoard({ element: container });

		// Should render successfully with all built-in extensions
		expect(container.children.length).toBeGreaterThan(0);
		expect(typeof board.getSnapshot).toBe('function');
	});

	it('resolves built-in extension string to working definition', () => {
		const container = createTestContainer();

		const board = createBoard({ element: container, extensions: ['renderer'] as const });

		expect(container.children.length).toBeGreaterThan(0);
		expect(typeof board.getSnapshot).toBe('function');
	});

	it('resolves built-in extension with config object form', () => {
		const container = createTestContainer();

		// The 'renderer' extension accepts MainRendererInitOptions
		const board = createBoard({
			element: container,
			extensions: [{ builtin: 'renderer', options: {} }] as const
		});

		expect(container.children.length).toBeGreaterThan(0);
		expect(typeof board.getSnapshot).toBe('function');
	});
});
