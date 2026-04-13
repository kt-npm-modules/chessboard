import { Square } from '../../../state/board/types';
import { ExtensionUpdateContext } from '../../types/context/update';
import { MainRendererPiecesInternal } from './types';

const EMPTY_SET: ReadonlySet<Square> = new Set();

export function calculateSuppressedSquares(
	_state: MainRendererPiecesInternal,
	context: ExtensionUpdateContext
): ReadonlySet<Square> {
	const dragSession = context.currentFrame.state.interaction.dragSession;
	if (dragSession?.type === 'lifted-piece-drag') {
		return new Set([dragSession.sourceSquare]);
	}
	return EMPTY_SET;
}
