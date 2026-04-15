import { cloneDeep } from 'es-toolkit/object';
import { normalizeColor, normalizeMoveRequest } from './normalize';
import { parsePositionInput } from './position';
import { boardMove, boardSetPosition, boardSetTurn } from './reducers';
import { BoardState, BoardStateInitOptions, BoardStateInternal } from './types/main';

function createBoardStateInternal(opts: BoardStateInitOptions): BoardStateInternal {
	return {
		pieces: parsePositionInput(opts.position || 'start'),
		turn: normalizeColor(opts.turn ?? 'white'),
		positionEpoch: 0
	};
}

export function createBoardState(options: BoardStateInitOptions): BoardState {
	const internalState = createBoardStateInternal(options);

	return {
		setPosition(input, mutationSession) {
			const pieces = parsePositionInput(input);
			return mutationSession.addMutation(
				'state.board.setPosition',
				boardSetPosition(internalState, pieces)
			);
		},
		setTurn(turn, mutationSession) {
			return mutationSession.addMutation('state.board.setTurn', boardSetTurn(internalState, turn));
		},
		move(request, mutationSession) {
			const moveRequest = normalizeMoveRequest(request);
			const result = boardMove(internalState, moveRequest);
			mutationSession.addMutation('state.board.move', true, result);
			return result;
		},
		getPieceCodeAt(square) {
			return internalState.pieces[square];
		},
		getSnapshot() {
			return cloneDeep(internalState);
		}
	};
}
