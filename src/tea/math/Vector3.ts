import * as Tea from "../Tea";

export class Vector3 extends Array<number> {
	constructor(x: number = 0, y: number = 0, z: number = 0) {
		super(3);
		this[0] = x;
		this[1] = y;
		this[2] = z;
	}

	static get forward(): Vector3 {
		return new Vector3(0, 0, 1);
	}

	static get back(): Vector3 {
		return new Vector3(0, 0, -1);
	}

	static get up(): Vector3 {
		return new Vector3(0, 1, 0);
	}

	static get down(): Vector3 {
		return new Vector3(0, -1, 0);
	}

	static get left(): Vector3 {
		return new Vector3(-1, 0, 0);
	}

	static get right(): Vector3 {
		return new Vector3(1, 0, 0);
	}

	static get zero(): Vector3 {
		return new Vector3(0, 0, 0);
	}

	static get one(): Vector3 {
		return new Vector3(1, 1, 1);
	}

	static get positiveInfinity(): Vector3 {
		return new Vector3(Infinity, Infinity, Infinity);
	}

	static get negativeInfinity(): Vector3 {
		return new Vector3(-Infinity, -Infinity, -Infinity);
	}

	static max(a: Vector3, b: Vector3): Vector3 {
		return new Vector3(
			Math.max(a.x, b.x),
			Math.max(a.y, b.y),
			Math.max(a.z, b.z)
		);
	}

	static min(a: Vector3, b: Vector3): Vector3 {
		return new Vector3(
			Math.min(a.x, b.x),
			Math.min(a.y, b.y),
			Math.min(a.z, b.z)
		);
	}

	static moveTowards(current: Vector3, target: Vector3, maxDistanceDelta: number): Vector3 {
		var diff = current.sub(target);
		var magnitude = diff.magnitude;
		var ratio = Math.min(magnitude, maxDistanceDelta) / magnitude;
		diff = diff.mul(ratio);
		return current.sub(diff);
	}

	static dot(a: Vector3, b: Vector3): number {
		return a.dot(b);
	}

	static cross(a: Vector3, b: Vector3): Vector3 {
		return a.cross(b);
	}

	static angle(a: Vector3, b: Vector3): number {
		return a.angle(b);
	}

	static distance(a: Vector3, b: Vector3): number {
		return a.distance(b);
	}

	static normalize(value: Vector3): Vector3 {
		return value.normalized;
	}

	static scale(a: Vector3, b: Vector3): Vector3 {
		return a.scale(b);
	}

	static orthoNormalize(normal: Vector3, tangent: Vector3): any {
		var nm = normal.magnitude;
		var e1 = Tea.Vector3.zero;
		if (nm != 0) {
			e1 = normal.mul(1 / nm);
		}
		var f2 = tangent.sub(e1.mul(tangent.dot(e1)));
		var f2m = f2.magnitude;
		var e2 = Tea.Vector3.zero;
		if (f2m != 0) {
			e2 = f2.mul(1 / f2m);
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
		var magnitude = this.magnitude;
		if (Tea.Mathf.approximately(magnitude, 0)) {
			return new Vector3();
		}
		var m = 1 / magnitude;
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

	set(x: number, y: number, z: number): void {
		this[0] = x;
		this[1] = y;
		this[2] = z;
	}

	copy(value: Vector3): void {
		this[0] = value[0];
		this[1] = value[1];
		this[2] = value[2];
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

	isParallel(value: Vector3): boolean {
		var m = this.cross(value).magnitude;
		return Tea.Mathf.approximately(m, 0);
	}

	angle(value: Vector3): number {
		var ma = this.magnitude;
		var mb = value.magnitude;
		var cos = this.dot(value) / (ma * mb);
		return Math.acos(cos);
	}

	distance(value: Vector3): number {
		return this.sub(value).magnitude;
	}

	clampMagnitude(maxLength: number): Vector3 {
		var m = maxLength / this.magnitude;
		return new Vector3(
			this.x * m,
			this.y * m,
			this.z * m
		);
	}

	lerp(value: Vector3, t: number): Vector3 {
		return new Vector3(
			Tea.Mathf.lerp(this.x, value.x, t),
			Tea.Mathf.lerp(this.y, value.y, t),
			Tea.Mathf.lerp(this.z, value.z, t)
		);
	}

	lerpUnclamped(value: Vector3, t: number): Vector3 {
		return new Vector3(
			Tea.Mathf.lerpUnclamped(this.x, value.x, t),
			Tea.Mathf.lerpUnclamped(this.y, value.y, t),
			Tea.Mathf.lerpUnclamped(this.z, value.z, t)
		);
	}

	project(onNormal: Vector3): Vector3 {
		return Vector3.zero;
	}

	projectOnPlane(planeNormal: Vector3): Vector3 {
		return Vector3.zero;
	}

	reflect(): void {
	}

	rotateTowards(): void {
	}

	signedAngle(): void {
	}

	slerp(value: Vector3, t: number): Vector3 {
		var a = this.angle(value);
		a = Tea.Mathf.lerp(0, a, t);
		var m = this.magnitude - value.magnitude;
		m = Tea.Mathf.lerp(0, m, t);
		return new Vector3(
			this.x,
			this.y,
			this.z
		);
	}

	slerpUnclamped(): void {
	}

	smoothDamp(): void {
	}

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

	add$(value: number): Vector3;
	add$(value: Vector3): Vector3;
	add$(value: number | Vector3): Vector3 {
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

	sub$(value: number): Vector3;
	sub$(value: Vector3): Vector3;
	sub$(value: number | Vector3): Vector3 {
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

	mul$(value: number): Vector3 {
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

	div$(value: number): Vector3 {
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

	cross$(value: Vector3): Vector3 {
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

	scale$(value: Vector3): Vector3 {
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

	rotateX$(radian: number): Vector3 {
		var y = this[1], z = this[2];
		var sin = Math.sin(radian);
		var cos = Math.cos(radian);
		this[1] = cos * y + -sin * z;
		this[2] = sin * y + cos * z;
		return this;
	}

	rotateY(radian: number): Vector3 {
		var x = this.x, z = this.z;
		var sin = Math.sin(radian);
		var cos = Math.cos(radian);
		return new Vector3(
			cos * x + sin * z,
			this.y,
			-sin * x + cos * z
		);
	}

	rotateY$(radian: number): Vector3 {
		var x = this.x, z = this.z;
		var sin = Math.sin(radian);
		var cos = Math.cos(radian);
		this.x = cos * x + sin * z;
		this.z = -sin * x + cos * z;
		return this;
	}

	rotateZ(radian: number): Vector3 {
		var x = this.x, y = this.y;
		var sin = Math.sin(radian);
		var cos = Math.cos(radian);
		return new Vector3(
			cos * x + -sin * y,
			sin * x + cos * y,
			this.z
		);
	}

	rotateZ$(radian: number): Vector3 {
		var x = this.x, y = this.y;
		var sin = Math.sin(radian);
		var cos = Math.cos(radian);
		this.x = cos * x + -sin * y;
		this.y = sin * x + cos * y;
		return this;
	}

	rotate(vector: Vector3): Vector3 {
		var x = this.x, y = this.y, z = this.z;
		var sin = Math.sin, cos = Math.cos;
		y = cos(vector.x) * y + -sin(vector.x) * z;
		z = sin(vector.x) * y + cos(vector.x) * z;
		x = cos(vector.y) * x + sin(vector.y) * z;
		return new Vector3(
			cos(vector.z) * x + -sin(vector.z) * y,
			sin(vector.z) * x + cos(vector.z) * y,
			-sin(vector.y) * x + cos(vector.y) * z
		);
	}

	rotate$(vector: Vector3): Vector3 {
		var x = this.x, y = this.y, z = this.z;
		var sin = Math.sin, cos = Math.cos;
		y = cos(vector.x) * y + -sin(vector.x) * z;
		z = sin(vector.x) * y + cos(vector.x) * z;
		x = cos(vector.y) * x + sin(vector.y) * z;
		this.z = -sin(vector.y) * x + cos(vector.y) * z;
		this.x = cos(vector.z) * x + -sin(vector.z) * y;
		this.y = sin(vector.z) * x + cos(vector.z) * y;
		return this;
	}

	normalize$(): Vector3 {
		var magnitude = this.magnitude;
		if (Tea.Mathf.approximately(magnitude, 0)) {
			this[0] = 0;
			this[1] = 0;
			this[2] = 0;
			return this;
		}
		var m = 1 / magnitude;
		this[0] *= m;
		this[1] *= m;
		this[2] *= m;
		return this;
	}

	applyQuaternion(q: Tea.Quaternion): void {
		if (q[0] === 0 && q[1] === 0 && q[2] === 0 && q[3] === 0) {
			return;
		}
		var ax = q[0], ay = q[1], az = q[2], aw = q[3];
		var bx = this[0], by = this[1], bz = this[2], bw = 0;
		var angles = Tea.Quaternion._tmp;
		angles[0] = aw * bx + ay * bz - by * az;
		angles[1] = aw * by + az * bx - bz * ax;
		angles[2] = aw * bz + ax * by - bx * ay;
		angles[3] = -(ax * bx) - ay * by - az * bz;

		bx = -ax, by = -ay, bz = -az, bw = aw;
		ax = angles[0], ay = angles[1], az = angles[2], aw = angles[3];
		angles[0] = aw * bx + bw * ax + ay * bz - by * az;
		angles[1] = aw * by + bw * ay + az * bx - bz * ax;
		angles[2] = aw * bz + bw * az + ax * by - bx * ay;
		//angles[3] = aw * bw - ax * bx - ay * by - az * bz;
		
		this[0] = angles[0];
		this[1] = angles[1];
		this[2] = angles[2];
	}

	applyMatrix4(matrix: Tea.Matrix4x4): void {
		var tx = this[0], ty = this[1], tz = this[2];

		var x = matrix[0] * tx + matrix[4] * ty + matrix[8]  * tz + matrix[12];
		var y = matrix[1] * tx + matrix[5] * ty + matrix[9]  * tz + matrix[13];
		var z = matrix[2] * tx + matrix[6] * ty + matrix[10] * tz + matrix[14];
		var w = matrix[3] * tx + matrix[7] * ty + matrix[11] * tz + matrix[15];
	
		if ( w !== 0 ) {
			w = 1 / w;
		}
	
		this[0] = x * w;
		this[1] = y * w;
		this[2] = z * w;
	}
}
