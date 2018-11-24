import { MinMaxCurve } from "./MinMaxCurve";

export class Burst {
	time: number;
	minCount: number;
	maxCount: number;
	cycleCount: number;
	repeatInterval: number;
	count: MinMaxCurve;

	constructor(time: number, count: number);
	constructor(time: number, minCount: number, maxCount: number);
	constructor(time: number, minCount: number, maxCount: number, cycleCount: number, repeatInterval: number);
	constructor(time: number, count: MinMaxCurve);
	constructor(time: number, count: MinMaxCurve, cycleCount: number, repeatInterval: number);
	constructor(time: number, a: number | MinMaxCurve, b?: number, c?: number, d?: number) {
		this.time = time;
		this.count = null;
		if (d != null) {
			this.minCount = a as number;
			this.maxCount = b;
			this.cycleCount = c;
			this.repeatInterval = d;
			return;
		}
		if (c != null) {
			this.count = a as MinMaxCurve;
			this.minCount = 0;
			this.maxCount = 0;
			this.cycleCount = b;
			this.repeatInterval = c;
			return;
		}
		if (b != null) {
			this.minCount = a as number;
			this.maxCount = b;
			this.cycleCount = 0;
			this.repeatInterval = 0;
			return;
		}
		if (a instanceof MinMaxCurve) {
			this.count = a as MinMaxCurve;
			this.minCount = 0;
			this.maxCount = 0;
			this.cycleCount = 0;
			this.repeatInterval = 0;
			return;
		}
		this.count = null;
		this.minCount = a;
		this.maxCount = a;
		this.cycleCount = 0;
		this.repeatInterval = 0;
	}
}
