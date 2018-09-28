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
		return Tea.Color.white;
	}
}
