import { cloneDeepWith } from 'es-toolkit/object';
import { ReadonlyDeep } from 'type-fest';

export type TSnapshot<T> = T extends { getSnapshot: () => infer S } ? S : ReadonlyDeep<T>;

export function getSnapshot<T>(obj: T): TSnapshot<T> {
	return cloneDeepWith(obj, (value) => {
		// check if this the object and it has method getSnapshot -> call it and return the result
		if (value && typeof value === 'object' && typeof value.getSnapshot === 'function') {
			return value.getSnapshot();
		}
		// otherwise, return undefined to let cloneDeepWith handle it
		return undefined;
	}) as unknown as TSnapshot<T>;
}
