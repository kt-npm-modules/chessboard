import { vi } from 'vitest';
import type { MainRendererAnimationInternal } from '../../../../../src/extensions/first-party/main-renderer/animation/types.js';
import type { PieceUrls } from '../../../../../src/extensions/first-party/main-renderer/types/internal.js';
import type { ExtensionRuntimeSurface } from '../../../../../src/extensions/types/surface/main.js';
import { createRenderGeometry } from '../../../../../src/layout/geometry/factory.js';
import { ColorCode, SQUARE_COUNT } from '../../../../../src/state/board/types/internal.js';
import type { RuntimeStateSnapshot } from '../../../../../src/state/types.js';

// ─── Mock runtime surface ─────────────────────────────────────────────────────

/**
 * Creates a minimal mock ExtensionRuntimeSurface for animation update tests.
 * Only runtimeSurface.animation.submit is used by rendererAnimationOnUpdate.
 */
export function createMockAnimationRuntimeSurface() {
	let nextSessionId = 1;
	const submit = vi.fn((opts: { duration: number }) => ({
		id: nextSessionId++,
		startTime: 0,
		duration: opts.duration,
		status: 'submitted' as const
	}));

	const surface = {
		animation: { submit }
	} as unknown as ExtensionRuntimeSurface;

	return { surface, submit };
}

// ─── Internal state ───────────────────────────────────────────────────────────

/**
 * Creates a minimal MainRendererAnimationInternal for direct update tests.
 */
export function createAnimationInternalState(
	surface?: ExtensionRuntimeSurface,
	config?: PieceUrls
): MainRendererAnimationInternal {
	const { surface: defaultSurface } = createMockAnimationRuntimeSurface();
	return {
		config: config ?? ({} as PieceUrls),
		runtimeSurface: surface ?? defaultSurface,
		entries: new Map()
	};
}

// ─── Update context ───────────────────────────────────────────────────────────

export interface AnimationUpdateContextOptions {
	causes?: string[];
	isMounted?: boolean;
	hasGeometry?: boolean;
	currentState?: Partial<{
		board: object;
		change: object;
		interaction: object;
		view: object;
	}>;
	previousState?: Partial<{
		board: object;
		change: object;
		interaction: object;
		view: object;
	}> | null;
	sceneSize?: number;
	orientation?: ColorCode;
}

function buildStateSnapshot(
	partial?: Partial<{ board: object; change: object; interaction: object; view: object }>
): RuntimeStateSnapshot {
	const defaults = {
		board: { pieces: new Uint8Array(SQUARE_COUNT), turn: ColorCode.White, positionEpoch: 0 },
		view: {},
		interaction: {
			selected: null,
			movability: { mode: 0 },
			activeDestinations: new Map(),
			dragSession: null
		},
		change: { lastMove: null, deferredUIMoveRequest: null }
	};
	return { ...defaults, ...(partial ?? {}) } as unknown as RuntimeStateSnapshot;
}

/**
 * Builds a minimal ExtensionUpdateContext for animation update tests.
 */
export function createAnimationUpdateContext(opts: AnimationUpdateContextOptions = {}) {
	const size = opts.sceneSize ?? 400;
	const orientation = opts.orientation ?? ColorCode.White;
	const isMounted = opts.isMounted ?? true;
	const hasGeometry = opts.hasGeometry ?? true;
	const causes = opts.causes ?? [];

	const geometry = hasGeometry
		? createRenderGeometry({ width: size, height: size }, orientation)
		: null;

	const currentState = buildStateSnapshot(opts.currentState);

	const currentFrame = isMounted
		? {
				isMounted: true as const,
				state: currentState,
				layout: {
					sceneSize: { width: size, height: size },
					orientation,
					geometry,
					layoutEpoch: 1
				}
			}
		: { isMounted: false as const, state: currentState };

	let previousFrame: object | null = null;
	if (opts.previousState !== null && opts.previousState !== undefined) {
		const prevState = buildStateSnapshot(opts.previousState);
		previousFrame = {
			isMounted: true,
			state: prevState,
			layout: {
				sceneSize: { width: size, height: size },
				orientation,
				geometry,
				layoutEpoch: 1
			}
		};
	}

	const hasMutation = (match?: { causes?: Iterable<string>; prefixes?: Iterable<string> }) => {
		if (!match) return causes.length > 0;
		if (match.causes) {
			for (const c of match.causes) {
				if (causes.includes(c)) return true;
			}
		}
		if (match.prefixes) {
			for (const p of match.prefixes) {
				for (const c of causes) {
					if (c.startsWith(p)) return true;
				}
			}
		}
		return false;
	};

	const context = {
		previousFrame,
		mutation: {
			hasMutation,
			getPayloads: vi.fn(() => undefined),
			getAll: vi.fn(() => new Map())
		},
		currentFrame,
		invalidation: { dirtyLayers: 0, markDirty: vi.fn(), clearDirty: vi.fn(), clear: vi.fn() }
	} as never;

	return context;
}
