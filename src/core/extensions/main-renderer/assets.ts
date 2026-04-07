import { ColorShort, RoleShort, type Color, type Role } from '../../state/board/types';

export type PieceKeyShort = `${ColorShort}${RoleShort}`;

export type PieceUrls = Record<PieceKeyShort, string>;

export const MAP_ROLE_TO_SHORT: Record<Role, RoleShort> = {
	king: 'K',
	queen: 'Q',
	rook: 'R',
	bishop: 'B',
	knight: 'N',
	pawn: 'p'
};

export function cburnettPieceUrl(color: Color, role: Role): string {
	const key = `${color === 'white' ? 'w' : 'b'}${MAP_ROLE_TO_SHORT[role]}` as PieceKeyShort;
	return CBURNETT_PIECE_URLS[key];
}

// Static URL table — each entry uses a literal path so bundlers can resolve it.
const CBURNETT_PIECE_URLS: PieceUrls = {
	wK: new URL('../../../../assets/pieces/cburnett/wk.svg', import.meta.url).toString(),
	wQ: new URL('../../../../assets/pieces/cburnett/wq.svg', import.meta.url).toString(),
	wR: new URL('../../../../assets/pieces/cburnett/wr.svg', import.meta.url).toString(),
	wB: new URL('../../../../assets/pieces/cburnett/wb.svg', import.meta.url).toString(),
	wN: new URL('../../../../assets/pieces/cburnett/wn.svg', import.meta.url).toString(),
	wp: new URL('../../../../assets/pieces/cburnett/wp.svg', import.meta.url).toString(),
	bK: new URL('../../../../assets/pieces/cburnett/bk.svg', import.meta.url).toString(),
	bQ: new URL('../../../../assets/pieces/cburnett/bq.svg', import.meta.url).toString(),
	bR: new URL('../../../../assets/pieces/cburnett/br.svg', import.meta.url).toString(),
	bB: new URL('../../../../assets/pieces/cburnett/bb.svg', import.meta.url).toString(),
	bN: new URL('../../../../assets/pieces/cburnett/bn.svg', import.meta.url).toString(),
	bp: new URL('../../../../assets/pieces/cburnett/bp.svg', import.meta.url).toString()
};
