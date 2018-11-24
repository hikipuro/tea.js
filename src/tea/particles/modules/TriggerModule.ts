import * as Tea from "../../Tea";

export class TriggerModule {
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
