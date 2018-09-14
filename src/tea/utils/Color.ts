import * as Tea from "../Tea";

export class Color extends Array<number> {
	static readonly background = new Color(49 / 255, 77 / 255, 121 / 255, 1.0);
	static readonly black = new Color(0.0, 0.0, 0.0, 1.0);
	static readonly blue = new Color(0.0, 0.0, 1.0, 1.0);
	static readonly clear = new Color(0.0, 0.0, 0.0, 0.0);
	static readonly cyan = new Color(0.0, 1.0, 1.0, 1.0);
	static readonly gray = new Color(0.5, 0.5, 0.5, 1.0);
	static readonly green = new Color(0.0, 1.0, 0.0, 1.0);
	static readonly magenta = new Color(1.0, 0.0, 1.0, 1.0);
	static readonly red = new Color(1.0, 0.0, 0.0, 1.0);
	static readonly white = new Color(1.0, 1.0, 1.0, 1.0);
	static readonly yellow = new Color(1.0, 0.92, 0.016, 1.0);

	constructor(r: number = 0.0, g: number = 0.0, b: number = 0.0, a: number = 0.0) {
		super();
		this.set(r, g, b, a);
	}

	static init() {
		Object.freeze(Color.background);
		Object.freeze(Color.black);
		Object.freeze(Color.blue);
		Object.freeze(Color.clear);
		Object.freeze(Color.cyan);
		Object.freeze(Color.gray);
		Object.freeze(Color.green);
		Object.freeze(Color.magenta);
		Object.freeze(Color.red);
		Object.freeze(Color.white);
		Object.freeze(Color.yellow);
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
		var r = this[0], g = this[1], b = this[2];
		if (r === g && g === b) {
			return r;
		}
		return 0.2989 * r + 0.5870 * g + 0.1140 * b;
	}

	get maxColorComponent(): number {
		return Math.max(this[0], this[1], this[2]);
	}

	set(r: number, g: number, b: number, a: number): void {
		this[0] = r;
		this[1] = g;
		this[2] = b;
		this[3] = a;
	}

	copy(value: Color): void {
		this[0] = value[0];
		this[1] = value[1];
		this[2] = value[2];
		this[3] = value[3];
	}

	equals(value: Color): boolean {
		if (value == null) {
			return false;
		}
		return this[0] === value[0]
			&& this[1] === value[1]
			&& this[2] === value[2]
			&& this[3] === value[3];
	}

	clone(): Color {
		return new Color(
			this[0],
			this[1],
			this[2],
			this[3]
		);
	}

	toCssColor(): string {
		if (this.a == 1) {
			var r = Math.floor(this.r * 255).toString(16);
			var g = Math.floor(this.g * 255).toString(16);
			var b = Math.floor(this.b * 255).toString(16);
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
		var bytes = new Uint8Array(4);
		var dataView = new DataView(bytes.buffer);
		dataView.setUint32(0, color);
		return new Color(
			bytes[0] / 255,
			bytes[1] / 255,
			bytes[2] / 255,
			bytes[3] / 255
		);
	}

	static fromRGB24(color: number): Color {
		var bytes = new Uint8Array(4);
		var dataView = new DataView(bytes.buffer);
		dataView.setUint32(0, color);
		return new Color(
			bytes[1] / 255,
			bytes[2] / 255,
			bytes[3] / 255,
			1
		);
	}
}

Color.init();
