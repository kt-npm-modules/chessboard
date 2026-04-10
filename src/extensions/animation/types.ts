import {
	ExtensionAnimationSessionInternalSurface,
	ExtensionAnimationSessionStatus
} from '../types';

export interface ExtensionAnimationSessionInternal {
	readonly id: string;
	readonly startTime: DOMHighResTimeStamp;
	readonly duration: DOMHighResTimeStamp;
	status: ExtensionAnimationSessionStatus;
}

export interface ExtensionAnimationControllerInternal {
	readonly sessions: Map<string, ExtensionAnimationSessionInternalSurface>;
}
