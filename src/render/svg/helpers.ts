import { fileOf, rankOf } from '../../state/board/coords.js';
import { Square } from '../../state/board/types/internal.js';

export const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Helper to compute light/dark square parity.
 * Returns true for light squares, false for dark.
 * Convention: a1 is dark in many sets; here we follow theming from state (renderer decides).
 * If you need the classic pattern where a1 is dark, use: (file + rank) % 2 === 1
 */
export function isLightSquare(sq: Square): boolean {
	const f = fileOf(sq);
	const r = rankOf(sq);
	return ((f + r) & 1) === 1;
}

export type SvgElementNames = keyof SVGElementTagNameMap;

// Helper to create SVG elements with attributes.
// We need to exclude 'id' from generic attributes to enforce its presence for uniqueness in the document.
export type SvgElementAttributes = Record<string, string>;
export type SvgElementWithIdAttributes = SvgElementAttributes & { 'data-chessboard-id': string };
export type SvgElementWithExtensionIdAttributes = SvgElementWithIdAttributes & {
	'data-chessboard-extension-id': string;
};
export type SvgElementOtherAttributes = Omit<
	SvgElementAttributes,
	'data-chessboard-id' | 'data-chessboard-extension-id'
>;

function _updateElementAttributes(element: SVGElement, attrs: SvgElementAttributes): void {
	for (const [key, value] of Object.entries(attrs)) {
		element.setAttribute(key, value);
	}
}

export function createVisualSvgRootElement(
	parent: HTMLElement,
	attrs: SvgElementWithIdAttributes
): SVGSVGElement {
	const doc = parent.ownerDocument;
	const el = doc.createElementNS(SVG_NS, 'svg');
	_updateElementAttributes(el, attrs);
	parent.appendChild(el);
	return el;
}

export function createDefinitionSvgRootElement(
	parent: SVGSVGElement,
	attrs: SvgElementWithIdAttributes
): SVGDefsElement {
	const doc = parent.ownerDocument;
	const defs = doc.createElementNS(SVG_NS, 'defs');
	_updateElementAttributes(defs, attrs);
	parent.appendChild(defs);
	return defs;
}

export function createVisualSvgGroupRootElement(
	parent: SVGSVGElement,
	attrs: SvgElementWithIdAttributes
): SVGGElement {
	const doc = parent.ownerDocument;
	const el = doc.createElementNS(SVG_NS, 'g');
	_updateElementAttributes(el, attrs);
	parent.appendChild(el);
	return el;
}

export function createVisualSvgElement<K extends Exclude<SvgElementNames, 'svg' | 'defs'>>(
	parent: SVGGElement,
	name: K,
	attrs: SvgElementWithIdAttributes
): SVGElementTagNameMap[K] {
	const doc = parent.ownerDocument;
	const el = doc.createElementNS(SVG_NS, name);
	_updateElementAttributes(el, attrs);
	parent.appendChild(el);
	return el;
}

export function createDefinitionSvgElement<K extends SvgElementNames>(
	parent: SVGDefsElement,
	name: K,
	attrs: SvgElementWithExtensionIdAttributes
): SVGElementTagNameMap[K] {
	const doc = parent.ownerDocument;
	const el = doc.createElementNS(SVG_NS, name);
	_updateElementAttributes(el, attrs);
	parent.appendChild(el);
	return el;
}

export function updateSvgElementAttributes(
	element: SVGElement,
	attrs: SvgElementOtherAttributes
): void {
	_updateElementAttributes(element, attrs);
}

export function clearVisualSlotChildren(element: SVGGElement): void {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

export function clearDefinitionSlotChildren(element: SVGDefsElement, extensionId: string): void {
	// Loop over children and remove those that match all filter attributes
	const children = Array.from(element.children);
	for (const child of children) {
		if (child.getAttribute('data-chessboard-extension-id') === extensionId) {
			element.removeChild(child);
		}
	}
}
