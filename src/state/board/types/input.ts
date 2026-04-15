import { TMoveRequest } from './template';

export type Color = 'white' | 'black';
export type ColorShort = 'w' | 'b';
export type ColorInput = Color | ColorShort;

export type Role = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
export type RoleShort = 'p' | 'N' | 'B' | 'R' | 'Q' | 'K';
export type RoleInput = Role | RoleShort;
export type RolePromotion = Exclude<Role, 'king' | 'pawn'>;
export type RolePromotionShort = Exclude<RoleShort, 'p' | 'K'>;
export type RolePromotionInput = RolePromotion | RolePromotionShort;

// Algebraic squares like 'e4'. Use template literal types to avoid listing all 64.
export type FileChar = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export type RankChar = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type SquareString = `${FileChar}${RankChar}`;

export interface Piece {
	color: Color;
	role: Role;
}

export interface PieceShort {
	color: ColorShort;
	role: RoleShort;
}

export type PieceString = `${ColorShort}${RoleShort}`;

export type PieceInput = Piece | PieceShort | PieceString;

export type MoveRequestInput = TMoveRequest<SquareString, RolePromotionInput>;

// Position map acceptance forms (public inputs)
// Long/canonical
export type PositionMap = Partial<Record<SquareString, Piece>>;
// Short/alias
export type PositionMapShort = Partial<Record<SquareString, PieceShort>>;
export type PositionMapString = Partial<Record<SquareString, PieceString>>;
export type PositionInput = 'start' | PositionMap | PositionMapShort | PositionMapString;
