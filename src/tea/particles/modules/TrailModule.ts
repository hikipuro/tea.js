import * as Tea from "../../Tea";
import { MinMaxCurve } from "../MinMaxCurve";

export class TrailModule {
	enabled: boolean;
	colorOverLifetime: MinMaxCurve;

	constructor() {
		this.enabled = false;
	}
}
