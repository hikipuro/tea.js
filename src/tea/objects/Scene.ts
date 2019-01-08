import * as Tea from "../Tea";
import { EventDispatcher } from "../utils/EventDispatcher";
import { SceneRenderer } from "./SceneRenderer";
import { SceneComponents } from "./SceneComponents";

export class Scene extends EventDispatcher {
	static readonly className: string = "Scene";
	app: Tea.App;
	renderSettings: Tea.RenderSettings;
	physics: Tea.Physics;
	enablePostProcessing: boolean;
	renderTexture: Tea.RenderTexture;
	postProcessingRenderer: Tea.PostProcessingRenderer;
	sceneRenderer: SceneRenderer;
	stats: Tea.Stats;
	protected _isEditing: boolean;
	protected _isCleared: boolean;
	protected _children: Array<Tea.Object3D>;
	protected _components: SceneComponents;

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
		var shader = this.app.createShader(
			Tea.ShaderSources.antialiasPostProcessingVS,
			Tea.ShaderSources.antialiasPostProcessingFS
		);
		this.postProcessingRenderer.material.shader = shader;
		this.app.renderer.on("resize", Tea.debounce(this.onResize, 50));
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
		var setSceneToChildren = (children: Array<Tea.Object3D>) => {
			if (children == null || children.length <= 0) {
				return;
			}
			var length = children.length;
			for (var i = 0; i < length; i++) {
				var child = children[i];
				if (child == null) {
					continue;
				}
				child.scene = this;
				this._components.add(child);
				setSceneToChildren(child.children);
			}
		};
		setSceneToChildren(object3d.children);
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
		var removeSceneFromChildren = (children: Array<Tea.Object3D>) => {
			if (children == null || children.length <= 0) {
				return;
			}
			var length = children.length;
			for (var i = 0; i < length; i++) {
				var child = children[i];
				if (child == null) {
					continue;
				}
				child.scene = null;
				this._components.remove(child);
				removeSceneFromChildren(child.children);
			}
		};
		removeSceneFromChildren(object3d.children);
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
		if (name == null || name === "") {
			return null;
		}
		var children = this.children;
		var length = children.length;
		for (var i = 0; i < length; i++) {
			var child = children[i];
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

	findChild(path: string): Tea.Object3D {
		if (path == null || path === "") {
			return null;
		}
		var paths = path.split("/");
		var name = paths[0];
		var child: Tea.Object3D = null;
		var children = this.children;
		var length = children.length;
		for (var i = 0; i < length; i++) {
			if (children[i].name === name) {
				child = children[i];
				break;
			}
		}
		if (child == null) {
			return null;
		}
		length = paths.length;
		for (var i = 1; i < length; i++) {
			child = child.find(paths[i]);
			if (child == null) {
				return null;
			}
		}
		return child;
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

		var canvasRenderers = [];
		for (var i = renderers.length - 1; i >= 0; i--) {
			var renderer = renderers[i];
			if (renderer instanceof Tea.CanvasRenderer) {
				renderers.splice(i, 1);
				canvasRenderers.push(renderer);
			}
		}

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
					if (this.frustumCulling(renderer, camera.frustumPlanes)) {
						continue;
					}
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
		if (canvasRenderers.length >= 1) {
			var app = this.app;
			this.app.status.setViewport(
				0.0, 0.0, app.width, app.height
			);
			var length = canvasRenderers.length;
			for (var i = 0; i < length; i++) {
				canvasRenderers[i].render(null, null, null);
			}
		}
		if (haveNormalCamera && this.stats && this.stats.enabled) {
			var app = this.app;
			this.app.status.setViewport(
				0.0, 0.0, app.width, app.height
			);
			this.stats.update();
			this.stats.renderer.render2d();
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
		this.sceneRenderer.render(renderers, lights);
	}

	/*
	static fromJSON(app: Tea.App, json: any): Scene {
		if (json == null || json[Tea.JSONUtil.TypeName] !== "Scene") {
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
	//*/

	toJSON(): Object {
		var json = Tea.JSONUtil.createSceneJSON(Scene.className);
		json.physics = this.physics.toJSON();
		json.renderSettings = this.renderSettings.toJSON();
		json.enablePostProcessing = this.enablePostProcessing;
		json.children = [];
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
		this.sceneRenderer.lockViewToSelected(object3d);
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
			//renderer.updateAttributes();
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
			//renderer.updateAttributes();
		} else {
			renderer.render(camera, lights, this.renderSettings);
			renderer.material.shader = shader;
		}
	}

	protected clear(): void {
		var app = this.app;
		var gl = app.gl;
		var color = Tea.Color.black;
		this.app.status.setClearColor(color);
		this.app.status.setViewport(
			0.0, 0.0, app.width, app.height
		);
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
		if (this.renderTexture) {
			this.renderTexture.destroy();
		}
		this.refreshRenderTexture();
	}
}
