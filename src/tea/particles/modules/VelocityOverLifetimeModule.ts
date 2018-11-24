import * as Tea from "../../Tea";
import { MinMaxCurve } from "../MinMaxCurve";

export class VelocityOverLifetimeModule {
	enabled: boolean;
	orbitalOffsetX: MinMaxCurve;
	orbitalOffsetXMultiplier: number;
	orbitalOffsetY: MinMaxCurve;
	orbitalOffsetYMultiplier: number;
	orbitalOffsetZ: MinMaxCurve;
	orbitalOffsetZMultiplier: number;
	orbitalX: MinMaxCurve;
	orbitalXMultiplier: number;
	orbitalY: MinMaxCurve;
	orbitalYMultiplier: number;
	orbitalZ: MinMaxCurve;
	orbitalZMultiplier: number;
	radial: MinMaxCurve;
	radialMultiplier: number;
	space: Tea.ParticleSystemSimulationSpace;
	speedModifier: MinMaxCurve;
	speedModifierMultiplier: number;
	x: MinMaxCurve;
	xMultiplier: number;
	y: MinMaxCurve;
	yMultiplier: number;
	z: MinMaxCurve;
	zMultiplier: number;

	constructor() {
		this.enabled = false;
		this.x = new MinMaxCurve(0.0);
		this.y = new MinMaxCurve(0.0);
		this.z = new MinMaxCurve(0.0);
	}
}
