import {
	AnyExtensionOnUpdateStateContext,
	ExtensionOnUpdateStateContextCommonBase,
	ExtensionSystemInternal,
	ExtensionSystemUpdateRequest
} from './types';

export function extensionSystemUpdateState(
	state: ExtensionSystemInternal,
	request: ExtensionSystemUpdateRequest
): ExtensionOnUpdateStateContextCommonBase {
	// Prepare base context
	const contextCommonBase: ExtensionOnUpdateStateContextCommonBase = {
		previous: state.lastRenderedState?.current ?? null,
		mutation: request.mutation,
		current: request.state
	};
	// Update invalidation state based on the new request
	for (const extension of state.extensions.values()) {
		const context: AnyExtensionOnUpdateStateContext = {
			...contextCommonBase,
			previousData: extension.data.current,
			invalidation: extension.render.invalidation,
			animation: extension.render.animation
		};
		const newData = extension.instance.onStateUpdate(context);
		extension.data.previous = extension.data.current;
		extension.data.current = newData;
	}
	state.lastRenderedState = contextCommonBase;
	return contextCommonBase;
}
