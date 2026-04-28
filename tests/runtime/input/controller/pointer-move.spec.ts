import { describe, expect, it } from 'vitest';
import type { ScenePointerEvent } from '../../../../src/extensions/types/basic/events.js';
import { handlePointerMove } from '../../../../src/runtime/input/controller/pointer.js';
import { PieceCode, type Square } from '../../../../src/state/board/types/internal.js';
import { createEventContext, createMockSurface } from '../../../test-utils/runtime/controller.js';

function makeContext(targetSquare: number | null) {
	return createEventContext({
		rawEvent: new PointerEvent('pointermove'),
		sceneEvent: {
			type: 'pointermove',
			point: { x: 100, y: 100 },
			clampedPoint: { x: 100, y: 100 },
			boardClampedPoint: { x: 100, y: 100 },
			targetSquare
		} as ScenePointerEvent
	});
}

describe('handlePointerMove', () => {
	it('does nothing when no active drag session', () => {
		const surface = createMockSurface();
		const context = makeContext(28);

		handlePointerMove({ surface }, context);

		expect(surface.updateDragSessionCurrentTarget).not.toHaveBeenCalled();
	});

	it('updates drag target when drag session is active and target is a square', () => {
		const surface = createMockSurface({
			snapshot: {
				dragSession: {
					owner: 'core',
					type: 'lifted-piece-drag',
					sourceSquare: 12 as Square,
					sourcePieceCode: PieceCode.WhitePawn,
					targetSquare: 12 as Square
				}
			}
		});
		const context = makeContext(28);

		handlePointerMove({ surface }, context);

		expect(surface.updateDragSessionCurrentTarget).toHaveBeenCalledWith(28);
	});

	it('updates drag target to null when drag session is active and target is null', () => {
		const surface = createMockSurface({
			snapshot: {
				dragSession: {
					owner: 'core',
					type: 'lifted-piece-drag',
					sourceSquare: 12 as Square,
					sourcePieceCode: PieceCode.WhitePawn,
					targetSquare: 12 as Square
				}
			}
		});
		const context = createEventContext({
			rawEvent: new PointerEvent('pointermove'),
			sceneEvent: {
				type: 'pointermove',
				point: { x: -10, y: -10 },
				clampedPoint: { x: 0, y: 0 },
				boardClampedPoint: null,
				targetSquare: null
			} as ScenePointerEvent
		});

		handlePointerMove({ surface }, context);

		expect(surface.updateDragSessionCurrentTarget).toHaveBeenCalledWith(null);
	});
});
