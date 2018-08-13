import * as Tea from "./Tea";

export class Scene {
	app: Tea.App;
	camera: Tea.Camera;
	protected _children: Array<Tea.Object3D>;
	protected _firstTime: boolean;

	constructor(app: Tea.App) {
		this.app = app;
		this.camera = new Tea.Camera(app);
		this._children = [];
		this._firstTime = true;
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
		this.camera.update();

		if (this._firstTime) {
			this._firstTime = false;
			this.start();
		}

		const children = this.children;
		const length = this.children.length;
		for (let i = 0; i < length; i++) {
			this.updateObject3D(children[i]);
		}
	}

	protected start(): void {
		const children = this.children;
		const length = this.children.length;
		for (let i = 0; i < length; i++) {
			children[i].start();
		}
	}

	protected updateObject3D(object3d: Tea.Object3D): void {
		if (object3d == null || object3d.enabled === false) {
			return;
		}
		object3d.update();
		const renderer = object3d.getComponent(Tea.Renderer);
		if (renderer != null) {
			renderer.render(this.camera);
		}
		if (object3d.children.length > 0) {
			const children = object3d.children;
			const length = children.length;
			for (let i = 0; i < length; i++) {
				this.updateObject3D(children[i]);
			}
		}
	}
}
