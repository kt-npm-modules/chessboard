import { decodePiece } from '../state/encode';
import { DirtyLayer, Square, type Color, type Role, type StateSnapshot } from '../state/types';
import { cburnettSpriteUrl } from './assets';
import { isLightSquare } from './geometry';
import type { BoardGeometry, Invalidation, Renderer } from './types';

const SVG_NS = 'http://www.w3.org/2000/svg';

type SvgRendererOptions = {
	/** Optional override for the sprite URL. Defaults to cburnettSpriteUrl(). */
	spriteUrl?: string;
};

export type Arrow = { from: Square; to: Square; color?: string; width?: number; opacity?: number };

/**
 * Minimal SVG renderer with invalidation awareness.
 * Layers:
 *  - squares: board background
 *  - highlights: last move + selection
 *  - pieces: all pieces rendered from sprite
 *  - overlay: reserved for arrows/drag previews (empty in v1)
 *
 * Strategy for pieces with sprite:
 *  - Each piece is a <g> with a clipPath (userSpaceOnUse) exactly covering its square.
 *  - Inside the group, we place a single <image href={spriteUrl}> scaled to (squareSize*6 x squareSize*2).
 *  - We offset the image by -col*squareSize, -row*squareSize to show the desired tile.
 */
export class SvgRenderer implements Renderer {
	private root: SVGSVGElement | null = null;
	private layerSquares!: SVGGElement;
	private layerHighlights!: SVGGElement;
	private layerPieces!: SVGGElement;
	private layerOverlay!: SVGGElement;
	private defsStatic!: SVGDefsElement; // persistent defs (markers, etc.)
	private defsDynamic!: SVGDefsElement; // holds per-render clipPaths for pieces
	private overlayArrows: Arrow[] = [];
	private spriteUrl: string;
	private uidPrefix: string;

	constructor(opts: SvgRendererOptions = {}) {
		this.spriteUrl = opts.spriteUrl ?? cburnettSpriteUrl();
		this.uidPrefix = `cb-${Math.random().toString(36).slice(2)}-`;
	}

	mount(container: HTMLElement): void {
		if (this.root) this.unmount();

		const svg = document.createElementNS(SVG_NS, 'svg');
		svg.setAttribute('xmlns', SVG_NS);
		svg.setAttribute('fill', 'none');
		svg.setAttribute('stroke', 'none');

		const defsStatic = document.createElementNS(SVG_NS, 'defs');
		svg.appendChild(defsStatic);

		const gSquares = document.createElementNS(SVG_NS, 'g');
		const gHighlights = document.createElementNS(SVG_NS, 'g');
		const gPieces = document.createElementNS(SVG_NS, 'g');
		const gOverlay = document.createElementNS(SVG_NS, 'g');
		const defsDynamic = document.createElementNS(SVG_NS, 'defs');

		svg.appendChild(gSquares);
		svg.appendChild(gHighlights);
		svg.appendChild(gPieces);
		svg.appendChild(gOverlay);
		svg.appendChild(defsDynamic);

		this.root = svg;
		this.layerSquares = gSquares;
		this.layerHighlights = gHighlights;
		this.layerPieces = gPieces;
		this.layerOverlay = gOverlay;
		this.defsDynamic = defsDynamic;
		this.defsStatic = defsStatic;
		this.ensureArrowMarker();

		container.appendChild(svg);
	}

	unmount(): void {
		if (this.root && this.root.parentNode) {
			this.root.parentNode.removeChild(this.root);
		}
		this.root = null!;
	}

	render(state: StateSnapshot, geometry: BoardGeometry, invalidation: Invalidation): void {
		if (!this.root) return;

		// Ensure size/viewBox matches geometry
		const size = String(geometry.boardSize);
		this.root.setAttribute('width', size);
		this.root.setAttribute('height', size);
		this.root.setAttribute('viewBox', `0 0 ${size} ${size}`);

		// Decide what to update based on layers bitmask
		const layers = invalidation.layers;
		const updateBoard =
			(layers & DirtyLayer.Board) !== 0 || (layers & DirtyLayer.Coords) !== 0 || layers === 0;
		const updateHighlights =
			(layers & DirtyLayer.Highlights) !== 0 || (layers & DirtyLayer.LastMove) !== 0 || updateBoard;
		const updatePieces = (layers & DirtyLayer.Pieces) !== 0 || updateBoard;
		const updateOverlay = (layers & DirtyLayer.Overlay) !== 0 || updateBoard;

		if (updateBoard) this.drawSquares(state.theme.light, state.theme.dark, geometry);
		if (updateHighlights) this.drawHighlights(state, geometry);
		if (updatePieces) this.drawPieces(state, geometry);
		if (updateOverlay) this.drawOverlay(state, geometry);
	}

	private clear(node: Element) {
		while (node.firstChild) node.removeChild(node.firstChild);
	}

	private drawSquares(light: string, dark: string, g: BoardGeometry) {
		const layer = this.layerSquares;
		this.clear(layer);

		for (let sq = 0 as Square; sq < 64; sq++) {
			const r = g.squareRect(sq);
			const rect = document.createElementNS(SVG_NS, 'rect');
			rect.setAttribute('x', r.x.toString());
			rect.setAttribute('y', r.y.toString());
			rect.setAttribute('width', r.size.toString());
			rect.setAttribute('height', r.size.toString());
			rect.setAttribute('fill', isLightSquare(sq) ? light : dark);
			rect.setAttribute('shape-rendering', 'crispEdges');
			layer.appendChild(rect);
		}
	}

	private drawHighlights(state: StateSnapshot, g: BoardGeometry) {
		const layer = this.layerHighlights;
		this.clear(layer);

		// last move
		if (state.lastMove) {
			this.drawHighlightRect(g, state.lastMove.from, state.theme.lastMove);
			this.drawHighlightRect(g, state.lastMove.to, state.theme.lastMove);
		}
		// selection
		if (state.selected !== -1) {
			this.drawHighlightRect(g, state.selected, state.theme.selection);
		}
	}

	private drawHighlightRect(g: BoardGeometry, sq: Square, color: string) {
		const r = g.squareRect(sq);
		const rect = document.createElementNS(SVG_NS, 'rect');
		rect.setAttribute('x', r.x.toString());
		rect.setAttribute('y', r.y.toString());
		rect.setAttribute('width', r.size.toString());
		rect.setAttribute('height', r.size.toString());
		rect.setAttribute('fill', color);
		this.layerHighlights.appendChild(rect);
	}

	private drawPieces(state: StateSnapshot, g: BoardGeometry) {
		const layer = this.layerPieces;
		this.clear(layer);
		this.clear(this.defsDynamic);

		const tileSize = g.squareSize;
		const imgW = tileSize * 6;
		const imgH = tileSize * 2;

		for (let sq = 0 as Square; sq < 64; sq++) {
			const code = state.pieces[sq];
			const piece = decodePiece(code);
			if (!piece) continue;

			const { col, row } = spriteTileFor(piece.color, piece.role);
			const r = g.squareRect(sq);

			// Create a unique clipPath for this square
			const clipId = `${this.uidPrefix}clip-${sq}`;
			const cp = document.createElementNS(SVG_NS, 'clipPath');
			cp.setAttribute('id', clipId);
			cp.setAttribute('clipPathUnits', 'userSpaceOnUse');
			const cpRect = document.createElementNS(SVG_NS, 'rect');
			cpRect.setAttribute('x', r.x.toString());
			cpRect.setAttribute('y', r.y.toString());
			cpRect.setAttribute('width', r.size.toString());
			cpRect.setAttribute('height', r.size.toString());
			cp.appendChild(cpRect);
			this.defsDynamic.appendChild(cp);

			// Image positioned so the desired tile aligns into the clipped square
			const img = document.createElementNS(SVG_NS, 'image');
			// href
			img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.spriteUrl);
			// modern attribute for browsers supporting it
			img.setAttribute('href', this.spriteUrl);

			img.setAttribute('x', (r.x - col * tileSize).toString());
			img.setAttribute('y', (r.y - row * tileSize).toString());
			img.setAttribute('width', imgW.toString());
			img.setAttribute('height', imgH.toString());
			img.setAttribute('preserveAspectRatio', 'none');

			const gPiece = document.createElementNS(SVG_NS, 'g');
			gPiece.setAttribute('clip-path', `url(#${clipId})`);
			gPiece.appendChild(img);

			layer.appendChild(gPiece);
		}
	}

	// Set overlay arrows and request overlay redraw on next render (via DirtyLayer.Overlay)
	setOverlayArrows(arrows: Arrow[]): void {
		this.overlayArrows = arrows.slice();
	}

	private ensureArrowMarker(): string {
		const id = `${this.uidPrefix}arrowhead`;
		if (this.defsStatic && !this.defsStatic.querySelector(`#${id}`)) {
			const marker = document.createElementNS(SVG_NS, 'marker');
			marker.setAttribute('id', id);
			marker.setAttribute('viewBox', '0 0 10 10');
			marker.setAttribute('refX', '9');
			marker.setAttribute('refY', '5');
			marker.setAttribute('markerWidth', '6');
			marker.setAttribute('markerHeight', '6');
			marker.setAttribute('orient', 'auto');
			marker.setAttribute('markerUnits', 'strokeWidth');
			const path = document.createElementNS(SVG_NS, 'path');
			path.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
			path.setAttribute('fill', 'context-stroke');
			path.setAttribute('stroke', 'none');
			marker.appendChild(path);
			this.defsStatic.appendChild(marker);
		}
		return id;
	}

	private drawOverlay(state: StateSnapshot, g: BoardGeometry) {
		this.clear(this.layerOverlay);
		if (!this.overlayArrows || this.overlayArrows.length === 0) return;

		const markerId = this.ensureArrowMarker();
		const defaultColor = state.theme.highlight ?? 'rgba(0, 128, 255, 0.8)';
		const widthFactor = 0.12;

		for (const a of this.overlayArrows) {
			const rFrom = g.squareRect(a.from);
			const rTo = g.squareRect(a.to);
			const x1 = rFrom.x + rFrom.size / 2;
			const y1 = rFrom.y + rFrom.size / 2;
			const x2 = rTo.x + rTo.size / 2;
			const y2 = rTo.y + rTo.size / 2;

			const line = document.createElementNS(SVG_NS, 'line');
			line.setAttribute('x1', String(x1));
			line.setAttribute('y1', String(y1));
			line.setAttribute('x2', String(x2));
			line.setAttribute('y2', String(y2));

			const color = a.color ?? defaultColor;
			const strokeWidth = (a.width ?? widthFactor) * g.squareSize;
			line.setAttribute('stroke', color);
			line.setAttribute('stroke-width', String(strokeWidth));
			line.setAttribute('stroke-linecap', 'round');
			line.setAttribute('stroke-linejoin', 'round');
			if (a.opacity != null) line.setAttribute('opacity', String(a.opacity));

			line.setAttribute('marker-end', `url(#${markerId})`);

			this.layerOverlay.appendChild(line);
		}
	}
}

/**
 * Map piece (color, role) to tile coordinates (col, row) in the 6x2 sprite grid.
 * Sprite columns left→right: K Q B N R P
 * Rows top→bottom: white (0), black (1)
 */
function spriteTileFor(color: Color, role: Role): { col: number; row: number } {
	const row = color === 'white' ? 0 : 1;
	let col = 0;
	switch (role) {
		case 'king':
			col = 0;
			break;
		case 'queen':
			col = 1;
			break;
		case 'bishop':
			col = 2;
			break;
		case 'knight':
			col = 3;
			break;
		case 'rook':
			col = 4;
			break;
		case 'pawn':
			col = 5;
			break;
	}
	return { col, row };
}
