import assert from '@ktarmyshov/assert';
import { decodePiece } from '../../../state/board/encode';
import { ExtensionUpdateContext } from '../../types/context/update';
import { getPieceShortKey, getPieceUrl } from '../helpers';
import { MainRendererDragInternal } from './types';

export function rendererDragOnUpdate(
	state: MainRendererDragInternal,
	context: ExtensionUpdateContext
): void {
	const isLiftedDragActive =
		context.currentFrame.state.interaction.dragSession?.type === 'lifted-piece-drag';

	if (isLiftedDragActive) {
		if (!state.isDragActive) {
			const pieceCode = context.currentFrame.state.interaction.dragSession.sourcePieceCode;
			const piece = decodePiece(pieceCode);
			assert(piece !== null, 'Invalid piece code in drag session');
			const key = getPieceShortKey(piece);
			state.pieceUrl = getPieceUrl(state.config, key);
			state.runtimeSurface.transientVisuals.subscribe();
		}
		state.isDragActive = true;
	} else {
		if (state.isDragActive) {
			state.runtimeSurface.transientVisuals.unsubscribe();
			state.pieceNode?.remove();
			state.pieceNode = null;
			state.pieceUrl = null;
		}
		state.isDragActive = false;
	}
}
