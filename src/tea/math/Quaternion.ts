import * as Tea from "../Tea";

export class Quaternion extends Array<number> {
	constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
		super(4);
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}

	static get identity(): Quaternion {
		return new Quaternion(0, 0, 0, 1);
	}

	static euler(x: number, y: number, z: number): Quaternion;
	static euler(eulerAngles: Tea.Vector3): Quaternion;
	static euler(a: number | Tea.Vector3, b: number = 0, c: number = 0): Quaternion {
		var x: number = 0;
		var y: number = 0;
		var z: number = 0;

		if (a instanceof Tea.Vector3) {
			x = Tea.radians(a.x * 0.5);
			y = Tea.radians(a.y * 0.5);
			z = Tea.radians(a.z * 0.5);
		} else {
			x = Tea.radians(a * 0.5);
			y = Tea.radians(b * 0.5);
			z = Tea.radians(c * 0.5);
		}

		//*
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
		//*/

		/*
		var qx = new Quaternion(
			Math.sin(x),
			0,
			0,
			Math.cos(x)
		);
		var qy = new Quaternion(
			0,
			Math.sin(y),
			0,
			Math.cos(y)
		);
		var qz = new Quaternion(
			0,
			0,
			Math.sin(z),
			Math.cos(z)
		);
		return qy.mul(qx).mul(qz);
		//*/
	}

	static fromToRotation(fromDirection: Tea.Vector3, toDirection: Tea.Vector3): Quaternion {
		fromDirection = fromDirection.normalized;
		toDirection = toDirection.normalized;
		var n = Tea.Vector3.cross(fromDirection, toDirection);
		var d = Tea.Vector3.dot(fromDirection, toDirection);
		return new Quaternion(n.x, n.y, n.z, d + 1).normalized;
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
		var pw = 1 + (right.x + upwards.y + forward.z);
		if (pw >= 0) {
			w = Math.sqrt(pw) * 0.5;
		}
		var w4 = 0;
		if (w != 0) {
			w4 = 1 / (4 * w);
		}
		var x = (upwards.z - forward.y) * w4;
		var y = (forward.x - right.z) * w4;
		var z = (right.y - upwards.x) * w4;
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
		var x = this.x, y = this.y, z = this.z, w = this.w;
		var x2 = x * x, y2 = y * y, z2 = z * z, w2 = w * w;

		var t0 = 2 * (x * z + w * y);
		var t1 = w2 - x2 - y2 + z2;
		var ay = Math.atan2(t0, t1);

		var t2 = -2 * (y * z - w * x);
		var ax = Math.asin(t2);

		var t3 = 2 * (x * y + w * z);
		var t4 = w2 - x2 + y2 - z2;
		var az = Math.atan2(t3, t4);

		return new Tea.Vector3(
			Tea.degrees(ax),
			Tea.degrees(ay),
			Tea.degrees(az)
		);
	}
	set eulerAngles(value: Tea.Vector3) {
		var x = Tea.radians(value.x * 0.5);
		var y = Tea.radians(value.y * 0.5);
		var z = Tea.radians(value.z * 0.5);

		var sin = Math.sin, cos = Math.cos;
		var sx = sin(x), sy = sin(y), sz = sin(z);
		var cx = cos(x), cy = cos(y), cz = cos(z);

		var ax = cy * sx;
		var ay = cx * sy;
		var az = -sx * sy;
		var aw = cy * cx;
		
		this.x = cz * ax + ay * sz;
		this.y = cz * ay - sz * ax;
		this.z = aw * sz + cz * az;
		this.w = aw * cz - az * sz;
	}

	get magnitude(): number {
		var x = this.x, y = this.y, z = this.z, w = this.w;
		return Math.sqrt(x * x + y * y + z * z + w * w);
	}

	get sqrMagnitude(): number {
		var x = this.x, y = this.y, z = this.z, w = this.w;
		return x * x + y * y + z * z + w * w;
	}

	get normalized(): Quaternion {
		var x = this.x, y = this.y, z = this.z, w = this.w;
		var m = 1 / Math.sqrt(x * x + y * y + z * z + w * w);
		return new Quaternion(
			x * m, y * m, z * m, w * m
		);
	}

	get conjugated(): Quaternion {
		return new Quaternion(
			-this.x,
			-this.y,
			-this.z,
			this.w
		);
	}

	get inversed(): Quaternion {
		var conjugate = this.conjugated;
		var magnitude = this.sqrMagnitude;
		return conjugate.mul(1 / magnitude);
	}

	clone(): Quaternion {
		return new Quaternion(
			this.x,
			this.y,
			this.z,
			this.w
		);
	}

	set(x: number, y: number, z: number, w: number): void {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}

	equals(value: Quaternion): boolean {
		if (value == null) {
			return false;
		}
		return this.x === value.x
			&& this.y === value.y
			&& this.z === value.z
			&& this.w === value.w;
	}

	toMatrix4x4(): Tea.Matrix4x4 {
		var x = this.x, y = this.y, z = this.z, w = this.w;
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
		const t = new Array(4);
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
			this.x + value.x,
			this.y + value.y,
			this.z + value.z,
			this.w + value.w
		);
	}

	mul(value: number): Quaternion;
	mul(value: Quaternion): Quaternion;
	mul(value: Tea.Vector3): Tea.Vector3;
	mul(value: number | Quaternion | Tea.Vector3): Quaternion | Tea.Vector3 {
		if (value instanceof Quaternion) {
			var ax = this.x, ay = this.y, az = this.z, aw = this.w;
			var bx = value.x, by = value.y, bz = value.z, bw = value.w;
			return new Quaternion(
				aw * bx + bw * ax + ay * bz - by * az,
				aw * by + bw * ay + az * bx - bz * ax,
				aw * bz + bw * az + ax * by - bx * ay,
				aw * bw - ax * bx - ay * by - az * bz
			);
		}
		if (value instanceof Tea.Vector3) {
			//*
			if (this.x === 0
				&& this.y === 0
				&& this.z === 0
				&& this.w === 0) {
				return value;
			}
			var conjugate = this.conjugated;
			var angles = this.mul(new Quaternion(value.x, value.y, value.z, 0));
			angles = angles.mul(conjugate);
			return new Tea.Vector3(angles.x, angles.y, angles.z);
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
		return new Quaternion(
			this.x * value,
			this.y * value,
			this.z * value,
			this.w * value
		);
	}

	mul$(value: Quaternion): void {
		if (value == null) {
			return;
		}
		if (value instanceof Quaternion) {
			var ax = this.x, ay = this.y, az = this.z, aw = this.w;
			var bx = value.x, by = value.y, bz = value.z, bw = value.w;
			this.x = aw * bx + bw * ax + ay * bz - by * az;
			this.y = aw * by + bw * ay + az * bx - bz * ax;
			this.z = aw * bz + bw * az + ax * by - bx * ay;
			this.w = aw * bw - ax * bx - ay * by - az * bz;
		}
	}

	dot(value: Quaternion): number {
		return this.x * value.x +
			this.y * value.y +
			this.z * value.z +
			this.w * value.w;
	}

	lerp(q: Quaternion, t: number): Quaternion {
		t = Tea.Mathf.clamp01(t);
		return this.lerpUnclamped(q, t);
	}

	lerpUnclamped(q: Quaternion, t: number): Quaternion {
		var u = 1 - t;
		var q = new Quaternion(
			this.x * u + q.x * t,
			this.y * u + q.y * t,
			this.z * u + q.z * t,
			this.w * u + q.w * t
		);
		return q.normalized;
	}

	slerp(q: Quaternion, t: number): Quaternion {
		t = Tea.Mathf.clamp01(t);
		return this.slerpUnclamped(q, t);
	}

	slerpUnclamped(q: Quaternion, t: number): Quaternion {
		var a = Math.acos(this.dot(q));
		var u = 1 - t;
		var sa = Math.sin(a);
		var w1 = Math.sin(t * a) / sa;
		var w2 = Math.sin(u * a) / sa;
		var q = new Quaternion(
			this.x * w2 + q.x * w1,
			this.y * w2 + q.y * w1,
			this.z * w2 + q.z * w1,
			this.w * w2 + q.w * w1
		);
		return q.normalized;
	}
}
