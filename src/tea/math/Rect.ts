import * as Tea from "../Tea";
import { Vector2 } from "./Vector2";

export class Rect extends Array<number> {
	static readonly zero = new Rect();

	constructor(x: number = 0.0, y: number = 0.0, width: number = 0.0, height: number = 0.0) {
		super(4);
		this[0] = x;
		this[1] = y;
		this[2] = width;
		this[3] = height;
	}

	static init() {
		Object.freeze(Rect.zero);
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

	get width(): number {
		return this[2];
	}
	set width(value: number) {
		this[2] = value;
	}

	get height(): number {
		return this[3];
	}
	set height(value: number) {
		this[3] = value;
	}

	get xMin(): number {
		return this[0];
	}
	set xMin(value: number) {
		var w = this[0] - value;
		this[0] = value;
		this[2] += w;
	}

	get xMax(): number {
		return this[0] + this[2];
	}
	set xMax(value: number) {
		this[2] = value - this[0];
	}

	get yMin(): number {
		return this[1];
	}
	set yMin(value: number) {
		var h = this[1] - value;
		this[1] = value;
		this[3] += h;
	}

	get yMax(): number {
		return this[1] + this[3];
	}
	set yMax(value: number) {
		this[3] = value - this[1];
	}

	get center(): Vector2 {
		return new Vector2(
			this[0] + this[2] / 2.0,
			this[1] + this[3] / 2.0
		);
	}

	get min(): Vector2 {
		return new Vector2(
			this[0],
			this[1]
		);
	}

	get max(): Vector2 {
		return new Vector2(
			this[0] + this[2],
			this[1] + this[3]
		);
	}

	get size(): Vector2 {
		return new Vector2(
			this[2],
			this[3]
		);
	}

	set(x: number, y: number, width: number, height: number): Rect {
		this[0] = x;
		this[1] = y;
		this[2] = width;
		this[3] = height;
		return this;
	}

	copy(rect: Rect): Rect {
		this[0] = rect[0];
		this[1] = rect[1];
		this[2] = rect[2];
		this[3] = rect[3];
		return this;
	}

	clone(): Rect {
		return new Rect(
			this[0], this[1],
			this[2], this[3]
		);
	}

	equals(value: Rect): boolean {
		if (value == null) {
			return false;
		}
		return this[0] === value[0]
			&& this[1] === value[1]
			&& this[2] === value[2]
			&& this[3] === value[3];
	}

	approxEquals(value: Rect): boolean {
		if (value == null) {
			return false;
		}
		return Tea.Mathf.approximately(this[0], value[0])
			&& Tea.Mathf.approximately(this[1], value[1])
			&& Tea.Mathf.approximately(this[2], value[2])
			&& Tea.Mathf.approximately(this[3], value[3]);
	}

	contains(point: Vector2): boolean {
		var x = point[0], y = point[1];
		return (
			this[0] <= x && x <= this[2] &&
			this[1] <= y && y <= this[3]
		);
	}

	toString(): string {
		var t = this;
		return (
			"[" +
			"x: " + t.x + ", " +
			"y: " + t.y + ", " +
			"width: " + t.width + ", " +
			"height: " + t.height +
			"]"
		);
	}
}

Rect.init();
