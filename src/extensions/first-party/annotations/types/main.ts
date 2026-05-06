import type {
	ExtensionDefinition,
	ExtensionInstance,
	ExtensionInternalBase,
	ExtensionRuntimeSurface,
	ExtensionSlotName
} from '../../../build/index.js';
import type {
	AnnotationsConfig,
	ArrowAnnotation,
	ArrowAnnotationKey,
	CircleAnnotation,
	CircleAnnotationKey
} from './internal.js';
import type { AnnotationsPublicAPI } from './public.js';

export const EXTENSION_SLOTS = [
	'overPieces',
	'drag'
] as const satisfies readonly ExtensionSlotName[];
export type ExtensionSlotsType = typeof EXTENSION_SLOTS;
export const EXTENSION_ID = 'annotations' as const;

export type AnnotationsDefinition = ExtensionDefinition<
	typeof EXTENSION_ID,
	typeof EXTENSION_SLOTS,
	AnnotationsPublicAPI
>;

export type AnnotationsInstance = ExtensionInstance<
	typeof EXTENSION_ID,
	typeof EXTENSION_SLOTS,
	AnnotationsPublicAPI
>;

export interface AnnotationsStateInternalSvg {
	readonly svgCircles: Map<CircleAnnotationKey, SVGCircleElement>;
	readonly svgArrows: Map<ArrowAnnotationKey, SVGPathElement>;
}

export interface AnnotationsStateInternalAnnotations {
	readonly circles: Map<CircleAnnotationKey, CircleAnnotation>;
	readonly arrows: Map<ArrowAnnotationKey, ArrowAnnotation>;
}

export interface AnnotationsStateInternal extends ExtensionInternalBase<ExtensionSlotsType> {
	// Future render wiring:
	// public API mutations will need to request a render, but we still need to decide
	// which annotations-specific dirty/invalidation flag should be set before
	// calling state.runtimeSurface.commands.requestRender().
	readonly runtimeSurface: ExtensionRuntimeSurface;
	readonly svg: AnnotationsStateInternalSvg;
	readonly annotations: AnnotationsStateInternalAnnotations;
	readonly config: AnnotationsConfig;
}
