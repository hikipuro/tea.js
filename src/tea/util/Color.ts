import * as Tea from "../Tea";

export class Color extends Array<number> {
	constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 0) {
		super();
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	static get background(): Color {
		return new Color(49 / 255, 77 / 255, 121 / 255, 1);
	}

	static get black(): Color {
		return new Color(0, 0, 0, 1);
	}

	static get white(): Color {
		return new Color(1, 1, 1, 1);
	}

	get r(): number {
		return this[0];
	}
	set r(value: number) {
		this[0] = Tea.clamp(value, 0, 1);
	}

	get g(): number {
		return this[1];
	}
	set g(value: number) {
		this[1] = Tea.clamp(value, 0, 1);
	}

	get b(): number {
		return this[2];
	}
	set b(value: number) {
		this[2] = Tea.clamp(value, 0, 1);
	}

	get a(): number {
		return this[3];
	}
	set a(value: number) {
		this[3] = Tea.clamp(value, 0, 1);
	}
}