import { Square } from '../../../state/board/types';

export interface BoardPoint {
	readonly x: number;
	readonly y: number;
}

export interface TransientInput {
	target: Square | null;
	rawPoint: BoardPoint;
	clampedPoint: BoardPoint;
}
