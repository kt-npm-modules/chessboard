import type { BoardState, BoardStateInitOptions, BoardStateSnapshot } from '../state/board/types';
import type { InteractionState, InteractionStateSnapshot } from '../state/interaction/types';
import type { ViewState, ViewStateInitOptions, ViewStateSnapshot } from '../state/view/types';
import type { ChangeState, ChangeStateSnapshot } from './change/types';

export interface BoardRuntimeStateInternal {
	// TODO: rename to BoardRuntime to Runtime
	readonly board: BoardState;
	readonly view: ViewState;
	readonly interaction: InteractionState;
	readonly change: ChangeState;
}

export interface BoardRuntimeStateSnapshot {
	readonly board: BoardStateSnapshot;
	readonly view: ViewStateSnapshot;
	readonly interaction: InteractionStateSnapshot;
	readonly change: ChangeStateSnapshot;
}

export interface BoardRuntimeStateInitOptions {
	board?: BoardStateInitOptions;
	view?: ViewStateInitOptions;
}

export interface BoardRuntimeState {
	readonly board: BoardState;
	readonly view: ViewState;
	readonly interaction: InteractionState;
	readonly change: ChangeState;
	getSnapshot(): BoardRuntimeStateSnapshot;
}
