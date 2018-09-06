import * as Tea from "../Tea";

export class GeometryUtil {
	static calculateFrustumPlanes(camera: Tea.Camera): Array<Tea.Plane> {
		var planes = new Array(6);
		var near = camera.nearClipPlane;
		var far = camera.farClipPlane;
		var m = camera.projectionMatrix;
		var object3d = camera.object3d;
		var rotation = object3d.rotation;
		var position = object3d.position;
		var forward = object3d.forward;
		var m20 = m.m20, m21 = m.m21, m22 = m.m22;
		var m30 = m.m30, m31 = m.m31, m32 = m.m32;
		var a, b, c, d;
		var vec3 = new Tea.Vector3();

		for (var i = 0; i < 4; i++) {
			var r = Math.floor(i / 2);
			if (i % 2 === 0) {
				a = m30 - m.getValue(r, 0);
				b = m31 - m.getValue(r, 1);
				c = m32 - m.getValue(r, 2);
				//d = pmat.getValue(3, 3) - pmat.getValue(r, 3);
			} else {
				a = m30 + m.getValue(r, 0);
				b = m31 + m.getValue(r, 1);
				c = m32 + m.getValue(r, 2);
				//d = pmat.getValue(3, 3) + pmat.getValue(r, 3);
			}
			vec3.set(a, b, c);
			var normal = vec3.normalize$().mul$(-1);
			normal = rotation.mul(normal);
			planes[i] = new Tea.Plane(normal, position);
		}

		a = m30 + m20;
		b = m31 + m21;
		c = m32 + m22;
		//d = pmat.getValue(3, 3) + pmat.getValue(2, 3);
		vec3.set(a, b, c);
		var normal = vec3.normalize$().mul$(-1);
		normal = rotation.mul(normal);
		var forwardNear = forward.mul(near);
		var p = position.add(forwardNear);
		planes[4] = new Tea.Plane(normal, p);

		a = m30 - m20;
		b = m31 - m21;
		c = m32 - m22;
		//d = pmat.getValue(3, 3) - pmat.getValue(2, 3);
		vec3.set(a, b, c);
		normal = vec3.normalize$().mul$(-1);
		normal = rotation.mul(normal);
		p = position.add(forwardNear.add$(forward.mul$(far)));
		planes[5] = new Tea.Plane(normal, p);
		return planes;
	}

	static testPlanesAABB(planes: Array<Tea.Plane>, bounds: Tea.Bounds): boolean {
		if (bounds == null) {
			return false;
		}
		var length = planes.length;
		for (var i = 0; i < length; i++) {
			var normal = planes[i].normal;
			var vp = this.getPositivePoint(bounds, normal);
			var dp = planes[i].getDistanceToPoint(vp);
			if (dp < 0) {
				return false;
			}
			//var vn = this.getNegativePoint(bounds, normal);
			//var dn = planes[i].getDistanceToPoint(vn);
			//if (dn < 0) {
				//return false;
			//}
		}
		return true;
	}

	protected static getPositivePoint(bounds: Tea.Bounds, normal: Tea.Vector3): Tea.Vector3 {
		var result = bounds.min;
		if (normal.x > 0) {
			result.x += bounds.size.x;
		}
		if (normal.y > 0) {
			result.y += bounds.size.y;
		}
		if (normal.z > 0) {
			result.z += bounds.size.z;
		}
		return result;
	}

	protected static getNegativePoint(bounds: Tea.Bounds, normal: Tea.Vector3): Tea.Vector3 {
		var result = bounds.min;
		if (normal.x < 0) {
			result.x += bounds.size.x;
		}
		if (normal.y < 0) {
			result.y += bounds.size.y;
		}
		if (normal.z < 0) {
			result.z += bounds.size.z;
		}
		return result;
	}
}