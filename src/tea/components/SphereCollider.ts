import * as Tea from "../Tea";
import { Collider } from "./Collider";

export class SphereCollider extends Collider {
	center: Tea.Vector3;
	radius: number;

	constructor(app: Tea.App) {
		super(app);
		this.center = new Tea.Vector3();
		this.radius = 0.5;
	}

	get worldCenter(): Tea.Vector3 {
		var object3d = this.object3d;
		var center = this.center.clone();
		if (object3d == null) {
			return center;
		}
		center.applyQuaternion(object3d.rotation);
		return center.add$(object3d.position);
	}

	containsPoint(point: Tea.Vector3): boolean {
		if (point == null) {
			return false;
		}
		var center = this.worldCenter;
		var d = center.distance(point);
		return d <= this.radius;
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

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (json == null || json._type !== "SphereCollider") {
			callback(null);
			return;
		}
		var collider = new SphereCollider(app);
		collider.enabled = json.enabled;
		collider.center = Tea.Vector3.fromArray(json.center);
		collider.radius = parseFloat(json.radius);
		callback(collider);
	}
}
