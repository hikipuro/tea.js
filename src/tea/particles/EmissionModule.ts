import * as Tea from "../Tea";

export class PSEmissionModule {
	enabled: boolean;
	//burstCount: number;
	//rateOverDistance: number;
	//rateOverDistanceMultiplier: number;
	rateOverTime: number;
	rateOverTimeMultiplier: number;

	constructor() {
		this.enabled = false;
		//this.burstCount = 0.0;
		//this.rateOverDistance = 0.0;
		//this.rateOverDistanceMultiplier = 0.0;
		this.rateOverTime = 10.0;
		this.rateOverTimeMultiplier = 1.0;
	}
}
