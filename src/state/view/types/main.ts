import { ColorCode } from '../../board/types/internal';
import { ViewStateMutationSession } from '../mutation';
import { OrientationInput } from './input';
import { ViewStateSnapshot } from './internal';

export interface ViewStateInitOptions {
	orientation?: OrientationInput;
}

export interface ViewState {
	readonly orientation: ColorCode;
	setOrientation(orientation: OrientationInput, mutationSession: ViewStateMutationSession): boolean;
	getSnapshot(): ViewStateSnapshot;
}
