import * as Tea from "./Tea";

export class Scene {
	app: Tea.App;
	camera: Tea.Camera;
	//count: number;
	protected _children: Array<Tea.Object3D>;
	protected _firstTime: boolean;

	constructor(app: Tea.App) {
		this.app = app;
		this.camera = new Tea.Camera();
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
		object3d.renderer.camera = this.camera;
		this.children.push(object3d);
	}

	update(time: number): void {
		this.clear();

		if (this._firstTime) {
			this._firstTime = false;
			this.start();
		}

		const children = this.children;
		const length = this.children.length;
		for (let i = 0; i < length; i++) {
			children[i].update();
		}

		this.flush();
	}

	clear(): void {
		const gl = this.app.gl;
		if (this.camera != null) {
			const color = this.camera.backgroundColor;
			//console.log("color2", color);
			gl.clearColor(color.r, color.g, color.b, color.a);
		}
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		// STENCIL_BUFFER_BIT
	}

	flush(): void {
		const gl = this.app.gl;
		gl.flush();
	}

	protected start(): void {
		const children = this.children;
		const length = this.children.length;
		for (let i = 0; i < length; i++) {
			children[i].start();
		}
	}
}
