import * as Tea from "../Tea";

export class RenderSettings {
	ambientLight: Tea.Color;
	skybox: Tea.Skybox;

	constructor(app: Tea.App) {
		this.ambientLight = new Tea.Color(0.2, 0.2, 0.2, 1.0);
		this.skybox = new Tea.Skybox(app);
	}

	static fromJSON(app: Tea.App, json: any): RenderSettings {
		if (json == null || json._type !== "RenderSettings") {
			return null;
		}
		var renderSettings = new RenderSettings(app);
		renderSettings.ambientLight = Tea.Color.fromArray(json.ambientLight);
		//renderSettings.skybox = ;
		return renderSettings;
	}

	toJSON(): Object {
		var json = {
			_type: "RenderSettings",
			ambientLight: this.ambientLight,
			skybox: this.skybox.toJSON()
		};
		return json;
	}
}
