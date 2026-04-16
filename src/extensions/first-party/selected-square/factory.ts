import assert from '@ktarmyshov/assert';
import { createSvgElement, updateElementAttributes } from '../../../render/svg/helpers';
import { isUpdateContextRenderable } from '../../types/context/update';
import {
	DirtyLayer,
	EXTENSION_ID,
	EXTENSION_SLOTS,
	SelectedSquareDefinition,
	SelectedSquareInstance,
	SelectedSquareInstanceInternal
} from './types';

export function createSelectedSquare(): SelectedSquareDefinition {
	return {
		id: EXTENSION_ID,
		slots: EXTENSION_SLOTS,
		createInstance() {
			return createSelectedSquareInstance();
		}
	};
}

function createSelectedSquareInternal(): SelectedSquareInstanceInternal {
	return {
		slotRoots: null,
		svgRect: null,
		config: {
			color: 'rgba(255, 255, 0)',
			opacity: 0.4
		}
	};
}

function createSelectedSquareInstance(): SelectedSquareInstance {
	const internalState = createSelectedSquareInternal();
	return {
		id: EXTENSION_ID,
		mount(env) {
			internalState.slotRoots = env.slotRoots;
		},
		onUpdate(context) {
			const needsRender =
				context.mutation.hasMutation({
					causes: [
						'state.interaction.setSelectedSquare',
						'state.interaction.clear',
						'layout.refreshGeometry'
					]
				}) && isUpdateContextRenderable(context);
			if (!needsRender) {
				return; // no-op
			}
			context.invalidation.markDirty(DirtyLayer.Highlight);
		},
		render(context) {
			const selectedSquare = context.currentFrame.state.interaction.selected?.square;
			if (selectedSquare === undefined || selectedSquare === null) {
				if (internalState.svgRect !== null) {
					internalState.svgRect.remove();
					internalState.svgRect = null;
				}
				return;
			}
			const geometry = context.currentFrame.layout.geometry;
			const r = geometry.squareRect(selectedSquare);
			if (internalState.svgRect === null) {
				assert(internalState.slotRoots, 'Slot roots should be available when render is called');
				internalState.svgRect = createSvgElement(internalState.slotRoots.underPieces, 'rect', {
					'data-chessboard-id': 'selected-square-highlight',
					x: r.x.toString(),
					y: r.y.toString(),
					width: r.size.toString(),
					height: r.size.toString(),
					fill: internalState.config.color,
					opacity: internalState.config.opacity.toString(),
					'shape-rendering': 'crispEdges'
				});
			} else {
				updateElementAttributes(internalState.svgRect, {
					x: r.x.toString(),
					y: r.y.toString(),
					width: r.size.toString(),
					height: r.size.toString(),
					fill: internalState.config.color,
					opacity: internalState.config.opacity.toString()
				});
			}
		},
		unmount() {
			internalState.svgRect?.remove();
			internalState.svgRect = null;
			internalState.slotRoots = null;
		}
	};
}
