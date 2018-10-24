import * as Tea from "../Tea";

export class SceneGrid {
	object3d: Tea.Object3D;
	renderer: Tea.LineRenderer;

	constructor(app: Tea.App) {
		this.object3d = app.createLineRenderer();
		this.renderer = this.object3d.getComponent(Tea.LineRenderer);
		var renderer = this.renderer;
		renderer.material.color.set(1, 1, 1, 0.5);

		var size = 50;
		var step = 2;
		for (var i = -size; i <= size; i += step) {
			renderer.add(-size, 0, i);
			renderer.add( size, 0, i);

			renderer.add(i, 0, -size);
			renderer.add(i, 0,  size);
		}
	}
}
