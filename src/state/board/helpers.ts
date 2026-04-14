import { decodePiece, PieceCode } from './encode';
import type { BoardStateSnapshot, Piece, Square } from './types/internal';

export function getPieceAt(board: BoardStateSnapshot, sq: Square): Piece | null {
	const encoded = board.pieces[sq];
	return decodePiece(encoded);
}

export function isOccupied(board: BoardStateSnapshot, sq: Square): boolean {
	return board.pieces[sq] > PieceCode.Empty;
}

export function positionsEqual(pos1: BoardStateSnapshot, pos2: BoardStateSnapshot): boolean {
	if (pos1.positionEpoch !== pos2.positionEpoch) return false;
	for (let i = 0; i < pos1.pieces.length; i++) {
		if (pos1.pieces[i] !== pos2.pieces[i]) return false;
	}
	return true;
}
