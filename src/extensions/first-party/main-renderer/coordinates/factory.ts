import { ConfigColorPair } from '../types/internal.js';
import { rendererCoordinatesRender } from './render.js';
import { MainRendererCoordinates, MainRendererCoordinatesInternal } from './types.js';

export function createMainRendererCoordinates(config: ConfigColorPair): MainRendererCoordinates {
	const internalState: MainRendererCoordinatesInternal = { config };
	return {
		render(context, slot) {
			rendererCoordinatesRender(internalState, context, slot);
		}
	};
}
