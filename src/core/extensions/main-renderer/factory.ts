import { SvgRendererExtensionDefinition, SvgRendererInitOptions } from './types';

const slots = ['board', 'pieces', 'animation', 'drag'] as const;
const id = 'main-renderer' as const;

export function createSvgRenderer(options: SvgRendererInitOptions): SvgRendererExtensionDefinition {
	return {
		id,
		slots,
		createInstance() {
			throw new Error('Main renderer instance should be created by the chessboard, not manually');
		}
	};
}
