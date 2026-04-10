import { ExtensionRenderTransientVisualsContext } from '../../extensions/types';
import { TransientVisualsSnapshot } from '../../transientVisuals/types';
import { RenderSystemInternal } from '../types';
import { validateIsMounted } from './helpers';

export function performRenderTransientVisualsPass(
	state: RenderSystemInternal,
	request: TransientVisualsSnapshot
): void {
	validateIsMounted(state);
	const currentFrame = state.currentFrame;
	if (!currentFrame) {
		throw new Error(
			'renderTransientVisuals() called but no previous render state found. render() must be called before renderTransientVisuals().'
		);
	}

	// Just update state.lastRendered.current.state.visuals and the rest is the same
	for (const extensionRec of state.extensions.values()) {
		const context: ExtensionRenderTransientVisualsContext = {
			currentFrame,
			transientVisuals: {
				current: request,
				previous: state.currentTransientVisuals
			},
			invalidation: extensionRec.extension.invalidation,
			animation: extensionRec.extension.animation
		};
		extensionRec.extension.instance.renderTransientVisuals?.(context);
	}

	state.currentTransientVisuals = request;
}
