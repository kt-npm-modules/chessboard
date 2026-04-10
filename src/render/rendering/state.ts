import { ExtensionRenderContext, RenderFrameSnapshot } from '../../extensions/types';
import { updateElementAttributes } from '../svg/helpers';
import { RenderInternal } from '../types';
import { validateIsMounted } from './helpers';

export function checkNeedsRender(state: RenderInternal): boolean {
	for (const extensionRec of state.extensions.values()) {
		if (extensionRec.extension.invalidation.dirtyLayers !== 0) {
			return true;
		}
	}
	return false;
}

export function performRenderStatePass(
	state: RenderInternal,
	request: RenderFrameSnapshot | null
): void {
	validateIsMounted(state);
	if (!request) {
		throw new Error('Render called without a valid render request');
	}
	if (!request.layout.geometry) {
		throw new Error('Render called without a valid layout geometry');
	}

	const currentSize = request.layout.geometry.boardSize;
	const prevSize = state.currentFrame?.layout.geometry?.boardSize;
	if (currentSize !== prevSize) {
		const size = String(currentSize);
		updateElementAttributes(state.svgRoots.svgRoot, {
			width: size,
			height: size,
			viewBox: `0 0 ${size} ${size}`
		});
	}

	// Check if we have any invalidation states
	if (!checkNeedsRender(state)) {
		// Save the last rendered common base context
		state.currentFrame = request;
		return; // no-op
	}

	// Now run over the extensions that have invalidation layers marked and call their render method
	for (const extensionRec of state.extensions.values()) {
		if (extensionRec.extension.invalidation.dirtyLayers !== 0) {
			const context: ExtensionRenderContext = {
				currentFrame: request,
				invalidation: extensionRec.extension.invalidation,
				animation: extensionRec.extension.animation
			};
			extensionRec.extension.instance.render?.(context);
			extensionRec.extension.invalidation.clear();
		}
	}

	// Save the last rendered common base context
	state.currentFrame = request;
}
