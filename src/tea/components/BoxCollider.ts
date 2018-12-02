import * as Tea from "../Tea";
import { Collider } from "./Collider";

export class BoxCollider extends Collider {
	center: Tea.Vector3;
	size: Tea.Vector3;

	constructor(app: Tea.App) {
		super(app);
		this.center = new Tea.Vector3();
		this.size = new Tea.Vector3();
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
		var result = new Tea.Vector3();
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
		for (var i = 0; i < 3; i++) {
			var length = Math.abs(extents[i]);
			if (length <= 0) {
				continue;
			}
			var p1 = directions[i];
			var s = p0.dot(p1) / length;
			s = Math.abs(s);
			if (s > 1.0) {
				p1.mul$(length);
				p1.mul$(1.0 - s);
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

	hitTestRay(ray: Tea.Ray): boolean {
		var r = this.object3d.rotation.inversed;
		var p = ray.origin.clone();
		p.sub$(this.object3d.position);
		p.applyQuaternion(r);
		var d = ray.direction.clone();
		d.applyQuaternion(r);
		
		var extents = this.extents;
		var center = this.center;
		var min = center.sub(extents);
		var max = center.add(extents);
		var early = -Number.MAX_VALUE;
		var late = Number.MAX_VALUE;

		for (var i = 0; i < 3; i++) {
			if (d[i] === 0) {
				continue;
			}
			var id = 1.0 / d[i];
			var near = (min[i] - p[i]) * id;
			var far = (max[i] - p[i]) * id;
			if (near > far) {
				var tmp = near;
				near = far;
				far = tmp;
			}
			if (near > early) {
				early = near;
			}
			if (far < late) {
				late = far;
			}
			if (early > late) {
				return false;
			}
		}
		/*
		console.log("late",early,late);
		if (early > 10.0) {
			return false;
		}
		*/
		return true;
	}

	hitTestBox(box: BoxCollider): boolean {
		if (box == null) {
			return false;
		}
		var ao = this.object3d;
		var bo = box.object3d;
		var ae = this.size.mul(0.5).scale(ao.scale);
		var be = box.size.mul(0.5).scale(bo.scale);
		var ax = ao.right, axl = ax.mul(ae.x);
		var ay = ao.up, ayl = ay.mul(ae.y);
		var az = ao.forward, azl = az.mul(ae.z);
		var bx = bo.right, bxl = bx.mul(be.x);
		var by = bo.up, byl = by.mul(be.y);
		var bz = bo.forward, bzl = bz.mul(be.z);
		var distance = ao.position.sub(bo.position);

		// separating axis: ax
		var a = axl.magnitude;
		var b = this.lenSegOnSeparateAxis(ax, bxl, byl, bzl);
		var d = Math.abs(distance.dot(ax));
		if (d > a + b) {
			return false;
		}

		// separating axis: ay
		a = ayl.magnitude;
		b = this.lenSegOnSeparateAxis(ay, bxl, byl, bzl);
		d = Math.abs(distance.dot(ay));
		if (d > a + b) {
			return false;
		}

		// separating axis: az
		a = azl.magnitude;
		b = this.lenSegOnSeparateAxis(az, bxl, byl, bzl);
		d = Math.abs(distance.dot(az));
		if (d > a + b) {
			return false;
		}

		// separating axis: bx
		a = bxl.magnitude;
		b = this.lenSegOnSeparateAxis(bx, axl, ayl, azl);
		d = Math.abs(distance.dot(bx));
		if (d > a + b) {
			return false;
		}

		// separating axis: by
		a = byl.magnitude;
		b = this.lenSegOnSeparateAxis(by, axl, ayl, azl);
		d = Math.abs(distance.dot(by));
		if (d > a + b) {
			return false;
		}

		// separating axis: bz
		a = bzl.magnitude;
		b = this.lenSegOnSeparateAxis(bz, axl, ayl, azl);
		d = Math.abs(distance.dot(bz));
		if (d > a + b) {
			return false;
		}

		// separating axis: ax, bx
		var cross = ax.cross(bx);
		a = this.lenSegOnSeparateAxis(cross, ayl, azl);
		b = this.lenSegOnSeparateAxis(cross, byl, bzl);
		d = Math.abs(distance.dot(cross));
		if (d > a + b) {
			return false;
		}

		// separating axis: ax, by
		cross = ax.cross(by);
		a = this.lenSegOnSeparateAxis(cross, ayl, azl);
		b = this.lenSegOnSeparateAxis(cross, bxl, bzl);
		d = Math.abs(distance.dot(cross));
		if (d > a + b) {
			return false;
		}

		// separating axis: ax, bz
		cross = ax.cross(bz);
		a = this.lenSegOnSeparateAxis(cross, ayl, azl);
		b = this.lenSegOnSeparateAxis(cross, bxl, byl);
		d = Math.abs(distance.dot(cross));
		if (d > a + b) {
			return false;
		}

		// separating axis: ay, bx
		cross = ay.cross(bx);
		a = this.lenSegOnSeparateAxis(cross, axl, azl);
		b = this.lenSegOnSeparateAxis(cross, byl, bzl);
		d = Math.abs(distance.dot(cross));
		if (d > a + b) {
			return false;
		}

		// separating axis: ay, by
		cross = ay.cross(by);
		a = this.lenSegOnSeparateAxis(cross, axl, azl);
		b = this.lenSegOnSeparateAxis(cross, bxl, bzl);
		d = Math.abs(distance.dot(cross));
		if (d > a + b) {
			return false;
		}

		// separating axis: ay, bz
		cross = ay.cross(bz);
		a = this.lenSegOnSeparateAxis(cross, axl, azl);
		b = this.lenSegOnSeparateAxis(cross, bxl, byl);
		d = Math.abs(distance.dot(cross));
		if (d > a + b) {
			return false;
		}

		// separating axis: az, bx
		cross = az.cross(bx);
		a = this.lenSegOnSeparateAxis(cross, axl, ayl);
		b = this.lenSegOnSeparateAxis(cross, byl, bzl);
		d = Math.abs(distance.dot(cross));
		if (d > a + b) {
			return false;
		}

		// separating axis: az, by
		cross = az.cross(by);
		a = this.lenSegOnSeparateAxis(cross, axl, ayl);
		b = this.lenSegOnSeparateAxis(cross, bxl, bzl);
		d = Math.abs(distance.dot(cross));
		if (d > a + b) {
			return false;
		}

		// separating axis: az, bz
		cross = az.cross(bz);
		a = this.lenSegOnSeparateAxis(cross, axl, ayl);
		b = this.lenSegOnSeparateAxis(cross, bxl, byl);
		d = Math.abs(distance.dot(cross));
		if (d > a + b) {
			return false;
		}

		return true;
	}
	
	protected lenSegOnSeparateAxis(sep: Tea.Vector3, e1: Tea.Vector3, e2: Tea.Vector3, e3?: Tea.Vector3): number {
		var r1 = Math.abs(sep.dot(e1));
		var r2 = Math.abs(sep.dot(e2));
		var r3 = e3 != null ? Math.abs(sep.dot(e3)) : 0.0;
		return r1 + r2 + r3;
	}
}
