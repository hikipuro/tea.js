import * as Tea from "../Tea";

export class HitTest {
	static boxRay(box: Tea.BoxCollider, ray: Tea.Ray): boolean {
		if (box == null || ray == null) {
			return false;
		}
		var r = box.object3d.rotation.inversed;
		var p = ray.origin.clone();
		p.subSelf(box.object3d.position);
		p.applyQuaternion(r);
		var d = ray.direction.clone();
		d.applyQuaternion(r);
		
		var extents = box.extents;
		var center = box.center;
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

	static boxBox(box1: Tea.BoxCollider, box2: Tea.BoxCollider): boolean {
		if (box1 == null || box2 == null) {
			return false;
		}
		var ao = box1.object3d;
		var bo = box2.object3d;
		var ae = box1.size.mul(0.5).scale(ao.scale);
		var be = box2.size.mul(0.5).scale(bo.scale);
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

	protected static lenSegOnSeparateAxis(sep: Tea.Vector3, e1: Tea.Vector3, e2: Tea.Vector3, e3?: Tea.Vector3): number {
		var r1 = Math.abs(sep.dot(e1));
		var r2 = Math.abs(sep.dot(e2));
		var r3 = e3 != null ? Math.abs(sep.dot(e3)) : 0.0;
		return r1 + r2 + r3;
	}

	static sphereSphere(sphere1: Tea.SphereCollider, sphere2: Tea.SphereCollider): boolean {
		if (sphere1 == null || sphere2 == null) {
			return false;
		}
		var c0 = sphere1.worldCenter;
		var c1 = sphere2.worldCenter;
		var d = c0.distance(c1);
		return d <= (sphere1.radius + sphere2.radius);
	}

	static boxSphere(box: Tea.BoxCollider, sphere: Tea.SphereCollider): boolean {
		if (box == null || sphere == null) {
			return false;
		}
		var center = sphere.worldCenter;
		if (box.containsPoint(center)) {
			return true;
		}
		var point = box.closestPoint(center);
		if (point == null) {
			return false;
		}
		var d = center.distance(point);
		return d <= sphere.radius;
	}
}
