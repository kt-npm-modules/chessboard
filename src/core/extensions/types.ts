import { BoardStateSnapshot } from '../state/boardTypes';
import { InteractionStateSnapshot } from '../state/interactionTypes';
import { ViewStateSnapshot } from '../state/viewTypes';

export type ExtensionSlotName = 'underPieces' | 'overPieces' | 'dragUnder' | 'dragOver';

export type ExtensionSlotRoots<TSlots extends ExtensionSlotName> = Record<TSlots, SVGGElement>;

export interface BoardExtensionMountEnv<TSlots extends ExtensionSlotName> {
	slotRoots: ExtensionSlotRoots<TSlots>;
}

export interface BoardExtensionUpdateContext {
	board: BoardStateSnapshot;
	view: ViewStateSnapshot;
	interaction: InteractionStateSnapshot;
}

export interface BoardExtensionMounted<TPublic> {
	/**
	 * Returns the stable public handle for this mounted extension instance.
	 * Repeated calls must return the same object reference.
	 */
	getPublic(): TPublic;
	update(ctx: BoardExtensionUpdateContext): void;
	unmount(): void;
}

export interface BoardExtensionDefinition<TPublic, TSlots extends ExtensionSlotName> {
	id: string;
	slots: readonly TSlots[];
	mount(env: BoardExtensionMountEnv<TSlots>): BoardExtensionMounted<TPublic>;
}
