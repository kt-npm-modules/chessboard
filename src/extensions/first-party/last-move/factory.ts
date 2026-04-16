import assert from '@ktarmyshov/assert';
import { createSvgElement, updateElementAttributes } from '../../../render/svg/helpers';
import { isUpdateContextRenderable } from '../../types/context/update';
import {
	DirtyLayer,
	EXTENSION_ID,
	EXTENSION_SLOTS,
	LastMoveDefinition,
	LastMoveInstance,
	LastMoveInstanceInternal
} from './types';

export function createLastMove(): LastMoveDefinition {
	return {
		id: EXTENSION_ID,
		slots: EXTENSION_SLOTS,
		createInstance() {
			return createLastMoveInstance();
		}
	};
}

function createLastMoveInternal(): LastMoveInstanceInternal {
	return {
		slotRoots: null,
		svgRectFrom: null,
		svgRectTo: null,
		config: {
			color: 'rgba(255, 255, 0)',
			opacity: 0.4
		}
	};
}

function createLastMoveInstance(): LastMoveInstance {
	const internalState = createLastMoveInternal();
	return {
		id: EXTENSION_ID,
		mount(env) {
			internalState.slotRoots = env.slotRoots;
		},
		onUpdate(context) {
			const needsRender =
				context.mutation.hasMutation({
					causes: ['state.change.setLastMove', 'layout.refreshGeometry']
				}) && isUpdateContextRenderable(context);
			if (!needsRender) {
				return; // no-op
			}
			context.invalidation.markDirty(DirtyLayer.Highlight);
		},
		render(context) {
			const fromSq = context.currentFrame.state.change.lastMove?.from;
			const toSq = context.currentFrame.state.change.lastMove?.to;
			if (fromSq === undefined || fromSq === null || toSq === undefined || toSq === null) {
				if (internalState.svgRectFrom !== null) {
					internalState.svgRectFrom.remove();
					internalState.svgRectFrom = null;
					assert(
						internalState.svgRectTo,
						'svgRectTo should be available if svgRectFrom is available'
					);
					internalState.svgRectTo.remove();
					internalState.svgRectTo = null;
				}
				return;
			}
			const geometry = context.currentFrame.layout.geometry;
			const rFrom = geometry.squareRect(fromSq);
			const rTo = geometry.squareRect(toSq);
			if (internalState.svgRectFrom === null) {
				assert(internalState.slotRoots, 'Slot roots should be available when render is called');
				internalState.svgRectFrom = createSvgElement(internalState.slotRoots.underPieces, 'rect', {
					'data-chessboard-id': 'last-move-square-from-highlight',
					x: rFrom.x.toString(),
					y: rFrom.y.toString(),
					width: rFrom.size.toString(),
					height: rFrom.size.toString(),
					fill: internalState.config.color,
					opacity: internalState.config.opacity.toString(),
					'shape-rendering': 'crispEdges'
				});
				internalState.svgRectTo = createSvgElement(internalState.slotRoots.underPieces, 'rect', {
					'data-chessboard-id': 'last-move-square-to-highlight',
					x: rTo.x.toString(),
					y: rTo.y.toString(),
					width: rTo.size.toString(),
					height: rTo.size.toString(),
					fill: internalState.config.color,
					opacity: internalState.config.opacity.toString(),
					'shape-rendering': 'crispEdges'
				});
			} else {
				updateElementAttributes(internalState.svgRectFrom, {
					x: rFrom.x.toString(),
					y: rFrom.y.toString(),
					width: rFrom.size.toString(),
					height: rFrom.size.toString(),
					fill: internalState.config.color,
					opacity: internalState.config.opacity.toString()
				});
				assert(
					internalState.svgRectTo,
					'svgRectTo should be available if svgRectFrom is available'
				);
				updateElementAttributes(internalState.svgRectTo, {
					x: rTo.x.toString(),
					y: rTo.y.toString(),
					width: rTo.size.toString(),
					height: rTo.size.toString(),
					fill: internalState.config.color,
					opacity: internalState.config.opacity.toString()
				});
			}
		},
		unmount() {
			internalState.svgRectFrom?.remove();
			internalState.svgRectTo?.remove();
			internalState.svgRectFrom = null;
			internalState.svgRectTo = null;
			internalState.slotRoots = null;
		}
	};
}
