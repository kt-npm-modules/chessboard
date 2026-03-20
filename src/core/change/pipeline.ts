import { createPipelineSession } from './session';
import type { Pipe, Pipeline } from './types';

export function createPipeline<Context>(pipes: readonly Pipe<Context>[]): Pipeline<Context> {
	const registeredPipes: Pipe<Context>[] = [...pipes];
	const session = createPipelineSession();

	return {
		addMutation(mutation: boolean): void {
			session.addMutation(mutation);
		},

		run(ctx: Context): boolean {
			// no-op if no mutations recorded
			if (!session.hasChanges()) return false;
			try {
				for (const pipe of registeredPipes) {
					pipe(ctx);
				}
			} finally {
				// Clear session even if a pipe throws
				session.clear();
			}
			return true;
		}
	};
}
