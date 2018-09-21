import * as Tea from "../Tea";

export class RenderSettings {
	ambientLight: Tea.Color;
	skybox: Tea.Skybox;

	constructor(app: Tea.App) {
		this.ambientLight = new Tea.Color(0.2, 0.2, 0.2, 1.0);
		this.skybox = new Tea.Skybox(app);
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
