import {
	ANIMATION_SESSION_STATUS_ALL,
	ExtensionAnimationControllerInternalSurface,
	ExtensionAnimationSessionInternalSurface,
	ExtensionAnimationSessionStatus,
	ExtensionAnimationSessionSubmitOptions
} from '../types/basic/animation';
import { ExtensionAnimationControllerInternal, ExtensionAnimationSessionInternal } from './types';

function createExtensionAnimationSessionInternal(
	id: number,
	options: ExtensionAnimationSessionSubmitOptions
): ExtensionAnimationSessionInternal {
	return {
		id,
		startTime: performance.now(),
		duration: options.duration,
		status: 'submitted'
	};
}

export function createExtensionAnimationSession(
	id: number,
	options: ExtensionAnimationSessionSubmitOptions
): ExtensionAnimationSessionInternalSurface {
	const internalState = createExtensionAnimationSessionInternal(id, options);

	return {
		id: internalState.id,
		startTime: internalState.startTime,
		duration: internalState.duration,
		get status() {
			return internalState.status;
		},
		setStatus(newStatus: ExtensionAnimationSessionStatus) {
			internalState.status = newStatus;
		}
	};
}

function createExtensionAnimationControllerInternal(): ExtensionAnimationControllerInternal {
	return {
		sessions: new Map()
	};
}

let gSessionId = 0;

export function createExtensionAnimationController(): ExtensionAnimationControllerInternalSurface {
	const internalState = createExtensionAnimationControllerInternal();
	return {
		submit(options) {
			gSessionId++;
			const session = createExtensionAnimationSession(gSessionId, options);
			internalState.sessions.set(gSessionId, session);
			// Logic to start the animation can be added here
			return session;
		},
		cancel(sessionId) {
			const session = internalState.sessions.get(sessionId);
			if (session) {
				session.setStatus('cancelled');
			}
		},
		getAll(status) {
			const stati: Set<ExtensionAnimationSessionStatus> = status
				? // If iterable
					Symbol.iterator in Object(status)
					? (new Set([...status]) as Set<ExtensionAnimationSessionStatus>)
					: (new Set([status]) as Set<ExtensionAnimationSessionStatus>)
				: ANIMATION_SESSION_STATUS_ALL;
			return Array.from(internalState.sessions.values()).filter((session) =>
				stati.has(session.status)
			);
		},
		remove(sessionId) {
			if (typeof sessionId === 'number') {
				internalState.sessions.delete(sessionId);
			} else {
				for (const id of sessionId) {
					internalState.sessions.delete(id);
				}
			}
		},
		clear() {
			internalState.sessions.clear();
		}
	};
}
