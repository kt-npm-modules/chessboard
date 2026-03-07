/**
 * Asset resolution helpers for renderer.
 * Consumers/bundlers (Vite/SvelteKit/Webpack) will transform import.meta.url + new URL(...).
 */

/**
 * Resolve the packaged Cburnett chess piece sprite URL.
 * The relative path is computed from the compiled dist file location.
 *
 * Package layout (published):
 * - dist/index.js
 * - assets/pieces/cburnett/pieces.svg
 *
 * Using ../assets/... from dist/ ensures the correct relative URL.
 */
export function cburnettSpriteUrl(): string {
	return new URL('../assets/pieces/cburnett/pieces.svg', import.meta.url).toString();
}
