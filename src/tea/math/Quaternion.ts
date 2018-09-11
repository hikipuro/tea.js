import * as Tea from "../Tea";

export class Quaternion extends Array<number> {
	static _tmp: Quaternion = new Quaternion();

	constructor(x: number = 0.0, y: number = 0.0, z: number = 0.0, w: number = 0.0) {
		super(4);
		this[0] = x;
		this[1] = y;
		this[2] = z;
		this[3] = w;
	}

	static get identity(): Quaternion {
		return new Quaternion(0.0, 0.0, 0.0, 1.0);
	}

	static euler(x: number, y: number, z: number): Quaternion;
	static euler(eulerAngles: Tea.Vector3): Quaternion;
	static euler(a: number | Tea.Vector3, b: number = 0.0, c: number = 0.0): Quaternion {
		var x: number = 0.0;
		var y: number = 0.0;
		var z: number = 0.0;

		if (a instanceof Tea.Vector3) {
			x = Tea.radians(a[0] * 0.5);
			y = Tea.radians(a[1] * 0.5);
			z = Tea.radians(a[2] * 0.5);
		} else {
			x = Tea.radians(a * 0.5);
			y = Tea.radians(b * 0.5);
			z = Tea.radians(c * 0.5);
		}

		var sin = Math.sin, cos = Math.cos;
		var sx = sin(x), sy = sin(y), sz = sin(z);
		var cx = cos(x), cy = cos(y), cz = cos(z);

		var ax = cy * sx;
		var ay = cx * sy;
		var az = -sx * sy;
		var aw = cy * cx;

		return new Quaternion(
			cz * ax + ay * sz,
			cz * ay - sz * ax,
			aw * sz + cz * az,
			aw * cz - az * sz
		);
	}

	static fromToRotation(fromDirection: Tea.Vector3, toDirection: Tea.Vector3): Quaternion {
		fromDirection = fromDirection.normalized;
		toDirection = toDirection.normalized;
		var n = Tea.Vector3.cross(fromDirection, toDirection);
		var d = Tea.Vector3.dot(fromDirection, toDirection);
		return new Quaternion(n[0], n[1], n[2], d + 1.0).normalized;
	}

	static lookRotation(forward: Tea.Vector3, upwards: Tea.Vector3 = Tea.Vector3.up): Quaternion {
		if (forward.approxEquals(upwards)) {
			return Quaternion.fromToRotation(Tea.Vector3.forward, upwards);
		}
		var n = Tea.Vector3.orthoNormalize(forward, upwards);
		forward = n.normal;
		upwards = n.tangent;
		var right = upwards.cross(forward);
		var w = 0;
		var pw = 1 + (right[0] + upwards[1] + forward[2]);
		if (pw >= 0) {
			w = Math.sqrt(pw) * 0.5;
		}
		var w4 = 0;
		if (w != 0) {
			w4 = 1 / (4 * w);
		}
		var x = (upwards[2] - forward[1]) * w4;
		var y = (forward[0] - right[2]) * w4;
		var z = (right[1] - upwards[0]) * w4;
		return new Quaternion(x, y, z, w);
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

	/** w == this[3] */
	get w(): number {
		return this[3];
	}
	set w(value: number) {
		this[3] = value;
	}

	get eulerAngles(): Tea.Vector3 {
		var x = this[0], y = this[1], z = this[2], w = this[3];
		var x2 = x * x, y2 = y * y, z2 = z * z, w2 = w * w;

		var t0 = 2.0 * (x * z + w * y);
		var t1 = w2 - x2 - y2 + z2;
		var ay = Math.atan2(t0, t1);

		var t2 = -2.0 * (y * z - w * x);
		var ax = Math.asin(t2);

		var t3 = 2.0 * (x * y + w * z);
		var t4 = w2 - x2 + y2 - z2;
		var az = Math.atan2(t3, t4);

		return new Tea.Vector3(
			Tea.degrees(ax),
			Tea.degrees(ay),
			Tea.degrees(az)
		);
	}
	set eulerAngles(value: Tea.Vector3) {
		var x = Tea.radians(value[0] * 0.5);
		var y = Tea.radians(value[1] * 0.5);
		var z = Tea.radians(value[2] * 0.5);

		var sin = Math.sin, cos = Math.cos;
		var sx = sin(x), sy = sin(y), sz = sin(z);
		var cx = cos(x), cy = cos(y), cz = cos(z);

		var ax = cy * sx;
		var ay = cx * sy;
		var az = -sx * sy;
		var aw = cy * cx;
		
		this[0] = cz * ax + ay * sz;
		this[1] = cz * ay - sz * ax;
		this[2] = aw * sz + cz * az;
		this[3] = aw * cz - az * sz;
	}

	get magnitude(): number {
		var x = this[0], y = this[1], z = this[2], w = this[3];
		return Math.sqrt(x * x + y * y + z * z + w * w);
	}

	get sqrMagnitude(): number {
		var x = this[0], y = this[1], z = this[2], w = this[3];
		return x * x + y * y + z * z + w * w;
	}

	get normalized(): Quaternion {
		var x = this[0], y = this[1], z = this[2], w = this[3];
		var m = 1.0 / Math.sqrt(x * x + y * y + z * z + w * w);
		return new Quaternion(
			x * m, y * m, z * m, w * m
		);
	}

	get conjugated(): Quaternion {
		return new Quaternion(
			-this[0],
			-this[1],
			-this[2],
			this[3]
		);
	}

	get inversed(): Quaternion {
		var conjugate = this.conjugated;
		var magnitude = this.sqrMagnitude;
		return conjugate.mul(1.0 / magnitude);
	}

	clone(): Quaternion {
		return new Quaternion(
			this[0], this[1],
			this[2], this[3]
		);
	}

	set(x: number, y: number, z: number, w: number): void {
		this[0] = x;
		this[1] = y;
		this[2] = z;
		this[3] = w;
	}

	copy(value: Quaternion): void {
		this[0] = value[0];
		this[1] = value[1];
		this[2] = value[2];
		this[3] = value[3];
	}

	equals(value: Quaternion): boolean {
		if (value == null) {
			return false;
		}
		return this[0] === value[0]
			&& this[1] === value[1]
			&& this[2] === value[2]
			&& this[3] === value[3];
	}

	toMatrix4x4(): Tea.Matrix4x4 {
		var x = this[0], y = this[1], z = this[2], w = this[3];
		var xx = x * x, yy = y * y, zz = z * z;
		var xy = x * y, xz = x * z, yz = y * z;
		var wx = w * x, wy = w * y, wz = w * z;
		var m = new Tea.Matrix4x4();
		m[0] = 1 - 2 * (yy + zz);
		m[1] = 2 * (xy + wz);
		m[2] = 2 * (xz - wy);
		m[4] = 2 * (xy - wz);
		m[5] = 1 - 2 * (xx + zz);
		m[6] = 2 * (yz + wx);
		m[8] = 2 * (xz + wy);
		m[9] = 2 * (yz - wx);
		m[10] = 1 - 2 * (xx + yy);
		m[15] = 1;
		return m;
	}

	toString(): string {
		var t = new Array(4);
		for (var i = 0; i < 4; i++) {
			t[i] = this[i].toFixed(5);
		}
		return (
			"[" +
				"x: " + t[0] + ", " +
				"y: " + t[1] + ", " +
				"z: " + t[2] + ", " +
				"w: " + t[3] +
			"]"
		);
	}

	add(value: Quaternion): Quaternion {
		return new Quaternion(
			this[0] + value[0],
			this[1] + value[1],
			this[2] + value[2],
			this[3] + value[3]
		);
	}

	mul(value: number): Quaternion;
	mul(value: Quaternion): Quaternion;
	mul(value: Tea.Vector3): Tea.Vector3;
	mul(value: number | Quaternion | Tea.Vector3): Quaternion | Tea.Vector3 {
		if (value instanceof Tea.Vector3) {
			//*
			if (this[0] === 0.0
				&& this[1] === 0.0
				&& this[2] === 0.0
				&& this[3] === 0.0) {
				return value;
			}
			var ax = this[0], ay = this[1], az = this[2], aw = this[3];
			var bx = value[0], by = value[1], bz = value[2], bw = 0.0;
			var angles = Quaternion._tmp;
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
			
			return new Tea.Vector3(angles[0], angles[1], angles[2]);
			//*/
			/*
			var ax = this.x, ay = this.y, az = this.z, aw = this.w;
			var bx = value.x, by = value.y, bz = value.z, bw = 0;
			return new Tea.Vector3(
				aw * bx + bw * ax + ay * bz - by * az,
				aw * bx + bw * ax + ay * bz - by * az,
				aw * bx + bw * ax + ay * bz - by * az
			);
			*/
		}
		if (value instanceof Quaternion) {
			var ax = this[0], ay = this[1], az = this[2], aw = this[3];
			var bx = value[0], by = value[1], bz = value[2], bw = value[3];
			return new Quaternion(
				aw * bx + bw * ax + ay * bz - by * az,
				aw * by + bw * ay + az * bx - bz * ax,
				aw * bz + bw * az + ax * by - bx * ay,
				aw * bw - ax * bx - ay * by - az * bz
			);
		}
		return new Quaternion(
			this[0] * value,
			this[1] * value,
			this[2] * value,
			this[3] * value
		);
	}

	mul$(value: Quaternion): void {
		if (value == null) {
			return;
		}
		var ax = this[0], ay = this[1], az = this[2], aw = this[3];
		var bx = value[0], by = value[1], bz = value[2], bw = value[3];
		this[0] = aw * bx + bw * ax + ay * bz - by * az;
		this[1] = aw * by + bw * ay + az * bx - bz * ax;
		this[2] = aw * bz + bw * az + ax * by - bx * ay;
		this[3] = aw * bw - ax * bx - ay * by - az * bz;
	}

	dot(value: Quaternion): number {
		return this[0] * value[0] +
			this[1] * value[1] +
			this[2] * value[2] +
			this[3] * value[3];
	}

	lerp(q: Quaternion, t: number): Quaternion {
		t = Tea.Mathf.clamp01(t);
		return this.lerpUnclamped(q, t);
	}

	lerpUnclamped(q: Quaternion, t: number): Quaternion {
		var u = 1 - t;
		var q = new Quaternion(
			this[0] * u + q[0] * t,
			this[1] * u + q[1] * t,
			this[2] * u + q[2] * t,
			this[3] * u + q[3] * t
		);
		return q.normalized;
	}

	slerp(q: Quaternion, t: number): Quaternion {
		t = Tea.Mathf.clamp01(t);
		return this.slerpUnclamped(q, t);
	}

	slerpUnclamped(q: Quaternion, t: number): Quaternion {
		var a = Math.acos(this.dot(q));
		var u = 1.0 - t;
		var sa = Math.sin(a);
		var w1 = Math.sin(t * a) / sa;
		var w2 = Math.sin(u * a) / sa;
		var q = new Quaternion(
			this[0] * w2 + q[0] * w1,
			this[1] * w2 + q[1] * w1,
			this[2] * w2 + q[2] * w1,
			this[3] * w2 + q[3] * w1
		);
		return q.normalized;
	}
}
