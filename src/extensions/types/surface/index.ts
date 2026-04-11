import { ExtensionRuntimeSurfaceCommands } from './commands';
import { ExtensionRuntimeSurfaceEvents } from './events';
import { ExtensionRuntimeSurfaceTransientVisuals } from './transient-visuals';

export interface ExtensionRuntimeSurface {
	readonly commands: ExtensionRuntimeSurfaceCommands;
	readonly events: ExtensionRuntimeSurfaceEvents;
	readonly transientVisuals: ExtensionRuntimeSurfaceTransientVisuals;
}
