import { describe, expect, it } from 'vitest';
import { normalizeMainRendererConfig } from '../../../../src/extensions/first-party/main-renderer/normalize.js';
import { DEFAULT_MAIN_RENDERER_CONFIG } from '../../../../src/extensions/first-party/main-renderer/types/internal.js';

describe('normalizeMainRendererConfig', () => {
	it('returns default config when input is empty', () => {
		const config = normalizeMainRendererConfig({});
		expect(config.colors).toEqual(DEFAULT_MAIN_RENDERER_CONFIG.colors);
		expect(config.pieceUrls).toEqual(DEFAULT_MAIN_RENDERER_CONFIG.pieceUrls);
	});

	it('overrides colors when provided', () => {
		const customColors = {
			board: { light: '#fff', dark: '#000' },
			coordinates: { light: '#aaa', dark: '#333' }
		};
		const config = normalizeMainRendererConfig({ colors: customColors });
		expect(config.colors).toEqual(customColors);
		expect(config.pieceUrls).toEqual(DEFAULT_MAIN_RENDERER_CONFIG.pieceUrls);
	});

	it('normalizes pieceUrls from string keys to numeric piece code keys', () => {
		const pieceUrls = {
			wK: '/wK.svg',
			wQ: '/wQ.svg',
			wR: '/wR.svg',
			wB: '/wB.svg',
			wN: '/wN.svg',
			wP: '/wP.svg',
			bK: '/bK.svg',
			bQ: '/bQ.svg',
			bR: '/bR.svg',
			bB: '/bB.svg',
			bN: '/bN.svg',
			bP: '/bP.svg'
		};
		const config = normalizeMainRendererConfig({ pieceUrls });
		const urls = Object.values(config.pieceUrls);
		expect(urls).toHaveLength(12);
		expect(urls).toContain('/wK.svg');
		expect(urls).toContain('/bP.svg');
	});

	it('throws when pieceUrls is provided but incomplete', () => {
		const incompletePieceUrls = {
			wK: '/wK.svg',
			wQ: '/wQ.svg'
		};
		expect(() =>
			normalizeMainRendererConfig({ pieceUrls: incompletePieceUrls as never })
		).toThrow();
	});
});
