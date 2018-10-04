import * as Tea from "../Tea";

export class PSMinMaxCurve {
	constant: number;
	constantMax: number;
	constantMin: number;
	curve: Tea.AnimationCurve;
	curveMax: Tea.AnimationCurve;
	curveMin: Tea.AnimationCurve;
	curveMultiplier: number;
	mode: Tea.ParticleSystemCurveMode;

	constructor(constant: number);
	constructor(min: number, max: number);
	constructor(multiplier: number, curve: Tea.AnimationCurve);
	constructor(multiplier: number, min: Tea.AnimationCurve, max: Tea.AnimationCurve);
	constructor(a: number, b?: number | Tea.AnimationCurve, c?: Tea.AnimationCurve) {
		this.constant = 0.0;
		this.constantMax = 1.0;
		this.constantMin = 0.0;
		this.curveMultiplier = 1.0;
		if (c != null) {
			this.curveMultiplier = a;
			this.curveMin = b as Tea.AnimationCurve;
			this.curveMax = c;
			this.mode = Tea.ParticleSystemCurveMode.TwoCurves;
			return;
		}
		if (b instanceof Tea.AnimationCurve) {
			this.curveMultiplier = a;
			this.curve = b;
			this.mode = Tea.ParticleSystemCurveMode.Curve;
			return;
		}
		if (b != null) {
			this.constantMin = a;
			this.constantMax = b;
			this.mode = Tea.ParticleSystemCurveMode.TwoConstants;
			return;
		}
		this.constant = a;
		this.mode = Tea.ParticleSystemCurveMode.Constant;
	}

	evaluate(time: number, lerpFactor?: number): number {
		time = Tea.Mathf.clamp01(time);
		if (lerpFactor != null) {
			lerpFactor = Tea.Mathf.clamp01(lerpFactor);
		}
		switch (this.mode) {
			case Tea.ParticleSystemCurveMode.Constant:
				return this.constant;
			case Tea.ParticleSystemCurveMode.TwoConstants:
				var min = this.constantMin;
				var max = this.constantMax;
				return min + Math.random() * (max - min);
			case Tea.ParticleSystemCurveMode.Curve:
				return this.curve.evaluate(time) * this.curveMultiplier;
			case Tea.ParticleSystemCurveMode.TwoCurves:
				var min = this.curveMin.evaluate(time);
				var max = this.curveMax.evaluate(time);
				return (min + Math.random() * (max - min)) * this.curveMultiplier;
		}
	}
}