import * as Tea from "../../Tea";
import { MinMaxCurve } from "../MinMaxCurve";

export class ForceOverLifetimeModule {
	enabled: boolean;
	randomized: boolean;
	space: Tea.ParticleSystemSimulationSpace;
	x: MinMaxCurve;
	y: MinMaxCurve;
	z: MinMaxCurve;

	constructor() {
		this.enabled = false;
	}

	get xMultiplier(): number {
		return this.x.curveMultiplier;
	}

	get yMultiplier(): number {
		return this.y.curveMultiplier;
	}

	get zMultiplier(): number {
		return this.z.curveMultiplier;
	}
}
