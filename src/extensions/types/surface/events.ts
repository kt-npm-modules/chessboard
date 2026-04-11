import { BoardEventType } from '../basic/events';

export interface ExtensionRuntimeSurfaceEvents {
	subscribe(events: Iterable<BoardEventType>): void;
	unsubscribe(events?: Iterable<BoardEventType>): void;
}
