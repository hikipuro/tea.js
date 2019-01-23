import * as Tea from "../../Tea";
import { Editor } from "../Editor";
import { SceneRenderer } from "../../objects/SceneRenderer";
import { SceneGrid } from "./SceneGrid";
import { SceneMovement } from "./SceneMovement";
import { SceneIcons } from "./SceneIcons";
import { FrustumPlanes } from "./FrustumPlanes";
import { LightRange } from "./LightRange";
import { Outline } from "./Outline";
import { Collider } from "./Collider";
import { ObjectBounds } from "./ObjectBounds";

export class EditorSceneRenderer extends SceneRenderer {
	editor: Editor;
	cameraObject: Tea.Object3D;
	camera: Tea.Camera;
	grid: SceneGrid;
	icons: SceneIcons;
	frustumPlanes: FrustumPlanes;
	lightRange: LightRange;
	outline: Outline;
	collider: Collider;
	objectBounds: ObjectBounds;
	renderers: Array<Tea.Renderer>;

	constructor(scene: Tea.Scene) {
		super(scene);
		var app = scene.app;
		this.createCamera();
		this.grid = new SceneGrid(app);
		this.icons = new SceneIcons(scene);
		this.frustumPlanes = new FrustumPlanes(app);
		this.lightRange = new LightRange(app);
		this.outline = new Outline(app);
		this.collider = new Collider(app);
		this.objectBounds = new ObjectBounds(app);
		this.renderers = [];
		this.renderers.unshift(this.grid.renderer);
		this.renderers.unshift(this.objectBounds.renderer);
		this.renderers.unshift(this.collider.renderer);
		this.renderers.unshift(this.outline.renderer);
		this.renderers.unshift(this.frustumPlanes.renderer);
		this.renderers.unshift(this.lightRange.renderer);
	}

	render(renderers: Array<Tea.Renderer>, lights: Array<Tea.Light>): void {
		this.update();
		Tea.Renderer.drawCallCount = 0;
		var camera = this.camera;
		var renderSettings = this.scene.renderSettings;
		var rendererCount = this.renderers.length;
		for (var i = 0; i < rendererCount; i++) {
			var renderer = this.renderers[i];
			renderer.render(camera, lights, renderSettings);
		}
		rendererCount = renderers.length;
		for (var i = 0; i < rendererCount; i++) {
			var renderer = renderers[i];
			if (renderer instanceof Tea.UI.CanvasRenderer) {
				continue;
			}
			if (this.frustumCulling(renderer, camera.frustumPlanes)) {
				continue;
			}
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
		position.addSelf(camera.forward.mulSelf(-5.0));
		this.cameraObject.localPosition.copy(position);
	}

	protected createCamera(): void {
		this.cameraObject = this.scene.app.createCamera();
		this.cameraObject.localPosition.set(10, 10, -10);
		this.cameraObject.localEulerAngles = new Tea.Vector3(45, -45, 0);
		var movement = this.cameraObject.addComponent(SceneMovement);
		var meshFilter = this.cameraObject.addComponent(Tea.MeshFilter);
		meshFilter.mesh = Tea.Primitives.createQuadMesh();
		this.cameraObject.addComponent(Tea.MeshRenderer);
		this.camera = this.cameraObject.getComponent(Tea.Camera);
		this.camera.farClipPlane = 2000;
		this.camera.backgroundColor.set(0.5, 0.5, 0.5, 1.0);
		movement.sceneRenderer = this;
	}

	protected update(): void {
		var children = this.scene.children;
		var childCount = children.length;
		for (var i = childCount - 1; i >= 0 ; i--) {
			this.updateObject3D(children[i]);
		}
		childCount = children.length;
		for (var i = childCount - 1; i >= 0 ; i--) {
			this.lateUpdateObject3D(children[i]);
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
			this.collider.object3d.update();
			this.collider.setObject(object3d);
			this.frustumPlanes.object3d.update();
			this.frustumPlanes.setCamera(object3d);
			this.lightRange.object3d.update();
			this.lightRange.setLight(object3d);
			this.objectBounds.object3d.update();
			this.objectBounds.setObject(object3d);
		} else {
			this.collider.clearLines();
			this.frustumPlanes.clearLines();
			this.lightRange.clearLines();
			this.objectBounds.clearLines();
		}
		this.outline.setObject(object3d, this.camera);
	}

	protected frustumCulling(renderer: Tea.Renderer, planes: Array<Tea.Plane>): boolean {
		if (planes == null) {
			return false;
		}
		if (renderer instanceof Tea.MeshRenderer) {
			return !Tea.GeometryUtil.testPlanesAABB(planes, renderer.bounds);
		}
		return false;
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

	protected lateUpdateObject3D(object3d: Tea.Object3D): void {
		if (object3d == null || object3d.enabled === false) {
			return;
		}
		object3d.sendMessage("lateUpdate");
		var children = object3d.children;
		var length = children.length;
		for (var i = 0; i < length; i++) {
			this.lateUpdateObject3D(children[i]);
		}
	}
}
