import * as Tea from "../Tea";

export class Scene {
	app: Tea.App;
	mainCamera: Tea.Camera;
	renderSettings: Tea.RenderSettings;
	physics: Tea.Physics;
	protected _children: Array<Tea.Object3D>;
	protected _cameras: Array<Tea.Camera>;
	protected _renderers: Array<Tea.Renderer>;
	protected _lights: Array<Tea.Light>;

	constructor(app: Tea.App) {
		this.app = app;
		this.renderSettings = new Tea.RenderSettings(app);
		this.physics = new Tea.Physics();
		this._children = [];
		this._cameras = [];
		this._renderers = [];
		this._lights = [];
	}

	get children(): Array<Tea.Object3D> {
		return this._children;
	}

	appendChild(object3d: Tea.Object3D): void {
		if (object3d == null) {
			return;
		}
		if (this.children.indexOf(object3d) >= 0) {
			return;
		}
		object3d.scene = this;
		this.children.push(object3d);

		var cameras = object3d.getComponents(Tea.Camera);
		if (cameras.length > 0) {
			if (this.mainCamera == null) {
				this.mainCamera = cameras[0];
			}
			this._cameras.push.apply(
				this._cameras, cameras
			);
		}

		var renderers = object3d.getComponents(Tea.Renderer);
		if (renderers.length > 0) {
			this._renderers.push.apply(
				this._renderers, renderers
			);
			this._renderers = this._renderers.sort((a, b) => {
				var renderQueueA = a.material.renderQueue;
				var renderQueueB = b.material.renderQueue;
				return renderQueueA - renderQueueB;
			});
		}

		var lights = object3d.getComponents(Tea.Light);
		if (lights.length > 0) {
			this._lights.push.apply(
				this._lights, lights
			);
		}
	}

	update(): void {
		var children = this.children;
		var childCount = children.length;
		for (var i = 0; i < childCount; i++) {
			this.updateObject3D(children[i]);
		}
		for (var i = 0; i < childCount; i++) {
			this.lateUpdateObject3D(children[i]);
		}
		var renderers = this._renderers;
		var cameras = this._cameras.sort((a, b) => {
			var at = a.targetTexture ? 1 : 0;
			var bt = b.targetTexture ? 1 : 0;
			return bt - at;
		});

		Tea.Renderer.drawCallCount = 0;
		var cameraCount = cameras.length;
		for (var n = 0; n < cameraCount; n++) {
			var camera = cameras[n];
			var renderTexture = camera.targetTexture;
			if (renderTexture != null) {
				renderTexture.bind();
			}
			camera.update();
			var rendererCount = renderers.length;
			for (var i = 0; i < rendererCount; i++) {
				var renderer = renderers[i];
				//if (this.frustumCulling(renderer, camera.frustumPlanes)) {
					//continue;
				//}
				this.renderCamera(camera, this._lights, renderer);
			}
			if (renderTexture != null) {
				renderTexture.unbind();
			}
		}
		//this._renderers.length = 0;
		//console.log("drawCallCount", Tea.Renderer.drawCallCount);
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
		if (camera instanceof Tea.LightCamera) {
			this.renderLightCamera(camera, lights, renderer);
			return;
		}
		if (camera.enableStereo) {
			camera.updateLeft();
			renderer.render(camera, lights, this.renderSettings);
			camera.updateRight();
			renderer.render(camera, lights, this.renderSettings);
			return;
		}
		renderer.render(camera, lights, this.renderSettings);
	}

	protected renderLightCamera(camera: Tea.LightCamera, lights: Array<Tea.Light>, renderer: Tea.Renderer): void {
		var shader = renderer.material.shader;
		renderer.material.shader = camera.shader;

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
				var mvpMatrix = vpMatrix.mul(model);
				//mvpMatrix = tMatrix.mul(mvpMatrix);
				renderer.material.setMatrix("_LightCamera", vpMatrix);
				renderer.material.setMatrix("tMatrix", tMatrix.mul(vpMatrix));
				renderer.material.setInt("receiveShadows", 1);
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
}
