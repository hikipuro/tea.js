import * as Tea from "../Tea";
import { Vector3 } from "./Vector3";

export class Matrix4 extends Array<number> {
	constructor() {
		super(16);
		this.fill(0);
	}

	static get zero(): Matrix4 {
		return new Matrix4();
	}

	static get identity(): Matrix4 {
		const m = new Matrix4();
		m[0] = m[5] = m[10] = m[15] = 1;
		return m;
	}

	static fromArray(array: Array<number>, offset: number = 0): Matrix4 {
		const m = new Matrix4();
		for (let i = 0; i < 16; i++) {
			m[i] = array[i + offset];
		}
		return m;
	}

	static translate(vector: Vector3): Matrix4;
	static translate(x: number, y: number, z: number): Matrix4;
	static translate(x: Vector3 | number, y: number = 0, z: number = 0): Matrix4 {
		const m = Matrix4.identity;
		if (x == null) {
			return null;
		}
		if (x instanceof Vector3) {
			m[12] = x.x;
			m[13] = x.y;
			m[14] = x.z;
		} else {
			m[12] = x;
			m[13] = y;
			m[14] = z;
		}
		return m;
	}

	static scale(vector: Vector3): Matrix4 {
		const m = Matrix4.identity;
		if (vector == null) {
			return m;
		}
		m[1]  = vector.x;
		m[5]  = vector.y;
		m[10] = vector.z;
		return m;
	}

	static shear(vector: Vector3): Matrix4 {
		const m = Matrix4.identity;
		if (vector == null) {
			return m;
		}
		m[1] = m[2] = vector.x;
		m[4] = m[6] = vector.y;
		m[8] = m[9] = vector.z;
		return m;
	}

	static rotateX(radians: number): Matrix4 {
		const m = Matrix4.identity;
		const sin = Math.sin(radians);
		const cos = Math.cos(radians);
		m[5] = cos;
		m[6] = sin;
		m[9] = -sin;
		m[10] = cos;
		return m;
	}

	static rotateY(radians: number): Matrix4 {
		const m = Matrix4.identity;
		const sin = Math.sin(radians);
		const cos = Math.cos(radians);
		m[0] = cos;
		m[2] = -sin;
		m[8] = sin;
		m[10] = cos;
		return m;
	}

	static rotateZ(radians: number): Matrix4 {
		const m = Matrix4.identity;
		const sin = Math.sin(radians);
		const cos = Math.cos(radians);
		m[0] = cos;
		m[1] = sin;
		m[4] = -sin;
		m[5] = cos;
		return m;
	}

	static rotateZYX(vector: Vector3): Matrix4 {
		let m = Matrix4.identity;
		if (vector == null) {
			return m;
		}
		const x = vector.x;
		const y = vector.y;
		const z = vector.z;
		m = m.mul(Matrix4.rotateZ(z));
		m = m.mul(Matrix4.rotateY(y));
		m = m.mul(Matrix4.rotateX(x));
		return m;
	}

	static rotateYXZ(vector: Vector3): Matrix4 {
		let m = Matrix4.identity;
		if (vector == null) {
			return m;
		}
		const x = vector.x;
		const y = vector.y;
		const z = vector.z;
		m = m.mul(Matrix4.rotateY(y));
		m = m.mul(Matrix4.rotateX(x));
		m = m.mul(Matrix4.rotateZ(z));
		return m;
	}

	static perspective(fovY: number, aspect: number, near: number, far: number): Matrix4 {
		const m = new Matrix4();
		const zoomY = 1 / Math.tan(Tea.radians(fovY) / 2);
		const zoomX = zoomY / aspect;
		m[0] = zoomX;
		m[5] = zoomY;
		m[10] = -(far + near) / (far - near);
		m[11] = -1;
		m[14] = -2 * far * (near / (far - near));
		return m;
	}

	static ortho(size: number, aspect: number, near: number, far: number): Matrix4 {
		const m = new Matrix4();
		//size *= 2;
		m[0] = 1 / (size * aspect);
		m[5] = 1 / size;
		m[10] = -2 / (far - near);
		m[14] = -(far + near) / (far - near);
		m[15] = 1;
		return m;
	}

	get m00(): number		{ return this[0]; }
	set m00(value: number)	{ this[0] = value; }
	get m10(): number		{ return this[1]; }
	set m10(value: number)	{ this[1] = value; }
	get m20(): number		{ return this[2]; }
	set m20(value: number)	{ this[2] = value; }
	get m30(): number		{ return this[3]; }
	set m30(value: number)	{ this[3] = value; }

	get m01(): number		{ return this[4]; }
	set m01(value: number)	{ this[4] = value; }
	get m11(): number		{ return this[5]; }
	set m11(value: number)	{ this[5] = value; }
	get m21(): number		{ return this[6]; }
	set m21(value: number)	{ this[6] = value; }
	get m31(): number		{ return this[7]; }
	set m31(value: number)	{ this[7] = value; }
	
	get m02(): number		{ return this[8]; }
	set m02(value: number)	{ this[8] = value; }
	get m12(): number		{ return this[9]; }
	set m12(value: number)	{ this[9] = value; }
	get m22(): number		{ return this[10]; }
	set m22(value: number)	{ this[10] = value; }
	get m32(): number		{ return this[11]; }
	set m32(value: number)	{ this[11] = value; }

	get m03(): number		{ return this[12]; }
	set m03(value: number)	{ this[12] = value; }
	get m13(): number		{ return this[13]; }
	set m13(value: number)	{ this[13] = value; }
	get m23(): number		{ return this[14]; }
	set m23(value: number)	{ this[14] = value; }
	get m33(): number		{ return this[15]; }
	set m33(value: number)	{ this[15] = value; }

	get isIdentity(): boolean {
		return this.equals(Matrix4.identity);
	}

	get transpose(): Matrix4 {
		const m = new Matrix4();
		const t = this;
		m[0]  = t[0]; m[1]  = t[4]; m[2]  = t[8];  m[3]  = t[12]; 
		m[4]  = t[1]; m[5]  = t[5]; m[6]  = t[9];  m[7]  = t[13];
		m[8]  = t[2]; m[9]  = t[6]; m[10] = t[10]; m[11] = t[14];
		m[12] = t[3]; m[13] = t[7]; m[14] = t[11]; m[15] = t[15];
		return m;
	}

	get determinant(): number {
		const m00 = this[0],  m10 = this[1],  m20 = this[2],  m30 = this[3];
		const m01 = this[4],  m11 = this[5],  m21 = this[6],  m31 = this[7];
		const m02 = this[8],  m12 = this[9],  m22 = this[10], m32 = this[11];
		const m03 = this[12], m13 = this[13], m23 = this[14], m33 = this[15];
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

	get inverse(): Matrix4 {
		const m = new Matrix4();
		const m11 = this[0], m21 = this[4], m31 = this[8],  m41 = this[12];
		const m12 = this[1], m22 = this[5], m32 = this[9],  m42 = this[13];
		const m13 = this[2], m23 = this[6], m33 = this[10], m43 = this[14];
		const m14 = this[3], m24 = this[7], m34 = this[11], m44 = this[15];

		m[0] =  (m22 * m33 * m44) + (m23 * m34 * m42) + (m24 * m32 * m43) -
				(m22 * m34 * m43) - (m23 * m32 * m44) - (m24 * m33 * m42);
		m[1] =  (m12 * m34 * m43) + (m13 * m32 * m44) + (m14 * m33 * m42) -
				(m12 * m33 * m44) - (m23 * m34 * m42) - (m14 * m32 * m43);
		m[2] =  (m12 * m23 * m44) + (m13 * m24 * m42) + (m14 * m22 * m43) -
				(m12 * m24 * m43) - (m13 * m22 * m44) - (m14 * m23 * m42);
		m[3] =  (m12 * m24 * m33) + (m13 * m22 * m34) + (m14 * m23 * m32) -
				(m12 * m23 * m34) - (m13 * m24 * m32) - (m14 * m22 * m33);

		m[4] =  (m21 * m34 * m43) + (m23 * m31 * m44) + (m24 * m33 * m41) -
				(m21 * m33 * m44) - (m23 * m34 * m41) - (m24 * m31 * m43);
		m[5] =  (m11 * m33 * m44) + (m13 * m34 * m41) + (m14 * m31 * m43) -
				(m11 * m34 * m43) - (m13 * m31 * m44) - (m14 * m33 * m41);
		m[6] =  (m11 * m24 * m43) + (m13 * m21 * m44) + (m14 * m23 * m41) -
				(m11 * m23 * m44) - (m13 * m24 * m41) - (m14 * m21 * m43);
		m[7] =  (m11 * m23 * m34) + (m13 * m24 * m31) + (m14 * m21 * m33) -
				(m11 * m24 * m33) - (m13 * m21 * m34) - (m14 * m23 * m31);

		m[8] =  (m21 * m32 * m44) + (m22 * m34 * m41) + (m24 * m31 * m42) -
				(m21 * m34 * m42) - (m22 * m31 * m44) - (m24 * m32 * m41);
		m[9] =  (m11 * m34 * m42) + (m12 * m31 * m44) + (m14 * m32 * m41) -
				(m11 * m32 * m44) - (m12 * m34 * m41) - (m14 * m31 * m42);
		m[10] = (m11 * m22 * m44) + (m12 * m24 * m41) + (m14 * m21 * m42) -
				(m11 * m24 * m42) - (m12 * m21 * m44) - (m14 * m22 * m41);
		m[11] = (m11 * m24 * m32) + (m12 * m21 * m34) + (m14 * m22 * m31) -
				(m11 * m22 * m34) - (m12 * m24 * m31) - (m14 * m21 * m32);

		m[12] = (m21 * m33 * m42) + (m22 * m31 * m43) + (m23 * m32 * m41) -
				(m21 * m32 * m43) - (m22 * m33 * m41) - (m23 * m31 * m42);
		m[13] = (m11 * m32 * m43) + (m12 * m33 * m41) + (m13 * m31 * m42) -
				(m11 * m33 * m42) - (m12 * m31 * m43) - (m13 * m32 * m41);
		m[14] = (m11 * m23 * m42) + (m12 * m21 * m43) + (m13 * m22 * m41) -
				(m11 * m22 * m43) - (m12 * m23 * m41) - (m13 * m21 * m42);
		m[15] = (m11 * m22 * m44) + (m12 * m23 * m31) + (m13 * m21 * m32) -
				(m11 * m23 * m32) - (m12 * m21 * m33) - (m13 * m22 * m31);
		return m;
	}

	equals(matrix: Matrix4): boolean {
		if (matrix == null) {
			return false;
		}
		for (let i = 0; i < 16; i++) {
			if (this[i] != matrix[i]) {
				return false;
			}
		}
		return true;
	}

	clone(): Matrix4 {
		const m = new Matrix4();
		for (let i = 0; i < 16; i++) {
			m[i] = this[i];
		}
		return m;
	}

	set(m00: number, m01: number, m02: number, m03: number,
		m10: number, m11: number, m12: number, m13: number,
		m20: number, m21: number, m22: number, m23: number,
		m30: number, m31: number, m32: number, m33: number)
	{
		const t = this;
		t[0]  = m00; t[1]  = m10; t[2]  = m20; t[3]  = m30;
		t[4]  = m01; t[5]  = m11; t[6]  = m21; t[7]  = m31;
		t[8]  = m02; t[9]  = m12; t[10] = m22; t[11] = m32;
		t[12] = m03; t[13] = m13; t[14] = m23; t[15] = m33;
	}

	mul(matrix: Matrix4): Matrix4 {
		if (matrix == null) {
			return null;
		}
		const m = new Matrix4();
		const l00 = this[0],    l10 = this[1],    l20 = this[2],    l30 = this[3];
		const l01 = this[4],    l11 = this[5],    l21 = this[6],    l31 = this[7];
		const l02 = this[8],    l12 = this[9],    l22 = this[10],   l32 = this[11];
		const l03 = this[12],   l13 = this[13],   l23 = this[14],   l33 = this[15];
		
		const r00 = matrix[0],  r10 = matrix[1],  r20 = matrix[2],  r30 = matrix[3];
		const r01 = matrix[4],  r11 = matrix[5],  r21 = matrix[6],  r31 = matrix[7];
		const r02 = matrix[8],  r12 = matrix[9],  r22 = matrix[10], r32 = matrix[11];
		const r03 = matrix[12], r13 = matrix[13], r23 = matrix[14], r33 = matrix[15];

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
	}

	lookAt(eye, center, up): Matrix4 {
		const result = new Matrix4();
		var eyeX    = eye[0],    eyeY    = eye[1],    eyeZ    = eye[2],
			upX     = up[0],     upY     = up[1],     upZ     = up[2],
			centerX = center[0], centerY = center[1], centerZ = center[2];
		if(eyeX == centerX && eyeY == centerY && eyeZ == centerZ){return Matrix4.identity;}
		var x0, x1, x2, y0, y1, y2, z0, z1, z2, l;
		z0 = eyeX - center[0]; z1 = eyeY - center[1]; z2 = eyeZ - center[2];
		l = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
		z0 *= l; z1 *= l; z2 *= l;
		x0 = upY * z2 - upZ * z1;
		x1 = upZ * z0 - upX * z2;
		x2 = upX * z1 - upY * z0;
		l = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
		if(!l){
			x0 = 0; x1 = 0; x2 = 0;
		} else {
			l = 1 / l;
			x0 *= l; x1 *= l; x2 *= l;
		}
		y0 = z1 * x2 - z2 * x1; y1 = z2 * x0 - z0 * x2; y2 = z0 * x1 - z1 * x0;
		l = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
		if(!l){
			y0 = 0; y1 = 0; y2 = 0;
		} else {
			l = 1 / l;
			y0 *= l; y1 *= l; y2 *= l;
		}
		result[0] = x0; result[1] = y0; result[2]  = z0; result[3]  = 0;
		result[4] = x1; result[5] = y1; result[6]  = z1; result[7]  = 0;
		result[8] = x2; result[9] = y2; result[10] = z2; result[11] = 0;
		result[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
		result[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
		result[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
		result[15] = 1;
		return result;
	}

	toString(): string {
		const t = this;
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
