import * as Tea from "../../Tea";
import { Burst } from "../Burst";
import { MinMaxCurve } from "../MinMaxCurve";

export class EmissionModule {
	static readonly className: string = "EmissionModule";
	enabled: boolean;
	rateOverDistance: MinMaxCurve;
	rateOverTime: MinMaxCurve;
	protected _bursts: Array<Burst>;
	protected _time: number;
	protected _rate: number;
	protected _emitted: number;

	constructor() {
		this.enabled = false;
		this.rateOverDistance = new MinMaxCurve(0.0);
		this.rateOverDistanceMultiplier = 1.0;
		this.rateOverTime = new MinMaxCurve(1.0);
		this.rateOverTimeMultiplier = 10.0;
		this._bursts = [];
		this._time = 0;
		this._rate = 0.0;
		this._emitted = 0;
	}

	get rateOverDistanceMultiplier(): number {
		return this.rateOverDistance.curveMultiplier;
	}
	set rateOverDistanceMultiplier(value: number) {
		this.rateOverDistance.curveMultiplier = value;
	}

	get rateOverTimeMultiplier(): number {
		return this.rateOverTime.curveMultiplier;
	}
	set rateOverTimeMultiplier(value: number) {
		this.rateOverTime.curveMultiplier = value;
	}

	get burstCount(): number {
		return this._bursts.length;
	}

	evaluate(time: number, duration: number): number {
		var ti = Math.floor(time);
		var t = time % 1.0;
		if (this._time !== ti) {
			this._emitted = 0;
			this._time = ti;
		}
		t += 1.0 / 60.0;
		var rate = this.rateOverTime.evaluate(time / duration);
		rate *= this.rateOverTimeMultiplier;
		this._rate = rate * t;
		rate = Math.floor(this._rate);
		var count = rate - this._emitted;
		this._emitted = rate;
		return count;
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

	static fromJSON(app: Tea.App, json: any): EmissionModule {
		if (Tea.JSONUtil.isValidSceneJSON(json, EmissionModule.className) === false) {
			return null;
		}
		var module = new EmissionModule();
		module.enabled = json.enabled;
		module.rateOverDistance = MinMaxCurve.fromJSON(app, json.rateOverDistance);
		module.rateOverTime = MinMaxCurve.fromJSON(app, json.rateOverTime);
		return module;
	}

	toJSON(): Object {
		var json: any = {};
		json[Tea.JSONUtil.TypeName] = EmissionModule.className;
		Object.assign(json, {
			enabled: this.enabled,
			rateOverDistance: this.rateOverDistance.toJSON(),
			rateOverTime: this.rateOverTime.toJSON()
		});
		return json;
	}
}
