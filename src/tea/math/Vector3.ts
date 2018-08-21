import * as Tea from "../Tea";

export class Vector3 extends Array<number> {
	constructor(x: number = 0, y: number = 0, z: number = 0) {
		super(3);
		this.x = x;
		this.y = y;
		this.z = z;
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

	static orthoNormalize(normal: Vector3, tangent: Vector3): void {
		var e1 = normal.mul(1 / normal.magnitude);
		var f2 = tangent.sub(e1.mul(tangent.dot(e1)));
		var e2 = f2.mul(1 / f2.magnitude);
		normal.set(e1.x, e1.y, e1.z);
		tangent.set(e2.x, e2.y, e2.z);
	}

	get x(): number {
		return this[0];
	}
	set x(value: number) {
		this[0] = value;
	}

	get y(): number {
		return this[1];
	}
	set y(value: number) {
		this[1] = value;
	}

	get z(): number {
		return this[2];
	}
	set z(value: number) {
		this[2] = value;
	}

	get magnitude(): number {
		var x = this.x, y = this.y, z = this.z;
		return Math.sqrt(x * x + y * y + z * z);
	}

	get sqrMagnitude(): number {
		var x = this.x, y = this.y, z = this.z;
		return x * x + y * y + z * z;
	}

	get normalized(): Vector3 {
		var magnitude = this.magnitude;
		if (Tea.Mathf.approximately(magnitude, 0)) {
			return new Vector3();
		}
		var m = 1 / magnitude;
		return new Vector3(
			this.x * m,
			this.y * m,
			this.z * m
		);
	}

	clone(): Vector3 {
		return new Vector3(
			this.x,
			this.y,
			this.z
		);
	}

	copy(value: Vector3): void {
		this.x = value.x;
		this.y = value.y;
		this.z = value.z;
	}

	set(x: number, y: number, z: number): void {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	equals(value: Vector3): boolean {
		if (value == null) {
			return false;
		}
		return this.x === value.x
			&& this.y === value.y
			&& this.z === value.z;
	}

	approxEquals(value: Vector3): boolean {
		if (value == null) {
			return false;
		}
		return Tea.Mathf.approximately(this.x, value.x)
			&& Tea.Mathf.approximately(this.y, value.y)
			&& Tea.Mathf.approximately(this.z, value.z);
	}

	toString(): string {
		const t = new Array(3);
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
				this.x + value.x,
				this.y + value.y,
				this.z + value.z
			);
		}
		return new Vector3(
			this.x + value,
			this.y + value,
			this.z + value
		);
	}

	add$(value: number): void;
	add$(value: Vector3): void;
	add$(value: number | Vector3): void {
		if (value instanceof Vector3) {
			this.x += value.x;
			this.y += value.y;
			this.z += value.z;
			return;
		}
		this.x += value;
		this.y += value;
		this.z += value;
	}

	sub(value: number): Vector3;
	sub(value: Vector3): Vector3;
	sub(value: number | Vector3): Vector3 {
		if (value instanceof Vector3) {
			return new Vector3(
				this.x - value.x,
				this.y - value.y,
				this.z - value.z
			);
		}
		return new Vector3(
			this.x - value,
			this.y - value,
			this.z - value
		);
	}

	sub$(value: number): void;
	sub$(value: Vector3): void;
	sub$(value: number | Vector3): void {
		if (value instanceof Vector3) {
			this.x -= value.x;
			this.y -= value.y;
			this.z -= value.z;
			return;
		}
		this.x -= value;
		this.y -= value;
		this.z -= value;
	}

	mul(value: number): Vector3 {
		return new Vector3(
			this.x * value,
			this.y * value,
			this.z * value
		);
	}

	mul$(value: number): void {
		this.x *= value;
		this.y *= value;
		this.z *= value;
	}

	div(value: number): Vector3 {
		return new Vector3(
			this.x / value,
			this.y / value,
			this.z / value
		);
	}

	div$(value: number): void {
		this.x /= value;
		this.y /= value;
		this.z /= value;
	}

	dot(value: Vector3): number {
		return this.x * value.x +
			this.y * value.y +
			this.z * value.z;
	}

	cross(value: Vector3): Vector3 {
		var x = this.x, y = this.y, z = this.z;
		return new Vector3(
			y * value.z - z * value.y,
			z * value.x - x * value.z,
			x * value.y - y * value.x
		);
	}

	cross$(value: Vector3): void {
		var x = this.x, y = this.y, z = this.z;
		this.x = y * value.z - z * value.y;
		this.y = z * value.x - x * value.z;
		this.z = x * value.y - y * value.x;
	}

	scale(value: Vector3): Vector3 {
		return new Vector3(
			this.x * value.x,
			this.y * value.y,
			this.z * value.z
		);
	}

	scale$(value: Vector3): void {
		this.x *= value.x;
		this.y *= value.y;
		this.z *= value.z;
	}

	rotateX(radian: number): Vector3 {
		var y = this.y, z = this.z;
		var sin = Math.sin(radian);
		var cos = Math.cos(radian);
		return new Vector3(
			this.x,
			cos * y + -sin * z,
			sin * y + cos * z
		);
	}

	rotateX$(radian: number): void {
		var y = this.y, z = this.z;
		var sin = Math.sin(radian);
		var cos = Math.cos(radian);
		this.y = cos * y + -sin * z;
		this.z = sin * y + cos * z;
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

	rotateY$(radian: number): void {
		var x = this.x, z = this.z;
		var sin = Math.sin(radian);
		var cos = Math.cos(radian);
		this.x = cos * x + sin * z;
		this.z = -sin * x + cos * z;
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

	rotateZ$(radian: number): void {
		var x = this.x, y = this.y;
		var sin = Math.sin(radian);
		var cos = Math.cos(radian);
		this.x = cos * x + -sin * y;
		this.y = sin * x + cos * y;
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

	rotate$(vector: Vector3): void {
		var x = this.x, y = this.y, z = this.z;
		var sin = Math.sin, cos = Math.cos;
		y = cos(vector.x) * y + -sin(vector.x) * z;
		z = sin(vector.x) * y + cos(vector.x) * z;
		x = cos(vector.y) * x + sin(vector.y) * z;
		this.z = -sin(vector.y) * x + cos(vector.y) * z;
		this.x = cos(vector.z) * x + -sin(vector.z) * y;
		this.y = sin(vector.z) * x + cos(vector.z) * y;
	}

	applyMatrix4(matrix: Tea.Matrix4x4): void {
		const tx = this.x;
		const ty = this.y;
		const tz = this.z;

		const x = matrix[0] * tx + matrix[4] * ty + matrix[8]  * tz + matrix[12];
		const y = matrix[1] * tx + matrix[5] * ty + matrix[9]  * tz + matrix[13];
		const z = matrix[2] * tx + matrix[6] * ty + matrix[10] * tz + matrix[14];
		let   w = matrix[3] * tx + matrix[7] * ty + matrix[11] * tz + matrix[15];
	
		if ( w !== 0 ) {
			w = 1 / w;
		}
	
		this.x = x * w;
		this.y = y * w;
		this.z = z * w;
	}
}
