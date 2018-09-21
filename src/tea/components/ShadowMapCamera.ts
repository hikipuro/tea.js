import * as Tea from "../Tea";
import { Camera } from "./Camera";

export class ShadowMapCamera extends Camera {
	shader: Tea.Shader;

	constructor(app: Tea.App) {
		super(app);
		this.backgroundColor = Tea.Color.white.clone();
		//this.fieldOfView = 90;
		this.aspect = 1.0;
		this.orthographic = true;
		//this.orthographicSize = 14;
		var renderTexture = new Tea.RenderTexture(app);
		this.targetTexture = renderTexture;

		var shader = new Tea.Shader(app);
		shader.attach(
			Tea.Shader.depthVertexShaderSource,
			Tea.Shader.depthFragmentShaderSource
		);
		this.shader = shader;
	}

	toJSON(): Object {
		var json = super.toJSON();
		Object.assign(json, {
			_type: "ShadowMapCamera"
		});
		return json;
	}
}
