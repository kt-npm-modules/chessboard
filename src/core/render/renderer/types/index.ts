import { PartialDeep } from 'type-fest';
import type { AnimationSessionSnapshot } from '../../../animation/types';
import { ExtensionSlotName } from '../../../extensions/types';
import type { RenderGeometry } from '../../../layout/geometry/types';
import type { BoardStateSnapshot, Square } from '../../../state/board/types';
import type { InteractionStateSnapshot } from '../../../state/interaction/types';
import type { VisualsStateSnapshot } from '../../../state/visuals/types';
import type { InvalidationStateSnapshot } from '../../invalidation/types';

export interface RendererBoardConfig {
	light: string; // board light square color
	dark: string; // board dark square color
	coords?: {
		light: string; // coordinate text color on dark squares
		dark: string; // coordinate text color on light squares
	};
}

/**
 * Default renderer configuration.
 */
export const DEFAULT_RENDERER_BOARD_CONFIG: RendererBoardConfig = {
	light: '#d7dde5',
	dark: '#707a8a',
	coords: {
		light: '#707a8a',
		dark: '#eef2f7'
	}
};

export interface SvgRendererOptions {
	config?: PartialDeep<RendererBoardConfig>;
}

//
// Stable render-facing snapshot derived from runtime state.
// This is the semantic input baseline used by the render subsystem and renderer.
//
export interface RenderingStateSnapshot {
	readonly board: BoardStateSnapshot;
	readonly suppressedSquares: ReadonlySet<Square>;
}

export interface BoardRenderContext {
	readonly previous: RenderingStateSnapshot | null;
	readonly current: RenderingStateSnapshot;
	readonly invalidation: InvalidationStateSnapshot;
	readonly geometry: RenderGeometry;
}

export interface AnimationRenderContext {
	readonly session: AnimationSessionSnapshot | null;
	readonly board: BoardStateSnapshot;
	readonly geometry: RenderGeometry;
}

export interface DragRenderContext {
	readonly interaction: InteractionStateSnapshot;
	readonly visuals: VisualsStateSnapshot;
	readonly board: BoardStateSnapshot;
	readonly geometry: RenderGeometry;
}

export interface Renderer {
	mount(container: HTMLElement): void;
	unmount(): void;
	renderBoard(ctx: BoardRenderContext): void;
	renderAnimations(ctx: AnimationRenderContext): void;
	renderDrag(ctx: DragRenderContext): void;
	allocateExtensionSlots(
		extensionId: string,
		slotNames: readonly ExtensionSlotName[]
	): Partial<Record<ExtensionSlotName, SVGGElement>>;
	removeExtensionSlots(extensionId: string): void;
}
