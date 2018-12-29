import * as Tea from "../Tea";

export class Vector2 extends Array<number> {
	static readonly up = new Vector2(0.0, 1.0);
	static readonly down = new Vector2(0.0, -1.0);
	static readonly left = new Vector2(-1.0, 0.0);
	static readonly right = new Vector2(1.0, 0.0);
	static readonly zero = new Vector2(0.0, 0.0);
	static readonly one = new Vector2(1.0, 1.0);
	static readonly positiveInfinity = new Vector2(Infinity, Infinity);
	static readonly negativeInfinity = new Vector2(-Infinity, -Infinity);
	protected static _tmp: Vector2 = new Vector2();

	constructor(x: number = 0.0, y: number = 0.0) {
		super(2);
		this[0] = x;
		this[1] = y;
	}

	static init() {
		Object.freeze(Vector2.up);
		Object.freeze(Vector2.down);
		Object.freeze(Vector2.left);
		Object.freeze(Vector2.right);
		Object.freeze(Vector2.zero);
		Object.freeze(Vector2.one);
		Object.freeze(Vector2.positiveInfinity);
		Object.freeze(Vector2.negativeInfinity);
	}

	static fromArray(array: Array<number>): Vector2 {
		var x = array[0], y = array[1];
		x = x != null ? x : 0.0;
		y = y != null ? y : 0.0;
		return new Vector2(x, y);
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

	get magnitude(): number {
		var x = this[0], y = this[1];
		return Math.sqrt(x * x + y * y);
	}

	get sqrMagnitude(): number {
		var x = this[0], y = this[1];
		return x * x + y * y;
	}

	get normalized(): Vector2 {
		var x = this[0], y = this[1];
		var m = x * x + y * y;
		if (m === 0.0) {
			return new Vector2();
		}
		m = 1.0 / Math.sqrt(m);
		return new Vector2(
			this[0] * m,
			this[1] * m
		);
	}

	clone(): Vector2 {
		return new Vector2(
			this[0], this[1]
		);
	}

	set(x: number, y: number): Vector2 {
		this[0] = x;
		this[1] = y;
		return this;
	}

	copy(value: Vector2): Vector2 {
		this[0] = value[0];
		this[1] = value[1];
		return this;
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

	toVector3(): Tea.Vector3 {
		return new Tea.Vector3(this[0], this[1], 0.0);
	}

	toVector4(): Tea.Vector4 {
		return new Tea.Vector4(
			this[0], this[1], 0.0, 0.0
		);
	}

	angle(value: Vector2): number {
		var ma = this.sqrMagnitude;
		var mb = value.sqrMagnitude;
		if (ma === 0.0 && mb === 0.0) {
			return 0.0;
		}
		var cos = this.dot(value) / Math.sqrt(ma * mb);
		return Math.acos(cos);
	}

	clampMagnitude(maxLength: number): Vector2 {
		var x = this[0], y = this[1];
		var m = x * x + y * y;
		if (m === 0.0) {
			return new Vector2();
		}
		m = Math.sqrt(m);
		m = maxLength / m;
		return new Vector2(
			this[0] * m,
			this[1] * m
		);
	}

	distance(value: Vector2): number {
		var t = Vector2._tmp;
		t.copy(this).subSelf(value);
		var x = t[0], y = t[1];
		return Math.sqrt(x * x + y * y);
	}

	lerp(value: Vector2, t: number): Vector2 {
		return new Vector2(
			Tea.Mathf.lerp(this[0], value[0], t),
			Tea.Mathf.lerp(this[1], value[1], t)
		);
	}

	lerpUnclamped(value: Vector2, t: number): Vector2 {
		return new Vector2(
			Tea.Mathf.lerpUnclamped(this[0], value[0], t),
			Tea.Mathf.lerpUnclamped(this[1], value[1], t)
		);
	}

	max(value: Vector2): Vector2 {
		return new Vector2(
			Math.max(this[0], value[0]),
			Math.max(this[1], value[1])
		);
	}

	min(value: Vector2): Vector2 {
		return new Vector2(
			Math.min(this[0], value[0]),
			Math.min(this[1], value[1])
		);
	}

	moveTowards(target: Vector2, maxDistanceDelta: number): Vector2 {
		var diff = this.sub(target);
		var m = diff.magnitude;
		var ratio = Math.min(m, maxDistanceDelta) / m;
		diff = diff.mul(ratio);
		return this.sub(diff);
	}

	//perpendicular(): Vector2 {
	//}

	reflect(inNormal: Vector2): Vector2 {
		var n = inNormal;
		var d = this.dot(n) * -2.0;
		var t = Vector2._tmp;
		t.copy(n).mulSelf(d).addSelf(this);
		return t.clone(); 
	}

	/*
	signedAngle(to: Vector2): number {
		var ma = this.sqrMagnitude;
		var mb = to.sqrMagnitude;
		if (ma === 0.0 && mb === 0.0) {
			return 0;
		}
		var cos = this.dot(to) / Math.sqrt(ma * mb);
		var angle = Math.acos(cos);
		return angle;
	}

	smoothDamp(): Vector2 {
	}
	*/

	add(value: Vector2): Vector2 {
		return new Vector2(
			this[0] + value[0],
			this[1] + value[1]
		);
	}

	addSelf(value: Vector2): Vector2 {
		this[0] += value[0];
		this[1] += value[1];
		return this;
	}

	sub(value: Vector2): Vector2 {
		return new Vector2(
			this[0] - value[0],
			this[1] - value[1]
		);
	}

	subSelf(value: Vector2): Vector2 {
		this[0] -= value[0];
		this[1] -= value[1];
		return this;
	}

	mul(value: number): Vector2 {
		return new Vector2(
			this[0] * value,
			this[1] * value
		);
	}

	mulSelf(value: number): Vector2 {
		this[0] *= value;
		this[1] *= value;
		return this;
	}

	div(value: number): Vector2 {
		return new Vector2(
			this[0] / value,
			this[1] / value
		);
	}

	divSelf(value: number): Vector2 {
		this[0] /= value;
		this[1] /= value;
		return this;
	}

	dot(value: Vector2): number {
		return this[0] * value[0] +
			this[1] * value[1];
	}

	scale(value: Vector2): Vector2 {
		return new Vector2(
			this[0] * value[0],
			this[1] * value[1]
		);
	}

	scaleSelf(value: Vector2): Vector2 {
		this[0] *= value[0];
		this[1] *= value[1];
		return this;
	}
}

Vector2.init();
