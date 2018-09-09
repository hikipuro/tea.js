import { Vector3 } from "./Vector3";

export class Vector4 extends Array<number> {
	constructor(x: number, y: number, z: number, w: number);
	constructor(vector3: Vector3, w: number);
	constructor(x: number | Vector3 = 0, y: number = 0, z: number = 0, w: number = 0) {
		super(4);
		if (x instanceof Vector3) {
			this[0] = x[0];
			this[1] = x[1];
			this[2] = x[2];
			this[3] = y;
		} else {
			this[0] = x;
			this[1] = y;
			this[2] = z;
			this[3] = w;
		}
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

	get magnitude(): number {
		var x = this[0], y = this[1], z = this[2], w = this[3];
		return Math.sqrt(x * x + y * y + z * z + w * w);
	}

	get normalized(): Vector4 {
		var x = this[0], y = this[1], z = this[2], w = this[3];
		var m = 1 / this.magnitude;
		return new Vector4(x * m, y * m, z * m, w * m);
	}

	set(x: number, y: number, z: number, w: number): void {
		this[0] = x;
		this[1] = y;
		this[2] = z;
		this[3] = w;
	}

	equals(value: Vector4): boolean {
		if (value == null) {
			return false;
		}
		return this[0] === value[0]
			&& this[1] === value[1]
			&& this[2] === value[2]
			&& this[3] === value[3];
	}

	toString(): string {
		var t = new Array(4);
		for (var i = 0; i < 4; i++) {
			t[i] = this[i].toFixed(5);
		}
		return (
			"[x: " + t[0] + ", y: " + t[1] + ", " +
			 "z: " + t[2] + ", w: " + t[3] + "]"
		);
	}

	toVector3(useW: boolean = false): Vector3 {
		var vector3 = new Vector3(this[0], this[1], this[2]);
		if (useW && this.w != 0) {
			var w = 1 / this[3];
			vector3[0] *= w;
			vector3[1] *= w;
			vector3[2] *= w;
		}
		return vector3;
	}

	add(value: Vector4): Vector4 {
		return new Vector4(
			this[0] + value[0],
			this[1] + value[1],
			this[2] + value[2],
			this[3] + value[3]
		);
	}

	sub(value: Vector4): Vector4 {
		return new Vector4(
			this[0] - value[0],
			this[1] - value[1],
			this[2] - value[2],
			this[3] - value[3]
		);
	}

	mul(value: number): Vector4 {
		return new Vector4(
			this[0] * value,
			this[1] * value,
			this[2] * value,
			this[3] * value
		);
	}

	div(value: number): Vector4 {
		return new Vector4(
			this[0] / value,
			this[1] / value,
			this[2] / value,
			this[3] / value
		);
	}
}
