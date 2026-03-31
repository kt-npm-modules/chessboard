import type { ReadonlyDeep } from 'type-fest';

/**
 * Base invalidation types
 */
export interface InvalidationStateBaseInternal {
	layers: number;
}
export type InvalidationStateBaseSnapshot = ReadonlyDeep<InvalidationStateBaseInternal>;

export interface InvalidationWriter {
	markLayer(layerMask: number): boolean;
}

export interface InvalidationStateBase extends InvalidationWriter {
	getLayers(): number;
	clear(): boolean;
	getWriter(): InvalidationWriter;
	getSnapshot(): InvalidationStateBaseSnapshot;
}

/**
 * Extension invalidation types
 */
export type InvalidationStateExtensionInternal = InvalidationStateBaseInternal;
export type InvalidationStateExtensionSnapshot = ReadonlyDeep<InvalidationStateExtensionInternal>;
export type InvalidationStateExtension = InvalidationStateBase;

/**
 * Full invalidation subsystem types
 */
export interface InvalidationStateInternal extends InvalidationStateBaseInternal {
	extensions: Record<string, InvalidationStateExtension>;
}

export type InvalidationStateSnapshot = ReadonlyDeep<
	Omit<InvalidationStateInternal, 'extensions'>
> & {
	extensions: Record<string, InvalidationStateExtensionSnapshot>;
};

export type InvalidationStateBaseExtension = InvalidationStateBase;

export interface InvalidationState extends InvalidationStateBase {
	getExtensions(): Readonly<Record<string, InvalidationStateExtension>>;
	getExtension(extensionId: string): InvalidationStateExtension | undefined;
	createExtension(extensionId: string): InvalidationStateExtension;
	getSnapshot(): InvalidationStateSnapshot;
}
