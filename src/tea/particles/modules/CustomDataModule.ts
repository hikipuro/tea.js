import * as Tea from "../../Tea";
import { MinMaxGradient } from "../MinMaxGradient";

export class CustomDataModule {
	enabled: boolean;

	constructor() {
		this.enabled = false;
	}

	getColor(stream: Tea.ParticleSystemCustomData): MinMaxGradient {
		return null;
	}
}
