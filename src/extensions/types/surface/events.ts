import { Square } from '../../../state/board/types';
import { BoardPoint } from '../basic/transient-visuals';

interface BoardEventBase {
	readonly defaultPrevented: boolean;
	preventDefault(): void;
}

export interface BoardPointerEvent extends BoardEventBase {
	readonly type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel';
	readonly square: Square | null;
	readonly rawPoint: BoardPoint;
	readonly clampedPoint: BoardPoint;
	readonly ctrlKey: boolean;
	readonly altKey: boolean;
	readonly shiftKey: boolean;
	readonly metaKey: boolean;
}

export interface BoardKeyboardEvent extends BoardEventBase {
	readonly type: 'keydown' | 'keyup';
	readonly key: string;
	readonly repeat: boolean;
	readonly ctrlKey: boolean;
	readonly altKey: boolean;
	readonly shiftKey: boolean;
	readonly metaKey: boolean;
}

export type BoardEvent = BoardPointerEvent | BoardKeyboardEvent;

export type BoardEventType = BoardEvent['type'];

export interface ExtensionRuntimeSurfaceEvents {
	subscribe(events: Iterable<BoardEventType>): void;
	unsubscribe(events?: Iterable<BoardEventType>): void;
}
