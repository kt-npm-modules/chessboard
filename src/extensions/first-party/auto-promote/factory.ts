import { RoleCode } from '../../../state/board/types/internal.js';
import { extensionCreateInternalBase } from '../common/helpers.js';
import {
	AutoPromoteDefinition,
	AutoPromoteInstance,
	AutoPromoteInstanceInternal,
	AutoPromotePublic,
	EXTENSION_ID,
	EXTENSION_SLOTS,
	ExtensionSlotsType
} from './types.js';

export function createAutoPromote(): AutoPromoteDefinition {
	return {
		id: EXTENSION_ID,
		slots: EXTENSION_SLOTS,
		createInstance() {
			return createAutoPromoteInstance();
		}
	};
}

function createAutoPromoteInternal(): AutoPromoteInstanceInternal {
	return {
		...extensionCreateInternalBase<ExtensionSlotsType>(),
		toQueen: false
	};
}

function createAutoPromoteInstancePublic(state: AutoPromoteInstanceInternal): AutoPromotePublic {
	return {
		get toQueen() {
			return state.toQueen;
		},
		set toQueen(value: boolean) {
			state.toQueen = value;
		}
	};
}

function createAutoPromoteInstance(): AutoPromoteInstance {
	const internalState = createAutoPromoteInternal();
	const publicInterface = createAutoPromoteInstancePublic(internalState);
	return {
		id: EXTENSION_ID,
		onUIMoveRequest(context) {
			if (!internalState.toQueen) return;
			// Check if we can promote to queen
			const pendingRequest = context.request;
			const activeDestination = pendingRequest.destination;
			if (activeDestination.promotedTo?.includes(RoleCode.Queen)) {
				pendingRequest.resolve({
					from: pendingRequest.sourceSquare,
					to: activeDestination.to,
					promotedTo: RoleCode.Queen
				});
			}
		},
		getPublic() {
			return publicInterface;
		}
	};
}
