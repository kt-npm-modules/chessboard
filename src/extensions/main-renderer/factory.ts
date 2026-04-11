import { toMerged } from 'es-toolkit';
import { ExtensionCreateInstanceOptions } from '../types/extension';
import { createMainRendererBoard } from './board/factory';
import { createMainRendererCoordinates } from './coordinates/factory';
import { createMainRendererDrag } from './drag/factory';
import { createMainRendererPieces } from './pieces/factory';
import { DEFAULT_MAIN_RENDERER_CONFIG, MainRendererConfig } from './types/config';
import {
	EXTENSION_ID,
	EXTENSION_SLOTS,
	MainRendererDefinition,
	MainRendererInitOptions,
	MainRendererInstance
} from './types/extension';
import { MainRendererInstanceInternal } from './types/instance';

export function createMainRenderer(options: MainRendererInitOptions = {}): MainRendererDefinition {
	const config: MainRendererConfig = toMerged(DEFAULT_MAIN_RENDERER_CONFIG, options);
	return {
		id: EXTENSION_ID,
		slots: EXTENSION_SLOTS,
		createInstance(options) {
			return createMainRendererInstance(options, config);
		}
	};
}

function createMainRendererInternal(
	options: ExtensionCreateInstanceOptions,
	config: MainRendererConfig
): MainRendererInstanceInternal {
	const board = createMainRendererBoard(config.colors.board);
	const coordinates = createMainRendererCoordinates(config.colors.coordinates);
	const pieces = createMainRendererPieces(config.pieceUrls);
	const drag = createMainRendererDrag(config.pieceUrls, options.runtimeSurface);
	return {
		board,
		coordinates,
		pieces,
		drag,
		slotRoots: null,
		runtimeSurface: options.runtimeSurface
	};
}

function validateIsMounted(
	state: MainRendererInstanceInternal
): asserts state is MainRendererInstanceInternal & {
	slotRoots: NonNullable<MainRendererInstanceInternal['slotRoots']>;
} {
	if (state.slotRoots === null) {
		throw new Error('Extension instance is not mounted yet');
	}
}
function createMainRendererInstance(
	options: ExtensionCreateInstanceOptions,
	config: MainRendererConfig
): MainRendererInstance {
	const internalState = createMainRendererInternal(options, config);
	return {
		id: EXTENSION_ID,
		mount(env) {
			internalState.slotRoots = env.slotRoots;
		},
		onUpdate(context) {
			internalState.board.onUpdate(context);
			internalState.pieces.onUpdate(context);
			internalState.drag.onUpdate(context);
		},
		render(context) {
			validateIsMounted(internalState);
			internalState.board.render(context, internalState.slotRoots.board);
			internalState.coordinates.render(context, internalState.slotRoots.coordinates);
			internalState.pieces.render(context, internalState.slotRoots.pieces);
		},
		renderTransientVisuals(context) {
			validateIsMounted(internalState);
			internalState.drag.renderTransientVisuals(context, internalState.slotRoots.drag);
		},
		unmount() {
			// internalState.board.unmount();
			// internalState.coordinates.unmount();
			internalState.pieces.unmount();
			internalState.drag.unmount();
		}
	};
}
