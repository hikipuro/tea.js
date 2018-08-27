import * as Tea from "./Tea";

export class Scene {
	app: Tea.App;
	camera: Tea.Camera;
	protected _children: Array<Tea.Object3D>;
	protected _firstTime: boolean;
	protected _renderers: Array<Tea.Renderer>;

	constructor(app: Tea.App) {
		this.app = app;
		this.camera = new Tea.Camera(app);
		this._children = [];
		this._firstTime = true;
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
	}

	update(): void {
		if (this.camera != null) {
			this.camera.update();
		}

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
		Tea.ArrayUtil.each(renderers, (i, renderer) => {
			renderer.render(this.camera);
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
		if (renderer != null && this.camera != null) {
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
}
