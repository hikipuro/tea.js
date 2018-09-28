import * as Tea from "../../Tea";

export class PSCustomDataModule {
	enabled: boolean;

	constructor() {
		this.enabled = false;
	}

	getColor(stream: Tea.ParticleSystemCustomData): Tea.ParticleSystem.MinMaxGradient {
		return null;
	}
}
