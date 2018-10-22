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
		var renderTexture = new Tea.RenderTexture(
			app//, 2048, 2048
		);
		this.targetTexture = renderTexture;

		var shader = new Tea.Shader(app);
		shader.attach(
			Tea.ShaderSources.depthVS,
			Tea.ShaderSources.depthFS
		);
		this.shader = shader;
		//this.gl.useProgram(shader.program);
		//shader.getAttribLocation("vertex");
	}

	toJSON(): Object {
		var json = super.toJSON();
		Object.assign(json, {
			_type: "ShadowMapCamera"
		});
		return json;
	}

	static fromJSON(app: Tea.App, json: any): ShadowMapCamera {
		if (json == null || json._type !== "ShadowMapCamera") {
			return null;
		}
		var shadowMapCamera = new ShadowMapCamera(app);
		return shadowMapCamera;
	}
}
