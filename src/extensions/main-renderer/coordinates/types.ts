import { ExtensionRenderContext } from '../../types/context/render';
import { ConfigColorPair } from '../types/config';

export interface MainRendererCoordinatesInternal {
	readonly config: ConfigColorPair;
}

export interface MainRendererCoordinates {
	render(context: ExtensionRenderContext, layer: SVGElement): void;
}
