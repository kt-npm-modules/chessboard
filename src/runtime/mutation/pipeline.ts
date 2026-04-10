import { ExtensionSystem } from '../../extensions/types';
import { Layout, LayoutSnapshot } from '../../layout/types';
import { MutationPipe, MutationPipeline } from '../../mutation/types';
import { RenderSystem } from '../../render/types';
import { BoardRuntimeState, BoardRuntimeStateSnapshot } from '../../state/types';
import { TransientVisuals, TransientVisualsSnapshot } from '../../transientVisuals/types';
import { BoardRuntimeMutationPayloadByCause } from './types';

export interface BoardRuntimeMutationPipelineContext {
	readonly state: BoardRuntimeState;
	readonly layout: Layout;
	readonly transientVisuals: TransientVisuals;
	readonly renderSystem: RenderSystem;
	readonly extensionSystem: ExtensionSystem;
}

export type BoardRuntimeMutationPipeline = MutationPipeline<
	BoardRuntimeMutationPayloadByCause,
	BoardRuntimeMutationPipelineContext
>;

export interface BoardRuntimeMutationPipeContextPrevious {
	readonly state: BoardRuntimeStateSnapshot;
	readonly layout: LayoutSnapshot;
	readonly transientVisuals: TransientVisualsSnapshot;
}

export interface BoardRuntimeMutationPipeContext {
	previous: BoardRuntimeMutationPipeContextPrevious | null;
	current: BoardRuntimeMutationPipelineContext;
}

export type BoardRuntimeMutationPipe = MutationPipe<
	BoardRuntimeMutationPayloadByCause,
	BoardRuntimeMutationPipeContext
>;
