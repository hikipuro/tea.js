import * as Tea from "../Tea";
import { Camera } from "./Camera";

export class ShadowMapCamera extends Camera {
	static readonly className: string = "ShadowMapCamera";
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
		json[Tea.JSONUtil.TypeName] = ShadowMapCamera.className;
		return json;
	}

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, ShadowMapCamera.className) === false) {
			callback(null);
			return;
		}
		var shadowMapCamera = new ShadowMapCamera(app);
		shadowMapCamera.enabled = json.enabled;
		callback(shadowMapCamera);
	}
}
