export class Padding extends Array<number> {
	constructor(top: number = 0, right: number = 0, bottom: number = 0, left: number = 0) {
		super(4);
		this[0] = top;
		this[1] = right;
		this[2] = bottom;
		this[3] = left;
	}

	get top(): number {
		return this[0];
	}
	set top(value: number) {
		this[0] = value;
	}

	get right(): number {
		return this[1];
	}
	set right(value: number) {
		this[1] = value;
	}

	get bottom(): number {
		return this[2];
	}
	set bottom(value: number) {
		this[2] = value;
	}

	get left(): number {
		return this[3];
	}
	set left(value: number) {
		this[3] = value;
	}

	static fromArray(array: Array<number>): Padding {
		if (array == null) {
			return null;
		}
		var top = array[0], right = array[1];
		var bottom = array[2], left = array[3];
		top = top != null ? top : 0.0;
		right = right != null ? right : 0.0;
		bottom = bottom != null ? bottom : 0.0;
		left = left != null ? left : 0.0;
		var padding = new Padding();
		padding[0] = top;
		padding[1] = right;
		padding[2] = bottom;
		padding[3] = left;
		return padding;
	}

	equals(value: Padding): boolean {
		if (value == null) {
			return false;
		}
		return (
			this[0] === value[0]
		&&  this[1] === value[1]
		&&  this[2] === value[2]
		&&  this[3] === value[3]
		);
	}

	set(value: number): void;
	set(topBottom: number, leftRight: number): void;
	set(top: number, leftRight: number, bottom: number): void;
	set(top: number, right: number, bottom: number, left: number): void;
	set(arg0: number, arg1?: number, arg2?: number, arg3?: number): void {
		if (arg1 == null) {
			this[0] = arg0;
			this[1] = arg0;
			this[2] = arg0;
			this[3] = arg0;
			return;
		}
		if (arg2 == null) {
			this[0] = arg0;
			this[1] = arg1;
			this[2] = arg0;
			this[3] = arg1;
			return;
		}
		if (arg3 == null) {
			this[0] = arg0;
			this[1] = arg1;
			this[2] = arg2;
			this[3] = arg1;
			return;
		}
		this[0] = arg0;
		this[1] = arg1;
		this[2] = arg2;
		this[3] = arg3;
	}
}
