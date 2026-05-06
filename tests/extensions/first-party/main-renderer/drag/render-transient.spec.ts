import { describe, expect, it } from 'vitest';
import { rendererDragRenderTransientVisuals } from '../../../../../src/extensions/first-party/main-renderer/drag/render.js';
import type { MainRendererDragInternal } from '../../../../../src/extensions/first-party/main-renderer/drag/types.js';
import {
	type NonEmptyPieceCode,
	PieceCode
} from '../../../../../src/state/board/types/internal.js';
import { queryByDataChessboardId } from '../../../../test-utils/dom/svg.js';
import {
	createDragLayer,
	createDragTransientVisualsContext,
	createMockRuntimeSurface
} from '../../../../test-utils/extensions/first-party/main-renderer/drag.js';
import {
	createTestPieceSymbolResolver,
	createTestPieceUrls
} from '../../../../test-utils/extensions/first-party/main-renderer/pieces.js';

const pieceUrls = createTestPieceUrls();
const resolver = createTestPieceSymbolResolver();

function createInactiveState(): MainRendererDragInternal {
	const { surface } = createMockRuntimeSurface();
	return {
		runtimeSurface: surface,
		resolver,
		isDragActive: false,
		pieceCode: null,
		pieceNode: null
	};
}

function createActiveState(
	pieceCode: NonEmptyPieceCode = PieceCode.WhiteKing
): MainRendererDragInternal {
	const { surface } = createMockRuntimeSurface();
	return {
		runtimeSurface: surface,
		resolver,
		isDragActive: true,
		pieceCode,
		pieceNode: null
	};
}

function createActiveStateNoPiece(): MainRendererDragInternal {
	const { surface } = createMockRuntimeSurface();
	return {
		runtimeSurface: surface,
		resolver,
		isDragActive: true,
		pieceCode: null,
		pieceNode: null
	};
}

describe('drag transient render – inactive', () => {
	it('no-op when drag is inactive', () => {
		const state = createInactiveState();
		const layer = createDragLayer();
		const ctx = createDragTransientVisualsContext();

		rendererDragRenderTransientVisuals(state, ctx, layer);

		expect(layer.children.length).toBe(0);
	});

	it('no-op when active but pieceCode is null', () => {
		const state = createActiveStateNoPiece();
		const layer = createDragLayer();
		const ctx = createDragTransientVisualsContext();

		rendererDragRenderTransientVisuals(state, ctx, layer);

		expect(layer.children.length).toBe(0);
	});
});

describe('drag transient render – creates dragged use element', () => {
	it('creates a use element on first render when active with pieceCode', () => {
		const state = createActiveState();
		const layer = createDragLayer();
		const ctx = createDragTransientVisualsContext({ boardClampedPoint: { x: 200, y: 200 } });

		rendererDragRenderTransientVisuals(state, ctx, layer);

		expect(layer.children.length).toBe(1);
		expect(layer.children[0].tagName).toBe('use');
	});

	it('sets data-chessboard-id to dragged-piece', () => {
		const state = createActiveState();
		const layer = createDragLayer();
		const ctx = createDragTransientVisualsContext();

		rendererDragRenderTransientVisuals(state, ctx, layer);

		expect(queryByDataChessboardId(layer, 'dragged-piece')).not.toBeNull();
	});

	it('positions element centered around boardClampedPoint', () => {
		const state = createActiveState();
		const layer = createDragLayer();
		// 400px scene → squareSize = 50, point at (200, 150)
		const ctx = createDragTransientVisualsContext({
			sceneSize: 400,
			boardClampedPoint: { x: 200, y: 150 }
		});

		rendererDragRenderTransientVisuals(state, ctx, layer);

		const el = layer.children[0];
		// x = 200 - 50/2 = 175, y = 150 - 50/2 = 125
		expect(el.getAttribute('x')).toBe('175');
		expect(el.getAttribute('y')).toBe('125');
	});

	it('sets width and height from geometry.squareSize', () => {
		const state = createActiveState();
		const layer = createDragLayer();
		const ctx = createDragTransientVisualsContext({ sceneSize: 400 }); // squareSize = 50

		rendererDragRenderTransientVisuals(state, ctx, layer);

		const el = layer.children[0];
		expect(el.getAttribute('width')).toBe('50');
		expect(el.getAttribute('height')).toBe('50');
	});

	it('uses resolver symbol href as href', () => {
		const state = createActiveState(PieceCode.BlackQueen);
		const layer = createDragLayer();
		const ctx = createDragTransientVisualsContext();

		rendererDragRenderTransientVisuals(state, ctx, layer);

		expect(layer.children[0].getAttribute('href')).toBe(resolver.getHref(PieceCode.BlackQueen));
	});

	it('appends element to the provided layer element', () => {
		const state = createActiveState();
		const layer = createDragLayer();
		const ctx = createDragTransientVisualsContext();

		rendererDragRenderTransientVisuals(state, ctx, layer);

		expect(layer.children[0].parentElement).toBe(layer);
	});
});

describe('drag transient render – subsequent renders', () => {
	it('updates existing node position without creating duplicate', () => {
		const state = createActiveState();
		const layer = createDragLayer();

		// First render
		const ctx1 = createDragTransientVisualsContext({
			sceneSize: 400,
			boardClampedPoint: { x: 100, y: 100 }
		});
		rendererDragRenderTransientVisuals(state, ctx1, layer);
		expect(layer.children.length).toBe(1);
		expect(layer.children[0].getAttribute('x')).toBe('75'); // 100 - 25

		// Second render with different position
		const ctx2 = createDragTransientVisualsContext({
			sceneSize: 400,
			boardClampedPoint: { x: 300, y: 200 }
		});
		rendererDragRenderTransientVisuals(state, ctx2, layer);

		expect(layer.children.length).toBe(1);
		expect(layer.children[0].getAttribute('x')).toBe('275'); // 300 - 25
		expect(layer.children[0].getAttribute('y')).toBe('175'); // 200 - 25
	});

	it('updates width/height when geometry changes', () => {
		const state = createActiveState();
		const layer = createDragLayer();

		// First render with 400px scene (squareSize=50)
		rendererDragRenderTransientVisuals(
			state,
			createDragTransientVisualsContext({ sceneSize: 400 }),
			layer
		);
		expect(layer.children[0].getAttribute('width')).toBe('50');

		// Second render with 800px scene (squareSize=100)
		rendererDragRenderTransientVisuals(
			state,
			createDragTransientVisualsContext({ sceneSize: 800 }),
			layer
		);
		expect(layer.children[0].getAttribute('width')).toBe('100');
	});
});
