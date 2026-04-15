import { toValidSquare } from '../board/coords';
import { normalizeRolePromotion } from '../board/types/normalize';
import { MoveDestination, MoveDestinationInput } from '../interaction/types';

export function normalizeMoveDestinationInput(destination: MoveDestinationInput): MoveDestination {
	return {
		to: toValidSquare(destination.to),
		...(destination.capturedSquare && {
			capturedSquare: toValidSquare(destination.capturedSquare)
		}),
		...(destination.secondary && {
			secondary: {
				from: toValidSquare(destination.secondary.from),
				to: toValidSquare(destination.secondary.to)
			}
		}),
		...(destination.promotedTo && {
			promotedTo: destination.promotedTo.map(normalizeRolePromotion)
		})
	};
}
