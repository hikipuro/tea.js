import * as Tea from "../../Tea";
import { MinMaxGradient } from "../MinMaxGradient";

export class ColorOverLifetimeModule {
	enabled: boolean;
	color: MinMaxGradient;

	constructor() {
		this.enabled = false;
		var gradient = new Tea.Gradient();
		this.color = new MinMaxGradient(gradient);
	}

	static fromJSON(app: Tea.App, json: any): ColorOverLifetimeModule {
		if (json == null || json._type !== "ColorOverLifetimeModule") {
			return null;
		}
		var module = new ColorOverLifetimeModule();
		module.enabled = json.enabled;
		module.color = MinMaxGradient.fromJSON(app, json.color);
		return module;
	}

	toJSON(): Object {
		var json = {
			_type: "ColorOverLifetimeModule",
			enabled: this.enabled,
			color: this.color.toJSON()
		};
		return json;
	}
}
