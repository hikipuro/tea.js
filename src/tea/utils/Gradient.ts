import * as Tea from "../Tea";

export class Gradient {
	static readonly className: string = "Gradient";
	alphaKeys: Array<Tea.GradientAlphaKey>;
	colorKeys: Array<Tea.GradientColorKey>;
	mode: Tea.GradientMode;
	protected _tmpColor: Tea.Color;

	constructor() {
		this.alphaKeys = this.createDefaultAlphaKeys();
		this.colorKeys = this.createDefaultColorKeys();
		this.mode = Tea.GradientMode.Blend;
		this._tmpColor = new Tea.Color();
	}

	copy(gradient: Gradient): void {
		var alphaKeys: Array<Tea.GradientAlphaKey> = [];
		var colorKeys: Array<Tea.GradientColorKey> = [];
		gradient.alphaKeys.forEach((alphaKey: Tea.GradientAlphaKey) => {
			alphaKeys.push(alphaKey.clone());
		});
		gradient.colorKeys.forEach((colorKey: Tea.GradientColorKey) => {
			colorKeys.push(colorKey.clone());
		});
		this.setKeys(colorKeys, alphaKeys);
		this.mode = gradient.mode;
	}

	clone(): Gradient {
		var gradient = new Gradient();
		var alphaKeys: Array<Tea.GradientAlphaKey> = [];
		var colorKeys: Array<Tea.GradientColorKey> = [];
		this.alphaKeys.forEach((alphaKey: Tea.GradientAlphaKey) => {
			alphaKeys.push(alphaKey.clone());
		});
		this.colorKeys.forEach((colorKey: Tea.GradientColorKey) => {
			colorKeys.push(colorKey.clone());
		});
		gradient.setKeys(colorKeys, alphaKeys);
		gradient.mode = this.mode;
		return gradient;
	}

	evaluate(time: number): Tea.Color {
		time = Tea.Mathf.clamp01(time);
		var alphaKeys = this.findAlphaKeys(time);
		var colorKeys = this.findColorKeys(time);
		if (this.mode === Tea.GradientMode.Fixed) {
			var color = colorKeys[1].color.clone();
			color[3] = alphaKeys[1].alpha;
			return color;
		}
		var alpha = this.evaluateAlphaKeys(time, alphaKeys);
		var color = this.evaluateColorKeys(time, colorKeys);
		color[3] = alpha;
		return color;
	}

	setKeys(colorKeys: Array<Tea.GradientColorKey>, alphaKeys: Array<Tea.GradientAlphaKey>): void {
		if (colorKeys == null) {
			colorKeys = this.createDefaultColorKeys();
		}
		if (alphaKeys == null) {
			alphaKeys = this.createDefaultAlphaKeys();
		}
		this.colorKeys = colorKeys;
		this.alphaKeys = alphaKeys;
		this.fillAlphaKeys();
		this.fillColorKeys();
		this.sortAlphaKeys();
		this.sortColorKeys();
	}

	sortAlphaKeys(): void {
		this.alphaKeys.sort((a: Tea.GradientAlphaKey, b: Tea.GradientAlphaKey) => {
			return a.time - b.time;
		});
	}

	sortColorKeys(): void {
		this.colorKeys.sort((a: Tea.GradientColorKey, b: Tea.GradientColorKey) => {
			return a.time - b.time;
		});
	}

	static fromJSON(app: Tea.App, json: any): Gradient {
		if (Tea.JSONUtil.isValidSceneJSON(json, Gradient.className) === false) {
			return null;
		}
		var alphaKeys = [];
		var colorKeys = [];
		if (json.alphaKeys) {
			var length = json.alphaKeys.length;
			for (var i = 0; i < length; i++) {
				var alphaKey = json.alphaKeys[i];
				alphaKeys.push(Tea.GradientAlphaKey.fromJSON(app, alphaKey));
			}
		}
		if (json.colorKeys) {
			var length = json.colorKeys.length;
			for (var i = 0; i < length; i++) {
				var colorKey = json.colorKeys[i];
				colorKeys.push(Tea.GradientColorKey.fromJSON(app, colorKey));
			}
		}
		var gradient = new Gradient();
		gradient.alphaKeys = alphaKeys;
		gradient.colorKeys = colorKeys;
		gradient.mode = Tea.GradientMode[json.mode as string];
		return gradient;
	}

	toJSON(): Object {
		var alphaKeys = [];
		var colorKeys = [];
		this.alphaKeys.forEach((alphaKey: Tea.GradientAlphaKey) => {
			alphaKeys.push(alphaKey.toJSON());
		});
		this.colorKeys.forEach((colorKey: Tea.GradientColorKey) => {
			colorKeys.push(colorKey.toJSON());
		});
		var json: any = {};
		json[Tea.JSONUtil.TypeName] = Gradient.className;
		json.alphaKeys = alphaKeys;
		json.colorKeys = colorKeys;
		json.mode = Tea.GradientMode.toString(this.mode);
		return json;
	}

	protected createDefaultAlphaKeys(): Array<Tea.GradientAlphaKey> {
		var keys = [];
		keys.push(new Tea.GradientAlphaKey(1.0, 0.0));
		keys.push(new Tea.GradientAlphaKey(1.0, 1.0));
		return keys;
	}

	protected createDefaultColorKeys(): Array<Tea.GradientColorKey> {
		var keys = [];
		var color = Tea.Color.white;
		keys.push(new Tea.GradientColorKey(color.clone(), 0.0));
		keys.push(new Tea.GradientColorKey(color.clone(), 1.0));
		return keys;
	}

	protected fillAlphaKeys(): void {
		var count = 2 - this.alphaKeys.length;
		for (var i = 0; i < count; i++) {
			var key = new Tea.GradientAlphaKey(1.0, 1.0);
			this.alphaKeys.push(key);
		}
	}

	protected fillColorKeys(): void {
		var count = 2 - this.colorKeys.length;
		for (var i = 0; i < count; i++) {
			var key = new Tea.GradientColorKey(
				Tea.Color.white.clone(), 1.0
			);
			this.colorKeys.push(key);
		}
	}

	protected findAlphaKeys(time: number): Array<Tea.GradientAlphaKey> {
		var key0: Tea.GradientAlphaKey;
		var key1: Tea.GradientAlphaKey;
		var alphaKeys = this.alphaKeys;
		var length = alphaKeys.length;
		for (var i = 0; i < length; i++) {
			var key = alphaKeys[i];
			if (time <= key.time) {
				if (i - 1 < 0) {
					key0 = alphaKeys[0];
				} else {
					key0 = alphaKeys[i - 1];
				}
				key1 = alphaKeys[i];
				break;
			}
		}
		var lastKey = alphaKeys[length - 1];
		if (key0 == null) {
			key0 = lastKey;
		}
		if (key1 == null) {
			key1 = lastKey;
		}
		return [key0, key1];
	}

	protected findColorKeys(time: number): Array<Tea.GradientColorKey> {
		var key0: Tea.GradientColorKey;
		var key1: Tea.GradientColorKey;
		var colorKeys = this.colorKeys;
		var length = colorKeys.length;
		for (var i = 0; i < length; i++) {
			var key = colorKeys[i];
			if (time <= key.time) {
				if (i - 1 < 0) {
					key0 = colorKeys[0];
				} else {
					key0 = colorKeys[i - 1];
				}
				key1 = colorKeys[i];
				break;
			}
		}
		var lastKey = colorKeys[length - 1];
		if (key0 == null) {
			key0 = lastKey;
		}
		if (key1 == null) {
			key1 = lastKey;
		}
		return [key0, key1];
	}

	protected evaluateAlphaKeys(time: number, keys: Array<Tea.GradientAlphaKey>): number {
		if (time <= keys[0].time) {
			return keys[0].alpha;
		}
		if (time >= keys[1].time) {
			return keys[1].alpha;
		}
		var k0 = keys[0], k1 = keys[1];
		var td = k1.time - k0.time;
		var t = (time - k0.time) / td;
		return k0.alpha * (1.0 - t) + k1.alpha * t;
	}

	protected evaluateColorKeys(time: number, keys: Array<Tea.GradientColorKey>): Tea.Color {
		if (time <= keys[0].time) {
			return keys[0].color.clone();
		}
		if (time >= keys[1].time) {
			return keys[1].color.clone();
		}
		var k0 = keys[0], k1 = keys[1];
		var td = k1.time - k0.time;
		var t = (time - k0.time) / td;
		var c0 = k0.color.mul(1.0 - t);
		var c1 = this._tmpColor;
		c1.copy(k1.color);
		c1.mul$(t);
		return c0.add$(c1);
	}
}
