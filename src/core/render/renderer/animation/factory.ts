import { createSvgGroup } from '../helpers';
import { renderAnimations } from './render';
import { SvgRendererAnimation, SvgRendererAnimationInternals } from './types';

function createRendererAnimationInternals(doc: Document): SvgRendererAnimationInternals {
	return {
		root: createSvgGroup(doc, { id: 'renderer-animation-root' }),
		defsRoot: createSvgGroup(doc, { id: 'renderer-animation-defs-root' }),
		activeSessionGroup: null
	};
}

export function createRendererAnimation(doc: Document): SvgRendererAnimation {
	const internalState = createRendererAnimationInternals(doc);
	return {
		...internalState,
		get activeSessionGroup() {
			return internalState.activeSessionGroup;
		},
		render(context) {
			renderAnimations(internalState, context);
		}
	};
}
