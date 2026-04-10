import {
	AnyExtensionDefinition,
	BoardRuntimeExtensionSurface,
	BoardRuntimeExtensionSurfaceSnapshot,
	ExtensionCreateInstanceOptions
} from '../extensions/types';
import { BoardRuntimeStateInitOptions } from '../state/types';
import {
	BoardRuntimeMutationPipeline,
	BoardRuntimeMutationPipelineContext
} from './mutation/pipeline';

export type BoardRuntimeStatus = 'constructing' | 'unmounted' | 'mounted' | 'destroyed';

export interface BoardRuntimeInternal extends BoardRuntimeMutationPipelineContext {
	readonly mutation: BoardRuntimeMutationPipeline;
	resizeObserver: ResizeObserver | null;
}

export interface BoardRuntimeInitOptions {
	doc: Document;
	state?: BoardRuntimeStateInitOptions;
	extensions?: readonly AnyExtensionDefinition[];
}

export interface BoardRuntimeInitOptionsInternal extends BoardRuntimeInitOptions {
	extensionCreateInstanceOptions: ExtensionCreateInstanceOptions;
}

/**
 * Public interface for the internal runtime.
 * Orchestrates board state, view state, interaction state, and invalidation.
 * Board/view/interaction reducers own mutation logic; the runtime coordinates scheduling
 * and geometry updates in response to state changes.
 */
export interface BoardRuntime extends BoardRuntimeExtensionSurface {
	// Lifecycle
	readonly status: BoardRuntimeStatus;
	mount(container: HTMLElement): void;
	unmount(): void; // just unmount, can be remounted
	destroy(): void; // unmount + cleanup internal state, observers, etc. cannot be reused anymore
	getSnapshot(): BoardRuntimeExtensionSurfaceSnapshot;
}
