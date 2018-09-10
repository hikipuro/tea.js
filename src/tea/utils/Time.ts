import * as Tea from "../Tea";

export class Time {
	protected _frameCount: number;
	protected _deltaTime: number;
	protected _startTime: number;
	protected _lastUpdate: number;

	constructor() {
		this._frameCount = 0;
	}

	get deltaTime(): number {
		return this._deltaTime / 1000.0;
	}

	get frameCount(): number {
		return this._frameCount;
	}

	get time(): number {
		return (this._lastUpdate - this._startTime) / 1000.0;
	}

	start(): void {
		var now = Tea.now();
		this._startTime = now;
		this._lastUpdate = now;
	}

	update(): void {
		this._frameCount++;

		var now = Tea.now();
		this._deltaTime = now - this._lastUpdate;
		this._lastUpdate = now;
	}
}
