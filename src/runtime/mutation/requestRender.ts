import { isFrameRenderable } from '../../extensions/helpers';
import { BoardRuntimeMutationPipe } from './pipeline';

export const requestRenderPipe: BoardRuntimeMutationPipe = (context, mutationSession) => {
	const { current } = context;
	const hasMutation = mutationSession.hasMutation({
		prefixes: ['state.', 'layout.']
	});
	if (!hasMutation) return;
	const currentFrame = current.extensions.currentFrame;
	if (!currentFrame) return;
	if (!isFrameRenderable(currentFrame)) return;
	current.render.requestRenderState(currentFrame);
};
