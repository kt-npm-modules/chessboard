import {
	AnyExtensionRenderVisualsContext,
	ExtensionRenderStateContextCommonBase
} from '../../extensions/types';
import { mergeReadonlySessions } from '../../mutation/session';
import { BoardRuntimeStateSnapshot } from '../../state/types';
import { RenderInternal, RenderVisualsRequest } from '../types';
import { validateIsMounted } from './helpers';

export function performRenderVisualsPass(
	state: RenderInternal,
	request: RenderVisualsRequest
): void {
	validateIsMounted(state);
	const contextCommonBase = state.lastRenderedState;
	if (!contextCommonBase) {
		throw new Error(
			'RenderVisuals called but no previous render state found. RenderState must be called before RenderVisuals.'
		);
	}
	const mutation = state.lastRenderedState?.mutation
		? mergeReadonlySessions('visuals.state.', state.lastRenderedState.mutation, request.mutation)
		: request.mutation;

	// Just update state.lastRendered.current.state.visuals and the rest is the same
	const newCurrentState: BoardRuntimeStateSnapshot = {
		...contextCommonBase.current.state,
		visuals: request.current
	};
	const newContextCommonBase: ExtensionRenderStateContextCommonBase = {
		...contextCommonBase,
		mutation,
		current: {
			...contextCommonBase.current,
			state: newCurrentState
		}
	};
	for (const extensionRec of state.extensions.values()) {
		const context: AnyExtensionRenderVisualsContext = {
			...newContextCommonBase,
			previousData: extensionRec.data.previous,
			currentData: extensionRec.data.current,
			invalidation: extensionRec.render.invalidation,
			animation: extensionRec.render.animation
		};
		extensionRec.instance.renderVisuals?.(context);
	}

	state.lastRenderedState = newContextCommonBase;
}
