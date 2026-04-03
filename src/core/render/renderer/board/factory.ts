import { merge } from 'lodash-es';
import { createSvgGroup } from '../helpers';
import { renderBoard } from './render';
import {
	DEFAULT_RENDERER_BOARD_CONFIG,
	SvgRendererBoard,
	SvgRendererBoardInitOptions,
	SvgRendererBoardInternals
} from './types';

function createRendererBoardInternals(
	doc: Document,
	options: SvgRendererBoardInitOptions = {}
): SvgRendererBoardInternals {
	return {
		config: merge({}, DEFAULT_RENDERER_BOARD_CONFIG, options),
		root: createSvgGroup(doc, { id: 'renderer-board-root' }),
		coords: createSvgGroup(doc, { id: 'renderer-board-coords' }),
		pieces: createSvgGroup(doc, { id: 'renderer-board-pieces' }),
		defsRoot: createSvgGroup(doc, { id: 'renderer-board-defs' }),
		pieceNodes: new Map()
	};
}

export function createRendererBoard(
	doc: Document,
	options: SvgRendererBoardInitOptions = {}
): SvgRendererBoard {
	const internalState = createRendererBoardInternals(doc, options);

	return {
		...internalState,
		render(context) {
			renderBoard(internalState, context);
		}
	};
}
