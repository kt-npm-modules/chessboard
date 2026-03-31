import type { MutationSession } from './types';

export function createMutationSession<
	PayloadByCause extends Record<string, unknown>
>(): MutationSession<PayloadByCause> {
	type MutationCause = keyof PayloadByCause;
	type MutationPayloads = PayloadByCause[MutationCause];
	const payloads = new Map<MutationCause, MutationPayloads[] | undefined>();

	return {
		addMutation<Cause extends keyof PayloadByCause>(
			cause: Cause,
			changed: boolean,
			...payload: PayloadByCause[Cause] extends undefined ? [] : [payload: PayloadByCause[Cause]]
		): boolean {
			if (!changed) {
				return false;
			}

			const hasPayload = payload.length > 0;
			if (payloads.has(cause)) {
				// We already have this cause recorded, just append payload if provided
				if (!hasPayload) return true;
				// We already have some payloads for this cause
				const existingPayloads = payloads.get(cause);
				if (existingPayloads) {
					existingPayloads.push(payload[0] as MutationPayloads);
					return true;
				}
				payloads.set(cause, [payload[0] as MutationPayloads]);
				return true;
			}

			// No existing entry for this cause, add new one
			payloads.set(cause, hasPayload ? [payload[0] as MutationPayloads] : undefined);
			return true;
		},

		hasChanges(): boolean {
			return payloads.size > 0;
		},

		hasMutation<Cause extends keyof PayloadByCause>(cause: Cause): boolean {
			return payloads.has(cause);
		},

		getPayloads<Cause extends keyof PayloadByCause>(
			cause: Cause
		): PayloadByCause[Cause][] | undefined {
			return payloads.get(cause) as PayloadByCause[Cause][] | undefined;
		},

		clear(): void {
			payloads.clear();
		}
	};
}
