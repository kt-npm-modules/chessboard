import { validateIsMounted, validateIsNotMounted } from './rendering/helpers';
import { RenderInternal } from './types';

export function renderMount(state: RenderInternal, element: HTMLElement): void {
	validateIsNotMounted(state);
	state.container = element;
	// mount our svg root to the container
	element.appendChild(state.svgRoots.svgRoot);
	// Now call onMount for all extensions with their slot roots
	for (const extensionRec of state.extensions.values()) {
		const slotRoots = extensionRec.render.slots;
		extensionRec.instance.onMount({ slotRoots });
	}
}

export function renderUnmount(state: RenderInternal): void {
	validateIsMounted(state);
	for (const extensionRec of state.extensions.values()) {
		extensionRec.instance.onDestroy();
		extensionRec.render.invalidation.clear();
		extensionRec.render.animation.clear();
	}
	// remove our svg root from the container
	state.container!.removeChild(state.svgRoots.svgRoot);
	state.container = null;

	// Now cleanup the render state
	state.lastRenderedState = null;
}
