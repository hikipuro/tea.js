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

	static get blue(): Color {
		return new Color(0, 0, 1, 1);
	}

	static get clear(): Color {
		return new Color(0, 0, 0, 0);
	}

	static get cyan(): Color {
		return new Color(0, 1, 1, 1);
	}

	static get gray(): Color {
		return new Color(0.5, 0.5, 0.5, 1);
	}

	static get green(): Color {
		return new Color(0, 1, 0, 1);
	}

	static get magenta(): Color {
		return new Color(1, 0, 1, 1);
	}

	static get red(): Color {
		return new Color(1, 0, 0, 1);
	}

	static get white(): Color {
		return new Color(1, 1, 1, 1);
	}

	static get yellow(): Color {
		return new Color(1, 0.92, 0.016, 1);
	}

	get r(): number {
		return this[0];
	}
	set r(value: number) {
		this[0] = Tea.Mathf.clamp01(value);
	}

	get g(): number {
		return this[1];
	}
	set g(value: number) {
		this[1] = Tea.Mathf.clamp01(value);
	}

	get b(): number {
		return this[2];
	}
	set b(value: number) {
		this[2] = Tea.Mathf.clamp01(value);
	}

	get a(): number {
		return this[3];
	}
	set a(value: number) {
		this[3] = Tea.Mathf.clamp01(value);
	}

	get gamma(): Color {
		var f = 1 / 2.2;
		return new Color(
			Math.pow(this.r, f),
			Math.pow(this.g, f),
			Math.pow(this.b, f),
			this.a
		);
	}

	get grayscale(): number {
		var r = this.r, g = this.g, b = this.b;
		if (r === g && g === b) {
			return r;
		}
		return 0.2989 * r + 0.5870 * g + 0.1140 * b;
	}

	get maxColorComponent(): number {
		return Math.max(this.r, this.g, this.b);
	}

	set(r: number, g: number, b: number, a: number): void {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	equals(value: Color): boolean {
		if (value == null) {
			return false;
		}
		return this.r === value.r
			&& this.g === value.g
			&& this.b === value.b
			&& this.a === value.a;
	}

	clone(): Color {
		return new Color(
			this.r,
			this.g,
			this.b,
			this.a
		);
	}

	toCssColor(): string {
		if (this.a == 1) {
			let r = Math.floor(this.r * 255).toString(16);
			let g = Math.floor(this.g * 255).toString(16);
			let b = Math.floor(this.b * 255).toString(16);
			r = r.toUpperCase();
			g = g.toUpperCase();
			b = b.toUpperCase();
			return "#" +
				("00" + r).substr(-2) +
				("00" + g).substr(-2) +
				("00" + b).substr(-2);
		}
		return "rgba(" + 
			(this.r * 255).toFixed(0) + ", " +
			(this.g * 255).toFixed(0) + ", " +
			(this.b * 255).toFixed(0) + ", " +
			this.a.toFixed(2) + ")";
	}

	static fromRGBA(r: number, g: number, b: number, a: number): Color {
		return new Color(r, g, b, a);
	}

	static fromRGB(r: number, g: number, b: number): Color {
		return new Color(r, g, b, 1);
	}

	static fromHSV(h: number, s: number, v: number): Color {
		h = Tea.Mathf.clamp01(h);
		s = Tea.Mathf.clamp01(s);
		v = Tea.Mathf.clamp01(v);
		var r = v, g = v, b = v;

		if (s > 0) {
			h *= 6;
			var i = Math.floor(h);
			var f = h - i;
			switch (i) {
				default:
				case 0:
					g *= 1 - s * (1 - f);
					b *= 1 - s;
					break;
				case 1:
					r *= 1 - s * f;
					b *= 1 - s;
					break;
				case 2:
					r *= 1 - s;
					b *= 1 - s * (1 - f);
					break;
				case 3:
					r *= 1 - s;
					g *= 1 - s * f;
					break;
				case 4:
					r *= 1 - s * (1 - f);
					g *= 1 - s;
					break;
				case 5:
					g *= 1 - s;
					b *= 1 - s * f;
					break;
			}
		}
		return Color.fromRGBA(r, g, b, 1);
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