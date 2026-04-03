import type { AnimationSessionSnapshot } from '../../../animation/types';
import type { RenderGeometry } from '../../../layout/geometry/types';
import { decodePiece } from '../../../state/board/encode';
import type { BoardStateSnapshot } from '../../../state/board/types';
import { cburnettPieceUrl } from '../assets';
import { createSvgGroup, SVG_NS } from '../helpers';

export function renderAnimationFrame(
	sessionGroup: SVGGElement,
	session: AnimationSessionSnapshot,
	board: BoardStateSnapshot,
	geometry: RenderGeometry,
	now: number
): void {
	// Find or create reserved child group with stable marker
	let reservedGroup = sessionGroup.querySelector<SVGGElement>('g[data-layer-id="animation-frame"]');
	if (!reservedGroup) {
		reservedGroup = createSvgGroup(document, { 'data-layer-id': 'animation-frame' });
		sessionGroup.appendChild(reservedGroup);
	}

	// Clear reserved group
	while (reservedGroup.firstChild) {
		reservedGroup.removeChild(reservedGroup.firstChild);
	}

	// Compute normalized progress
	const elapsed = now - session.startTime;
	const t = Math.min(1, Math.max(0, elapsed / session.duration));

	// Apply easing (same as Phase 3.9)
	const te = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

	// Render each track
	for (const track of session.tracks) {
		if (track.effect !== 'move') continue; // Only 'move' implemented in 3.10

		// Get source and destination rects
		const fromRect = geometry.squareRect(track.fromSq);
		const toRect = geometry.squareRect(track.toSq);

		// Interpolate position and size
		const x = fromRect.x + (toRect.x - fromRect.x) * te;
		const y = fromRect.y + (toRect.y - fromRect.y) * te;
		const size = fromRect.size + (toRect.size - fromRect.size) * te;

		// Look up piece material at destination square (handles promotions)
		const pieceCode = board.pieces[track.toSq];
		const piece = decodePiece(pieceCode);
		if (!piece) continue; // Defensive: should not happen

		const pieceUrl = cburnettPieceUrl(piece.color, piece.role);

		// Create transient image node
		const img = document.createElementNS(SVG_NS, 'image');
		img.setAttribute('x', String(x));
		img.setAttribute('y', String(y));
		img.setAttribute('width', String(size));
		img.setAttribute('height', String(size));
		img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', pieceUrl);
		img.setAttribute('href', pieceUrl);

		reservedGroup.appendChild(img);
	}
}
