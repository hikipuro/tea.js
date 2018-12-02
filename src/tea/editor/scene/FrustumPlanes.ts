import * as Tea from "../../Tea";

export class FrustumPlanes {
	object3d: Tea.Object3D;
	renderer: Tea.LineRenderer;
	camera: Tea.Camera;
	planes: Array<Tea.Plane>;

	constructor(app: Tea.App) {
		this.object3d = app.createLineRenderer();
		//this.object3d.rotate(0, 180, 0);
		this.renderer = this.object3d.getComponent(Tea.LineRenderer);
		var renderer = this.renderer;
		renderer.material.color.set(1, 0, 1, 0.5);
	}

	setCamera(object3d: Tea.Object3D): void {
		if (object3d == null) {
			this.camera = null;
			this.planes = null;
			this.clearLines();
			return;
		}
		this.camera = object3d.getComponent(Tea.Camera);
		if (this.camera == null) {
			this.planes = null;
			this.clearLines();
			return;
		}
		this.camera.updateMatrix();
		this.planes = Tea.GeometryUtil.calculateFrustumPlanes(this.camera);
		this.drawLines();
	}

	clearLines(): void {
		this.renderer.clear();
	}

	drawLine(ip1: Tea.Plane, ip2: Tea.Plane, p1: Tea.Plane, p2: Tea.Plane): void {
		var line = ip1.intersectPlane(ip2);
		if (line == null) {
			return;
		}
		var point1 = p1.intersectLine(line);
		var point2 = p2.intersectLine(line);
		this.renderer.add(point1);
		this.renderer.add(point2);
	}

	drawLines(): void {
		var planes = this.planes;
		var renderer = this.renderer;
		if (planes == null) {
			renderer.clear();
			return;
		}
		renderer.clear();
		
		var left = planes[0];
		var right = planes[1];
		var bottom = planes[2];
		var top = planes[3];
		var near = planes[4];
		var far = planes[5];

		this.drawLine(near, left, top, bottom);
		this.drawLine(near, right, top, bottom);
		this.drawLine(near, top, left, right);
		this.drawLine(near, bottom, left, right);

		this.drawLine(far, left, top, bottom);
		this.drawLine(far, right, top, bottom);
		this.drawLine(far, top, left, right);
		this.drawLine(far, bottom, left, right);

		this.drawLine(left, top, near, far);
		this.drawLine(left, bottom, near, far);

		this.drawLine(right, top, near, far);
		this.drawLine(right, bottom, near, far);
		renderer.update();
	}
}
