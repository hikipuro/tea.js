import * as Tea from "../Tea";

export class GeometryUtil {
	protected static _positivePoint: Tea.Vector3 = new Tea.Vector3();
	protected static _negativePoint: Tea.Vector3 = new Tea.Vector3();
	protected static _tmpVec3: Tea.Vector3 = new Tea.Vector3();

	static calculateFrustumPlanes(camera: Tea.Camera): Array<Tea.Plane> {
		if (camera == null) {
			return null;
		}
		if (camera.orthographic) {
			return GeometryUtil.calculateOrthoFrustumPlanes(camera);
		}
		var planes = new Array(6);
		var near = camera.nearClipPlane;
		var far = camera.farClipPlane;
		var m = camera.projectionMatrix;
		var rotation = camera.object3d.rotation;
		var position = camera.object3d.position;
		var forward = camera.object3d.forward;
		var m20 = m.m20, m21 = m.m21, m22 = m.m22;
		var m30 = m.m30, m31 = m.m31, m32 = m.m32;
		var vec3 = new Tea.Vector3();

		for (var i = 0; i < 4; i++) {
			var a: number, b: number, c: number;
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
			var normal = vec3.normalizeSelf().mulSelf(-1.0);
			normal.applyQuaternion(rotation);
			planes[i] = new Tea.Plane(normal, position);
		}

		vec3.set(
			m30 + m20,
			m31 + m21,
			m32 + m22
		);
		var normal = vec3.normalizeSelf().mulSelf(-1.0);
		normal.applyQuaternion(rotation);
		var p = this._tmpVec3;
		p.copy(forward);
		p.mulSelf(near);
		p.addSelf(position);
		planes[4] = new Tea.Plane(normal, p);

		vec3.set(
			m30 - m20,
			m31 - m21,
			m32 - m22
		);
		normal = vec3.normalizeSelf().mulSelf(-1.0);
		normal.applyQuaternion(rotation);
		p.copy(forward);
		p.mulSelf(far);
		p.addSelf(position);
		planes[5] = new Tea.Plane(normal, p);
		//for (var i = 0; i < 6; i++) {
		//	console.log(planes[i].normal);
		//}
		return planes;
	}

	protected static calculateOrthoFrustumPlanes(camera: Tea.Camera): Array<Tea.Plane> {
		if (camera == null) {
			return null;
		}
		var planes = [];
		var position = camera.object3d.position;
		var corners: Array<Tea.Vector3> = new Array(8);
		corners[0] = new Tea.Vector3(0, 1, 0);
		corners[1] = new Tea.Vector3(1, 1, 0);
		corners[2] = new Tea.Vector3(1, 0, 0);
		corners[3] = new Tea.Vector3(0, 0, 0);
		corners[4] = new Tea.Vector3(0, 1, 1);
		corners[5] = new Tea.Vector3(1, 1, 1);
		corners[6] = new Tea.Vector3(1, 0, 1);
		corners[7] = new Tea.Vector3(0, 0, 1);

		for (var i = 0; i < 8; i++) {
			var position = corners[i];
			var p = position.clone();
			p[2] = -1.0;
			var near = camera.unproject(p);
			p[2] = 1.0;
			var far = camera.unproject(p);
			var direction = far.sub(near).normalized;
			var z = 0.0;
			if (position[2] > 0) {
				z = camera.farClipPlane - camera.nearClipPlane;
			}
			corners[i] = near.add(direction.mul(z));
		}
		planes.push(new Tea.Plane(
			corners[0], corners[4], corners[3]
		));
		planes.push(new Tea.Plane(
			corners[1], corners[2], corners[5]
		));
		planes.push(new Tea.Plane(
			corners[2], corners[3], corners[6]
		));
		planes.push(new Tea.Plane(
			corners[0], corners[1], corners[4]
		));
		planes.push(new Tea.Plane(
			corners[0], corners[2], corners[1]
		));
		planes.push(new Tea.Plane(
			corners[4], corners[5], corners[6]
		));
		//for (var i = 0; i < 6; i++) {
		//	console.log(planes[i].normal);
		//}
		return planes;
	}

	static testPlanesAABB(planes: Array<Tea.Plane>, bounds: Tea.Bounds): boolean {
		if (bounds == null) {
			return false;
		}
		/*
		//var inCount = 0;
		if (GeometryUtil.pointInFrustum(planes, bounds.center)) {
			return true;
		}
		for (var i = 0; i < 8; i++) {
			var point = bounds.getPoint(i);
			if (GeometryUtil.pointInFrustum(planes, point)) {
				//inCount++;
				return true;
			}
		}
		//*/

		var point = this._positivePoint;
		var center = bounds.center;
		var extents = bounds.extents;
		var minX = center[0] - extents[0];
		var minY = center[1] - extents[1];
		var minZ = center[2] - extents[2];
		var maxX = center[0] + extents[0];
		var maxY = center[1] + extents[1];
		var maxZ = center[2] + extents[2];
		for (var i = 0; i < 6; i++) {
			var plane = planes[i];
			var normal = plane.normal;
			point[0] = minX;
			point[1] = minY;
			point[2] = minZ;
			if (normal[0] >= 0.0) {
				point[0] = maxX;
			}
			if (normal[1] >= 0.0) {
				point[1] = maxY;
			}
			if (normal[2] >= 0.0) {
				point[2] = maxZ;
			}
			var d = plane.distance;
			var x = normal[0] * d + point[0];
			var y = normal[1] * d + point[1];
			var z = normal[2] * d + point[2];
			var distance = x * normal[0] + y * normal[1] + z * normal[2];
			//var distance = plane.getDistanceToPoint(point);
			//console.log(i, plane.point, plane.normal, distance)
			if (distance < 0.0) {
				return false;
			}
		}
		return true;
		//console.log(inCount);
		//return inCount > 0;
		/*
		var length = planes.length;
		for (var i = 0; i < length; i++) {
			var normal = planes[i].normal;
			var vp = this.getPositivePoint(bounds, normal);
			var dp = planes[i].getDistanceToPoint(vp);
			if (dp < 0.0) {
				return false;
			}
		}
		return true;
		*/
	}

	protected static pointInFrustum(planes: Array<Tea.Plane>, point: Tea.Vector3): boolean {
		var length = planes.length;
		for (var i = 0; i < length; i++) {
			var plane = planes[i];
			var distance = plane.getDistanceToPoint(point);
			if (distance < 0.0) {
				return false;
			}
		}
		return true;
	}

	protected static getPositivePoint(bounds: Tea.Bounds, normal: Tea.Vector3): Tea.Vector3 {
		var point = this._positivePoint;
		var center = bounds.center;
		var extents = bounds.extents;
		point[0] = center[0] - extents[0];
		point[1] = center[1] - extents[1];
		point[2] = center[2] - extents[2];
		if (normal[0] >= 0.0) {
			point[0] += extents[0] * 2.0;
		}
		if (normal[1] >= 0.0) {
			point[1] += extents[1] * 2.0;
		}
		if (normal[2] >= 0.0) {
			point[2] += extents[2] * 2.0;
		}
		return point;
	}

	protected static getNegativePoint(bounds: Tea.Bounds, normal: Tea.Vector3): Tea.Vector3 {
		var point = this._negativePoint;
		var center = bounds.center;
		var extents = bounds.extents;
		point[0] = center[0] + extents[0];
		point[1] = center[1] + extents[1];
		point[2] = center[2] + extents[2];
		if (normal[0] >= 0.0) {
			point[0] -= extents[0] * 2.0;
		}
		if (normal[1] >= 0.0) {
			point[1] -= extents[1] * 2.0;
		}
		if (normal[2] >= 0.0) {
			point[2] -= extents[2] * 2.0;
		}
		return point;
	}
}
