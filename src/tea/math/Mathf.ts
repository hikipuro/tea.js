import { Color } from "../utils/Color";

export class Mathf {
	static readonly Epsilon = 1.192093E-07;
	static readonly Deg2Rad = Math.PI / 180.0;
	static readonly Rad2Deg = 180.0 / Math.PI;
	static readonly PI = Math.PI;
	static readonly Infinity = Number.POSITIVE_INFINITY;
	static readonly NegativeInfinity = Number.NEGATIVE_INFINITY;

	static abs(f: number): number {
		return Math.abs(f);
	}

	static acos(f: number): number {
		return Math.acos(f);
	}

	static approximately(a: number, b: number): boolean {
		return Math.abs(a - b) < this.Epsilon;
	}

	static asin(f: number): number {
		return Math.asin(f);
	}

	static atan(f: number): number {
		return Math.atan(f);
	}

	static atan2(y: number, x: number): number {
		return Math.atan2(y, x);
	}

	static ceil(f: number): number {
		return Math.ceil(f);
	}

	static ceilToInt(f: number): number {
		return Math.ceil(f);
	}

	/**
	 * clamps given value between min and max.
	 * @param {number} value
	 * @param {number} min
	 * @param {number} max
	 * @returns {number}
	 */
	static clamp(value: number, min: number, max: number): number {
		value = Math.max(value, min);
		return Math.min(value, max);
	}

	static clamp01(value: number): number {
		value = Math.max(value, 0.0);
		return Math.min(value, 1.0);
	}

	static closestPowerOfTwo(value: number): number {
		var bits = value;
		bits = (bits & 0x55555555) + (bits >> 1 & 0x55555555);
		bits = (bits & 0x33333333) + (bits >> 2 & 0x33333333);
		bits = (bits & 0x0f0f0f0f) + (bits >> 4 & 0x0f0f0f0f);
		bits = (bits & 0x00ff00ff) + (bits >> 8 & 0x00ff00ff);
		bits = (bits & 0x0000ffff) + (bits >>16 & 0x0000ffff);
		if (bits === 1 && value !== 1) {
			return value;
		}
		var shift = Math.floor(Math.log2(value));
		return 2 << shift;
	}

	static correlatedColorTemperatureToRGB(kelvin: number): Color {
		var t = kelvin / 100;
		var r = 0, g = 0, b = 0;
		if (t <= 66) {
			r = 255;
			g = t;
			g = 99.4708025861 * Math.log(g) - 161.1195681661;
		} else {
			r = t - 60;
			r = 329.698727446 * Math.pow(r, -0.1332047592);
			g = t - 60;
			g = 288.1221695283 * Math.pow(g, -0.0755148492);
		}
		if (t >= 66) {
			b = 255;
		} else if (t <= 16) {
			b = 0;
		} else {
			b = t - 10;
			b = 138.5177312231 * Math.log(b) - 305.0447927307;
		}
		r = Mathf.clamp(r, 0, 255);
		g = Mathf.clamp(g, 0, 255);
		b = Mathf.clamp(b, 0, 255);
		return new Color(r / 255, g / 255, b / 255, 1.0);
	}

	static cos(f: number): number {
		return Math.cos(f);
	}

	static deltaAngle(current: number, target: number): number {
		current %= 360;
		target %= 360;
		return target - current;
	}

	static exp(f: number): number {
		return Math.exp(f);
	}

	static floor(f: number): number {
		return Math.floor(f);
	}

	static floorToInt(f: number): number {
		return Math.floor(f);
	}

	static gammaToLinearSpace(value: number): number {
		return Math.pow(value, 2.2);
	}

	static inverseLerp(a: number, b: number, value: number): number {
		return (value - a) / (b - a);
	}

	static isPowerOf2(x: number, y: number): boolean;
	static isPowerOf2(value: number): boolean;
	static isPowerOf2(a: number, b?: number): boolean {
		var r = (a & (a - 1)) === 0
		if (b == null) {
			return r;
		}
		return r && (b & (b - 1)) === 0;
	}

	static lerp(a: number, b: number, t: number): number {
		t = this.clamp01(t);
		return a + (b - a) * t;
	}

	//static lerpAngle(a: number, b: number, t: number): number {
	//	t = this.clamp01(t);
	//	return a + (b - a) * t;
	//}

	static lerpUnclamped(a: number, b: number, t: number): number {
		return a + (b - a) * t;
	}

	static linearToGammaSpace(value: number): number {
		return Math.pow(value, 1.0 / 2.2);
	}

	static log(f: number): number {
		return Math.log(f);
	}

	static log10(f: number): number {
		return Math.log10(f);
	}

	static max(f: number): number {
		return Math.max(f);
	}

	static min(f: number): number {
		return Math.min(f);
	}

	//static moveTowards(current: number, target: number, maxDelta: number): number {
	//}

	//static moveTowardsAngle(current: number, target: number, maxDelta: number): number {
	//}

	//static perlinNoise(x: number, y: number): number {
	//}

	static pingPong(t: number, length: number): number {
		var d = Math.floor(t / length) % 2;
		return length * d + (t % length) * (-d * 2 + 1);
	}

	static pow(f: number, p: number): number {
		return Math.pow(f, p);
	}

	static repeat(t: number, length: number): number {
		if (length < 0) {
			return 0;
		}
		var a = t % length;
		if (a < 0) {
			return a + length;
		}
		return a;
	}

	static round(f: number): number {
		return Math.round(f);
	}

	static roundToInt(f: number): number {
		return Math.round(f);
	}

	static sign(f: number): number {
		return Math.sign(f);
	}

	static sin(f: number): number {
		return Math.sin(f);
	}

	//static smoothDamp(): number {
	//}

	//static smoothDampAngle(): number {
	//}

	static smoothStep(from: number, to: number, t: number): number {
		t = from + (to - from) * t;
		var x = this.clamp01((t - from) / (to - from));
		return x * x * (3 - 2 * x) * (to - from) + from;
	}

	static sqrt(f: number): number {
		return Math.sqrt(f);
	}

	static tan(f: number): number {
		return Math.tan(f);
	}
}
