import { fileOf, rankOf } from '../../state/board/coords';
import { Square } from '../../state/board/types';

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
export type SvgElementOtherAttributes = SvgElementAttributes & { id?: never };
export type SvgElementWithIdAttributes = SvgElementAttributes & { id: string };

export function createSvgElement<K extends SvgElementNames>(
	doc: Document,
	name: K,
	attrs: SvgElementWithIdAttributes
): SVGElementTagNameMap[K] {
	// Check that element with the same ID does not already exist in the document to prevent duplicates.
	if (doc.getElementById(attrs.id)) {
		throw new Error(`Element with ID "${attrs.id}" already exists in the document.`);
	}
	const el = doc.createElementNS(SVG_NS, name);
	for (const [key, value] of Object.entries(attrs)) {
		el.setAttribute(key, value);
	}
	return el;
}

export function createSvgGroup(doc: Document, attrs: SvgElementWithIdAttributes): SVGGElement {
	return createSvgElement(doc, 'g', attrs);
}

export function createSvgDefs(doc: Document, attrs: SvgElementWithIdAttributes): SVGDefsElement {
	return createSvgElement(doc, 'defs', attrs);
}

export function createSvgRect(doc: Document, attrs: SvgElementWithIdAttributes): SVGRectElement {
	return createSvgElement(doc, 'rect', attrs);
}

export function createSvgText(
	doc: Document,
	content: string,
	attrs: SvgElementWithIdAttributes
): SVGTextElement {
	const element = createSvgElement(doc, 'text', attrs);
	element.textContent = content;
	return element;
}

export function createSvgImage(doc: Document, attrs: SvgElementWithIdAttributes): SVGImageElement {
	return createSvgElement(doc, 'image', attrs);
}

export function updateElementAttributes(element: Element, attrs: SvgElementOtherAttributes): void {
	for (const [key, value] of Object.entries(attrs)) {
		element.setAttribute(key, value);
	}
}

export function clearElementChildren(element: Element): void {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}
