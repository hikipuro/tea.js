import * as Tea from "../Tea";

export class ObjectFactory {
	static createScene(app: Tea.App): Tea.Scene {
		var scene = new Tea.Scene(app);
		return scene;
	}

	/*
	static createSceneFromJSON(app: Tea.App, data: any): Tea.Scene {
		var scene = Tea.Scene.fromJSON(app, data);
		return scene;
	}
	//*/

	static createObject3D(app: Tea.App): Tea.Object3D {
		var object3d = new Tea.Object3D(app);
		object3d.name = "Empty";
		return object3d;
	}

	static createDirectionalLight(app: Tea.App): Tea.Object3D {
		var object3d = new Tea.Object3D(app);
		object3d.name = "Directional Light";
		object3d.localPosition.set(0, 10, 0);
		object3d.localRotation = Tea.Quaternion.euler(50, -30, 0);
		object3d.addComponent(Tea.Light);
		return object3d;
	}

	static createPointLight(app: Tea.App): Tea.Object3D {
		var object3d = new Tea.Object3D(app);
		object3d.name = "Point Light";
		object3d.localPosition.set(0, 10, 0);
		var light = object3d.addComponent(Tea.Light);
		light.type = Tea.LightType.Point;
		return object3d;
	}

	static createSpotLight(app: Tea.App): Tea.Object3D {
		var object3d = new Tea.Object3D(app);
		object3d.name = "Spot Light";
		object3d.localPosition.set(0, 10, 0);
		object3d.localRotation = Tea.Quaternion.euler(50, -30, 0);
		var light = object3d.addComponent(Tea.Light);
		light.type = Tea.LightType.Spot;
		return object3d;
	}

	static createAudioSource(app: Tea.App): Tea.Object3D {
		var object3d = new Tea.Object3D(app);
		object3d.name = "Audio Source";
		object3d.addComponent(Tea.AudioSource);
		return object3d;
	}


	static createCamera(app: Tea.App): Tea.Object3D {
		var object3d = new Tea.Object3D(app);
		object3d.name = "Camera";
		object3d.localPosition.set(0, 1, -10);
		object3d.addComponent(Tea.Camera);
		return object3d;
	}

	static createShadowMapCamera(app: Tea.App): Tea.Object3D {
		var object3d = new Tea.Object3D(app);
		object3d.name = "Shadow Map Camera";
		object3d.localPosition.set(0, 1, -10);
		object3d.addComponent(Tea.ShadowMapCamera);
		return object3d;
	}

	/*
	static createDefaultShader(app: Tea.App): Tea.Shader {
		var shader = new Tea.Shader(app);
		shader.attach(
			Tea.ShaderSources.defaultVS,
			Tea.ShaderSources.defaultFS
		);
		return shader;
	}
	*/

	static createShader(app: Tea.App, vs: string, fs: string): Tea.Shader {
		var shader = new Tea.Shader(app);
		shader.attach(vs, fs);
		return shader;
	}

	static createMeshRenderer(app: Tea.App, shader: Tea.Shader): Tea.MeshRenderer {
		var renderer = new Tea.MeshRenderer(app);
		renderer.material = Tea.Material.getDefault(app);
		renderer.material.shader = shader;
		return renderer;
	}

	static createLineRenderer(app: Tea.App): Tea.Object3D {
		var object3d = new Tea.Object3D(app);
		var renderer = object3d.addComponent(Tea.LineRenderer);
		var shader = new Tea.Shader(app);
		shader.attach(
			Tea.ShaderSources.lineVS,
			Tea.ShaderSources.lineFS
		);
		shader.settings.enableBlend = true;
		shader.settings.blend.srcRGB = Tea.ShaderBlendFunc.SrcAlpha;
		shader.settings.blend.dstRGB = Tea.ShaderBlendFunc.OneMinusSrcAlpha;
		shader.settings.blend.srcAlpha = Tea.ShaderBlendFunc.One;
		shader.settings.blend.dstAlpha = Tea.ShaderBlendFunc.One;
		renderer.material = Tea.Material.getDefault(app);
		renderer.material.shader = shader;
		return object3d;
	}

	static createTexture(app: Tea.App, image: HTMLImageElement): Tea.Texture {
		var texture = new Tea.Texture(app);
		texture.image = image;
		return texture;
	}

	static createParticleSystem(app: Tea.App): Tea.Object3D {
		app.enableInstancedArrays();
		var object3d = new Tea.Object3D(app);
		object3d.rotate(-90.0, 0.0, 0.0);
		var shader = new Tea.Shader(app);
		if (app.status.ANGLE_instanced_arrays != null) {
			shader.attach(
				Tea.ShaderSources.particleInstancingVS,
				Tea.ShaderSources.particleInstancingFS
			);
		} else {
			shader.attach(
				Tea.ShaderSources.particleVS,
				Tea.ShaderSources.particleFS
			);
		}
		//shader.settings.enableDepthTest = false;
		shader.settings.depthWriteMask = false;
		shader.settings.enableBlend = true;
		shader.settings.blend.srcRGB = Tea.ShaderBlendFunc.SrcAlpha;
		shader.settings.blend.dstRGB = Tea.ShaderBlendFunc.OneMinusSrcAlpha;
		shader.settings.blend.srcAlpha = Tea.ShaderBlendFunc.One;
		shader.settings.blend.dstAlpha = Tea.ShaderBlendFunc.One;
		object3d.addComponent(Tea.ParticleSystem);
		var renderer = object3d.addComponent(Tea.ParticleSystemRenderer);
		renderer.material = Tea.Material.getDefault(app);
		renderer.material.renderQueue = 3000;
		renderer.material.setFloat("_Cutoff", 0.0);
		renderer.material.shader = shader;
		renderer.material.mainTexture = Tea.Texture.getDefaultParticle(app);
		object3d.name = "Particle System";
		return object3d;
	}

	static createTextMesh(app: Tea.App): Tea.Object3D {
		var object3d = new Tea.Object3D(app);
		var shader = new Tea.Shader(app);
		shader.attach(
			Tea.ShaderSources.textVS,
			Tea.ShaderSources.textFS
		);
		shader.settings.enableBlend = true;
		shader.settings.blend.srcRGB = Tea.ShaderBlendFunc.SrcAlpha;
		shader.settings.blend.dstRGB = Tea.ShaderBlendFunc.OneMinusSrcAlpha;
		shader.settings.blend.srcAlpha = Tea.ShaderBlendFunc.One;
		shader.settings.blend.dstAlpha = Tea.ShaderBlendFunc.One;
		var textMesh = object3d.addComponent(Tea.TextMesh);
		var meshFilter = object3d.addComponent(Tea.MeshFilter);
		meshFilter.mesh = textMesh.mesh;
		var renderer = object3d.addComponent(Tea.MeshRenderer);
		renderer.material = Tea.Material.getDefault(app);
		renderer.material.renderQueue = 3000;
		renderer.material.setFloat("_Cutoff", 0.0);
		renderer.material.mainTexture = textMesh.texture;
		renderer.material.shader = shader;
		//renderer.material.color.set(1,0,0,1);
		object3d.name = "Text Mesh";
		return object3d;
	}

	static createCanvas(app: Tea.App): Tea.Object3D {
		var object3d = new Tea.Object3D(app);
		object3d.addComponent(Tea.Canvas);
		object3d.name = "Canvas";
		var renderer = object3d.addComponent(Tea.CanvasRenderer);
		var shader = new Tea.Shader(app);
		shader.attach(
			Tea.ShaderSources.uiComponentVS,
			Tea.ShaderSources.uiComponentFS
		);
		shader.settings.enableBlend = true;
		shader.settings.blend.srcRGB = Tea.ShaderBlendFunc.SrcAlpha;
		shader.settings.blend.dstRGB = Tea.ShaderBlendFunc.OneMinusSrcAlpha;
		shader.settings.blend.srcAlpha = Tea.ShaderBlendFunc.One;
		shader.settings.blend.dstAlpha = Tea.ShaderBlendFunc.One;
		renderer.material = Tea.Material.getDefault(app);
		renderer.material.renderQueue = 4000;
		renderer.material.shader = shader;
		return object3d;
	}

	static createUIText(app: Tea.App): Tea.Object3D {
		var object3d = new Tea.Object3D(app);
		object3d.addComponent(Tea.UI.Text);
		object3d.name = "Text";
		return object3d;
	}

	static createUIImage(app: Tea.App): Tea.Object3D {
		var object3d = new Tea.Object3D(app);
		object3d.addComponent(Tea.UI.Image);
		object3d.name = "Image";
		return object3d;
	}

	static createUIButton(app: Tea.App): Tea.Object3D {
		var object3d = new Tea.Object3D(app);
		object3d.addComponent(Tea.UI.Button);
		object3d.name = "Button";
		return object3d;
	}

	static createUIRadioButton(app: Tea.App): Tea.Object3D {
		var object3d = new Tea.Object3D(app);
		object3d.addComponent(Tea.UI.RadioButton);
		object3d.name = "RadioButton";
		return object3d;
	}

	static createUICheckbox(app: Tea.App): Tea.Object3D {
		var object3d = new Tea.Object3D(app);
		object3d.addComponent(Tea.UI.Checkbox);
		object3d.name = "Checkbox";
		return object3d;
	}
}
