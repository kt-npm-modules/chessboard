import { BoardEvent, BoardPointerEvent } from '../../../extensions/types/basic/events';
import { InteractionControllerInternal } from './types';

function isPointerEvent(event: BoardEvent): event is BoardPointerEvent {
	return event.type.startsWith('pointer');
}

export function transmitTransientInput(
	state: InteractionControllerInternal,
	event: BoardEvent
): void {
	if (isPointerEvent(event) && event.rawPoint && event.clampedPoint) {
		state.surface.transientInput({
			target: event.target,
			rawPoint: event.rawPoint,
			clampedPoint: event.clampedPoint
		});
	}
}
