import { ExtensionRuntimeSurface } from '../../../types/surface/main.js';
import type { PieceSymbolResolver } from '../piece-symbols.js';
import { rendererDragRenderTransientVisuals } from './render.js';
import { MainRendererDrag, MainRendererDragInternal } from './types.js';
import { rendererDragOnUpdate } from './update.js';

export function createMainRendererDrag(
	runtimeSurface: ExtensionRuntimeSurface,
	resolver: PieceSymbolResolver
): MainRendererDrag {
	const internalState: MainRendererDragInternal = {
		runtimeSurface,
		resolver,
		isDragActive: false,
		pieceCode: null,
		pieceNode: null
	};
	return {
		onUpdate(context) {
			rendererDragOnUpdate(internalState, context);
		},
		renderTransientVisuals(context, slot) {
			rendererDragRenderTransientVisuals(internalState, context, slot);
		},
		unmount() {
			internalState.pieceNode?.remove();
			internalState.pieceNode = null;
			internalState.pieceCode = null;
			internalState.isDragActive = false;
			internalState.runtimeSurface.transientVisuals.unsubscribe();
		}
	};
}
