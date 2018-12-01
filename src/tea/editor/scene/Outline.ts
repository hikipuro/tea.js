import * as Tea from "../../Tea";

export class Outline {
	object3d: Tea.Object3D;
	meshFilter: Tea.MeshFilter;
	renderer: Tea.MeshRenderer;
	light: Tea.Light;

	constructor(app: Tea.App) {
		this.object3d = app.createObject3D();
		this.object3d.name = "Outline";
		this.meshFilter = this.object3d.addComponent(Tea.MeshFilter);
		var renderer = this.object3d.addComponent(Tea.MeshRenderer);
		renderer.material = new Tea.Material(app);
		var shader = new Tea.Shader(app);
		shader.attach(
			Tea.ShaderSources.outlineVS,
			Tea.ShaderSources.outlineFS
		);
		shader.settings.enableDepthTest = false;
		shader.settings.enableBlend = true;
		shader.settings.blend.srcRGB = Tea.ShaderBlendFunc.SrcAlpha;
		shader.settings.blend.dstRGB = Tea.ShaderBlendFunc.OneMinusSrcAlpha;
		shader.settings.blend.srcAlpha = Tea.ShaderBlendFunc.One;
		shader.settings.blend.dstAlpha = Tea.ShaderBlendFunc.One;
		renderer.material.shader = shader;
		renderer.material.color.set(1, 0.5, 0, 0.7);
		this.renderer = renderer;
	}

	setObject(object3d: Tea.Object3D): void {
		this.meshFilter.mesh = null;
		if (object3d == null) {
			this.object3d.update();
			return;
		}
		var meshFilter = object3d.getComponent(Tea.MeshFilter);
		if (meshFilter == null) {
			this.object3d.update();
			return;
		}
		this.meshFilter.data = meshFilter.data;
		this.meshFilter.mesh = meshFilter.mesh;
		//this.renderer.update();
		this.object3d.localPosition.copy(object3d.position);
		this.object3d.localRotation.copy(object3d.rotation);
		this.object3d.localScale.copy(object3d.scale);
		this.object3d.update();
	}
}
