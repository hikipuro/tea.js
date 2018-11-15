import * as Tea from "../Tea";
import { SceneRenderer } from "./SceneRenderer";
import { EventDispatcher } from "../utils/EventDispatcher";

class SceneComponents {
	mainCamera: Tea.Camera;
	cameras: Array<Tea.Camera>;
	renderers: Array<Tea.Renderer>;
	lights: Array<Tea.Light>;
	protected _cameras: Array<Tea.Camera>;
	protected _renderers: Array<Tea.Renderer>;
	protected _lights: Array<Tea.Light>;

	constructor() {
		this.mainCamera = null;
		this.cameras = [];
		this.renderers = [];
		this.lights = [];
		this._cameras = [];
		this._renderers = [];
		this._lights = [];
	}

	get availableCameras(): Array<Tea.Camera> {
		var cameras = this._cameras;
		cameras.splice(0, cameras.length);
		var length = this.cameras.length;
		for (var i = 0; i < length; i++) {
			var camera = this.cameras[i];
			if (camera.enabled === false) {
				continue;
			}
			if (camera.object3d.isActiveInHierarchy === false) {
				continue;
			}
			cameras.push(camera);
		}
		return cameras;
	}

	get availableRenderers(): Array<Tea.Renderer> {
		var renderers = this._renderers;
		renderers.splice(0, renderers.length);
		var length = this.renderers.length;
		for (var i = 0; i < length; i++) {
			var renderer = this.renderers[i];
			if (renderer.enabled === false) {
				continue;
			}
			if (renderer.object3d.isActiveInHierarchy === false) {
				continue;
			}
			renderers.push(renderer);
		}
		return renderers;
	}

	get availableLights(): Array<Tea.Light> {
		var lights = this._lights;
		lights.splice(0, lights.length);
		var length = this.lights.length;
		for (var i = 0; i < length; i++) {
			var light = this.lights[i];
			if (light.enabled === false) {
				continue;
			}
			if (light.object3d.isActiveInHierarchy === false) {
				continue;
			}
			lights.push(light);
		}
		return lights;
	}

	destroy(): void {
		this.mainCamera = undefined;
		this.cameras = undefined;
		this.renderers = undefined;
		this.lights = undefined;
		this._cameras = undefined;
		this._renderers = undefined;
		this._lights = undefined;
	}

	add(object3d: Tea.Object3D): void {
		if (object3d == null) {
			return;
		}
		this.addCameras(
			object3d.getComponents(Tea.Camera)
		);
		this.addRenderers(
			object3d.getComponents(Tea.Renderer)
		);
		this.addLights(
			object3d.getComponents(Tea.Light)
		);
		this.updateMainCamera();
	}

	remove(object3d: Tea.Object3D): void {
		if (object3d == null) {
			return;
		}
		this.removeCameras(
			object3d.getComponents(Tea.Camera)
		);
		this.removeRenderers(
			object3d.getComponents(Tea.Renderer)
		);
		this.removeLights(
			object3d.getComponents(Tea.Light)
		);
		if (this.mainCamera != null) {
			if (this.cameras.indexOf(this.mainCamera) < 0) {
				this.mainCamera = null;
			}
		}
		this.updateMainCamera();
	}

	addComponent(component: Tea.Component): void {
		if (component instanceof Tea.Camera) {
			this.addCameras([component]);
			return;
		}
		if (component instanceof Tea.Renderer) {
			this.addRenderers([component]);
			return;
		}
		if (component instanceof Tea.Light) {
			this.addLights([component]);
			return;
		}
	}

	removeComponent(component: Tea.Component): void {
		if (component instanceof Tea.Camera) {
			this.removeCameras([component]);
			return;
		}
		if (component instanceof Tea.Renderer) {
			this.removeRenderers([component]);
			return;
		}
		if (component instanceof Tea.Light) {
			this.removeLights([component]);
			return;
		}
	}

	addCameras(cameras: Array<Tea.Camera>): void {
		if (cameras == null || cameras.length <= 0) {
			return;
		}
		var length = cameras.length;
		for (var i = 0; i < length; i++) {
			var camera = cameras[i];
			if (this.cameras.indexOf(camera) < 0) {
				this.cameras.push(camera);
			}
		}
		if (length > 0) {
			this.sortCameras();
		}
	}

	addRenderers(renderers: Array<Tea.Renderer>): void {
		if (renderers == null || renderers.length <= 0) {
			return;
		}
		var length = renderers.length;
		for (var i = 0; i < length; i++) {
			var renderer = renderers[i];
			if (this.renderers.indexOf(renderer) < 0) {
				this.renderers.push(renderer);
			}
		}
		if (length > 0) {
			this.sortRenderers();
		}
	}

	addLights(lights: Array<Tea.Light>): void {
		if (lights == null || lights.length <= 0) {
			return;
		}
		var length = lights.length;
		for (var i = 0; i < length; i++) {
			var light = lights[i];
			if (this.lights.indexOf(light) < 0) {
				this.lights.push(light);
			}
		}
	}

	removeCameras(cameras: Array<Tea.Camera>): void {
		if (cameras == null || cameras.length <= 0) {
			return;
		}
		var length = cameras.length;
		for (var i = 0; i < length; i++) {
			var camera = cameras[i];
			var index = this.cameras.indexOf(camera);
			if (index >= 0) {
				this.cameras.splice(index, 1);
			}
		}
	}

	removeRenderers(renderers: Array<Tea.Renderer>): void {
		if (renderers == null || renderers.length <= 0) {
			return;
		}
		var length = renderers.length;
		for (var i = 0; i < length; i++) {
			var renderer = renderers[i];
			var index = this.renderers.indexOf(renderer);
			if (index >= 0) {
				this.renderers.splice(index, 1);
			}
		}
	}

	removeLights(lights: Array<Tea.Light>): void {
		if (lights == null || lights.length <= 0) {
			return;
		}
		var length = lights.length;
		for (var i = 0; i < length; i++) {
			var light = lights[i];
			var index = this.lights.indexOf(light);
			if (index >= 0) {
				this.lights.splice(index, 1);
			}
		}
	}

	updateMainCamera(): void {
		if (this.mainCamera != null) {
			return;
		}
		if (this.cameras.length <= 0) {
			return;
		}
		var cameras = this.cameras;
		var length = cameras.length;
		for (var i = 0; i < length; i++) {
			var camera = cameras[i];
			if (camera.constructor.name !== "Camera") {
				continue;
			}
			this.mainCamera = camera;
		}
	}

	sortCameras(): void {
		this.cameras = this.cameras.sort((a, b) => {
			var at = a.targetTexture ? 1000 : 0;
			var bt = b.targetTexture ? 1000 : 0;
			at -= a.depth;
			bt -= b.depth;
			return bt - at;
		});
	}

	sortRenderers(): void {
		this.renderers = this.renderers.sort((a, b) => {
			var renderQueueA = a.material.renderQueue;
			var renderQueueB = b.material.renderQueue;
			return renderQueueA - renderQueueB;
		});
	}
}

export class Scene extends EventDispatcher {
	app: Tea.App;
	renderSettings: Tea.RenderSettings;
	physics: Tea.Physics;
	enablePostProcessing: boolean;
	renderTexture: Tea.RenderTexture;
	postProcessingRenderer: Tea.PostProcessingRenderer;
	protected _isEditing: boolean;
	protected _isCleared: boolean;
	protected _children: Array<Tea.Object3D>;
	protected _components: SceneComponents;
	protected _sceneRenderer: SceneRenderer;
	protected _stats: Tea.Stats;

	constructor(app: Tea.App) {
		super();
		this.app = app;
		this.renderSettings = new Tea.RenderSettings(app);
		this.physics = new Tea.Physics();
		this.enablePostProcessing = false;
		this.refreshRenderTexture();
		this.postProcessingRenderer = new Tea.PostProcessingRenderer(app);
		this._isEditing = false;
		this._isCleared = false;
		this._children = [];
		this._components = new SceneComponents();
		this._sceneRenderer = new SceneRenderer(this);
		this._stats = new Tea.Stats(app);
		var shader = this.app.createShader(
			Tea.ShaderSources.antialiasPostProcessingVS,
			Tea.ShaderSources.antialiasPostProcessingFS
		);
		this.postProcessingRenderer.material.shader = shader;
		this.app.renderer.on("resize", Tea.debounce(this.onResize, 30));
	}

	get isEditing(): boolean {
		return this._isEditing;
	}

	get children(): Array<Tea.Object3D> {
		return this._children;
	}

	get mainCamera(): Tea.Camera {
		return this._components.mainCamera;
	}

	get availableCameras(): Array<Tea.Camera> {
		return this._components.availableCameras;
	}

	get availableLights(): Array<Tea.Light> {
		return this._components.availableLights;
	}

	destroy(): void {
		this.app.renderer.off("resize", this.onResize);
		var children = this.children;
		var length = children.length;
		for (var i = length - 1; i >= 0 ; i--) {
			var child = this._children[i];
			child.destroy();
			child.update();
		}
		children = undefined;
		length = undefined;
		this.app = undefined;
		this.renderSettings = undefined;
		this.physics = undefined;
		this.enablePostProcessing = undefined;
		this._isEditing = undefined;
		if (this.renderTexture) {
			this.renderTexture.destroy();
			this.renderTexture = undefined;
		}
		if (this.postProcessingRenderer) {
			this.postProcessingRenderer.destroy();
			this.postProcessingRenderer = undefined;
		}
		this._isCleared = undefined;
		this._children = undefined;
		this._components.destroy();
		this._components = undefined;
	}

	childIndex(object3d: Tea.Object3D): number {
		return this._children.indexOf(object3d);
	}

	addChild(object3d: Tea.Object3D): void {
		if (object3d == null) {
			return;
		}
		if (this.childIndex(object3d) >= 0) {
			return;
		}
		object3d.parent = null;
		object3d.scene = this;
		this._components.add(object3d);
		this.children.unshift(object3d);
		var children = object3d.children;
		var length = children.length;
		for (var i = 0; i < length; i++) {
			var child = children[i];
			if (child == null) {
				continue;
			}
			child.scene = this;
			this._components.add(child);
		}
		this.emit("addChild");
	}

	removeChild(object3d: Tea.Object3D): void {
		if (object3d == null) {
			return;
		}
		var index = this.childIndex(object3d);
		if (index < 0) {
			return;
		}
		object3d.scene = null;
		this._components.remove(object3d);
		this.children.splice(index, 1);
		var children = object3d.children;
		var length = children.length;
		for (var i = 0; i < length; i++) {
			var child = children[i];
			if (child == null) {
				continue;
			}
			child.scene = null;
			this._components.remove(child);
		}
		this.emit("removeChild");
	}

	swapChildren(child1: Tea.Object3D, child2: Tea.Object3D): void {
		if (child1 == null || child2 == null) {
			return;
		}
		var children = this.children;
		var index1 = children.indexOf(child1);
		var index2 = children.indexOf(child2);
		if (index1 < 0 || index2 < 0) {
			return;
		}
		var temp = children[index1];
		children[index1] = children[index2];
		children[index2] = temp;
	}

	moveChild(child: Tea.Object3D, target: Tea.Object3D, before: boolean = true): void {
		if (child == null || target == null) {
			return;
		}
		if (child.parent == null && target.parent == null) {
			var children = this.children;
			var index1 = children.indexOf(child);
			var index2 = children.indexOf(target);
			if (index1 < 0 || index2 < 0) {
				return;
			}
			var temp = children[index1];
			children.splice(index1, 1);
			index2 = children.indexOf(target);
			if (before) {
				index2++;
			}
			children.splice(index2, 0, temp);
		} else if (child.parent == target.parent) {
			var children = child.parent.children;
			var index1 = children.indexOf(child);
			var index2 = children.indexOf(target);
			if (index1 < 0 || index2 < 0) {
				return;
			}
			var temp = children[index1];
			children.splice(index1, 1);
			index2 = children.indexOf(target);
			if (before == false) {
				index2++;
			}
			children.splice(index2, 0, temp);
		} else {
			if (target.parent == null) {
				this.addChild(child);
				this.moveChild(child, target, before);
				return;
			}
			child.parent = target.parent;
			var children = child.parent.children;
			var index1 = children.indexOf(child);
			var index2 = children.indexOf(target);
			if (index1 < 0 || index2 < 0) {
				return;
			}
			var temp = children[index1];
			children.splice(index1, 1);
			index2 = children.indexOf(target);
			if (before == false) {
				index2++;
			}
			children.splice(index2, 0, temp);
		}
	}

	findChildById(id: number): Tea.Object3D {
		var find = (object3d: Tea.Object3D) => {
			if (object3d.id === id) {
				return object3d;
			}
			var length = object3d.children.length;
			for (var i = 0; i < length; i++) {
				var child = object3d.children[i];
				var found = find(child);
				if (found) {
					return found;
				}
			}
			return null;
		};
		var length = this.children.length;
		for (var i = 0; i < length; i++) {
			var child = this.children[i];
			var found = find(child);
			if (found) {
				return found;
			}
		}
		return null;
	}

	findChildByName(name: string): Tea.Object3D {
		var length = this.children.length;
		for (var i = 0; i < length; i++) {
			var child = this.children[i];
			if (child.name === name) {
				return child;
			}
			var child2 = child.children.find((child) => {
				return child.name === name;
			});
			if (child2 != null) {
				return child2;
			}
		}
		return null;
	}

	addComponent(component: Tea.Component): void {
		if (component == null) {
			return;
		}
		this._components.addComponent(component);
	}

	removeComponent(component: Tea.Component): void {
		if (component == null) {
			return;
		}
		this._components.removeComponent(component);
	}

	addComponents(object3d: Tea.Object3D): void {
		if (object3d == null) {
			return;
		}
		this._components.add(object3d);
	}

	removeComponents(object3d: Tea.Object3D): void {
		if (object3d == null) {
			return;
		}
		this._components.remove(object3d);
	}

	update(isEditing: boolean = false): void {
		if (this.app == null) {
			return;
		}
		this._isEditing = isEditing;
		var children = this.children;
		var childCount = children.length;
		for (var i = childCount - 1; i >= 0 ; i--) {
			this.updateObject3D(children[i]);
		}
		childCount = children.length;
		for (var i = childCount - 1; i >= 0; i--) {
			this.lateUpdateObject3D(children[i]);
		}

		this._components.sortCameras();
		this._components.sortRenderers();
		var cameras = this._components.availableCameras;
		var renderers = this._components.availableRenderers;
		var lights = this._components.availableLights;

		if (this.enablePostProcessing) {
			var texture = this.renderTexture;
			this.postProcessingRenderer.renderTexture = texture;
			texture.bindFramebuffer();
			//this.postProcessingRenderer.clear();
		}
		Tea.Renderer.drawCallCount = 0;
		var cameraCount = cameras.length;
		var rendererCount = renderers.length;
		var haveNormalCamera = false;
		var light = false;
		for (var n = 0; n < cameraCount; n++) {
			var camera = cameras[n];
			if (haveNormalCamera === false && camera.constructor.name === "Camera") {
				haveNormalCamera = true;
			}
			var renderTexture = camera.targetTexture;
			if (renderTexture != null) {
				renderTexture.bindFramebuffer();
				//this.app.gl.scissor(0.0, 0.0, this.renderTexture.width, this.renderTexture.height);
				//this.app.gl.viewport(0.0, 0.0, this.renderTexture.width, this.renderTexture.height);
			} else if (this.enablePostProcessing) {
				this.renderTexture.bindFramebuffer();
			}
			if (camera.enableStereo) {
				camera.updateLeft();
				for (var i = 0; i < rendererCount; i++) {
					var renderer = renderers[i];
					this.renderCamera(camera, lights, renderer);
				}
				camera.updateRight();
				for (var i = 0; i < rendererCount; i++) {
					var renderer = renderers[i];
					this.renderCamera(camera, lights, renderer);
				}
			} else {
				camera.update();
				for (var i = 0; i < rendererCount; i++) {
					var renderer = renderers[i];
					//if (renderer.object3d.isActiveInHierarchy === false) {
					//	continue;
					//}
					/*
					if (camera.orthographic === false
					&& this.frustumCulling(renderer, camera.frustumPlanes)) {
						continue;
					}
					//*/
					this.renderCamera(camera, lights, renderer);
				}
			}
			if (renderTexture != null) {
				renderTexture.unbindFramebuffer();
			}
		}

		if (this.enablePostProcessing) {
			this.renderTexture.unbindFramebuffer();
			if (haveNormalCamera) {
				this.postProcessingRenderer.render();
			}
		}
		if (haveNormalCamera && this._stats.enabled) {
			var app = this.app;
			var gl = this.app.gl;
			gl.viewport(0, 0, app.width, app.height);
			gl.scissor(0, 0, app.width, app.height);
			app.status.viewport.set(0, 0, app.width, app.height);
			this._stats.update();
			this._stats.renderer.render2d();
		}
		if (haveNormalCamera) {
			this._isCleared = false;
			var rendererCount = renderers.length;
			for (var i = 0; i < rendererCount; i++) {
				renderers[i].material.setTexture("_ShadowTex", null);
			}
		} else {
			if (this._isCleared === false) {
				this.clear();
				this._isCleared = true;
			}
		}
		//this._renderers.length = 0;
		//console.log("drawCallCount", Tea.Renderer.drawCallCount);
	}

	updateScene(isEditing: boolean = false): void {
		if (this.app == null) {
			return;
		}
		this._isEditing = isEditing;
		this._components.sortRenderers();
		var renderers = this._components.availableRenderers;
		var lights = this._components.availableLights;
		this._sceneRenderer.render(renderers, lights);
	}

	static fromJSON(app: Tea.App, json: any): Scene {
		if (json == null || json._type !== "Scene") {
			return null;
		}
		var scene = new Scene(app);
		scene.physics = Tea.Physics.fromJSON(app, json.physics);
		scene.renderSettings = Tea.RenderSettings.fromJSON(app, json.renderSettings);
		scene.enablePostProcessing = json.enablePostProcessing;
		var length = json.children.length;
		for (var i = 0; i < length; i++) {
			var child = json.children[i];
			var object3d = Tea.Object3D.fromJSON(app, child);
			scene.addChild(object3d);
		}
		return scene;
	}

	toJSON(): Object {
		var json = {
			_type: "Scene",
			physics: this.physics.toJSON(),
			renderSettings: this.renderSettings.toJSON(),
			enablePostProcessing: this.enablePostProcessing,
			children: []
		};
		var children = this.children;
		var length = children.length;
		for (var i = length; i >= 0; i--) {
			var child = children[i];
			if (child == null) {
				continue;
			}
			json.children.push(child.toJSON());
		}
		return json;
	}

	lockViewToSelected(object3d: Tea.Object3D): void {
		if (object3d == null) {
			return;
		}
		if (this.app.isSceneView === false) {
			return;
		}
		this._sceneRenderer.lockViewToSelected(object3d);
	}

	protected updateObject3D(object3d: Tea.Object3D): void {
		if (object3d == null || object3d.id == null) {
			return;
		}
		object3d.update(this._isEditing);
		var children = object3d.children;
		var length = children.length;
		for (var i = 0; i < length; i++) {
			this.updateObject3D(children[i]);
		}
	}

	protected lateUpdateObject3D(object3d: Tea.Object3D): void {
		if (object3d == null || object3d.isActive === false) {
			return;
		}
		object3d.sendMessage("lateUpdate");
		var children = object3d.children;
		var length = children.length;
		for (var i = 0; i < length; i++) {
			this.lateUpdateObject3D(children[i]);
		}
	}

	protected renderCamera(camera: Tea.Camera, lights: Array<Tea.Light>, renderer: Tea.Renderer): void {
		var renderTexture = camera.targetTexture;
		if (renderTexture != null) {
			if (renderer.material.mainTexture === renderTexture) {
				return;
			}
		}
		if (camera instanceof Tea.ShadowMapCamera) {
			this.renderShadowMapCamera(camera, lights, renderer);
			return;
		}
		//if (this.enablePostProcessing) {
		//	this.renderTexture.bindFramebuffer();
		//}
		renderer.render(camera, lights, this.renderSettings);
		//if (this.enablePostProcessing) {
		//	this.renderTexture.unbindFramebuffer();
		//}
	}

	protected renderShadowMapCamera(camera: Tea.ShadowMapCamera, lights: Array<Tea.Light>, renderer: Tea.Renderer): void {
		if (renderer.object3d == null) {
			return;
		}
		var shader = renderer.material.shader;
		renderer.material.shader = camera.shader;
		//console.log(renderer.object3d.name);

		if (renderer instanceof Tea.MeshRenderer) {
			renderer.updateAttributes();
			renderer.render(camera, lights, this.renderSettings);
			if (renderer.receiveShadows) {
				renderer.material.setTexture("_ShadowTex", camera.targetTexture);
				//renderer.material.setTextureOffset("_ShadowTex", new Tea.Vector2(0, 0));
				//renderer.material.setTextureScale("_ShadowTex", new Tea.Vector2(1, 1));
		
				//var tMatrix = Tea.Matrix4x4.identity.clone();
				//tMatrix[0] = tMatrix[5] = 0.5; // scale
				//tMatrix[12] = tMatrix[13] = 0.5; // translate
		
				//var model = renderer.object3d.localToWorldMatrix;
				//var model = camera.object3d.localToWorldMatrix;
				var vpMatrix = camera.viewProjectionMatrix;
				//var mvpMatrix = vpMatrix.mul(model);
				//mvpMatrix = tMatrix.mul(mvpMatrix);
				renderer.material.setMatrix("_LightCamera", vpMatrix);
				//renderer.material.setMatrix("tMatrix", tMatrix.mul(vpMatrix));
				renderer.material.setInt("receiveShadows", 1);
			} else {
				renderer.material.setTexture("_ShadowTex", null);
				renderer.material.setInt("receiveShadows", 0);
			}
			renderer.material.shader = shader;
			renderer.updateAttributes();
		} else {
			renderer.render(camera, lights, this.renderSettings);
			renderer.material.shader = shader;
		}
	}

	protected clear(): void {
		var gl = this.app.gl;
		var color = Tea.Color.black;
		if (Tea.Camera.currentBGColor.equals(color) === false) {
			gl.clearColor(color[0], color[1], color[2], color[3]);
			Tea.Camera.currentBGColor.copy(color);
		}
		gl.viewport(0, 0, this.app.width, this.app.height);
		gl.scissor(0, 0, this.app.width, this.app.height);
		gl.clear(
			gl.COLOR_BUFFER_BIT |
			gl.DEPTH_BUFFER_BIT |
			gl.STENCIL_BUFFER_BIT
		);
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

	protected refreshRenderTexture(): void {
		var app = this.app;
		//console.log("resize scene", app.width, app.height);
		var width = Math.floor(app.width);
		var height = Math.floor(app.height);
		this.renderTexture = new Tea.RenderTexture(
			app, width, height
		);
		//this.renderTexture.filterMode = Tea.FilterMode.Bilinear;
		//this.renderTexture.wrapMode = Tea.TextureWrapMode.Mirror;
	}

	protected onResize = () => {
		this.renderTexture.destroy();
		this.refreshRenderTexture();
	}
}
