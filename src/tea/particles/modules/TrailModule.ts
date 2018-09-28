import * as Tea from "../../Tea";

export class PSTrailModule {
	enabled: boolean;
	colorOverLifetime: Tea.ParticleSystem.MinMaxCurve;

	constructor() {
		this.enabled = false;
	}
}
