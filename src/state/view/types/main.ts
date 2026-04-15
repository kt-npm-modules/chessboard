import { ViewStateMutationSession } from '../mutation';
import { OrientationInput } from './input';
import { OrientationCode, ViewStateSnapshot } from './internal';

export interface ViewStateInitOptions {
	orientation?: OrientationInput;
}

export interface ViewState {
	readonly orientation: OrientationCode;
	setOrientation(orientation: OrientationInput, mutationSession: ViewStateMutationSession): boolean;
	getSnapshot(): ViewStateSnapshot;
}
