import * as Tea from "../Tea";

export class PSCollisionModule {
	enabled: boolean;
	bounce: Tea.ParticleSystem.MinMaxCurve;
	bounceMultiplier: number;
	colliderForce: number;

	constructor() {
		this.enabled = false;
	}
}
