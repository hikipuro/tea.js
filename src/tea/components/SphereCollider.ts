import * as Tea from "../Tea";
import { Collider } from "./Collider";

export class SphereCollider extends Collider {
	center: Tea.Vector3;
	radius: number;

	constructor(app: Tea.App) {
		super(app);
		this.center = new Tea.Vector3();
		this.radius = 0.0;
	}

	get worldCenter(): Tea.Vector3 {
		var object3d = this.object3d;
		if (object3d == null) {
			return this.center;
		}
		var center = this.center.clone();
		return center.add$(object3d.position);
	}

	closestPoint(point: Tea.Vector3): Tea.Vector3 {
		if (point == null) {
			return null;
		}
		var center = this.worldCenter;
		var v = point.sub(center);
		v.normalize$();
		v.mul$(this.radius);
		return v.add(center);
	}

	toString(): string {
		return Tea.StringUtil.format(
			"{ center: {0}, radius: {1} }",
			this.center.toString(),
			this.radius.toString()
		);
	}

	toJSON(): Object {
		var json = super.toJSON();
		Object.assign(json, {
			_type: "SphereCollider",
			center: this.center,
			radius: this.radius
		});
		return json;
	}

	static fromJSON(app: Tea.App, json: any): SphereCollider {
		if (json == null || json._type !== "SphereCollider") {
			return null;
		}
		var collider = new SphereCollider(app);
		collider.enabled = json.enabled;
		collider.center = Tea.Vector3.fromArray(json.center);
		collider.radius = parseFloat(json.radius);
		return collider;
	}

	hitTestSphere(sphere: SphereCollider): boolean {
		if (sphere == null) {
			return false;
		}
		var c0 = this.worldCenter;
		var c1 = sphere.worldCenter;
		var d = c0.distance(c1);
		return d <= (this.radius + sphere.radius);
	}

	hitTestBox(box: Tea.BoxCollider): boolean {
		if (box == null) {
			return false;
		}
		var center = this.worldCenter;
		var point = box.closestPoint(center);
		if (point == null) {
			return false;
		}
		var d = center.distance(point);
		return d <= this.radius;
	}
}
