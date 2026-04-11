export type ExtensionAnimationSessionStatus = 'submitted' | 'active' | 'ended' | 'cancelled';

export const ANIMATION_SESSION_STATUS_ALL = new Set<ExtensionAnimationSessionStatus>([
	'submitted',
	'active',
	'ended',
	'cancelled'
]);

export interface ExtensionAnimationSessionSubmitOptions {
	duration: number;
}

export interface ExtensionAnimationSession {
	readonly id: string;
	readonly startTime: DOMHighResTimeStamp;
	readonly duration: number;
	readonly status: ExtensionAnimationSessionStatus;
}

export interface ExtensionAnimationController {
	submit(options: ExtensionAnimationSessionSubmitOptions): ExtensionAnimationSession;
	cancel(sessionId: string): void;
	getAll(
		status?: ExtensionAnimationSessionStatus | Iterable<ExtensionAnimationSessionStatus>
	): readonly ExtensionAnimationSession[];
}

export interface ExtensionAnimationSessionInternalSurface extends ExtensionAnimationSession {
	setStatus(status: ExtensionAnimationSessionStatus): void;
}

export interface ExtensionAnimationControllerInternalSurface extends ExtensionAnimationController {
	getAll(
		status?: ExtensionAnimationSessionStatus | Iterable<ExtensionAnimationSessionStatus>
	): readonly ExtensionAnimationSessionInternalSurface[];
	remove(sessionId: string | Iterable<string>): void;
	clear(): void;
}
