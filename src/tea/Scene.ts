import * as Tea from "./Tea";

export class Scene {
	app: Tea.App;
	mainCamera: Tea.Camera;
	protected _children: Array<Tea.Object3D>;
	protected _firstTime: boolean;
	protected _cameras: Array<Tea.Camera>;
	protected _renderers: Array<Tea.Renderer>;

	constructor(app: Tea.App) {
		this.app = app;
		this._children = [];
		this._firstTime = true;
		this._cameras = [];
		this._renderers = [];
	}

	get children(): Array<Tea.Object3D> {
		return this._children;
	}

	appendChild(object3d: Tea.Object3D): void {
		if (object3d == null) {
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
	}

	update(): void {
		if (this._firstTime) {
			this._firstTime = false;
			this.start();
		}

		Tea.ArrayUtil.each(this.children, (i, child) => {
			this.updateObject3D(child);
		});
		var renderers = this._renderers.sort((a, b) => {
			var renderQueueA = a.material.renderQueue;
			var renderQueueB = b.material.renderQueue;
			return renderQueueA - renderQueueB;
		});
		var cameras = this._cameras.sort((a, b) => {
			var at = a.targetTexture ? 1 : 0;
			var bt = b.targetTexture ? 1 : 0;
			return bt - at;
		});
		Tea.ArrayUtil.each(cameras, (_, camera) => {
			var renderTexture = camera.targetTexture;
			if (renderTexture != null) {
				renderTexture.bind();
			}
			camera.update();
			Tea.ArrayUtil.each(renderers, (_, renderer) => {
				this.renderCamera(camera, renderer);
			});
			if (renderTexture != null) {
				renderTexture.unbind();
			}
		});
		this._renderers = [];
	}

	protected start(): void {
		Tea.ArrayUtil.each(this.children, (i, child) => {
			child.start();
		});
	}

	protected updateObject3D(object3d: Tea.Object3D): void {
		if (object3d == null || object3d.isActive === false) {
			return;
		}
		object3d.update();
		var renderer = object3d.getComponent(Tea.Renderer);
		if (renderer != null) {
			if (renderer.material != null) {
				this._renderers.push(renderer);
			}
		}
		if (object3d.children.length > 0) {
			Tea.ArrayUtil.each(object3d.children, (i, child) => {
				this.updateObject3D(child);
			});
		}
	}

	protected renderCamera(camera: Tea.Camera, renderer: Tea.Renderer): void {
		var renderTexture = camera.targetTexture;
		if (renderTexture != null) {
			if (renderer.material.mainTexture === renderTexture) {
				return;
			}
		}
		if (camera instanceof Tea.LightCamera) {
			this.renderLightCamera(camera, renderer);
			return;
		}
		if (camera.enableStereo) {
			camera.updateLeft();
			renderer.render(camera);
			camera.updateRight();
			renderer.render(camera);
			return;
		}
		renderer.render(camera);
	}

	protected renderLightCamera(camera: Tea.LightCamera, renderer: Tea.Renderer): void {
		var shader = renderer.material.shader;
		renderer.material.shader = camera.shader;
		renderer.render(camera);

		if (renderer instanceof Tea.MeshRenderer) {
			if (renderer.receiveShadows) {
				renderer.material.setTexture("_ShadowTex", camera.targetTexture);
				//renderer.material.setTextureOffset("_ShadowTex", new Tea.Vector2(0, 0));
				//renderer.material.setTextureScale("_ShadowTex", new Tea.Vector2(1, 1));
		
				var model = renderer.object3d.localToWorldMatrix;
				var view = camera.worldToCameraMatrix;
				var projection = camera.projectionMatrix;
				var tMatrix = Tea.Matrix4x4.identity;
				tMatrix[0] = tMatrix[5] = 0.4;
				tMatrix[12] = tMatrix[13] = 0.5;
				//projection = tMatrix.mul(projection);
		
				var mvMatrix = view.mul(model);
				var vpMatrix = projection.mul(view);
				var mvpMatrix = projection.mul(mvMatrix);
				//mvpMatrix = tMatrix.mul(mvpMatrix);
				renderer.material.setMatrix("_LightCamera", mvpMatrix);
				renderer.material.setMatrix("tMatrix", tMatrix.mul(vpMatrix));
			}
		}
		renderer.material.shader = shader;
	}
}
