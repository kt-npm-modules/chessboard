import { LayoutSnapshot } from '../layout/types';
import { BoardRuntimeStateSnapshot } from '../state/types';
import { InvalidationState } from './invalidation/types';
import { SvgRenderer, SvgRendererInitOptions } from './renderer/types';
import { Scheduler } from './scheduler/types';

export interface RenderInternal {
	readonly invalidation: InvalidationState;
	readonly svgRenderer: SvgRenderer;
	readonly scheduler: Scheduler;
}

export interface RenderInitOptions {
	svgRenderer: SvgRendererInitOptions;
}

export interface RenderRequest {
	state: BoardRuntimeStateSnapshot;
	layout: LayoutSnapshot;
}

export interface Render {
	readonly invalidation: InvalidationState;
	requestRender(request: RenderRequest): void;
}
