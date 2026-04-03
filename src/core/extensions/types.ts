export type ExtensionSlotName = 'underPieces' | 'overPieces' | 'dragUnder' | 'dragOver' | 'defs';

export type ExtensionSlotSvgRoots<TSlots extends ExtensionSlotName> = Record<TSlots, SVGGElement>;
