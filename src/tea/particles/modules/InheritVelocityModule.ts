import * as Tea from "../../Tea";
import { MinMaxCurve } from "../MinMaxCurve";

export class InheritVelocityModule {
	enabled: boolean;
	curve: MinMaxCurve;
	curveMultiplier: number;
	mode: Tea.ParticleSystemInheritVelocityMode;

	constructor() {
		this.enabled = false;
	}
}
