import * as Tea from "../Tea";
import { SceneGrid } from "./SceneGrid";
import { SceneMovement } from "./SceneMovement";

class SceneIcons {
	scene: Tea.Scene;

	constructor(scene: Tea.Scene) {
		this.scene = scene;
	}
}

export class SceneRenderer {
	scene: Tea.Scene;
	cameraObject: Tea.Object3D;
	camera: Tea.Camera;
	grid: SceneGrid;

	constructor(scene: Tea.Scene) {
		this.scene = scene;
		this.createCamera();
		this.grid = new SceneGrid(scene.app);
	}

	render(renderers: Array<Tea.Renderer>, lights: Array<Tea.Light>): void {
		this.update();
		Tea.Renderer.drawCallCount = 0;
		var camera = this.camera;
		renderers.unshift(this.grid.renderer);
		var renderSettings = this.scene.renderSettings;
		var rendererCount = renderers.length;
		for (var i = 0; i < rendererCount; i++) {
			var renderer = renderers[i];
			renderer.material.setTexture("_ShadowTex", null);
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
		object3d.updateScene();
		var children = object3d.children;
		var length = children.length;
		for (var i = 0; i < length; i++) {
			this.updateObject3D(children[i]);
		}
	}
}
