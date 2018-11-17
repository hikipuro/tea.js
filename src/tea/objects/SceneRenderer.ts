import * as nodePath from "path";
import * as Tea from "../Tea";
import { Object3D } from "./Object3D";
import { SceneGrid } from "./SceneGrid";
import { SceneMovement } from "./SceneMovement";

class SceneIcon extends Object3D {
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

class SceneIcons {
	scene: Tea.Scene;
	icons: Array<SceneIcon>;
	renderers: Array<Tea.MeshRenderer>;

	constructor(scene: Tea.Scene) {
		this.scene = scene;
		this.icons = [];
		this.renderers = [];
	}

	addCameraIcon(object3d: Tea.Object3D): void {
		if (object3d == null || this.contains(object3d)) {
			return;
		}
		var path = nodePath.join(__dirname, "images/camera-icon.png");
		var icon = new SceneIcon(this.scene.app);
		icon.target = object3d;
		icon.material.mainTexture.load(path);
		this.icons.push(icon);
		this.renderers.push(icon.renderer);
	}

	addLightIcon(object3d: Tea.Object3D): void {
		if (object3d == null || this.contains(object3d)) {
			return;
		}
		var path = nodePath.join(__dirname, "images/light-icon.png");
		var icon = new SceneIcon(this.scene.app);
		icon.target = object3d;
		icon.material.mainTexture.load(path);
		this.icons.push(icon);
		this.renderers.push(icon.renderer);
	}

	contains(object3d: Tea.Object3D): boolean {
		var length = this.icons.length;
		for (var i = 0; i < length; i++) {
			var icon = this.icons[i];
			if (icon.target == object3d) {
				return true;
			}
		}
		return false;
	}

	update(camera: Tea.Camera): void {
		var length = this.icons.length;
		for (var i = 0; i < length; i++) {
			var icon = this.icons[i];
			icon.update(this.scene.isEditing, camera);
		}
	}
}

export class SceneRenderer {
	scene: Tea.Scene;
	cameraObject: Tea.Object3D;
	camera: Tea.Camera;
	grid: SceneGrid;
	icons: SceneIcons;

	constructor(scene: Tea.Scene) {
		this.scene = scene;
		this.createCamera();
		this.grid = new SceneGrid(scene.app);
		this.icons = new SceneIcons(scene);
	}

	render(renderers: Array<Tea.Renderer>, lights: Array<Tea.Light>): void {
		this.update();
		Tea.Renderer.drawCallCount = 0;
		var camera = this.camera;
		renderers.unshift(this.grid.renderer);
		renderers.push.apply(renderers, this.icons.renderers);
		var renderSettings = this.scene.renderSettings;
		var rendererCount = renderers.length;
		for (var i = 0; i < rendererCount; i++) {
			var renderer = renderers[i];
			if (renderer.material != null) {
				renderer.material.setTexture("_ShadowTex", null);
			}
			renderer.render(camera, lights, renderSettings);
		}
	}

	lockViewToSelected(object3d: Tea.Object3D): void {
		if (object3d == null) {
			return;
		}
		var position = object3d.position.clone();
		var camera = this.cameraObject;
		position.add$(camera.forward.mul$(-5.0));
		this.cameraObject.localPosition.copy(position);
	}

	protected createCamera(): void {
		this.cameraObject = this.scene.app.createCamera();
		this.cameraObject.localPosition.set(10, 10, -10);
		this.cameraObject.localEulerAngles = new Tea.Vector3(45, -45, 0);
		this.cameraObject.addComponent(SceneMovement);
		var meshFilter = this.cameraObject.addComponent(Tea.MeshFilter);
		meshFilter.mesh = Tea.Primitives.createQuadMesh();
		this.cameraObject.addComponent(Tea.MeshRenderer);
		this.camera = this.cameraObject.getComponent(Tea.Camera);
		this.camera.backgroundColor.set(0.5, 0.5, 0.5, 1.0);
	}

	protected update(): void {
		var children = this.scene.children;
		var childCount = children.length;
		for (var i = childCount - 1; i >= 0 ; i--) {
			this.updateObject3D(children[i]);
		}
		var cameras = this.scene.availableCameras;
		for (var i = 0; i < cameras.length; i++) {
			var camera = cameras[i];
			this.icons.addCameraIcon(camera.object3d);
		}
		var lights = this.scene.availableLights;
		for (var i = 0; i < lights.length; i++) {
			var light = lights[i];
			this.icons.addLightIcon(light.object3d);
		}
		this.icons.update(this.camera);
		this.cameraObject.update();
		this.camera.update();
		var position = this.cameraObject.localPosition.clone();
		position[0] = Math.round(position[0]);
		position[2] = Math.round(position[2]);
		position[0] += position[0] % 2.0;
		position[2] += position[2] % 2.0;
		this.grid.object3d.localPosition.set(
			position[0],
			0.0,
			position[2]
		);
		this.grid.object3d.update();
	}

	protected updateObject3D(object3d: Tea.Object3D): void {
		if (object3d == null || object3d.id == null) {
			return;
		}
		object3d.update(this.scene.isEditing);
		var children = object3d.children;
		var length = children.length;
		for (var i = 0; i < length; i++) {
			this.updateObject3D(children[i]);
		}
	}
}
