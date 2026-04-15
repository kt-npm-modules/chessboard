import { ColorCode, PieceCode, RoleCode, RolePromotionCode } from './types/internal';

export function toPieceCode(role: RoleCode | RolePromotionCode, color: ColorCode): PieceCode {
	return color + role;
}

export function fromPieceCode(code: PieceCode): [RoleCode, ColorCode] {
	if (code <= PieceCode.Empty) {
		throw new RangeError(`Invalid piece code: ${code}`);
	}
	const color = code >= ColorCode.Black ? ColorCode.Black : ColorCode.White;
	const role = color === ColorCode.Black ? code - ColorCode.Black : code;
	return [role as RoleCode, color];
}
