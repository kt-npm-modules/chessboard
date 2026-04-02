import { ReadonlyDeep } from 'type-fest';
import type { Square } from '../state/board/types';

export type AnimationEffect = 'move' | 'fade-in' | 'fade-out' | 'snap-out';

export interface AnimationTrack {
	pieceCode: number;
	fromSq: Square;
	toSq: Square;
	effect: AnimationEffect;
}

export interface AnimationPlan {
	tracks: AnimationTrack[];
	duration: number;
}

export interface AnimationSession {
	id: number;
	tracks: AnimationTrack[];
	startTime: number; // performance.now() when started
	duration: number;
}

export type AnimationSessionSnapshot = ReadonlyDeep<AnimationSession>;
