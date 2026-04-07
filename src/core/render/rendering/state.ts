import {
	AnyExtensionRenderStateContext,
	ExtensionRenderStateContextCommonBase
} from '../../extensions/types';
import { updateElementAttributes } from '../svg/helpers';
import { RenderInternal, RenderStateRequest } from '../types';
import { validateIsMounted } from './helpers';

export function checkNeedsRender(state: RenderInternal): boolean {
	for (const extension of state.extensions.values()) {
		if (extension.render.invalidation.dirtyLayers !== 0) {
			return true;
		}
	}
	return false;
}

export function performRenderStatePass(
	state: RenderInternal,
	request: RenderStateRequest | null
): void {
	validateIsMounted(state);
	if (!request) {
		throw new Error('Render called without a valid render request');
	}
	if (!request.current.layout.geometry) {
		throw new Error('Render called without a valid layout geometry');
	}

	const currentSize = request.current.layout.geometry.boardSize;
	const prevSize = state.lastRenderedState?.current.layout.geometry?.boardSize;
	if (currentSize !== prevSize) {
		const size = String(currentSize);
		updateElementAttributes(state.svgRoots.svgRoot, {
			width: size,
			height: size,
			viewBox: `0 0 ${size} ${size}`
		});
	}

	const contextBase: ExtensionRenderStateContextCommonBase = {
		previous: state.lastRenderedState?.current ?? null,
		mutation: request.mutation,
		current: request.current
	};

	// Check if we have any invalidation states
	if (!checkNeedsRender(state)) {
		console.debug('Render called but no invalidation detected, skipping render');
		// Save the last rendered common base context
		state.lastRenderedState = contextBase;
		return; // no-op
	}

	// Now run over the extensions that have invalidation layers marked and call their render method
	for (const extensionRec of state.extensions.values()) {
		if (extensionRec.render.invalidation.dirtyLayers !== 0) {
			const context: AnyExtensionRenderStateContext = {
				...contextBase,
				previousData: extensionRec.data.previous,
				currentData: extensionRec.data.current,
				invalidation: extensionRec.render.invalidation,
				animation: extensionRec.render.animation
			};
			extensionRec.instance.renderState?.(context);
			extensionRec.render.invalidation.clear();
		}
	}

	// Save the last rendered common base context
	state.lastRenderedState = contextBase;
}
