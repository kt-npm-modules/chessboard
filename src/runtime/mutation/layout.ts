import { LayoutMutationSession } from '../../layout/mutation';
import { BoardRuntimeMutationPipe } from './pipeline';

export const layoutRefreshGeometryPipe: BoardRuntimeMutationPipe = (context, mutationSession) => {
	const { current } = context;
	if (mutationSession.hasMutation({ causes: ['state.view.setOrientation'] })) {
		current.layout.refreshGeometry(
			{
				orientation: current.state.view.getOrientation()
			},
			mutationSession as LayoutMutationSession
		);
	}
};
