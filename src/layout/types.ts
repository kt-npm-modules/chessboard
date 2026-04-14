import { ReadonlyDeep } from 'type-fest';
import { Color } from '../state/board/types/internal';
import { RenderGeometry } from './geometry/types';
import { LayoutMutationSession } from './mutation';

export interface LayoutInternal {
	boardSize: number | null;
	orientation: Color | null;
	geometry: RenderGeometry | null;
	layoutEpoch: number;
}

export type LayoutSnapshot = ReadonlyDeep<LayoutInternal>;

export interface LayoutRefreshOptions {
	container?: HTMLElement;
	orientation?: Color;
}

/**
 * Layout is a purely derived state computed from container size and view state (state.view.*).
 *
 * RenderGeometry is also purely derived.
 *
 * Both Layout and RenderGeometry may keep duplicated derived fields
 * (for example orientation or boardSize) as denormalized render-facing snapshots.
 * These duplicated fields are for convenience only and are not the source of truth.
 */
export interface Layout {
	readonly boardSize: number | null;
	readonly orientation: Color | null;
	readonly geometry: RenderGeometry | null;
	readonly layoutEpoch: number;

	refreshGeometry(options: LayoutRefreshOptions, mutationSession: LayoutMutationSession): boolean;
	getSnapshot(): LayoutSnapshot;
}
