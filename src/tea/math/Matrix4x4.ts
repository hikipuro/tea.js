import * as Tea from "../Tea";
import { Vector3 } from "./Vector3";
import { Vector4 } from "./Vector4";

export class Matrix4x4 extends Array<number> {
	//static newCount: number = 0;
	static readonly identity = new Matrix4x4(
		new Vector4(1.0, 0.0, 0.0, 0.0),
		new Vector4(0.0, 1.0, 0.0, 0.0),
		new Vector4(0.0, 0.0, 1.0, 0.0),
		new Vector4(0.0, 0.0, 0.0, 1.0)
	);
	static readonly zero = new Matrix4x4();

	constructor();
	constructor(column0: Tea.Vector4, column1: Tea.Vector4, column2: Tea.Vector4, column3: Tea.Vector4);
	constructor(a?: Tea.Vector4, b?: Tea.Vector4, c?: Tea.Vector4, d?: Tea.Vector4) {
		//Matrix4x4.newCount++;
		super(16);
		if (a != null) {
			this[0] = a[0];
			this[1] = a[1];
			this[2] = a[2];
			this[3] = a[3];
		} else {
			this[0] = this[1] = this[2] = this[3] = 0.0;
		}

		if (b != null) {
			this[4] = b[0];
			this[5] = b[1];
			this[6] = b[2];
			this[7] = b[3];
		} else {
			this[4] = this[5] = this[6] = this[7] = 0.0;
		}
		
		if (c != null) {
			this[8] = c[0];
			this[9] = c[1];
			this[10] = c[2];
			this[11] = c[3];
		} else {
			this[8] = this[9] = this[10] = this[11] = 0.0;
		}

		if (d != null) {
			this[12] = d[0];
			this[13] = d[1];
			this[14] = d[2];
			this[15] = d[3];
		} else {
			this[12] = this[13] = this[14] = this[15] = 0.0;
		}
	}

	static init() {
		Object.freeze(Matrix4x4.identity);
		Object.freeze(Matrix4x4.zero);
	}

	static fromArray(array: Array<number>, offset: number = 0): Matrix4x4 {
		if (array == null) {
			return null;
		}
		var m = new Matrix4x4();
		var length = array.length;
		for (var i = 0; i < length; i++) {
			var item = array[i + offset];
			if (item == null) {
				continue;
			}
			m[i] = item;
		}
		return m;
	}

	static fromQuaternion(q: Tea.Quaternion): Matrix4x4 {
		var m = new Matrix4x4();
		var x = q[0], y = q[1], z = q[2], w = q[3];
		var xx = x * x, yy = y * y, zz = z * z;
		var xy = x * y, xz = x * z, xw = x * w;
		var yz = y * z, yw = y * w, zw = z * w;
		m[0] = 1.0 - 2.0 * (yy + zz);
		m[1] = 2.0 * (xy + zw);
		m[2] = 2.0 * (xz - yw);
		m[4] = 2.0 * (xy - zw);
		m[5] = 1.0 - 2.0 * (xx + zz);
		m[6] = 2.0 * (yz + xw);
		m[8] = 2.0 * (xz + yw);
		m[9] = 2.0 * (yz - xw);
		m[10] = 1.0 - 2.0 * (xx + yy);
		m[15] = 1.0;
		return m;
	}

	static translate(vector: Vector3): Matrix4x4;
	static translate(x: number, y: number, z: number): Matrix4x4;
	static translate(x: Vector3 | number, y: number = 0, z: number = 0): Matrix4x4 {
		if (x == null) {
			return null;
		}
		var m = Matrix4x4.identity;
		if (x instanceof Vector3) {
			m[12] = x[0];
			m[13] = x[1];
			m[14] = x[2];
		} else {
			m[12] = x;
			m[13] = y;
			m[14] = z;
		}
		return m;
	}

	static scale(vector: Vector3): Matrix4x4;
	static scale(x: number, y: number, z: number): Matrix4x4;
	static scale(x: Vector3 | number, y: number = 0, z: number = 0): Matrix4x4 {
		if (x == null) {
			return null;
		}
		var m = Matrix4x4.identity;
		if (x instanceof Vector3) {
			m[0]  = x[0];
			m[5]  = x[1];
			m[10] = x[2];
		} else {
			m[0]  = x;
			m[5]  = y;
			m[10] = z;
		}
		return m;
	}

	static shear(vector: Vector3): Matrix4x4 {
		var m = Matrix4x4.identity;
		if (vector == null) {
			return m;
		}
		m[1] = m[2] = vector[0];
		m[4] = m[6] = vector[1];
		m[8] = m[9] = vector[2];
		return m;
	}

	static rotateX(radians: number): Matrix4x4 {
		var m = Matrix4x4.identity;
		var sin = Math.sin(radians);
		var cos = Math.cos(radians);
		m[5] = cos;
		m[6] = sin;
		m[9] = -sin;
		m[10] = cos;
		return m;
	}

	static rotateY(radians: number): Matrix4x4 {
		var m = Matrix4x4.identity;
		var sin = Math.sin(radians);
		var cos = Math.cos(radians);
		m[0] = cos;
		m[2] = -sin;
		m[8] = sin;
		m[10] = cos;
		return m;
	}

	static rotateZ(radians: number): Matrix4x4 {
		var m = Matrix4x4.identity;
		var sin = Math.sin(radians);
		var cos = Math.cos(radians);
		m[0] = cos;
		m[1] = sin;
		m[4] = -sin;
		m[5] = cos;
		return m;
	}

	static rotateZXY(vector: Vector3): Matrix4x4 {
		var m = Matrix4x4.identity;
		if (vector == null) {
			return m;
		}
		m = m.mul(Matrix4x4.rotateY(vector[1]));
		m = m.mul(Matrix4x4.rotateX(vector[0]));
		m = m.mul(Matrix4x4.rotateZ(vector[2]));
		return m;
	}

	static rotate(vector: Vector3): Matrix4x4;
	static rotate(quaternion: Tea.Quaternion): Matrix4x4;
	static rotate(value: Vector3 | Tea.Quaternion): Matrix4x4 {
		var m = new Matrix4x4();
		if (value == null) {
			return m;
		}
		if (value instanceof Vector3) {
			var sx = Math.sin(value[0]);
			var cx = Math.cos(value[0]);
			var sy = Math.sin(value[1]);
			var cy = Math.cos(value[1]);
			var sz = Math.sin(value[2]);
			var cz = Math.cos(value[2]);
			m[0] = cy * cz + sy * sx * sz;
			m[1] = cx * sz;
			m[2] = -sy * cz + cy * sx * sz;
			m[4] = cy * -sz + sy * sx * cz;
			m[5] = cx * cz;
			m[6] = -sy * -sz + cy * sx * cz;
			m[8] = sy * cx;
			m[9] = -sx;
			m[10] = cy * cx;
			m[15] = 1;
			return m;
		}
		var x = value[0], y = value[1], z = value[2], w = value[3];
		var xx = x * x, yy = y * y, zz = z * z;
		var xy = x * y, xz = x * z, xw = x * w;
		var yz = y * z, yw = y * w, zw = z * w;
		m[0] = 1.0 - 2.0 * (yy + zz);
		m[1] = 2.0 * (xy + zw);
		m[2] = 2.0 * (xz - yw);
		m[4] = 2.0 * (xy - zw);
		m[5] = 1.0 - 2.0 * (xx + zz);
		m[6] = 2.0 * (yz + xw);
		m[8] = 2.0 * (xz + yw);
		m[9] = 2.0 * (yz - xw);
		m[10] = 1.0 - 2.0 * (xx + yy);
		m[15] = 1.0;
		return m;
	}

	static trs(position: Vector3, rotation: Vector3, scale: Vector3): Matrix4x4;
	static trs(position: Vector3, rotation: Tea.Quaternion, scale: Vector3): Matrix4x4;
	static trs(position: Vector3, rotation: Vector3 | Tea.Quaternion, scale: Vector3): Matrix4x4 {
		var m = new Matrix4x4();
		if (position == null || rotation == null || scale == null) {
			return m;
		}
		if (rotation instanceof Vector3) {
			var sx = Math.sin(rotation[0]);
			var cx = Math.cos(rotation[0]);
			var sy = Math.sin(rotation[1]);
			var cy = Math.cos(rotation[1]);
			var sz = Math.sin(rotation[2]);
			var cz = Math.cos(rotation[2]);
			m[0] = (cy * cz + sy * sx * sz) * scale[0];
			m[1] = cx * sz * scale[0];
			m[2] = (-sy * cz + cy * sx * sz) * scale[0];
			m[4] = (cy * -sz + sy * sx * cz) * scale[1];
			m[5] = cx * cz * scale[1];
			m[6] = (-sy * -sz + cy * sx * cz) * scale[1];
			m[8] = sy * cx * scale[2];
			m[9] = -sx * scale[2];
			m[10] = cy * cx * scale[2];
			m[12] = position[0];
			m[13] = position[1];
			m[14] = position[2];
			m[15] = 1.0;
			return m;
		}

		var x = rotation[0], y = rotation[1], z = rotation[2], w = rotation[3];
		var xx = x * x, yy = y * y, zz = z * z;
		var xy = x * y, xz = x * z, xw = x * w;
		var yz = y * z, yw = y * w, zw = z * w;
		m[0] = (1.0 - 2.0 * (yy + zz)) * scale[0];
		m[1] = (2.0 * (xy + zw)) * scale[0];
		m[2] = (2.0 * (xz - yw)) * scale[0];
		m[4] = (2.0 * (xy - zw)) * scale[1];
		m[5] = (1.0 - 2.0 * (xx + zz)) * scale[1];
		m[6] = (2.0 * (yz + xw)) * scale[1];
		m[8] = (2.0 * (xz + yw)) * scale[2];
		m[9] = (2.0 * (yz - xw)) * scale[2];
		m[10] = (1.0 - 2.0 * (xx + yy)) * scale[2];
		m[12] = position[0];
		m[13] = position[1];
		m[14] = position[2];
		m[15] = 1.0;
		return m;
	}

	static tr(position: Vector3, rotation: Vector3): Matrix4x4;
	static tr(position: Vector3, rotation: Tea.Quaternion): Matrix4x4;
	static tr(position: Vector3, rotation: Vector3 | Tea.Quaternion): Matrix4x4 {
		var m = new Matrix4x4();
		if (position == null || rotation == null) {
			return m;
		}
		if (rotation instanceof Vector3) {
			var sx = Math.sin(rotation[0]);
			var cx = Math.cos(rotation[0]);
			var sy = Math.sin(rotation[1]);
			var cy = Math.cos(rotation[1]);
			var sz = Math.sin(rotation[2]);
			var cz = Math.cos(rotation[2]);
			m[0] = cy * cz + sy * sx * sz;
			m[1] = cx * sz;
			m[2] = -sy * cz + cy * sx * sz;
			m[4] = cy * -sz + sy * sx * cz;
			m[5] = cx * cz;
			m[6] = -sy * -sz + cy * sx * cz;
			m[8] = sy * cx;
			m[9] = -sx;
			m[10] = cy * cx;
			m[12] = position[0];
			m[13] = position[1];
			m[14] = position[2];
			m[15] = 1.0;
			return m;
		}

		var x = rotation[0], y = rotation[1], z = rotation[2], w = rotation[3];
		var xx = x * x, yy = y * y, zz = z * z;
		var xy = x * y, xz = x * z, xw = x * w;
		var yz = y * z, yw = y * w, zw = z * w;
		m[0] = (1.0 - 2.0 * (yy + zz));
		m[1] = (2.0 * (xy + zw));
		m[2] = (2.0 * (xz - yw));
		m[4] = (2.0 * (xy - zw));
		m[5] = (1.0 - 2.0 * (xx + zz));
		m[6] = (2.0 * (yz + xw));
		m[8] = (2.0 * (xz + yw));
		m[9] = (2.0 * (yz - xw));
		m[10] = (1.0 - 2.0 * (xx + yy));
		m[12] = position[0];
		m[13] = position[1];
		m[14] = position[2];
		m[15] = 1.0;
		return m;
	}

	static perspective(fov: number, aspect: number, zNear: number, zFar: number): Matrix4x4 {
		var m = new Matrix4x4();
		fov = Tea.radians(fov);
		var top = Math.tan(fov / 2.0) * zNear;
		var bottom = -top;
		var right = top * aspect;
		var left = -top * aspect;
		m[0] = 2.0 * zNear / (right - left);
		m[5] = 2.0 * zNear / (top - bottom);
		m[8] = (right + left) / (right - left);
		m[9] = (top + bottom) / (top - bottom);
		m[10] = -(zFar + zNear) / (zFar - zNear);
		m[11] = -1.0;
		m[14] = -(2.0 * zFar * zNear) / (zFar - zNear);
		return m;
	}

	static ortho(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): Matrix4x4 {
		var dz = zFar - zNear;
		var m = new Matrix4x4();
		m[0] = 2.0 / (right - left);
		m[5] = 2.0 / (top - bottom);
		m[10] = -2.0 / dz;
		m[12] = -(right + left) / (right - left);
		m[13] = -(top + bottom) / (top - bottom);
		m[14] = -(zFar + zNear) / dz;
		m[15] = 1.0;
		return m;
	}

	static frustum(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): Matrix4x4 {
		var m = new Matrix4x4();
		m[0] = 2.0 * zNear / (right - left);
		m[5] = 2.0 * zNear / (top - bottom);
		m[8] = (right + left) / (right - left);
		m[9] = (top + bottom) / (top - bottom);
		m[10] = -(zFar + zNear) / (zFar - zNear);
		m[11] = -1.0;
		m[14] = -(2.0 * zFar * zNear) / (zFar - zNear);
		return m;
	}

	/** m00 == this[0] */
	get m00(): number		{ return this[0]; }
	set m00(value: number)	{ this[0] = value; }
	/** m10 == this[1] */
	get m10(): number		{ return this[1]; }
	set m10(value: number)	{ this[1] = value; }
	/** m20 == this[2] */
	get m20(): number		{ return this[2]; }
	set m20(value: number)	{ this[2] = value; }
	/** m30 == this[3] */
	get m30(): number		{ return this[3]; }
	set m30(value: number)	{ this[3] = value; }

	/** m01 == this[4] */
	get m01(): number		{ return this[4]; }
	set m01(value: number)	{ this[4] = value; }
	/** m11 == this[5] */
	get m11(): number		{ return this[5]; }
	set m11(value: number)	{ this[5] = value; }
	/** m21 == this[6] */
	get m21(): number		{ return this[6]; }
	set m21(value: number)	{ this[6] = value; }
	/** m31 == this[7] */
	get m31(): number		{ return this[7]; }
	set m31(value: number)	{ this[7] = value; }
	
	/** m02 == this[8] */
	get m02(): number		{ return this[8]; }
	set m02(value: number)	{ this[8] = value; }
	/** m12 == this[9] */
	get m12(): number		{ return this[9]; }
	set m12(value: number)	{ this[9] = value; }
	/** m22 == this[10] */
	get m22(): number		{ return this[10]; }
	set m22(value: number)	{ this[10] = value; }
	/** m32 == this[11] */
	get m32(): number		{ return this[11]; }
	set m32(value: number)	{ this[11] = value; }

	/** m03 == this[12] */
	get m03(): number		{ return this[12]; }
	set m03(value: number)	{ this[12] = value; }
	/** m13 == this[13] */
	get m13(): number		{ return this[13]; }
	set m13(value: number)	{ this[13] = value; }
	/** m23 == this[14] */
	get m23(): number		{ return this[14]; }
	set m23(value: number)	{ this[14] = value; }
	/** m33 == this[15] */
	get m33(): number		{ return this[15]; }
	set m33(value: number)	{ this[15] = value; }

	get isIdentity(): boolean {
		return this.equals(Matrix4x4.identity);
	}

	get transpose(): Matrix4x4 {
		var m = this.clone();
		var t = this;
		m[1]  = t[4]; m[2]  = t[8]; m[3]  = t[12]; 
		m[4]  = t[1]; m[6]  = t[9]; m[7]  = t[13];
		m[8]  = t[2]; m[9]  = t[6]; m[11] = t[14];
		m[12] = t[3]; m[13] = t[7]; m[14] = t[11];
		return m;
	}

	get determinant(): number {
		var m00 = this[0],  m10 = this[1],  m20 = this[2],  m30 = this[3];
		var m01 = this[4],  m11 = this[5],  m21 = this[6],  m31 = this[7];
		var m02 = this[8],  m12 = this[9],  m22 = this[10], m32 = this[11];
		var m03 = this[12], m13 = this[13], m23 = this[14], m33 = this[15];
		return (
			(m00 * m11 * m22 * m33) + (m00 * m12 * m23 * m31) + (m00 * m13 * m21 * m32) +
			(m01 * m10 * m23 * m32) + (m01 * m12 * m20 * m33) + (m01 * m13 * m22 * m30) +
			(m02 * m10 * m21 * m33) + (m02 * m11 * m23 * m30) + (m02 * m13 * m20 * m31) +
			(m03 * m10 * m22 * m31) + (m03 * m11 * m20 * m32) + (m03 * m12 * m21 * m30) -
			(m00 * m11 * m23 * m32) - (m00 * m12 * m21 * m33) - (m00 * m13 * m22 * m31) -
			(m01 * m10 * m22 * m33) - (m01 * m12 * m23 * m30) - (m01 * m13 * m20 * m32) -
			(m02 * m10 * m23 * m31) - (m02 * m11 * m20 * m33) - (m02 * m13 * m21 * m30) -
			(m03 * m10 * m21 * m32) - (m03 * m11 * m22 * m30) - (m03 * m12 * m20 * m31)
		);
	}

	get inverse(): Matrix4x4 {
		var dest = new Matrix4x4();
		var a = this[0],  b = this[1],  c = this[2],  d = this[3],
			e = this[4],  f = this[5],  g = this[6],  h = this[7],
			i = this[8],  j = this[9],  k = this[10], l = this[11],
			m = this[12], n = this[13], o = this[14], p = this[15],
			q = a * f - b * e, r = a * g - c * e,
			s = a * h - d * e, t = b * g - c * f,
			u = b * h - d * f, v = c * h - d * g,
			w = i * n - j * m, x = i * o - k * m,
			y = i * p - l * m, z = j * o - k * n,
			A = j * p - l * n, B = k * p - l * o,
			ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);
		dest[0]  = ( f * B - g * A + h * z) * ivd;
		dest[1]  = (-b * B + c * A - d * z) * ivd;
		dest[2]  = ( n * v - o * u + p * t) * ivd;
		dest[3]  = (-j * v + k * u - l * t) * ivd;
		dest[4]  = (-e * B + g * y - h * x) * ivd;
		dest[5]  = ( a * B - c * y + d * x) * ivd;
		dest[6]  = (-m * v + o * s - p * r) * ivd;
		dest[7]  = ( i * v - k * s + l * r) * ivd;
		dest[8]  = ( e * A - f * y + h * w) * ivd;
		dest[9]  = (-a * A + b * y - d * w) * ivd;
		dest[10] = ( m * u - n * s + p * q) * ivd;
		dest[11] = (-i * u + j * s - l * q) * ivd;
		dest[12] = (-e * z + f * x - g * w) * ivd;
		dest[13] = ( a * z - b * x + c * w) * ivd;
		dest[14] = (-m * t + n * r - o * q) * ivd;
		dest[15] = ( i * t - j * r + k * q) * ivd;
		return dest;
	}

	get rotation(): Tea.Quaternion {
		return this.toQuaternion();
	}

	getValue(row: number, column: number): number {
		return this[row + column * 4];
	}

	setValue(row: number, column: number, value: number): void {
		this[row + column * 4] = value;
	}

	setIdentity(): void {
		this[0]  = 1.0; this[1]  = 0.0; this[2]  = 0.0; this[3]  = 0.0;
		this[4]  = 0.0; this[5]  = 1.0; this[6]  = 0.0; this[7]  = 0.0;
		this[8]  = 0.0; this[9]  = 0.0; this[10] = 1.0; this[11] = 0.0;
		this[12] = 0.0; this[13] = 0.0; this[14] = 0.0; this[15] = 1.0;
	}

	equals(value: Matrix4x4): boolean {
		if (value == null) {
			return false;
		}
		for (var i = 0; i < 16; i++) {
			if (this[i] != value[i]) {
				return false;
			}
		}
		return true;
	}

	approxEquals(value: Matrix4x4): boolean {
		if (value == null) {
			return false;
		}
		for (var i = 0; i < 16; i++) {
			if (Tea.Mathf.approximately(this[i], value[i]) === false) {
				return false;
			}
		}
		return true;
	}

	copy(value: Matrix4x4): Matrix4x4 {
		this[0]  = value[0];
		this[1]  = value[1];
		this[2]  = value[2];
		this[3]  = value[3];
		this[4]  = value[4];
		this[5]  = value[5];
		this[6]  = value[6];
		this[7]  = value[7];
		this[8]  = value[8];
		this[9]  = value[9];
		this[10] = value[10];
		this[11] = value[11];
		this[12] = value[12];
		this[13] = value[13];
		this[14] = value[14];
		this[15] = value[15];
		return this;
	}

	clone(): Matrix4x4 {
		var m = new Matrix4x4();
		m[0]  = this[0];
		m[1]  = this[1];
		m[2]  = this[2];
		m[3]  = this[3];
		m[4]  = this[4];
		m[5]  = this[5];
		m[6]  = this[6];
		m[7]  = this[7];
		m[8]  = this[8];
		m[9]  = this[9];
		m[10] = this[10];
		m[11] = this[11];
		m[12] = this[12];
		m[13] = this[13];
		m[14] = this[14];
		m[15] = this[15];
		return m;
	}

	getColumn(index: number): Tea.Vector4 {
		if (index < 0 || index > 3) {
			return null;
		}
		var n = index * 4;
		return new Tea.Vector4(
			this[n + 0],
			this[n + 1],
			this[n + 2],
			this[n + 3]
		);
	}

	setColumn(index: number, column: Tea.Vector4): void {
		if (index < 0 || index > 3) {
			return;
		}
		var n = index * 4;
		this[n + 0] = column[0];
		this[n + 1] = column[1];
		this[n + 2] = column[2];
		this[n + 3] = column[3];
	}

	getRow(index: number): Tea.Vector4 {
		if (index < 0 || index > 3) {
			return null;
		}
		return new Tea.Vector4(
			this[index + 0],
			this[index + 4],
			this[index + 8],
			this[index + 12]
		);
	}

	setRow(index: number, row: Tea.Vector4): void {
		if (index < 0 || index > 3) {
			return;
		}
		this[index + 0] = row[0];
		this[index + 4] = row[1];
		this[index + 8] = row[2];
		this[index + 12] = row[3];
	}

	setTRS(position: Vector3, rotation: Vector3, scale: Vector3): void;
	setTRS(position: Vector3, rotation: Tea.Quaternion, scale: Vector3): void;
	setTRS(position: Vector3, rotation: Vector3 | Tea.Quaternion, scale: Vector3): void {
		if (position == null || rotation == null || scale == null) {
			return;
		}
		if (rotation instanceof Vector3) {
			var sx = Math.sin(rotation[0]);
			var cx = Math.cos(rotation[0]);
			var sy = Math.sin(rotation[1]);
			var cy = Math.cos(rotation[1]);
			var sz = Math.sin(rotation[2]);
			var cz = Math.cos(rotation[2]);
			this[0] = (cy * cz + sy * sx * sz) * scale[0];
			this[1] = cx * sz * scale[0];
			this[2] = (-sy * cz + cy * sx * sz) * scale[0];
			this[3] = 0.0;
			this[4] = (cy * -sz + sy * sx * cz) * scale[1];
			this[5] = cx * cz * scale[1];
			this[6] = (-sy * -sz + cy * sx * cz) * scale[1];
			this[7] = 0.0;
			this[8] = sy * cx * scale[2];
			this[9] = -sx * scale[2];
			this[10] = cy * cx * scale[2];
			this[11] = 0.0;
			this[12] = position[0];
			this[13] = position[1];
			this[14] = position[2];
			this[15] = 1.0;
			return;
		}

		var x = rotation[0], y = rotation[1], z = rotation[2], w = rotation[3];
		var xx = x * x, yy = y * y, zz = z * z;
		var xy = x * y, xz = x * z, xw = x * w;
		var yz = y * z, yw = y * w, zw = z * w;
		this[0] = (1.0 - 2.0 * (yy + zz)) * scale[0];
		this[1] = (2.0 * (xy + zw)) * scale[0];
		this[2] = (2.0 * (xz - yw)) * scale[0];
		this[3] = 0.0;
		this[4] = (2.0 * (xy - zw)) * scale[1];
		this[5] = (1.0 - 2.0 * (xx + zz)) * scale[1];
		this[6] = (2.0 * (yz + xw)) * scale[1];
		this[7] = 0.0;
		this[8] = (2.0 * (xz + yw)) * scale[2];
		this[9] = (2.0 * (yz - xw)) * scale[2];
		this[10] = (1.0 - 2.0 * (xx + yy)) * scale[2];
		this[11] = 0.0;
		this[12] = position[0];
		this[13] = position[1];
		this[14] = position[2];
		this[15] = 1.0;
	}

	setTR(position: Vector3, rotation: Vector3): void;
	setTR(position: Vector3, rotation: Tea.Quaternion): void;
	setTR(position: Vector3, rotation: Vector3 | Tea.Quaternion): void {
		if (position == null || rotation == null) {
			return;
		}
		if (rotation instanceof Vector3) {
			var sx = Math.sin(rotation[0]);
			var cx = Math.cos(rotation[0]);
			var sy = Math.sin(rotation[1]);
			var cy = Math.cos(rotation[1]);
			var sz = Math.sin(rotation[2]);
			var cz = Math.cos(rotation[2]);
			this[0] = cy * cz + sy * sx * sz;
			this[1] = cx * sz;
			this[2] = -sy * cz + cy * sx * sz;
			this[3] = 0.0;
			this[4] = cy * -sz + sy * sx * cz;
			this[5] = cx * cz;
			this[6] = -sy * -sz + cy * sx * cz;
			this[7] = 0.0;
			this[8] = sy * cx;
			this[9] = -sx;
			this[10] = cy * cx;
			this[11] = 0.0;
			this[12] = position[0];
			this[13] = position[1];
			this[14] = position[2];
			this[15] = 1.0;
			return;
		}

		var x = rotation[0], y = rotation[1], z = rotation[2], w = rotation[3];
		var xx = x * x, yy = y * y, zz = z * z;
		var xy = x * y, xz = x * z, xw = x * w;
		var yz = y * z, yw = y * w, zw = z * w;
		this[0] = (1.0 - 2.0 * (yy + zz));
		this[1] = (2.0 * (xy + zw));
		this[2] = (2.0 * (xz - yw));
		this[3] = 0.0;
		this[4] = (2.0 * (xy - zw));
		this[5] = (1.0 - 2.0 * (xx + zz));
		this[6] = (2.0 * (yz + xw));
		this[7] = 0.0;
		this[8] = (2.0 * (xz + yw));
		this[9] = (2.0 * (yz - xw));
		this[10] = (1.0 - 2.0 * (xx + yy));
		this[11] = 0.0;
		this[12] = position[0];
		this[13] = position[1];
		this[14] = position[2];
		this[15] = 1.0;
	}

	perspective(fov: number, aspect: number, zNear: number, zFar: number): void {
		fov = Tea.radians(fov);
		var top = Math.tan(fov / 2.0) * zNear;
		var bottom = -top;
		var right = top * aspect;
		var left = -right;
		var rml = right - left;
		var tmb = top - bottom;
		var fmn = zFar - zNear;
		var zNear2 = 2.0 * zNear;
		this[0] = zNear2 / rml;
		this[5] = zNear2 / tmb;
		this[8] = (right + left) / rml;
		this[9] = (top + bottom) / tmb;
		this[10] = -(zFar + zNear) / fmn;
		this[11] = -1.0;
		this[14] = -(zNear2 * zFar) / fmn;
		this[1] = this[2] = this[3] = this[4] = 0.0;
		this[6] = this[7] = this[12] = this[13] = 0.0;
		this[15] = 0.0;
	}

	ortho(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): void {
		var dz = zFar - zNear;
		var rml = right - left;
		var tmb = top - bottom;
		this[0] = 2.0 / rml;
		this[5] = 2.0 / tmb;
		this[10] = -2.0 / dz;
		this[12] = -(right + left) / rml;
		this[13] = -(top + bottom) / tmb;
		this[14] = -(zFar + zNear) / dz;
		this[15] = 1.0;
		this[1] = this[2] = this[3] = this[4] = 0.0;
		this[6] = this[7] = this[8] = this[9] = this[11] = 0.0;
	}

	mul(vector: Vector4): Vector4;
	mul(matrix: Matrix4x4): Matrix4x4;
	mul(value: Vector4 | Matrix4x4): Matrix4x4 | Vector4 {
		if (value == null) {
			return null;
		}
		if (value instanceof Matrix4x4) {
			var m = new Matrix4x4();
			var l00 = this[0],   l10 = this[1],   l20 = this[2],   l30 = this[3];
			var l01 = this[4],   l11 = this[5],   l21 = this[6],   l31 = this[7];
			var l02 = this[8],   l12 = this[9],   l22 = this[10],  l32 = this[11];
			var l03 = this[12],  l13 = this[13],  l23 = this[14],  l33 = this[15];
			
			var r00 = value[0],  r10 = value[1],  r20 = value[2],  r30 = value[3];
			var r01 = value[4],  r11 = value[5],  r21 = value[6],  r31 = value[7];
			var r02 = value[8],  r12 = value[9],  r22 = value[10], r32 = value[11];
			var r03 = value[12], r13 = value[13], r23 = value[14], r33 = value[15];
	
			m[0]  = l00 * r00 + l01 * r10 + l02 * r20 + l03 * r30;
			m[1]  = l10 * r00 + l11 * r10 + l12 * r20 + l13 * r30;
			m[2]  = l20 * r00 + l21 * r10 + l22 * r20 + l23 * r30;
			m[3]  = l30 * r00 + l31 * r10 + l32 * r20 + l33 * r30;
	
			m[4]  = l00 * r01 + l01 * r11 + l02 * r21 + l03 * r31;
			m[5]  = l10 * r01 + l11 * r11 + l12 * r21 + l13 * r31;
			m[6]  = l20 * r01 + l21 * r11 + l22 * r21 + l23 * r31;
			m[7]  = l30 * r01 + l31 * r11 + l32 * r21 + l33 * r31;
	
			m[8]  = l00 * r02 + l01 * r12 + l02 * r22 + l03 * r32;
			m[9]  = l10 * r02 + l11 * r12 + l12 * r22 + l13 * r32;
			m[10] = l20 * r02 + l21 * r12 + l22 * r22 + l23 * r32;
			m[11] = l30 * r02 + l31 * r12 + l32 * r22 + l33 * r32;
	
			m[12] = l00 * r03 + l01 * r13 + l02 * r23 + l03 * r33;
			m[13] = l10 * r03 + l11 * r13 + l12 * r23 + l13 * r33;
			m[14] = l20 * r03 + l21 * r13 + l22 * r23 + l23 * r33;
			m[15] = l30 * r03 + l31 * r13 + l32 * r23 + l33 * r33;
			return m;
		} else {
			var t = this;
			var v = value;
			return new Vector4(
				t[0] * v[0] + t[4] * v[1] + t[8] * v[2] + t[12] * v[3],
				t[1] * v[0] + t[5] * v[1] + t[9] * v[2] + t[13] * v[3],
				t[2] * v[0] + t[6] * v[1] + t[10] * v[2] + t[14] * v[3],
				t[3] * v[0] + t[7] * v[1] + t[11] * v[2] + t[15] * v[3]
			);
		}
	}

	mulSelf(value: Matrix4x4): Matrix4x4 {
		if (value == null) {
			return this;
		}
		var l00 = this[0],   l10 = this[1],   l20 = this[2],   l30 = this[3];
		var l01 = this[4],   l11 = this[5],   l21 = this[6],   l31 = this[7];
		var l02 = this[8],   l12 = this[9],   l22 = this[10],  l32 = this[11];
		var l03 = this[12],  l13 = this[13],  l23 = this[14],  l33 = this[15];
		var r00 = value[0],  r10 = value[1],  r20 = value[2],  r30 = value[3];
		var r01 = value[4],  r11 = value[5],  r21 = value[6],  r31 = value[7];
		var r02 = value[8],  r12 = value[9],  r22 = value[10], r32 = value[11];
		var r03 = value[12], r13 = value[13], r23 = value[14], r33 = value[15];
		this[0]  = l00 * r00 + l01 * r10 + l02 * r20 + l03 * r30;
		this[1]  = l10 * r00 + l11 * r10 + l12 * r20 + l13 * r30;
		this[2]  = l20 * r00 + l21 * r10 + l22 * r20 + l23 * r30;
		this[3]  = l30 * r00 + l31 * r10 + l32 * r20 + l33 * r30;
		this[4]  = l00 * r01 + l01 * r11 + l02 * r21 + l03 * r31;
		this[5]  = l10 * r01 + l11 * r11 + l12 * r21 + l13 * r31;
		this[6]  = l20 * r01 + l21 * r11 + l22 * r21 + l23 * r31;
		this[7]  = l30 * r01 + l31 * r11 + l32 * r21 + l33 * r31;
		this[8]  = l00 * r02 + l01 * r12 + l02 * r22 + l03 * r32;
		this[9]  = l10 * r02 + l11 * r12 + l12 * r22 + l13 * r32;
		this[10] = l20 * r02 + l21 * r12 + l22 * r22 + l23 * r32;
		this[11] = l30 * r02 + l31 * r12 + l32 * r22 + l33 * r32;
		this[12] = l00 * r03 + l01 * r13 + l02 * r23 + l03 * r33;
		this[13] = l10 * r03 + l11 * r13 + l12 * r23 + l13 * r33;
		this[14] = l20 * r03 + l21 * r13 + l22 * r23 + l23 * r33;
		this[15] = l30 * r03 + l31 * r13 + l32 * r23 + l33 * r33;
		return this;
	}

	premulSelf(value: Matrix4x4): Matrix4x4 {
		if (value == null) {
			return this;
		}
		var l00 = value[0],  l10 = value[1],  l20 = value[2],  l30 = value[3];
		var l01 = value[4],  l11 = value[5],  l21 = value[6],  l31 = value[7];
		var l02 = value[8],  l12 = value[9],  l22 = value[10], l32 = value[11];
		var l03 = value[12], l13 = value[13], l23 = value[14], l33 = value[15];
		var r00 = this[0],   r10 = this[1],   r20 = this[2],   r30 = this[3];
		var r01 = this[4],   r11 = this[5],   r21 = this[6],   r31 = this[7];
		var r02 = this[8],   r12 = this[9],   r22 = this[10],  r32 = this[11];
		var r03 = this[12],  r13 = this[13],  r23 = this[14],  r33 = this[15];
		this[0]  = l00 * r00 + l01 * r10 + l02 * r20 + l03 * r30;
		this[1]  = l10 * r00 + l11 * r10 + l12 * r20 + l13 * r30;
		this[2]  = l20 * r00 + l21 * r10 + l22 * r20 + l23 * r30;
		this[3]  = l30 * r00 + l31 * r10 + l32 * r20 + l33 * r30;
		this[4]  = l00 * r01 + l01 * r11 + l02 * r21 + l03 * r31;
		this[5]  = l10 * r01 + l11 * r11 + l12 * r21 + l13 * r31;
		this[6]  = l20 * r01 + l21 * r11 + l22 * r21 + l23 * r31;
		this[7]  = l30 * r01 + l31 * r11 + l32 * r21 + l33 * r31;
		this[8]  = l00 * r02 + l01 * r12 + l02 * r22 + l03 * r32;
		this[9]  = l10 * r02 + l11 * r12 + l12 * r22 + l13 * r32;
		this[10] = l20 * r02 + l21 * r12 + l22 * r22 + l23 * r32;
		this[11] = l30 * r02 + l31 * r12 + l32 * r22 + l33 * r32;
		this[12] = l00 * r03 + l01 * r13 + l02 * r23 + l03 * r33;
		this[13] = l10 * r03 + l11 * r13 + l12 * r23 + l13 * r33;
		this[14] = l20 * r03 + l21 * r13 + l22 * r23 + l23 * r33;
		this[15] = l30 * r03 + l31 * r13 + l32 * r23 + l33 * r33;
		return this;
	}

	multiplyPoint(point: Tea.Vector3): Tea.Vector3 {
		var tx = point[0], ty = point[1], tz = point[2];
		var x = this[0] * tx + this[4] * ty + this[8]  * tz + this[12];
		var y = this[1] * tx + this[5] * ty + this[9]  * tz + this[13];
		var z = this[2] * tx + this[6] * ty + this[10] * tz + this[14];
		var w = this[3] * tx + this[7] * ty + this[11] * tz + this[15];
		if (w !== 0.0) {
			w = 1 / w;
		}
		return new Tea.Vector3(
			x * w, y * w, z * w
		);
	}

	multiplyPoint3x4(point: Tea.Vector3): Tea.Vector3 {
		var tx = point[0], ty = point[1], tz = point[2];
		var x = this[0] * tx + this[4] * ty + this[8]  * tz + this[12];
		var y = this[1] * tx + this[5] * ty + this[9]  * tz + this[13];
		var z = this[2] * tx + this[6] * ty + this[10] * tz + this[14];
		return new Tea.Vector3(
			x, y, z
		);
	}

	multiplyVector(vector: Tea.Vector3): Tea.Vector3 {
		var tx = vector[0], ty = vector[1], tz = vector[2];
		var x = this[0] * tx + this[4] * ty + this[8]  * tz;
		var y = this[1] * tx + this[5] * ty + this[9]  * tz;
		var z = this[2] * tx + this[6] * ty + this[10] * tz;
		return new Tea.Vector3(
			x, y, z
		);
	}

	/*
	transformPlane(plane: Tea.Plane): Tea.Plane {
	}
	//*/

	toggleHand(): void {
		this[8]  *= -1.0;
		this[9]  *= -1.0;
		this[10] *= -1.0;
		this[11] *= -1.0;
	}

	toQuaternion(): Tea.Quaternion {
		var trace = this[0] + this[5] + this[10];
		if (trace > 0.0) {
			var s = Math.sqrt(trace + 1);
			var t = 0.5 / s;
			return new Tea.Quaternion(
				(this.m21 - this.m12) * t,
				(this.m02 - this.m20) * t,
				(this.m10 - this.m01) * t,
				s * 0.5
			);
		}

		var i = 0;
		if (this.m11 > this.m00) {
			i = 1;
		}
		if (this.m22 > this.getValue(i, i)) {
			i = 2;
		}

		var next = [1, 2, 0];
		var j = next[i];
		var k = next[j];

		var s = Math.sqrt(
			this.getValue(i, i) -
			this.getValue(j, j) -
			this.getValue(k, k) + 1
		);

		var t = s;
		if (s != 0) {
			t = 0.5 / s;
		}

		var q = new Tea.Quaternion();
		q[i] = s * 0.5;
		q[j] = (this.getValue(j, i) + this.getValue(i, j)) * t;
		q[k] = (this.getValue(k, i) + this.getValue(i, k)) * t;
		q[3] = (this.getValue(k, j) - this.getValue(j, k)) * t;
		return q;
	}

	toString(): string {
		var t = new Array(16);
		for (var i = 0; i < 16; i++) {
			t[i] = this[i].toFixed(5);
		}
		return (
			"[\n" +
			"\t" + t[0] + ", " + t[4] + ", " + t[8] + ", " + t[12] + ",\n" +
			"\t" + t[1] + ", " + t[5] + ", " + t[9] + ", " + t[13] + ",\n" +
			"\t" + t[2] + ", " + t[6] + ", " + t[10] + ", " + t[14] + ",\n" +
			"\t" + t[3] + ", " + t[7] + ", " + t[11] + ", " + t[15] + "\n" +
			"]"
		);
	}
}

Matrix4x4.init();
