import * as Tea from "../Tea";

export class PSForceOverLifetimeModule {
	enabled: boolean;
	randomized: boolean;
	space: Tea.ParticleSystemSimulationSpace;
	x: Tea.ParticleSystem.MinMaxCurve;
	xMultiplier: number;
	y: Tea.ParticleSystem.MinMaxCurve;
	yMultiplier: number;
	z: Tea.ParticleSystem.MinMaxCurve;
	zMultiplier: number;

	constructor() {
		this.enabled = false;
	}
}
