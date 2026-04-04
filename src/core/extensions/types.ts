export type ExtensionSlotName =
	| 'board'
	| 'underPieces'
	| 'pieces'
	| 'overPieces'
	| 'dragUnder'
	| 'dragOver'
	| 'defs';

export type ExtensionSlotSvgRoots<TSlots extends ExtensionSlotName> = Record<TSlots, SVGGElement>;
