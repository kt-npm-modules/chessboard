import { ExtensionSlotSvgRoots } from '../../types/basic/mount.js';
import { ExtensionDefinition, ExtensionInstance } from '../../types/extension.js';
import { ExtensionInternal } from '../common/types.js';

export const EXTENSION_SLOTS = [] as const;
export type ExtensionSlotsType = typeof EXTENSION_SLOTS;
export const EXTENSION_ID = 'autoPromote' as const;

export type AutoPromoteDefinition = ExtensionDefinition<
	typeof EXTENSION_ID,
	typeof EXTENSION_SLOTS,
	AutoPromotePublic
>;

export interface AutoPromotePublic {
	toQueen: boolean;
}

export type AutoPromoteInstance = ExtensionInstance<
	typeof EXTENSION_ID,
	typeof EXTENSION_SLOTS,
	AutoPromotePublic
>;

export type AutoPromoteSlotRoots = ExtensionSlotSvgRoots<typeof EXTENSION_SLOTS>;

export interface AutoPromoteInstanceInternal extends ExtensionInternal<ExtensionSlotsType> {
	toQueen: boolean;
}
