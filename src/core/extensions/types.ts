export type ExtensionSlotName = 'underPieces' | 'overPieces' | 'dragUnder' | 'dragOver';

export type ExtensionSlotRoots<TSlots extends ExtensionSlotName> = Record<TSlots, SVGGElement>;
