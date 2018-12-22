import * as Tea from "../Tea";

export class SceneComponents {
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
