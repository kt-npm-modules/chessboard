import { calculateAnimationPlan } from '../../../../animation/planner.js';
import { piecePositionsEqual } from '../../../../state/board/check.js';
import { changeStatesEqual } from '../../../../state/change/helpers.js';
import {
	ExtensionUpdateContext,
	isUpdateContextRenderable
} from '../../../types/context/update.js';
import type { MainRendererAnimationInternal } from './types.js';

const DEFAULT_ANIMATION_DURATION_MS = 180;

export function rendererAnimationOnUpdate(
	state: MainRendererAnimationInternal,
	context: ExtensionUpdateContext
): void {
	if (
		!isUpdateContextRenderable(context) ||
		!context.mutation.hasMutation({ prefixes: ['state.board.', 'state.change.'] }) ||
		!context.previousFrame
	) {
		return;
	}

	if (
		piecePositionsEqual(context.previousFrame.state.board, context.currentFrame.state.board) &&
		changeStatesEqual(context.previousFrame.state.change, context.currentFrame.state.change)
	)
		return;

	// Pass raw snapshots to the planner — it normalizes internally
	const plan = calculateAnimationPlan({
		previous: context.previousFrame.state,
		current: context.currentFrame.state
	});
	if (plan.tracks.length === 0) return;
	const session = state.runtimeSurface.animation.submit({
		duration: DEFAULT_ANIMATION_DURATION_MS
	});
	state.entries.set(session.id, { plan, nodes: null });
}
