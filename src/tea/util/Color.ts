import * as Tea from "../Tea";

export class Color extends Array<number> {
	constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 0) {
		super();
		this.set(r, g, b, a);
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

	static get red(): Color {
		return new Color(1, 0, 0, 1);
	}

	static get green(): Color {
		return new Color(0, 1, 0, 1);
	}

	static get blue(): Color {
		return new Color(0, 0, 1, 1);
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

	set(r: number, g: number, b: number, a: number): void {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	clone(): Color {
		return new Color(
			this.r,
			this.g,
			this.b,
			this.a
		);
	}

	static fromRGBA(r: number, g: number, b: number, a: number): Color {
		return new Color(r, g, b, a);
	}

	static fromHSB(h: number, s: number, b: number): Color {
		h = Tea.clamp(h, 0, 1);
		s = Tea.clamp(s, 0, 1);
		b = Tea.clamp(b, 0, 1);

		let cr = b;
		let cg = b;
		let cb = b;

		if (s > 0) {
			h *= 6;
			let i = Math.floor(h);
			let f = h - i;
			switch (i) {
				default:
				case 0:
					cg *= 1 - s * (1 - f);
					cb *= 1 - s;
					break;
				case 1:
					cr *= 1 - s * f;
					cb *= 1 - s;
					break;
				case 2:
					cr *= 1 - s;
					cb *= 1 - s * (1 - f);
					break;
				case 3:
					cr *= 1 - s;
					cg *= 1 - s * f;
					break;
				case 4:
					cr *= 1 - s * (1 - f);
					cg *= 1 - s;
					break;
				case 5:
					cg *= 1 - s;
					cb *= 1 - s * f;
					break;
			}
		}

		return Color.fromRGBA(cr, cg, cb, 1);
	}

	static fromRGBA32(color: number): Color {
		const bytes = new Uint8Array(4);
		const dataView = new DataView(bytes.buffer);
		dataView.setUint32(0, color);
		return new Color(
			bytes[0] / 255,
			bytes[1] / 255,
			bytes[2] / 255,
			bytes[3] / 255
		);
	}

	static fromRGB24(color: number): Color {
		const bytes = new Uint8Array(4);
		const dataView = new DataView(bytes.buffer);
		dataView.setUint32(0, color);
		return new Color(
			bytes[1] / 255,
			bytes[2] / 255,
			bytes[3] / 255,
			1
		);
	}
}