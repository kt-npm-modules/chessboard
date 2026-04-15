import type { ReadonlyDeep } from 'type-fest';
import type { ColorCode } from '../../board/types/internal';

export type OrientationCode = ColorCode; // For clarity in context where it applies

export interface ViewStateInternal {
	orientation: OrientationCode;
}

export type ViewStateSnapshot = ReadonlyDeep<ViewStateInternal>;
