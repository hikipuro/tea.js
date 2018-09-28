import * as Tea from "../Tea";

export class PSVelocityOverLifetimeModule {
	enabled: boolean;
	orbitalOffsetX: Tea.ParticleSystem.MinMaxCurve;
	orbitalOffsetXMultiplier: number;
	orbitalOffsetY: Tea.ParticleSystem.MinMaxCurve;
	orbitalOffsetYMultiplier: number;
	orbitalOffsetZ: Tea.ParticleSystem.MinMaxCurve;
	orbitalOffsetZMultiplier: number;
	orbitalX: Tea.ParticleSystem.MinMaxCurve;
	orbitalXMultiplier: number;
	orbitalY: Tea.ParticleSystem.MinMaxCurve;
	orbitalYMultiplier: number;
	orbitalZ: Tea.ParticleSystem.MinMaxCurve;
	orbitalZMultiplier: number;
	radial: Tea.ParticleSystem.MinMaxCurve;
	radialMultiplier: number;
	space: Tea.ParticleSystemSimulationSpace;
	speedModifier: Tea.ParticleSystem.MinMaxCurve;
	speedModifierMultiplier: number;
	x: Tea.ParticleSystem.MinMaxCurve;
	xMultiplier: number;
	y: Tea.ParticleSystem.MinMaxCurve;
	yMultiplier: number;
	z: Tea.ParticleSystem.MinMaxCurve;
	zMultiplier: number;

	constructor() {
		this.enabled = false;
		this.x = new Tea.ParticleSystem.MinMaxCurve(0.0);
		this.y = new Tea.ParticleSystem.MinMaxCurve(0.0);
		this.z = new Tea.ParticleSystem.MinMaxCurve(0.0);
	}
}
