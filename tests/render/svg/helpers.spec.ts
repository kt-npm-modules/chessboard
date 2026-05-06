import { describe, expect, it } from 'vitest';
import {
	clearDefinitionSlotChildren,
	clearVisualSlotChildren,
	createDefinitionSvgElement,
	createDefinitionSvgRootElement,
	createVisualSvgElement,
	createVisualSvgGroupRootElement,
	createVisualSvgRootElement,
	isLightSquare,
	SVG_NS,
	updateSvgElementAttributes
} from '../../../src/render/svg/helpers.js';
import { normalizeSquare } from '../../../src/state/board/normalize.js';

describe('SVG helpers', () => {
	describe('createVisualSvgRootElement', () => {
		it('creates an SVGSVGElement in the SVG namespace', () => {
			const parent = document.createElement('div');
			const el = createVisualSvgRootElement(parent, { 'data-chessboard-id': 'root' });
			expect(el.namespaceURI).toBe(SVG_NS);
			expect(el.tagName.toLowerCase()).toBe('svg');
		});

		it('appends to the parent HTMLElement', () => {
			const parent = document.createElement('div');
			const el = createVisualSvgRootElement(parent, { 'data-chessboard-id': 'root' });
			expect(el.parentNode).toBe(parent);
			expect(parent.children).toHaveLength(1);
		});

		it('sets provided attributes', () => {
			const parent = document.createElement('div');
			const el = createVisualSvgRootElement(parent, {
				'data-chessboard-id': 'my-svg',
				class: 'board'
			});
			expect(el.getAttribute('data-chessboard-id')).toBe('my-svg');
			expect(el.getAttribute('class')).toBe('board');
		});
	});

	describe('createDefinitionSvgRootElement', () => {
		it('creates a <defs> element as a direct child of the SVG root', () => {
			const parent = document.createElement('div');
			const svgRoot = createVisualSvgRootElement(parent, { 'data-chessboard-id': 'svg' });
			const defs = createDefinitionSvgRootElement(svgRoot, {
				'data-chessboard-id': 'defs-root'
			});
			expect(defs.tagName.toLowerCase()).toBe('defs');
			expect(defs.parentNode).toBe(svgRoot);
		});

		it('does not create nested <svg><defs> — defs is direct child of parent SVG', () => {
			const parent = document.createElement('div');
			const svgRoot = createVisualSvgRootElement(parent, { 'data-chessboard-id': 'svg' });
			createDefinitionSvgRootElement(svgRoot, { 'data-chessboard-id': 'defs' });
			// No nested svg elements under svgRoot
			expect(svgRoot.querySelectorAll('svg')).toHaveLength(0);
			// defs is direct child
			expect(svgRoot.querySelector(':scope > defs')).not.toBeNull();
		});

		it('sets provided attributes', () => {
			const parent = document.createElement('div');
			const svgRoot = createVisualSvgRootElement(parent, { 'data-chessboard-id': 'svg' });
			const defs = createDefinitionSvgRootElement(svgRoot, {
				'data-chessboard-id': 'my-defs'
			});
			expect(defs.getAttribute('data-chessboard-id')).toBe('my-defs');
		});
	});

	describe('createVisualSvgGroupRootElement', () => {
		it('creates a <g> element as child of SVG root', () => {
			const parent = document.createElement('div');
			const svgRoot = createVisualSvgRootElement(parent, { 'data-chessboard-id': 'svg' });
			const g = createVisualSvgGroupRootElement(svgRoot, { 'data-chessboard-id': 'layer' });
			expect(g.tagName.toLowerCase()).toBe('g');
			expect(g.parentNode).toBe(svgRoot);
		});
	});

	describe('createVisualSvgElement', () => {
		it('creates an element with the specified tag under a <g> parent', () => {
			const parent = document.createElement('div');
			const svgRoot = createVisualSvgRootElement(parent, { 'data-chessboard-id': 'svg' });
			const g = createVisualSvgGroupRootElement(svgRoot, { 'data-chessboard-id': 'layer' });
			const rect = createVisualSvgElement(g, 'rect', { 'data-chessboard-id': 'r1' });
			expect(rect.tagName.toLowerCase()).toBe('rect');
			expect(rect.parentNode).toBe(g);
		});

		it('sets all provided attributes', () => {
			const parent = document.createElement('div');
			const svgRoot = createVisualSvgRootElement(parent, { 'data-chessboard-id': 'svg' });
			const g = createVisualSvgGroupRootElement(svgRoot, { 'data-chessboard-id': 'layer' });
			const el = createVisualSvgElement(g, 'circle', {
				'data-chessboard-id': 'c1',
				cx: '50',
				cy: '50',
				r: '25'
			});
			expect(el.getAttribute('cx')).toBe('50');
			expect(el.getAttribute('cy')).toBe('50');
			expect(el.getAttribute('r')).toBe('25');
		});
	});

	describe('createDefinitionSvgElement', () => {
		it('creates an element as direct child of <defs>', () => {
			const parent = document.createElement('div');
			const svgRoot = createVisualSvgRootElement(parent, { 'data-chessboard-id': 'svg' });
			const defs = createDefinitionSvgRootElement(svgRoot, {
				'data-chessboard-id': 'defs'
			});
			const pattern = createDefinitionSvgElement(defs, 'pattern', {
				'data-chessboard-id': 'p1',
				'data-chessboard-extension-id': 'my-ext'
			});
			expect(pattern.tagName.toLowerCase()).toBe('pattern');
			expect(pattern.parentNode).toBe(defs);
		});

		it('requires data-chessboard-extension-id and data-chessboard-id', () => {
			const parent = document.createElement('div');
			const svgRoot = createVisualSvgRootElement(parent, { 'data-chessboard-id': 'svg' });
			const defs = createDefinitionSvgRootElement(svgRoot, {
				'data-chessboard-id': 'defs'
			});
			const el = createDefinitionSvgElement(defs, 'linearGradient', {
				'data-chessboard-id': 'grad-1',
				'data-chessboard-extension-id': 'ext-a'
			});
			expect(el.getAttribute('data-chessboard-id')).toBe('grad-1');
			expect(el.getAttribute('data-chessboard-extension-id')).toBe('ext-a');
		});
	});

	describe('updateSvgElementAttributes', () => {
		it('sets multiple attributes on an element', () => {
			const el = document.createElementNS(SVG_NS, 'rect');
			updateSvgElementAttributes(el, { x: '10', y: '20', width: '50' });
			expect(el.getAttribute('x')).toBe('10');
			expect(el.getAttribute('y')).toBe('20');
			expect(el.getAttribute('width')).toBe('50');
		});

		it('overwrites existing attributes', () => {
			const el = document.createElementNS(SVG_NS, 'rect');
			el.setAttribute('x', '0');
			updateSvgElementAttributes(el, { x: '99' });
			expect(el.getAttribute('x')).toBe('99');
		});
	});

	describe('clearVisualSlotChildren', () => {
		it('removes all child nodes from a <g> element', () => {
			const g = document.createElementNS(SVG_NS, 'g') as SVGGElement;
			g.appendChild(document.createElementNS(SVG_NS, 'rect'));
			g.appendChild(document.createElementNS(SVG_NS, 'circle'));
			expect(g.childNodes).toHaveLength(2);
			clearVisualSlotChildren(g);
			expect(g.childNodes).toHaveLength(0);
		});

		it('on empty element is a no-op', () => {
			const g = document.createElementNS(SVG_NS, 'g') as SVGGElement;
			expect(() => clearVisualSlotChildren(g)).not.toThrow();
			expect(g.childNodes).toHaveLength(0);
		});
	});

	describe('clearDefinitionSlotChildren', () => {
		it('removes only elements with matching data-chessboard-extension-id', () => {
			const defs = document.createElementNS(SVG_NS, 'defs') as SVGDefsElement;

			const elA = document.createElementNS(SVG_NS, 'pattern');
			elA.setAttribute('data-chessboard-extension-id', 'ext-a');
			defs.appendChild(elA);

			const elB = document.createElementNS(SVG_NS, 'pattern');
			elB.setAttribute('data-chessboard-extension-id', 'ext-b');
			defs.appendChild(elB);

			clearDefinitionSlotChildren(defs, 'ext-a');

			expect(defs.children).toHaveLength(1);
			expect(defs.children[0].getAttribute('data-chessboard-extension-id')).toBe('ext-b');
		});

		it('leaves all elements when no id matches', () => {
			const defs = document.createElementNS(SVG_NS, 'defs') as SVGDefsElement;

			const el = document.createElementNS(SVG_NS, 'pattern');
			el.setAttribute('data-chessboard-extension-id', 'ext-x');
			defs.appendChild(el);

			clearDefinitionSlotChildren(defs, 'ext-y');

			expect(defs.children).toHaveLength(1);
		});

		it('removes multiple elements with same extension id', () => {
			const defs = document.createElementNS(SVG_NS, 'defs') as SVGDefsElement;

			for (let i = 0; i < 3; i++) {
				const el = document.createElementNS(SVG_NS, 'pattern');
				el.setAttribute('data-chessboard-extension-id', 'ext-a');
				defs.appendChild(el);
			}

			const other = document.createElementNS(SVG_NS, 'pattern');
			other.setAttribute('data-chessboard-extension-id', 'ext-b');
			defs.appendChild(other);

			clearDefinitionSlotChildren(defs, 'ext-a');

			expect(defs.children).toHaveLength(1);
			expect(defs.children[0].getAttribute('data-chessboard-extension-id')).toBe('ext-b');
		});
	});

	describe('isLightSquare', () => {
		it('a1 is dark (file 0 + rank 0 is even)', () => {
			expect(isLightSquare(normalizeSquare('a1'))).toBe(false);
		});

		it('a2 is light (file 0 + rank 1 is odd)', () => {
			expect(isLightSquare(normalizeSquare('a2'))).toBe(true);
		});

		it('h1 is light (file 7 + rank 0 is odd)', () => {
			expect(isLightSquare(normalizeSquare('h1'))).toBe(true);
		});

		it('h8 is dark (file 7 + rank 7 is even)', () => {
			expect(isLightSquare(normalizeSquare('h8'))).toBe(false);
		});

		it('e4 is light (file 4 + rank 3 is odd)', () => {
			expect(isLightSquare(normalizeSquare('e4'))).toBe(true);
		});

		it('d4 is dark (file 3 + rank 3 is even)', () => {
			expect(isLightSquare(normalizeSquare('d4'))).toBe(false);
		});
	});
});
