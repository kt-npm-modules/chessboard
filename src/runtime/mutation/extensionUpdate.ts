import { BoardRuntimeMutationPipe } from './pipeline';

export const extensionSystemUpdatePipe: BoardRuntimeMutationPipe = (context, mutationSession) => {
	const { current } = context;
	const hasMutation = mutationSession.hasMutation({
		prefixes: ['state.', 'layout.']
	});
	if (hasMutation) {
		const stateSnapshot = current.state.getSnapshot();
		current.extensions.onUpdate({
			state: current.render.isMounted
				? {
						isMounted: true,
						state: stateSnapshot,
						layout: current.layout.getSnapshot()
					}
				: {
						isMounted: false,
						state: stateSnapshot
					},
			mutation: mutationSession
		});
	}
};
