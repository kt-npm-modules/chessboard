import {
	ExtensionAnimationSessionInternalSurface,
	ExtensionAnimationSessionStatus
} from '../types/basic/animation';

export interface ExtensionAnimationSessionInternal {
	readonly id: string;
	readonly startTime: DOMHighResTimeStamp;
	readonly duration: number;
	status: ExtensionAnimationSessionStatus;
}

export interface ExtensionAnimationControllerInternal {
	readonly sessions: Map<string, ExtensionAnimationSessionInternalSurface>;
}
