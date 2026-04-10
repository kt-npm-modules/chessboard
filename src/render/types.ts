import {
	ALL_EXTENSION_SLOTS,
	ExtensionAllocatedSlotsInternal,
	ExtensionSlotSvgRoots,
	ExtensionSystemExtensionRecord,
	RenderFrameSnapshot
} from '../extensions/types';
import { TransientVisualsSnapshot } from '../transientVisuals/types';
import { Scheduler } from './scheduler/types';

export interface SvgRoots extends ExtensionSlotSvgRoots<typeof ALL_EXTENSION_SLOTS> {
	readonly svgRoot: SVGSVGElement;
	readonly defs: SVGDefsElement;
}

export interface RenderExtensionRecordRender {
	readonly slots: ExtensionAllocatedSlotsInternal;
}

export interface RenderExtensionRecord {
	readonly id: string;
	readonly extension: ExtensionSystemExtensionRecord;
	readonly render: RenderExtensionRecordRender;
}

export interface RenderSystemInternal {
	container: HTMLElement | null;
	currentFrame: RenderFrameSnapshot | null;
	currentTransientVisuals: TransientVisualsSnapshot | null;
	readonly scheduler: Scheduler;
	readonly svgRoots: SvgRoots;
	// readonly animator: Animator;
	readonly extensions: Map<string, RenderExtensionRecord>;
}

export interface RenderSystemInitOptions {
	doc: Document;
	extensions: ReadonlyMap<string, ExtensionSystemExtensionRecord>;
}

export interface RenderSystemInitOptionsInternal extends RenderSystemInitOptions {
	performRender: () => void;
}

export interface RenderSystem {
	readonly extensions: ReadonlyMap<string, RenderExtensionRecord>;
	requestRender(request?: RenderFrameSnapshot): void;
	requestRenderAnimation(): void;
	requestRenderVisuals(request?: TransientVisualsSnapshot): void;

	// Lifecycle methods
	mount(element: HTMLElement): void;
	unmount(): void;
	readonly isMounted: boolean;
	readonly container: HTMLElement | null;
}
