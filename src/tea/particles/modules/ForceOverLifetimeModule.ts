import * as Tea from "../../Tea";
import { MinMaxCurve } from "../MinMaxCurve";

export class ForceOverLifetimeModule {
	enabled: boolean;
	randomized: boolean;
	space: Tea.ParticleSystemSimulationSpace;
	x: MinMaxCurve;
	xMultiplier: number;
	y: MinMaxCurve;
	yMultiplier: number;
	z: MinMaxCurve;
	zMultiplier: number;

	constructor() {
		this.enabled = false;
	}
}
