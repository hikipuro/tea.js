import * as Tea from "../Tea";

export class Gradient {
	alphaKeys: Array<Tea.GradientAlphaKey>;
	colorKeys: Array<Tea.GradientColorKey>;
	mode: Tea.GradientMode;

	constructor() {
		this.alphaKeys = this.createDefaultAlphaKeys();
		this.colorKeys = this.createDefaultColorKeys();
		this.mode = Tea.GradientMode.Blend;
	}

	evaluate(time: number): Tea.Color {
		return Tea.Color.white;
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
		keys.push(new Tea.GradientColorKey(color.clone(), 1.1));
		return keys;
	}

	protected sortAlphaKeys(): void {
		this.alphaKeys.sort((a, b) => {
			return a.time - b.time;
		});
	}

	protected sortColorKeys(): void {
		this.colorKeys.sort((a, b) => {
			return a.time - b.time;
		});
	}
}
