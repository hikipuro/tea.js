import { Vector2 } from "./Vector2";

export class Rect extends Array<number> {
	constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
		super(4);
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	static get zero(): Rect {
		return new Rect();
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
		const w = this[0] - value;
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
		const h = this[1] - value;
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
			this.x + this.width / 2,
			this.y + this.height / 2
		);
	}

	get min(): Vector2 {
		return new Vector2(
			this.x,
			this.y
		);
	}

	get max(): Vector2 {
		return new Vector2(
			this.x + this.width,
			this.y + this.height
		);
	}

	get size(): Vector2 {
		return new Vector2(
			this.width,
			this.height
		);
	}

	set(x: number, y: number, width: number, height: number): void {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	clone(): Rect {
		return new Rect(
			this.x, this.y,
			this.width, this.height
		);
	}

	equals(value: Rect): boolean {
		if (value == null) {
			return false;
		}
		return this.x === value.x
			&& this.y === value.y
			&& this.width === value.width
			&& this.height === value.height;
	}

	contains(point: Vector2): boolean {
		const x = point.x, y = point.y;
		return (
			this.x <= x && x <= this.width &&
			this.y <= y && y <= this.height
		);
	}

	toString(): string {
		const t = this;
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