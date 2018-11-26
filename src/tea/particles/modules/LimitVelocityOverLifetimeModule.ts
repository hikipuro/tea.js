import * as Tea from "../../Tea";
import { MinMaxCurve } from "../MinMaxCurve";

export class LimitVelocityOverLifetimeModule {
	enabled: boolean;
	dampen: number;
	drag: MinMaxCurve;
	limit: MinMaxCurve;
	limitX: MinMaxCurve;
	limitY: MinMaxCurve;
	limitZ: MinMaxCurve;
	multiplyDragByParticleSize: boolean;
	multiplyDragByParticleVelocity: boolean;
	separateAxes: boolean;
	space: Tea.ParticleSystemSimulationSpace;

	constructor() {
		this.enabled = false;
	}

	get dragMultiplier(): number {
		return this.drag.curveMultiplier;
	}

	get limitMultiplier(): number {
		return this.limit.curveMultiplier;
	}

	get limitXMultiplier(): number {
		return this.limitX.curveMultiplier;
	}

	get limitYMultiplier(): number {
		return this.limitY.curveMultiplier;
	}

	get limitZMultiplier(): number {
		return this.limitZ.curveMultiplier;
	}
}
