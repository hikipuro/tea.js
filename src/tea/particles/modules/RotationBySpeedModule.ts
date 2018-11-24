import * as Tea from "../../Tea";
import { MinMaxCurve } from "../MinMaxCurve";

export class RotationBySpeedModule {
	enabled: boolean;
	range: Tea.Vector2;
	separateAxes: boolean;
	size: MinMaxCurve;
	sizeMultiplier: number;
	x: MinMaxCurve;
	xMultiplier: number;
	y: MinMaxCurve;
	yMultiplier: number;
	z: MinMaxCurve;
	zMultiplier: number;

	constructor() {
		this.enabled = false;
	}
}
