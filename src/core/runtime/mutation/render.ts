import { RenderLayoutSnapshot } from '../../extensions/types';
import { BoardRuntimeMutationPipe } from './pipeline';

export const renderPipe: BoardRuntimeMutationPipe = (context, mutationSession) => {
	const { current } = context;
	const needOp = mutationSession.hasMutation('state.') || mutationSession.hasMutation('layout.');
	if (needOp && current.render.isMounted && current.layout.getGeometry() !== null) {
		current.render.requestRenderState({
			current: {
				state: current.state.getSnapshot(),
				layout: current.layout.getSnapshot() as RenderLayoutSnapshot
			},
			mutation: mutationSession
		});
	}
};
