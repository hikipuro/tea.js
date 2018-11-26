import * as Tea from "../../Tea";
import { MinMaxCurve } from "../MinMaxCurve";

export class LightsModule {
	enabled: boolean;
	alphaAffectsIntensity: boolean;
	intensity: MinMaxCurve;
	light: Tea.Light;
	maxLights: number;
	range: MinMaxCurve;
	ratio: number;
	sizeAffectsRange: boolean;
	useParticleColor: boolean;
	useRandomDistribution: boolean;

	constructor() {
		this.enabled = false;
	}

	get intensityMultiplier(): number {
		return this.intensity.curveMultiplier;
	}

	get rangeMultiplier(): number {
		return this.range.curveMultiplier;
	}
}
