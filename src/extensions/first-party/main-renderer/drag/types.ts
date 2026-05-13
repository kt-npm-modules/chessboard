import { NonEmptyPieceCode } from '../../../../state/board/types/internal.js';
import { ExtensionRenderTransientVisualsContext } from '../../../types/context/transient-visuals.js';
import { ExtensionUpdateContext } from '../../../types/context/update.js';
import { ExtensionRuntimeSurface } from '../../../types/surface/main.js';
import type { PieceSymbolResolver } from '../piece-symbols.js';

export interface MainRendererDragInternal {
	readonly runtimeSurface: ExtensionRuntimeSurface;
	readonly resolver: PieceSymbolResolver;
	isDragActive: boolean;
	pieceCode: NonEmptyPieceCode | null;
	pieceNode: SVGUseElement | null;
}

export interface MainRendererDrag {
	onUpdate(context: ExtensionUpdateContext): void;
	renderTransientVisuals(context: ExtensionRenderTransientVisualsContext, slot: SVGGElement): void;
	unmount(): void;
}
