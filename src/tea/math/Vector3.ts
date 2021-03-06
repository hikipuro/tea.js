import * as Tea from "../Tea";

export class Vector3 extends Array<number> {
	static readonly forward = new Vector3(0.0, 0.0, 1.0);
	static readonly back = new Vector3(0.0, 0.0, -1.0);
	static readonly up = new Vector3(0.0, 1.0, 0.0);
	static readonly down = new Vector3(0.0, -1.0, 0.0);
	static readonly left = new Vector3(-1.0, 0.0, 0.0);
	static readonly right = new Vector3(1.0, 0.0, 0.0);
	static readonly zero = new Vector3(0.0, 0.0, 0.0);
	static readonly one = new Vector3(1.0, 1.0, 1.0);
	static readonly positiveInfinity = new Vector3(Infinity, Infinity, Infinity);
	static readonly negativeInfinity = new Vector3(-Infinity, -Infinity, -Infinity);
	static _tmp: Vector3 = new Vector3();
	//static newCount: number = 0;

	constructor(x: number = 0.0, y: number = 0.0, z: number = 0.0) {
		super(3);
		this[0] = x;
		this[1] = y;
		this[2] = z;
		//Vector3.newCount++;
	}

	static init() {
		Object.freeze(Vector3.forward);
		Object.freeze(Vector3.back);
		Object.freeze(Vector3.up);
		Object.freeze(Vector3.down);
		Object.freeze(Vector3.left);
		Object.freeze(Vector3.right);
		Object.freeze(Vector3.zero);
		Object.freeze(Vector3.one);
		Object.freeze(Vector3.positiveInfinity);
		Object.freeze(Vector3.negativeInfinity);
	}

	static fromArray(array: Array<number>): Vector3 {
		if (array == null) {
			return null;
		}
		var x = array[0], y = array[1], z = array[2];
		x = x != null ? x : 0.0;
		y = y != null ? y : 0.0;
		z = z != null ? z : 0.0;
		return new Vector3(x, y, z);
	}

	static max(a: Vector3, b: Vector3): Vector3 {
		return new Vector3(
			Math.max(a[0], b[0]),
			Math.max(a[1], b[1]),
			Math.max(a[2], b[2])
		);
	}

	static min(a: Vector3, b: Vector3): Vector3 {
		return new Vector3(
			Math.min(a[0], b[0]),
			Math.min(a[1], b[1]),
			Math.min(a[2], b[2])
		);
	}

	static moveTowards(current: Vector3, target: Vector3, maxDistanceDelta: number): Vector3 {
		var diff = current.sub(target);
		var magnitude = diff.magnitude;
		var ratio = Math.min(magnitude, maxDistanceDelta) / magnitude;
		diff = diff.mul(ratio);
		return current.sub(diff);
	}

	static orthoNormalize(normal: Vector3, tangent: Vector3): any {
		var nm = normal.magnitude;
		var e1 = Tea.Vector3.zero;
		if (nm != 0.0) {
			e1 = normal.mul(1.0 / nm);
		}
		var f2 = tangent.sub(e1.mul(tangent.dot(e1)));
		var f2m = f2.magnitude;
		var e2 = Tea.Vector3.zero;
		if (f2m != 0.0) {
			e2 = f2.mul(1.0 / f2m);
		}
		//normal.set(e1.x, e1.y, e1.z);
		//tangent.set(e2.x, e2.y, e2.z);
		return {
			normal: e1,
			tangent: e2
		};
	}

	/** x == this[0] */
	get x(): number {
		return this[0];
	}
	set x(value: number) {
		this[0] = value;
	}

	/** y == this[1] */
	get y(): number {
		return this[1];
	}
	set y(value: number) {
		this[1] = value;
	}

	/** z == this[2] */
	get z(): number {
		return this[2];
	}
	set z(value: number) {
		this[2] = value;
	}

	get magnitude(): number {
		var x = this[0], y = this[1], z = this[2];
		return Math.sqrt(x * x + y * y + z * z);
	}

	get sqrMagnitude(): number {
		var x = this[0], y = this[1], z = this[2];
		return x * x + y * y + z * z;
	}

	get normalized(): Vector3 {
		var x = this[0], y = this[1], z = this[2];
		var m = x * x + y * y + z * z;
		if (m === 0.0) {
			return new Vector3();
		}
		m = 1.0 / Math.sqrt(m);
		return new Vector3(
			this[0] * m,
			this[1] * m,
			this[2] * m
		);
	}

	clone(): Vector3 {
		return new Vector3(
			this[0], this[1], this[2]
		);
	}

	set(x: number, y: number, z: number): Tea.Vector3 {
		this[0] = x;
		this[1] = y;
		this[2] = z;
		return this;
	}

	copy(value: Vector3): Tea.Vector3 {
		this[0] = value[0];
		this[1] = value[1];
		this[2] = value[2];
		return this;
	}

	equals(value: Vector3): boolean {
		if (value == null) {
			return false;
		}
		return this[0] === value[0]
			&& this[1] === value[1]
			&& this[2] === value[2];
	}

	approxEquals(value: Vector3): boolean {
		if (value == null) {
			return false;
		}
		return Tea.Mathf.approximately(this[0], value[0])
			&& Tea.Mathf.approximately(this[1], value[1])
			&& Tea.Mathf.approximately(this[2], value[2]);
	}

	toString(): string {
		var t = new Array(3);
		for (var i = 0; i < 3; i++) {
			t[i] = this[i].toFixed(5);
		}
		return (
			"[x: " + t[0] + ", y: " + t[1] + ", z: " + t[2] + "]"
		);
	}

	toVector2(): Tea.Vector2 {
		return new Tea.Vector2(
			this[0], this[1]
		);
	}

	toVector4(): Tea.Vector4 {
		return new Tea.Vector4(
			this[0], this[1], this[2], 0.0
		);
	}

	isParallel(value: Vector3): boolean {
		var m = this.cross(value).magnitude;
		return Tea.Mathf.approximately(m, 0);
	}

	angle(value: Vector3): number {
		var ma = this.sqrMagnitude;
		var mb = value.sqrMagnitude;
		if (ma === 0.0 && mb === 0.0) {
			return 0;
		}
		var cos = this.dot(value) / Math.sqrt(ma * mb);
		return Math.acos(cos);
	}

	clampMagnitude(maxLength: number): Vector3 {
		var x = this[0], y = this[1], z = this[2];
		var m = x * x + y * y + z * z;
		if (m === 0.0) {
			return new Vector3();
		}
		m = Math.sqrt(m);
		m = maxLength / m;
		return new Vector3(
			this[0] * m,
			this[1] * m,
			this[2] * m
		);
	}

	distance(value: Vector3): number {
		if (value == null) {
			return 0.0;
		}
		var x = this[0] - value[0];
		var y = this[1] - value[1];
		var z = this[2] - value[2];
		var m = x * x + y * y + z * z;
		if (m === 0.0) {
			return 0.0;
		}
		return Math.sqrt(m);
	}

	lerp(value: Vector3, t: number): Vector3 {
		return new Vector3(
			Tea.Mathf.lerp(this[0], value[0], t),
			Tea.Mathf.lerp(this[1], value[1], t),
			Tea.Mathf.lerp(this[2], value[2], t)
		);
	}

	lerpUnclamped(value: Vector3, t: number): Vector3 {
		return new Vector3(
			Tea.Mathf.lerpUnclamped(this[0], value[0], t),
			Tea.Mathf.lerpUnclamped(this[1], value[1], t),
			Tea.Mathf.lerpUnclamped(this[2], value[2], t)
		);
	}

	project(onNormal: Vector3): Vector3 {
		if (onNormal.approxEquals(Vector3.zero)) {
			return new Vector3();
		}
		var n = onNormal.normalized;
		return n.mul(n.dot(this));
	}

	projectOnPlane(planeNormal: Vector3): Vector3 {
		if (planeNormal.approxEquals(Vector3.zero)) {
			return new Vector3();
		}
		var n = planeNormal;
		var m = this.dot(n) / n.sqrMagnitude;
		return this.sub(n.mul(m));
	}

	reflect(inNormal: Vector3): Vector3 {
		var n = inNormal;
		var d = this.dot(n) * -2.0;
		var t = Vector3._tmp;
		t.copy(n).mulSelf(d).addSelf(this);
		return t.clone(); 
	}

	rotateTowards(target: Vector3, maxRadiansDelta: number, maxMagnitudeDelta: number): Vector3 {
		var q = Tea.Quaternion.fromToRotation(this, target);
		q = q.pow(maxRadiansDelta);
		var m = this.magnitude - maxMagnitudeDelta;
		m = Math.max(m, target.magnitude);
		var v = this.normalized.mul(m);
		return q.mul(v);
	}

	signedAngle(to: Vector3, axis: Vector3): number {
		var ma = this.sqrMagnitude;
		var mb = to.sqrMagnitude;
		if (ma === 0.0 && mb === 0.0) {
			return 0;
		}
		var cos = this.dot(to) / Math.sqrt(ma * mb);
		var angle = Math.acos(cos);
		var cross = this.cross(to);
		if (cross.dot(axis) < 0) {
			angle = -angle;
		}
		return angle;
	}

	slerp(b: Vector3, t: number): Vector3 {
		var q = Tea.Quaternion.fromToRotation(this, b);
		q = Tea.Quaternion.identity.slerp(q, t);
		var m1 = this.magnitude * (1.0 - t);
		var m2 = b.magnitude * t;
		return q.mul(this.normalized).mul(m1 + m2);
	}

	slerpUnclamped(b: Vector3, t: number): Vector3 {
		var q = Tea.Quaternion.fromToRotation(this, b);
		q = Tea.Quaternion.identity.slerpUnclamped(q, t);
		var m1 = this.magnitude * (1.0 - t);
		var m2 = b.magnitude * t;
		return q.mul(this.normalized).mul(m1 + m2);
	}

	/*
	smoothDamp(): void {
	}
	//*/

	add(value: number): Vector3;
	add(value: Vector3): Vector3;
	add(value: number | Vector3): Vector3 {
		if (value instanceof Vector3) {
			return new Vector3(
				this[0] + value[0],
				this[1] + value[1],
				this[2] + value[2]
			);
		}
		return new Vector3(
			this[0] + value,
			this[1] + value,
			this[2] + value
		);
	}

	addSelf(value: number): Vector3;
	addSelf(value: Vector3): Vector3;
	addSelf(value: number | Vector3): Vector3 {
		if (value instanceof Vector3) {
			this[0] += value[0];
			this[1] += value[1];
			this[2] += value[2];
			return this;
		}
		this[0] += value;
		this[1] += value;
		this[2] += value;
		return this;
	}

	sub(value: number): Vector3;
	sub(value: Vector3): Vector3;
	sub(value: number | Vector3): Vector3 {
		if (value instanceof Vector3) {
			return new Vector3(
				this[0] - value[0],
				this[1] - value[1],
				this[2] - value[2]
			);
		}
		return new Vector3(
			this[0] - value,
			this[1] - value,
			this[2] - value
		);
	}

	subSelf(value: number): Vector3;
	subSelf(value: Vector3): Vector3;
	subSelf(value: number | Vector3): Vector3 {
		if (value instanceof Vector3) {
			this[0] -= value[0];
			this[1] -= value[1];
			this[2] -= value[2];
			return this;
		}
		this[0] -= value;
		this[1] -= value;
		this[2] -= value;
		return this;
	}

	mul(value: number): Vector3 {
		return new Vector3(
			this[0] * value,
			this[1] * value,
			this[2] * value
		);
	}

	mulSelf(value: number): Vector3 {
		this[0] *= value;
		this[1] *= value;
		this[2] *= value;
		return this;
	}

	div(value: number): Vector3 {
		return new Vector3(
			this[0] / value,
			this[1] / value,
			this[2] / value
		);
	}

	divSelf(value: number): Vector3 {
		this[0] /= value;
		this[1] /= value;
		this[2] /= value;
		return this;
	}

	dot(value: Vector3): number {
		return this[0] * value[0] +
			this[1] * value[1] +
			this[2] * value[2];
	}

	cross(value: Vector3): Vector3 {
		var x = this[0], y = this[1], z = this[2];
		return new Vector3(
			y * value[2] - z * value[1],
			z * value[0] - x * value[2],
			x * value[1] - y * value[0]
		);
	}

	crossSelf(value: Vector3): Vector3 {
		var x = this[0], y = this[1], z = this[2];
		this[0] = y * value[2] - z * value[1];
		this[1] = z * value[0] - x * value[2];
		this[2] = x * value[1] - y * value[0];
		return this;
	}

	scale(value: Vector3): Vector3 {
		return new Vector3(
			this[0] * value[0],
			this[1] * value[1],
			this[2] * value[2]
		);
	}

	scaleSelf(value: Vector3): Vector3 {
		this[0] *= value[0];
		this[1] *= value[1];
		this[2] *= value[2];
		return this;
	}

	rotateX(radian: number): Vector3 {
		var y = this[1], z = this[2];
		var sin = Math.sin(radian);
		var cos = Math.cos(radian);
		return new Vector3(
			this[0],
			cos * y + -sin * z,
			sin * y + cos * z
		);
	}

	rotateXSelf(radian: number): Vector3 {
		var y = this[1], z = this[2];
		var sin = Math.sin(radian);
		var cos = Math.cos(radian);
		this[1] = cos * y + -sin * z;
		this[2] = sin * y + cos * z;
		return this;
	}

	rotateY(radian: number): Vector3 {
		var x = this[0], z = this[2];
		var sin = Math.sin(radian);
		var cos = Math.cos(radian);
		return new Vector3(
			cos * x + sin * z,
			this[1],
			-sin * x + cos * z
		);
	}

	rotateYSelf(radian: number): Vector3 {
		var x = this[0], z = this[2];
		var sin = Math.sin(radian);
		var cos = Math.cos(radian);
		this[0] = cos * x + sin * z;
		this[2] = -sin * x + cos * z;
		return this;
	}

	rotateZ(radian: number): Vector3 {
		var x = this[0], y = this[1];
		var sin = Math.sin(radian);
		var cos = Math.cos(radian);
		return new Vector3(
			cos * x + -sin * y,
			sin * x + cos * y,
			this[2]
		);
	}

	rotateZSelf(radian: number): Vector3 {
		var x = this[0], y = this[1];
		var sin = Math.sin(radian);
		var cos = Math.cos(radian);
		this[0] = cos * x + -sin * y;
		this[1] = sin * x + cos * y;
		return this;
	}

	rotate(vector: Vector3): Vector3 {
		var x = this[0], y = this[1], z = this[2];
		var sin = Math.sin, cos = Math.cos;
		y = cos(vector[0]) * y + -sin(vector[0]) * z;
		z = sin(vector[0]) * y + cos(vector[0]) * z;
		x = cos(vector[1]) * x + sin(vector[1]) * z;
		return new Vector3(
			cos(vector[2]) * x + -sin(vector[2]) * y,
			sin(vector[2]) * x + cos(vector[2]) * y,
			-sin(vector[1]) * x + cos(vector[1]) * z
		);
	}

	rotateSelf(vector: Vector3): Vector3 {
		var x = this[0], y = this[1], z = this[2];
		var sin = Math.sin, cos = Math.cos;
		y = cos(vector[0]) * y + -sin(vector[0]) * z;
		z = sin(vector[0]) * y + cos(vector[0]) * z;
		x = cos(vector[1]) * x + sin(vector[1]) * z;
		this[2] = -sin(vector[1]) * x + cos(vector[1]) * z;
		this[0] = cos(vector[2]) * x + -sin(vector[2]) * y;
		this[1] = sin(vector[2]) * x + cos(vector[2]) * y;
		return this;
	}

	normalizeSelf(): Vector3 {
		var x = this[0], y = this[1], z = this[2];
		var magnitude = Math.sqrt(x * x + y * y + z * z);
		if (magnitude === 0.0) {
			this[0] = 0.0;
			this[1] = 0.0;
			this[2] = 0.0;
			return this;
		}
		var m = 1.0 / magnitude;
		this[0] *= m;
		this[1] *= m;
		this[2] *= m;
		return this;
	}

	applyQuaternion(q: Tea.Quaternion): void {
		if (q == null) {
			return;
		}
		var ax = q[0], ay = q[1], az = q[2], aw = q[3];
		//if (ax === 0.0 && ay === 0.0 && az === 0.0 && aw === 0.0) {
		//	return;
		//}
		var bx = this[0], by = this[1], bz = this[2];
		var tx = (ay * bz - az * by) * 2.0;
		var ty = (az * bx - ax * bz) * 2.0;
		var tz = (ax * by - ay * bx) * 2.0;
		this[0] += aw * tx + ay * tz - az * ty;
		this[1] += aw * ty + az * tx - ax * tz;
		this[2] += aw * tz + ax * ty - ay * tx;
		/*
		var bx = this[0], by = this[1], bz = this[2], bw = 0.0;
		var q = Tea.Quaternion._tmp;
		q[0] = aw * bx + ay * bz - by * az;
		q[1] = aw * by + az * bx - bz * ax;
		q[2] = aw * bz + ax * by - bx * ay;
		q[3] = -(ax * bx) - ay * by - az * bz;
		bx = -ax, by = -ay, bz = -az, bw = aw;
		ax = q[0], ay = q[1], az = q[2], aw = q[3];
		this[0] = aw * bx + bw * ax + ay * bz - by * az;
		this[1] = aw * by + bw * ay + az * bx - bz * ax;
		this[2] = aw * bz + bw * az + ax * by - bx * ay;
		//*/
	}

	applyMatrix4(m: Tea.Matrix4x4): void {
		if (m == null) {
			return;
		}
		var tx = this[0], ty = this[1], tz = this[2];
		var x = m[0] * tx + m[4] * ty + m[8]  * tz + m[12];
		var y = m[1] * tx + m[5] * ty + m[9]  * tz + m[13];
		var z = m[2] * tx + m[6] * ty + m[10] * tz + m[14];
		var w = m[3] * tx + m[7] * ty + m[11] * tz + m[15];
		if (w !== 0.0) {
			w = 1.0 / w;
		}
		this[0] = x * w;
		this[1] = y * w;
		this[2] = z * w;
	}
}

Vector3.init();
