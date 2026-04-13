import { setsEqual } from '../../../helpers/util';
import { positionsEqual } from '../../../state/board/helpers';
import { ExtensionUpdateContext, isUpdateContextRenderable } from '../../types/context/update';
import { DirtyLayer } from '../types/extension';
import { calculateSuppressedSquares } from './suppress';
import { MainRendererPiecesInternal } from './types';

export function rendererPiecesOnUpdate(
	state: MainRendererPiecesInternal,
	context: ExtensionUpdateContext
): void {
	if (
		!isUpdateContextRenderable(context) ||
		!context.mutation.hasMutation({
			prefixes: ['state.board.', 'state.interaction.'],
			causes: ['layout.refreshGeometry']
		})
	) {
		return;
	}

	const previousSuppressedSquares = state.suppressedSquares;
	state.suppressedSquares = calculateSuppressedSquares(state, context);
	const needsRender =
		context.mutation.hasMutation({ causes: ['layout.refreshGeometry'] }) ||
		!context.previousFrame ||
		!setsEqual(previousSuppressedSquares, state.suppressedSquares) ||
		!positionsEqual(context.currentFrame.state.board, context.previousFrame.state.board);

	if (!needsRender) return;
	context.invalidation.markDirty(DirtyLayer.Pieces);
}
