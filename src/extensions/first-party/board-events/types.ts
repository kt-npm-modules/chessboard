import { MoveOutput } from '../../../state/board/types/output';
import { ExtensionSlotSvgRoots } from '../../types/basic/mount';
import { ExtensionDefinition, ExtensionInstance } from '../../types/extension';
import { ExtensionInternal } from '../common/types';

export const EXTENSION_SLOTS = [] as const;
export type ExtensionSlotsType = typeof EXTENSION_SLOTS;
export const EXTENSION_ID = 'events' as const;

export type BoardEventsDefinition = ExtensionDefinition<
	typeof EXTENSION_ID,
	typeof EXTENSION_SLOTS,
	BoardEventsPublic
>;

export type OnMoveCallback = (move: MoveOutput) => void;
export interface BoardEventsPublic {
	setOnUIMove(callback: OnMoveCallback | null): void;
}

export type BoardEventsInstance = ExtensionInstance<
	typeof EXTENSION_ID,
	typeof EXTENSION_SLOTS,
	BoardEventsPublic
>;

export type BoardEventsSlotRoots = ExtensionSlotSvgRoots<typeof EXTENSION_SLOTS>;

export interface BoardEventsInstanceInternal extends ExtensionInternal<ExtensionSlotsType> {
	onUIMove: OnMoveCallback | null;
}
