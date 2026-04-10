import {
	ExtensionRenderTransientVisualsContext,
	RenderFrameSnapshot
} from '../../extensions/types';
import { BoardRuntimeStateSnapshot } from '../../state/types';
import { VisualsStateSnapshot } from '../../state/visuals/types';
import { RenderInternal } from '../types';
import { validateIsMounted } from './helpers';

export function performRenderVisualsPass(
	state: RenderInternal,
	request: VisualsStateSnapshot
): void {
	validateIsMounted(state);
	const lastRendered = state.currentFrame;
	if (!lastRendered) {
		throw new Error(
			'RenderVisuals called but no previous render state found. RenderState must be called before RenderVisuals.'
		);
	}

	// Just update state.lastRendered.current.state.visuals and the rest is the same
	const newCurrentState: BoardRuntimeStateSnapshot = {
		...lastRendered.state,
		visuals: request
	};
	const newRendered: RenderFrameSnapshot = {
		...lastRendered,
		state: newCurrentState
	};
	for (const extensionRec of state.extensions.values()) {
		const context: ExtensionRenderTransientVisualsContext = {
			currentFrame: newRendered,
			invalidation: extensionRec.extension.invalidation,
			animation: extensionRec.extension.animation
		};
		extensionRec.extension.instance.renderTransientVisuals?.(context);
	}

	state.lastRendered = newRendered;
}
