import { Vector3 } from "./Vector3";

export class Vector4 extends Array<number> {
	constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
		super(4);
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}

	static get zero(): Vector4 {
		return new Vector4(0, 0, 0, 0);
	}

	static get one(): Vector4 {
		return new Vector4(1, 1, 1, 1);
	}

	static get positiveInfinity(): Vector4 {
		return new Vector4(Infinity, Infinity, Infinity, Infinity);
	}

	static get negativeInfinity(): Vector4 {
		return new Vector4(-Infinity, -Infinity, -Infinity, -Infinity);
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

	get w(): number {
		return this[3];
	}
	set w(value: number) {
		this[3] = value;
	}

	get magnitude(): number {
		const x = this.x, y = this.y, z = this.z, w = this.w;
		return Math.sqrt(x * x + y * y + z * z + w * w);
	}

	get normalized(): Vector4 {
		const x = this.x, y = this.y, z = this.z, w = this.w;
		const m = 1 / this.magnitude;
		return new Vector4(x * m, y * m, z * m, w * m);
	}

	set(x: number, y: number, z: number, w: number): void {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}

	equals(value: Vector4): boolean {
		if (value == null) {
			return false;
		}
		return this.x === value.x
			&& this.y === value.y
			&& this.z === value.z
			&& this.w === value.w;
	}

	toString(): string {
		const t = new Array(4);
		for (let i = 0; i < 4; i++) {
			t[i] = this[i].toFixed(5);
		}
		return (
			"[x: " + t[0] + ", y: " + t[1] + ", " +
			 "z: " + t[2] + ", w: " + t[3] + "]"
		);
	}

	toVector3(): Vector3 {
		return new Vector3(this.x, this.y, this.z);
	}

	add(value: Vector4): Vector4 {
		return new Vector4(
			this.x + value.x,
			this.y + value.y,
			this.z + value.z,
			this.w + value.w
		);
	}

	sub(value: Vector4): Vector4 {
		return new Vector4(
			this.x - value.x,
			this.y - value.y,
			this.z - value.z,
			this.w - value.w
		);
	}

	mul(value: number): Vector4 {
		return new Vector4(
			this.x * value,
			this.y * value,
			this.z * value,
			this.w * value
		);
	}

	div(value: number): Vector4 {
		return new Vector4(
			this.x / value,
			this.y / value,
			this.z / value,
			this.w / value
		);
	}
}
