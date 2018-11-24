import * as Tea from "../../Tea";
import { MinMaxCurve } from "../MinMaxCurve";

export class LimitVelocityOverLifetimeModule {
	enabled: boolean;
	dampen: number;
	drag: MinMaxCurve;
	dragMultiplier: number;
	limit: MinMaxCurve;
	limitMultiplier: number;
	limitX: MinMaxCurve;
	limitXMultiplier: number;
	limitY: MinMaxCurve;
	limitYMultiplier: number;
	limitZ: MinMaxCurve;
	limitZMultiplier: number;
	multiplyDragByParticleSize: boolean;
	multiplyDragByParticleVelocity: boolean;
	separateAxes: boolean;
	space: Tea.ParticleSystemSimulationSpace;

	constructor() {
		this.enabled = false;
	}
}
