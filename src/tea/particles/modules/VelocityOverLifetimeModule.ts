import * as Tea from "../../Tea";
import { MinMaxCurve } from "../MinMaxCurve";

export class VelocityOverLifetimeModule {
	enabled: boolean;
	orbitalOffsetX: MinMaxCurve;
	orbitalOffsetY: MinMaxCurve;
	orbitalOffsetZ: MinMaxCurve;
	orbitalX: MinMaxCurve;
	orbitalY: MinMaxCurve;
	orbitalZ: MinMaxCurve;
	radial: MinMaxCurve;
	space: Tea.ParticleSystemSimulationSpace;
	speedModifier: MinMaxCurve;
	x: MinMaxCurve;
	y: MinMaxCurve;
	z: MinMaxCurve;

	constructor() {
		this.enabled = false;
		this.x = new MinMaxCurve(0.0);
		this.y = new MinMaxCurve(0.0);
		this.z = new MinMaxCurve(0.0);
	}

	get orbitalOffsetXMultiplier(): number {
		return this.orbitalOffsetX.curveMultiplier;
	}

	get orbitalOffsetYMultiplier(): number {
		return this.orbitalOffsetY.curveMultiplier;
	}

	get orbitalOffsetZMultiplier(): number {
		return this.orbitalOffsetZ.curveMultiplier;
	}

	get orbitalXMultiplier(): number {
		return this.orbitalX.curveMultiplier;
	}

	get orbitalYMultiplier(): number {
		return this.orbitalY.curveMultiplier;
	}

	get orbitalZMultiplier(): number {
		return this.orbitalZ.curveMultiplier;
	}

	get radialMultiplier(): number {
		return this.radial.curveMultiplier;
	}
	
	get speedModifierMultiplier(): number {
		return this.speedModifier.curveMultiplier;
	}

	get xMultiplier(): number {
		return this.x.curveMultiplier;
	}

	get yMultiplier(): number {
		return this.y.curveMultiplier;
	}

	get zMultiplier(): number {
		return this.z.curveMultiplier;
	}
}
