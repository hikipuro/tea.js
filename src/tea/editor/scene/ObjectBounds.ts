import * as Tea from "../../Tea";

export class ObjectBounds {
	object3d: Tea.Object3D;
	renderer: Tea.LineRenderer;

	constructor(app: Tea.App) {
		this.object3d = app.createLineRenderer();
		this.renderer = this.object3d.getComponent(Tea.LineRenderer);
		var renderer = this.renderer;
		renderer.material.color.set(1, 0, 0, 0.5);
	}

	clearLines(): void {
		this.renderer.clear();
	}

	setObject(object3d: Tea.Object3D): void {
		if (object3d == null) {
			this.clearLines();
			return;
		}
		var meshRenderer = object3d.getComponent(Tea.MeshRenderer);
		if (meshRenderer == null) {
			this.clearLines();
			return;
		}
		var bounds = meshRenderer.bounds;
		var renderer = this.renderer;
		renderer.clear();
		if (bounds == null) {
			renderer.update();
			return;
		}

		var points = [];
		for (var i = 0; i < 8; i++) {
			points.push(bounds.getPoint(i));
		}

		renderer.add(points[0]);
		renderer.add(points[1]);
		renderer.add(points[1]);
		renderer.add(points[3]);
		renderer.add(points[3]);
		renderer.add(points[2]);
		renderer.add(points[2]);
		renderer.add(points[0]);

		renderer.add(points[4]);
		renderer.add(points[5]);
		renderer.add(points[5]);
		renderer.add(points[7]);
		renderer.add(points[7]);
		renderer.add(points[6]);
		renderer.add(points[6]);
		renderer.add(points[4]);

		renderer.add(points[0]);
		renderer.add(points[4]);
		renderer.add(points[1]);
		renderer.add(points[5]);
		renderer.add(points[2]);
		renderer.add(points[6]);
		renderer.add(points[3]);
		renderer.add(points[7]);
		renderer.update();
	}
}
