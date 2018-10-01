import * as Tea from "../Tea";

export class PSMinMaxGradient {
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
		return;
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
}
