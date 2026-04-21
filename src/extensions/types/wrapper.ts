/**
 * Public built-in extension ids accepted by createBoard({ extensions })
 */

import {
	ActiveTargetDefinition,
	EXTENSION_ID as EXTENSION_ID_ACTIVE_TARGET
} from '../first-party/active-target/types.js';
import { EXTENSION_ID as EXTENSION_ID_AUTO_PROMOTE } from '../first-party/auto-promote/types.js';
import {
	BoardEventsDefinition,
	EXTENSION_ID as EXTENSION_ID_BOARD_EVENTS
} from '../first-party/board-events/types.js';
import {
	EXTENSION_ID as EXTENSION_ID_LAST_MOVE,
	LastMoveDefinition
} from '../first-party/last-move/types.js';
import {
	EXTENSION_ID as EXTENSION_ID_LEGAL_MOVES,
	LegalMovesDefinition
} from '../first-party/legal-moves/types.js';
import {
	EXTENSION_ID as EXTENSION_ID_RENDERER,
	MainRendererDefinition
} from '../first-party/main-renderer/types/extension.js';
import {
	EXTENSION_ID as EXTENSION_ID_SELECTED_SQUARE,
	SelectedSquareDefinition
} from '../first-party/selected-square/types.js';

export const BuiltinChessboardExtensions = [
	EXTENSION_ID_RENDERER,
	EXTENSION_ID_SELECTED_SQUARE,
	EXTENSION_ID_LAST_MOVE,
	EXTENSION_ID_ACTIVE_TARGET,
	EXTENSION_ID_LEGAL_MOVES,
	EXTENSION_ID_BOARD_EVENTS,
	EXTENSION_ID_AUTO_PROMOTE
] as const;
export type BuiltinChessboardExtensions = typeof BuiltinChessboardExtensions;
export type BuiltInExtensionId = BuiltinChessboardExtensions[number];

export const DefaultBuiltinChessboardExtensions = [
	EXTENSION_ID_RENDERER,
	EXTENSION_ID_SELECTED_SQUARE,
	EXTENSION_ID_LAST_MOVE,
	EXTENSION_ID_ACTIVE_TARGET,
	EXTENSION_ID_LEGAL_MOVES,
	EXTENSION_ID_BOARD_EVENTS,
	EXTENSION_ID_AUTO_PROMOTE
] as const;
export type DefaultBuiltinChessboardExtensions = typeof DefaultBuiltinChessboardExtensions;

/**
 * Map built-in public ids -> concrete extension definition types
 */
export interface BuiltInExtensionDefinitionMap {
	mainRenderer: MainRendererDefinition;
	events: BoardEventsDefinition;
	selectedSquare: SelectedSquareDefinition;
	activeTarget: ActiveTargetDefinition;
	legalMoves: LegalMovesDefinition;
	lastMove: LastMoveDefinition;
}
