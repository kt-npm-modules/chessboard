import { createSvgGroup } from '../helpers';
import { renderDrag } from './render';
import { SvgRendererDrag, SvgRendererDragInternals } from './types';

function createSvgRendererDragInternals(doc: Document): SvgRendererDragInternals {
	return {
		root: createSvgGroup(doc, { id: 'renderer-drag-root' }),
		defsRoot: createSvgGroup(doc, { id: 'renderer-drag-defs' })
	};
}

export function createRendererDrag(doc: Document): SvgRendererDrag {
	const internalState = createSvgRendererDragInternals(doc);
	return {
		...internalState,
		render(context) {
			renderDrag(internalState, context);
		}
	};
}
