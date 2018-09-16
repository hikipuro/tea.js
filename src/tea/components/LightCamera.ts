import * as Tea from "../Tea";
import { Camera } from "./Camera";

export class LightCamera extends Camera {
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

}
