import * as Tea from "../../Tea";

export class PSSizeOverLifetimeModule {
	enabled: boolean;
	range: Tea.Vector2;
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
