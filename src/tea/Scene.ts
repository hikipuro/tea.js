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
			const child = children[i];
			if (child.enabled === false) {
				continue;
			}
			child.update();
			if (child.renderer != null) {
				child.renderer.render(this.camera);
			}
		}
	}

	protected start(): void {
		const children = this.children;
		const length = this.children.length;
		for (let i = 0; i < length; i++) {
			children[i].start();
		}
	}
}
