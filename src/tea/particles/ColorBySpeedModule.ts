import * as Tea from "../Tea";
import { PSMinMaxGradient } from "./MinMaxGradient";

type MinMaxGradient = PSMinMaxGradient;
var  MinMaxGradient = PSMinMaxGradient;

export class PSColorBySpeedModule {
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
