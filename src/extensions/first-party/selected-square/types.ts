import { PartialDeep } from 'type-fest';
import { ExtensionSlotSvgRoots } from '../../types/basic/mount';
import { ExtensionDefinition, ExtensionInstance } from '../../types/extension';
import { OpaqueColor } from '../common/types';

export const EXTENSION_SLOTS = ['underPieces'] as const;
export const EXTENSION_ID = 'selected-square' as const;

export type SelectedSquareConfig = OpaqueColor;

export const DEFAULT_CONFIG: SelectedSquareConfig = {
	color: 'rgba(255, 255, 0)',
	opacity: 0.4
};

export type SelectedSquareInitConfig = PartialDeep<SelectedSquareConfig>;

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
	readonly config: SelectedSquareConfig;
}

export const enum DirtyLayer {
	Highlight = 1 // 1 << 0,
}
