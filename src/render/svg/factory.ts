import { Writable } from 'type-fest';
import {
	ExtensionAllocatedSlotsInternal,
	ExtensionSlotName
} from '../../extensions/types/basic/mount.js';
import { RenderSystemInitOptionsInternal, SvgRoots } from '../types.js';
import {
	createDefinitionSvgRootElement,
	createVisualSvgElement,
	createVisualSvgGroupRootElement,
	createVisualSvgRootElement
} from './helpers.js';

export function createSvgRoots(options: RenderSystemInitOptionsInternal): SvgRoots {
	const { element } = options;
	const svgRoot = createVisualSvgRootElement(element, { 'data-chessboard-id': 'svg-root' });
	svgRoot.style.setProperty('user-select', 'none');
	svgRoot.style.setProperty('-webkit-user-select', 'none');
	svgRoot.style.setProperty('touch-action', 'pinch-zoom');
	svgRoot.style.setProperty('-webkit-touch-callout', 'none');
	svgRoot.style.setProperty('-webkit-tap-highlight-color', 'transparent');

	// Create children in the correct order
	const defs = createDefinitionSvgRootElement(svgRoot, {
		'data-chessboard-id': 'defs-root'
	});
	const board = createVisualSvgGroupRootElement(svgRoot, { 'data-chessboard-id': 'board-root' });
	const coordinates = createVisualSvgGroupRootElement(svgRoot, {
		'data-chessboard-id': 'coordinates-root'
	});
	const underPieces = createVisualSvgGroupRootElement(svgRoot, {
		'data-chessboard-id': 'under-pieces-root'
	});
	const pieces = createVisualSvgGroupRootElement(svgRoot, { 'data-chessboard-id': 'pieces-root' });
	const overPieces = createVisualSvgGroupRootElement(svgRoot, {
		'data-chessboard-id': 'over-pieces-root'
	});
	const animation = createVisualSvgGroupRootElement(svgRoot, {
		'data-chessboard-id': 'animation-root'
	});
	const underDrag = createVisualSvgGroupRootElement(svgRoot, {
		'data-chessboard-id': 'under-drag-root'
	});
	const drag = createVisualSvgGroupRootElement(svgRoot, { 'data-chessboard-id': 'drag-root' });
	const overDrag = createVisualSvgGroupRootElement(svgRoot, {
		'data-chessboard-id': 'over-drag-root'
	});

	const result: SvgRoots = {
		svgRoot,
		defs,
		board,
		coordinates,
		underPieces,
		pieces,
		overPieces,
		animation,
		underDrag,
		drag,
		overDrag
	};

	return result;
}

export function allocateExtensionSlotRoots(
	svgRoots: SvgRoots,
	extensionId: string,
	slots: readonly ExtensionSlotName[]
): ExtensionAllocatedSlotsInternal {
	const result = {} as Writable<ExtensionAllocatedSlotsInternal>;
	for (const slot of slots) {
		if (slot === 'defs') {
			result[slot] = svgRoots.defs;
		} else {
			const id = `extension-slot-root-${slot}-${extensionId}`;
			result[slot] = createVisualSvgElement(svgRoots[slot], 'g', { 'data-chessboard-id': id });
		}
	}
	return result;
}
