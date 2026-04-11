import { Square } from '../../../state/board/types';
import { BoardPoint } from '../basic/transient-visuals';

interface BoardEventBase {
	readonly defaultPrevented: boolean;
	preventDefault(): void;
}

export interface BoardPointerEvent extends BoardEventBase {
	// DOM part
	readonly type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel' | 'pointerleave';
	readonly pointerId: number;
	readonly isPrimary: boolean;
	readonly button: number;
	readonly buttons: number;
	readonly ctrlKey: boolean;
	readonly altKey: boolean;
	readonly shiftKey: boolean;
	readonly metaKey: boolean;
	// Board part
	readonly rawPoint: BoardPoint | null; // null if geometry unavailable
	readonly clampedPoint: BoardPoint | null; // null if geometry unavailable
	readonly target: Square | null;
}

export type BoardPointerEventType = BoardPointerEvent['type'];
export const BOARD_POINTER_EVENT_TYPES: BoardPointerEventType[] = [
	'pointerdown',
	'pointermove',
	'pointerup',
	'pointercancel',
	'pointerleave'
];

export interface BoardKeyboardEvent extends BoardEventBase {
	readonly type: 'keydown' | 'keyup';
	// DOM part
	readonly key: string;
	readonly repeat: boolean;
	readonly ctrlKey: boolean;
	readonly altKey: boolean;
	readonly shiftKey: boolean;
	readonly metaKey: boolean;
}

export type BoardEvent = BoardPointerEvent | BoardKeyboardEvent;

export type BoardEventType = BoardEvent['type'];
