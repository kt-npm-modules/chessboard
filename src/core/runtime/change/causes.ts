import type { BoardStateMutationCause } from '../../state/board/change';
import type { InteractionStateMutationCause } from '../../state/interaction/change';
import type { ViewStateMutationCause } from '../../state/view/change';

export type BoardRuntimeMutationCause =
	| BoardStateMutationCause
	| ViewStateMutationCause
	| InteractionStateMutationCause;
