import { RenderGeometry } from '../../../layout/geometry/types';
import { InteractionController } from '../controller/types';

export interface InputAdapterInitOptions {
	element: HTMLElement;
	getGeometry: () => RenderGeometry | null;
	controller: InteractionController;
}

export interface InputAdapter {
	destroy(): void;
}
