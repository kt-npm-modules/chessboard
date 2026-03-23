export type InteractionStateMutationCause =
	| 'interaction.state.setSelectedSquare'
	| 'interaction.state.setDestinations'
	| 'interaction.state.setDragSession'
	| 'interaction.state.setCurrentTarget'
	| 'interaction.state.setReleaseTargetingActive'
	| 'interaction.state.clear'
	| 'interaction.state.clearActive';
