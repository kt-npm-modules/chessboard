import { Square } from '../../../state/board/types';
import { ExtensionRenderContext, ExtensionUpdateContext } from '../../types';
import { PieceUrls } from '../types/config';

type PieceNodeRecord = {
	root: SVGImageElement; // per-piece <image> — locally bounded piece node
};

export interface MainRendererPiecesInternal {
	readonly config: PieceUrls;
	pieceNodes: Map<Square, PieceNodeRecord>;
}

export interface MainRendererPieces {
	onUpdate(context: ExtensionUpdateContext): void;
	render(context: ExtensionRenderContext, layer: SVGElement): void;
	unmount(): void;
}
