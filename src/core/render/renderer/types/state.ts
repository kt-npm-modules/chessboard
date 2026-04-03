import { ExtensionSlotName } from '../../../extensions/types';
import { Square } from '../../../state/board/types';

export interface SvgRendererBoardPieceNode {
	root: SVGImageElement;
}

export interface SvgRendererBoard {
	root: SVGGElement;
	coords: SVGGElement;
	pieces: SVGGElement;
	defsRoot: SVGGElement;
	pieceNodes: Map<Square, SvgRendererBoardPieceNode>;
}

export interface SvgRendererAnimation {
	root: SVGGElement;
	defsRoot: SVGGElement;
	activeSessionGroup: SVGGElement | null;
}

export interface SvgRendererDrag {
	root: SVGGElement;
	defsRoot: SVGGElement;
}

export interface SvgRendererMain {
	root: SVGSVGElement;
	defsRoot: SVGDefsElement;
	container: HTMLElement | null;
}

export type SvgRendererExtensionSlots = Record<ExtensionSlotName, SVGGElement | null>;

export interface SvgRendererInternals {
	main: SvgRendererMain;
	board: SvgRendererBoard;
	animation: SvgRendererAnimation;
	drag: SvgRendererDrag;
	extensions: Map<string, SvgRendererExtensionSlots>;
}
