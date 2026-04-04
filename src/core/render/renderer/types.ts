import { ExtensionSlotName, ExtensionSlotSvgRoots } from '../../extensions/types';
import { InvalidationStateSnapshot } from '../invalidation/types';
import { AnimationRenderContext, SvgRendererAnimation } from './animation/types';
import {
	RendererBoardFrameSnapshot,
	SvgRendererBoard,
	SvgRendererBoardInitOptions
} from './board/types';
import { DragRenderContext, SvgRendererDrag } from './drag/types';

export interface SvgRendererInitOptions {
	board?: SvgRendererBoardInitOptions;
}

export type ExtensionAllocatedSlots = Partial<Record<ExtensionSlotName, SVGGElement>>;

export interface SvgRendererInternalsExtensions extends ExtensionSlotSvgRoots<ExtensionSlotName> {
	readonly allocatedSlots: Map<string, Readonly<ExtensionAllocatedSlots>>;
}

export interface SvgRendererInternals {
	container: HTMLElement | null;
	readonly svgRoot: SVGSVGElement;
	readonly defsRoot: SVGDefsElement;
	readonly board: SvgRendererBoard;
	readonly drag: SvgRendererDrag;
	readonly animation: SvgRendererAnimation;
	readonly extensions: SvgRendererInternalsExtensions;
	lastBoardFrame: RendererBoardFrameSnapshot | null;
}

export interface BoardRenderContext extends RendererBoardFrameSnapshot {
	readonly invalidation: InvalidationStateSnapshot;
}

export interface SvgRenderer {
	readonly container: HTMLElement | null;
	mount(container: HTMLElement): void;
	unmount(): void;
	renderBoard(context: BoardRenderContext): void;
	renderDrag(context: DragRenderContext): void;
	renderAnimations(context: AnimationRenderContext): void;
	allocateExtensionSlots(
		extensionId: string,
		slotNames: readonly ExtensionSlotName[]
	): ExtensionAllocatedSlots;
	removeExtensionSlots(extensionId: string): void;
}
