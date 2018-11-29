
import * as Tea from "../../Tea";
import { Object3D } from "../../objects/Object3D";

export class SceneIcon extends Object3D {
	target: Tea.Object3D;
	renderer: Tea.MeshRenderer;
	material: Tea.Material;

	constructor(app: Tea.App) {
		super(app);
		this.name = "SceneIcon";
		var meshFilter = this.addComponent(Tea.MeshFilter);
		var mesh = Tea.Primitives.createQuadMesh();
		mesh.normals = [
			new Tea.Vector3(0, 0, -1),
			new Tea.Vector3(0, 0, -1),
			new Tea.Vector3(0, 0, -1),
			new Tea.Vector3(0, 0, -1)
		];
		meshFilter.mesh = mesh;
		var shader = new Tea.Shader(app);
		shader.attach(
			Tea.ShaderSources.sceneIconVS,
			Tea.ShaderSources.sceneIconFS
		);
		//shader.settings.enableDepthTest = false;
		shader.settings.enableBlend = true;
		shader.settings.blend.srcRGB = Tea.ShaderBlendFunc.SrcAlpha;
		shader.settings.blend.dstRGB = Tea.ShaderBlendFunc.OneMinusSrcAlpha;
		shader.settings.blend.srcAlpha = Tea.ShaderBlendFunc.One;
		shader.settings.blend.dstAlpha = Tea.ShaderBlendFunc.One;
		var renderer = this.addComponent(Tea.MeshRenderer);
		renderer.material = Tea.Material.getDefault(app);
		renderer.material.shader = shader;
		this.renderer = renderer;
		this.material = renderer.material;
	}

	update(isEditing: boolean, camera: Tea.Camera = null): void {
		if (this.target == null) {
			return;
		}
		super.update();

		var material = this.material;
		var view = camera.cameraToWorldMatrix;
		material.setVector("CameraRight", new Tea.Vector4(view[0], view[1], view[2], 0.0));
		material.setVector("CameraUp", new Tea.Vector4(view[4], view[5], view[6], 0.0));
		if (this.target.position) {
			material.setVector("position", this.target.position.toVector4());
		}
	}
}
