import type {
	ExtensionUpdateContext,
	ExtensionUpdateContextCommon,
	ExtensionUpdateContextCommonMounted,
	ExtensionUpdateContextMounted,
	RenderFrameSnapshot,
	UpdateFrameSnapshot,
	UpdateFrameSnapshotMounted
} from './types';

export function isFrameMounted<T extends UpdateFrameSnapshot>(
	frame: T
): frame is T & UpdateFrameSnapshotMounted {
	return frame.isMounted;
}

export function isFrameRenderable<T extends UpdateFrameSnapshot>(
	frame: T
): frame is T & RenderFrameSnapshot {
	return frame.isMounted && frame.layout.geometry !== null;
}

export function isUpdateContextCommonMounted<T extends ExtensionUpdateContextCommon>(
	context: T
): context is T & ExtensionUpdateContextCommonMounted {
	return isFrameMounted(context.currentFrame);
}

export function isUpdateContextMounted<T extends ExtensionUpdateContext>(
	context: T
): context is T & ExtensionUpdateContextMounted {
	return isFrameMounted(context.currentFrame);
}

export function isUpdateContextRenderable<T extends ExtensionUpdateContext>(
	context: T
): context is T & ExtensionUpdateContextMounted & { currentFrame: RenderFrameSnapshot } {
	return isFrameRenderable(context.currentFrame);
}
