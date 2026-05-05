import type { Square } from '../../../../state/board/types/internal.js';

/** Annotation color as a CSS-compatible color string. */
export type AnnotationColor = string;

export type CircleAnnotationKey = Square;
export type ArrowAnnotationKey = number; // from*64 + to

export interface CircleAnnotation {
	readonly key: CircleAnnotationKey;
	readonly square: Square;
	readonly color: AnnotationColor;
}

export interface ArrowAnnotation {
	readonly key: ArrowAnnotationKey;
	readonly from: Square;
	readonly to: Square;
	readonly color: AnnotationColor;
}

export interface AnnotationModifierColorConfig {
	readonly none: AnnotationColor;
	readonly ctrl: AnnotationColor;
	readonly shift: AnnotationColor;
	readonly alt: AnnotationColor;
	readonly meta: AnnotationColor;
}

export interface AnnotationsConfig {
	clearOnCoreInteraction: boolean;
	readonly colors: AnnotationModifierColorConfig;
}

export interface VisualConfigCircleAnnotation {
	strokeWidth: number; // relative to the square size
	radius: number; // relative to the square size
	opacity: number;
}

export interface VisualConfigArrowAnnotation {
	strokeWidth: number; // relative to the square size
	headSize: number; // relative to the square size
	startOffset: number; // relative to the square size
	endOffset: number; // relative to the square size
	opacity: number;
}

export interface VisualConfigCircle {
	readonly committed: VisualConfigCircleAnnotation;
	readonly previewAdd: VisualConfigCircleAnnotation;

	/**
	 * Remove preview reuses previewAdd definitions
	 * and overrides only opacity.
	 */
	readonly previewRemoveOpacity: number;
}

export interface VisualConfigArrow {
	readonly committed: VisualConfigArrowAnnotation;
	readonly previewAdd: VisualConfigArrowAnnotation;

	/**
	 * Remove preview reuses committed arrow definitions
	 * and overrides only opacity.
	 */
	readonly previewRemoveOpacity: number;
}

export interface VisualConfig {
	readonly circle: VisualConfigCircle;
	readonly arrow: VisualConfigArrow;
}
