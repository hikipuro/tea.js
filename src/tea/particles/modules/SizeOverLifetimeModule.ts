import * as Tea from "../../Tea";
import { MinMaxCurve } from "../MinMaxCurve";

export class SizeOverLifetimeModule {
	enabled: boolean;
	range: Tea.Vector2;
	separateAxes: boolean;
	size: MinMaxCurve;
	x: MinMaxCurve;
	y: MinMaxCurve;
	z: MinMaxCurve;

	constructor() {
		this.enabled = false;
	}

	get sizeMultiplier(): number {
		return this.size.curveMultiplier;
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
