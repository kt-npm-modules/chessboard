export type MutationPipe<Context, Cause extends string> = (
	ctx: Context,
	mutationSession: MutationSession<Cause>
) => void;

export interface MutationPipeline<Context, Cause extends string> {
	getSession(): MutationSession<Cause>;
	addMutation(cause: Cause, changed: boolean): boolean;
	run(ctx: Context): boolean;
}

export interface MutationSession<Cause extends string> {
	addMutation(cause: Cause, changed: boolean): boolean;
	hasChanges(): boolean;
	getCauses(): ReadonlySet<Cause>;
	clear(): void;
}
