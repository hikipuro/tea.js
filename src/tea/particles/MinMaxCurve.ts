import * as Tea from "../Tea";
import { AnimationCurve } from "../utils/AnimationCurve"
import { ParticleSystemCurveMode } from "./enums/ParticleSystemCurveMode";

export class MinMaxCurve {
	constant: number;
	constantMax: number;
	constantMin: number;
	curve: AnimationCurve;
	curveMax: AnimationCurve;
	curveMin: AnimationCurve;
	curveMultiplier: number;
	mode: ParticleSystemCurveMode;

	constructor(constant: number);
	constructor(min: number, max: number);
	constructor(multiplier: number, curve: AnimationCurve);
	constructor(multiplier: number, min: AnimationCurve, max: AnimationCurve);
	constructor(a: number, b?: number | AnimationCurve, c?: AnimationCurve) {
		this.constant = 0.0;
		this.constantMax = 1.0;
		this.constantMin = 0.0;
		this.curveMultiplier = 1.0;
		if (c != null) {
			this.curveMultiplier = a;
			this.curveMin = b as AnimationCurve;
			this.curveMax = c;
			this.mode = ParticleSystemCurveMode.TwoCurves;
			return;
		}
		if (b instanceof AnimationCurve) {
			this.curveMultiplier = a;
			this.curve = b;
			this.mode = ParticleSystemCurveMode.Curve;
			return;
		}
		if (b != null) {
			this.constantMin = a;
			this.constantMax = b;
			this.mode = ParticleSystemCurveMode.TwoConstants;
			return;
		}
		this.constant = a;
		this.mode = ParticleSystemCurveMode.Constant;
	}

	evaluate(time: number, lerpFactor?: number): number {
		time = Tea.Mathf.clamp01(time);
		if (lerpFactor != null) {
			lerpFactor = Tea.Mathf.clamp01(lerpFactor);
		}
		switch (this.mode) {
			case ParticleSystemCurveMode.Constant:
				return this.constant;
			case ParticleSystemCurveMode.TwoConstants:
				var min = this.constantMin;
				var max = this.constantMax;
				return min + Math.random() * (max - min);
			case ParticleSystemCurveMode.Curve:
				return this.curve.evaluate(time) * this.curveMultiplier;
			case ParticleSystemCurveMode.TwoCurves:
				var min = this.curveMin.evaluate(time);
				var max = this.curveMax.evaluate(time);
				return (min + Math.random() * (max - min)) * this.curveMultiplier;
		}
	}

	static fromJSON(app: Tea.App, json: any): MinMaxCurve {
		if (json == null || json._type !== "MinMaxCurve") {
			return null;
		}
		var minMaxCurve: MinMaxCurve = null;
		var mode = ParticleSystemCurveMode[json.mode as string];
		switch (mode) {
			case ParticleSystemCurveMode.Constant:
				minMaxCurve = new MinMaxCurve(json.constant);
				minMaxCurve.curveMultiplier = json.curveMultiplier;
				break;
			case ParticleSystemCurveMode.TwoConstants:
				minMaxCurve = new MinMaxCurve(json.curveMin, json.curveMax);
				minMaxCurve.curveMultiplier = json.curveMultiplier;
				break;
			case ParticleSystemCurveMode.Curve:
				var curve = AnimationCurve.fromJSON(app, json.curve);
				minMaxCurve = new MinMaxCurve(json.curveMultiplier, curve);
				break;
			case ParticleSystemCurveMode.TwoCurves:
				var curveMin = AnimationCurve.fromJSON(app, json.curveMin);
				var curveMax = AnimationCurve.fromJSON(app, json.curveMax);
				minMaxCurve = new MinMaxCurve(json.curveMultiplier, curveMin, curveMax);
				break;
		}
		return minMaxCurve;
	}

	toJSON(): Object {
		var curve: Object = null;
		var curveMax: Object = null;
		var curveMin: Object = null;
		if (this.curve != null) {
			curve = this.curve.toJSON();
		}
		if (this.curveMax != null) {
			curveMax = this.curveMax.toJSON();
		}
		if (this.curveMin != null) {
			curveMin = this.curveMin.toJSON();
		}
		var json = {
			_type: "MinMaxCurve",
			constant: this.constant,
			constantMax: this.constantMax,
			constantMin: this.constantMin,
			curve: curve,
			curveMax: curveMax,
			curveMin: curveMin,
			curveMultiplier: this.curveMultiplier,
			mode: ParticleSystemCurveMode.toString(this.mode)
		};
		return json;
	}
}
