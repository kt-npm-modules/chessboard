import { ExtensionDefinition, ExtensionInstance } from '../types';
import { PieceUrls } from './assets';
import { SvgRendererBoardInitOptions } from './board/types';

export interface SvgRendererInitOptions {
	board?: SvgRendererBoardInitOptions;
	pieceUrls?: PieceUrls;
}

export type SvgRendererExtensionDefinition = ExtensionDefinition<
	'main-renderer',
	readonly ['board', 'pieces', 'animation', 'drag'],
	never,
	void
>;

export type SvgRendererExtensionInstance = ExtensionInstance<
	'main-renderer',
	readonly ['board', 'pieces', 'animation', 'drag'],
	never,
	void
>;
