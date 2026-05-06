import { ExtensionSlotName, ExtensionSlotSvgRoots } from '../extensions/types/basic/mount.js';
import { validateIsMounted, validateIsNotMounted } from './rendering/helpers.js';
import { clearDefinitionSlotChildren, clearVisualSlotChildren } from './svg/helpers.js';
import { RenderSystemInternal } from './types.js';

export function renderMount(state: RenderSystemInternal, element: HTMLElement): void {
	validateIsNotMounted(state);
	state.container = element;
	// mount our svg root to the container
	element.appendChild(state.svgRoots.svgRoot);
	// Now call onMount for all extensions with their slot roots
	for (const extensionRec of state.extensions.values()) {
		const slotRoots = extensionRec.render.slots as ExtensionSlotSvgRoots<
			readonly ExtensionSlotName[]
		>;
		extensionRec.extension.instance.mount?.({ slotRoots });
	}
}

export function renderUnmount(state: RenderSystemInternal): void {
	validateIsMounted(state);
	for (const extensionRec of state.extensions.values()) {
		extensionRec.extension.instance.unmount?.();
		// clear the slot roots
		for (const [slotName, slotRoot] of Object.entries(extensionRec.render.slots)) {
			if (slotName === 'defs') {
				clearDefinitionSlotChildren(slotRoot as SVGDefsElement, extensionRec.extension.id);
			} else {
				clearVisualSlotChildren(slotRoot as SVGGElement);
			}
		}
	}
	// remove our svg root from the container
	state.svgRoots.svgRoot.remove();
	state.container = null;

	// Now cleanup the render state
	state.currentFrame = null;
}
