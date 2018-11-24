import * as Tea from "../../Tea";
import { MinMaxGradient } from "../MinMaxGradient";

export class ColorBySpeedModule {
	enabled: boolean;
	color: MinMaxGradient;
	range: Tea.Vector2;

	constructor() {
		this.enabled = false;
		var gradient = new Tea.Gradient();
		this.color = new MinMaxGradient(gradient);
		this.range = new Tea.Vector2();
	}
}
