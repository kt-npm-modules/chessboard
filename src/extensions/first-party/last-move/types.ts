import { ExtensionSlotSvgRoots } from '../../types/basic/mount';
import { ExtensionDefinition, ExtensionInstance } from '../../types/extension';

export const EXTENSION_SLOTS = ['underPieces'] as const;
export const EXTENSION_ID = 'last-move' as const;

export type LastMoveDefinition = ExtensionDefinition<
	typeof EXTENSION_ID,
	typeof EXTENSION_SLOTS,
	never
>;

export type LastMoveInstance = ExtensionInstance<
	typeof EXTENSION_ID,
	typeof EXTENSION_SLOTS,
	never
>;

export type LastMoveSlotRoots = ExtensionSlotSvgRoots<typeof EXTENSION_SLOTS>;

export interface LastMoveInstanceInternal {
	slotRoots: LastMoveSlotRoots | null;
	svgRectFrom: SVGRectElement | null;
	svgRectTo: SVGRectElement | null;
	readonly config: { color: string; opacity: number };
}

export const enum DirtyLayer {
	Highlight = 1 // 1 << 0,
}
