import * as Tea from "../../Tea";

export class PSRotationOverLifetimeModule {
	enabled: boolean;
	separateAxes: boolean;
	size: Tea.ParticleSystem.MinMaxCurve;
	sizeMultiplier: number;
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
