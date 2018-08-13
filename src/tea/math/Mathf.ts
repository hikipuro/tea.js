import * as Tea from "../Tea";

export class Mathf {
	static readonly Epsilon = 1.192093E-07;
	static readonly Deg2Rad = Math.PI / 180;
	static readonly Rad2Deg = 180 / Math.PI;
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
		return a - this.Epsilon < b && b < a + this.Epsilon;
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
		value = Math.max(value, 0);
		return Math.min(value, 1);
	}

	static closestPowerOfTwo(value: number): number {
		for (let i = 1; i < 65; i++) {
			const v = Math.pow(i, 2);
			if (v > value) {
				return v;
			}
		}
		return 0;
	}

	//static correlatedColorTemperatureToRGB(kelvin: number): Tea.Color {
	//}

	static cos(f: number): number {
		return Math.cos(f);
	}

	//static deltaAngle(current: number, target: number): number {
	//}

	static exp(f: number): number {
		return Math.exp(f);
	}

	static floor(f: number): number {
		return Math.floor(f);
	}

	static floorToInt(f: number): number {
		return Math.floor(f);
	}

	//static gammaToLinearSpace(value: number): number {
	//}

	static inverseLerp(a: number, b: number, value: number): number {
		return (value - a) / (b - a);
	}

	//static isPowerOfTwo(value: number): boolean {
	//}

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

	//static linearToGammaSpace(value: number): number {
	//}

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
		const d = Math.floor(t / length) % 2;
		return length * d + (t % length) * (-d * 2 + 1);
	}

	static pow(f: number, p: number): number {
		return Math.pow(f, p);
	}

	//static repeat(t: number, length: number): number {
	//}

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
		const x = this.clamp01((t - from) / (to - from));
		return x * x * (3 - 2 * x) * (to - from) + from;
	}

	static sqrt(f: number): number {
		return Math.sqrt(f);
	}

	static tan(f: number): number {
		return Math.tan(f);
	}
}
