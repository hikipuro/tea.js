import * as Tea from "../../Tea";

export class PSInheritVelocityModule {
	enabled: boolean;
	curve: Tea.ParticleSystem.MinMaxCurve;
	curveMultiplier: number;
	mode: Tea.ParticleSystemInheritVelocityMode;

	constructor() {
		this.enabled = false;
	}
}
