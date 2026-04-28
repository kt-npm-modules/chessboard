import { describe, expect, it, vi } from 'vitest';
import type {
	AnyExtensionDefinition,
	AnyExtensionInstance
} from '../../../src/extensions/types/extension.js';
import type { ExtensionRuntimeSurfaceCommands } from '../../../src/extensions/types/surface/commands.js';
import { createRuntime } from '../../../src/runtime/factory/main.js';
import { normalizeSquare } from '../../../src/state/board/normalize.js';
import { PieceCode } from '../../../src/state/board/types/internal.js';

let capturedCommands: ExtensionRuntimeSurfaceCommands | null = null;

function createDragCapableExtension(id: string): AnyExtensionDefinition {
	return {
		id,
		slots: [],
		createInstance(options) {
			capturedCommands = options.runtimeSurface.commands;
			return {
				id,
				completeDrag: vi.fn()
			} as unknown as AnyExtensionInstance;
		}
	};
}

function createExtensionWithoutCompleteDrag(id: string): AnyExtensionDefinition {
	return {
		id,
		slots: [],
		createInstance(options) {
			capturedCommands = options.runtimeSurface.commands;
			return {
				id
			} as unknown as AnyExtensionInstance;
		}
	};
}

function createTestRuntime(extDef?: AnyExtensionDefinition) {
	capturedCommands = null;
	const ext = extDef ?? createDragCapableExtension('test-ext');
	const runtime = createRuntime({ doc: document, extensions: [ext] });
	return { runtime, commands: capturedCommands! };
}

describe('runtime startDrag (extension-facing boundary)', () => {
	it('returns true when starting a valid drag session', () => {
		const { commands } = createTestRuntime();

		const result = commands.startDrag({
			type: 'lifted-piece-drag',
			sourceSquare: normalizeSquare('e2'),
			sourcePieceCode: PieceCode.WhitePawn,
			targetSquare: normalizeSquare('e4')
		});

		expect(result).toBe(true);
	});

	it('snapshot reflects drag session with owner auto-populated', () => {
		const { runtime, commands } = createTestRuntime();

		commands.startDrag({
			type: 'lifted-piece-drag',
			sourceSquare: normalizeSquare('e2'),
			sourcePieceCode: PieceCode.WhitePawn,
			targetSquare: normalizeSquare('e4')
		});

		const snapshot = runtime.getSnapshot();
		expect(snapshot.state.interaction.dragSession).not.toBeNull();
		expect(snapshot.state.interaction.dragSession!.owner).toBe('test-ext');
		expect(snapshot.state.interaction.dragSession!.type).toBe('lifted-piece-drag');
		expect(snapshot.state.interaction.dragSession!.sourceSquare).toBe(normalizeSquare('e2'));
		expect(snapshot.state.interaction.dragSession!.targetSquare).toBe(normalizeSquare('e4'));
	});

	it('throws when starting a drag while another session is active', () => {
		const { commands } = createTestRuntime();

		commands.startDrag({
			type: 'lifted-piece-drag',
			sourceSquare: normalizeSquare('e2'),
			sourcePieceCode: PieceCode.WhitePawn,
			targetSquare: normalizeSquare('e4')
		});

		expect(() =>
			commands.startDrag({
				type: 'release-targeting',
				sourceSquare: normalizeSquare('d7'),
				sourcePieceCode: PieceCode.BlackPawn,
				targetSquare: normalizeSquare('d5')
			})
		).toThrow(/Cannot set a new drag session/);
	});

	it('can start a new drag session after clearing the previous one', () => {
		const { runtime, commands } = createTestRuntime();

		commands.startDrag({
			type: 'lifted-piece-drag',
			sourceSquare: normalizeSquare('e2'),
			sourcePieceCode: PieceCode.WhitePawn,
			targetSquare: normalizeSquare('e4')
		});

		runtime.clearActiveInteraction();

		const result = commands.startDrag({
			type: 'release-targeting',
			sourceSquare: normalizeSquare('d7'),
			sourcePieceCode: PieceCode.BlackPawn,
			targetSquare: normalizeSquare('d5')
		});

		expect(result).toBe(true);
		const snapshot = runtime.getSnapshot();
		expect(snapshot.state.interaction.dragSession!.owner).toBe('test-ext');
		expect(snapshot.state.interaction.dragSession!.type).toBe('release-targeting');
	});

	it('throws when extension does not have completeDrag handler', () => {
		const { commands } = createTestRuntime(createExtensionWithoutCompleteDrag('no-drag-ext'));

		expect(() =>
			commands.startDrag({
				type: 'lifted-piece-drag',
				sourceSquare: normalizeSquare('e2'),
				sourcePieceCode: PieceCode.WhitePawn,
				targetSquare: normalizeSquare('e4')
			})
		).toThrow(/completeDrag/);
	});
});
