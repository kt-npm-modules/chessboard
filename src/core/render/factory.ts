import { Square } from '../state/board/types';
import { createInvalidationState } from './invalidation/factory';
import { InvalidationState } from './invalidation/types';
import { DragRenderContext } from './renderer/drag/types';
import { createSvgRenderer } from './renderer/factory';
import { BoardRenderContext } from './renderer/types';
import { createScheduler } from './scheduler/scheduler';
import { Render, RenderInitOptions, RenderRequest } from './types';

function checkRenderInvalidation(invalidationState: InvalidationState): boolean {
	const invalidLayers = [invalidationState.getLayers() !== 0];
	const extensions = invalidationState.getExtensions();
	for (const extensionId in extensions) {
		const extension = extensions[extensionId];
		if (extension.getLayers() !== 0) {
			invalidLayers.push(true);
			break;
		}
	}
	return invalidLayers.some(Boolean);
}

export function createRender(doc: Document, options: RenderInitOptions): Render {
	const svgRenderer = createSvgRenderer(doc, options.svgRenderer);
	const invalidation = createInvalidationState();
	let pendingRequest: RenderRequest | null = null;
	function render() {
		const request = pendingRequest;
		pendingRequest = null;
		if (svgRenderer.container == null) {
			throw new Error('Render called before renderer was mounted to a container');
		}
		if (!request) {
			throw new Error('Render called without a valid render request');
		}
		if (!request.layout.geometry) {
			throw new Error('Render called without a valid layout geometry');
		}
		// Check if we have any invalidation states
		if (!checkRenderInvalidation(invalidation)) {
			return; // no-op
		}

		try {
			// Now build contexts and render
			// Board
			const suppressedSquares = new Set<Square>();
			const dragFromSquare = request.state.interaction.dragSession?.fromSquare;
			if (dragFromSquare) {
				suppressedSquares.add(dragFromSquare);
			}
			// TODO: Also need to suppress the animated squares
			const boardCtx: BoardRenderContext = {
				invalidation: invalidation.getSnapshot(),
				board: request.state.board,
				suppressedSquares: suppressedSquares,
				geometry: request.layout.geometry
			};
			svgRenderer.renderBoard(boardCtx);

			// Drag
			if (request.state.interaction.dragSession) {
				const dragCtx: DragRenderContext = {
					interaction: request.state.interaction,
					visuals: request.state.visuals,
					board: request.state.board,
					geometry: request.layout.geometry
				};
				svgRenderer.renderDrag(dragCtx);
			}

			// TODO: Animations
		} finally {
			// Clear the render request and any dirty flags after rendering
			invalidation.clearAfterRender();
		}
	}

	const scheduler = createScheduler({
		render
	});

	return {
		invalidation,
		requestRender(request) {
			pendingRequest = request;
			scheduler.schedule();
		}
	};
}
