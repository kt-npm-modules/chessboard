import { BoardRuntimeStateSnapshot } from '../state/types';
import { InvalidationState, InvalidationStateSnapshot } from './invalidation/types';
import { RenderingStateSnapshot } from './renderer/types';

export interface RenderInternal {
	lastRendered: RenderingStateSnapshot | null;
	readonly invalidation: InvalidationState;
}

export interface RenderSnapshot {
	readonly lastRendered: RenderingStateSnapshot | null;
	readonly invalidation: InvalidationStateSnapshot;
}

export interface Render {
	readonly invalidation: InvalidationState;
	readonly lastRendered: RenderingStateSnapshot | null;
	requestRender(runtimeState: BoardRuntimeStateSnapshot): void;
	getSnapshot(): RenderSnapshot;
}
