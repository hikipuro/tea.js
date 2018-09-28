import { PSMinMaxCurve } from "../MinMaxCurve";
import { PSBurst } from "../Burst";

type MinMaxCurve = PSMinMaxCurve;
var  MinMaxCurve = PSMinMaxCurve;
type Burst = PSBurst;
var  Burst = PSBurst;

export class PSEmissionModule {
	enabled: boolean;
	rateOverDistance: MinMaxCurve;
	rateOverDistanceMultiplier: number;
	rateOverTime: MinMaxCurve;
	rateOverTimeMultiplier: number;
	protected _bursts: Array<Burst>;

	constructor() {
		this.enabled = false;
		this.rateOverDistance = new MinMaxCurve(0);
		this.rateOverDistanceMultiplier = 0.0;
		this.rateOverTime = new MinMaxCurve(0);
		this.rateOverTimeMultiplier = 1.0;
		this._bursts = [];
	}

	get burstCount(): number {
		return this._bursts.length;
	}

	getBurst(index: number): Burst {
		return this._bursts[index];
	}

	//getBursts(bursts: Array<Burst>): number {
	//}

	setBurst(index: number, burst: Burst): void {
		this._bursts[index] = burst;
	}

	//setBursts(bursts: Array<Burst>, size?: number): void {
	//}
}
