import { LayoutMutationSession } from '../layout/mutation';
import { boardRuntimeValidateIsMounted } from './lifecycle';
import { boardRuntimeRunMutationPipeline } from './mutation';
import { BoardRuntimeInternal } from './types';

export function boardRuntimeRefreshGeometry(state: BoardRuntimeInternal): void {
	boardRuntimeValidateIsMounted(state);
	state.layout.refreshGeometry(
		{
			orientation: state.state.view.getOrientation(),
			container: state.renderSystem.container
		},
		state.mutation.getSession() as LayoutMutationSession
	);
	boardRuntimeRunMutationPipeline(state);
}
