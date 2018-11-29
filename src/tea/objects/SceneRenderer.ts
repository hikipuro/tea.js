import * as Tea from "../Tea";

export class SceneRenderer {
	scene: Tea.Scene;

	constructor(scene: Tea.Scene) {
		this.scene = scene;
	}

	render(renderers: Array<Tea.Renderer>, lights: Array<Tea.Light>) {
	}

	lockViewToSelected(object3d: Tea.Object3D): void {
	}
}
