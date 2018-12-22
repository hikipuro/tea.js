import * as Tea from "../../Tea";
import { MinMaxGradient } from "../MinMaxGradient";

export class ColorOverLifetimeModule {
	static readonly className: string = "ColorOverLifetimeModule";
	enabled: boolean;
	color: MinMaxGradient;

	constructor() {
		this.enabled = false;
		var gradient = new Tea.Gradient();
		this.color = new MinMaxGradient(gradient);
	}

	static fromJSON(app: Tea.App, json: any): ColorOverLifetimeModule {
		if (Tea.JSONUtil.isValidSceneJSON(json, ColorOverLifetimeModule.className) === false) {
			return null;
		}
		var module = new ColorOverLifetimeModule();
		module.enabled = json.enabled;
		module.color = MinMaxGradient.fromJSON(app, json.color);
		return module;
	}

	toJSON(): Object {
		var json: any = {};
		json[Tea.JSONUtil.TypeName] = ColorOverLifetimeModule.className;
		json.enabled = this.enabled;
		json.color = this.color.toJSON();
		return json;
	}
}
