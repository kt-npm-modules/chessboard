import { PartialDeep } from 'type-fest';
import { ExtensionSlotSvgRoots } from '../../types/basic/mount';
import { ExtensionDefinition, ExtensionInstance } from '../../types/extension';
import { OpaqueColor } from '../common/types';

export const EXTENSION_SLOTS = ['underPieces'] as const;
export const EXTENSION_ID = 'last-move' as const;

export type LastMoveConfig = OpaqueColor;

export const DEFAULT_CONFIG: LastMoveConfig = {
	color: 'rgba(255, 255, 0)',
	opacity: 0.4
};

export type LastMoveInitConfig = PartialDeep<LastMoveConfig>;

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
	readonly config: LastMoveConfig;
}

export const enum DirtyLayer {
	Highlight = 1 // 1 << 0,
}
