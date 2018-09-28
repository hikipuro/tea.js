import * as Tea from "../../Tea";

export class PSLimitVelocityOverLifetimeModule {
	enabled: boolean;
	dampen: number;
	drag: Tea.ParticleSystem.MinMaxCurve;
	dragMultiplier: number;
	limit: Tea.ParticleSystem.MinMaxCurve;
	limitMultiplier: number;
	limitX: Tea.ParticleSystem.MinMaxCurve;
	limitXMultiplier: number;
	limitY: Tea.ParticleSystem.MinMaxCurve;
	limitYMultiplier: number;
	limitZ: Tea.ParticleSystem.MinMaxCurve;
	limitZMultiplier: number;
	multiplyDragByParticleSize: boolean;
	multiplyDragByParticleVelocity: boolean;
	separateAxes: boolean;
	space: Tea.ParticleSystemSimulationSpace;

	constructor() {
		this.enabled = false;
	}
}
