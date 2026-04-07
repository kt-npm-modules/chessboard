import { ExtensionRecordInternal } from '../extensions/types';
import { mergeReadonlySessions } from '../mutation/session';
import { createExtensionAnimationController } from './animation/factory';
import { createExtensionInvalidationState } from './invalidation/factory';
import { renderMount, renderUnmount } from './mount';
import { performAnimationPass } from './rendering/animation';
import { validateIsMounted } from './rendering/helpers';
import { performRenderStatePass } from './rendering/state';
import { performRenderVisualsPass } from './rendering/visuals';
import { createScheduler } from './scheduler/scheduler';
import { allocateExtensionSlotRoots, createSvgRoots } from './svg/factory';
import {
	Render,
	RenderAnimationRequest,
	RenderInitOptions,
	RenderInitOptionsInternal,
	RenderInternal,
	RenderStateRequest,
	RenderVisualsRequest
} from './types';

function createRenderInternal(options: RenderInitOptionsInternal): RenderInternal {
	const svgRoots = createSvgRoots(options);

	const scheduler = createScheduler({
		render: options.performRender
	});

	const extensions = new Map<string, ExtensionRecordInternal>();
	for (const extensionDraft of options.extensionsDraft.values()) {
		const extensionInternal: ExtensionRecordInternal = {
			...extensionDraft,
			render: {
				slots: allocateExtensionSlotRoots(svgRoots, extensionDraft.definition.slots),
				invalidation: createExtensionInvalidationState(),
				animation: createExtensionAnimationController()
			}
		};
		extensions.set(extensionDraft.id, extensionInternal);
	}

	return {
		container: null,
		lastRenderedState: null,
		svgRoots,
		scheduler,
		extensions,
		callbacks: options.callbacks
	};
}

interface PerformRenderOptions {
	stateRequest: RenderStateRequest | null;
	animationRequest: RenderAnimationRequest | null;
	requestNextRenderAnimation: (request: RenderAnimationRequest | null) => void;
	visualsRequest: RenderVisualsRequest | null;
}

function performRender(state: RenderInternal, options: PerformRenderOptions) {
	// First we check and run renderState,
	if (options.stateRequest) {
		performRenderStatePass(state, options.stateRequest);
		if (!state.lastRenderedState) {
			throw new Error('After renderState, lastRenderedState context should be set');
		}
		state.callbacks.renderStatePassed(options.stateRequest, state.lastRenderedState);
	}

	// Then we check and run renderAnimation,
	if (options.animationRequest) {
		const nextRequest = performAnimationPass(state, options.animationRequest);
		options.requestNextRenderAnimation(nextRequest);
	}

	// Finally we run renderVisuals.
	if (options.visualsRequest) {
		performRenderVisualsPass(state, options.visualsRequest);
		if (!state.lastRenderedState) {
			throw new Error('After renderVisuals, lastRenderedState context should be set');
		}
		state.callbacks.renderVisualsPassed(options.visualsRequest, state.lastRenderedState);
	}
}

export function createRender(options: RenderInitOptions): Render {
	let pendingStateRequest: RenderStateRequest | null = null;
	let pendingAnimationRequest: RenderAnimationRequest | null = null;
	let pendingVisualsRequest: RenderVisualsRequest | null = null;

	function performRenderClosure() {
		const stateRequest = pendingStateRequest;
		pendingStateRequest = null;
		const animationRequest = pendingAnimationRequest;
		pendingAnimationRequest = null;
		const visualsRequest = pendingVisualsRequest;
		pendingVisualsRequest = null;
		performRender(internalState, {
			stateRequest: stateRequest,
			animationRequest: animationRequest,
			requestNextRenderAnimation: (request) => {
				if (request) {
					pendingAnimationRequest = request;
					internalState.scheduler.schedule();
				}
			},
			visualsRequest: visualsRequest
		});
	}

	const internalState = createRenderInternal({
		...options,
		performRender: performRenderClosure
	});

	return {
		extensions: internalState.extensions,
		requestRenderState(request) {
			validateIsMounted(internalState);
			pendingStateRequest = {
				...request,
				mutation: pendingStateRequest?.mutation
					? mergeReadonlySessions([pendingStateRequest.mutation, request.mutation])
					: request.mutation
			};
			internalState.scheduler.schedule();
		},
		requestRenderAnimation(request) {
			validateIsMounted(internalState);
			pendingAnimationRequest = request;
			internalState.scheduler.schedule();
		},
		requestRenderVisuals(request) {
			validateIsMounted(internalState);
			pendingVisualsRequest = {
				...request,
				mutation: pendingVisualsRequest?.mutation
					? mergeReadonlySessions([pendingVisualsRequest.mutation, request.mutation])
					: request.mutation
			};
			internalState.scheduler.schedule();
		},
		mount(element) {
			renderMount(internalState, element);
		},
		unmount() {
			renderUnmount(internalState);
			pendingStateRequest = null;
			pendingAnimationRequest = null;
			pendingVisualsRequest = null;
		},
		get isMounted() {
			return internalState.container !== null;
		}
	};
}
