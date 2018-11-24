import * as Tea from "../../Tea";
import { MinMaxCurve } from "../MinMaxCurve";

export class LightsModule {
	enabled: boolean;
	alphaAffectsIntensity: boolean;
	intensity: MinMaxCurve;
	intensityMultiplier: number;
	light: Tea.Light;
	maxLights: number;
	range: MinMaxCurve;
	rangeMultiplier: number;
	ratio: number;
	sizeAffectsRange: boolean;
	useParticleColor: boolean;
	useRandomDistribution: boolean;

	constructor() {
		this.enabled = false;
	}
}
