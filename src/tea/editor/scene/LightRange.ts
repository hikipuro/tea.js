import * as Tea from "../../Tea";

export class LightRange {
	object3d: Tea.Object3D;
	renderer: Tea.LineRenderer;
	light: Tea.Light;

	constructor(app: Tea.App) {
		this.object3d = app.createLineRenderer();
		this.renderer = this.object3d.getComponent(Tea.LineRenderer);
		var renderer = this.renderer;
		renderer.material.color.set(1, 0, 1, 0.5);
	}

	setLight(object3d: Tea.Object3D): void {
		if (object3d == null) {
			this.light = null;
			this.clearLines();
			return;
		}
		this.light = object3d.getComponent(Tea.Light);
		if (this.light == null) {
			this.clearLines();
			return;
		}
		//this.light.update();
		this.drawLines();
	}

	clearLines(): void {
		this.renderer.clear();
	}

	drawLines(): void {
		var light = this.light;
		var renderer = this.renderer;
		if (light == null) {
			renderer.clear();
			return;
		}
		renderer.clear();
		
		switch (light.type) {
			case Tea.LightType.Directional:
				this.drawDirectionalLight();
				break;
			case Tea.LightType.Point:
				this.drawPointLight();
				break;
			case Tea.LightType.Spot:
				this.drawSpotLight();
				break;
		}
		renderer.update();
	}

	drawDirectionalLight(): void {
		var renderer = this.renderer;
		var light = this.light;
		var object3d = light.object3d;
		renderer.material.color.copy(light.color);

		var directions = [
			object3d.right,
			object3d.up,
			object3d.right.mul(-1),
			object3d.up.mul(-1)
		];

		for (var i = 0; i < 4; i++) {
			var point1 = object3d.position.clone();
			var d = directions[i];
			point1.add$(d);
			var forward = object3d.forward;
			var point2 = point1.add(forward);
			renderer.add(point1);
			renderer.add(point2);
		}

		var center = object3d.position.clone();
		var direction = light.direction.clone();
		var rotation = Tea.Quaternion.fromToRotation(
			new Tea.Vector3(0, 0, 1), direction
		);
		this.drawCircle(center, 1.0, rotation);
	}

	drawPointLight(): void {
		var renderer = this.renderer;
		var light = this.light;
		var object3d = light.object3d;
		renderer.material.color.copy(light.color);

		var center = object3d.position;
		var range = light.range;
		//var rotation = object3d.rotation;
		var rotation = Tea.Quaternion.identity;
		this.drawCircle(center, range, rotation);
		//rotation = object3d.rotation.clone();
		//rotation.rotateEuler(90, 0, 0);
		rotation = Tea.Quaternion.euler(90, 0, 0);
		this.drawCircle(center, range, rotation);
		//rotation = object3d.rotation.clone();
		//rotation.rotateEuler(0, 90, 0);
		rotation = Tea.Quaternion.euler(0, 90, 0);
		this.drawCircle(center, range, rotation);
	}

	drawSpotLight(): void {
		var renderer = this.renderer;
		var light = this.light;
		var object3d = light.object3d;
		renderer.material.color.copy(light.color);

		var directions = [
			object3d.right,
			object3d.up,
			object3d.right.mul(-1),
			object3d.up.mul(-1)
		];

		var point1 = object3d.position.clone();
		var angle = light.spotAngle * Math.PI / 360.0;
		var range = light.range;
		var radius = Math.tan(angle) * range;
		var forward = object3d.forward.mul$(-1);
		for (var i = 0; i < 4; i++) {
			var point2 = point1.sub(forward.mul(light.range));
			var d = directions[i];
			point2.add$(d.mul(radius));
			renderer.add(point1);
			renderer.add(point2);
		}

		var center = object3d.position.clone();
		center.add$(object3d.forward.mul(light.range));
		var direction = light.direction.clone();
		var rotation = Tea.Quaternion.fromToRotation(
			new Tea.Vector3(0, 0, 1), direction
		);
		this.drawCircle(center, radius, rotation);
	}

	drawCircle(center: Tea.Vector3, radius: number, rotation: Tea.Quaternion): void {
		var renderer = this.renderer;
		var s = 32;
		var p = new Tea.Vector3(radius, 0, 0);
		p.applyQuaternion(rotation);
		p = p.add(center);
		renderer.add(p);
		for (var i = 0; i <= s; i++) {
			var angle = i * 2.0 * Math.PI / s;
			var x = Math.cos(angle) * radius;
			var y = Math.sin(angle) * radius;
			var p = new Tea.Vector3(x, y, 0.0);
			p.applyQuaternion(rotation);
			p = p.add(center);
			renderer.add(p);
			if (i === s) {
				break;
			}
			renderer.add(p.clone());
		}
	}
}
