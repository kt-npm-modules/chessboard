import { PipelineSession } from './types';

export function createPipelineSession(): PipelineSession {
	let changes = false;

	return {
		addMutation(mutation: boolean): void {
			if (mutation) changes = true;
		},
		hasChanges(): boolean {
			return changes;
		},
		clear(): void {
			changes = false;
		}
	};
}
