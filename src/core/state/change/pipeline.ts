import { createMutationSession } from './session';
import type { MutationPipe, MutationPipeline } from './types';

export function createMutationPipeline<Context, Cause extends string>(
	pipes: readonly MutationPipe<Context, Cause>[]
): MutationPipeline<Context, Cause> {
	const registeredPipes: MutationPipe<Context, Cause>[] = [...pipes] as const;
	const session = createMutationSession<Cause>();

	return {
		getSession() {
			return session;
		},

		addMutation(cause: Cause, changed: boolean): boolean {
			return session.addMutation(cause, changed);
		},

		run(ctx: Context): boolean {
			// no-op if no mutations recorded
			if (!session.hasChanges()) return false;
			try {
				for (const pipe of registeredPipes) {
					pipe(ctx, session);
				}
			} finally {
				// Clear session even if a pipe throws
				session.clear();
			}
			return true;
		}
	};
}
