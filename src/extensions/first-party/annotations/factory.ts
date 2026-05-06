import { cloneDeep } from 'es-toolkit';
import { normalizeSquare } from '../../../state/board/normalize.js';
import type { ExtensionCreateInstanceOptions } from '../../build/index.js';
import {
	extensionCreateInternalBase,
	extensionDestroyBase,
	extensionMountBase,
	extensionUnmountBase
} from '../common/helpers.js';
import { denormalizeArrows, denormalizeCircles } from './denormalize.js';
import {
	arrowAnnotationKey,
	normalizeAnnotationsConfig,
	normalizeArrowAnnotation,
	normalizeCircleAnnotation,
	normalizeInitialAnnotations
} from './normalize.js';
import { DirtyLayer, type AnnotationsConfig } from './types/internal.js';
import type {
	AnnotationsDefinition,
	AnnotationsInstance,
	AnnotationsStateInternal,
	AnnotationsStateInternalAnnotations,
	ExtensionSlotsType
} from './types/main.js';
import { EXTENSION_ID, EXTENSION_SLOTS } from './types/main.js';
import type { AnnotationsInitOptions, AnnotationsPublicAPI } from './types/public.js';

export function createAnnotations(options?: AnnotationsInitOptions): AnnotationsDefinition {
	const normalizedConfig = normalizeAnnotationsConfig(options?.config);
	const normalizedAnnotations = normalizeInitialAnnotations(options?.annotations);

	return {
		id: EXTENSION_ID,
		slots: EXTENSION_SLOTS,
		createInstance(runtimeOptions) {
			return createAnnotationsInstance(normalizedConfig, normalizedAnnotations, runtimeOptions);
		}
	};
}

function createAnnotationsInternal(
	normalizedConfig: AnnotationsConfig,
	normalizedAnnotations: AnnotationsStateInternalAnnotations,
	runtimeOptions: ExtensionCreateInstanceOptions
): AnnotationsStateInternal {
	// Clone to ensure each instance has independent mutable state
	const config = cloneDeep(normalizedConfig);
	const annotations: AnnotationsStateInternalAnnotations = {
		circles: new Map(normalizedAnnotations.circles),
		arrows: new Map(normalizedAnnotations.arrows)
	};

	return {
		...extensionCreateInternalBase<ExtensionSlotsType>(),
		runtimeSurface: runtimeOptions.runtimeSurface,
		svg: {
			svgCircles: new Map(),
			svgArrows: new Map()
		},
		annotations,
		config
	};
}

function extensionCleanSvg(state: AnnotationsStateInternal): void {
	state.svg.svgCircles.clear();
	state.svg.svgArrows.clear();
}

function createAnnotationsPublicAPI(state: AnnotationsStateInternal): AnnotationsPublicAPI {
	return {
		getCircles() {
			return denormalizeCircles(state.annotations.circles);
		},
		getArrows() {
			return denormalizeArrows(state.annotations.arrows);
		},
		setCircles(circles) {
			state.annotations.circles.clear();
			for (const pub of circles) {
				const circle = normalizeCircleAnnotation(pub);
				state.annotations.circles.set(circle.key, circle);
			}
			state.runtimeSurface.invalidation.markDirty(DirtyLayer.COMMITTED);
			state.runtimeSurface.commands.requestRender({ state: true });
		},
		setArrows(arrows) {
			state.annotations.arrows.clear();
			for (const pub of arrows) {
				const arrow = normalizeArrowAnnotation(pub);
				state.annotations.arrows.set(arrow.key, arrow);
			}
			state.runtimeSurface.invalidation.markDirty(DirtyLayer.COMMITTED);
			state.runtimeSurface.commands.requestRender({ state: true });
		},
		circle(square, annotation) {
			const key = normalizeSquare(square);
			if (annotation === null) {
				state.annotations.circles.delete(key);
			} else {
				const normalizedAnnotation = normalizeCircleAnnotation({
					square,
					color: annotation.color
				});
				state.annotations.circles.set(key, normalizedAnnotation);
			}
			state.runtimeSurface.invalidation.markDirty(DirtyLayer.COMMITTED);
			state.runtimeSurface.commands.requestRender({ state: true });
		},
		arrow(from, to, annotation) {
			const key = arrowAnnotationKey(from, to);
			if (annotation === null) {
				state.annotations.arrows.delete(key);
			} else {
				const normalizedArrow = normalizeArrowAnnotation({
					from,
					to,
					color: annotation.color
				});
				state.annotations.arrows.set(key, normalizedArrow);
			}
			state.runtimeSurface.invalidation.markDirty(DirtyLayer.COMMITTED);
			state.runtimeSurface.commands.requestRender({ state: true });
		},
		clear() {
			state.annotations.circles.clear();
			state.annotations.arrows.clear();
			state.runtimeSurface.invalidation.markDirty(DirtyLayer.COMMITTED);
			state.runtimeSurface.commands.requestRender({ state: true });
		},
		setClearOnCoreInteraction(value) {
			state.config.clearOnCoreInteraction = value;
		},
		getClearOnCoreInteraction() {
			return state.config.clearOnCoreInteraction;
		}
	};
}

function createAnnotationsInstance(
	normalizedConfig: AnnotationsConfig,
	normalizedAnnotations: AnnotationsStateInternalAnnotations,
	runtimeOptions: ExtensionCreateInstanceOptions
): AnnotationsInstance {
	const internalState = createAnnotationsInternal(
		normalizedConfig,
		normalizedAnnotations,
		runtimeOptions
	);
	const publicAPI = createAnnotationsPublicAPI(internalState);

	return {
		id: EXTENSION_ID,
		mount(env) {
			extensionMountBase<ExtensionSlotsType>(internalState, env.slotRoots);
		},
		unmount() {
			extensionUnmountBase<ExtensionSlotsType>(internalState);
			extensionCleanSvg(internalState);
		},
		destroy() {
			extensionDestroyBase<ExtensionSlotsType>(internalState);
			extensionCleanSvg(internalState);
		},
		getPublic() {
			return publicAPI;
		}
	};
}
