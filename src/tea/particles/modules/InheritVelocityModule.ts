import * as Tea from "../../Tea";
import { MinMaxCurve } from "../MinMaxCurve";

export class InheritVelocityModule {
	enabled: boolean;
	curve: MinMaxCurve;
	mode: Tea.ParticleSystemInheritVelocityMode;

	constructor() {
		this.enabled = false;
	}

	get curveMultiplier(): number {
		return this.curve.curveMultiplier;
	}
}
