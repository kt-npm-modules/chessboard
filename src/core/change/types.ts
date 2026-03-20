export type Pipe<Context> = (ctx: Context) => void;

export interface Pipeline<Context> {
	addMutation(mutation: boolean): void;
	run(ctx: Context): boolean;
}

export interface PipelineSession {
	addMutation(mutation: boolean): void;
	hasChanges(): boolean;
	clear(): void;
}
