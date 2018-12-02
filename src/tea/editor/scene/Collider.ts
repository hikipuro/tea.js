import * as Tea from "../../Tea";

export class Collider {
	object3d: Tea.Object3D;
	renderer: Tea.LineRenderer;
	collider: Tea.Collider;

	constructor(app: Tea.App) {
		this.object3d = app.createLineRenderer();
		this.renderer = this.object3d.getComponent(Tea.LineRenderer);
		var renderer = this.renderer;
		renderer.material.color.set(0, 1, 0, 0.5);
	}

	setObject(object3d: Tea.Object3D): void {
		if (object3d == null || object3d.isActive === false) {
			this.collider = null;
			this.clearLines();
			return;
		}
		this.collider = object3d.getComponent(Tea.BoxCollider);
		if (this.collider == null || this.collider.enabled === false) {
			this.clearLines();
			return;
		}
		this.drawLines();
	}

	clearLines(): void {
		this.renderer.clear();
	}

	drawLines(): void {
		var collider = this.collider;
		var renderer = this.renderer;
		if (collider == null) {
			renderer.clear();
			return;
		}
		renderer.clear();

		if (collider instanceof Tea.BoxCollider) {
			this.drawBoxCollider();
		}
		renderer.update();
	}

	drawLine(p1: Tea.Vector3, p2: Tea.Vector3): void {
		var renderer = this.renderer;
		renderer.add(p1);
		renderer.add(p2);
	}

	drawBoxCollider(): void {
		var renderer = this.renderer;
		var collider = this.collider as Tea.BoxCollider;
		var rotation = collider.object3d.rotation;

		var center = collider.worldCenter;
		var extents = collider.extents;
		var x = extents[0];
		var y = extents[1];
		var z = extents[2];

		var points = [
			[  1,  1, -1 ], [  1, -1, -1 ],
			[  1,  1,  1 ], [  1, -1,  1 ],
			[ -1,  1, -1 ], [ -1, -1, -1 ],
			[ -1,  1,  1 ], [ -1, -1,  1 ],

			[  1,  1, -1 ], [ -1,  1, -1 ],
			[  1,  1,  1 ], [ -1,  1,  1 ],
			[  1, -1, -1 ], [ -1, -1, -1 ],
			[  1, -1,  1 ], [ -1, -1,  1 ],

			[  1,  1,  1 ], [  1,  1, -1 ],
			[  1, -1,  1 ], [  1, -1, -1 ],
			[ -1,  1,  1 ], [ -1,  1, -1 ],
			[ -1, -1,  1 ], [ -1, -1, -1 ],
		]

		for (var i = 0; i < points.length; i += 2) {
			var p1 = points[i];
			var p2 = points[i + 1];
			var point1 = new Tea.Vector3(
				x * p1[0], y * p1[1], z * p1[2]
			);
			var point2 = new Tea.Vector3(
				x * p2[0], y * p2[1], z * p2[2]
			);
			point1.applyQuaternion(rotation);
			point2.applyQuaternion(rotation);
			point1[2] = -point1[2];
			point2[2] = -point2[2];
			this.drawLine(
				center.add(point1),
				center.add(point2)
			);
		}
		
		//console.log(point1, point2);
		renderer.update();
	}
}
