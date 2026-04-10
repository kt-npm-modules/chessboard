import { ExtensionRenderContext, ExtensionUpdateContext } from '../../types';
import { ConfigColorPair } from '../types/config';

export interface MainRendererBoardInternal {
	readonly config: ConfigColorPair;
}

export interface MainRendererBoard {
	onUpdate(context: ExtensionUpdateContext): void;
	render(context: ExtensionRenderContext, layer: SVGElement): void;
}
