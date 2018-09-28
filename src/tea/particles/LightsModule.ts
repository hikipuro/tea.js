import * as Tea from "../Tea";

export class PSLightsModule {
	enabled: boolean;
	alphaAffectsIntensity: boolean;
	intensity: Tea.ParticleSystem.MinMaxCurve;
	intensityMultiplier: number;
	light: Tea.Light;
	maxLights: number;
	range: Tea.ParticleSystem.MinMaxCurve;
	rangeMultiplier: number;
	ratio: number;
	sizeAffectsRange: boolean;
	useParticleColor: boolean;
	useRandomDistribution: boolean;

	constructor() {
		this.enabled = false;
	}
}
