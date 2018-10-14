import * as Tea from "../Tea";

class SceneComponents {
	mainCamera: Tea.Camera;
	cameras: Array<Tea.Camera>;
	renderers: Array<Tea.Renderer>;
	lights: Array<Tea.Light>;

	constructor() {
		this.mainCamera = null;
		this.cameras = [];
		this.renderers = [];
		this.lights = [];
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
			var at = a.targetTexture ? 1 : 0;
			var bt = b.targetTexture ? 1 : 0;
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

export class Scene {
	app: Tea.App;
	renderSettings: Tea.RenderSettings;
	physics: Tea.Physics;
	enablePostProcessing: boolean;
	renderTexture: Tea.RenderTexture;
	postProcessingRenderer: Tea.PostProcessingRenderer;
	protected _children: Array<Tea.Object3D>;
	protected _components: SceneComponents;

	constructor(app: Tea.App) {
		this.app = app;
		this.renderSettings = new Tea.RenderSettings(app);
		this.physics = new Tea.Physics();
		this.enablePostProcessing = false;
		this.refreshRenderTexture();
		this.postProcessingRenderer = new Tea.PostProcessingRenderer(app);
		this._children = [];
		this._components = new SceneComponents();
		this.app.renderer.on("resize", () => {
			//console.log("resize");
			this.renderTexture.destroy();
			this.refreshRenderTexture();
		})
	}

	get children(): Array<Tea.Object3D> {
		return this._children;
	}

	get mainCamera(): Tea.Camera {
		return this._components.mainCamera;
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

	update(): void {
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
		var renderers = this._components.renderers;
		var cameras = this._components.cameras;
		var lights = this._components.lights;

		if (this.enablePostProcessing) {
			var texture = this.renderTexture;
			this.postProcessingRenderer.renderTexture = texture;
			texture.bindFramebuffer();
			this.postProcessingRenderer.clear();
		}
		Tea.Renderer.drawCallCount = 0;
		var cameraCount = cameras.length;
		for (var n = 0; n < cameraCount; n++) {
			var camera = cameras[n];
			if (camera.enabled === false) {
				continue;
			}
			if (this.enablePostProcessing) {
				this.renderTexture.bindFramebuffer();
			}
			var renderTexture = camera.targetTexture;
			if (renderTexture != null) {
				renderTexture.bindFramebuffer();
				//this.app.gl.scissor(0.0, 0.0, this.renderTexture.width, this.renderTexture.height);
				//this.app.gl.viewport(0.0, 0.0, this.renderTexture.width, this.renderTexture.height);
			}
			camera.update();
			var rendererCount = renderers.length;
			for (var i = 0; i < rendererCount; i++) {
				var renderer = renderers[i];
				if (renderer.object3d.isActiveInHierarchy === false) {
					continue;
				}
				/*
				if (camera.orthographic === false
				&& this.frustumCulling(renderer, camera.frustumPlanes)) {
					continue;
				}
				//*/
				this.renderCamera(camera, lights, renderer);
			}
			if (renderTexture != null) {
				renderTexture.unbindFramebuffer();
			}
		}
		if (this.enablePostProcessing) {
			this.renderTexture.unbindFramebuffer();
			this.postProcessingRenderer.render();
		}
		//this._renderers.length = 0;
		//console.log("drawCallCount", Tea.Renderer.drawCallCount);
	}

	static fromJSON(app: Tea.App, json: any): Scene {
		if (json == null || json._type !== "Scene") {
			return null;
		}
		var scene = new Scene(app);
		scene.physics = Tea.Physics.fromJSON(app, json.physics);
		scene.renderSettings = Tea.RenderSettings.fromJSON(app, json.renderSettings);
		return scene;
	}

	toJSON(): Object {
		var json = {
			_type: "Scene",
			physics: this.physics.toJSON(),
			renderSettings: this.renderSettings.toJSON(),
			children: []
		};
		for (var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			if (child == null) {
				continue;
			}
			json.children.push(child.toJSON());
		}
		return json;
	}

	protected updateObject3D(object3d: Tea.Object3D): void {
		if (object3d == null || object3d.isActive === false) {
			return;
		}
		object3d.update();
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
		if (this.enablePostProcessing) {
			this.renderTexture.bindFramebuffer();
		}
		if (camera.enableStereo) {
			camera.updateLeft();
			renderer.render(camera, lights, this.renderSettings);
			camera.updateRight();
			renderer.render(camera, lights, this.renderSettings);
			return;
		}
		renderer.render(camera, lights, this.renderSettings);
		if (this.enablePostProcessing) {
			this.renderTexture.unbindFramebuffer();
		}
	}

	protected renderShadowMapCamera(camera: Tea.ShadowMapCamera, lights: Array<Tea.Light>, renderer: Tea.Renderer): void {
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
		
				var tMatrix = Tea.Matrix4x4.identity.clone();
				tMatrix[0] = tMatrix[5] = 0.5; // scale
				tMatrix[12] = tMatrix[13] = 0.5; // translate
		
				var model = renderer.object3d.localToWorldMatrix;
				//var model = camera.object3d.localToWorldMatrix;
				var vpMatrix = camera.viewProjectionMatrix;
				//var mvpMatrix = vpMatrix.mul(model);
				//mvpMatrix = tMatrix.mul(mvpMatrix);
				renderer.material.setMatrix("_LightCamera", vpMatrix);
				renderer.material.setMatrix("tMatrix", tMatrix.mul(vpMatrix));
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
		this.renderTexture = new Tea.RenderTexture(app, app.width, app.height);
		//this.renderTexture.filterMode = Tea.FilterMode.Bilinear;
		//this.renderTexture.wrapMode = Tea.TextureWrapMode.Mirror;
	}
}
