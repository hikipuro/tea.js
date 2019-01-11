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

	static fromArray(array: Array<number>): Rect {
		var x = array[0], y = array[1];
		var width = array[2], height = array[3];
		x = x != null ? x : 0.0;
		y = y != null ? y : 0.0;
		width = width != null ? width : 0.0;
		height = height != null ? height : 0.0;
		return new Rect(x, y, width, height);
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

	get isEmpty(): boolean {
		return this[2] === 0.0 && this[3] === 0.0;
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
		var x = this[0], y = this[1], w = this[2], h = this[3];
		var px = point[0], py = point[1];
		return (
			x <= px && px <= x + w &&
			y <= py && py <= y + h
		);
	}

	intersect(rect: Rect): Rect {
		if (rect == null || this.isEmpty || rect.isEmpty) {
			return new Rect();
		}
		var tx1 = this[0];
		var ty1 = this[1];
		var tx2 = tx1 + this[2];
		var ty2 = ty1 + this[3];
		var rx1 = rect[0];
		var ry1 = rect[1];
		var rx2 = rx1 + rect[2];
		var ry2 = ry1 + rect[3];
		if (tx1 > rx2 || rx1 > tx2
		||  ty1 > ry2 || ry1 > ty2) {
			return new Rect();
		}
		if (tx1 < rx1) {
			tx1 = rx1;	
		}
		if (ty1 < ry1) {
			ty1 = ry1;
		}
		if (tx2 > rx2) {
			tx2 = rx2;
		}
		if (ty2 > ry2) {
			ty2 = ry2;
		}
		tx2 -= tx1;
		ty2 -= ty1;
		return new Rect(tx1, ty1, tx2, ty2);
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
