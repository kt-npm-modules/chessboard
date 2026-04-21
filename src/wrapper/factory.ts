import {
	builtInExtensionFactoryMap,
	DefaultBuiltinChessboardExtensions
} from '../extensions/types/wrapper.js';
import { createRuntime } from '../runtime/factory/main.js';
import { Chessboard, ChessboardExtensionInput, ChessboardInitOptions } from './types.js';

export function createBoard<
	TExtensions extends readonly ChessboardExtensionInput[] = DefaultBuiltinChessboardExtensions
>(options: ChessboardInitOptions<TExtensions>): Chessboard<TExtensions> {
	// prepare init options for runtime
	const extensionsInput = options.extensions ?? DefaultBuiltinChessboardExtensions;
	const extensions = extensionsInput.map((ext) => {
		if (typeof ext === 'string') {
			// built-in extension, convert to definition
			return builtInExtensionFactoryMap[ext]();
		}
		// assume it's already a definition
		return ext;
	});
	const doc =
		'document' in options && options.document ? options.document : options.element.ownerDocument;
	const runtime = createRuntime({
		doc,
		state: options.state,
		extensions
	});
	if ('element' in options && options.element) {
		runtime.mount(options.element);
	}
	return {
		mount: runtime.mount,
		unmount: runtime.unmount,
		destroy: runtime.destroy,
		setPosition: runtime.setPosition,
		setPiecePosition: runtime.setPiecePosition,
		setTurn: runtime.setTurn,
		move: runtime.move,
		setOrientation: runtime.setOrientation,
		setMovability: runtime.setMovability,
		select: runtime.select,
		getSnapshot: runtime.getSnapshot,
		extensions: runtime.getExtensionsPublicRecord() as Chessboard<TExtensions>['extensions']
	};
}
