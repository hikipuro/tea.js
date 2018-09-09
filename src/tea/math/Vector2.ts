import * as Tea from "../Tea";

export class Vector2 extends Array<number> {
	constructor(x: number = 0, y: number = 0) {
		super(2);
		this[0] = x;
		this[1] = y;
	}

	static get zero(): Vector2 {
		return new Vector2(0, 0);
	}

	static get one(): Vector2 {
		return new Vector2(1, 1);
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

	clone(): Vector2 {
		var vector2 = new Vector2();
		vector2[0] = this[0];
		vector2[1] = this[1];
		return vector2;
	}

	set(x: number, y: number): void {
		this[0] = x;
		this[1] = y;
	}

	equals(value: Vector2): boolean {
		if (value == null) {
			return false;
		}
		return this[0] === value[0]
			&& this[1] === value[1];
	}

	approxEquals(value: Vector2): boolean {
		if (value == null) {
			return false;
		}
		return Tea.Mathf.approximately(this[0], value[0])
			&& Tea.Mathf.approximately(this[1], value[1]);
	}

	toString(): string {
		var t = new Array(2);
		for (var i = 0; i < 2; i++) {
			t[i] = this[i].toFixed(5);
		}
		return (
			"[x: " + t[0] + ", y: " + t[1] + "]"
		);
	}

	add(value: Vector2): Vector2 {
		return new Vector2(
			this[0] + value[0],
			this[1] + value[1]
		);
	}

	sub(value: Vector2): Vector2 {
		return new Vector2(
			this[0] - value[0],
			this[1] - value[1]
		);
	}

	mul(value: number): Vector2 {
		return new Vector2(
			this[0] * value,
			this[1] * value
		);
	}

	div(value: number): Vector2 {
		return new Vector2(
			this[0] / value,
			this[1] / value
		);
	}
}
