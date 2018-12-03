import * as Tea from "../Tea";
import { Collider } from "./Collider";

export class BoxCollider extends Collider {
	center: Tea.Vector3;
	size: Tea.Vector3;

	constructor(app: Tea.App) {
		super(app);
		this.center = new Tea.Vector3();
		this.size = Tea.Vector3.one.clone();
	}

	//get bounds(): Tea.Bounds {
	//}

	get worldCenter(): Tea.Vector3 {
		var object3d = this.object3d;
		var center = this.center.clone();
		if (object3d == null) {
			return center;
		}
		center.applyQuaternion(object3d.rotation);
		return center.add$(object3d.position);
	}

	get extents(): Tea.Vector3 {
		var object3d = this.object3d;
		var extents = this.size.clone();
		extents.mul$(0.5);
		if (object3d == null) {
			return extents;
		}
		return extents.scale$(object3d.scale);
	}

	closestPoint(point: Tea.Vector3): Tea.Vector3 {
		if (point == null) {
			return null;
		}
		var object3d = this.object3d;
		var center = this.worldCenter;
		var extents = this.extents;
		var directions = null;
		if (object3d == null) {
			directions = [
				Tea.Vector3.right.clone(),
				Tea.Vector3.up.clone(),
				Tea.Vector3.forward.clone()
			];
		} else {
			directions = [
				object3d.right,
				object3d.up,
				object3d.forward
			];
		}
		var p0 = point.sub(center);
		var result = point.clone();
		for (var i = 0; i < 3; i++) {
			var length = Math.abs(extents[i]);
			if (length <= 0) {
				continue;
			}
			var p1 = directions[i];
			var s = p0.dot(p1) / length;
			if (s > 1.0) {
				p1.mul$((1.0 - s) * length);
				result.add$(p1);
			} else if (s < -1.0) {
				p1.mul$(-(1.0 + s) * length);
				result.add$(p1);
			}
		}
		return result;
	}

	raycast(ray: Tea.Ray, hitInfo: Tea.RaycastHit, maxDistance: number): boolean {
		return false;
	}

	toString(): string {
		return Tea.StringUtil.format(
			"{ center: {0}, size: {1} }",
			this.center.toString(),
			this.size.toString()
		);
	}

	toJSON(): Object {
		var json = super.toJSON();
		Object.assign(json, {
			_type: "BoxCollider",
			center: this.center,
			size: this.size
		});
		return json;
	}

	static fromJSON(app: Tea.App, json: any): BoxCollider {
		if (json == null || json._type !== "BoxCollider") {
			return null;
		}
		var boxCollider = new BoxCollider(app);
		boxCollider.enabled = json.enabled;
		boxCollider.center = Tea.Vector3.fromArray(json.center);
		boxCollider.size = Tea.Vector3.fromArray(json.size);
		return boxCollider;
	}
}
