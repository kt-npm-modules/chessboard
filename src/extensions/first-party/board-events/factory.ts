import { denormalizeMove } from '../../../state/board/denormalize';
import { extensionCreateInternalBase, extensionDestroy, extensionUnmount } from '../common/helpers';
import {
	BoardEventsDefinition,
	BoardEventsInstance,
	BoardEventsInstanceInternal,
	BoardEventsPublic,
	EXTENSION_ID,
	EXTENSION_SLOTS,
	ExtensionSlotsType
} from './types';

export function createBoardEvents(): BoardEventsDefinition {
	return {
		id: EXTENSION_ID,
		slots: EXTENSION_SLOTS,
		createInstance() {
			return createBoardEventsInstance();
		}
	};
}

function createBoardEventsInternal(): BoardEventsInstanceInternal {
	return {
		...extensionCreateInternalBase<ExtensionSlotsType>(),
		onMove: null
	};
}

function extensionClean(state: BoardEventsInstanceInternal) {
	state.onMove = null;
}

function createBoardEventsInstancePublic(state: BoardEventsInstanceInternal): BoardEventsPublic {
	return {
		setOnMove(callback) {
			state.onMove = callback;
		}
	};
}

function createBoardEventsInstance(): BoardEventsInstance {
	const internalState = createBoardEventsInternal();
	const publicInterface = createBoardEventsInstancePublic(internalState);
	return {
		id: EXTENSION_ID,
		mount() {},
		onUpdate(context) {
			if (
				context.mutation.hasMutation({ causes: ['state.change.setLastMove'] }) &&
				context.currentFrame.state.change.lastMove
			) {
				internalState.onMove?.(denormalizeMove(context.currentFrame.state.change.lastMove));
			}
		},
		getPublic() {
			return publicInterface;
		},
		unmount() {
			extensionUnmount<ExtensionSlotsType>(internalState);
			extensionClean(internalState);
		},
		destroy() {
			extensionDestroy<ExtensionSlotsType>(internalState);
			extensionClean(internalState);
		}
	};
}
