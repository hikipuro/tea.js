import * as Tea from "../../Tea";
import { PSMinMaxGradient } from "../MinMaxGradient";

type MinMaxGradient = PSMinMaxGradient;
var  MinMaxGradient = PSMinMaxGradient;

export class PSColorOverLifetimeModule {
	enabled: boolean;
	color: MinMaxGradient;

	constructor() {
		this.enabled = false;
		var gradient = new Tea.Gradient();
		this.color = new MinMaxGradient(gradient);
	}
}
