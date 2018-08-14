import { Matrix4 } from "./Matrix4";
import { Matrix4x4 } from "./Matrix4x4";

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
		const vector3 = current.clone();
		let diff = current.sub(target);
		const magnitude = diff.magnitude;
		const ratio = Math.min(magnitude, maxDistanceDelta) / magnitude;
		diff = diff.mul(ratio);
		return vector3.sub(diff);
	}

	static dot(a: Vector3, b: Vector3): number {
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}

	static cross(a: Vector3, b: Vector3): Vector3 {
		return new Vector3(
			a.y * b.z - a.z * b.y,
			a.z * b.x - a.x * b.z,
			a.x * b.y - a.y * b.x
		);
	}

	static angle(a: Vector3, b: Vector3): number {
		const ma = a.magnitude;
		const mb = b.magnitude;
		const cos = this.dot(a, b) / (ma * mb);
		return Math.acos(cos);
	}

	static distance(a: Vector3, b: Vector3): number {
		return a.sub(b).magnitude;
	}

	static normalize(value: Vector3): Vector3 {
		return value.normalized;
	}

	static scale(a: Vector3, b: Vector3): Vector3 {
		return new Vector3(
			a.x * b.x,
			a.y * b.y,
			a.z * b.z
		);
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
		const x = this.x, y = this.y, z = this.z;
		return Math.sqrt(x * x + y * y + z * z);
	}

	get normalized(): Vector3 {
		const x = this.x, y = this.y, z = this.z;
		const m = 1 / this.magnitude;
		return new Vector3(x * m, y * m, z * m);
	}

	clone(): Vector3 {
		const vector3 = new Vector3();
		vector3.x = this.x;
		vector3.y = this.y;
		vector3.z = this.z;
		return vector3;
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

	toString(): string {
		const t = new Array(3);
		for (var i = 0; i < 3; i++) {
			t[i] = this[i].toFixed(5);
		}
		return (
			"[x: " + t[0] + ", y: " + t[1] + ", z: " + t[2] + "]"
		);
	}

	add(value: Vector3): Vector3 {
		return new Vector3(
			this.x + value.x,
			this.y + value.y,
			this.z + value.z
		);
	}

	sub(value: Vector3): Vector3 {
		return new Vector3(
			this.x - value.x,
			this.y - value.y,
			this.z - value.z
		);
	}

	mul(value: number): Vector3 {
		return new Vector3(
			this.x * value,
			this.y * value,
			this.z * value
		);
	}

	div(value: number): Vector3 {
		return new Vector3(
			this.x / value,
			this.y / value,
			this.z / value
		);
	}

	rotateX(radian: number): void {
		const y = this.y, z = this.z;
		const sin = Math.sin(radian);
		const cos = Math.cos(radian);
		this.y = cos * y + -sin * z;
		this.z = sin * y + cos * z;
	}

	rotateY(radian: number): void {
		const x = this.x, z = this.z;
		const sin = Math.sin(radian);
		const cos = Math.cos(radian);
		this.x = cos * x + sin * z;
		this.z = -sin * x + cos * z;
	}

	rotateZ(radian: number): void {
		const x = this.x, y = this.y;
		const sin = Math.sin(radian);
		const cos = Math.cos(radian);
		this.x = cos * x + -sin * y;
		this.y = sin * x + cos * y;
	}

	applyMatrix4(matrix: Matrix4x4): void {
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
