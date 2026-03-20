import { DirtyLayer, InvalidationWriter } from '../scheduler/types';
import type { ColorInput, Square } from './boardTypes';
import { normalizeColor } from './normalize';
import { Movability, MovabilityDestinationsRecord, ViewStateInternal } from './viewTypes';

/**
 * Set board orientation (view).
 * Takes an InvalidationWriter and marks DirtyLayer.All on change,
 * so the runtime can schedule a full re-render.
 */
export function setOrientation(
	state: ViewStateInternal,
	invalidation: InvalidationWriter,
	c: ColorInput
): boolean {
	const newOrient = normalizeColor(c);
	if (state.orientation === newOrient) return false; // no-op
	state.orientation = newOrient;
	invalidation.markLayer(DirtyLayer.All);
	return true;
}

/**
 * Set movability (externally-provided interaction policy).
 * No-op if movability is structurally equal to current value.
 * Does not take an InvalidationWriter and does not directly mark invalidation.
 */
export function setMovability(state: ViewStateInternal, m: Movability): boolean {
	if (movabilityEquals(state.movability, m)) return false; // no-op
	state.movability = m;
	return true;
}

/**
 * Local helper for structural movability equality.
 */
function movabilityEquals(a: Movability, b: Movability): boolean {
	if (a === b) return true;
	if (a.mode !== b.mode) return false;

	if (a.mode === 'disabled' && b.mode === 'disabled') return true; // both disabled

	if (a.mode === 'free' && b.mode === 'free') return true; // both free

	// Both strict - compare destinations
	if (a.mode === 'strict' && b.mode === 'strict') {
		const aDests = a.destinations;
		const bDests = b.destinations;

		const aIsResolver = typeof aDests === 'function';
		const bIsResolver = typeof bDests === 'function';

		// resolver vs resolver: compare by reference
		if (aIsResolver && bIsResolver) {
			return aDests === bDests;
		}

		// record vs resolver: not equal
		if (aIsResolver !== bIsResolver) {
			return false;
		}

		// Both are records (narrowed): structural comparison
		// TypeScript now knows both are MovabilityDestinationsRecord
		const aRecord = aDests as MovabilityDestinationsRecord;
		const bRecord = bDests as MovabilityDestinationsRecord;

		const aKeys = Object.keys(aRecord).map(Number) as Square[];
		const bKeys = Object.keys(bRecord).map(Number) as Square[];

		if (aKeys.length !== bKeys.length) return false;

		// Check if all keys in a exist in b with same values
		for (const sq of aKeys) {
			const aArr = aRecord[sq];
			const bArr = bRecord[sq];
			if (!aArr || !bArr) return false;
			if (aArr.length !== bArr.length) return false;
			for (let i = 0; i < aArr.length; i++) {
				if (aArr[i] !== bArr[i]) return false;
			}
		}

		return true;
	}

	return false;
}
