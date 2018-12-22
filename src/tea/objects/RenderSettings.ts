import * as Tea from "../Tea";

export class RenderSettings {
	static readonly className: string = "RenderSettings";
	ambientLight: Tea.Color;
	skybox: Tea.Skybox;

	constructor(app: Tea.App) {
		this.ambientLight = new Tea.Color(0.2, 0.2, 0.2, 1.0);
		this.skybox = new Tea.Skybox(app);
	}

	static fromJSON(app: Tea.App, json: any): RenderSettings {
		if (Tea.JSONUtil.isValidSceneJSON(json, RenderSettings.className) === false) {
			return null;
		}
		var renderSettings = new RenderSettings(app);
		renderSettings.ambientLight = Tea.Color.fromArray(json.ambientLight);
		//renderSettings.skybox = ;
		return renderSettings;
	}

	toJSON(): Object {
		var json = Tea.JSONUtil.createSceneJSON(RenderSettings.className);
		json.ambientLight = this.ambientLight;
		json.skybox = this.skybox.toJSON();
		return json;
	}
}
