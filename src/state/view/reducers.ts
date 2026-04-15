import type { OrientationCode, ViewStateInternal } from './types/internal';

export function viewSetOrientation(
	state: ViewStateInternal,
	orientation: OrientationCode
): boolean {
	if (state.orientation === orientation) return false; // no-op
	state.orientation = orientation;
	return true;
}
