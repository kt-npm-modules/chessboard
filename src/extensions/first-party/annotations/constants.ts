import type { AnnotationsConfig, VisualConfig } from './types/internal.js';

export const DEFAULT_CONFIG: AnnotationsConfig = {
	clearOnCoreInteraction: false,
	colors: {
		none: '#22c55e',
		ctrl: '#ef4444',
		shift: '#f97316',
		alt: '#3b82f6',
		meta: '#a855f7'
	}
};

export const VISUAL_CONFIG: VisualConfig = {
	circle: {
		committed: {
			strokeWidth: 0.0625,
			radius: 0.46875,
			opacity: 1
		},
		previewAdd: {
			strokeWidth: 0.05,
			radius: 0.34,
			opacity: 0.8
		},
		previewRemoveOpacity: 0.25
	},
	arrow: {
		committed: {
			strokeWidth: 0.14,
			headSize: 0.32,
			startOffset: 0.18,
			endOffset: 0.28,
			opacity: 0.75
		},
		previewAdd: {
			strokeWidth: 0.11,
			headSize: 0.28,
			startOffset: 0.18,
			endOffset: 0.28,
			opacity: 0.55
		},
		previewRemoveOpacity: 0.25
	}
};
