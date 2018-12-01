import * as Tea from "../../Tea";
import { Editor } from "../Editor";
import { SceneRenderer } from "../../objects/SceneRenderer";
import { SceneGrid } from "./SceneGrid";
import { SceneMovement } from "./SceneMovement";
import { SceneIcons } from "./SceneIcons";
import { FrustumPlanes } from "./FrustumPlanes";
import { LightRange } from "./LightRange";
import { Outline } from "./Outline";

export class EditorSceneRenderer extends SceneRenderer {
	editor: Editor;
	cameraObject: Tea.Object3D;
	camera: Tea.Camera;
	grid: SceneGrid;
	icons: SceneIcons;
	frustumPlanes: FrustumPlanes;
	lightRange: LightRange;
	outline: Outline;

	constructor(scene: Tea.Scene) {
		super(scene);
		var app = scene.app;
		this.createCamera();
		this.grid = new SceneGrid(app);
		this.icons = new SceneIcons(scene);
		this.frustumPlanes = new FrustumPlanes(app);
		this.lightRange = new LightRange(app);
		this.outline = new Outline(app);
	}

	render(renderers: Array<Tea.Renderer>, lights: Array<Tea.Light>): void {
		this.update();
		Tea.Renderer.drawCallCount = 0;
		var camera = this.camera;
		renderers.unshift(this.outline.renderer);
		renderers.unshift(this.grid.renderer);
		renderers.unshift(this.frustumPlanes.renderer);
		renderers.unshift(this.lightRange.renderer);
		var renderSettings = this.scene.renderSettings;
		var rendererCount = renderers.length;
		for (var i = 0; i < rendererCount; i++) {
			var renderer = renderers[i];
			if (renderer.material != null) {
				renderer.material.setTexture("_ShadowTex", null);
			}
			renderer.render(camera, lights, renderSettings);
		}
		this.icons.cameras = this.scene.availableCameras;
		this.icons.lights = this.scene.availableLights;
		this.icons.render(camera, lights, renderSettings);
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
		this.camera.farClipPlane = 2000;
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

		var object3d = this.editor.hierarchyView.getSelectedObject();
		if (object3d) {
			this.frustumPlanes.object3d.update();
			this.frustumPlanes.setCamera(object3d);
			this.lightRange.object3d.update();
			this.lightRange.setLight(object3d);
		} else {
			this.frustumPlanes.clearLines();
			this.lightRange.clearLines();
		}
		this.outline.setObject(object3d);
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
