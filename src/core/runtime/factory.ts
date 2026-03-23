import { createBoardState } from '../state/board/factory';
import { createInteractionState } from '../state/interaction/factory';
import { createViewState } from '../state/view/factory';
import { createBoardRuntimeMutationPipeline } from './change/pipeline';
import { BoardRuntimeMutationPipeline } from './change/types';
import type { BoardRuntime, BoardRuntimeInitOptions, BoardRuntimeStateInternal } from './types';

function createBoardRuntimeStateInternal(opts: BoardRuntimeInitOptions): BoardRuntimeStateInternal {
	return {
		state: {
			board: createBoardState(opts.board),
			view: createViewState(opts.view),
			interaction: createInteractionState(),
			change: {
				lastMove: null
			}
		}
	};
}

/**
 * Create a minimal internal runtime that orchestrates state + scheduler + renderer.
 *
 * Lifecycle:
 * - Pre-mount: state mutations allowed, no rendering
 * - Mount: measure container, create geometry, mark initial dirty, schedule render, observe resize
 * - Post-mount: state mutations schedule renders; host resize refreshes geometry
 * - Destroy: disconnect resize observer, prevent further resize effects, reject remount
 *
 * @param opts Runtime options
 * @returns BoardRuntime instance
 */
export function createBoardRuntime(opts: BoardRuntimeInitOptions): BoardRuntime {
	const internalState = createBoardRuntimeStateInternal(opts);
	// Initial creation, so we mark board position as mutated to trigger mutation pipeline
	const mutationPipeline = createBoardRuntimeMutationPipeline();
	mutationPipeline.addMutation('board.state.setPosition', true);

	// We will have two different interfaces here
	// One is returned, one is for controller - with different methods
	// At the moment our assumption that controller will use BoardRuntime but not opposite direction
	// So we can construct these two objects separately so they would not be huge!
	const runtimeInternal = createBoardRuntimeInternal(internalState, mutationPipeline);

	// TODO: No construct controller surface to access runtime
	// const controllerSurface = createControllerSurface(internalState, runtimeInternal, mutationPipeline);

	// Initial run to process initial mutations and set up previousContext for the next runs
	mutationPipeline.run(internalState);
	return runtimeInternal;
}

function createBoardRuntimeInternal(
	internalState: BoardRuntimeStateInternal,
	mutationPipeline: BoardRuntimeMutationPipeline
): BoardRuntime {
	return {
		setPosition(input) {
			internalState.state.board.setPosition(input, mutationPipeline.getSession());
			return mutationPipeline.run(internalState);
		},
		setTurn(turn) {
			internalState.state.board.setTurn(turn, mutationPipeline.getSession());
			return mutationPipeline.run(internalState);
		},
		move(move) {
			const moveResult = internalState.state.board.move(move, mutationPipeline.getSession());
			mutationPipeline.run(internalState);
			return moveResult;
		},
		setOrientation(orientation) {
			internalState.state.view.setOrientation(orientation, mutationPipeline.getSession());
			return mutationPipeline.run(internalState);
		},
		setMovability(movability) {
			internalState.state.view.setMovability(movability, mutationPipeline.getSession());
			return mutationPipeline.run(internalState);
		}
	};
}
