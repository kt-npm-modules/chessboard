import { ExtensionSlotSvgRoots } from '../../types/basic/mount';
import { ExtensionDefinition, ExtensionInstance } from '../../types/extension';

export const EXTENSION_SLOTS = ['underPieces'] as const;
export const EXTENSION_ID = 'selected-square' as const;

export type SelectedSquareDefinition = ExtensionDefinition<
	typeof EXTENSION_ID,
	typeof EXTENSION_SLOTS,
	never
>;

export type SelectedSquareInstance = ExtensionInstance<
	typeof EXTENSION_ID,
	typeof EXTENSION_SLOTS,
	never
>;

export type SelectedSquareSlotRoots = ExtensionSlotSvgRoots<typeof EXTENSION_SLOTS>;

export interface SelectedSquareInstanceInternal {
	slotRoots: SelectedSquareSlotRoots | null;
	svgRect: SVGRectElement | null;
	readonly config: { color: string; opacity: number };
}

export const enum DirtyLayer {
	Highlight = 1 // 1 << 0,
}
