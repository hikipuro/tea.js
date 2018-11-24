import * as Tea from "../Tea";

export class MinMaxGradient {
	color: Tea.Color;
	colorMax: Tea.Color;
	colorMin: Tea.Color;
	gradient: Tea.Gradient;
	gradientMax: Tea.Gradient;
	gradientMin: Tea.Gradient;
	mode: Tea.ParticleSystemGradientMode;

	constructor(color: Tea.Color);
	constructor(gradient: Tea.Gradient);
	constructor(min: Tea.Color, max: Tea.Color);
	constructor(min: Tea.Gradient, max: Tea.Gradient);
	constructor(a: Tea.Color | Tea.Gradient, b?: Tea.Color | Tea.Gradient) {
		this.color = null;
		this.colorMax = null;
		this.colorMin = null;
		this.gradient = null;
		this.gradientMax = null;
		this.gradientMin = null;
		if (b == null) {
			if (a instanceof Tea.Color) {
				this.color = a;
				this.mode = Tea.ParticleSystemGradientMode.Color;
				return;
			}
			this.gradient = a;
			this.mode = Tea.ParticleSystemGradientMode.Gradient;
			return;
		}
		if (a instanceof Tea.Color) {
			this.colorMin = a;
			this.colorMax = b as Tea.Color;
			this.mode = Tea.ParticleSystemGradientMode.TwoColors;
			return;
		}
		this.gradientMin = a;
		this.gradientMax = b as Tea.Gradient;
		this.mode = Tea.ParticleSystemGradientMode.TwoGradients;
	}

	evaluate(time: number, lerpFactor?: number): Tea.Color {
		time = Tea.Mathf.clamp01(time);
		if (lerpFactor != null) {
			lerpFactor = Tea.Mathf.clamp01(lerpFactor);
		}
		switch (this.mode) {
			case Tea.ParticleSystemGradientMode.Color:
				return this.color;
			case Tea.ParticleSystemGradientMode.TwoColors:
				var min = this.colorMin;
				var max = this.colorMax;
				return min.add(max.sub(min).mul$(Math.random()));
			case Tea.ParticleSystemGradientMode.Gradient:
				return this.gradient.evaluate(time);
			case Tea.ParticleSystemGradientMode.TwoGradients:
				var min = this.gradientMin.evaluate(time);
				var max = this.gradientMax.evaluate(time);
				return min.add(max.sub(min).mul$(Math.random()));
			case Tea.ParticleSystemGradientMode.RandomColor:
				return Tea.Random.colorHSV();
		}
		return Tea.Color.white.clone();
	}

	static fromJSON(app: Tea.App, json: any): MinMaxGradient {
		if (json == null || json._type !== "MinMaxGradient") {
			return null;
		}
		var minMaxGradient = null;
		var mode = Tea.ParticleSystemGradientMode[json.mode as string];
		switch (mode) {
			case Tea.ParticleSystemGradientMode.Color:
				minMaxGradient = new MinMaxGradient(
					Tea.Color.fromArray(json.color)
				);
				break;
			case Tea.ParticleSystemGradientMode.TwoColors:
				minMaxGradient = new MinMaxGradient(
					Tea.Color.fromArray(json.colorMin),
					Tea.Color.fromArray(json.colorMax)
				);
				break;
			case Tea.ParticleSystemGradientMode.Gradient:
				minMaxGradient = new MinMaxGradient(
					Tea.Gradient.fromJSON(app, json.gradient)
				);
				break;
			case Tea.ParticleSystemGradientMode.TwoGradients:
				minMaxGradient = new MinMaxGradient(
					Tea.Gradient.fromJSON(app, json.gradientMin),
					Tea.Gradient.fromJSON(app, json.gradientMax)
				);
				break;
			case Tea.ParticleSystemGradientMode.RandomColor:
				minMaxGradient = new MinMaxGradient(
					new Tea.Color()
				);
				minMaxGradient.mode = Tea.ParticleSystemGradientMode.RandomColor;
				break;
		}
		return minMaxGradient;
	}

	toJSON(): Object {
		var gradient = null;
		var gradientMax = null;
		var gradientMin = null;
		if (this.gradient != null) {
			gradient = this.gradient.toJSON();
		}
		if (this.gradientMax != null) {
			gradientMax = this.gradientMax.toJSON();
		}
		if (this.gradientMin != null) {
			gradientMin = this.gradientMin.toJSON();
		}
		var json = {
			_type: "MinMaxGradient",
			color: this.color,
			colorMax: this.colorMax,
			colorMin: this.colorMin,
			gradient: gradient,
			gradientMax: gradientMax,
			gradientMin: gradientMin,
			mode: Tea.ParticleSystemGradientMode.toString(this.mode)
		};
		return json;
	}
}
