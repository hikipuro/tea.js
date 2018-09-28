import * as Tea from "../Tea";

export class Random {
	static get value(): number {
		return Math.random();
	}

	static get rotation(): Tea.Quaternion {
		var x = Math.random() * 360;
		var y = Math.random() * 360;
		var z = Math.random() * 360;
		return Tea.Quaternion.euler(x, y, z);
	}

	static range(min: number, max: number): number {
		return min + Math.random() * (max - min);
	}

	static rangeInt(min: number, max: number): number {
		return Math.floor(min + Math.random() * (max - min));
	}

	static colorHSV(
		hueMin: number = 0.0, hueMax: number = 1.0,
		saturationMin: number = 0.0, saturationMax: number = 1.0,
		valueMin: number = 0.0, valueMax: number = 1.0,
		alphaMin: number = 0.0, alphaMax: number = 1.0): Tea.Color
	{
		var h = Random.range(hueMin, hueMax);
		var s = Random.range(saturationMin, saturationMax);
		var v = Random.range(valueMin, valueMax);
		var color = Tea.Color.fromHSV(h, s, v);
		color.a = Random.range(alphaMin, alphaMax);
		return color;
	}
}
