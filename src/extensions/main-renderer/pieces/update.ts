import { isUpdateContextRenderable } from '../../helpers';
import { ExtensionUpdateContext } from '../../types';
import { DirtyLayer } from '../types/extension';
import { MainRendererPiecesInternal } from './types';

export function rendererPiecesOnUpdate(
	_state: MainRendererPiecesInternal,
	context: ExtensionUpdateContext
): void {
	if (
		!isUpdateContextRenderable(context) ||
		!context.mutation.hasMutation({
			prefixes: ['state.board.'],
			causes: ['layout.refreshGeometry']
		})
	) {
		return;
	}

	context.invalidation.markDirty(DirtyLayer.Pieces);
}
