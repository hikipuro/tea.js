import * as Tea from "../../Tea";

export class PSTriggerModule {
	enabled: boolean;
	enter: Tea.ParticleSystemOverlapAction;
	exit: Tea.ParticleSystemOverlapAction;
	inside: Tea.ParticleSystemOverlapAction;
	maxColliderCount: number;
	outside: Tea.ParticleSystemOverlapAction;
	radiusScale: number;

	constructor() {
		this.enabled = false;
	}
}
