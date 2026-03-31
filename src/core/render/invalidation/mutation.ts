import { MutationSession } from '../../state/mutation/types';

export interface InvalidationMutationExtensionPayload {
	extensionId: string;
}

export type InvalidationMutationPayloadByCause = {
	'invalidation.state.marked': undefined;
	'invalidation.state.cleared': undefined;
	'invalidation.extension.added': InvalidationMutationExtensionPayload;
};

export type InvalidationMutationCause = keyof InvalidationMutationPayloadByCause;

export type InvalidationMutationSession = MutationSession<InvalidationMutationPayloadByCause>;
