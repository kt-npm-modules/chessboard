import type { MoveBaseSnapshot, MoveSnapshot } from '../board/types/internal';

function baseMovesEqual(moveA: MoveBaseSnapshot, moveB: MoveBaseSnapshot): boolean {
	const diffs: boolean[] = [
		moveA.from !== moveB.from,
		moveA.to !== moveB.to,
		moveA.moved.color !== moveB.moved.color,
		moveA.moved.role !== moveB.moved.role
	];
	return !diffs.some(Boolean);
}

export function movesEqual(moveA: MoveSnapshot | null, moveB: MoveSnapshot | null): boolean {
	if (moveA === null && moveB === null) {
		return true;
	}
	if (moveA === null || moveB === null) {
		return false;
	}
	if (!baseMovesEqual(moveA, moveB)) {
		return false;
	}
	const diffs: boolean[] = [
		moveA.promotedTo !== moveB.promotedTo,
		moveA.captured?.piece.color !== moveB.captured?.piece.color,
		moveA.captured?.piece.role !== moveB.captured?.piece.role,
		moveA.captured?.square !== moveB.captured?.square
	];
	if (diffs.some(Boolean)) {
		return false;
	}
	// Now check secondary moves
	if (moveA.secondary === undefined && moveB.secondary === undefined) {
		return true;
	}
	if (moveA.secondary === undefined || moveB.secondary === undefined) {
		return false;
	}
	return movesEqual(moveA.secondary, moveB.secondary);
}
